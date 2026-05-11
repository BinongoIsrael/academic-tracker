"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Trash2, Edit2 } from "lucide-react";
import { Course, EditCourseModalProps, Assessment } from "@/types";
import ColorPicker from "../../components/ColorPicker";
import CourseStructureRadio from "../../components/CourseStructureRadio";
import DeleteCourseModal from "./DeleteCourseModal";
import Toast from "../../../components/Toast";
import { supabase } from "@/utils/supabase/client";

export default function EditCourseModal({
  course,
  terms,
  onSave,
  onClose,
  onDelete,
}: EditCourseModalProps & { onDelete?: () => Promise<void> }) {
  const router = useRouter();
  const [courseName, setCourseName] = useState(course.course_name);
  const [termId, setTermId] = useState(course.term_id);
  const [courseType, setCourseType] = useState(course.course_type);
  const [units, setUnits] = useState(course.units.toString());
  const [targetGPA, setTargetGPA] = useState(
    course.target_gpa?.toString() || ""
  );
  const [courseColor, setCourseColor] = useState(
    course.course_color || "#3B82F6"
  );
  const [courseStructure, setCourseStructure] = useState(
    course.course_structure
  );
  const [lecturePercentage, setLecturePercentage] = useState(
    (course.lecture_percentage || 50).toString()
  );
  const [laboratoryPercentage, setLaboratoryPercentage] = useState(
    (course.laboratory_percentage || 50).toString()
  );
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [editingAssessmentId, setEditingAssessmentId] = useState<string | null>(
    null
  );
  const [assessmentForm, setAssessmentForm] = useState({
    name: "",
    percentage: "",
    occurrences: "1",
    componentType: "Lecture" as "Lecture" | "Laboratory",
  });

  const fetchAssessments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("course_id", course.id)
        .order("component_type", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) throw error;

      const mappedAssessments: Assessment[] = (data || []).map((a) => ({
        id: a.id,
        course_id: a.course_id,
        assessment_name: a.assessment_name,
        occurrences: a.occurrences,
        percentage: a.percentage,
        component_type: a.component_type,
        created_at: a.created_at,
        updated_at: a.updated_at,
      }));

      setAssessments(mappedAssessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
    }
  }, [course.id]);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  const handleAddAssessment = async () => {
    if (!assessmentForm.name || !assessmentForm.percentage) {
      setToast({
        message: "Please fill in assessment name and percentage",
        type: "error",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("assessments")
        .insert({
          course_id: course.id,
          assessment_name: assessmentForm.name,
          percentage: parseFloat(assessmentForm.percentage),
          occurrences: parseInt(assessmentForm.occurrences),
          component_type: assessmentForm.componentType,
        })
        .select()
        .single();

      if (error) throw error;

      setToast({
        message: "Assessment added successfully!",
        type: "success",
      });

      setAssessmentForm({
        name: "",
        percentage: "",
        occurrences: "1",
        componentType: "Lecture",
      });

      await fetchAssessments();
    } catch (error) {
      console.error("Error adding assessment:", error);
      setToast({
        message: "Failed to add assessment",
        type: "error",
      });
    }
  };

  const handleEditAssessment = async (assessmentId: string) => {
    if (!assessmentForm.name || !assessmentForm.percentage) {
      setToast({
        message: "Please fill in assessment name and percentage",
        type: "error",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("assessments")
        .update({
          assessment_name: assessmentForm.name,
          percentage: parseFloat(assessmentForm.percentage),
          occurrences: parseInt(assessmentForm.occurrences),
          component_type: assessmentForm.componentType,
        })
        .eq("id", assessmentId);

      if (error) throw error;

      setToast({
        message: "Assessment updated successfully!",
        type: "success",
      });

      setEditingAssessmentId(null);
      setAssessmentForm({
        name: "",
        percentage: "",
        occurrences: "1",
        componentType: "Lecture",
      });

      await fetchAssessments();
    } catch (error) {
      console.error("Error updating assessment:", error);
      setToast({
        message: "Failed to update assessment",
        type: "error",
      });
    }
  };

  const handleDeleteAssessment = async (assessmentId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this assessment? All associated grades will be deleted."
      )
    ) {
      return;
    }

    try {
      await supabase
        .from("assessment_grades")
        .delete()
        .eq("assessment_id", assessmentId);

      const { error } = await supabase
        .from("assessments")
        .delete()
        .eq("id", assessmentId);

      if (error) throw error;

      setToast({
        message: "Assessment deleted successfully!",
        type: "success",
      });

      await fetchAssessments();
    } catch (error) {
      console.error("Error deleting assessment:", error);
      setToast({
        message: "Failed to delete assessment",
        type: "error",
      });
    }
  };

  const startEditingAssessment = (assessment: Assessment) => {
    setEditingAssessmentId(assessment.id);
    setAssessmentForm({
      name: assessment.assessment_name,
      percentage: assessment.percentage.toString(),
      occurrences: assessment.occurrences.toString(),
      componentType: assessment.component_type as "Lecture" | "Laboratory",
    });
  };

  const cancelEditing = () => {
    setEditingAssessmentId(null);
    setAssessmentForm({
      name: "",
      percentage: "",
      occurrences: "1",
      componentType: "Lecture",
    });
  };

  const handleLecturePercentageChange = (value: string) => {
    const lectureVal = parseFloat(value) || 0;
    setLecturePercentage(value);
    setLaboratoryPercentage((100 - lectureVal).toString());
  };

  const handleLaboratoryPercentageChange = (value: string) => {
    const labVal = parseFloat(value) || 0;
    setLaboratoryPercentage(value);
    setLecturePercentage((100 - labVal).toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseColor || !courseType || !courseStructure) {
      setToast({
        message: "Missing required fields. Please fill in all fields.",
        type: "error",
      });
      return;
    }

    if (courseStructure === "Lecture + Laboratory") {
      const totalPercentage =
        parseFloat(lecturePercentage) + parseFloat(laboratoryPercentage);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        setToast({
          message: "Lecture and Laboratory percentages must add up to 100%",
          type: "error",
        });
        return;
      }
    }

    setSaving(true);

    try {
      await onSave({
        course_name: courseName,
        term_id: termId,
        course_type: courseType,
        units: parseFloat(units),
        target_gpa: targetGPA ? parseFloat(targetGPA) : null,
        course_color: courseColor,
        course_structure: courseStructure,
        lecture_percentage: parseFloat(lecturePercentage),
        laboratory_percentage: parseFloat(laboratoryPercentage),
      });
      onClose();
    } catch (error) {
      console.error("Error saving course:", error);
      setToast({
        message: "Failed to update course. Please try again.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      const courseId = course?.id;

      if (!courseId) return;

      await supabase.from("grading_scale").delete().eq("course_id", courseId);

      await supabase
        .from("assessment_grades")
        .delete()
        .eq("course_id", courseId);

      await supabase.from("assessments").delete().eq("course_id", courseId);

      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId);

      if (error) throw error;

      setToast({
        message: "Course deleted successfully!",
        type: "success",
      });

      setTimeout(() => {
        router.push("/courses");
      }, 1000);
    } catch (error) {
      console.error("Error deleting course:", error);
      setToast({
        message: "Failed to delete course. Please try again.",
        type: "error",
      });
      throw error;
    }
  };

  const lectureAssessments = assessments.filter(
    (a) => a.component_type === "Lecture"
  );
  const labAssessments = assessments.filter(
    (a) => a.component_type === "Laboratory"
  );

  const getTotalPercentage = (componentType: "Lecture" | "Laboratory") => {
    return assessments
      .filter((a) => a.component_type === componentType)
      .reduce((sum, a) => sum + a.percentage, 0);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white rounded-[30px] sm:rounded-[45px] border border-black shadow-[0_5px_0_0_#191A23] max-w-full sm:max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between rounded-t-[30px] sm:rounded-t-[45px]">
            <h2 className="text-xl sm:text-[30px] font-medium">Edit Course</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Course Name
              </label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
                className="w-full h-10 px-3 pr-12 bg-white border border-black rounded-md text-base focus:outline-none focus:ring-2 focus:ring-brand-green custom-select"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Academic Term
                </label>
                <select
                  value={termId}
                  onChange={(e) => setTermId(e.target.value)}
                  required
                  className="w-full h-10 px-3 pr-12 bg-white border border-black rounded-md text-base focus:outline-none focus:ring-2 focus:ring-brand-green custom-select"
                >
                  {terms
                    .sort((a, b) => {
                      const yearDiff =
                        Number(b.academicYear.split("-")[0]) -
                        Number(a.academicYear.split("-")[0]);
                      if (yearDiff !== 0) return yearDiff;

                      const semesterOrder = { "1st": 0, "2nd": 1, Summer: 2 };
                      const aSemOrder =
                        semesterOrder[
                          a.semester as keyof typeof semesterOrder
                        ] ?? 999;
                      const bSemOrder =
                        semesterOrder[
                          b.semester as keyof typeof semesterOrder
                        ] ?? 999;

                      return aSemOrder - bSemOrder;
                    })
                    .map((term) => (
                      <option key={term.id} value={term.id}>
                        {term.academicYear} {term.semester}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Course Type
                </label>
                <select
                  value={courseType}
                  onChange={(e) => setCourseType(e.target.value)}
                  required
                  className="w-full h-10 px-3 pr-12 bg-white border border-black rounded-md text-base focus:outline-none focus:ring-2 focus:ring-brand-green custom-select"
                >
                  <option value="Academic">Academic</option>
                  <option value="Non-Academic">Non-Academic</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Units
                </label>
                <input
                  type="number"
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  required
                  step="1"
                  min="0"
                  className="w-full h-10 px-3 pr-12 bg-white border border-black rounded-md text-base focus:outline-none focus:ring-2 focus:ring-brand-green custom-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Target GPA
                </label>
                <input
                  type="number"
                  value={targetGPA}
                  onChange={(e) => setTargetGPA(e.target.value)}
                  step="0.05"
                  min="1"
                  max="5"
                  className="w-full h-10 px-3 pr-12 bg-white border border-black rounded-md text-base focus:outline-none focus:ring-2 focus:ring-brand-green custom-select"
                />
              </div>
            </div>

            <div className="mb-6">
              <ColorPicker
                selectedColor={courseColor}
                onColorChange={(color: string) => setCourseColor(color)}
              />
            </div>

            <div className="mb-6">
              <CourseStructureRadio
                value={courseStructure ?? ""}
                onChange={setCourseStructure}
              />
            </div>

            {courseStructure === "Lecture + Laboratory" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-900 mb-3">
                  Weight Distribution
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Lecture Percentage
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={lecturePercentage}
                        onChange={(e) =>
                          handleLecturePercentageChange(e.target.value)
                        }
                        min="0"
                        max="100"
                        step="1"
                        className="w-full h-10 px-3 pr-12 bg-white border border-black rounded-md text-base focus:outline-none focus:ring-2 focus:ring-brand-green custom-select"
                      />
                      <span className="text-sm font-medium">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Laboratory Percentage
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={laboratoryPercentage}
                        onChange={(e) =>
                          handleLaboratoryPercentageChange(e.target.value)
                        }
                        min="0"
                        max="100"
                        step="1"
                        className="w-full h-10 px-3 pr-12 bg-white border border-black rounded-md text-base focus:outline-none focus:ring-2 focus:ring-brand-green custom-select"
                      />
                      <span className="text-sm font-medium">%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-slate-900 mb-4">
                Manage Assessments
              </h3>

              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Assessment Name
                    </label>
                    <input
                      type="text"
                      value={assessmentForm.name}
                      onChange={(e) =>
                        setAssessmentForm({
                          ...assessmentForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="e.g., Quiz, Exam, Project"
                      className="w-full h-10 px-3 pr-12 bg-white border border-black rounded-md text-base focus:outline-none focus:ring-2 focus:ring-brand-green custom-select"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Component Type
                    </label>
                    <select
                      value={assessmentForm.componentType}
                      onChange={(e) =>
                        setAssessmentForm({
                          ...assessmentForm,
                          componentType: e.target.value as
                            | "Lecture"
                            | "Laboratory",
                        })
                      }
                      className="w-full h-10 px-3 pr-12 bg-white border border-black rounded-md text-base focus:outline-none focus:ring-2 focus:ring-brand-green custom-select"
                    >
                      <option value="Lecture">Lecture</option>
                      {courseStructure === "Lecture + Laboratory" && (
                        <option value="Laboratory">Laboratory</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Percentage
                    </label>
                    <input
                      type="number"
                      value={assessmentForm.percentage}
                      onChange={(e) =>
                        setAssessmentForm({
                          ...assessmentForm,
                          percentage: e.target.value,
                        })
                      }
                      placeholder="0"
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full h-10 px-3 pr-12 bg-white border border-black rounded-md text-base focus:outline-none focus:ring-2 focus:ring-brand-green custom-select"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Occurrences
                    </label>
                    <input
                      type="number"
                      value={assessmentForm.occurrences}
                      onChange={(e) =>
                        setAssessmentForm({
                          ...assessmentForm,
                          occurrences: e.target.value,
                        })
                      }
                      min="1"
                      step="1"
                      className="w-full h-10 px-3 pr-12 bg-white border border-black rounded-md text-base focus:outline-none focus:ring-2 focus:ring-brand-green custom-select"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  {editingAssessmentId ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          handleEditAssessment(editingAssessmentId)
                        }
                        className="px-4 py-2 bg-brand-dark text-white rounded-lg hover:bg-opacity-90 transition-colors"
                      >
                        Update Assessment
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAddAssessment}
                      className="flex items-center gap-2 px-4 py-2 bg-brand-dark text-white rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Assessment
                    </button>
                  )}
                </div>
              </div>

              {lectureAssessments.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-slate-700">
                      Lecture Assessments
                    </h4>
                    <span className="text-sm text-slate-600">
                      Total: {getTotalPercentage("Lecture").toFixed(2)}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    {lectureAssessments.map((assessment) => (
                      <div
                        key={assessment.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">
                            {assessment.assessment_name}
                          </p>
                          <p className="text-sm text-slate-600">
                            {assessment.percentage}% • {assessment.occurrences}{" "}
                            occurrence(s)
                          </p>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                          <button
                            type="button"
                            onClick={() => startEditingAssessment(assessment)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteAssessment(assessment.id)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {labAssessments.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-slate-700">
                      Laboratory Assessments
                    </h4>
                    <span className="text-sm text-slate-600">
                      Total: {getTotalPercentage("Laboratory").toFixed(2)}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    {labAssessments.map((assessment) => (
                      <div
                        key={assessment.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">
                            {assessment.assessment_name}
                          </p>
                          <p className="text-sm text-slate-600">
                            {assessment.percentage}% • {assessment.occurrences}{" "}
                            occurrence(s)
                          </p>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                          <button
                            type="button"
                            onClick={() => startEditingAssessment(assessment)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteAssessment(assessment.id)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col xs:flex-row justify-between gap-3 xs:gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-3 bg-red-600 text-white rounded-[20px] font-medium hover:bg-red-700 transition-colors w-full xs:w-auto"
              >
                Delete Course
              </button>
              <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 w-full xs:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-white border border-black text-black rounded-[20px] font-medium hover:bg-gray-50 transition-colors w-full xs:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-brand-dark text-white rounded-[20px] font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 w-full xs:w-auto"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {showDeleteConfirm && (
        <DeleteCourseModal
          courseName={course.course_name}
          onConfirm={handleDeleteCourse}
          onClose={() => setShowDeleteConfirm(false)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
