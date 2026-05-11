import RecommendationPageClient from "./RecommendationPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recommendation | Gradient",
};

export default function RecommendationPage() {
  return <RecommendationPageClient />;
}
