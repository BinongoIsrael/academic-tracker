"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CreateNewTerm from "./components/CreateNewTerm";
import MyTerms from "./components/MyTerms";
import EditTermModal from "./components/EditTermModal";
import { Term, Course } from "@/types";
import { createClient } from "@/utils/supabase/client";
import DeleteTermModal from "./components/DeleteTermModal";
import Toast from "./components/Toast";

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
  const supabase = createClient();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white pb-20 lg:pb-8">
        <main className="w-full max-w-[1024px] lg:ml-[325px] pt-6 lg:pt-[30px] px-4 sm:px-8 lg:px-12 pb-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading terms...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-8">
      <main className="w-full max-w-[1024px] lg:ml-[325px] pt-6 lg:pt-[30px] px-4 sm:px-8 lg:px-12 pb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-black mb-8 lg:mb-12">
          Academic Terms
        </h1>

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
