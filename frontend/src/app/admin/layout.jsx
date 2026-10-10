"use client";

import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../lib/adminAuth";
import { ADMIN_LINKS } from "./links";

const ALLOWED_ROLES = [
  "principal",
  "placement-coordinator",
  "placement-officer",
  "sw-officer",
];

export default function AdminLayout({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const pathname = usePathname();

  // Clerk still loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Not logged in
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  const role = user?.publicMetadata?.role;

  // No role / unauthorized role
  if (!ALLOWED_ROLES.includes(role)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-red-50 px-4">
        <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mb-3 text-4xl">🚫</div>

          <h1 className="text-xl font-bold text-red-700">
            Access Denied
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            This area is restricted to authorized administrators.
          </p>

          <Link
            href="/"
            className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Go to Home
          </Link>
        </div>
      </main>
    );
  }

  const links = ADMIN_LINKS[role] || [];

  const linkClass = (path) =>
    pathname === path
      ? "rounded-lg bg-blue-50 px-3 py-2 font-semibold text-blue-700"
      : "rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600";

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
      {/* One toast container for every admin page */}
      <ToastContainer position="top-right" autoClose={2500} />

      {/* SIDEBAR (becomes a top strip on phones) */}
      <aside className="shrink-0 border-b border-gray-200 bg-white p-4 shadow-sm md:w-64 md:border-b-0 md:border-r md:p-6">
        <h2 className="mb-2 text-lg font-bold text-blue-700">
          Admin Panel
        </h2>

        {/* USER INFORMATION */}
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 md:mb-6">
          <p className="text-sm text-gray-700">
            Logged in as:
          </p>

          <p className="mt-1 font-semibold text-blue-700">
            {user.fullName || user.firstName || "User"}
          </p>

          <p className="mt-1 text-xs text-gray-600">
            Role:{" "}
            <strong>
              {role}
            </strong>
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="flex gap-1 overflow-x-auto whitespace-nowrap md:flex-col md:overflow-visible md:whitespace-normal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-w-0 flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
