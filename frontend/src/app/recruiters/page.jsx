"use client";

import React from "react";

const recruiters = [
  {
    name: "Towel Engineering Group",
    location: "Oman",
    dept: "AT, ME",
    pkg: 95000,
  },
  {
    name: "Asian Paints",
    location: "Mysore",
    dept: "CH, ME, EEE, EC",
    pkg: 60000,
  },
  { name: "Godrej", location: "Bangalore", dept: "Civil", pkg: 50000 },
  {
    name: "NextGen Recruitment Ventures Limited",
    location: "Kolkata",
    dept: "CSE, Electronics",
    pkg: 50000,
  },
  {
    name: "SBM Offshore!",
    location: "Bangalore",
    dept: "CE, ME, EE, Instrumentation",
    pkg: 40000,
  },
  {
    name: "TECHNOLOGICS GLOBAL Research & Project Lab",
    location: "Bangalore",
    dept: "ECE, EEE, EI, ETC, CS, IT, IS, MCA, ME, Civil",
    pkg: 37500,
  },
  { name: "ABB", location: "Bangalore", dept: "EC, EEE, ME, CH", pkg: 37500 },
  {
    name: "Ace Designers Ltd",
    location: "Bangalore",
    dept: "ME, EEE",
    pkg: 35000,
  },
  { name: "Acko", location: "Bangalore", dept: "AT, ME", pkg: 33750 },
  {
    name: "UltraTech Cement Limited",
    location: "Mangalore",
    dept: "ITI, Electricians, CH",
    pkg: 32000,
  },
  {
    name: "TVS Motor Company",
    location: "Mysore",
    dept: "ME, AT, CH",
    pkg: 31667,
  },
  {
    name: "Schneider Electric India Pvt. Ltd.",
    location: "Mysore",
    dept: "EEE, EC",
    pkg: 31250,
  },
  {
    name: "Forvia Inspiring Mobility",
    location: "Bangalore",
    dept: "Mechanical, Automobile",
    pkg: 31200,
  },
  {
    name: "Hindalco Industries Limited",
    location: "Belagavi",
    dept: "Chemical",
    pkg: 30000,
  },
  { name: "Epsilon", location: "Bellary", dept: "CH", pkg: 30000 },
  {
    name: "KPIT Technologies",
    location: "Pune",
    dept: "ECE, EEE, CS, AT, IC",
    pkg: 29167,
  },
  {
    name: "Saint-Gobain India Pvt. Ltd",
    location: "Bangalore",
    dept: "Chemical, Mechanical, Electrical",
    pkg: 28000,
  },
  {
    name: "PExcel Services Private Limited",
    location: "Bangalore",
    dept: "CS, IT",
    pkg: 28000,
  },
  { name: "Capgemini", location: "Bangalore", dept: "EEE, EC", pkg: 28000 },
  {
    name: "Aditya Birla Group",
    location: "Mumbai",
    dept: "ME, EC, Chemical, Petrochemical",
    pkg: 27500,
  },
  {
    name: "EcoEnergy Insights",
    location: "All India",
    dept: "EEE",
    pkg: 27000,
  },
  {
    name: "HFCL",
    location: "Telangana",
    dept: "Mechanical, Electrical, Electronics",
    pkg: 25000,
  },
  {
    name: "JSW VJNGR",
    location: "Bellary",
    dept: "Mechanical, Electrical, EEE, Instrumentation, Chemical",
    pkg: 25000,
  },
  {
    name: "Brevera Technologies Pvt Ltd",
    location: "Mysore",
    dept: "EC, EE",
    pkg: 25000,
  },
  {
    name: "K12 Techno Services Ltd",
    location: "Bangalore",
    dept: "Any",
    pkg: 25000,
  },
  {
    name: "Orchids The International School",
    location: "Bangalore",
    dept: "Any",
    pkg: 25000,
  },
  { name: "Winman Software", location: "Mangalore", dept: "Any", pkg: 25000 },
  { name: "Cipla", location: "Bangalore", dept: "Chemical", pkg: 25000 },
  {
    name: "Manjushree Technopack Limited",
    location: "Bangalore",
    dept: "ME, EEE",
    pkg: 25000,
  },
  {
    name: "Mahindra and Mahindra Ltd",
    location: "Bangalore",
    dept: "EEE, EC, Mechatronics",
    pkg: 25000,
  },
  {
    name: "Yazaki India Private Limited",
    location: "Bangalore",
    dept: "EEE, MECH, ECE, MTR",
    pkg: 24000,
  },
  {
    name: "Sobha Projects & Trade Private Limited (SPTL)",
    location: "Bengaluru",
    dept: "EE, ME",
    pkg: 23500,
  },
  {
    name: "Tata Power",
    location: "Mumbai",
    dept: "ME, EEE, CS, Mechatronics",
    pkg: 23333,
  },
  {
    name: "Sienna ECAD",
    location: "Bangalore",
    dept: "EC, ME, EEE, Mechatronics",
    pkg: 23333,
  },
  {
    name: "Volvo Autobots",
    location: "Ahmedabad",
    dept: "ME, AT, EC, EEE",
    pkg: 23000,
  },
  { name: "MCF", location: "Mangalore", dept: "EEE, ME, CH", pkg: 23000 },
  { name: "Tata Motors", location: "Gurgaon", dept: "Any", pkg: 22500 },
  {
    name: "Volvo Group India Pvt Ltd.",
    location: "Hoskote",
    dept: "Mechatronics, Metallurgical, EEE, E&C, ME, AT",
    pkg: 22350,
  },
  {
    name: "Saionics Middle East",
    location: "Mangalore",
    dept: "ECE, EEE",
    pkg: 22000,
  },
  {
    name: "JSW Paints Limited",
    location: "Bellary",
    dept: "Chemical, Mechanical, E&C",
    pkg: 21667,
  },
  { name: "Gummi", location: "Abhanakuppe", dept: "ME", pkg: 21000 },
  {
    name: "Niharika HR Solutions",
    location: "Bangalore",
    dept: "ME, EEE, EC",
    pkg: 21000,
  },
  {
    name: "Ajax Engineering Pvt Ltd",
    location: "Bangalore",
    dept: "Any",
    pkg: 21000,
  },
  {
    name: "Propel HR Management Services Pvt. Ltd.",
    location: "Doddaballapura",
    dept: "EC, EEE",
    pkg: 20437,
  },
  {
    name: "CERATIZIT India Pvt. Ltd.",
    location: "Bangalore",
    dept: "Mechanical, Mechatronics, Tool & Die",
    pkg: 20000,
  },
  { name: "Avaada", location: "Nagpur", dept: "EEE, ME, IC, EC", pkg: 20000 },
  {
    name: "Vidya Herbs Pvt Ltd",
    location: "Chikkamagalur/Belur",
    dept: "CH",
    pkg: 20000,
  },
  {
    name: "Dune Study Metro",
    location: "Mangalore",
    dept: "ME, EEE, EC",
    pkg: 19500,
  },
  {
    name: "Catasynth Speciality Chemicals Pvt Ltd",
    location: "Mangalore",
    dept: "CH",
    pkg: 19500,
  },
  {
    name: "INERGEIA SOLAR PVT. LTD.",
    location: "Mangalore",
    dept: "EEE",
    pkg: 19500,
  },
  {
    name: "Aarbee Structures Pvt Ltd.",
    location: "Bangalore",
    dept: "Civil",
    pkg: 19000,
  },
  {
    name: "Larsen & Toubro Limited",
    location: "Ahmedabad",
    dept: "Civil, ME, EEE, CS, IT",
    pkg: 19000,
  },
  {
    name: "CRONUS STEEL DETAILING PVT LTD.",
    location: "Mangalore",
    dept: "Civil",
    pkg: 19000,
  },
  {
    name: "SLN Facility Management Pvt. Ltd.",
    location: "Mangalore",
    dept: "EEE, EC",
    pkg: 19000,
  },
  {
    name: "Borson Systems!",
    location: "Bangalore",
    dept: "EC, EEE",
    pkg: 19000,
  },
  {
    name: "HL Klemove India Private Limited",
    location: "Chennai",
    dept: "Any",
    pkg: 18750,
  },
  {
    name: "ANAND Group",
    location: "Bangalore",
    dept: "ME, Auto, Mechatronics, EEE, ECE, E&I, Production, Manufacturing, Tool & Die",
    pkg: 18700,
  },
  {
    name: "Enthral Southasia Pvt Ltd",
    location: "Palakkad, Kerala",
    dept: "ME, EEE, EC, PO",
    pkg: 18500,
  },
  {
    name: "SANSERA ENGINEERING LIMITED",
    location: "Mangalore",
    dept: "ME",
    pkg: 18500,
  },
  { name: "Rossell Techsys", location: "Bangalore", dept: "EEE", pkg: 18333 },
  {
    name: "RSA Turbotech Pvt. Ltd.",
    location: "Bangalore",
    dept: "ME",
    pkg: 18333,
  },
  { name: "Trelleborg", location: "Bangalore", dept: "PO, ME", pkg: 18000 },
  { name: "United Toyota", location: "Mangalore", dept: "AT, ME", pkg: 18000 },
  {
    name: "Dynatech Tools & Devices Pvt. Ltd.",
    location: "Bangalore",
    dept: "Mechanical, Automation, Robotics",
    pkg: 18000,
  },
  { name: "ReNew", location: "Delhi", dept: "EEE", pkg: 18000 },
  { name: "MRPL", location: "Mangalore", dept: "CH, ME, EEE, EC", pkg: 18000 },
  {
    name: "FreezeSURE Cold Chain Logistics",
    location: "Bangalore",
    dept: "AT",
    pkg: 18000,
  },
  {
    name: "Sindhu Corporation",
    location: "Mangalore",
    dept: "Civil",
    pkg: 18000,
  },
  {
    name: "Kirloskar Electrical Company LTD-Unit-2",
    location: "Hubli",
    dept: "EEE, ME",
    pkg: 18000,
  },
  { name: "Metso", location: "Rajasthan", dept: "ME, CH", pkg: 18000 },
  {
    name: "Wipro Aerospace",
    location: "Bangalore",
    dept: "CH, EEE, EC",
    pkg: 17500,
  },
  {
    name: "Toyota Industries Engine India Pvt. Ltd",
    location: "Bangalore",
    dept: "AT, ME",
    pkg: 17500,
  },
  {
    name: "Unnathi Infra Design Solution",
    location: "Mangalore",
    dept: "Civil",
    pkg: 17000,
  },
  {
    name: "Accord Software & Systems Pvt. Ltd",
    location: "Bangalore",
    dept: "EEE, EC",
    pkg: 17000,
  },
  {
    name: "Hitachi Terminal Solutions India Pvt. Ltd.",
    location: "Bangalore",
    dept: "AT, ME",
    pkg: 17000,
  },
  { name: "SKHM India Pvt Ltd", location: "Pune", dept: "AT, ME", pkg: 17000 },
  {
    name: "Magna Automotive India Pvt. Ltd.",
    location: "Pune",
    dept: "AT, ME",
    pkg: 17000,
  },
  {
    name: "Selmount Power Systems Pvt. Ltd.",
    location: "Bangalore",
    dept: "EEE",
    pkg: 16667,
  },
  {
    name: "Ascenso Tyres",
    location: "Gujarat",
    dept: "Diploma Engineer Trainee",
    pkg: 16500,
  },
  {
    name: "Hubert Enviro Care System Pvt. Ltd.",
    location: "Mangalore",
    dept: "ME, EEE, CH, EC, ITI",
    pkg: 16000,
  },
  {
    name: "Bell O Seal Valves Pvt Ltd",
    location: "Udupi",
    dept: "ME, ITI",
    pkg: 16000,
  },
  {
    name: "Simpel Techlabs Pvt Ltd",
    location: "Bangalore",
    dept: "CS, EC",
    pkg: 16000,
  },
  { name: "Adecco India", location: "Kolar", dept: "EEE, EC, ME", pkg: 15833 },
  {
    name: "SKF Engineering & Lubrication Pvt Ltd",
    location: "Mysore",
    dept: "Any",
    pkg: 15700,
  },
  {
    name: "Digital Growth Technology",
    location: "Bhopal / WFH",
    dept: "EC, EEE, CS",
    pkg: 15500,
  },
  { name: "INDO MIM", location: "Mangalore", dept: "ME, EC", pkg: 15150 },
  {
    name: "Karnataka Agencies",
    location: "Mangalore",
    dept: "ITI, Diploma",
    pkg: 15000,
  },
  {
    name: "Petrocon Engineers and Consultants",
    location: "Mangalore",
    dept: "Civil",
    pkg: 15000,
  },
  {
    name: "Nasiwak IT Solutions",
    location: "Bangalore",
    dept: "EC, CS",
    pkg: 15000,
  },
  {
    name: "House Sparrow Films",
    location: "Bangalore",
    dept: "ME, EEE",
    pkg: 15000,
  },
  { name: "Techno Lap", location: "Mangalore", dept: "EC, CS", pkg: 15000 },
  {
    name: "Sri Mahalasa Agencies & Sri Durga Laboratory Equipment Supplies",
    location: "Mangalore",
    dept: "Any",
    pkg: 15000,
  },
  {
    name: "Sri Durga Laboratory Equipment Supplies",
    location: "Mangalore",
    dept: "Any",
    pkg: 15000,
  },
  { name: "Raaj Power", location: "Mangalore", dept: "EEE", pkg: 15000 },
  {
    name: "MedOrganics India Pvt Ltd",
    location: "Mangalore",
    dept: "ME",
    pkg: 15000,
  },
  { name: "PonPon Sweets", location: "Mangalore", dept: "ME", pkg: 15000 },
  { name: "SNAA Business", location: "Mangalore", dept: "Civil", pkg: 15000 },
  {
    name: "Invenger Technologies Pvt. Ltd.",
    location: "Mangalore",
    dept: "CS, EC",
    pkg: 15000,
  },
  {
    name: "General Electric Aerospace",
    location: "Bangalore",
    dept: "EEE, ME, AT, CS, Civil",
    pkg: 14583,
  },
  {
    name: "AROMAZEN PRIVATE LTD",
    location: "Mangalore",
    dept: "Any",
    pkg: 14500,
  },
  {
    name: "Kanchana Automotive",
    location: "Mangalore",
    dept: "AT, ME",
    pkg: 13500,
  },
  {
    name: "Intuitive Apps Inc.",
    location: "Remote / Virtual",
    dept: "Any",
    pkg: 12000,
  },
  {
    name: "AROMAZEN PRIVATE LTD",
    location: "Mangalore",
    dept: "Any",
    pkg: 12000,
  },
];

export default function RecruitersPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 md:py-16 px-4 md:px-6 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4 text-center">
          Our Recruiters
        </h1>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Leading organizations that have partnered with Karnataka Government
          Polytechnic, Mangalore to recruit talented diploma students across
          various departments.
        </p>

        {/* Cards (phones) */}
        <div className="grid gap-3 sm:grid-cols-2 md:hidden">
          {recruiters.map((rec, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-gray-900">
                  {index + 1}. {rec.name}
                </h2>
                <span className="shrink-0 font-semibold text-blue-700">
                  ₹{rec.pkg.toLocaleString()}
                  <span className="text-xs font-normal text-gray-500">
                    {" "}
                    / month
                  </span>
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">📍 {rec.location}</p>
              <p className="mt-1 text-sm text-gray-600">{rec.dept}</p>
            </div>
          ))}
        </div>

        {/* Table (tablets and laptops) */}
        <div className="hidden md:block overflow-x-auto rounded-2xl shadow-md border border-gray-100">
          <table className="min-w-full bg-white rounded-2xl">
            <thead className="bg-blue-800 text-white sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Sl No
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Department / Branch
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Package (₹ / month)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recruiters.map((rec, index) => (
                <tr
                  key={index}
                  className="hover:bg-blue-50 transition duration-200"
                >
                  <td className="px-6 py-3 font-medium text-gray-800">
                    {index + 1}
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-800">
                    {rec.name}
                  </td>
                  <td className="px-6 py-3">{rec.location}</td>
                  <td className="px-6 py-3 text-gray-700">{rec.dept}</td>
                  <td className="px-6 py-3 font-semibold text-blue-700">
                    ₹{rec.pkg.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-sm mt-8">
          *Data reflects recent campus recruitment drives conducted for diploma
          students at KPT Mangalore.
        </p>
      </div>
    </main>
  );
}
