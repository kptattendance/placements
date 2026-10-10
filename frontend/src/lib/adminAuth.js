import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Send the signed-in admin's Clerk session token with every request to our
// backend, so the API can check who is making changes.
// Imported once by the admin layout.
axios.interceptors.request.use(async (config) => {
  const isOurApi = (config.url || "").startsWith(API_URL);

  if (isOurApi && typeof window !== "undefined") {
    const token = await window.Clerk?.session?.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
