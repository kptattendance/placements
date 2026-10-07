"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Building2,
  Users,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import AnnouncementsCarousel from "./components/AnnouncementsCarousel";
import TopRecruiters from "./components/TopRecruiters";
import RecruiterCTA from "./components/RecruiterCTA";
import AboutSection from "./components/AboutSection";
import GalleryPage from "./gallery/page";

const FALLBACK_IMAGE = "/placeholder.jpg";

export default function Home() {
  /*
   * Start with the fallback image immediately.
   *
   * This prevents the hero section from being empty while
   * the backend request is running.
   */
  const [heroImages, setHeroImages] = useState([
    {
      image: {
        url: FALLBACK_IMAGE,
      },
    },
  ]);

  const [current, setCurrent] = useState(0);

  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  /*
   * Fetch hero images from backend
   */
  useEffect(() => {
    if (!baseURL) {
      console.error("NEXT_PUBLIC_API_URL is not configured.");
      return;
    }

    const fetchImages = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/home-hero`, {
          timeout: 10000,
        });

        if (
          Array.isArray(res.data) &&
          res.data.length > 0
        ) {
          setHeroImages(res.data);
          setCurrent(0);
        }
      } catch (err) {
        console.error(
          "Failed to load hero images:",
          err
        );

        // Keep fallback image already displayed
      }
    };

    fetchImages();
  }, [baseURL]);

  /*
   * Slideshow
   *
   * Don't start the interval if there is only one image.
   */
  useEffect(() => {
    if (heroImages.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrent((prev) => {
        return (prev + 1) % heroImages.length;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <>
      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="relative h-[85vh] flex flex-col items-center justify-center text-white overflow-hidden">

        {/* =================================================
            BACKGROUND IMAGES
        ================================================= */}
        {heroImages.map((img, index) => {
          const imageUrl =
            img?.image?.url || FALLBACK_IMAGE;

          return (
            <Image
              key={`${imageUrl}-${index}`}
              src={imageUrl}
              alt={
                index === 0
                  ? "KPT Mangalore Training and Placement Cell"
                  : `KPT Mangalore Placement Cell ${index + 1}`
              }
              fill
              priority={index === 0}
              fetchPriority={
                index === 0 ? "high" : "auto"
              }
              sizes="100vw"
              quality={85}
              className={`object-cover transition-opacity duration-[2000ms] ease-in-out ${
                index === current
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            />
          );
        })}

        {/* =================================================
            GRADIENT OVERLAY
        ================================================= */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-800/50 to-blue-900/80" />

        {/* =================================================
            HERO CONTENT
        ================================================= */}
        <div className="relative z-10 text-center px-4 max-w-4xl">

          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg">
            Training & Placement Cell
          </h1>

          <p className="text-lg md:text-xl mb-8 text-blue-100">
            Karnataka Govt. Polytechnic, Mangalore —
            Bridging Academia and Industry.
          </p>

          {/* =================================================
              STATS
          ================================================= */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-10 text-sm md:text-base">

            {[
              {
                icon: (
                  <Users className="h-8 w-8 text-blue-200 mb-2" />
                ),
                label: "1500+ Students",
              },
              {
                icon: (
                  <Building2 className="h-8 w-8 text-blue-200 mb-2" />
                ),
                label: "150+ Recruiters",
              },
              {
                icon: (
                  <GraduationCap className="h-8 w-8 text-blue-200 mb-2" />
                ),
                label: "8 Departments",
              },
              {
                icon: (
                  <Briefcase className="h-8 w-8 text-blue-200 mb-2" />
                ),
                label: "40+ Industry Visits",
              },
              {
                icon: (
                  <GraduationCap className="h-8 w-8 text-blue-200 mb-2" />
                ),
                label: "20+ Workshops",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-blue-50 hover:scale-105 transition-transform"
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* =================================================
              CTA BUTTONS
          ================================================= */}
          <div className="flex flex-wrap justify-center gap-4">

            <Link
              href="/announcements"
              className="bg-white text-blue-800 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              View Announcements
            </Link>

            <Link
              href="/ourTeam"
              className="border border-white px-6 py-2 rounded-lg hover:bg-white hover:text-blue-800 transition"
            >
              Meet Our Team
            </Link>

          </div>
        </div>
      </section>

      {/* =====================================================
          ADDITIONAL SECTIONS
      ===================================================== */}

      <AboutSection />

      {/* <AnnouncementsCarousel /> */}

      <TopRecruiters />

      <RecruiterCTA />

      <GalleryPage />
    </>
  );
}