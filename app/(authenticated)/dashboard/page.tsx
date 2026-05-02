import DashboardPageClient from "./DashboardPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Gradient",
};

export default function DashboardPage() {
  return <DashboardPageClient />;
}
