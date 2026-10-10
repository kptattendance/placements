"use client";

import Link from "next/link";
import { Download, FileText } from "lucide-react";

export default function DownloadsPage() {
  // ✅ Add your downloadable files here
  const files = [
    {
      id: 1,
      name: "Placement Process Guidelines",
      file: "/process.pdf",
    },
    {
      id: 2,
      name: "Standard Procedural Operations for Companies",
      file: "/SOP company.pdf",
    },
    {
      id: 3,
      name: "Student Code of Conduct (Placement)",
      file: "/stud terms.pdf",
    },
    {
      id: 4,
      name: "Internship Roadmap for Final Year Students",
      file: "/internship roadmap.pdf",
    },

    {
      id: 5,
      name: "Internship Application Form",
      file: "/internship application.pdf",
    },

    {
      id: 6,
      name: "Internship Approval Sample Copy",
      file: "/internship approval sample.pdf",
    },

    {
      id: 7,
      name: "Internship Undertaking Sample Copy",
      file: "/UNDERTAKING-INTERNSHIP.pdf",
    },

    {
      id: 8,
      name: "Industry Visit Approval Sample Copy",
      file: "/industrial visit.pdf",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 text-gray-800 py-10 md:py-16 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* ===== Page Header ===== */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">
            Placement Cell – Downloads
          </h1>
          <p className="text-gray-600 text-lg">
            Access official documents, policies, and forms from the Placement
            Cell.
          </p>
          <div className="mt-4 w-24 h-1 bg-blue-700 mx-auto rounded-full"></div>
        </div>

        {/* ===== Downloads List (phones) ===== */}
        <ul className="space-y-3 sm:hidden">
          {files.map((file) => (
            <li key={file.id}>
              <Link
                href={file.file}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl shadow-sm p-4 active:bg-blue-50"
              >
                <FileText className="w-5 h-5 shrink-0 text-blue-600" />
                <span className="flex-1 text-gray-800 font-medium">
                  {file.name}
                </span>
                <Download className="w-5 h-5 shrink-0 text-blue-700" />
              </Link>
            </li>
          ))}
        </ul>

        {/* ===== Downloads Table ===== */}
        <div className="hidden sm:block overflow-x-auto bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold tracking-wider w-30">
                  Sl. No.
                </th>
                <th className="px-6 py-3 text-sm font-semibold tracking-wider">
                  Name of File
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-center w-32">
                  Download
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {files.map((file) => (
                <tr
                  key={file.id}
                  className="hover:bg-blue-50/50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    {file.id}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2 text-gray-800">
                    <FileText className="w-5 h-5 text-blue-600" />
                    {file.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={file.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-700 font-medium border border-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-700 hover:text-white transition-all duration-200"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== Info Note ===== */}
        <div className="mt-8 text-sm text-gray-500 text-center">
          📎 All documents are issued by the{" "}
          <strong>Training & Placement Cell, KPT Mangalore.</strong>
        </div>
      </div>
    </section>
  );
}
