"use client";

import CurrentGWACard from "./components/CurrentGWACard";
import GWATrendCard from "./components/GWATrendCard";
import CoursesCard from "./components/CoursesCard";
import { Course } from "@/types";

export default function DashboardPage() {
  const currentGWA = 1.0;
  const courses: Course[] = [];
  
  const gwaTrend = [1.0, 1.71, 1.89, 2.0];

  const handleAddCourse = () => {
    console.log("Add course clicked");
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="ml-[325px] pt-[30px] px-20 pb-8">
        <div className="mb-[52px]">
          <h1 className="text-dashboard-title text-black mb-3">
            Welcome to Gradient!
          </h1>
          <p className="text-dashboard-subtitle text-gray-subtle">
            What would you like to do today?
          </p>
        </div>

        <div className="flex gap-[56px] mb-[63px]">
          <CurrentGWACard gwa={currentGWA} />
          <GWATrendCard currentGWA={currentGWA} trendData={gwaTrend} />
        </div>

        <CoursesCard courses={courses} onAddCourse={handleAddCourse} />
      </main>
    </div>
  );
}