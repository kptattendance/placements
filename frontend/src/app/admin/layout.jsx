"use client";

import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  const linkClass = (path) =>
    pathname === path
      ? "rounded-lg bg-blue-50 px-3 py-2 font-semibold text-blue-700"
      : "rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 shrink-0 border-r border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-bold text-blue-700">
          Admin Panel
        </h2>

        {/* USER INFORMATION */}
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-3">
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
        <nav className="flex flex-col gap-1">

          {/* PLACEMENT COORDINATOR */}
          {role === "placement-coordinator" && (
            <>
              <Link
                href="/admin"
                className={linkClass("/admin")}
              >
                Dashboard
              </Link>

              <Link
                href="/admin/statistics"
                className={linkClass("/admin/statistics")}
              >
                Placement Statistics
              </Link>

              <Link
                href="/admin/placedStudents"
                className={linkClass("/admin/placedStudents")}
              >
                Placed Students Page
              </Link>

              <Link
                href="/admin/recentlyVisitedCompanies"
                className={linkClass("/admin/recentlyVisitedCompanies")}
              >
                Recently Visited Companies
              </Link>

              <Link
                href="/admin/addexpenses"
                className={linkClass("/admin/addexpenses")}
              >
                Add Expenses
              </Link>

              <Link
                href="/admin/announcements"
                className={linkClass("/admin/announcements")}
              >
                Announcements
              </Link>

              <Link
                href="/admin/events"
                className={linkClass("/admin/events")}
              >
                Events
              </Link>

              <Link
                href="/admin/team"
                className={linkClass("/admin/team")}
              >
                Our Team
              </Link>

              <Link
                href="/admin/gallery"
                className={linkClass("/admin/gallery")}
              >
                Gallery Photos
              </Link>

              <Link
                href="/admin/recruiterLogos"
                className={linkClass("/admin/recruiterLogos")}
              >
                Recruiter Logos
              </Link>

              <Link
                href="/admin/homeHero"
                className={linkClass("/admin/homeHero")}
              >
                Homepage Images
              </Link>
            </>
          )}

          {/* PLACEMENT OFFICER */}
          {role === "placement-officer" && (
            <Link
              href="/admin/placementExpenses"
              className={linkClass("/admin/placementExpenses")}
            >
              Review Expenses
            </Link>
          )}

          {/* PRINCIPAL */}
          {role === "principal" && (
            <>
              <Link
                href="/admin/principalReviewExpenses"
                className={linkClass("/admin/principalReviewExpenses")}
              >
                Approve Expenses
              </Link>

              <Link
                href="/admin/principalBudget"
                className={linkClass("/admin/principalBudget")}
              >
                Manage Budget
              </Link>
            </>
          )}

          {/* SW OFFICER */}
          {role === "sw-officer" && (
            <Link
              href="/admin/swOfficerExpenses"
              className={linkClass("/admin/swOfficerExpenses")}
            >
              SW Officer – Review Expenses
            </Link>
          )}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-w-0 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}