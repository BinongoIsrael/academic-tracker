import TermsPageClient from "./TermsPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms | Gradient",
};

export default function TermsPage() {
  return <TermsPageClient />;
}
