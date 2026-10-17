// Builds clean dropdown options from the (hand-typed) data, so filters can
// be picked from a list instead of typed. Different spellings of the same
// branch, city or company are grouped into one option.

import { PROGRAM_NAMES } from "./placementStats";

// ---------- Branch ----------
const BRANCH_ALIASES = {
  CSE: "CS",
  COMPUTER: "CS",
  ECE: "EC",
  ELECTRONICS: "EC",
  EEE: "EE",
  ELECTRICAL: "EE",
  CIVIL: "CE",
  CVIL: "CE",
  MECH: "ME",
  MECHANICAL: "ME",
  AUTO: "AT",
  AUTOMOBILE: "AT",
  CHEM: "CH",
  CHEMICAL: "CH",
  POLY: "PO",
  POLYMER: "PO",
};

export const branchCode = (raw) => {
  const code = String(raw || "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
  return BRANCH_ALIASES[code] || code;
};

export const branchLabel = (code) =>
  PROGRAM_NAMES[code] ? `${PROGRAM_NAMES[code]} (${code})` : code;

// Branch codes for the admin forms, in a fixed order
export const BRANCH_CODES = Object.keys(PROGRAM_NAMES);

// ---------- City ----------
// [text found anywhere in the location, city shown in the dropdown]
const CITY_PATTERNS = [
  ["bengaluru", "Bangalore"],
  ["bangalore", "Bangalore"],
  ["banglore", "Bangalore"],
  ["peenya", "Bangalore"],
  ["penya", "Bangalore"],
  ["jigani", "Bangalore"],
  ["jigni", "Bangalore"],
  ["mangaluru", "Mangalore"],
  ["mangalore", "Mangalore"],
  ["belagavi", "Belagavi"],
  ["belgaum", "Belagavi"],
  ["belguam", "Belagavi"],
  ["ballari", "Bellary"],
  ["bellary", "Bellary"],
  ["mysuru", "Mysore"],
  ["mysore", "Mysore"],
  ["chamaraja", "Chamarajanagar"],
];

const titleCase = (text) =>
  text.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());

export const cityOf = (raw) => {
  const text = String(raw || "").trim();
  const squashed = text.toLowerCase().replace(/[^a-z]/g, "");
  const match = CITY_PATTERNS.find(([pattern]) => squashed.includes(pattern));
  if (match) return match[1];

  // Otherwise use the last part, e.g. "Some Area, Chennai" -> "Chennai"
  const last = text.split(",").pop().trim();
  return last ? titleCase(last) : "";
};

// ---------- Company ----------
const COMPANY_FILLER_WORDS = new Set([
  "pvt",
  "private",
  "ltd",
  "limited",
  "limiteded",
  "india",
  "co",
  "company",
  "the",
  "inc",
  "llp",
]);

// "JSW Steel," / "JSW Steel " / "jsw steel ltd" -> "jswsteel"
export const companyKey = (raw) =>
  String(raw || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((word) => word && !COMPANY_FILLER_WORDS.has(word))
    .join("");

// ---------- Options ----------
// Groups values by key; each option is labelled with the spelling used most
export function buildOptions(values, keyOf, labelOf) {
  const groups = new Map();

  values.forEach((raw) => {
    const key = keyOf(raw);
    if (!key) return;

    const label = labelOf ? labelOf(raw, key) : String(raw).trim().replace(/,$/, "");
    const group = groups.get(key) || { key, labels: new Map() };
    group.labels.set(label, (group.labels.get(label) || 0) + 1);
    groups.set(key, group);
  });

  return [...groups.values()]
    .map(({ key, labels }) => ({
      value: key,
      label: [...labels.entries()].sort((a, b) => b[1] - a[1])[0][0],
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export const branchOptions = (values) =>
  buildOptions(values, branchCode, (raw, code) => branchLabel(code));

export const cityOptions = (values) =>
  buildOptions(values, cityOf, (raw, city) => city);

export const companyOptions = (values) => buildOptions(values, companyKey);
