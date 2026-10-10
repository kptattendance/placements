"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

export default function TeamAdminPage() {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    department: "",
    email: "",
    phone: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "";

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Fetch team
  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/team`);
      setMembers(res.data);
    } catch {
      toast.error("Failed to load team");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((p) => ({ ...p, image: file }));
      setPreview(URL.createObjectURL(file));
      setExistingImageUrl(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      designation: "",
      department: "",
      email: "",
      phone: "",
      image: null,
    });
    setPreview(null);
    setExistingImageUrl(null);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Submit add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      if (editingId) {
        await axios.put(`${baseURL}/api/team/${editingId}`, data);
        toast.success("Updated successfully");
      } else {
        await axios.post(`${baseURL}/api/team`, data);
        toast.success("Added successfully");
      }

      resetForm();
      fetchMembers();
    } catch (err) {
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this member?")) return;

    try {
      await axios.delete(`${baseURL}/api/team/${id}`);
      toast.success("Deleted");
      fetchMembers();
    } catch {
      toast.error("Delete failed");
    }
  };

  // Edit
  const handleEdit = (m) => {
    setEditingId(m._id);
    setFormData({
      name: m.name || "",
      designation: m.designation || "",
      department: m.department || "",
      email: m.email || "",
      phone: m.phone || "",
      image: null,
    });
    setPreview(m.image?.url || null);
    setExistingImageUrl(m.image?.url || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Drag End
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = members.findIndex((m) => m._id === active.id);
    const newIndex = members.findIndex((m) => m._id === over.id);

    const reordered = [...members];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    setMembers(reordered);

    const orderData = reordered.map((m, i) => ({
      _id: m._id,
      order: i,
    }));

    try {
      await axios.put(`${baseURL}/api/team/update-order`, {
        order: orderData,
      });
      toast.success("Order saved");
    } catch {
      toast.error("Order save failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 text-gray-700">
      <h1 className="text-2xl font-bold mb-6">
        {editingId ? "Edit Team Member" : "Add Team Member"}
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border"
      >
        <FormField
          label="Name *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <FormField
          label="Designation *"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          required
        />
        <FormField
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
        />
        <FormField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <FormField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <div>
          <label className="block font-medium mb-1">Profile Image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border rounded-lg px-3 py-2 w-full"
          />

          {(preview || existingImageUrl) && (
            <img
              src={preview || existingImageUrl}
              alt="preview"
              className="w-24 h-24 rounded-lg mt-2 object-cover border"
            />
          )}
        </div>

        <div className="col-span-full flex gap-4 justify-center">
          <button
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            {loading ? "Saving..." : editingId ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="border px-4 py-2 rounded-lg"
          >
            Reset
          </button>
        </div>
      </form>

      {/* TEAM LIST */}
      <h2 className="text-xl font-semibold mt-10 mb-4">
        Reorder Team (Drag cards)
      </h2>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={members.map((m) => m._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {members.map((m) => (
              <SortableTeamCard
                key={m._id}
                member={m}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

// FORM FIELD
function FormField({ label, name, value, onChange, type = "text", required }) {
  return (
    <div>
      <label className="font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        className="w-full border rounded-lg px-3 py-2 mt-1"
      />
    </div>
  );
}

// SORTABLE CARD
function SortableTeamCard({ member, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: member._id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="flex items-center justify-between bg-white p-3 rounded shadow border"
    >
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        <img
          src={member.image?.url || "/placeholder.jpg"}
          alt={member.name}
          className="w-14 h-14 rounded-full border object-cover"
        />

        <div>
          <h3 className="font-semibold">{member.name}</h3>
          <p className="text-sm text-gray-500">{member.designation}</p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex gap-2 items-center">
        {/* ✅ DRAG HANDLE ONLY */}
        <span
          {...attributes}
          {...listeners}
          className="cursor-move bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs select-none"
          title="Drag to reorder"
        >
          ⇅ Move
        </span>

        {/* ✅ BUTTONS CLICKABLE */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(member);
          }}
          className="bg-yellow-300 px-3 py-1 rounded"
        >
          Edit
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(member._id);
          }}
          className="bg-red-500 text-white p-2 rounded"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}
