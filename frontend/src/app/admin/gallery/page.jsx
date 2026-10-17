"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import { cldImage, compressImage } from "../../../lib/images";

export default function AdminGallery() {
  const [photos, setPhotos] = useState([]);
  const [formData, setFormData] = useState({ title: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch all photos
  const fetchPhotos = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/gallery`);
      setPhotos(res.data);
    } catch (error) {
      toast.error("Failed to load photos");
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    if (image) data.append("image", await compressImage(image));

    try {
      setLoading(true);

      if (editingId) {
        await axios.put(`${baseURL}/api/gallery/${editingId}`, data);
        toast.success("Photo updated successfully");
      } else {
        await axios.post(`${baseURL}/api/gallery`, data);
        toast.success("Photo uploaded successfully");
      }

      setFormData({ title: "" });
      setImage(null);
      setPreview(null);
      setEditingId(null);
      fetchPhotos();
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (photo) => {
    setEditingId(photo._id);
    setFormData({ title: photo.title });
    setPreview(photo.image.url);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete?")) {
      try {
        await axios.delete(`${baseURL}/api/gallery/${id}`);
        toast.info("Deleted successfully");
        fetchPhotos();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "" });
    setPreview(null);
    setImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
        {editingId ? "Edit Gallery Photo" : "Upload Gallery Photo"}
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-6 rounded-xl flex flex-col md:flex-row gap-4 mb-10"
      >
        <div className="flex flex-col w-full">
          <label className="text-gray-700 font-medium mb-1">Title</label>
          <input
            type="text"
            placeholder="Enter photo title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            className="border rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border rounded-lg px-3 py-2"
          />
        </div>

        <div className="flex gap-2 items-center md:mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`${
              editingId ? "bg-green-600" : "bg-blue-600"
            } text-white px-6 py-2 rounded-lg`}
          >
            {loading ? "Please wait..." : editingId ? "Update" : "Upload"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Preview */}
      {preview && (
        <div className="flex justify-center mb-10">
          <div className="p-4 bg-white rounded-xl shadow">
            <img src={preview} className="w-56 h-40 object-cover mx-auto" />
            <p className="text-center text-gray-500 mt-2 text-sm">Preview</p>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <div
            key={photo._id}
            className="bg-white shadow rounded-xl p-3 text-center hover:scale-105 transition"
          >
            <img
              src={cldImage(photo.image?.url, 400)}
              alt={photo.title}
              loading="lazy"
              className="w-full h-40 object-cover rounded-md"
            />
            <p className="font-semibold mt-2">{photo.title}</p>

            <div className="flex justify-center gap-3 mt-3">
              <button
                onClick={() => handleEdit(photo)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-md"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(photo._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
