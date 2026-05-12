"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import CurrentGWACard from "./components/CurrentGWACard";
import GWATrendCard from "./components/GWATrendCard";
import CoursesCard from "./components/CoursesCard";
import InfoPanel from "./components/InfoPanel";
import { Course, Term } from "@/types";
import { User } from "@supabase/supabase-js";
import CreateCourseModal from "../courses/components/CreateCourseModal";
import Toast from "../components/Toast";

export default function DashboardPageClient() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [cumulativeGWA, setCumulativeGWA] = useState<number>(0.0);
  const [semesterTrend, setSemesterTrend] = useState<{ label: string; gwa: number }[]>([]);
  const [yearTrend, setYearTrend] = useState<{ label: string; gwa: number }[]>([]);
  const [infoPanelStats, setInfoPanelStats] = useState({
    targetGWA: 0,
    enrolledUnits: 0,
    completedUnits: 0,
    currentGWA: 0,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchData = useCallback(async () => {
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

      const { data: termsData, error: termsError } = await supabase
        .from("terms")
        .select("*")
        .eq("user_id", user.id)
        .order("academic_year", { ascending: false });

      if (termsData) {
        const mappedTerms: Term[] = termsData.map((t: any) => ({
          id: t.id,
          user_id: t.user_id,
          academicYear: t.academic_year,
          semester: t.semester,
          startDate: t.start_date,
          endDate: t.end_date,
          isActive: t.is_active,
          courses: 0,
          units: 0,
          gpa: null,
        }));
        setTerms(mappedTerms);
      }
      if (termsError) {
        console.error("Error fetching terms:", termsError);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (courses.length === 0) {
      setCumulativeGWA(0.0);
      setSemesterTrend([]);
      setYearTrend([]);
      setInfoPanelStats({
        targetGWA: 0,
        enrolledUnits: 0,
        completedUnits: 0,
        currentGWA: 0,
      });
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

    const activeTermData = termGWAs.find(t => t.termInfo.isActive) || termGWAs[0];
    if (activeTermData) {
      const activeCourses = termsMap.get(activeTermData.termInfo.id)?.courses || [];
      const enrolled = activeCourses.reduce((sum, c) => sum + (c.units || 0), 0);
      const completed = activeCourses
        .filter(c => c.grade !== null && c.grade !== undefined && Number(c.grade) > 0)
        .reduce((sum, c) => sum + (c.units || 0), 0);
      
      const targetGpaSum = activeCourses.reduce((sum, c) => sum + (c.target_gpa || 0), 0);
      const avgTarget = activeCourses.length > 0 ? targetGpaSum / activeCourses.length : 0;

      setInfoPanelStats({
        targetGWA: avgTarget,
        enrolledUnits: enrolled,
        completedUnits: completed,
        currentGWA: activeTermData.gwa,
      });
    }

    termGWAs.sort((a, b) => {
        const yearCompare = a.termInfo.academicYear.localeCompare(b.termInfo.academicYear);
        if (yearCompare !== 0) return yearCompare;
        return a.termInfo.semester.localeCompare(b.termInfo.semester);
    });

    setSemesterTrend(termGWAs.map(item => {
      const semPrefix = item.termInfo.semester.startsWith("1") ? "S1" : 
                        item.termInfo.semester.startsWith("2") ? "S2" : "SS";
      const yearSuffix = item.termInfo.academicYear.split("-").map(y => y.slice(-2)).join("-");
      
      return {
        label: `${semPrefix} ${yearSuffix}`,
        gwa: item.gwa
      };
    }));

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

    setYearTrend(yearTrendData);

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

      const courseInsertData: any = {
        user_id: user?.id,
        term_id: courseData.academicTerm,
        course_name: courseData.courseTitle,
        course_code: courseData.courseCode,
        course_type: courseData.courseType,
        units: parseFloat(courseData.units),
        course_structure: courseData.courseStructure,
        target_gpa: courseData.targetGPA
          ? parseFloat(courseData.targetGPA)
          : null,
        course_color: courseData.courseColor,
        lecture_percentage: courseData.lecturePercentage,
        laboratory_percentage: courseData.laboratoryPercentage,
      };

      if (
        courseData.gradeInputMode === "final" &&
        courseData.finalGrade !== undefined
      ) {
        courseInsertData.grade = courseData.finalGrade;
      }

      const { data: newCourse, error: courseError } = await supabase
        .from("courses")
        .insert(courseInsertData)
        .select()
        .single();

      if (courseError) throw courseError;

      if (
        courseData.gradeInputMode === "assessments" ||
        !courseData.gradeInputMode
      ) {
        const allAssessments = [];

        const lectureAssessmentData = courseData.lectureAssessments
          .filter((a: any) => a.assessment_name && a.occurrences && a.percentage)
          .map((a: any) => ({
            course_id: newCourse.id,
            assessment_name: a.assessment_name,
            occurrences: a.occurrences,
            percentage: a.percentage,
            component_type: "Lecture",
          }));
        allAssessments.push(...lectureAssessmentData);

        if (courseData.courseStructure === "Lecture + Laboratory") {
          const labAssessmentData = courseData.laboratoryAssessments
            .filter((a: any) => a.assessment_name && a.occurrences && a.percentage)
            .map((a: any) => ({
              course_id: newCourse.id,
              assessment_name: a.assessment_name,
              occurrences: a.occurrences,
              percentage: a.percentage,
              component_type: "Laboratory",
            }));
          allAssessments.push(...labAssessmentData);
        }

        if (allAssessments.length > 0) {
          const { data: insertedAssessments, error: assessmentError } =
            await supabase.from("assessments").insert(allAssessments).select();

          if (assessmentError) throw assessmentError;

          const gradeRecords = [];
          for (const assessment of insertedAssessments) {
            for (let i = 1; i <= assessment.occurrences; i++) {
              gradeRecords.push({
                course_id: newCourse.id,
                assessment_id: assessment.id,
                occurrence_number: i,
                grade: null,
              });
            }
          }

          if (gradeRecords.length > 0) {
            const { error: gradesError } = await supabase
              .from("assessment_grades")
              .insert(gradeRecords);

            if (gradesError) throw gradesError;
          }
        }
      }

      setToast({ message: "Course created successfully!", type: "success" });
      setIsCreateModalOpen(false);
      fetchData();
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
          <CurrentGWACard gwa={cumulativeGWA} />
        </div>

        <div className="col-span-12 lg:col-span-8">
          <GWATrendCard 
            currentGWA={cumulativeGWA} 
            semesterTrend={semesterTrend} 
            yearTrend={yearTrend} 
          />
        </div>

        <div className="col-span-12 lg:col-span-9">
          <CoursesCard 
            courses={courses} 
            onAddCourse={() => setIsCreateModalOpen(true)} 
          />
        </div>

        <div className="col-span-12 lg:col-span-3">
            <InfoPanel 
              targetGWA={infoPanelStats.targetGWA}
              enrolledUnits={infoPanelStats.enrolledUnits}
              completedUnits={infoPanelStats.completedUnits}
              currentGWA={infoPanelStats.currentGWA}
            />
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
