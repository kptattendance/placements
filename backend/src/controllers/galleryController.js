import Gallery from "../models/galleryModel.js";
import { deleteImage } from "../utils/deleteImage.js";

export const createGalleryPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image required" });

    const photo = await Gallery.create({
      title: req.body.title,
      image: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });

    res.status(201).json(photo);
  } catch (err) {
    res.status(500).json({ message: "Failed to upload photo" });
  }
};

export const getAllGalleryPhotos = async (req, res) => {
  try {
    const photos = await Gallery.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch photos" });
  }
};

export const updateGalleryPhoto = async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: "Not found" });

    // Old photo is removed only after the new one is saved
    const oldImageId = req.file ? photo.image?.public_id : null;

    if (req.file) {

      photo.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    photo.title = req.body.title || photo.title;
    await photo.save();
    await deleteImage(oldImageId);

    res.json(photo);
  } catch (err) {
    res.status(500).json({ message: "Failed to update photo" });
  }
};

export const deleteGalleryPhoto = async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: "Not found" });

    await deleteImage(photo.image?.public_id);

    await photo.deleteOne();

    res.json({ message: "Photo deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete photo" });
  }
};
