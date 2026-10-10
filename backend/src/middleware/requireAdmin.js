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

// On the live server a missing key must never leave the API open
const isProduction =
  process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);

if (!clerk) {
  console.warn(
    isProduction
      ? "❌ CLERK_SECRET_KEY is not set — all admin API requests will be refused."
      : "⚠️ CLERK_SECRET_KEY is not set — admin API routes are NOT protected (local only)."
  );
}

// Remember each user's role for a minute so every request does not
// have to ask Clerk again
const ROLE_CACHE_MS = 60 * 1000;
const roleCache = new Map();

const getRole = async (userId) => {
  const cached = roleCache.get(userId);
  if (cached && cached.expires > Date.now()) return cached.role;

  const user = await clerk.users.getUser(userId);
  const role = user.publicMetadata?.role;

  roleCache.set(userId, { role, expires: Date.now() + ROLE_CACHE_MS });
  return role;
};

// Works out who is calling. Returns { admin } or { status, message }.
const identify = async (req) => {
  if (!clerk) {
    if (isProduction) {
      return { status: 503, message: "Admin access is not configured" };
    }
    // Local development without a key: behave as an unrestricted admin
    return { admin: { id: "local-dev", role: null, unrestricted: true } };
  }

  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return { status: 401, message: "Sign in required" };

  let userId;
  try {
    const payload = await verifyToken(token, { secretKey });
    userId = payload.sub;
  } catch {
    return { status: 401, message: "Invalid or expired session" };
  }

  try {
    const role = await getRole(userId);
    if (!ALLOWED_ROLES.includes(role)) {
      return { status: 403, message: "Not authorized" };
    }
    return { admin: { id: userId, role } };
  } catch (error) {
    console.error("Admin check failed:", error);
    return { status: 500, message: "Failed to verify admin" };
  }
};

// ✅ Allow only signed-in admins with one of the given roles
// (no roles given = any admin role)
export const requireRole =
  (...roles) =>
  async (req, res, next) => {
    const result = await identify(req);
    if (!result.admin) {
      return res.status(result.status).json({ message: result.message });
    }

    const { admin } = result;
    if (roles.length > 0 && !admin.unrestricted && !roles.includes(admin.role)) {
      return res
        .status(403)
        .json({ message: "Your role is not allowed to do this" });
    }

    req.admin = admin;
    next();
  };

// ✅ Any signed-in admin
export const requireAdmin = requireRole();

// ✅ For public routes that show extra data to admins:
// true when the request carries a valid admin session
export const isAdminRequest = async (req) => {
  const result = await identify(req);
  return Boolean(result.admin);
};
