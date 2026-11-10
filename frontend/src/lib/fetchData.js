import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ✅ Load public data from our API.
// The server can take a few seconds to wake up after being idle, and the
// first request sometimes fails. Instead of showing "nothing here" until the
// visitor refreshes, try again automatically (network errors / 5xx only).
export async function getData(path, { retries = 2 } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await axios.get(`${API_URL}${path}`, { timeout: 20000 });
      return res.data;
    } catch (err) {
      const status = err.response?.status;
      const canRetry = !status || status >= 500;
      if (!canRetry || attempt >= retries) throw err;
      await wait(1500 * (attempt + 1));
    }
  }
}
