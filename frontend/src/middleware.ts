import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// ==========================================
// PUBLIC ROUTES
// ==========================================
// These pages can be accessed without login.
const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/contact",
  "/recruiters",
  "/statistics",
  "/announcements",
  "/ourTeam",
  "/events",
  "/downloadsPage",

  // Public API routes
  "/api/(.*)",
]);

export default clerkMiddleware((auth, req) => {
  // ==========================================
  // ALLOW PUBLIC ROUTES
  // ==========================================
  if (isPublicRoute(req)) {
    return;
  }

  // ==========================================
  // PROTECT ALL OTHER ROUTES
  // ==========================================
  auth.protect();
});

export const config = {
  matcher: [
    /*
     * Run middleware on application routes,
     * excluding Next.js internals and static files.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};