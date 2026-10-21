"use client";

import {
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function Topbar() {
  return (
    <div className="w-full bg-blue-900 text-blue-100 border-b border-blue-400/30">

      <div className="mx-auto flex w-full max-w-7xl flex-col px-3 py-2 sm:px-5 md:flex-row md:items-center md:justify-between md:px-8">

        {/* =========================
            LEFT - CONTACT DETAILS
        ========================== */}
        <div className="flex min-w-0 flex-col items-center gap-1.5 text-xs text-blue-100/90 sm:text-sm md:flex-row md:gap-6">

          {/* Phone */}
          <a
            href="tel:+918243516910"
            className="flex max-w-full items-center gap-2 transition-colors hover:text-white"
          >
            <Phone
              size={15}
              className="shrink-0 text-blue-400 sm:h-4 sm:w-4"
            />

            <span className="truncate">
              (0824) - 3516910 / +91 77604 21790
            </span>
          </a>

          {/* Email */}
          <a
            href="mailto:kptplacements@gmail.com"
            className="flex max-w-full items-center gap-2 transition-colors hover:text-white"
          >
            <Mail
              size={15}
              className="shrink-0 text-blue-400 sm:h-4 sm:w-4"
            />

            <span className="truncate">
              kptplacements@gmail.com
            </span>
          </a>
        </div>

        {/* =========================
            RIGHT - SOCIAL ICONS
        ========================== */}
        <div className="mt-2 flex items-center justify-center gap-5 md:mt-0 md:gap-4">

          <a
            href="#"
            aria-label="Facebook"
            className="transition-all duration-300 hover:scale-110 hover:text-blue-400"
          >
            <Facebook size={17} />
          </a>

          <a
            href="#"
            aria-label="Twitter"
            className="transition-all duration-300 hover:scale-110 hover:text-blue-400"
          >
            <Twitter size={17} />
          </a>

          <a
            href="#"
            aria-label="Instagram"
            className="transition-all duration-300 hover:scale-110 hover:text-blue-400"
          >
            <Instagram size={17} />
          </a>

          <a
            href="#"
            aria-label="LinkedIn"
            className="transition-all duration-300 hover:scale-110 hover:text-blue-400"
          >
            <Linkedin size={17} />
          </a>
        </div>
      </div>
    </div>
  );
}