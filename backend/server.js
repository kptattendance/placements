// server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";

import homeHeroRoutes from "./src/routes/homeHeroRoutes.js";
import placementRoutes from "./src/routes/placementRoutes.js";
import visitedCompanyRoutes from "./src/routes/visitedCompanyRoutes.js";
import placedStudentRoutes from "./src/routes/placedStudentRoutes.js";
import teamRoutes from "./src/routes/teamRoutes.js";
import recruiterLogoRoutes from "./src/routes/recruiterLogoRoutes.js";
import companyExpenseRoutes from "./src/routes/companyExpenseRoutes.js";
import budgetRoutes from "./src/routes/budgetRoutes.js";
import budgetUsageRoutes from "./src/routes/budgetUsageRoutes.js";
import galleryRoutes from "./src/routes/galleryRoutes.js";
import { requireAdmin, requireRole } from "./src/middleware/requireAdmin.js";

// ---------------------- INITIAL CONFIG ----------------------
const app = express();
const PORT = process.env.PORT || 5000;

// Don't advertise the server software
app.disable("x-powered-by");

// ---------------------- CONNECT DATABASE ----------------------
await connectDB();

// ---------------------- CORS CONFIG ----------------------
const allowedOrigins = [
  "http://localhost:5173",
  // 👉 Change this to your actual frontend URL when deployed
  "https://kpt-placement-frontend.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    res.header("Access-Control-Allow-Origin", "*");
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // ---- Security headers ----
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "DENY");
  res.header("Referrer-Policy", "no-referrer");
  res.header(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ---------------------- MIDDLEWARES ----------------------
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true, limit: "200kb" }));

// ---------------------- BASE ROUTE ----------------------
app.get("/", (req, res) => {
  res.send("KPT Placement API Running ✅");
});

// ---------------------- ADMIN PROTECTION ----------------------
// Website content: anyone can read it, only the placement coordinator
// can add, edit or delete it
const coordinatorOnly = requireRole("placement-coordinator");
const contentGuard = (req, res, next) => {
  if (req.method === "GET") return next();
  coordinatorOnly(req, res, next);
};

// ---------------------- API ROUTES ----------------------
app.use("/api/home-hero", contentGuard, homeHeroRoutes);
app.use("/api/placements", contentGuard, placementRoutes);
app.use("/api/placed-students", contentGuard, placedStudentRoutes);
app.use("/api/visited-companies", contentGuard, visitedCompanyRoutes);
app.use("/api/team", contentGuard, teamRoutes);
app.use("/api/recruiter-logos", contentGuard, recruiterLogoRoutes);
app.use("/api/gallery", contentGuard, galleryRoutes);

// Expenses and budget are internal: every request needs a signed-in admin
app.use("/api/company-expenses", requireAdmin, companyExpenseRoutes);
app.use("/api/budget", requireAdmin, budgetRoutes);
app.use("/api/budget-usage", requireAdmin, budgetUsageRoutes);

// ---------------------- ERRORS ----------------------
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Upload problems (wrong type, too large) and anything unexpected
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "Image is too large (max 10 MB)" });
  }
  if (err.status === 400 || err.name === "MulterError") {
    return res.status(400).json({ message: err.message });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "Request is too large" });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid request" });
  }

  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

// ---------------------- SERVER ----------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ Required export for Vercel deployment
export default app;
