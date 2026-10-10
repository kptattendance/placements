import Budget from "../models/budgetModel.js";

// ⭐ GET existing budget or return default 5000
export const getBudget = async (req, res) => {
  try {
    let budget = await Budget.findOne();

    if (!budget) {
      budget = await Budget.create({ totalBudget: 5000 });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ⭐ UPDATE budget only (no create, always update)
export const updateBudget = async (req, res) => {
  try {
    const totalBudget = Number(req.body.totalBudget);
    if (!Number.isFinite(totalBudget) || totalBudget < 0) {
      return res.status(400).json({ message: "Enter a valid budget amount" });
    }

    let budget = await Budget.findOne();

    if (!budget) {
      budget = await Budget.create({ totalBudget });
    } else {
      budget.totalBudget = totalBudget;
      await budget.save();
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
