//admin/page.jsx
"use client";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ADMIN_LINKS } from "./links";

export default function AdminHome() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;

  // Every section this role can open, except the dashboard itself
  const sections = (ADMIN_LINKS[role] || []).filter(
    (link) => link.href !== "/admin"
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-800 mb-4">
        Welcome, {user?.firstName || "Admin"} 👋
      </h1>
      <p className="text-gray-600 mb-8">
        Manage Training & Placement data for KPT Mangalore here.
      </p>

      {sections.length === 0 ? (
        <p className="rounded-lg border border-gray-200 bg-white p-6 text-gray-600">
          There are no sections available for your role yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="p-6 bg-white border border-blue-100 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
            >
              <span className="block text-lg font-semibold text-blue-800">
                {section.label}
              </span>
              <span className="mt-1 block text-sm text-gray-600">
                {section.description}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
