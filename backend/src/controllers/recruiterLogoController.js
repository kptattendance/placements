import RecruiterLogo from "../models/recruiterLogoModel.js";
import { deleteImage } from "../utils/deleteImage.js";

// ✅ Create Recruiter Logo
export const createRecruiterLogo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image required" });

    const logo = await RecruiterLogo.create({
      name: req.body.name,
      image: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });

    res.status(201).json(logo);
  } catch {
    res.status(500).json({ message: "Failed to create recruiter logo" });
  }
};


// ✅ Get All Recruiter Logos
export const getRecruiterLogos = async (req, res) => {
  try {
    const logos = await RecruiterLogo.find().sort({ createdAt: -1 });
    res.status(200).json(logos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recruiter logos" });
  }
};

// ✅ Delete Logo
export const deleteRecruiterLogo = async (req, res) => {
  try {
    const logo = await RecruiterLogo.findById(req.params.id);
    if (!logo) return res.status(404).json({ message: "Not found" });

    await deleteImage(logo.image?.public_id);

    await logo.deleteOne();
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete recruiter logo" });
  }
};
// ✅ Update Recruiter Logo

export const updateRecruiterLogo = async (req, res) => {
  try {
    const logo = await RecruiterLogo.findById(req.params.id);
    if (!logo) return res.status(404).json({ message: "Not found" });

    // Old photo is removed only after the new one is saved
    const oldImageId = req.file ? logo.image?.public_id : null;

    if (req.file) {

      logo.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    if (req.body.name) logo.name = req.body.name;

    await logo.save();
    await deleteImage(oldImageId);
    res.json(logo);
  } catch {
    res.status(500).json({ message: "Failed to update logo" });
  }
};