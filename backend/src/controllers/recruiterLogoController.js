import RecruiterLogo from "../models/recruiterLogoModel.js";
import cloudinary from "../config/cloudinary.js";

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

    if (logo.image?.public_id) {
      await cloudinary.uploader.destroy(logo.image.public_id);
    }

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

    if (req.file) {
      if (logo.image?.public_id) {
        await cloudinary.uploader.destroy(logo.image.public_id);
      }

      logo.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    if (req.body.name) logo.name = req.body.name;

    await logo.save();
    res.json(logo);
  } catch {
    res.status(500).json({ message: "Failed to update logo" });
  }
};