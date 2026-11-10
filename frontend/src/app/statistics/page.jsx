"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllPlacementYears } from "./api";
import {
  PROGRAM_NAMES,
  STAT_GROUPS,
  computeYear,
  formatPercent,
} from "../../lib/placementStats";

// Header colour + cell tint for each column group of the detailed tables
const DARK = { head: "bg-blue-900", cell: "bg-blue-50", total: "bg-blue-200" };
const BRONZE = { head: "bg-blue-700", cell: "bg-white", total: "bg-blue-100" };
const GROUP_STYLES = {
  strength: DARK,
  passed: BRONZE,
  placed: DARK,
  higher: BRONZE,
  dropout: DARK,
  entrepreneur: BRONZE,
  percentage: { head: "bg-blue-400 text-blue-900!", cell: "bg-blue-100", total: "bg-blue-300" },
};

const SUB_COLUMNS = ["male", "female", "total"];

// Placement % → cell colour, light cream (low) to bronze (high)
const HEAT_STEPS = [
  { min: 85, cls: "bg-blue-600 text-white", label: "85%+" },
  { min: 70, cls: "bg-blue-400 text-blue-900", label: "70–85%" },
  { min: 55, cls: "bg-blue-300 text-blue-900", label: "55–70%" },
  { min: 40, cls: "bg-blue-200 text-blue-900", label: "40–55%" },
  { min: 0, cls: "bg-blue-50 text-blue-900", label: "below 40%" },
];
const heatClass = (pct) =>
  pct === null ? "bg-white text-gray-400" : HEAT_STEPS.find((s) => pct >= s.min).cls;

export default function PlacementStatsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getAllPlacementYears()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];

        // 🔥 Show only PUBLIC years (Admin visibility toggle), latest first
        setStats(
          list
            .filter((item) => item.isPublic === true)
            .sort((a, b) => b.year - a.year)
        );
      })
      .catch((err) => {
        console.error("Failed to load placement statistics:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  // Every year worked out once: [{ year, rows, totals }]
  const years = useMemo(
    () => stats.map((s) => ({ year: s.year, ...computeYear(s) })),
    [stats]
  );

  const latest = years[0];

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-5 md:py-6 px-3 sm:px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title row */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
              Placement Statistics
            </h1>
            <p className="text-sm text-gray-600">
              Year-wise and branch-wise placement record of KPT Mangalore
            </p>
          </div>

          {latest && (
            <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
              <Chip label="Latest batch" value={latest.year} />
              <Chip label="Placed" value={latest.totals.placed.total} />
              <Chip
                label="Placement"
                value={formatPercent(latest.totals.percentage.total)}
                strong
              />
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid gap-4 xl:grid-cols-2" aria-label="Loading">
            {[0, 1].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-blue-100" />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-gray-600 py-16">
            Could not load placement statistics. Please{" "}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="font-semibold text-blue-700 underline"
            >
              try again
            </button>
            .
          </p>
        ) : years.length === 0 ? (
          <p className="text-center text-gray-500 py-16">
            Placement statistics will be published soon.
          </p>
        ) : (
          <>
            {/* Everything at a glance */}
            <div className="grid gap-4 xl:grid-cols-2 mb-4">
              <YearOverview years={years} />
              <BranchMatrix years={years} />
            </div>

            {/* Jump links to each year's full table */}
            <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-gray-600">Detailed tables:</span>
              {years.map((y) => (
                <a
                  key={y.year}
                  href={`#year-${y.year}`}
                  className="rounded-full border border-blue-200 bg-white px-3 py-1 font-semibold text-blue-800 hover:bg-blue-100"
                >
                  {y.year}
                </a>
              ))}
            </nav>

            <div className="space-y-4">
              {years.map((y) => (
                <DetailTable key={y.year} data={y} />
              ))}
            </div>

            <p className="mt-4 text-xs text-gray-500">
              % Placement = students placed ÷ total student strength. “–”
              means there were no students in that group.
            </p>
          </>
        )}
      </div>
    </main>
  );
}

function Chip({ label, value, strong }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 shadow-sm ${
        strong
          ? "border-blue-400 bg-blue-400 text-blue-900"
          : "border-blue-200 bg-white text-gray-600"
      }`}
    >
      {label}
      <strong className="text-blue-900">{value}</strong>
    </span>
  );
}

function Card({ title, subtitle, children, id }) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-2xl border border-blue-200 bg-white shadow-sm overflow-hidden"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-blue-200 bg-blue-50 px-4 py-2.5">
        <h2 className="text-lg font-bold text-blue-900">{title}</h2>
        {subtitle}
      </div>
      {children}
    </section>
  );
}

/* ---------------------------------------
   One row per passing year
--------------------------------------- */
function YearOverview({ years }) {
  const cols = [
    ["Strength", (t) => t.strength.total],
    ["Passed", (t) => t.passed.total],
    ["Placed", (t) => t.placed.total],
    // Hidden on phones so the Placement % column fits on screen
    ["Higher Studies", (t) => t.higher.total, "hidden sm:table-cell"],
    ["Dropouts", (t) => t.dropout.total, "hidden sm:table-cell"],
  ];

  return (
    <Card
      title="Year-wise Summary"
      subtitle={<span className="text-xs text-gray-500">All branches together</span>}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-blue-900 text-xs uppercase tracking-wide text-blue-100">
              <th className="px-3 py-2 text-left">Year</th>
              {cols.map(([title, , cls = ""]) => (
                <th key={title} className={`px-2 py-2 text-right whitespace-nowrap ${cls}`}>
                  {title}
                </th>
              ))}
              <th className="px-3 py-2 text-left sm:min-w-[9rem]">Placement %</th>
            </tr>
          </thead>
          <tbody>
            {years.map(({ year, totals }, i) => {
              const pct = totals.percentage.total;
              return (
                <tr
                  key={year}
                  className={`border-t border-blue-100 ${i % 2 ? "bg-blue-50/60" : "bg-white"}`}
                >
                  <td className="px-3 py-2">
                    <a href={`#year-${year}`} className="font-bold text-blue-800 hover:underline">
                      {year}
                    </a>
                  </td>
                  {cols.map(([title, pick, cls = ""]) => (
                    <td key={title} className={`px-2 py-2 text-right tabular-nums text-gray-800 ${cls}`}>
                      {pick(totals)}
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="hidden sm:block h-2 flex-1 rounded-full bg-blue-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${Math.min(pct ?? 0, 100)}%` }}
                        />
                      </div>
                      <span className="w-14 text-right text-sm font-semibold tabular-nums text-blue-900">
                        {formatPercent(pct)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ---------------------------------------
   Branch × year grid of placement %
--------------------------------------- */
function BranchMatrix({ years }) {
  const programs = [
    ...new Set(years.flatMap((y) => y.rows.map((r) => r.program))),
  ];

  return (
    <Card
      title="Branch-wise Placement %"
      subtitle={
        <div className="flex flex-wrap items-center gap-1 text-[11px] text-gray-600">
          {[...HEAT_STEPS].reverse().map((s) => (
            <span key={s.label} className="inline-flex items-center gap-1">
              <span className={`inline-block h-3 w-3 rounded-sm border border-blue-200 ${s.cls}`} />
              {s.label}
            </span>
          ))}
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-blue-900 text-xs uppercase tracking-wide text-blue-100">
              <th className="px-3 py-2 text-left">Branch</th>
              {years.map((y) => (
                <th key={y.year} className="px-2 py-2 text-center">
                  {y.year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr key={program} className="border-t border-white">
                <td
                  className="px-3 py-1.5 font-semibold text-gray-800 whitespace-nowrap"
                  title={PROGRAM_NAMES[program]}
                >
                  <span className="sm:hidden">{program}</span>
                  <span className="hidden sm:inline">
                    {PROGRAM_NAMES[program] || program}
                  </span>
                </td>
                {years.map((y) => {
                  const row = y.rows.find((r) => r.program === program);
                  const pct = row ? row.percentage.total : null;
                  return (
                    <td
                      key={y.year}
                      title={
                        row
                          ? `${program} ${y.year}: ${row.placed.total} placed of ${row.strength.total}`
                          : undefined
                      }
                      className={`border-l border-white px-2 py-1.5 text-center text-xs font-semibold tabular-nums ${heatClass(pct)}`}
                    >
                      {pct === null ? "–" : `${Math.round(pct)}%`}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ---------------------------------------
   Full table for one year
--------------------------------------- */
function DetailTable({ data }) {
  const { year, rows, totals } = data;
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
            className={`border border-gray-200 px-1.5 py-1.5 tabular-nums ${
              isTotal ? style.total : style.cell
            } ${sub === "total" ? "font-semibold" : ""}`}
          >
            {g.key === "percentage" ? formatPercent(value) : value}
          </td>
        );
      })
    );

  return (
    <Card
      id={`year-${year}`}
      title={`Passing Year ${year}`}
      subtitle={
        <div className="flex flex-wrap gap-2 text-xs">
          <Chip label="Strength" value={totals.strength.total} />
          <Chip label="Placed" value={totals.placed.total} />
          <Chip label="Placement" value={formatPercent(totals.percentage.total)} strong />
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-[13px] text-center border-collapse">
          <thead>
            <tr className="text-white">
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
                  className={`${GROUP_STYLES[g.key].head} px-2 py-1.5 border border-gray-200 whitespace-nowrap`}
                  title={g.label}
                >
                  {g.short}
                </th>
              ))}
            </tr>
            <tr className="text-gray-700 text-xs">
              {groups.map((g) =>
                ["M", "F", "Total"].map((h) => (
                  <th
                    key={`${g.key}-${h}`}
                    title={h === "M" ? "Male" : h === "F" ? "Female" : "Total"}
                    className="border border-gray-200 px-1.5 py-1 bg-gray-50 font-semibold"
                  >
                    {h}
                  </th>
                ))
              )}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.program} className="hover:brightness-95">
                <td
                  title={PROGRAM_NAMES[row.program]}
                  className="border border-gray-200 px-3 py-1.5 font-semibold text-blue-800 bg-white sticky left-0"
                >
                  {row.program}
                </td>
                {renderCells(row, false)}
              </tr>
            ))}

            <tr className="font-semibold text-gray-900">
              <td className="border border-gray-200 px-3 py-1.5 bg-blue-100 sticky left-0">
                Total
              </td>
              {renderCells(totals, true)}
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
