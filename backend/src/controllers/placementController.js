import Placement from "../models/placementModel.js";
import { isAdminRequest } from "../middleware/requireAdmin.js";

// Only these fields may come from the admin form
const pickPlacementFields = (body) => {
  const fields = {};
  if (body.isPublic !== undefined) fields.isPublic = body.isPublic === true;
  if (Array.isArray(body.programs)) fields.programs = body.programs;
  return fields;
};

// Placement % = students placed / total student strength
const percent = (part, whole) =>
  whole > 0 ? Number(((part / whole) * 100).toFixed(2)) : 0;

// Utility: recompute totals for a placement document
// Every "Total" and "%" is derived from the male/female counts,
// so the stored numbers can never disagree with each other.
const recalcTotals = (placement) => {
  let totalStudents = 0;
  let totalPassed = 0;
  let totalPlaced = 0;
  let totalHigher = 0;
  let totalDropouts = 0;
  let totalEntrepreneurs = 0;

  placement.programs.forEach((p) => {
    // Keep a manually entered total only when no male/female split was given
    if (p.male + p.female > 0) p.total = p.male + p.female;

    p.passedTotal = p.passedMale + p.passedFemale;
    p.placedTotal = p.placedMale + p.placedFemale;
    p.higherTotal = p.higherMale + p.higherFemale;
    p.dropoutTotal = p.dropoutMale + p.dropoutFemale;

    p.percentageMale = percent(p.placedMale, p.male);
    p.percentageFemale = percent(p.placedFemale, p.female);
    p.percentageTotal = percent(p.placedTotal, p.total);

    totalStudents += p.total;
    totalPassed += p.passedTotal;
    totalPlaced += p.placedTotal;
    totalHigher += p.higherTotal;
    totalDropouts += p.dropoutTotal;
    totalEntrepreneurs += p.entrepreneurMale + p.entrepreneurFemale;
  });

  placement.totalStudents = totalStudents;
  placement.totalPassed = totalPassed;
  placement.totalPlaced = totalPlaced;
  placement.totalHigherStudies = totalHigher;
  placement.totalDropouts = totalDropouts;
  placement.totalEntrepreneurs = totalEntrepreneurs;
  placement.overallPercentage = percent(totalPlaced, totalStudents);

  return placement;
};

// ✅ CREATE new year data
export const createPlacement = async (req, res) => {
  try {
    const year = Number(req.body.year);
    if (!Number.isInteger(year) || year < 1950 || year > 2100)
      return res.status(400).json({ message: "Enter a valid year" });

    const existing = await Placement.findOne({ year });
    if (existing)
      return res
        .status(400)
        .json({
          message: `Placement record for ${year} already exists`,
        });

    let placement = new Placement({ year, ...pickPlacementFields(req.body) });
    placement = recalcTotals(placement);
    const newData = await placement.save();

    res.status(201).json(newData);
  } catch (error) {
    console.error("Error creating placement:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ READ all years
export const getAllPlacements = async (req, res) => {
  try {
    const data = await Placement.find({ isPublic: true }).sort({ year: -1 }); // 👈 FILTER
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ READ one year
export const getPlacementByYear = async (req, res) => {
  try {
    const year = Number(req.params.year);
    if (!Number.isInteger(year))
      return res.status(404).json({ message: "No data found" });

    const data = await Placement.findOne({ year });
    if (!data) return res.status(404).json({ message: "No data found" });

    // Years not yet published are visible to admins only
    if (!data.isPublic && !(await isAdminRequest(req)))
      return res.status(404).json({ message: "No data found" });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE year data (with recalculation)
export const updatePlacement = async (req, res) => {
  try {
    let placement = await Placement.findOne({ year: req.params.year });
    if (!placement)
      return res.status(404).json({ message: "Placement year not found" });

    // Merge updates
    Object.assign(placement, pickPlacementFields(req.body));
    placement = recalcTotals(placement);

    const updated = await placement.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE year entry
export const deletePlacement = async (req, res) => {
  try {
    const deleted = await Placement.findOneAndDelete({ year: req.params.year });
    if (!deleted)
      return res.status(404).json({ message: "Placement year not found" });
    res.json({ message: `Placement data for year ${req.params.year} deleted` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ ADD program to existing year
export const addProgramToYear = async (req, res) => {
  try {
    let placement = await Placement.findOne({ year: req.params.year });
    if (!placement)
      return res.status(404).json({ message: "Placement year not found" });

    placement.programs.push(req.body);
    placement = recalcTotals(placement);
    await placement.save();

    res.status(201).json(placement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE program from year
export const deleteProgramFromYear = async (req, res) => {
  try {
    let placement = await Placement.findOne({ year: req.params.year });
    if (!placement)
      return res.status(404).json({ message: "Placement year not found" });

    placement.programs = placement.programs.filter(
      (p) => p.program !== req.params.program
    );

    placement = recalcTotals(placement);
    await placement.save();

    res.json(placement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
