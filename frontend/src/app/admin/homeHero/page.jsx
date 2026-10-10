"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash, FaGripVertical } from "react-icons/fa";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function AdminHomeHeroPage() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  // A drag starts only after moving 8px, so a plain click is never
  // mistaken for a drag
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Fetch images
  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseURL}/api/home-hero`);
      setImages(res.data);
    } catch {
      toast.error("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Upload image
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Select an image first");

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      await axios.post(`${baseURL}/api/home-hero`, formData);
      toast.success("Image uploaded");
      setFile(null);
      setPreview(null);
      e.target.reset();
      fetchImages();
    } catch {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete image
  const handleDelete = async (id) => {
    if (!confirm("Delete this image?")) return;

    try {
      setDeletingId(id);
      await axios.delete(`${baseURL}/api/home-hero/${id}`);
      toast.info("Deleted");
      setImages((prev) => prev.filter((x) => x._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  // Drag+Drop reorder
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((i) => i._id === active.id);
    const newIndex = images.findIndex((i) => i._id === over.id);

    const reordered = [...images];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    setImages(reordered);

    const orderData = reordered.map((img, index) => ({
      _id: img._id,
      order: index,
    }));

    try {
      await axios.put(`${baseURL}/api/home-hero/update-order`, {
        order: orderData,
      });
      toast.success("Order updated");
    } catch {
      toast.error("Order save failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
          Manage Homepage Hero Images
        </h1>

        {/* Upload */}
        <form
          onSubmit={handleUpload}
          className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg flex flex-col md:flex-row gap-4 mb-8"
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const selected = e.target.files[0] || null;
              setFile(selected);
              setPreview(selected ? URL.createObjectURL(selected) : null);
            }}
            className="border rounded-lg px-3 py-2 w-full"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {/* Preview */}
        {preview && (
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-xl shadow-md p-3 border">
              <img
                src={preview}
                alt="Preview"
                className="w-60 h-40 object-cover rounded-md"
              />
              <p className="text-center text-gray-500 mt-2 text-sm">Preview</p>
            </div>
          </div>
        )}

        {/* Images List */}
        {images.length > 1 && (
          <p className="text-center text-gray-500 text-sm">
            Drag an image by its handle to change the slideshow order.
          </p>
        )}

        {images.length === 0 ? (
          <p className="text-center text-gray-500">No images yet</p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((i) => i._id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
                {images.map((img) => (
                  <SortableItem
                    key={img._id}
                    img={img}
                    handleDelete={handleDelete}
                    deleting={deletingId === img._id}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

// Sortable Item Component
function SortableItem({ img, handleDelete, deleting }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: img._id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`relative bg-white rounded-2xl shadow-md hover:shadow-lg overflow-hidden ${
        deleting ? "opacity-50" : ""
      }`}
    >
      <img
        src={img.image?.url}
        alt="Homepage hero"
        className="w-full h-48 object-cover"
      />

      {/* ✅ DRAG HANDLE ONLY — the rest of the card stays clickable */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        title="Drag to reorder"
        className="absolute top-2 left-2 bg-white/90 text-gray-700 p-2 rounded-full shadow cursor-grab active:cursor-grabbing touch-none"
      >
        <FaGripVertical size={14} />
      </button>

      <button
        type="button"
        onClick={() => handleDelete(img._id)}
        disabled={deleting}
        aria-label="Delete image"
        title="Delete image"
        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 disabled:cursor-not-allowed"
      >
        <FaTrash size={14} />
      </button>
    </div>
  );
}
