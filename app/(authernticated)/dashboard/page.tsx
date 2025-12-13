"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import CurrentGWACard from "./components/CurrentGWACard";
import GWATrendCard from "./components/GWATrendCard";
import CoursesCard from "./components/CoursesCard";
import InfoPanel from "./components/InfoPanel";
import { Course, Term } from "@/types";
import { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [cumulativeGWA, setCumulativeGWA] = useState<number>(0.0);
  const [gwaTrend, setGwaTrend] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: coursesData, error: coursesError } = await supabase
          .from("courses")
          .select(
            `
            *,
            terms (
              id,
              user_id,
              academic_year,
              semester,
              start_date,
              end_date,
              is_active
            )
          `
          )
          .eq("user_id", user.id);

        if (coursesData) {
          const mappedCourses = coursesData.map((course: any) => ({
            ...course,
            term: course.terms ? {
              id: course.terms.id,
              user_id: course.terms.user_id,
              academicYear: course.terms.academic_year,
              semester: course.terms.semester,
              startDate: course.terms.start_date,
              endDate: course.terms.end_date,
              isActive: course.terms.is_active,
              courses: 0,
              units: 0,
              gpa: null,
            } : undefined,
          }));
          setCourses(mappedCourses);
        }
        if (coursesError) {
          console.error("Error fetching courses:", coursesError);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (courses.length === 0) {
      setCumulativeGWA(0.0);
      setGwaTrend([]);
      return;
    }

    let totalSumOfWeightedGrades = 0;
    let totalSumOfUnits = 0;

    for (const course of courses) {
      const grade = parseFloat(String(course.grade ?? 0));
      const units = parseFloat(String(course.units ?? 0));
      if (!isNaN(grade) && !isNaN(units) && units > 0 && grade > 0 && grade !== 5.0) {
        const weightedGrade = grade * units;
        totalSumOfWeightedGrades += weightedGrade;
        totalSumOfUnits += units;
      }
    }
    const finalGWA = totalSumOfUnits > 0 ? totalSumOfWeightedGrades / totalSumOfUnits : 0.0;
    setCumulativeGWA(finalGWA);


    const termsMap = new Map<string, { courses: Course[], termInfo: Term }>();

    for (const course of courses) {
      if (course.term) {
        if (!termsMap.has(course.term.id)) {
          termsMap.set(course.term.id, { courses: [], termInfo: course.term as Term });
        }
        termsMap.get(course.term.id)?.courses.push(course);
      }
    }
    
    const termGWAs = Array.from(termsMap.values()).map(({ courses, termInfo }) => {
      let termSumOfWeightedGrades = 0;
      let termSumOfUnits = 0;
      for (const course of courses) {
        const grade = parseFloat(String(course.grade ?? 0));
        const units = parseFloat(String(course.units ?? 0));
        if (!isNaN(grade) && !isNaN(units) && units > 0 && grade > 0 && grade !== 5.0) {
          termSumOfWeightedGrades += grade * units;
          termSumOfUnits += units;
        }
      }
      const gwa = termSumOfUnits > 0 ? termSumOfWeightedGrades / termSumOfUnits : 0;
      return { termInfo, gwa };
    });

    termGWAs.sort((a, b) => {
        const yearCompare = a.termInfo.academicYear.localeCompare(b.termInfo.academicYear);
        if (yearCompare !== 0) return yearCompare;
        return a.termInfo.semester.localeCompare(b.termInfo.semester);
    });

    setGwaTrend(termGWAs.map(item => item.gwa));

  }, [courses]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pb-20 lg:pb-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-8">
      <div className="flex flex-col lg:flex-row">
        <main className="w-full lg:ml-[325px] pt-6 lg:pt-[30px] px-4 sm:px-8 lg:px-20 pb-8 lg:flex-1">
          <div className="mb-8 lg:mb-[52px]">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-black mb-2 lg:mb-3">
              Welcome back!
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-subtle">
              Here&apos;s a look at your academic progress.
            </p>
          </div>

          <div className="max-w-5xl space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <CurrentGWACard gwa={cumulativeGWA} />
              <GWATrendCard currentGWA={cumulativeGWA} trendData={gwaTrend} />
            </div>
            <CoursesCard courses={courses} />
          </div>
        </main>
      </div>
    </div>
  );
}
