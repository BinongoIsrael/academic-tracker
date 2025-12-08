"use client";

import CurrentGWACard from "./components/CurrentGWACard";
import GWATrendCard from "./components/GWATrendCard";
import CoursesCard from "./components/CoursesCard";
import InfoPanel from "./components/InfoPanel";
import { Course } from "@/types";

export default function DashboardPage() {
  const currentGWA = 1.0;
  const courses: Course[] = [];

  const gwaTrend = [1.0, 1.71, 1.89, 2.0];

  const handleAddCourse = () => {
    console.log("Add course clicked");
  };

  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-8">
      <div className="flex flex-col lg:flex-row">
        <main className="w-full lg:ml-[325px] pt-6 lg:pt-[30px] px-4 sm:px-8 lg:px-20 pb-8 lg:flex-1">
          <div className="mb-8 lg:mb-[52px]">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-black mb-2 lg:mb-3">
              Welcome to Gradient!
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-subtle">
              What would you like to do today?
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-[56px] mb-8 lg:mb-[63px]">
            <CurrentGWACard gwa={currentGWA} />
            <GWATrendCard currentGWA={currentGWA} trendData={gwaTrend} />
          </div>

          <CoursesCard courses={courses} onAddCourse={handleAddCourse} />
        </main>
        <aside className="hidden lg:block w-[380px] pt-[30px] pr-8 pb-8 sticky top-[88px] self-start">
          <InfoPanel />
        </aside>
      </div>
    </div>
  );
}