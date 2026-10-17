import cloudinary from "../config/cloudinary.js";

// ✅ Delete an image from Cloudinary.
// Never throws: a Cloudinary hiccup should not stop the record being deleted.
export const deleteImage = async (publicId) => {
  if (!publicId) return;

  try {
    const { result } = await cloudinary.uploader.destroy(publicId);
    if (result !== "ok" && result !== "not found") {
      console.warn(`Cloudinary delete of ${publicId} returned "${result}"`);
    }
  } catch (err) {
    console.error(`Cloudinary delete of ${publicId} failed:`, err.message);
  }
};
