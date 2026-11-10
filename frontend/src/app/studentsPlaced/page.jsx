"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Users, Building2, TrendingUp, Award } from "lucide-react";
import { getData } from "../../lib/fetchData";
import {
  branchCode,
  branchOptions,
  cityOf,
  cityOptions,
  companyKey,
  companyOptions,
} from "../../lib/filterOptions";
import { PROGRAM_NAMES } from "../../lib/placementStats";
import { cldImage } from "../../lib/images";

const EMPTY_FILTERS = { year: "", branch: "", company: "", location: "" };

const SELECT_CLASS =
  "w-full min-w-0 sm:w-44 bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none";

// ✅ Convert to Title Case
function toTitleCase(str) {
  if (!str) return "";
  return str
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const formatLPA = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? `${n.toFixed(2)} LPA` : "–";
};

export default function PlacedStudents() {
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState(null); // student whose photo is enlarged

  // ✅ Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData("/api/placed-students");

        // Latest passing year first; newest entries first within a year
        const sorted = [...(data || [])].sort(
          (a, b) =>
            (b.yearOfPassing || 0) - (a.yearOfPassing || 0) ||
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        setStudents(sorted);
      } catch (error) {
        console.error("Error fetching placed students:", error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Apply Filters
  const filtered = useMemo(
    () =>
      students.filter(
        (s) =>
          (!filters.year || String(s.yearOfPassing) === filters.year) &&
          (!filters.branch || branchCode(s.branch) === filters.branch) &&
          (!filters.company || companyKey(s.companyName) === filters.company) &&
          (!filters.location || cityOf(s.location) === filters.location)
      ),
    [students, filters]
  );

  // ✅ Dropdown choices, built from the students' data
  const options = useMemo(
    () => ({
      year: [...new Set(students.map((s) => s.yearOfPassing))]
        .filter(Boolean)
        .sort((a, b) => b - a)
        .map((y) => ({ value: String(y), label: String(y) })),
      branch: branchOptions(students.map((s) => s.branch)),
      company: companyOptions(students.map((s) => s.companyName)),
      location: cityOptions(students.map((s) => s.location)),
    }),
    [students]
  );

  // ✅ Headline numbers for what is currently shown
  const summary = useMemo(() => {
    const packages = filtered
      .map((s) => Number(s.packageOffered))
      .filter((n) => Number.isFinite(n) && n > 0);
    return {
      students: filtered.length,
      companies: new Set(filtered.map((s) => companyKey(s.companyName))).size,
      highest: packages.length ? Math.max(...packages) : null,
      average: packages.length
        ? packages.reduce((a, b) => a + b, 0) / packages.length
        : null,
    };
  }, [filtered]);

  const handleChange = (field, value) =>
    setFilters((prev) => ({ ...prev, [field]: value }));

  const filterSelects = [
    ["year", "All Years"],
    ["branch", "All Branches"],
    ["company", "All Companies"],
    ["location", "All Locations"],
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 py-5 md:py-6 px-3 sm:px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title on the left, headline numbers on the right — one compact row */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
              Placed Students
            </h1>
            <p className="text-sm text-gray-600">
              Celebrating our students and the companies that chose them
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { icon: Users, label: "Students", value: summary.students },
              { icon: Building2, label: "Companies", value: summary.companies },
              {
                icon: Award,
                label: "Highest",
                value: summary.highest ? formatLPA(summary.highest) : "–",
              },
              {
                icon: TrendingUp,
                label: "Average",
                value: summary.average ? formatLPA(summary.average) : "–",
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs sm:text-sm shadow-sm"
              >
                <Icon className="h-4 w-4 text-blue-600" />
                <span className="text-gray-600">{label}</span>
                <strong className="text-blue-900">{loading ? "…" : value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        {loadError ? (
          <p className="text-center text-gray-600 py-10">
            Could not load placed students right now. Please{" "}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="font-semibold text-blue-700 underline"
            >
              try again
            </button>
            .
          </p>
        ) : (
          <div className="rounded-2xl border border-blue-200 bg-white shadow-md overflow-hidden">
            {/* Filters and count sit in the table's own top bar */}
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between px-3 py-3 border-b border-blue-200 bg-blue-50">
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
                {filterSelects.map(([field, all]) => (
                  <select
                    key={field}
                    value={filters[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    aria-label={all}
                    className={SELECT_CLASS}
                  >
                    <option value="">{all}</option>
                    {options[field].map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ))}

                <button
                  type="button"
                  onClick={() => setFilters(EMPTY_FILTERS)}
                  className="col-span-2 sm:col-span-1 bg-blue-900 text-blue-100 text-sm px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
                >
                  Clear
                </button>
              </div>

              <p className="text-sm text-gray-600 whitespace-nowrap">
                Showing{" "}
                <strong className="text-blue-800">{filtered.length}</strong>{" "}
                {filtered.length === 1 ? "student" : "students"}
                <span className="hidden sm:inline text-xs text-gray-500">
                  {" "}
                  · tap a photo to enlarge
                </span>
              </p>
            </div>

            {/* Only this box scrolls; the column titles stay in place */}
            <div className="max-h-[calc(100vh-15rem)] min-h-[22rem] overflow-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-blue-100">
                    {[
                      ["#", "hidden md:table-cell w-12 text-center"],
                      ["Student", ""],
                      ["Branch", "hidden md:table-cell"],
                      ["Company", ""],
                      ["Location", "hidden lg:table-cell"],
                      ["Year", "hidden md:table-cell text-center"],
                      ["Package", "text-right"],
                    ].map(([title, cls]) => (
                      <th
                        key={title}
                        scope="col"
                        className={`sticky top-0 z-10 bg-blue-900 px-3 sm:px-4 py-3 font-semibold ${cls}`}
                      >
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className={i % 2 ? "bg-blue-50/70" : "bg-white"}>
                        <td colSpan={7} className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-blue-200" />
                            <div className="h-3 w-1/2 animate-pulse rounded bg-blue-200" />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                        No students match your filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((s, i) => {
                      const code = branchCode(s.branch);
                      return (
                        <tr
                          key={s._id}
                          className={`border-t border-blue-100 transition-colors hover:bg-blue-100 ${
                            i % 2 ? "bg-blue-50/70" : "bg-white"
                          }`}
                        >
                          <td className="hidden md:table-cell px-3 py-2 text-center text-gray-400 tabular-nums">
                            {i + 1}
                          </td>

                          {/* Student: photo, name, reg no (and branch on phones) */}
                          <td className="px-3 sm:px-4 py-2">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setSelected(s)}
                                aria-label={`Enlarge photo of ${toTitleCase(s.name)}`}
                                className="shrink-0 rounded-full ring-2 ring-blue-400 ring-offset-2 ring-offset-white transition hover:scale-105 focus-visible:outline-none focus-visible:ring-blue-600"
                              >
                                <img
                                  src={cldImage(s.image?.url, 120) || "/logo.jpg"}
                                  alt=""
                                  loading="lazy"
                                  decoding="async"
                                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover bg-blue-100"
                                />
                              </button>
                              <div className="min-w-0">
                                <div className="font-semibold text-gray-900 break-words">
                                  {toTitleCase(s.name)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {s.registerNumber?.trim().toUpperCase()}
                                  <span className="md:hidden">
                                    {" · "}
                                    {code}
                                    {" · "}
                                    {s.yearOfPassing}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="hidden md:table-cell px-4 py-2">
                            <span
                              title={PROGRAM_NAMES[code] || s.branch}
                              className="inline-block rounded-full border border-blue-300 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700"
                            >
                              {code}
                            </span>
                          </td>

                          {/* Company (designation, and location on phones) */}
                          <td className="px-3 sm:px-4 py-2">
                            <div className="font-medium text-gray-900 break-words">
                              {toTitleCase(s.companyName)}
                            </div>
                            {s.designation && (
                              <div className="text-xs text-gray-500">
                                {toTitleCase(s.designation)}
                              </div>
                            )}
                            <div className="lg:hidden text-xs text-gray-500">
                              {toTitleCase(s.location)}
                            </div>
                          </td>

                          <td className="hidden lg:table-cell px-4 py-2 text-gray-700">
                            {toTitleCase(s.location)}
                          </td>

                          <td className="hidden md:table-cell px-4 py-2 text-center text-gray-700 tabular-nums">
                            {s.yearOfPassing}
                          </td>

                          <td className="px-3 sm:px-4 py-2 text-right">
                            <span className="inline-block whitespace-nowrap rounded-full bg-blue-400/20 px-2.5 py-1 text-xs sm:text-sm font-bold text-blue-800 tabular-nums">
                              {formatLPA(s.packageOffered)}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <PhotoViewer student={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}

/* ---------------------------------------
   Enlarged photo
--------------------------------------- */
function PhotoViewer({ student, onClose }) {
  const [sharpLoaded, setSharpLoaded] = useState(false);
  const url = student.image?.url;

  // Close with Esc, and stop the page behind from scrolling
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={toTitleCase(student.name)}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 rounded-full bg-blue-900/80 p-2 text-blue-100 hover:bg-blue-900"
        >
          <X className="h-5 w-5" />
        </button>

        {/* The small photo (already downloaded) shows at once; the sharp one fades in */}
        <div className="relative aspect-[4/5] w-full bg-blue-100">
          <img
            src={cldImage(url, 120) || "/logo.jpg"}
            alt=""
            className="absolute inset-0 h-full w-full object-cover blur-[2px]"
          />
          {url && (
            <img
              src={cldImage(url, 800)}
              alt={toTitleCase(student.name)}
              onLoad={() => setSharpLoaded(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                sharpLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>

        <div className="border-t-4 border-blue-400 p-4 text-center">
          <h2 className="text-xl font-bold text-blue-900">
            {toTitleCase(student.name)}
          </h2>
          <p className="text-sm text-gray-600">
            {PROGRAM_NAMES[branchCode(student.branch)] || student.branch} ·{" "}
            {student.yearOfPassing}
          </p>
          <p className="mt-2 font-semibold text-blue-700">
            {toTitleCase(student.companyName)}
          </p>
          <span className="mt-2 inline-block rounded-full bg-blue-400/20 px-3 py-1 text-sm font-bold text-blue-800">
            {formatLPA(student.packageOffered)}
          </span>
        </div>
      </div>
    </div>
  );
}
