export default function robots() {
  const baseUrl = "https://placements.kptmangaluru.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/api/",
          "/sign-in/",
          "/sign-up/",
        ],
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,
  };
}