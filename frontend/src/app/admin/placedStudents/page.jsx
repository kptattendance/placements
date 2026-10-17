"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Grid,
  Card,
  Typography,
  TextField,
  Avatar,
  CircularProgress,
  Box,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { FaUpload } from "react-icons/fa";
import {
  BRANCH_CODES,
  branchCode,
  branchLabel,
  companyOptions,
  cityOptions,
} from "../../../lib/filterOptions";

export default function PlacedStudentsManager() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    registerNumber: "",
    branch: "",
    yearOfPassing: "",
    companyName: "",
    location: "",
    packageOffered: "",
    designation: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/placed-students`;

  // Fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setStudents(res.data);
    } catch {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Existing names, suggested while typing so the same company or
  // place is not entered with a new spelling
  const companySuggestions = companyOptions(students.map((s) => s.companyName));
  const locationSuggestions = cityOptions(students.map((s) => s.location));

  // Search Filter
  const filteredStudents = students.filter((s) => {
    const text = searchTerm.toLowerCase();
    return (
      s.name?.toLowerCase().includes(text) ||
      s.registerNumber?.toLowerCase().includes(text) ||
      s.branch?.toLowerCase().includes(text) ||
      s.companyName?.toLowerCase().includes(text) ||
      s.location?.toLowerCase().includes(text) ||
      s.yearOfPassing?.toString().includes(text) ||
      s.packageOffered?.toString().includes(text) ||
      s.designation?.toLowerCase().includes(text)
    );
  });

  // Handle file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "image" && !formData.image) return;
      data.append(key, formData[key]);
    });

    try {
      setUploading(true);

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data);
        toast.success("Student updated successfully!");
      } else {
        if (!formData.image) return toast.error("Please upload an image");
        await axios.post(API_URL, data);
        toast.success("Placed student added successfully!");
      }

      setFormData({
        name: "",
        registerNumber: "",
        branch: "",
        yearOfPassing: "",
        companyName: "",
        location: "",
        packageOffered: "",
        designation: "",
        image: null,
      });
      setPreview(null);
      setEditingId(null);
      fetchStudents();
    } catch {
      toast.error("Failed to save student");
    } finally {
      setUploading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.info("Student deleted");
      fetchStudents();
    } catch {
      toast.error("Delete failed");
    }
  };

  // Edit
  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      registerNumber: student.registerNumber,
      branch: branchCode(student.branch),
      yearOfPassing: student.yearOfPassing,
      companyName: student.companyName,
      location: student.location,
      packageOffered: student.packageOffered,
      designation: student.designation,
      image: null,
    });
    setPreview(student.image?.url || null);
    setEditingId(student._id);
    toast.info(`Editing ${student.name}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #e3f2fd, #ffffff)",
        py: 6,
        px: 2,
      }}
    >
      <Box maxWidth="md" mx="auto" textAlign="center" mb={5}>
        <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
          Placed Students Management
        </Typography>
      </Box>

      {/* Form */}
      <Card
        sx={{
          maxWidth: 900,
          mx: "auto",
          p: 4,
          mb: 5,
          boxShadow: 4,
          borderRadius: 3,
          backgroundColor: "#ffffffc8",
          backdropFilter: "blur(10px)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                {[
                  { name: "name", label: "Full Name" },
                  { name: "registerNumber", label: "Register Number" },
                  { name: "branch", label: "Branch" },
                  { name: "yearOfPassing", label: "Year of Passing", type: "number" },
                  { name: "companyName", label: "Company Name" },
                  { name: "location", label: "Location" },
                  { name: "packageOffered", label: "Package (LPA)", type: "number" },
                  { name: "designation", label: "Designation" },
                ].map((field) => (
                  <Grid item xs={12} sm={6} key={field.name}>
                    <TextField
                      fullWidth
                      label={field.label}
                      name={field.name}
                      type={field.type || "text"}
                      value={formData[field.name]}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, [field.name]: e.target.value }))
                      }
                      required={field.name !== "designation"}
                      variant="outlined"
                      size="small"
                      select={field.name === "branch"}
                      SelectProps={{ native: true }}
                      InputLabelProps={
                        field.name === "branch" ? { shrink: true } : undefined
                      }
                      inputProps={{
                        list:
                          field.name === "companyName"
                            ? "company-suggestions"
                            : field.name === "location"
                              ? "location-suggestions"
                              : undefined,
                      }}
                    >
                      {field.name === "branch" && (
                        <>
                          <option value="">Select branch</option>
                          {BRANCH_CODES.map((code) => (
                            <option key={code} value={code}>
                              {branchLabel(code)}
                            </option>
                          ))}
                        </>
                      )}
                    </TextField>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              md={4}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Avatar
                src={preview || ""}
                alt="Preview"
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  boxShadow: 3,
                  border: "2px solid #1976d2",
                }}
              />
              <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition mb-3">
                <FaUpload /> Upload Photo
                <input type="file" accept="image/*" hidden onChange={handleFileChange} />
              </label>

              <button
                type="submit"
                disabled={uploading}
                className={`${
                  editingId
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-green-600 hover:bg-green-700"
                } text-white px-4 py-2 rounded-lg flex items-center gap-2 transition`}
              >
                <Add fontSize="small" />
                {uploading ? "Saving..." : editingId ? "Update Student" : "Add Student"}
              </button>
            </Grid>
          </Grid>
        </form>

        <datalist id="company-suggestions">
          {companySuggestions.map((o) => (
            <option key={o.value} value={o.label} />
          ))}
        </datalist>
        <datalist id="location-suggestions">
          {locationSuggestions.map((o) => (
            <option key={o.value} value={o.label} />
          ))}
        </datalist>
      </Card>

      {/* 🔍 Search */}
      <Box maxWidth="400px" mx="auto" mb={3}>
        <TextField
          fullWidth
          label="Search Students..."
          variant="outlined"
          size="small"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
      </Box>

      {/* Table */}
      {loading ? (
        <Box textAlign="center" mt={5}>
          <CircularProgress />
          <Typography mt={2}>Loading Students...</Typography>
        </Box>
      ) : filteredStudents.length === 0 ? (
        <Typography color="text.secondary" mt={3} textAlign="center">
          No students found.
        </Typography>
      ) : (
        <Box
          sx={{
            maxWidth: "95%",
            mx: "auto",
            mt: 5,
            overflowX: "auto",
            backgroundColor: "#fff",
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <table className="min-w-full border-collapse border border-gray-200 text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 border border-gray-200 text-left">Photo</th>
                <th className="px-4 py-3 border border-gray-200 text-left">Name</th>
                <th className="px-4 py-3 border border-gray-200 text-left">Reg No</th>
                <th className="px-4 py-3 border border-gray-200 text-left">Branch</th>
                <th className="px-4 py-3 border border-gray-200 text-left">Company</th>
                <th className="px-4 py-3 border border-gray-200 text-left">Designation</th>
                <th className="px-4 py-3 border border-gray-200 text-left">Location</th>
                <th className="px-4 py-3 border border-gray-200 text-left">Year</th>
                <th className="px-4 py-3 border border-gray-200 text-left">Package</th>
                <th className="px-4 py-3 border border-gray-200 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s, i) => (
                <tr
                  key={s._id}
                  className={`hover:bg-blue-50 transition ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="border border-gray-200 px-3 py-2 text-center">
                    <Avatar
                      src={s.image?.url}
                      alt={s.name}
                      sx={{
                        width: 45,
                        height: 45,
                        border: "2px solid #90caf9",
                        mx: "auto",
                      }}
                    />
                  </td>
                  <td className="border border-gray-200 px-3 py-2 font-semibold">{s.name}</td>
                  <td className="border border-gray-200 px-3 py-2">{s.registerNumber}</td>
                  <td className="border border-gray-200 px-3 py-2">{s.branch}</td>
                  <td className="border border-gray-200 px-3 py-2 text-blue-700 font-medium">
                    {s.companyName}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {s.designation || "Intern"}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">{s.location}</td>
                  <td className="border border-gray-200 px-3 py-2">{s.yearOfPassing}</td>
                  <td className="border border-gray-200 px-3 py-2 text-green-600 font-semibold">
                    {s.packageOffered} LPA
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(s)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
                      >
                        <Edit fontSize="small" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
                      >
                        <Delete fontSize="small" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}
    </Box>
  );
}
