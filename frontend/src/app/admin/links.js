// Admin sections each role can open.
// Used by the sidebar (layout.jsx) and the dashboard cards (page.jsx).
export const ADMIN_LINKS = {
  "placement-coordinator": [
    {
      href: "/admin",
      label: "Dashboard",
    },
    {
      href: "/admin/statistics",
      label: "Placement Statistics",
      description: "Enter year-wise, branch-wise placement numbers",
    },
    {
      href: "/admin/placedStudents",
      label: "Students Placed",
      description: "Add or edit placed students and their photos",
    },
    {
      href: "/admin/recentlyVisitedCompanies",
      label: "Companies Visited",
      description: "Record companies that visited the campus",
    },
    {
      href: "/admin/team",
      label: "Our Team",
      description: "Manage placement cell team members",
    },
    {
      href: "/admin/gallery",
      label: "Gallery Photos",
      description: "Upload photos shown in the gallery",
    },
    {
      href: "/admin/recruiterLogos",
      label: "Recruiter Logos",
      description: "Logos shown in the Top Recruiters strip",
    },
    {
      href: "/admin/homeHero",
      label: "Homepage Images",
      description: "Slideshow images on the home page",
    },
  ],

  "placement-officer": [
    {
      href: "/admin/placementExpenses",
      label: "Review Expenses",
      description: "Approve or reject submitted expenses",
    },
  ],

  // Pages for these roles have not been built yet
  principal: [],
  "sw-officer": [],
};
