import VisitedCompany from "../models/visitedCompanyModel.js";
import cloudinary from "../config/cloudinary.js";

// Helper: safely convert branchList
function parseBranchList(input) {
  if (!input) return [];

  // If already array → return
  if (Array.isArray(input)) return input;

  // Clean all weird cases
  let clean = String(input)
    .replace(/[\[\]]/g, "")   // remove brackets
    .replace(/"/g, "")        // remove double quotes
    .replace(/'/g, "")        // remove single quotes
    .trim();

  if (!clean) return [];

  return clean.split(",").map((b) => b.trim()).filter((b) => b.length > 0);
}

// CREATE
export const createVisitedCompany = async (req, res) => {
  try {
    const imageData = req.file
      ? {
          url: req.file.path,
          public_id: req.file.filename,
        }
      : null;

    const branchList = parseBranchList(req.body.branchList);

    const company = await VisitedCompany.create({
      companyName: req.body.companyName,
      branchList,
      location: req.body.location,
      packageOffered: Number(req.body.packageOffered),
      visitDate: new Date(req.body.visitDate),
      studentsRecruited: Number(req.body.studentsRecruited),
      modeOfVisit: req.body.modeOfVisit,
      recruitmentType: req.body.recruitmentType,
      image: imageData,
    });

    res.status(201).json(company);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create company" });
  }
};

// READ ALL
export const getAllVisitedCompanies = async (req, res) => {
  try {
    const companies = await VisitedCompany.find()
      .select("-expenses")
      .sort({ createdAt: -1 }); // recently added first

const cleaned = companies.map((c) => ({
  ...c._doc,
  branchList: c.branchList.map((b) =>
    String(b)
      .replace(/[\[\]\\"']/g, "")  // remove brackets, quotes
      .split(",")                  // split comma joined values
      .map((x) => x.trim())        // trim spaces
  ).flat()
}));

res.json(cleaned);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch companies" });
  }
};

// READ ONE
export const getVisitedCompanyById = async (req, res) => {
  try {
    const company = await VisitedCompany.findById(req.params.id).select("-expenses");
    if (!company) return res.status(404).json({ message: "Not found" });

    const cleaned = {
      ...company._doc,
      branchList: company.branchList
        .map((b) =>
          String(b)
            .replace(/[\[\]\\"']/g, "")
            .split(",")
            .map((x) => x.trim())
        )
        .flat(),
    };

    res.json(cleaned);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch company" });
  }
};


// UPDATE
export const updateVisitedCompany = async (req, res) => {
  try {
    const company = await VisitedCompany.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Not found" });

    // Branch list
    if (req.body.branchList) {
      company.branchList = parseBranchList(req.body.branchList);
    }

    // Numbers
    if (req.body.packageOffered !== undefined)
      company.packageOffered = Number(req.body.packageOffered);

    if (req.body.studentsRecruited !== undefined)
      company.studentsRecruited = Number(req.body.studentsRecruited);

    // Date
    if (req.body.visitDate)
      company.visitDate = new Date(req.body.visitDate);

    // Normal fields
    if (req.body.companyName) company.companyName = req.body.companyName;
    if (req.body.location) company.location = req.body.location;
    if (req.body.modeOfVisit) company.modeOfVisit = req.body.modeOfVisit;
    if (req.body.recruitmentType) company.recruitmentType = req.body.recruitmentType;

    // Image
    if (req.file) {
      if (company.image?.public_id) {
        try {
          await cloudinary.uploader.destroy(company.image.public_id);
        } catch (err) {
          console.log("Cloudinary delete failed:", err);
        }
      }

      company.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await company.save();
    res.json(company);

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Failed to update company" });
  }
};

// DELETE
export const deleteVisitedCompany = async (req, res) => {
  try {
    const company = await VisitedCompany.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Not found" });

    if (company.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(company.image.public_id);
      } catch (err) {
        console.log("Cloudinary delete failed:", err);
      }
    }

    await company.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete company" });
  }
};
