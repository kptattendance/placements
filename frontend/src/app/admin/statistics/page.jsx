"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  STAT_GROUPS,
  computeYear,
  findWarnings,
  formatPercent,
} from "../../../lib/placementStats";

const PROGRAMS = ["AT", "CE", "CH", "CS", "EC", "EE", "ME", "PO"];

const GROUP_HEAD = {
  strength: "bg-sky-700",
  passed: "bg-pink-700",
  placed: "bg-emerald-700",
  higher: "bg-indigo-700",
  dropout: "bg-red-700",
  entrepreneur: "bg-amber-600",
};

const emptyProgram = (program) => {
  const p = { program };
  STAT_GROUPS.forEach((g) => {
    p[g.male] = 0;
    p[g.female] = 0;
  });
  return p;
};

export default function PlacementStatisticsManager() {
  const [data, setData] = useState(null);
  const [year, setYear] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL;

  // Load the year as soon as 4 digits are typed
  useEffect(() => {
    if (year.length !== 4) {
      setData(null);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setEditing(false);
      try {
        const res = await axios.get(`${API}/api/placements/${year}`);
        if (cancelled) return;
        setData(res.data);
        setIsNew(false);
      } catch (err) {
        if (cancelled) return;

        if (err.response?.status === 404) {
          toast.info(`No data for ${year} yet — fill the table and save`);
          setData({
            year: Number(year),
            isPublic: false,
            programs: PROGRAMS.map(emptyProgram),
          });
          setIsNew(true);
          setEditing(true);
        } else {
          toast.error("Failed to load data");
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [year, API]);

  // Totals and percentages are always calculated, never typed
  const computed = useMemo(() => (data ? computeYear(data) : null), [data]);

  const handleChange = (i, field, value) => {
    setData((prev) => ({
      ...prev,
      programs: prev.programs.map((p, idx) =>
        idx === i ? { ...p, [field]: Math.max(0, Number(value) || 0) } : p
      ),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = isNew
        ? await axios.post(`${API}/api/placements`, data)
        : await axios.put(`${API}/api/placements/${year}`, data);

      // Show exactly what the server stored
      setData(res.data);
      setEditing(false);
      setIsNew(false);
      toast.success(
        isNew ? "New year statistics added!" : "Statistics updated successfully!"
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save data");
    } finally {
      setSaving(false);
    }
  };

  const warnings = computed
    ? computed.rows.flatMap((row) =>
        findWarnings(row).map((w) => `${row.program}: ${w}`)
      )
    : [];

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-blue-700">
          Placement Statistics - {year || "Select Year"}
        </h1>

        {/* YEAR INPUT */}
        <input
          type="text"
          inputMode="numeric"
          placeholder="Enter Year (Ex: 2025)"
          value={year}
          maxLength={4}
          onChange={(e) => setYear(e.target.value.replace(/[^0-9]/g, ""))}
          className="border px-3 py-1.5 rounded-md w-44 text-gray-700"
        />

        {/* PUBLIC VISIBILITY TOGGLE */}
        {data && (
          <label className="flex items-center gap-2 font-medium text-gray-700">
            Visible on Public Website:
            <input
              type="checkbox"
              checked={data.isPublic || false}
              disabled={!editing}
              onChange={(e) =>
                setData((p) => ({ ...p, isPublic: e.target.checked }))
              }
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
          </label>
        )}

        {/* ACTION BUTTON */}
        {data &&
          (editing ? (
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 text-white px-4 py-1.5 rounded-md hover:bg-green-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : isNew ? "Add Year" : "Save"}
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-700 text-white px-4 py-1.5 rounded-md hover:bg-blue-800"
            >
              Edit
            </button>
          ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : computed ? (
        <>
          {editing && (
            <p className="mb-3 text-sm text-gray-600">
              Enter only the Male and Female counts. Totals and placement % are
              calculated automatically.
            </p>
          )}

          {/* WARNINGS */}
          {warnings.length > 0 && (
            <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              <p className="font-semibold mb-1">
                ⚠️ Please check these numbers:
              </p>
              <ul className="list-disc list-inside">
                {warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* TABLE */}
          <div className="overflow-x-auto max-w-full border rounded-lg">
            <table className="min-w-full border text-xs md:text-sm text-center">
              <thead className="text-white">
                <tr>
                  <th rowSpan={2} className="bg-blue-900 px-2 py-2 border">
                    Sl. No
                  </th>
                  <th rowSpan={2} className="bg-blue-900 px-2 py-2 border">
                    Program
                  </th>

                  {STAT_GROUPS.map((g) => (
                    <th
                      key={g.key}
                      colSpan={3}
                      className={`${GROUP_HEAD[g.key]} px-2 py-2 border whitespace-nowrap`}
                    >
                      {g.short}
                    </th>
                  ))}

                  <th colSpan={3} className="bg-purple-700 px-2 py-2 border">
                    % Placement
                  </th>
                </tr>

                <tr className="text-gray-700 font-semibold uppercase text-[10px] md:text-xs">
                  {[...STAT_GROUPS, { key: "percentage" }].map((g) =>
                    ["M", "F", "T"].map((h) => (
                      <th key={`${g.key}-${h}`} className="border p-1 bg-gray-50">
                        {h}
                      </th>
                    ))
                  )}
                </tr>
              </thead>

              <tbody>
                {computed.rows.map((row, i) => (
                  <tr
                    key={row.program}
                    className={`${i % 2 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50`}
                  >
                    <td className="border p-1">{i + 1}</td>
                    <td className="border p-1 font-semibold text-blue-700">
                      {row.program}
                    </td>

                    {STAT_GROUPS.map((g) => [
                      ...["male", "female"].map((sub) => (
                        <td key={`${g.key}-${sub}`} className="border p-1">
                          {editing ? (
                            <input
                              type="number"
                              min="0"
                              aria-label={`${row.program} ${g.short} ${sub}`}
                              value={row[g.key][sub]}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) =>
                                handleChange(i, g[sub], e.target.value)
                              }
                              className="w-14 border rounded text-center bg-white"
                            />
                          ) : (
                            row[g.key][sub]
                          )}
                        </td>
                      )),
                      <td
                        key={`${g.key}-total`}
                        className="border p-1 font-semibold bg-gray-100"
                      >
                        {row[g.key].total}
                      </td>,
                    ])}

                    {["male", "female", "total"].map((sub) => (
                      <td
                        key={sub}
                        className="border p-1 bg-purple-50 whitespace-nowrap"
                      >
                        {formatPercent(row.percentage[sub])}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* TOTAL ROW */}
                <tr className="bg-blue-100 font-semibold">
                  <td colSpan={2} className="border p-2">
                    Total
                  </td>

                  {STAT_GROUPS.map((g) =>
                    ["male", "female", "total"].map((sub) => (
                      <td key={`${g.key}-${sub}`} className="border p-1">
                        {computed.totals[g.key][sub]}
                      </td>
                    ))
                  )}

                  {["male", "female", "total"].map((sub) => (
                    <td key={sub} className="border p-1 whitespace-nowrap">
                      {formatPercent(computed.totals.percentage[sub])}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            % Placement = students placed ÷ total student strength.
          </p>
        </>
      ) : (
        <p className="text-center text-gray-500">Enter year to load data</p>
      )}
    </div>
  );
}
