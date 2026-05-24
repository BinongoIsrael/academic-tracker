import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase/client";
import { Course, Term, Assessment, AssessmentGrade, GradingScale } from "@/types";
import { User } from "@supabase/supabase-js";
import { useEffect } from "react";
import { mapTermData } from "../calculations";

// --- User Hook ---
export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });
}

export function useProfile(userId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const subscription = supabase
      .channel(`profile:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["profile", userId] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, queryClient]);

  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

// --- Terms Hook ---
export function useTerms(userId?: string) {
  return useQuery({
    queryKey: ["terms", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("terms")
        .select(`
          *,
          courses(id, units, grade)
        `)
        .eq("user_id", userId)
        .order("start_date", { ascending: false });

      if (error) throw error;

      return (data || []).map(mapTermData) as Term[];
    },
    enabled: !!userId,
  });
}

// --- Courses Hook ---
export function useCourses(userId?: string) {
  return useQuery({
    queryKey: ["courses", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          terms:term_id (
            id,
            user_id,
            academic_year,
            semester,
            start_date,
            end_date,
            is_active
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []).map((course: any) => ({
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
      })) as Course[];
    },
    enabled: !!userId,
  });
}

// --- Course Detail Hook ---
export function useCourseDetail(courseId: string, userId?: string) {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      if (!courseId || !userId) return null;

      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select(`
          *,
          terms:term_id (
            id,
            academic_year,
            semester
          )
        `)
        .eq("id", courseId)
        .eq("user_id", userId)
        .single();

      if (courseError) throw courseError;

      const { data: scaleData } = await supabase
        .from("grading_scale")
        .select("*")
        .eq("course_id", courseId)
        .order("grade_point", { ascending: true });

      const { data: assessmentsData, error: assessmentsError } = await supabase
        .from("assessments")
        .select("*")
        .eq("course_id", courseId)
        .order("component_type", { ascending: true })
        .order("created_at", { ascending: true });

      if (assessmentsError) throw assessmentsError;

      const { data: gradesData } = await supabase
        .from("assessment_grades")
        .select("*")
        .eq("course_id", courseId);

      const mappedCourse: Course = {
        ...courseData,
        course_code: courseData.course_code || "",
        term: courseData.terms ? {
          id: courseData.terms.id,
          academicYear: courseData.terms.academic_year,
          semester: courseData.terms.semester,
          user_id: userId,
          startDate: null,
          endDate: null,
          courses: 0,
          units: 0,
          gpa: 0,
          isActive: false,
        } : undefined,
      };

      const mappedAssessments: Assessment[] = (assessmentsData || []).map(a => ({
        id: a.id,
        course_id: a.course_id,
        assessment_name: a.assessment_name,
        occurrences: a.occurrences,
        percentage: a.percentage,
        component_type: a.component_type,
        created_at: a.created_at,
        updated_at: a.updated_at,
      }));

      const allGrades: AssessmentGrade[] = [];
      for (const assessment of mappedAssessments) {
        for (let i = 1; i <= assessment.occurrences; i++) {
          const existing = (gradesData || []).find(
            (g) => g.assessment_id === assessment.id && g.occurrence_number === i
          );

          allGrades.push({
            id: existing?.id || `new-${assessment.id}-${i}`,
            course_id: courseId,
            assessment_id: assessment.id,
            occurrence_number: i,
            grade: existing?.grade || null,
          });
        }
      }

      return {
        course: mappedCourse,
        gradingScale: (scaleData || []) as GradingScale[],
        assessments: mappedAssessments,
        grades: allGrades,
      };
    },
    enabled: !!courseId && !!userId,
  });
}


export function useCreateCourseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user, courseData }: { user: User; courseData: any }) => {
      const courseInsertData: any = {
        user_id: user.id,
        term_id: courseData.academicTerm,
        course_name: courseData.courseTitle,
        course_code: courseData.courseCode,
        course_type: courseData.courseType,
        units: parseFloat(courseData.units),
        course_structure: courseData.courseStructure,
        target_gpa: courseData.targetGPA ? parseFloat(courseData.targetGPA) : null,
        course_color: courseData.courseColor,
        lecture_percentage: courseData.lecturePercentage,
        laboratory_percentage: courseData.laboratoryPercentage,
      };

      if (courseData.gradeInputMode === "final" && courseData.finalGrade !== undefined) {
        courseInsertData.grade = courseData.finalGrade;
      }

      const { data: newCourse, error: courseError } = await supabase
        .from("courses")
        .insert(courseInsertData)
        .select()
        .single();

      if (courseError) throw courseError;

      if (courseData.gradeInputMode === "assessments" || !courseData.gradeInputMode) {
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
      return newCourse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["terms"] });
    },
  });
}

export function useUpdateCourseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase.from("courses").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["terms"] });
    },
  });
}

export function useUpdateAssessmentOccurrencesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ 
      courseId, 
      assessmentId, 
      newOccurrences, 
      oldOccurrences 
    }: { 
      courseId: string; 
      assessmentId: string; 
      newOccurrences: number; 
      oldOccurrences: number;
    }) => {
      const { error: updateError } = await supabase
        .from("assessments")
        .update({ occurrences: newOccurrences })
        .eq("id", assessmentId);

      if (updateError) throw updateError;

      if (newOccurrences > oldOccurrences) {
        const newGradeRecords = [];
        for (let i = oldOccurrences + 1; i <= newOccurrences; i++) {
          newGradeRecords.push({
            course_id: courseId,
            assessment_id: assessmentId,
            occurrence_number: i,
            grade: null,
          });
        }

        if (newGradeRecords.length > 0) {
          const { error: insertError } = await supabase
            .from("assessment_grades")
            .insert(newGradeRecords);

          if (insertError) throw insertError;
        }
      } else if (newOccurrences < oldOccurrences) {
        const { error: deleteError } = await supabase
          .from("assessment_grades")
          .delete()
          .eq("assessment_id", assessmentId)
          .gt("occurrence_number", newOccurrences);

        if (deleteError) throw deleteError;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
    },
  });
}

export function useSaveGradingScaleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, scales }: { courseId: string; scales: any[] }) => {
      await supabase.from("grading_scale").delete().eq("course_id", courseId);

      const { error } = await supabase.from("grading_scale").insert(
        scales.map((s) => ({
          course_id: courseId,
          grade_point: s.grade_point,
          min_percentage: s.min_percentage,
          max_percentage: s.max_percentage,
        }))
      );

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
    },
  });
}

export function useSaveGradesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ 
      courseId, 
      localGrades, 
      assessments, 
      gradingScale 
    }: { 
      courseId: string; 
      localGrades: AssessmentGrade[]; 
      assessments: Assessment[]; 
      gradingScale: GradingScale[];
    }) => {
      const existingGrades = localGrades.filter((g) => !g.id.toString().startsWith("new-"));
      const newGrades = localGrades.filter(
        (g) => g.id.toString().startsWith("new-") && g.grade !== null
      );

      for (const grade of existingGrades) {
        const { error } = await supabase.from("assessment_grades").upsert({
          id: grade.id,
          course_id: courseId,
          assessment_id: grade.assessment_id,
          occurrence_number: grade.occurrence_number,
          grade: grade.grade,
        });
        if (error) throw error;
      }

      if (newGrades.length > 0) {
        const { error } = await supabase.from("assessment_grades").insert(
          newGrades.map((g) => ({
            course_id: courseId,
            assessment_id: g.assessment_id,
            occurrence_number: g.occurrence_number,
            grade: g.grade,
          }))
        );
        if (error) throw error;
      }

      if (gradingScale.length > 0) {
        let totalWeightedGrade = 0;
        let totalWeight = 0;

        for (const assessment of assessments) {
          const assessmentGrades = localGrades.filter(
            (g) => g.assessment_id === assessment.id && g.grade !== null
          );

          if (assessmentGrades.length > 0) {
            const avgGrade =
              assessmentGrades.reduce((sum, g) => sum + (g.grade || 0), 0) /
              assessmentGrades.length;
            totalWeightedGrade += avgGrade * assessment.percentage;
            totalWeight += assessment.percentage;
          }
        }

        const finalPercentageValue = totalWeight > 0 ? totalWeightedGrade / totalWeight : 0;
        let calculatedFinalGPA: number | null = null;

        for (const scale of gradingScale) {
          if (finalPercentageValue >= scale.min_percentage && finalPercentageValue <= scale.max_percentage) {
            calculatedFinalGPA = scale.grade_point;
            break;
          }
        }

        if (calculatedFinalGPA !== null) {
          const { error: courseError } = await supabase
            .from("courses")
            .update({ grade: calculatedFinalGPA })
            .eq("id", courseId);
          if (courseError) throw courseError;
        }
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["terms"] });
    },
  });
}

export function useAddAssessmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ 
      courseId, 
      assessment 
    }: { 
      courseId: string; 
      assessment: any 
    }) => {
      const { data, error } = await supabase
        .from("assessments")
        .insert({
          course_id: courseId,
          assessment_name: assessment.assessment_name,
          percentage: assessment.percentage,
          occurrences: assessment.occurrences,
          component_type: assessment.component_type,
        })
        .select()
        .single();

      if (error) throw error;

      const gradeRecords = [];
      for (let i = 1; i <= data.occurrences; i++) {
        gradeRecords.push({
          course_id: courseId,
          assessment_id: data.id,
          occurrence_number: i,
          grade: null,
        });
      }

      if (gradeRecords.length > 0) {
        const { error: gradesError } = await supabase
          .from("assessment_grades")
          .insert(gradeRecords);
        if (gradesError) throw gradesError;
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
    },
  });
}

export function useUpdateAssessmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ 
      courseId, 
      assessmentId, 
      data 
    }: { 
      courseId: string; 
      assessmentId: string; 
      data: any 
    }) => {
      const { error } = await supabase
        .from("assessments")
        .update(data)
        .eq("id", assessmentId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
    },
  });
}

export function useDeleteAssessmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ 
      courseId, 
      assessmentId 
    }: { 
      courseId: string; 
      assessmentId: string 
    }) => {
      await supabase
        .from("assessment_grades")
        .delete()
        .eq("assessment_id", assessmentId);

      const { error } = await supabase
        .from("assessments")
        .delete()
        .eq("id", assessmentId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
    },
  });
}

export function useDeleteCourseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: string) => {
      await supabase.from("grading_scale").delete().eq("course_id", courseId);
      await supabase.from("assessment_grades").delete().eq("course_id", courseId);
      await supabase.from("assessments").delete().eq("course_id", courseId);

      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["terms"] });
    },
  });
}
