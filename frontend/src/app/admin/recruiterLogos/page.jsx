"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import { cldImage, compressImage } from "../../../lib/images";

export default function AdminRecruiterLogos() {
  const [logos, setLogos] = useState([]);
  const [formData, setFormData] = useState({ name: "", image: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  // ✅ Fetch all recruiter logos
  const fetchLogos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseURL}/api/recruiter-logos`);
      setLogos(res.data);
    } catch (error) {
      toast.error("Failed to load logos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  // ✅ Handle file change and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Handle create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    if (formData.image) data.append("image", await compressImage(formData.image));

    try {
      setLoading(true);

      if (editingId) {
        await axios.put(`${baseURL}/api/recruiter-logos/${editingId}`, data);
        toast.success("Logo updated successfully!");
      } else {
        await axios.post(`${baseURL}/api/recruiter-logos`, data);
        toast.success("Logo uploaded successfully!");
      }

      setFormData({ name: "", image: null });
      setPreview(null);
      setEditingId(null);
      fetchLogos();
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle delete
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this logo?")) {
      try {
        await axios.delete(`${baseURL}/api/recruiter-logos/${id}`);
        toast.info("Logo deleted");
        fetchLogos();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  // ✅ Handle edit
  const handleEdit = (logo) => {
    setEditingId(logo._id);
    setFormData({ name: logo.name, image: null });
    setPreview(logo.image?.url);
  };

  // ✅ Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", image: null });
    setPreview(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
          {editingId ? "Edit Recruiter Logo" : "Upload Recruiter Logo"}
        </h1>

        {/* ✅ Upload/Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-center gap-4 mb-8"
        >
          <div className="flex flex-col flex-1 w-full">
            <label className="text-gray-600 font-medium mb-1">
              Company Name
            </label>
            <input
              type="text"
              placeholder="Enter company name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-1">
              Logo Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex gap-2 mt-4 md:mt-7">
            <button
              type="submit"
              disabled={loading}
              className={`${
                editingId
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white px-6 py-2 rounded-lg transition-all duration-300`}
            >
              {loading
                ? "Please wait..."
                : editingId
                ? "Update"
                : "Upload"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* ✅ Image Preview */}
        {preview && (
          <div className="mb-8 flex justify-center">
            <div className="bg-white rounded-xl shadow-md p-3 border">
              <img
                src={preview}
                alt="Preview"
                className="w-40 h-32 object-contain mx-auto"
              />
              <p className="text-center text-gray-500 mt-2 text-sm">Preview</p>
            </div>
          </div>
        )}

        {/* ✅ Logo List */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading logos...
          </div>
        ) : logos.length === 0 ? (
          <p className="text-center text-gray-500">No logos uploaded yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {logos.map((logo) => (
              <div
                key={logo._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-md p-4 text-center transition-transform duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="flex justify-center items-center h-32 mb-3">
                  <img
                    src={cldImage(logo.image?.url, 240)}
                    alt={logo.name}
                    loading="lazy"
                    className="object-contain max-h-28 mx-auto"
                  />
                </div>
                <p className="font-semibold text-gray-700 truncate">
                  {logo.name}
                </p>

                <div className="flex justify-center gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(logo)}
                    className="bg-yellow-500 text-white px-4 py-1.5 rounded-md text-sm hover:bg-yellow-600 transition flex items-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(logo._id)}
                    className="bg-red-500 text-white px-4 py-1.5 rounded-md text-sm hover:bg-red-600 transition flex items-center gap-1"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
