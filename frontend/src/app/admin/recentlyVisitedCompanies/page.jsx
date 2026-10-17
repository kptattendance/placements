"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

import {
  branchCode,
  branchOptions,
  cityOf,
  cityOptions,
  companyKey,
  companyOptions,
  BRANCH_CODES,
} from "../../../lib/filterOptions";

const API = process.env.NEXT_PUBLIC_API_URL;

// Branch codes shown as checkboxes in the form
const BRANCHES = BRANCH_CODES;

export default function VisitedCompanyManager() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;
  const isCoordinator = role === "placement-coordinator";

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    branch: "",
    company: "",
    location: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    companyName: "",
    branchList: [],
    location: "",
    packageOffered: "",
    visitDate: "",
    studentsRecruited: 0,
    modeOfVisit: "On-campus",
    recruitmentType: "Placement",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/visited-companies`);
      setCompanies(res.data || []);
    } catch (error) {
      alert("Failed to load companies");
    } finally {
      setLoading(false);
    }
  }

  function applyFilters(list) {
    return list.filter((c) => {
      if (
        filters.branch &&
        !(c.branchList || []).some((b) => branchCode(b) === filters.branch)
      )
        return false;

      if (filters.company && companyKey(c.companyName) !== filters.company)
        return false;

      if (filters.location && cityOf(c.location) !== filters.location)
        return false;

      return true;
    });
  }

  // Dropdown choices, built from the companies' data
  const options = useMemo(
    () => ({
      branch: branchOptions(companies.flatMap((c) => c.branchList || [])),
      company: companyOptions(companies.map((c) => c.companyName)),
      location: cityOptions(companies.map((c) => c.location)),
    }),
    [companies]
  );


  function openNewForm() {
    setEditing(null);
    setForm({
      companyName: "",
      branchList: [],
      location: "",
      packageOffered: "",
      visitDate: "",
      studentsRecruited: 0,
      modeOfVisit: "On-campus",
      recruitmentType: "Placement",
      image: null,
    });
    setPreview(null);
    setShowForm(true);
  }

 function openEdit(company) {
  setEditing(company);

  // 🧼 Old entries used different spellings (EEE, CIVIL ...) — use the standard codes
  const cleanedBranches = [
    ...new Set((company.branchList || []).map(branchCode).filter(Boolean)),
  ];

  setForm({
    companyName: company.companyName,
    branchList: cleanedBranches,
    location: company.location,
    packageOffered: company.packageOffered,
    visitDate: new Date(company.visitDate).toISOString().substring(0, 10),
    studentsRecruited: company.studentsRecruited,
    modeOfVisit: company.modeOfVisit,
    recruitmentType: company.recruitmentType,
    image: null,
  });

  setPreview(company.image?.url || null);
  setShowForm(true);
}

  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, image: file }));
    setPreview(URL.createObjectURL(file));
  }

  async function saveForm() {
    try {
      setUploading(true);

      const fd = new FormData();

      fd.append("companyName", form.companyName);
      fd.append("location", form.location);
      fd.append("packageOffered", form.packageOffered);
      fd.append("visitDate", form.visitDate);
      fd.append("studentsRecruited", form.studentsRecruited);
      fd.append("modeOfVisit", form.modeOfVisit);
      fd.append("recruitmentType", form.recruitmentType);

      fd.append("branchList", JSON.stringify(form.branchList));

      if (form.image) fd.append("image", form.image);

      if (editing) {
        await axios.put(`${API}/api/visited-companies/${editing._id}`, fd);
        alert("Updated");
      } else {
        await axios.post(`${API}/api/visited-companies`, fd);
        alert("Created");
      }

      setShowForm(false);
      fetchCompanies();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setUploading(false);
    }
  }

  async function deleteCompany(id) {
    if (!confirm("Delete this company visit?")) return;

    try {
      await axios.delete(`${API}/api/visited-companies/${id}`);
      fetchCompanies();
    } catch (err) {
      alert("Delete failed");
    }
  }

  return (
    <div className="p-6 text-gray-600">

      {/* FILTERS + ADD */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-2xl font-semibold">Recently Visited Companies</h2>

        <div className="flex flex-wrap gap-2">
          <select
            value={filters.branch}
            onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
            aria-label="All Branches"
            className="border px-2 py-1 rounded bg-white max-w-48"
          >
            <option value="">All Branches</option>
            {options.branch.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={filters.company}
            onChange={(e) => setFilters({ ...filters, company: e.target.value })}
            aria-label="All Companies"
            className="border px-2 py-1 rounded bg-white max-w-48"
          >
            <option value="">All Companies</option>
            {options.company.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            aria-label="All Locations"
            className="border px-2 py-1 rounded bg-white max-w-48"
          >
            <option value="">All Locations</option>
            {options.location.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setFilters({ branch: "", company: "", location: "" })}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Clear
          </button>

          {isCoordinator && (
            <button
              onClick={openNewForm}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Add
            </button>
          )}
        </div>
      </div>

      {/* COMPANY LIST */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applyFilters(companies).map((c) => (
            <div key={c._id} className="bg-white p-4 rounded-lg shadow flex gap-4">

              <img
                src={c.image?.url || "/placeholder.jpg"}
                className="w-28 h-28 object-cover rounded-md"
              />

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{c.companyName}</h3>

                <div className="text-sm text-gray-600">
                  {c.branchList.join(", ")} • {c.location}
                </div>

                <div className="text-sm mt-2">
                  Package: <strong>{c.packageOffered} LPA</strong> • Visited:{" "}
                  {new Date(c.visitDate).toLocaleDateString()}
                </div>

                <div className="text-sm mt-1">
                  Students recruited: <strong>{c.studentsRecruited}</strong>
                </div>

                {isCoordinator && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => openEdit(c)}
                      className="px-2 py-1 bg-yellow-400 rounded text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteCompany(c._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 animate-scaleIn">

            <h3 className="text-2xl font-bold text-blue-700 mb-6">
              {editing ? "Update Company Visit" : "Add New Company Visit"}
            </h3>

            {/* FORM GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Company Name */}
              <div>
                <label className="text-sm font-semibold">Company Name</label>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={(e) => handleFormChange("companyName", e.target.value)}
                  className="mt-1 w-full border p-2 rounded-lg"
                />
              </div>

              {/* 🔥 Multi Select Branches */}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold">Select Branches</label>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">

                  {BRANCHES.map((branch) => {
                    const isChecked = form.branchList.includes(branch);

                    return (
                      <label
                        key={branch}
                        className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            setForm((prev) => {
                              const updated = isChecked
                                ? prev.branchList.filter((b) => b !== branch)
                                : [...prev.branchList, branch];
                              return { ...prev, branchList: updated };
                            })
                          }
                        />
                        <span className="font-medium">{branch}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-semibold">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => handleFormChange("location", e.target.value)}
                  className="mt-1 w-full border p-2 rounded-lg"
                />
              </div>

              {/* Package */}
              <div>
                <label className="text-sm font-semibold">Package (LPA)</label>
                <input
                  type="number"
                  value={form.packageOffered}
                  onChange={(e) => handleFormChange("packageOffered", e.target.value)}
                  className="mt-1 w-full border p-2 rounded-lg"
                />
              </div>

              {/* Visit Date */}
              <div>
                <label className="text-sm font-semibold">Visit Date</label>
                <input
                  type="date"
                  value={form.visitDate}
                  onChange={(e) => handleFormChange("visitDate", e.target.value)}
                  className="mt-1 w-full border p-2 rounded-lg"
                />
              </div>

              {/* Students */}
              <div>
                <label className="text-sm font-semibold">Students Recruited</label>
                <input
                  type="number"
                  value={form.studentsRecruited}
                  onChange={(e) => handleFormChange("studentsRecruited", e.target.value)}
                  className="mt-1 w-full border p-2 rounded-lg"
                />
              </div>

              {/* Mode */}
              <div>
                <label className="text-sm font-semibold">Mode of Visit</label>
                <select
                  value={form.modeOfVisit}
                  onChange={(e) => handleFormChange("modeOfVisit", e.target.value)}
                  className="mt-1 w-full border p-2 rounded-lg"
                >
                  <option>On-campus</option>
                  <option>Pool</option>
                  <option>Online</option>
                </select>
              </div>

              {/* Recruitment Type */}
              <div>
                <label className="text-sm font-semibold">Recruitment Type</label>
                <select
                  value={form.recruitmentType}
                  onChange={(e) => handleFormChange("recruitmentType", e.target.value)}
                  className="mt-1 w-full border p-2 rounded-lg"
                >
                  <option>Placement</option>
                  <option>Internship</option>
                  <option>Both Internship and Placement</option>
                </select>
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold">Company Image / Logo</label>

                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="border p-2 rounded-lg"
                  />

                  {preview && (
                    <img
                      src={preview}
                      className="w-24 h-24 rounded-lg object-cover border shadow"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={saveForm}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg"
              >
                {editing ? "Update" : "Create"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
