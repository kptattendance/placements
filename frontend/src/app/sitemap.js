export default function sitemap() {
  const baseUrl = "https://placements.kptmangaluru.in";

  const pages = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/statistics", changeFrequency: "monthly", priority: 0.9 },
    { path: "/studentsPlaced", changeFrequency: "weekly", priority: 0.9 },
    { path: "/recentlyVisitedCompanies", changeFrequency: "weekly", priority: 0.8 },
    { path: "/recruiters", changeFrequency: "monthly", priority: 0.8 },
    { path: "/about", changeFrequency: "yearly", priority: 0.6 },
    { path: "/ourTeam", changeFrequency: "yearly", priority: 0.6 },
    { path: "/placementProcess", changeFrequency: "yearly", priority: 0.5 },
    { path: "/companySOP", changeFrequency: "yearly", priority: 0.5 },
    { path: "/downloadsPage", changeFrequency: "yearly", priority: 0.5 },
    { path: "/gallery", changeFrequency: "monthly", priority: 0.5 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  ];

  return pages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
