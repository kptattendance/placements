"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getData } from "../../lib/fetchData";

export default function TopRecruiters() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        setLogos((await getData("/api/recruiter-logos")) || []);
      } catch (err) {
        console.error("Failed to fetch recruiter logos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogos();
  }, []);

  return (
    <section className="relative py-16 bg-gradient-to-r from-blue-50 via-white to-blue-50 border-t border-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading now links to /recruiters */}
        <Link href="/recruiters" className="inline-block">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-3 cursor-pointer hover:text-blue-900">
            Our Top Recruiters
          </h2>
        </Link>

        <p className="text-gray-500 mb-10">
          Trusted by leading industries and organizations
        </p>

        {loading ? (
          <div className="flex justify-center gap-6 overflow-hidden" aria-label="Loading">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[110px] w-[150px] shrink-0 animate-pulse rounded-md bg-blue-200" />
            ))}
          </div>
        ) : logos.length === 0 ? (
          <p className="text-gray-400">No recruiter logos uploaded yet.</p>
        ) : (
          <div className="overflow-hidden relative">
            <div className="scroll-track flex gap-14 items-center">
              {/* duplicate list to create seamless marquee */}
              {[...logos, ...logos].map((r, i) => (
                // Wrap each logo card in Link to /recruiters so clicks navigate there
                <Link
                  key={`${r._id ?? i}-${i}`}
                  href="/recruiters"
                  className="flex-shrink-0"
                >
                  <Logo logo={r.image?.url} name={r.name} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .scroll-track {
          display: inline-flex;
          white-space: nowrap;
          animation: scroll 120s linear infinite;
        }
        .scroll-track:hover {
          animation-play-state: paused;
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-blue-50 via-blue-50/70 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-blue-50 via-blue-50/70 to-transparent pointer-events-none"></div>
    </section>
  );
}

function Logo({ logo, name }) {
  return (
    <div className="flex-shrink-0 text-center transition-transform duration-300 hover:scale-105">
      <div className="bg-white rounded-md shadow-sm hover:shadow-lg p-3 w-[150px] h-[110px] flex items-center justify-center mx-auto">
        {logo ? (
          // If you're using Next.js Image and external domains, ensure next.config.js allows them.
          <Image
            src={logo}
            alt={name || "logo"}
            width={120}
            height={60}
            className="object-contain"
          />
        ) : (
          // fallback to simple placeholder
          <div className="w-[120px] h-[60px] flex items-center justify-center text-xs text-gray-400">
            No logo
          </div>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-600 font-medium">{name}</p>
    </div>
  );
}
