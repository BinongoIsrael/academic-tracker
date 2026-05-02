"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CreateNewTerm from "./components/CreateNewTerm";
import MyTerms from "./components/MyTerms";
import EditTermModal from "./components/EditTermModal";
import { Term, Course } from "@/types";
import { supabase } from "@/utils/supabase/client";
import DeleteTermModal from "./components/DeleteTermModal";
import Toast from "../components/Toast";

export default function TermsPage() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [deletingTerm, setDeletingTerm] = useState<Term | null>(null);
  const [termCourses, setTermCourses] = useState<Course[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/signin");
        return;
      }

      const { data: termsData, error } = await supabase
        .from("terms")
        .select(
          `
          *,
          courses(id, units, grade)
        `
        )
        .eq("user_id", user.id)
        .order("start_date", { ascending: false });

      if (error) throw error;
      const currentDate = new Date();
      let activeTermId: string | null = null;

      const activeTerm = termsData.find((term: any) => {
        if (!term.start_date || !term.end_date) return false;
        const startDate = new Date(term.start_date);
        const endDate = new Date(term.end_date);
        return currentDate >= startDate && currentDate <= endDate;
      });

      if (activeTerm) {
        activeTermId = activeTerm.id;
      }

      const currentlyActiveInDB = termsData.find((term: any) => term.is_active);

      if (currentlyActiveInDB?.id !== activeTermId) {
        await supabase
          .from("terms")
          .update({ is_active: false })
          .eq("user_id", user.id);

        if (activeTermId) {
          await supabase
            .from("terms")
            .update({ is_active: true })
            .eq("id", activeTermId);
        }

        termsData.forEach((term: any) => {
          term.is_active = term.id === activeTermId;
        });
      }

      const termsWithStats: Term[] = termsData.map((term: any) => ({
        id: term.id,
        user_id: term.user_id,
        academicYear: term.academic_year,
        semester: term.semester,
        startDate: term.start_date,
        endDate: term.end_date,
        courses: term.courses?.length || 0,
        units:
          term.courses?.reduce(
            (sum: number, c: any) => sum + (c.units || 0),
            0
          ) || 0,
        gpa:
          term.courses?.filter((c: any) => c.grade !== null).length > 0
            ? term.courses
                .filter((c: any) => c.grade !== null)
                .reduce((sum: number, c: any) => sum + c.grade, 0) /
              term.courses.filter((c: any) => c.grade !== null).length
            : null,
        isActive: term.is_active,
        created_at: term.created_at,
        updated_at: term.updated_at,
      }));

      setTerms(termsWithStats);
    } catch (error) {
      console.error("Error fetching terms:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTermCourses = async (termId: string) => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("term_id", termId);

      if (error) throw error;

      const mappedCourses: Course[] = data.map((course: any) => ({
        id: course.id,
        term_id: course.term_id,
        user_id: course.user_id,
        course_name: course.course_name,
        course_code: course.course_code,
        units: course.units,
        grade: course.grade,
      }));

      setTermCourses(mappedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleCreateTerm = async (data: {
    academicYear: string;
    startDate: string | null;
    endDate: string | null;
    semester: string;
  }) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/signin");
        return;
      }

      const { data: newTerm, error } = await supabase
        .from("terms")
        .insert({
          user_id: user.id,
          academic_year: data.academicYear,
          semester: data.semester,
          start_date: data.startDate,
          end_date: data.endDate,
          is_active: false,
        })
        .select()
        .single();

      if (error) throw error;

      console.log("Term created successfully:", newTerm);
      setToast({ message: "Term created successfully!", type: "success" });
      await fetchTerms();
    } catch (error) {
      console.error("Error creating term:", error);
      alert("Failed to create term. Please try again.");
    }
  };

  const handleEditTerm = async (termId: string) => {
    const term = terms.find((t) => t.id === termId);
    if (term) {
      setEditingTerm(term);
      await fetchTermCourses(termId);
    }
  };

  const handleSaveTerm = async (
    termId: string,
    data: {
      academicYear: string;
      semester: string;
      startDate: string | null;
      endDate: string | null;
    }
  ) => {
    try {
      const { error } = await supabase
        .from("terms")
        .update({
          academic_year: data.academicYear,
          semester: data.semester,
          start_date: data.startDate,
          end_date: data.endDate,
        })
        .eq("id", termId);

      if (error) throw error;

      await fetchTerms();
      setToast({ message: "Term updated successfully!", type: "success" });
    } catch (error) {
      console.error("Error updating term:", error);
      throw error;
    }
  };

  const handleDeleteClick = (term: Term) => {
    setEditingTerm(null);
    setDeletingTerm(term);
  };

  const handleDeleteTerm = async (termId: string) => {
    try {
      const { error } = await supabase.from("terms").delete().eq("id", termId);

      if (error) throw error;

      await fetchTerms();
      setDeletingTerm(null);
      setToast({ message: "Term deleted successfully", type: "success" });
    } catch (error) {
      console.error("Error deleting term:", error);
      throw error;
    }
  };

  const handleRemoveCourse = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId);

      if (error) throw error;

      if (editingTerm) {
        await fetchTermCourses(editingTerm.id);
        await fetchTerms();
      }
    } catch (error) {
      console.error("Error removing course:", error);
      throw error;
    }
  };

  const handleAddCourse = (termId: string) => {
    router.push(`/courses?term=${termId}`);
  };

  const activeTermsCount = terms.filter(t => t.isActive).length;
  const totalTermsCount = terms.length;
  const termsWithGpa = terms.filter(t => t.gpa !== null).length;
  const completionRate = totalTermsCount > 0 ? Math.round((termsWithGpa / totalTermsCount) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface pb-20 lg:pb-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-on-surface-variant">Loading academic terms...</p>
            </div>
          </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-20 lg:pb-8">
      <main className="w-full max-w-[1200px] mx-auto pt-6 lg:pt-10 px-4 sm:px-8 lg:px-12 pb-8">
        <header className="mb-12">
          <h1 className="text-dashboard-title text-on-surface mb-2">
            Terms Management
          </h1>
          <p className="text-body-large text-on-surface-variant">
            Manage your academic lifecycle and track progress across semesters.
          </p>
        </header>

        {/* Dashboard Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(26,27,36,0.06)] border border-outline-variant/10">
            <div className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Active Terms</div>
            <div className="text-3xl font-bold text-on-surface">{activeTermsCount.toString().padStart(2, '0')}</div>
            <div className="mt-2 text-xs text-secondary font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              In-Progress
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(26,27,36,0.06)] border border-outline-variant/10">
            <div className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Total Records</div>
            <div className="text-3xl font-bold text-on-surface">{totalTermsCount.toString().padStart(2, '0')}</div>
            <div className="mt-2 text-xs text-on-surface-variant font-medium">Academic History</div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(26,27,36,0.06)] border border-outline-variant/10">
            <div className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Completion Rate</div>
            <div className="text-3xl font-bold text-on-surface">{completionRate}%</div>
            <div className="mt-2 text-xs text-primary font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              On Track
            </div>
          </div>
          <div className="bg-primary-container p-6 rounded-lg shadow-[4px_4px_0px_#191A23] border border-on-surface">
            <div className="text-[10px] uppercase tracking-widest text-on-primary-container font-bold mb-2">Next Deadline</div>
            <div className="text-lg font-bold text-on-primary-container">Term Grading</div>
            <div className="mt-2 text-xs text-on-primary-container font-bold">Stay Updated</div>
          </div>
        </div>

        <CreateNewTerm onCreateTerm={handleCreateTerm} />

        <MyTerms
          terms={terms}
          onEditTerm={handleEditTerm}
          onAddCourse={handleAddCourse}
        />
      </main>
      <EditTermModal
        term={editingTerm}
        courses={termCourses}
        isOpen={!!editingTerm}
        onClose={() => setEditingTerm(null)}
        onSave={handleSaveTerm}
        onDeleteClick={handleDeleteClick}
        onRemoveCourse={handleRemoveCourse}
        onAddCourse={handleAddCourse}
      />
      <DeleteTermModal
        term={deletingTerm}
        isOpen={!!deletingTerm}
        onClose={() => setDeletingTerm(null)}
        onConfirm={handleDeleteTerm}
      />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
