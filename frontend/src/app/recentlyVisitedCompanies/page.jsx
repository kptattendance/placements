"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  Users,
  Layers,
  X,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function RecentlyVisitedCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filters, setFilters] = useState({
    branch: "",
    company: "",
    location: "",
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/visited-companies`);
      setCompanies(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load companies");
    } finally {
      setLoading(false);
    }
  }

  function applyFilters(list) {
    return list.filter((c) => {
      if (
        filters.branch &&
        !c.branchList.some((b) =>
          b.toLowerCase().includes(filters.branch.toLowerCase())
        )
      )
        return false;

      if (
        filters.company &&
        !c.companyName.toLowerCase().includes(filters.company.toLowerCase())
      )
        return false;

      if (
        filters.location &&
        !c.location.toLowerCase().includes(filters.location.toLowerCase())
      )
        return false;

      return true;
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 px-4 py-8 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-10">
        🏢 Recently Visited Companies
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-3 text-gray-500 sm:flex sm:flex-wrap sm:justify-center mb-10">
        <input
          placeholder="Branch"
          value={filters.branch}
          onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
          className="border border-blue-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 w-full min-w-0 bg-white sm:w-40"
        />
        <input
          placeholder="Company"
          value={filters.company}
          onChange={(e) => setFilters({ ...filters, company: e.target.value })}
          className="border border-blue-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 w-full min-w-0 bg-white col-span-2 sm:w-52"
        />
        <input
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="border border-blue-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 w-full min-w-0 bg-white sm:w-40"
        />
        <button
          onClick={() =>
            setFilters({ branch: "", company: "", location: "" })
          }
          className="col-span-2 bg-blue-100 text-blue-700 font-medium px-4 py-2 rounded-md hover:bg-blue-200 transition"
        >
          Clear
        </button>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="text-center text-blue-600 font-semibold text-lg">
          Loading companies...
        </div>
      ) : applyFilters(companies).length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No matching companies found.
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {applyFilters(companies).map((c) => (
            <div
              key={c._id}
              className="relative group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-transform duration-300 overflow-hidden"
            >
              {/* Image Section */}
              <div
                className="h-48 w-full overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(c.image?.url)}
              >
                <img
                  src={
                    c.image?.url ||
                    "/visited-company-placeholder.png"
                  }
                  alt={c.companyName}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <div className="p-5">
                <h2 className="text-xl font-bold text-blue-900 mb-1 break-words">
                  {c.companyName?.toUpperCase()}
                </h2>

                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <MapPin className="h-4 w-4 mr-1 text-blue-600" />
                  {c.location}
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <Calendar className="h-4 w-4 mr-1 text-indigo-600" />
                  {new Date(c.visitDate).toLocaleDateString()}
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <Briefcase className="h-4 w-4 mr-1 text-green-600" />
                  {c.recruitmentType}
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <Building2 className="h-4 w-4 mr-1 text-yellow-600" />
                  {c.modeOfVisit}
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <Layers className="h-4 w-4 mr-1 text-purple-600" />
                  {c.branchList?.join(", ")}
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <Users className="h-4 w-4 mr-1 text-pink-600" />
                  {c.studentsRecruited} Students
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-green-700 font-semibold text-md">
                    💰 {c.packageOffered} LPA
                  </span>
                  <span className="text-xs text-gray-500">
                    Added {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-auto max-w-[95vw] max-h-[95vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-200 transition z-50"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image */}
            <img
              src={selectedImage}
              alt="Preview"
              className="w-auto h-auto max-w-[95vw] max-h-[95vh] object-scale-down rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
