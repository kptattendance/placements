import CompanyExpense from "../models/companyExpenseModel.js";
import VisitedCompany from "../models/visitedCompanyModel.js";
import Budget from "../models/budgetModel.js"; // ensure this exists

// Each approval can only be given by its own role
const APPROVAL_BY_ROLE = {
  "placement-officer": "approvedByOfficer",
  "sw-officer": "approvedBySWOfficer",
  principal: "approvedByPrincipal",
};

// Keep only what this admin is allowed to send
const pickExpenseFields = (body, admin) => {
  const fields = {};
  ["company", "otherCategory", "submittedBy", "items"].forEach((key) => {
    if (body[key] !== undefined) fields[key] = body[key];
  });

  Object.entries(APPROVAL_BY_ROLE).forEach(([role, field]) => {
    const allowed = admin?.unrestricted || admin?.role === role;
    if (allowed && typeof body[field] === "boolean") fields[field] = body[field];
  });

  return fields;
};

// Create expense
export const createExpense = async (req, res) => {
  try {
    // A new expense always starts unapproved
    const payload = pickExpenseFields(req.body, null);

    if (!req.body.company) {
      delete payload.company;
    }

    const expense = await CompanyExpense.create(payload);

    if (expense.company) {
      await VisitedCompany.findByIdAndUpdate(expense.company, {
        $addToSet: { expenses: expense._id },
      });
    }

    res.status(201).json(expense);
  } catch (error) {
    console.error("EXPENSE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all expenses with role-based filtering + optional flags
// ROLE-BASED EXPENSE FILTERING
export const getAllExpenses = async (req, res) => {
  try {
    const { user } = req.query;
    // Trust the signed-in admin's role, not what the browser claims
    const role = req.admin?.role || req.query.role;
    let filter = {};

    // 1️⃣ Coordinator → only their own expenses
    if (role === "placement-coordinator") {
      filter.submittedBy = user;
    }

    // 2️⃣ Officer → expenses pending officer approval
    if (role === "placement-officer") {
      filter.approvedByOfficer = false;
    }

    // 3️⃣ SW-Officer → officer approved, but SW not approved
    if (role === "sw-officer") {
      filter.approvedByOfficer = true;
      filter.approvedBySWOfficer = false;
    }

    // 4️⃣ Principal → officer + SW approved, principal not approved
    if (role === "principal") {
      filter.approvedByOfficer = true;
      filter.approvedBySWOfficer = true;
      filter.approvedByPrincipal = false;
    }

    // ⭐ FIX: SW-approved list must be filtered correctly
    if (req.query.approvedBySWOfficer === "true") {
      filter.approvedBySWOfficer = true;
      filter.approvedByOfficer = true; // <-- IMPORTANT FIX
    }

    const data = await CompanyExpense.find(filter)
      .populate("company", "companyName location visitDate")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update / Approve / Partial update
export const updateExpense = async (req, res) => {
  try {
    const expense = await CompanyExpense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    // keep previous SW flag to detect transitions
    const prevApprovedBySW = expense.approvedBySWOfficer === true;
    const prevTotalAmount = expense.totalAmount || 0;

    const updates = pickExpenseFields(req.body, req.admin);

    // If company changed, remove old relation (we'll re-add later if necessary)
    if (req.body.company && req.body.company !== expense.company?.toString()) {
      if (expense.company) {
        await VisitedCompany.findByIdAndUpdate(expense.company, {
          $pull: { expenses: expense._id },
        });
      }
    }

    // Apply incoming fields to expense
    Object.assign(expense, updates);
    await expense.save(); // runs pre("save") hook to update totalAmount & status

    // Add to new company
    if (expense.company) {
      await VisitedCompany.findByIdAndUpdate(expense.company, {
        $addToSet: { expenses: expense._id },
      });
    }

    // ===== Budget adjustment logic =====
    // Only when SW-officer approves (transition from false -> true) we deduct budget.
    // Also handle revert: if someone sets approvedBySWOfficer from true -> false and _swUsed was true, refund.
    const budget = await Budget.findOne();

    // 1) SW approval granted now (and wasn't earlier)
    if (updates.approvedBySWOfficer === true && !prevApprovedBySW) {
      // if not already counted
      if (!expense._swUsed) {
        if (budget) {
          budget.totalUsed = Number(budget.totalUsed || 0) + Number(expense.totalAmount || 0);
          budget.remaining = Number(budget.totalBudget || 0) - Number(budget.totalUsed || 0);
          await budget.save();
        }
        expense._swUsed = true;
        await expense.save();
      }
    }

    // 2) SW approval reverted (was true, now false) -> rollback budget if it was applied
    if (updates.approvedBySWOfficer === false && prevApprovedBySW) {
      if (expense._swUsed && budget) {
        budget.totalUsed = Number(budget.totalUsed || 0) - Number(expense.totalAmount || 0);
        if (budget.totalUsed < 0) budget.totalUsed = 0;
        budget.remaining = Number(budget.totalBudget || 0) - Number(budget.totalUsed || 0);
        await budget.save();
      }
      expense._swUsed = false;
      await expense.save();
    }

    // Edge case: if totalAmount changed after SW applied, adjust budget delta
    // (only if _swUsed true)
    if (expense._swUsed && prevTotalAmount !== expense.totalAmount && budget) {
      const delta = Number(expense.totalAmount || 0) - Number(prevTotalAmount || 0);
      budget.totalUsed = Number(budget.totalUsed || 0) + delta;
      if (budget.totalUsed < 0) budget.totalUsed = 0;
      budget.remaining = Number(budget.totalBudget || 0) - Number(budget.totalUsed || 0);
      await budget.save();
    }

    res.json(expense);
  } catch (error) {
    console.error("UPDATE EXPENSE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete expense (refund budget if needed)
export const deleteExpense = async (req, res) => {
  try {
    const deleted = await CompanyExpense.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Expense not found" });

    // remove from visited company relation
    if (deleted.company) {
      await VisitedCompany.findByIdAndUpdate(deleted.company, {
        $pull: { expenses: deleted._id },
      });
    }

    // refund budget if SW approval was already applied
    if (deleted._swUsed) {
      const budget = await Budget.findOne();
      if (budget) {
        budget.totalUsed = Number(budget.totalUsed || 0) - Number(deleted.totalAmount || 0);
        if (budget.totalUsed < 0) budget.totalUsed = 0;
        budget.remaining = Number(budget.totalBudget || 0) - Number(budget.totalUsed || 0);
        await budget.save();
      }
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("DELETE EXPENSE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
