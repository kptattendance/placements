import TeamMember from "../models/TeamMember.js";
import cloudinary from "../config/cloudinary.js";

// CREATE MEMBER
export const createMember = async (req, res) => {
  try {
    const { name, designation, department, email, phone } = req.body;
    const file = req.file;

    let uploadedImage = null;

    // multer has already uploaded the file to Cloudinary
    if (file) {
      uploadedImage = {
        public_id: file.filename,
        url: file.path,
      };
    }

    const count = await TeamMember.countDocuments(); // for default order

    const member = new TeamMember({
      name,
      designation,
      department,
      email,
      phone,
      image: uploadedImage,
      order: count, // add to bottom
    });

    await member.save();
    res.status(201).json(member);
  } catch (error) {
    console.error("Create member error:", error);
    res.status(500).json({ message: "Failed to create team member" });
  }
};

// GET ALL MEMBERS (SORTED)
export const getMembers = async (req, res) => {
  try {
    const members = await TeamMember.find()
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch team members" });
  }
};

// GET SINGLE MEMBER
export const getMemberById = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch member" });
  }
};

// UPDATE MEMBER
export const updateMember = async (req, res) => {
  try {
    const { name, designation, department, email, phone } = req.body;
    const file = req.file;

    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    // IMAGE UPDATE
    if (file) {
      const oldId = member.image?.public_id;

      member.image = {
        public_id: file.filename,
        url: file.path,
      };

      if (oldId) {
        try {
          await cloudinary.uploader.destroy(oldId);
        } catch (err) {
          console.warn("Image delete failed:", err);
        }
      }
    }

    // UPDATE DATA
    member.name = name || member.name;
    member.designation = designation || member.designation;
    member.department = department || member.department;
    member.email = email || member.email;
    member.phone = phone || member.phone;

    const updated = await member.save();
    res.status(200).json(updated);

  } catch (error) {
    console.error("Update member error:", error);
    res.status(500).json({ message: "Failed to update member" });
  }
};

// DELETE MEMBER
export const deleteMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    if (member.image?.public_id) {
      await cloudinary.uploader.destroy(member.image.public_id);
    }

    await member.deleteOne();

    res.status(200).json({ message: "Member deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// ⭐ UPDATE ORDER (DRAG & DROP)
export const updateTeamOrder = async (req, res) => {
  try {
    const { order } = req.body;

    if (!order || !Array.isArray(order)) {
      return res.status(400).json({ message: "Invalid order format" });
    }

    for (let item of order) {
      await TeamMember.findByIdAndUpdate(item._id, {
        order: item.order,
      });
    }

    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Order update failed", error);
    res.status(500).json({ message: "Failed to update order" });
  }
};
