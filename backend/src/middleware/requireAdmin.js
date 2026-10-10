import { createClerkClient, verifyToken } from "@clerk/backend";

// Same roles the frontend admin layout allows
const ALLOWED_ROLES = [
  "principal",
  "placement-coordinator",
  "placement-officer",
  "sw-officer",
];

const secretKey = process.env.CLERK_SECRET_KEY;
const clerk = secretKey ? createClerkClient({ secretKey }) : null;

if (!clerk) {
  console.warn(
    "⚠️ CLERK_SECRET_KEY is not set — admin API routes are NOT protected."
  );
}

// ✅ Allow only signed-in admins (Clerk session token in Authorization header)
export const requireAdmin = async (req, res, next) => {
  // Without the key we cannot verify anyone, so behave as before
  if (!clerk) return next();

  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: "Sign in required" });
  }

  let userId;
  try {
    const payload = await verifyToken(token, { secretKey });
    userId = payload.sub;
  } catch {
    return res.status(401).json({ message: "Invalid or expired session" });
  }

  try {
    const user = await clerk.users.getUser(userId);
    const role = user.publicMetadata?.role;

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    req.admin = { id: userId, role };
    next();
  } catch (error) {
    console.error("Admin check failed:", error);
    res.status(500).json({ message: "Failed to verify admin" });
  }
};
