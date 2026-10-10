import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// ==========================================
// PROTECTED ROUTES
// ==========================================
// Only the admin area needs login. Every other page is public, so a new
// public page can never be locked behind sign-in by mistake.
const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/dashboard(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
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
