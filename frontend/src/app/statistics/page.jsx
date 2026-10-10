"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  GraduationCap,
  Briefcase,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { getAllPlacementYears } from "./api";
import {
  PROGRAM_NAMES,
  STAT_GROUPS,
  computeYear,
  formatPercent,
} from "../../lib/placementStats";

// Header colour + cell tint for each column group
const GROUP_STYLES = {
  strength: { head: "bg-sky-700", cell: "bg-sky-50", total: "bg-sky-100" },
  passed: { head: "bg-pink-700", cell: "bg-pink-50", total: "bg-pink-100" },
  placed: { head: "bg-emerald-700", cell: "bg-emerald-50", total: "bg-emerald-100" },
  higher: { head: "bg-indigo-700", cell: "bg-indigo-50", total: "bg-indigo-100" },
  dropout: { head: "bg-red-700", cell: "bg-red-50", total: "bg-red-100" },
  entrepreneur: { head: "bg-amber-600", cell: "bg-amber-50", total: "bg-amber-100" },
  percentage: { head: "bg-purple-700", cell: "bg-purple-50", total: "bg-purple-100" },
};

const SUB_COLUMNS = ["male", "female", "total"];

export default function PlacementStatsPage() {
  const [stats, setStats] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getAllPlacementYears()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];

        // 🔥 Show only PUBLIC years (Admin visibility toggle), latest first
        const sorted = list
          .filter((item) => item.isPublic === true)
          .sort((a, b) => b.year - a.year);

        setStats(sorted);
        setSelectedYear(sorted[0]?.year ?? null);
      })
      .catch((err) => {
        console.error("Failed to load placement statistics:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const yearData = stats.find((s) => s.year === selectedYear);
  const computed = useMemo(
    () => (yearData ? computeYear(yearData) : null),
    [yearData]
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2 text-center">
          Placement Statistics
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Year-wise and branch-wise placement record of KPT Mangalore
        </p>

        {loading ? (
          <p className="text-center text-gray-500 py-16">
            Loading statistics...
          </p>
        ) : error ? (
          <p className="text-center text-red-600 py-16">
            Could not load placement statistics. Please try again later.
          </p>
        ) : !computed ? (
          <p className="text-center text-gray-500 py-16">
            Placement statistics will be published soon.
          </p>
        ) : (
          <>
            {/* YEAR SELECTOR */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              <span className="text-sm font-medium text-gray-600 mr-1">
                Passing Year
              </span>
              {stats.map((s) => (
                <button
                  key={s.year}
                  type="button"
                  onClick={() => setSelectedYear(s.year)}
                  aria-pressed={s.year === selectedYear}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    s.year === selectedYear
                      ? "bg-blue-700 text-white shadow"
                      : "bg-white text-blue-800 border border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  {s.year}
                </button>
              ))}
            </div>

            <YearSummary totals={computed.totals} />
            <BranchBars rows={computed.rows} year={selectedYear} />
            <DetailTable computed={computed} year={selectedYear} />
          </>
        )}
      </div>
    </main>
  );
}

/* ---------------------------------------
   Headline numbers for the selected year
--------------------------------------- */
function YearSummary({ totals }) {
  const tiles = [
    { icon: Users, label: "Total Strength", value: totals.strength.total },
    { icon: GraduationCap, label: "Students Passed", value: totals.passed.total },
    { icon: Briefcase, label: "Students Placed", value: totals.placed.total },
    { icon: BookOpen, label: "Higher Studies", value: totals.higher.total },
    {
      icon: TrendingUp,
      label: "Placement %",
      value: formatPercent(totals.percentage.total),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {tiles.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="bg-white rounded-2xl border border-blue-100 shadow-sm p-4 last:col-span-2 md:last:col-span-1"
        >
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Icon className="h-4 w-4 text-blue-700" />
            {label}
          </div>
          <div className="mt-2 text-3xl font-bold text-blue-900">{value}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------
   Branch-wise placement % bars
--------------------------------------- */
function BranchBars({ rows, year }) {
  return (
    <section className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 md:p-6 mb-8">
      <h2 className="text-lg font-semibold text-blue-900">
        Branch-wise Placement % — {year}
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Students placed out of total student strength
      </p>

      <div className="space-y-3">
        {rows.map((r) => {
          const pct = r.percentage.total;
          const name = PROGRAM_NAMES[r.program] || r.program;

          return (
            <div
              key={r.program}
              title={`${name}: ${r.placed.total} placed out of ${r.strength.total}`}
              className="grid grid-cols-[2.5rem_1fr_auto] md:grid-cols-[17rem_1fr_auto] items-center gap-3 rounded-lg px-1 py-1 hover:bg-blue-50"
            >
              <div className="text-sm font-semibold text-gray-800 truncate">
                <span className="md:hidden">{r.program}</span>
                <span className="hidden md:inline">{name}</span>
              </div>

              <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-r bg-blue-600"
                  style={{ width: `${Math.min(pct ?? 0, 100)}%` }}
                />
              </div>

              <div className="text-sm text-right tabular-nums w-28">
                <span className="font-semibold text-gray-900">
                  {formatPercent(pct)}
                </span>
                <span className="text-gray-500">
                  {" "}
                  ({r.placed.total}/{r.strength.total})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------------------------------
   Full table
--------------------------------------- */
function DetailTable({ computed, year }) {
  const groups = [
    ...STAT_GROUPS,
    { key: "percentage", label: "% Placement", short: "% Placement" },
  ];

  const renderCells = (row, isTotal) =>
    groups.map((g) =>
      SUB_COLUMNS.map((sub) => {
        const value = row[g.key][sub];
        const style = GROUP_STYLES[g.key];

        return (
          <td
            key={`${g.key}-${sub}`}
            className={`border border-gray-200 px-1.5 py-2 tabular-nums ${
              isTotal ? style.total : style.cell
            } ${sub === "total" ? "font-semibold" : ""}`}
          >
            {g.key === "percentage" ? formatPercent(value) : value}
          </td>
        );
      })
    );

  return (
    <section className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 md:p-6">
      <h2 className="text-lg font-semibold text-blue-900 mb-3">
        Detailed Statistics — Passing Year {year}
      </h2>

      <p className="lg:hidden text-xs text-gray-500 mb-2">
        Swipe the table sideways to see all columns →
      </p>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-[13px] text-center border-collapse">
          <thead>
            {/* --- HEADER ROW --- */}
            <tr className="text-white">
              <th
                rowSpan={2}
                className="bg-blue-900 px-2 py-2 border border-gray-200"
              >
                Sl. No.
              </th>
              <th
                rowSpan={2}
                className="bg-blue-900 px-3 py-2 border border-gray-200 sticky left-0 z-10"
              >
                Program
              </th>

              {groups.map((g) => (
                <th
                  key={g.key}
                  colSpan={3}
                  className={`${GROUP_STYLES[g.key].head} px-2 py-2 border border-gray-200 whitespace-nowrap`}
                  title={g.label}
                >
                  {g.short}
                </th>
              ))}
            </tr>

            {/* --- SUB HEADER --- */}
            <tr className="text-gray-700 text-xs">
              {groups.map((g) =>
                ["Male", "Female", "Total"].map((h) => (
                  <th
                    key={`${g.key}-${h}`}
                    className="border border-gray-200 px-1.5 py-1 bg-gray-50 font-semibold"
                  >
                    {h}
                  </th>
                ))
              )}
            </tr>
          </thead>

          <tbody>
            {computed.rows.map((row, i) => (
              <tr key={row.program} className="hover:brightness-95">
                <td className="border border-gray-200 px-2 py-2 bg-white">
                  {i + 1}
                </td>
                <td
                  title={PROGRAM_NAMES[row.program]}
                  className="border border-gray-200 px-3 py-2 font-semibold text-blue-800 bg-white sticky left-0"
                >
                  {row.program}
                </td>
                {renderCells(row, false)}
              </tr>
            ))}

            {/* TOTAL ROW */}
            <tr className="font-semibold text-gray-900">
              <td
                colSpan={2}
                className="border border-gray-200 px-3 py-2 bg-blue-100 sticky left-0"
              >
                Total
              </td>
              {renderCells(computed.totals, true)}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        % Placement = students placed ÷ total student strength. “–” means there
        were no students in that group.
      </p>
    </section>
  );
}
