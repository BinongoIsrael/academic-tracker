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
    <div className="p-6 md:p-8 lg:p-12 max-w-[1440px] mx-auto space-y-10 pb-24">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase block mb-2">Academic Overview</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-on-background leading-tight">Curriculum Performance</h2>
        </div>
        <div className="flex gap-4">
          <div className="bg-surface-container-low px-5 py-2.5 rounded-xl border border-outline-variant/10">
            <span className="block text-[0.65rem] uppercase font-bold text-outline tracking-wider mb-0.5">System Status</span>
            <span className="text-sm font-semibold flex items-center gap-2 text-zinc-900">
              <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></span> Optimal
            </span>
          </div>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        {/* CurrentGWACard (Main Spotlight) */}
        <div className="col-span-12 lg:col-span-4">
          <CurrentGWACard gwa={cumulativeGWA} />
        </div>

        {/* GWATrendCard */}
        <div className="col-span-12 lg:col-span-8">
          <GWATrendCard currentGWA={cumulativeGWA} trendData={gwaTrend} />
        </div>

        {/* CoursesCard */}
        <div className="col-span-12">
          <CoursesCard courses={courses} />
        </div>
      </div>
    </div>
  );
}
