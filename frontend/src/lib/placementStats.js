// Shared placement statistics maths.
// Used by the public statistics page and the admin editor so both always
// show the same numbers, worked out from the male/female counts.

export const PROGRAM_NAMES = {
  AT: "Automobile Engineering",
  CE: "Civil Engineering",
  CH: "Chemical Engineering",
  CS: "Computer Science Engineering",
  EC: "Electronics & Communication Engineering",
  EE: "Electrical & Electronics Engineering",
  ME: "Mechanical Engineering",
  PO: "Polymer Technology",
};

// Each group is entered as male + female; the total is always calculated
export const STAT_GROUPS = [
  { key: "strength", label: "Total Student Strength", short: "Strength", male: "male", female: "female" },
  { key: "passed", label: "Total Students Passed", short: "Passed", male: "passedMale", female: "passedFemale" },
  { key: "placed", label: "Total Students Placed", short: "Placed", male: "placedMale", female: "placedFemale" },
  { key: "higher", label: "Opted for Higher Studies", short: "Higher Studies", male: "higherMale", female: "higherFemale" },
  { key: "dropout", label: "Dropouts / Backlogs", short: "Dropouts", male: "dropoutMale", female: "dropoutFemale" },
  { key: "entrepreneur", label: "Entrepreneurs", short: "Entrepreneurs", male: "entrepreneurMale", female: "entrepreneurFemale" },
];

const num = (value) => Number(value) || 0;

// Placement % = students placed / total student strength.
// Returns null when there are no students, so the page can show "–"
// instead of a misleading 0%.
export const percent = (part, whole) =>
  whole > 0 ? (part / whole) * 100 : null;

export const formatPercent = (value) =>
  value === null ? "–" : `${value.toFixed(2).replace(/\.?0+$/, "")}%`;

const withPercent = (row) => ({
  ...row,
  percentage: {
    male: percent(row.placed.male, row.strength.male),
    female: percent(row.placed.female, row.strength.female),
    total: percent(row.placed.total, row.strength.total),
  },
});

export function computeProgram(p) {
  const row = { program: p.program };

  STAT_GROUPS.forEach((g) => {
    const male = num(p[g.male]);
    const female = num(p[g.female]);
    row[g.key] = { male, female, total: male + female };
  });

  // Old records may have only a total and no male/female split
  if (row.strength.total === 0) row.strength.total = num(p.total);

  return withPercent(row);
}

export function computeYear(yearData) {
  const rows = (yearData?.programs || []).map(computeProgram);

  const totals = { program: "Total" };
  STAT_GROUPS.forEach((g) => {
    totals[g.key] = { male: 0, female: 0, total: 0 };
    rows.forEach((r) => {
      totals[g.key].male += r[g.key].male;
      totals[g.key].female += r[g.key].female;
      totals[g.key].total += r[g.key].total;
    });
  });

  return { rows, totals: withPercent(totals) };
}

// Numbers that cannot be right — shown to the admin while editing
export function findWarnings(row) {
  const warnings = [];
  const check = (label, pick) => {
    if (pick(row.passed) > pick(row.strength))
      warnings.push(`${label} passed is more than ${label} strength`);
    if (pick(row.placed) > pick(row.strength))
      warnings.push(`${label} placed is more than ${label} strength`);
  };

  check("male", (g) => g.male);
  check("female", (g) => g.female);

  if (row.placed.total + row.higher.total > row.strength.total)
    warnings.push("placed + higher studies is more than total strength");
  if (row.passed.total + row.dropout.total > row.strength.total)
    warnings.push("passed + dropouts is more than total strength");

  return warnings;
}
