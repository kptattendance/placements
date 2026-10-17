// Image helpers shared by the public and admin pages.

// ✅ Ask Cloudinary for a small, modern-format copy of an image instead of the
// full original (photos are often 4000px wide but shown at a few hundred px).
// Non-Cloudinary URLs are returned unchanged.
export function cldImage(url, width) {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  return url.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${width}/`);
}

// ✅ Shrink a photo in the browser before uploading it, so uploads are fast
// even on mobile data. PNGs (logos with transparent backgrounds) and small
// files are left as they are.
export async function compressImage(file, { maxSize = 1600, quality = 0.82 } = {}) {
  if (!(file instanceof File)) return file;
  if (!["image/jpeg", "image/webp"].includes(file.type)) return file;
  if (file.size < 300 * 1024) return file;

  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    // Older browsers: upload the original
    return file;
  }
}
