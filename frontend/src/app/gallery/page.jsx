"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(null); // ⭐ modal selected photo
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/gallery`);
        setPhotos(res.data);
      } catch (err) {
        console.error("Failed to fetch gallery photos:", err);
      }
    };
    fetchPhotos();
  }, []);

  // ⭐ Close modal on ESC
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <section className="relative py-16 bg-gradient-to-r from-blue-50 via-white to-blue-50 border-t border-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-800 text-center mb-3">
          Gallery
        </h2>
        <p className="text-gray-500 text-center mb-10">
          Explore our events, workshops, and campus moments
        </p>

        {photos.length === 0 ? (
          <p className="text-center text-gray-400">No photos uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <div
                key={photo._id}
                onClick={() => setSelected(photo)}
                className="relative group bg-white shadow-md rounded-xl overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-2 transform transition-all duration-300"
              >
                <div className="relative w-full h-56 overflow-hidden">
                  <Image
                    src={photo.image.url}
                    alt={photo.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Hover Caption */}
                <div className="absolute bottom-0 left-0 w-full bg-black/70 text-white text-center text-sm py-2 opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-500">
                  {photo.title}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full p-4 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[400px] md:h-[500px]">
              <Image
                src={selected.image.url}
                alt={selected.title}
                fill
                className="object-contain rounded"
              />
            </div>

            <p className="text-center mt-4 text-lg font-semibold text-gray-800">
              {selected.title}
            </p>

            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 bg-blue-900 text-blue-100 px-3 py-1 rounded-full shadow hover:bg-blue-600 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Side Gradient Edge */}
      <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-blue-50 via-blue-50/60 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-blue-50 via-blue-50/60 to-transparent pointer-events-none"></div>
    </section>
  );
}
