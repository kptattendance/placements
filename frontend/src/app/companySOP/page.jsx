"use client";

import Link from "next/link";
import {
  FileText,
  Building2,
  ClipboardList,
  Users,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

export default function PlacementTermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 text-gray-800">
      {/* ===== Hero Section ===== */}
      <section className="text-center py-16 px-6 border-b border-gray-200 bg-blue-100/40">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800">
            Karnataka (Govt.) Polytechnic, Mangalore
          </h1>
          <p className="text-gray-600 mt-2 text-lg font-medium">
            Training & Placement Cell – Standard Terms and Conditions for
            Recruiting Companies
          </p>
          <Link
            href="/SOP company.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition font-medium"
          >
            <FileText className="w-5 h-5" />
            Download PDF
          </Link>
        </div>
      </section>

      {/* ===== Content Section ===== */}
      <section className="max-w-7xl mx-auto py-12 px-6 md:px-10">
        {/* Intro */}
        <p className="text-lg leading-relaxed mb-8 sm:text-justify">
          The <strong>Placement Cell</strong> at{" "}
          <strong>Karnataka Government Polytechnic, Mangalore</strong> welcomes
          your esteemed organization to participate in our campus recruitment
          process. To ensure a transparent, efficient, and mutually beneficial
          engagement, the following terms and conditions are applicable to all
          visiting recruiters.
        </p>

        {/* ===== List Section ===== */}
        <div className="space-y-8">
          {/* 1 */}
          <TermCard
            icon={<ClipboardList className="text-blue-700 w-7 h-7" />}
            title="Pre-Placement Interaction (PPI)"
            points={[
              "Companies must provide complete information about job profile, training period, salary structure, place of posting, facilities offered, and bond (if any).",
              "All such details should be clearly discussed during the PPI to help students make informed choices.",
            ]}
          />

          {/* 2 */}
          <TermCard
            icon={<Building2 className="text-blue-700 w-7 h-7" />}
            title="Official Communication Channel"
            points={[
              "All recruitment-related communication must be routed through the Placement Cell only.",
              "Direct interaction or email communication with students is discouraged to ensure clarity and coordination.",
            ]}
          />

          {/* 3 */}
          <TermCard
            icon={<Users className="text-blue-700 w-7 h-7" />}
            title="Declaration of Results & Offer Letters"
            points={[
              "The list of selected students should be declared on the same day or within one week after the interview process.",
              "Offer letters should be sent directly to the Placement Officer. The Cell will distribute them to selected students.",
              "This ensures adherence to our 'One Student – One Job' policy.",
            ]}
          />

          {/* 4 */}
          <TermCard
            icon={<MessageSquare className="text-blue-700 w-7 h-7" />}
            title="Recruitment Integrity & Process"
            points={[
              "Companies must follow the mutually agreed placement schedule and avoid any off-campus hiring of registered students.",
              "The recruitment procedure may include written tests, group discussions, technical and HR interviews, as per company norms.",
            ]}
          />

          {/* 5 */}
          <TermCard
            icon={<CheckCircle className="text-blue-700 w-7 h-7" />}
            title="Post-Selection & Responsibilities"
            points={[
              "Once students join, they are governed by the company's policies, and the institute does not intervene in internal matters.",
              "Recruiters are encouraged to share performance feedback for continuous institutional improvement.",
              "If a student resigns or leaves without notice, the institute is not responsible for their actions.",
            ]}
          />

          {/* 6 */}
          <TermCard
            icon={<ClipboardList className="text-blue-700 w-7 h-7" />}
            title="Placement Policy & Conduct"
            points={[
              "Once placed, students will not be allowed to appear for further drives unless a new offer exceeds ₹6 LPA.",
              "Recruiters are requested to share the final list of selected candidates within one week of completion of the process.",
            ]}
          />

          {/* 7 */}
          <TermCard
            icon={<Building2 className="text-blue-700 w-7 h-7" />}
            title="Institutional Collaboration & Legacy"
            points={[
              "Karnataka (Govt.) Polytechnic, Mangalore has a legacy of over 75 years of excellence in technical education.",
              "We aim to establish long-term, transparent, and mutually beneficial partnerships with all industry collaborators.",
            ]}
          />
        </div>
      </section>
    </div>
  );
}

/* ===== Reusable Card Component ===== */
function TermCard({ icon, title, points }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg border border-gray-100 rounded-xl p-6 transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-blue-100 rounded-lg">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <ul className="list-disc pl-6 text-gray-700 space-y-1 leading-relaxed">
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  );
}
