import SettingsPageClient from "./SettingsPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Gradient",
};

export default function SettingsPage() {
  return <SettingsPageClient />;
}
