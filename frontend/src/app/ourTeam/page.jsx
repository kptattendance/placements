"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { cldImage } from "../../lib/images";

export default function OurTeamPage() {
  const [team, setTeam] = useState([]);
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/team`);
        setTeam(res.data);
      } catch (error) {
        console.error("Failed to load team:", error);
      }
    };
    fetchTeam();
  }, [baseURL]);

  function sortToTree(list) {
    const principal = list.filter(
      (m) => m.designation?.toLowerCase() === "principal"
    );

    const tpo = list.filter((m) =>
      m.designation?.toLowerCase().includes("training & placement officer")
    );

    const placementOffice = list.filter(
      (m) => m.designation?.toLowerCase() === "placement coordinator"
    );

    const staffPc = list.filter((m) =>
      m.designation?.toLowerCase().includes("staff placement coordinator")
    );

    const spc = list.filter((m) =>
      m.designation?.toLowerCase().includes("student placement coordinator")
    );

    return { principal, tpo, placementOffice, staffPc, spc };
  }

  const tree = sortToTree(team);

  return (
    <section className="min-h-screen bg-white text-gray-900 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-1 text-blue-800">
          Our Team
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mb-5">
          Meet the dedicated members of the Training & Placement Cell.
        </p>

        {/* ✅ RESPONSIVE TREE STYLES */}
        <style>
          {`
.tree {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tree-level {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin: 14px 0;
}

.node {
  text-align: center;
  width: 140px;
}

@media (min-width: 640px) {
  .node {
    width: 160px;
  }
}

.node img {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #c9a227;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .node img {
    width: 110px;
    height: 110px;
  }
}

.line-down {
  width: 2px;
  height: 18px;
  background: #c9a227;
  margin: 0 auto;
}

.node h3 {
  font-size: 14px;
}

.node p {
  font-size: 12px;
}

@media (min-width: 640px) {
  .node h3 {
    font-size: 15px;
  }

  .node p {
    font-size: 13px;
  }
}
`}
        </style>

        {team.length === 0 ? (
          <p>No team members added yet.</p>
        ) : (
          <div className="tree">

            {/* === PRINCIPAL === */}
            {tree.principal.length > 0 && (
              <>
                <div className="tree-level">
                  {tree.principal.map((p) => (
                    <div key={p._id} className="node">
                      <img src={cldImage(p.image?.url, 240)} alt={p.name} loading="lazy" />
                      <h3 className="font-bold text-blue-800 mt-2">{p.name}</h3>
                      <p>{p.designation}</p>
                      <p className="text-gray-500">{p.department}</p>
                    </div>
                  ))}
                </div>
                <div className="line-down"></div>
              </>
            )}

            {/* === TPO + Placement Coordinator === */}
            {(tree.tpo.length > 0 || tree.placementOffice.length > 0) && (
              <>
                <div className="tree-level">
                  {[...tree.tpo, ...tree.placementOffice].map((t) => (
                    <div key={t._id} className="node">
                      <img src={cldImage(t.image?.url, 240)} alt={t.name} loading="lazy" />
                      <h3 className="font-bold text-blue-800 mt-2">{t.name}</h3>
                      <p>{t.designation}</p>
                      <p className="text-gray-500">{t.department}</p>
                    </div>
                  ))}
                </div>
                <div className="line-down"></div>
              </>
            )}

            {/* === Staff Placement Coordinators === */}
            {tree.staffPc.length > 0 && (
              <>
                <div className="tree-level">
                  {tree.staffPc.map((pc) => (
                    <div key={pc._id} className="node">
                      <img src={cldImage(pc.image?.url, 240)} alt={pc.name} loading="lazy" />
                      <h3 className="font-semibold text-blue-800 mt-2">{pc.name}</h3>
                      <p>{pc.designation}</p>
                      <p className="text-gray-500">{pc.department}</p>
                    </div>
                  ))}
                </div>
                <div className="line-down"></div>
              </>
            )}

            {/* === Student Placement Coordinators === */}
            {tree.spc.length > 0 && (
              <div className="tree-level">
                {tree.spc.map((s) => (
                  <div key={s._id} className="node">
                    <img src={cldImage(s.image?.url, 240)} alt={s.name} loading="lazy" />
                    <h3 className="font-semibold text-blue-800 mt-2">{s.name}</h3>
                    <p>{s.designation}</p>
                    <p className="text-gray-500">{s.department}</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </section>
  );
}
