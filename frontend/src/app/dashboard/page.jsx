import { redirect } from "next/navigation";

// The old dashboard is replaced by the admin panel
export default function Dashboard() {
  redirect("/admin");
}
