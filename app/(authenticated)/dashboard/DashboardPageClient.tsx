"use client";

import { useMemo, useState } from "react";
import CurrentGWACard from "./components/CurrentGWACard";
import GWATrendCard from "./components/GWATrendCard";
import CoursesCard from "./components/CoursesCard";
import InfoPanel from "./components/InfoPanel";
import CardErrorBoundary from "@/components/CardErrorBoundary";
import { Course, Term } from "@/types";
import CreateCourseModal from "../courses/components/CreateCourseModal";
import Toast from "../components/Toast";
import { useUser, useCourses, useTerms, useCreateCourseMutation } from "@/lib/hooks/useAcademicData";

export default function DashboardPageClient() {
  const { data: user } = useUser();
  const { data: courses = [], isLoading: isLoadingCourses } = useCourses(user?.id);
  const { data: terms = [], isLoading: isLoadingTerms } = useTerms(user?.id);
  const createCourseMutation = useCreateCourseMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const loading = isLoadingCourses || isLoadingTerms;

  const { cumulativeGWA, semesterTrend, yearTrend, infoPanelStats } = useMemo(() => {
    if (courses.length === 0) {
      return {
        cumulativeGWA: 0.0,
        semesterTrend: [],
        yearTrend: [],
        infoPanelStats: {
          targetGWA: 0,
          enrolledUnits: 0,
          completedUnits: 0,
          currentGWA: 0,
        },
      };
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

    let currentInfoPanelStats = {
      targetGWA: 0,
      enrolledUnits: 0,
      completedUnits: 0,
      currentGWA: 0,
    };

    const activeTermData = termGWAs.find(t => t.termInfo.isActive) || termGWAs[0];
    if (activeTermData) {
      const activeCourses = termsMap.get(activeTermData.termInfo.id)?.courses || [];
      const enrolled = activeCourses.reduce((sum, c) => sum + (c.units || 0), 0);
      const completed = activeCourses
        .filter(c => c.grade !== null && c.grade !== undefined && Number(c.grade) > 0)
        .reduce((sum, c) => sum + (c.units || 0), 0);
      
      const targetGpaSum = activeCourses.reduce((sum, c) => sum + (c.target_gpa || 0), 0);
      const avgTarget = activeCourses.length > 0 ? targetGpaSum / activeCourses.length : 0;

      currentInfoPanelStats = {
        targetGWA: avgTarget,
        enrolledUnits: enrolled,
        completedUnits: completed,
        currentGWA: activeTermData.gwa,
      };
    }

    termGWAs.sort((a, b) => {
        const yearCompare = a.termInfo.academicYear.localeCompare(b.termInfo.academicYear);
        if (yearCompare !== 0) return yearCompare;
        return a.termInfo.semester.localeCompare(b.termInfo.semester);
    });

    const semesterTrendData = termGWAs.map(item => {
      const semPrefix = item.termInfo.semester.startsWith("1") ? "S1" : 
                        item.termInfo.semester.startsWith("2") ? "S2" : "SS";
      const yearSuffix = item.termInfo.academicYear.split("-").map(y => y.slice(-2)).join("-");
      
      return {
        label: `${semPrefix} ${yearSuffix}`,
        gwa: item.gwa
      };
    });

    const yearsMap = new Map<string, { weightedGradeSum: number, unitSum: number }>();
    for (const item of termGWAs) {
      const year = item.termInfo.academicYear;
      if (!yearsMap.has(year)) {
        yearsMap.set(year, { weightedGradeSum: 0, unitSum: 0 });
      }
      const yearData = yearsMap.get(year)!;
      
      let termUnits = 0;
      let termWeightedGrades = 0;
      const termCourses = termsMap.get(item.termInfo.id)?.courses || [];
      for (const course of termCourses) {
        const grade = parseFloat(String(course.grade ?? 0));
        const units = parseFloat(String(course.units ?? 0));
        if (!isNaN(grade) && !isNaN(units) && units > 0 && grade > 0 && grade !== 5.0) {
          termWeightedGrades += grade * units;
          termUnits += units;
        }
      }
      
      yearData.weightedGradeSum += termWeightedGrades;
      yearData.unitSum += termUnits;
    }

    const yearTrendData = Array.from(yearsMap.entries()).map(([year, data]) => ({
      label: year.split("-").map(y => y.slice(-2)).join("-"),
      gwa: data.unitSum > 0 ? data.weightedGradeSum / data.unitSum : 0
    })).sort((a, b) => a.label.localeCompare(b.label));

    return {
      cumulativeGWA: finalGWA,
      semesterTrend: semesterTrendData,
      yearTrend: yearTrendData,
      infoPanelStats: currentInfoPanelStats,
    };
  }, [courses]);

  const handleCreateCourse = async (courseData: any) => {
    try {
      if (
        !courseData.courseTitle ||
        !courseData.academicTerm ||
        !courseData.courseType ||
        !courseData.units
      ) {
        setToast({
          message: "Please fill in all required fields",
          type: "error",
        });
        return;
      }

      if (!user) return;

      await createCourseMutation.mutateAsync({ user, courseData });

      setToast({ message: "Course created successfully!", type: "success" });
      setIsCreateModalOpen(false);
    } catch (error: any) {
      console.error("Error creating course:", error);
      setToast({
        message: error.message || "Failed to create course",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface pb-20 lg:pb-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-on-surface-variant font-medium">Loading dashboard...</p>
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
            <span className="text-sm font-semibold flex items-center gap-2 text-on-surface">
              <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></span> Optimal
            </span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        <div className="col-span-12 lg:col-span-4">
          <CardErrorBoundary title="Current GWA">
            <CurrentGWACard gwa={cumulativeGWA} />
          </CardErrorBoundary>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <CardErrorBoundary title="GWA Trend">
            <GWATrendCard 
              currentGWA={cumulativeGWA} 
              semesterTrend={semesterTrend} 
              yearTrend={yearTrend} 
            />
          </CardErrorBoundary>
        </div>

        <div className="col-span-12 lg:col-span-9">
          <CardErrorBoundary title="My Courses">
            <CoursesCard 
              courses={courses} 
              onAddCourse={() => setIsCreateModalOpen(true)} 
            />
          </CardErrorBoundary>
        </div>

        <div className="col-span-12 lg:col-span-3">
          <CardErrorBoundary title="Academic Stats">
            <InfoPanel 
              targetGWA={infoPanelStats.targetGWA}
              enrolledUnits={infoPanelStats.enrolledUnits}
              completedUnits={infoPanelStats.completedUnits}
              currentGWA={infoPanelStats.currentGWA}
            />
          </CardErrorBoundary>
        </div>
      </div>

      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        terms={terms}
        onSubmit={handleCreateCourse}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
