"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getData } from "../../lib/fetchData";
import { cldImage } from "../../lib/images";

// Sections shown on the page, in order. A member goes into the first
// section whose test matches their designation; anyone else goes to "Team".
const SECTIONS = [
  {
    key: "leadership",
    title: "Leadership",
    match: (d) =>
      d === "principal" ||
      d.includes("training & placement officer") ||
      d === "placement coordinator",
  },
  {
    key: "staff",
    title: "Staff Placement Coordinators",
    match: (d) => d.includes("staff placement coordinator"),
  },
  {
    key: "students",
    title: "Student Placement Coordinators",
    match: (d) => d.includes("student placement coordinator"),
  },
  { key: "others", title: "Team", match: () => true },
];

const groupMembers = (list) => {
  const groups = Object.fromEntries(SECTIONS.map((s) => [s.key, []]));
  list.forEach((m) => {
    const d = (m.designation || "").trim().toLowerCase();
    groups[SECTIONS.find((s) => s.match(d)).key].push(m);
  });
  return groups;
};

const photoOf = (m, width) => cldImage(m.image?.url, width) || "/logo.jpg";

export default function OurTeamPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState(null); // member whose photo is enlarged

  const fetchTeam = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      setTeam((await getData("/api/team")) || []);
    } catch (error) {
      console.error("Failed to load team:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const groups = groupMembers(team);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-5 md:py-6 px-3 sm:px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title row */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Our Team</h1>
            <p className="text-sm text-gray-600">
              The people behind the Training & Placement Cell
            </p>
          </div>
          {!loading && team.length > 0 && (
            <p className="text-xs text-gray-500">Tap a photo to enlarge</p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" aria-label="Loading team">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-blue-200 bg-white p-3">
                <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-blue-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 animate-pulse rounded bg-blue-200" />
                  <div className="h-2.5 w-1/2 animate-pulse rounded bg-blue-200" />
                </div>
              </div>
            ))}
          </div>
        ) : loadError ? (
          <p className="text-center text-gray-600 py-10">
            Could not load the team right now. Please{" "}
            <button
              type="button"
              onClick={fetchTeam}
              className="font-semibold text-blue-700 underline"
            >
              try again
            </button>
            .
          </p>
        ) : team.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No team members added yet.</p>
        ) : (
          <div className="space-y-5">
            {/* Leadership: Principal → Training & Placement Officer → Coordinators */}
            {groups.leadership.length > 0 && (
              <Section title="Leadership" count={groups.leadership.length}>
                <Leadership members={groups.leadership} onOpen={setSelected} />
              </Section>
            )}

            {/* Everyone else: compact cards, many per row */}
            {SECTIONS.slice(1).map(
              (section) =>
                groups[section.key].length > 0 && (
                  <Section
                    key={section.key}
                    title={section.title}
                    count={groups[section.key].length}
                  >
                    <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
                      {groups[section.key].map((m) => (
                        <MemberCard key={m._id} member={m} onOpen={setSelected} />
                      ))}
                    </div>
                  </Section>
                )
            )}
          </div>
        )}
      </div>

      {selected && (
        <PhotoViewer member={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}

function Section({ title, count, children }) {
  return (
    <section>
      <div className="mb-2.5 flex items-center gap-3">
        <h2 className="text-lg md:text-xl font-bold text-blue-900">{title}</h2>
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
          {count}
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-blue-300 to-transparent" />
      </div>
      {children}
    </section>
  );
}

function Photo({ member, size, onOpen, width, dark = false }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(member)}
      aria-label={`Enlarge photo of ${member.name}`}
      className={`shrink-0 rounded-full ring-2 ring-blue-400 ring-offset-2 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-blue-600 ${
        dark ? "ring-offset-blue-900" : "ring-offset-white"
      }`}
    >
      <img
        src={photoOf(member, width)}
        alt=""
        loading="lazy"
        decoding="async"
        className={`${size} rounded-full object-cover bg-blue-100`}
      />
    </button>
  );
}

const hasDepartment = (m) => m.department && m.department !== "--";

function Leadership({ members, onOpen }) {
  const d = (m) => (m.designation || "").trim().toLowerCase();
  const principal = members.filter((m) => d(m) === "principal");
  const officer = members.filter((m) =>
    d(m).includes("training & placement officer")
  );
  const coordinators = members.filter(
    (m) => !principal.includes(m) && !officer.includes(m)
  );

  const levels = [
    { key: "principal", people: principal, featured: true },
    { key: "officer", people: officer },
    { key: "coordinators", people: coordinators },
  ].filter((l) => l.people.length > 0);

  return (
    <div className="flex flex-col items-center">
      {levels.map((level, i) => (
        <div key={level.key} className="flex w-full flex-col items-center">
          {/* thin gold line joining the levels */}
          {i > 0 && <div className="h-4 w-0.5 bg-blue-400" />}
          <div
            className={`grid w-full gap-3 ${
              level.people.length > 1
                ? "max-w-3xl grid-cols-1 sm:grid-cols-2"
                : "max-w-md grid-cols-1"
            }`}
          >
            {level.people.map((m) => (
              <LeaderCard
                key={m._id}
                member={m}
                onOpen={onOpen}
                featured={level.featured}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function LeaderCard({ member, onOpen, featured = false }) {
  return (
    <div
      className={`flex items-center gap-4 rounded-2xl p-4 shadow-sm transition hover:shadow-md ${
        featured
          ? "bg-blue-900 text-blue-100 border-2 border-blue-400"
          : "bg-white border border-blue-200 border-l-4 border-l-blue-400"
      }`}
    >
      <Photo
        member={member}
        onOpen={onOpen}
        width={240}
        dark={featured}
        size={featured ? "h-20 w-20 sm:h-24 sm:w-24" : "h-16 w-16 sm:h-20 sm:w-20"}
      />
      <div className="min-w-0">
        <h3
          className={`font-semibold leading-tight break-words ${
            featured ? "text-lg text-white" : "text-gray-900"
          }`}
        >
          {member.name}
        </h3>
        <p
          className={`mt-1 text-xs font-semibold uppercase tracking-wide ${
            featured ? "text-blue-400" : "text-blue-700"
          }`}
        >
          {member.designation}
        </p>
        {hasDepartment(member) && (
          <p className={`mt-0.5 text-xs ${featured ? "text-blue-100/80" : "text-gray-500"}`}>
            {member.department}
          </p>
        )}
      </div>
    </div>
  );
}

function MemberCard({ member, onOpen }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-white p-2.5 shadow-sm transition hover:border-blue-400 hover:shadow-md">
      <Photo member={member} onOpen={onOpen} width={160} size="h-12 w-12" />
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 leading-tight break-words">
          {member.name}
        </h3>
        {member.department && member.department !== "--" && (
          <p className="text-xs text-gray-500 break-words">{member.department}</p>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------
   Enlarged photo
--------------------------------------- */
function PhotoViewer({ member, onClose }) {
  const [sharpLoaded, setSharpLoaded] = useState(false);
  const url = member.image?.url;

  // Close with Esc, and stop the page behind from scrolling
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={member.name}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 rounded-full bg-blue-900/80 p-2 text-blue-100 hover:bg-blue-900"
        >
          <X className="h-5 w-5" />
        </button>

        {/* The small photo (already downloaded) shows at once; the sharp one fades in */}
        <div className="relative aspect-[4/5] w-full bg-blue-100">
          <img
            src={photoOf(member, 160)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover blur-[2px]"
          />
          {url && (
            <img
              src={cldImage(url, 800)}
              alt={member.name}
              onLoad={() => setSharpLoaded(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                sharpLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>

        <div className="border-t-4 border-blue-400 p-4 text-center">
          <h2 className="text-xl font-bold text-blue-900">{member.name}</h2>
          <p className="text-sm font-semibold text-blue-700">{member.designation}</p>
          {member.department && member.department !== "--" && (
            <p className="text-sm text-gray-600">{member.department}</p>
          )}
        </div>
      </div>
    </div>
  );
}
