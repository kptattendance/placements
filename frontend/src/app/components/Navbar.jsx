
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const openTimeout = useRef(null);
  const closeTimeout = useRef(null);

  /*
   * Menu structure
   *
   * If a menu has "href" → direct link
   * If a menu has "links" → dropdown
   */
  const groupedMenus = [
  
  {
      title: "About",
      href: "/about",
    },
    {
      title: "Our Team",
      href: "/ourTeam",
    },
{
      title: "Statistics",
      href: "/statistics",
    },{
      title: "Students Placed",
      href: "/studentsPlaced",
    },
 
{
      title: "Companies Visited",
      href: "/recentlyVisitedCompanies",
    },
    {
      title: "Companies List",
      href: "/recruiters",
    },

      {
      title: "Important Files",
      href: "/downloadsPage",
    },


    {
      title: "Companies",
      links: [
     
    
        { href: "/companySOP", label: "Company SOP" },
        {
          href: "/placementProcess",
          label: "Placement Process",
        },
      ],
    },
  ];

  /* ---------------------------------------
     Close mobile menu
  --------------------------------------- */
  const closeMobileMenu = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  /* ---------------------------------------
     Desktop dropdown open
  --------------------------------------- */
  const handleMouseEnter = (title) => {
    clearTimeout(closeTimeout.current);

    openTimeout.current = setTimeout(() => {
      setOpenDropdown(title);
    }, 120);
  };

  /* ---------------------------------------
     Desktop dropdown close
  --------------------------------------- */
  const handleMouseLeave = () => {
    clearTimeout(openTimeout.current);

    closeTimeout.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 220);
  };

  /* ---------------------------------------
     Dropdown menu
  --------------------------------------- */
  const renderDropdownLinks = (group) => {
    if (!group.links) return null;

    return (
      <div
        className="absolute left-0 top-full mt-2 w-60 rounded-xl border border-gray-100 bg-white py-2 shadow-xl"
        onMouseEnter={() => clearTimeout(closeTimeout.current)}
        onMouseLeave={handleMouseLeave}
      >
        {group.links.map((link) =>
          link.external ? (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpenDropdown(null)}
              className={`block px-4 py-2.5 text-sm transition ${
                pathname === link.href
                  ? "bg-blue-50 font-semibold text-blue-700"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              {link.label}
            </Link>
          )
        )}
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-2">
        <div className="flex min-h-[72px] items-center justify-between gap-3">

          {/* =========================
              LOGO
          ========================== */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex min-w-0 items-center gap-2"
          >
            <img
              src="/logo.jpg"
              alt="KPT Logo"
              className="h-12 w-auto shrink-0 sm:h-14 lg:h-16"
            />

            <span className="hidden text-sm font-bold leading-tight text-blue-800 sm:block lg:text-lg">
              KPT Training & Placements
            </span>

            {/* Short title for very small screens */}
            <span className="block text-sm font-bold leading-tight text-blue-800 sm:hidden">
              KPT Placements
            </span>
          </Link>

          {/* =========================
              DESKTOP NAVIGATION
          ========================== */}
          <div className="hidden items-center gap-1 md:flex lg:gap-3">
            {groupedMenus.map((group) => {
              /* Direct link */
              if (group.href) {
                return (
                  <Link
                    key={group.title}
                    href={group.href}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition lg:px-4 ${
                      pathname === group.href
                        ? "bg-blue-50 font-semibold text-blue-700"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    {group.title}
                  </Link>
                );
              }

              /* Dropdown */
              return (
                <div
                  key={group.title}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(group.title)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === group.title
                          ? null
                          : group.title
                      )
                    }
                    className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition lg:px-4 ${
                      group.links?.some(
                        (link) => pathname === link.href
                      )
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    {group.title}

                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openDropdown === group.title
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {openDropdown === group.title &&
                    renderDropdownLinks(group)}
                </div>
              );
            })}

            {/* =========================
                AUTH DESKTOP
            ========================== */}
            <div className="ml-2 flex items-center gap-3 border-l border-gray-200 pl-3">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <Link
                  href="/admin"
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    pathname.startsWith("/admin")
                      ? "bg-blue-50 text-blue-700"
                      : "text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  Dashboard
                </Link>

                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>

          {/* =========================
              MOBILE MENU BUTTON
          ========================== */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((prev) => !prev);
              setOpenDropdown(null);
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-700 transition hover:bg-blue-50 hover:text-blue-700 md:hidden"
          >
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </div>

      {/* =========================
          MOBILE DRAWER
      ========================== */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white shadow-lg md:hidden">
          <div className="max-h-[calc(100vh-72px)] overflow-y-auto px-4 py-4">

            <div className="space-y-1">

              {groupedMenus.map((group) => {
                /* =====================
                   MOBILE DIRECT LINK
                ====================== */
                if (group.href) {
                  return (
                    <Link
                      key={group.title}
                      href={group.href}
                      onClick={closeMobileMenu}
                      className={`flex min-h-[44px] items-center rounded-lg px-3 text-sm font-semibold transition ${
                        pathname === group.href
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                    >
                      {group.title}
                    </Link>
                  );
                }

                /* =====================
                   MOBILE DROPDOWN
                ====================== */
                return (
                  <div
                    key={group.title}
                    className="rounded-lg"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === group.title
                            ? null
                            : group.title
                        )
                      }
                      className={`flex min-h-[44px] w-full items-center justify-between rounded-lg px-3 text-sm font-semibold transition ${
                        group.links?.some(
                          (link) => pathname === link.href
                        )
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                    >
                      <span>{group.title}</span>

                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          openDropdown === group.title
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>

                    {openDropdown === group.title && (
                      <div className="ml-3 mt-1 border-l-2 border-blue-100 pl-3">
                        {group.links.map((link) =>
                          link.external ? (
                            <a
                              key={link.href}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={closeMobileMenu}
                              className="flex min-h-[42px] items-center px-3 text-sm text-gray-600 transition hover:text-blue-700"
                            >
                              {link.label}
                            </a>
                          ) : (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={closeMobileMenu}
                              className={`flex min-h-[42px] items-center rounded-md px-3 text-sm transition ${
                                pathname === link.href
                                  ? "font-semibold text-blue-700"
                                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                              }`}
                            >
                              {link.label}
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* =========================
                MOBILE AUTH
            ========================== */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                  >
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-3">
                  <Link
                    href="/admin"
                    onClick={closeMobileMenu}
                    className="text-sm font-semibold text-blue-700"
                  >
                    Dashboard
                  </Link>

                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
