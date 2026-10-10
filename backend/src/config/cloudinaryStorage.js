// config/cloudinaryStorage.js

import cloudinary from "./cloudinary.js";

// Multer storage that streams each uploaded image straight to Cloudinary.
// After upload: req.file.path = image URL, req.file.filename = public_id
class CloudinaryStorage {
  constructor(options) {
    this.options = options;
  }

  _handleFile(req, file, cb) {
    const stream = cloudinary.uploader.upload_stream(
      this.options,
      (error, result) => {
        if (error) {
          // e.g. a file that is not a real image
          const err = new Error(error.message || "Image upload failed");
          if (error.http_code === 400) err.status = 400;
          return cb(err);
        }

        cb(null, {
          path: result.secure_url,
          filename: result.public_id,
          size: result.bytes,
        });
      }
    );

    file.stream.pipe(stream);
  }

  // Called by multer when a request fails after the file was uploaded
  _removeFile(req, file, cb) {
    if (!file.filename) return cb(null);
    cloudinary.uploader.destroy(file.filename, (error) => cb(error || null));
  }
}

const storage = new CloudinaryStorage({
  folder: "kpt_placements",
  resource_type: "image",
  allowed_formats: ["jpg", "jpeg", "png", "webp"],
  transformation: [{ quality: "auto" }],
});

export default storage;
