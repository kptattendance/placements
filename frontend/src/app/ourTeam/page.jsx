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

function Photo({ member, size, onOpen, width }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(member)}
      aria-label={`Enlarge photo of ${member.name}`}
      className="shrink-0 rounded-full ring-2 ring-blue-400 ring-offset-2 ring-offset-white transition hover:scale-105 focus-visible:outline-none focus-visible:ring-blue-600"
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

// Principal on top; Training & Placement Officer and Placement Coordinators
// together in one row below, joined like an organisation chart
function Leadership({ members, onOpen }) {
  const d = (m) => (m.designation || "").trim().toLowerCase();
  const principal = members.filter((m) => d(m) === "principal");
  const officer = members.filter((m) =>
    d(m).includes("training & placement officer")
  );
  const coordinators = members.filter(
    (m) => !principal.includes(m) && !officer.includes(m)
  );

  // Officer sits in the middle of the row on larger screens
  const row = [...officer, ...coordinators];
  const orderOf = (m) => {
    if (officer.length === 0 || coordinators.length < 2) return "";
    if (officer.includes(m)) return "sm:order-2";
    return m === coordinators[0] ? "sm:order-1" : "sm:order-3";
  };

  const cols =
    row.length >= 3
      ? "sm:grid-cols-3 max-w-5xl"
      : row.length === 2
        ? "sm:grid-cols-2 max-w-3xl"
        : "max-w-sm";

  return (
    <div className="flex flex-col items-center">
      {principal.length > 0 && (
        <div className="grid w-full max-w-sm gap-3">
          {principal.map((m) => (
            <LeaderCard key={m._id} member={m} onOpen={onOpen} featured />
          ))}
        </div>
      )}

      {row.length > 0 && (
        <>
          {/* gold line down from the Principal */}
          {principal.length > 0 && <div className="h-5 w-0.5 bg-blue-400" />}

          <div className={`relative grid w-full grid-cols-1 gap-3 ${cols}`}>
            {/* gold line across the row (larger screens only) */}
            {principal.length > 0 && row.length > 1 && (
              <div
                className="pointer-events-none absolute -top-0 hidden h-0.5 bg-blue-400 sm:block"
                style={{
                  left: `${50 / Math.min(row.length, 3)}%`,
                  right: `${50 / Math.min(row.length, 3)}%`,
                }}
              />
            )}

            {row.map((m) => (
              <div key={m._id} className={`flex flex-col ${orderOf(m)}`}>
                {principal.length > 0 && row.length > 1 && (
                  <div className="mx-auto hidden h-4 w-0.5 bg-blue-400 sm:block" />
                )}
                <LeaderCard
                  member={m}
                  onOpen={onOpen}
                  highlight={officer.includes(m)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function LeaderCard({ member, onOpen, featured = false, highlight = false }) {
  return (
    <div
      className={`relative flex h-full overflow-hidden rounded-2xl border bg-white px-4 pb-4 pt-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
        featured
          ? "flex-col items-center text-center"
          : "flex-row items-center gap-4 text-left sm:flex-col sm:gap-0 sm:text-center"
      } ${
        featured
          ? "border-blue-400 bg-gradient-to-b from-blue-100 to-white shadow-md"
          : highlight
            ? "border-blue-300"
            : "border-blue-200"
      }`}
    >
      {/* gold accent strip along the top */}
      <span
        className={`absolute inset-x-0 top-0 ${
          featured || highlight ? "h-1.5 bg-blue-400" : "h-1 bg-blue-300"
        }`}
      />

      <Photo
        member={member}
        onOpen={onOpen}
        width={240}
        size={featured ? "h-24 w-24 sm:h-28 sm:w-28" : "h-16 w-16 sm:h-24 sm:w-24"}
      />

      <div className={`min-w-0 ${featured ? "" : "flex flex-col items-start sm:items-center"}`}>
      <h3
        className={`${featured ? "mt-3" : "sm:mt-3"} font-semibold leading-tight text-gray-900 break-words ${
          featured ? "text-lg" : ""
        }`}
      >
        {member.name}
      </h3>
      <p className="mt-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
        {member.designation}
      </p>
      {hasDepartment(member) && (
        <p className="mt-1.5 text-xs text-gray-500">{member.department}</p>
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
