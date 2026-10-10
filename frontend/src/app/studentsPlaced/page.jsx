"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function PlacedStudents() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    year: "",
    branch: "",
    company: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);

  const branchNames = {
    AT: "Automobile Engineering",
    CE: "Civil Engineering",
    CH: "Chemical Engineering",
    CS: "Computer Science Engineering",
    EC: "Electronics & Communication Engineering",
    EE: "Electrical & Electronics Engineering",
    ME: "Mechanical Engineering",
    PO: "Polymer Technology",
  };

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/placed-students`;

  // ✅ Convert to Title Case
  function toTitleCase(str) {
    if (!str) return "";

    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // ✅ Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_URL);

        setStudents(res.data);
        setFiltered(res.data);
      } catch (error) {
        console.error("Error fetching placed students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Apply Filters
  useEffect(() => {
    let filteredData = students;

    if (filters.year) {
      filteredData = filteredData.filter(
        (s) => String(s.yearOfPassing) === String(filters.year),
      );
    }

    if (filters.branch) {
      filteredData = filteredData.filter((s) =>
        s.branch?.toLowerCase().includes(filters.branch.toLowerCase()),
      );
    }

    if (filters.company) {
      filteredData = filteredData.filter((s) =>
        s.companyName?.toLowerCase().includes(filters.company.toLowerCase()),
      );
    }

    if (filters.location) {
      filteredData = filteredData.filter((s) =>
        s.location?.toLowerCase().includes(filters.location.toLowerCase()),
      );
    }

    setFiltered(filteredData);
  }, [filters, students]);

  // ✅ Years that actually have placed students, latest first
  const years = [...new Set(students.map((s) => s.yearOfPassing))]
    .filter(Boolean)
    .sort((a, b) => b - a);

  // ✅ Handle Filter Change
  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ Loading State
  if (loading) {
    return (
      <p className="text-center py-10 text-gray-500 text-lg">Loading... </p>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-sky-50 py-12 px-4 md:px-10">
      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-10 drop-shadow-sm">
        🌟 Placed Students
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-10 bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-lg border border-blue-100">
        <select
          value={filters.year}
          onChange={(e) => handleChange("year", e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="">All Years</option>

          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filter by Branch"
          value={filters.branch}
          onChange={(e) => handleChange("branch", e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <input
          type="text"
          placeholder="Filter by Company"
          value={filters.company}
          onChange={(e) => handleChange("company", e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <input
          type="text"
          placeholder="Filter by Location"
          value={filters.location}
          onChange={(e) => handleChange("location", e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <button
          onClick={() =>
            setFilters({
              year: "",
              branch: "",
              company: "",
              location: "",
            })
          }
          className="bg-gray-600 text-white px-5 py-2 rounded-md hover:bg-gray-700 transition"
        >
          Clear
        </button>
      </div>

      {/* Results Count */}
      <p className="text-center text-gray-600 mb-6 text-sm">
        Showing <strong className="text-blue-700">{filtered.length}</strong>{" "}
        {filtered.length === 1 ? "student" : "students"}
      </p>

      {/* Students Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          No students match your filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((s) => {
            return (
              <div
                key={s._id}
                className="relative overflow-hidden rounded-[28px] shadow-2xl border-4 border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.4)] w-full max-w-[360px] mx-auto hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition-all duration-300"
              >
                {/* College Background Image */}
                <img
                  src="/kpt-bg.jpg"
                  alt="College"
                  className="absolute inset-0 w-full h-full object-cover opacity-75"
                />

                {/* Light Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/65 via-white/65 to-blue-50/75 backdrop-blur-[1px]" />
                {/* Main Content */}
                <div className="relative z-10 flex flex-col items-center text-center p-4">
                  {/* Heading */}
                  <div className="mb-3">
                    <h3 className="text-pink-700 text-base font-semibold italic">
                      🎉 Hearty Congratulations! 🎉
                    </h3>

                    <div className="mt-2 bg-[#0b2c6b] text-white px-5 py-2 rounded-full text-sm font-bold shadow">
                      Proud Moment for KPT Family!
                    </div>
                  </div>

                  {/* Student Image */}
                  <div className="relative mt-2">
                    <div className="w-35 h-35 rounded-full border-[6px] border-[#d4af37] p-1 bg-white shadow-xl">
                      <img
                        src={
                          s.image?.url ||
                          "/logo.jpg"
                        }
                        alt={s.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>

                    {/* Year Badge */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0b2c6b] text-white text-xs px-2 py-1 rounded-full shadow-lg font-bold">
                      {s.yearOfPassing}
                    </div>
                  </div>

                  {/* Name */}
                  <h2 className="mt-3 text-3xl font-extrabold text-[#0b2c6b] tracking-wide uppercase leading-tight">
                    {toTitleCase(s.name)}
                  </h2>

                  {/* Register Number */}
                  <p className="text-sm text-gray-600 mt-2">
                    Reg No:
                    <span className="font-bold text-gray-800 ml-1">
                      {s.registerNumber?.toUpperCase()}
                    </span>
                  </p>

                  {/* Branch */}
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-semibold">Branch:</span>{" "}
                    <span className="text-blue-500 font-bold">
                      {branchNames[s.branch?.toUpperCase()] || s.branch}
                    </span>
                  </p>

                  {/* Company */}
                  <div className="mt-3 bg-white/40 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-1 shadow-md w-full">
                    {" "}
                    <div className="text-base font-bold text-[#3b1fa1]">
                      {toTitleCase(s.companyName)}
                    </div>
                    {s.designation && (
                      <div className="text-xs text-gray-600 italic mt-0.5 font-semibold">
                        {toTitleCase(s.designation)}
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div className="mt-2 text-sm text-gray-700 flex items-center gap-1">
                    📍 {toTitleCase(s.location)}
                  </div>

                  {/* Package */}
                  <div className="mt-4 bg-gradient-to-r from-yellow-200 to-yellow-300 text-yellow-900 px-6 py-2 rounded-full text-lg font-bold shadow-lg border border-yellow-400">
                    💰 Package: {s.packageOffered} LPA
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
