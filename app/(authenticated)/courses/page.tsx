import CoursesPageClient from "./CoursesPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses | Gradient",
};

export default function CoursesPage() {
  return <CoursesPageClient />;
}
