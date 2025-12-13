"use client";

import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { Assessment, CreateCourseFormProps } from "@/types";
import CourseStructureRadio from "./CourseStructureRadio";
import GradeInputModeRadio from "./GradeInputModeRadio";
import CourseAssessmentSection from "./CourseAssessmentSection";
import AddAssessmentButton from "./AddAssessmentButton";
import WeightDistribution from "./WeightDistribution";
import ColorPicker, { getRandomColor } from "./ColorPicker";
import Toast from "../../components/Toast";

export default function CreateCourseForm({
  terms,
  onSubmit,
}: CreateCourseFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [academicTerm, setAcademicTerm] = useState("");
  const [courseType, setCourseType] = useState("");
  const [units, setUnits] = useState("");
  const [targetGPA, setTargetGPA] = useState("");
  const [courseColor, setCourseColor] = useState(getRandomColor());
  const [courseStructure, setCourseStructure] = useState("Lecture");

  const [gradeInputMode, setGradeInputMode] = useState<"assessments" | "final">(
    "assessments"
  );
  const [finalGrade, setFinalGrade] = useState("");

  const [lecturePercentage, setLecturePercentage] = useState("50");
  const [laboratoryPercentage, setLaboratoryPercentage] = useState("50");

  const [lectureAssessments, setLectureAssessments] = useState<
    Partial<Assessment>[]
  >([{ assessment_name: "", occurrences: 0, percentage: 0 }]);
  const [laboratoryAssessments, setLaboratoryAssessments] = useState<
    Partial<Assessment>[]
  >([{ assessment_name: "", occurrences: 0, percentage: 0 }]);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

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

  const addLectureAssessment = () => {
    setLectureAssessments([
      ...lectureAssessments,
      { assessment_name: "", occurrences: 0, percentage: 0 },
    ]);
  };

  const removeLectureAssessment = (index: number) => {
    setLectureAssessments(lectureAssessments.filter((_, i) => i !== index));
  };

  const updateLectureAssessment = (
    index: number,
    field: keyof Assessment,
    value: string | number
  ) => {
    const updated = [...lectureAssessments];
    if (field === "occurrences" || field === "percentage") {
      updated[index] = { ...updated[index], [field]: Number(value) };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setLectureAssessments(updated);
  };

  const addLaboratoryAssessment = () => {
    setLaboratoryAssessments([
      ...laboratoryAssessments,
      { assessment_name: "", occurrences: 0, percentage: 0 },
    ]);
  };

  const removeLaboratoryAssessment = (index: number) => {
    setLaboratoryAssessments(
      laboratoryAssessments.filter((_, i) => i !== index)
    );
  };

  const updateLaboratoryAssessment = (
    index: number,
    field: keyof Assessment,
    value: string | number
  ) => {
    const updated = [...laboratoryAssessments];
    if (field === "occurrences" || field === "percentage") {
      updated[index] = { ...updated[index], [field]: Number(value) };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setLaboratoryAssessments(updated);
  };

  const handleSubmit = async () => {
    if (gradeInputMode === "final") {
      const gradeValue = parseFloat(finalGrade);
      if (
        !finalGrade ||
        isNaN(gradeValue) ||
        gradeValue < 1 ||
        gradeValue > 5
      ) {
        setToast({
          message: "Please enter a valid final grade (1.0 - 5.0)",
          type: "error",
        });
        return;
      }

      await onSubmit({
        courseTitle,
        academicTerm,
        courseType,
        units,
        courseStructure,
        targetGPA,
        courseColor,
        lectureAssessments: [],
        laboratoryAssessments: [],
        lecturePercentage: parseFloat(lecturePercentage),
        laboratoryPercentage: parseFloat(laboratoryPercentage),
        finalGrade: gradeValue,
        gradeInputMode: "final",
      });
    } else {
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

      const expectedLectureTotal =
        courseStructure === "Lecture + Laboratory"
          ? parseFloat(lecturePercentage)
          : 100;

      const lectureTotalPercentage = lectureAssessments.reduce(
        (sum, assessment) => sum + (Number(assessment.percentage) || 0),
        0
      );

      if (Math.abs(lectureTotalPercentage - expectedLectureTotal) > 0.01) {
        setToast({
          message: `Lecture assessment percentages must add up to ${expectedLectureTotal}% (Currently: ${lectureTotalPercentage.toFixed(
            1
          )}%)`,
          type: "error",
        });
        return;
      }

      if (courseStructure === "Lecture + Laboratory") {
        const expectedLabTotal = parseFloat(laboratoryPercentage);
        const labTotalPercentage = laboratoryAssessments.reduce(
          (sum, assessment) => sum + (Number(assessment.percentage) || 0),
          0
        );

        if (Math.abs(labTotalPercentage - expectedLabTotal) > 0.01) {
          setToast({
            message: `Laboratory assessment percentages must add up to ${expectedLabTotal}% (Currently: ${labTotalPercentage.toFixed(
              1
            )}%)`,
            type: "error",
          });
          return;
        }
      }

      await onSubmit({
        courseTitle,
        academicTerm,
        courseType,
        units,
        courseStructure,
        targetGPA,
        courseColor,
        lectureAssessments,
        laboratoryAssessments,
        lecturePercentage: parseFloat(lecturePercentage),
        laboratoryPercentage: parseFloat(laboratoryPercentage),
        gradeInputMode: "assessments",
      });
    }

    setCourseTitle("");
    setAcademicTerm("");
    setCourseType("");
    setUnits("");
    setTargetGPA("");
    setCourseColor(getRandomColor());
    setCourseStructure("Lecture");
    setGradeInputMode("assessments");
    setFinalGrade("");
    setLecturePercentage("50");
    setLaboratoryPercentage("50");
    setLectureAssessments([
      { assessment_name: "", occurrences: 0, percentage: 0 },
    ]);
    setLaboratoryAssessments([
      { assessment_name: "", occurrences: 0, percentage: 0 },
    ]);

    setIsExpanded(false);
  };

  return (
    <>
      <div className="bg-white border border-black rounded-[45px] shadow-[0_5px_0_0_#191A23] mb-8 sm:mb-12 overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 sm:p-8 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
            <h2 className="text-xl sm:text-2xl lg:text-[30px] font-medium">
              Create New Course
            </h2>
          </div>
          <ChevronDown
            className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
        <div
          className={`transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="px-4 sm:px-8 pb-4 sm:pb-8">
            {/* Course Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Course Title
                </label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="Course Title"
                  className="w-full h-10 px-3 bg-white border border-black rounded-md text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Academic Term
                </label>
                <select
                  value={academicTerm}
                  onChange={(e) => setAcademicTerm(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-black rounded-md text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-green"
                >
                  <option value="" className="text-slate-400">
                    Select a term
                  </option>
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
                  className="w-full h-10 px-3 bg-white border border-black rounded-md text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-green"
                >
                  <option value="" className="text-slate-400">
                    Course Type
                  </option>
                  <option value="Academic">Academic</option>
                  <option value="Non-Academic">Non-Academic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Units
                </label>
                <input
                  type="number"
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  placeholder="Units"
                  step="1"
                  min="0"
                  className="w-full h-10 px-3 bg-white border border-black rounded-md text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>
            </div>

            {/* Target GPA and Color Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Target GPA
                </label>
                <input
                  type="number"
                  value={targetGPA}
                  onChange={(e) => setTargetGPA(e.target.value)}
                  placeholder="Target GPA"
                  step="0.05"
                  min="1"
                  max="5"
                  className="w-full h-10 px-3 bg-white border border-black rounded-md text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <ColorPicker
                  selectedColor={courseColor}
                  onColorChange={setCourseColor}
                />
              </div>
            </div>

            <GradeInputModeRadio
              value={gradeInputMode}
              onChange={setGradeInputMode}
            />

            {gradeInputMode === "final" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Final Grade (GPA)
                </label>
                <input
                  type="number"
                  value={finalGrade}
                  onChange={(e) => setFinalGrade(e.target.value)}
                  placeholder="Final Grade (1.0 - 5.0)"
                  step="0.05"
                  min="1"
                  max="5"
                  className="w-full sm:max-w-xs h-10 px-3 bg-white border border-black rounded-md text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Enter the final grade for this course (1.0 = Excellent, 5.0 =
                  Failed)
                </p>
              </div>
            )}

            {gradeInputMode === "assessments" && (
              <>
                <CourseStructureRadio
                  value={courseStructure}
                  onChange={setCourseStructure}
                />

                {courseStructure === "Lecture + Laboratory" && (
                  <WeightDistribution
                    lecturePercentage={lecturePercentage}
                    laboratoryPercentage={laboratoryPercentage}
                    onLecturePercentageChange={handleLecturePercentageChange}
                    onLaboratoryPercentageChange={
                      handleLaboratoryPercentageChange
                    }
                  />
                )}

                <CourseAssessmentSection
                  title={
                    courseStructure === "Lecture + Laboratory"
                      ? `Lecture Assessment (${lecturePercentage}%)`
                      : "Course Assessment"
                  }
                  assessments={lectureAssessments}
                  onUpdate={updateLectureAssessment}
                  onRemove={removeLectureAssessment}
                  addButton={
                    <AddAssessmentButton onClick={addLectureAssessment} />
                  }
                  expectedTotal={
                    courseStructure === "Lecture + Laboratory"
                      ? parseFloat(lecturePercentage)
                      : 100
                  }
                />

                {courseStructure === "Lecture + Laboratory" && (
                  <div className="pt-6 border-t-2 border-gray-200">
                    <CourseAssessmentSection
                      title={`Laboratory Assessment (${laboratoryPercentage}%)`}
                      assessments={laboratoryAssessments}
                      onUpdate={updateLaboratoryAssessment}
                      onRemove={removeLaboratoryAssessment}
                      addButton={
                        <AddAssessmentButton
                          onClick={addLaboratoryAssessment}
                        />
                      }
                      expectedTotal={parseFloat(laboratoryPercentage)}
                    />
                  </div>
                )}
              </>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-brand-dark text-white rounded-[20px] font-medium hover:bg-opacity-90 transition-colors text-sm sm:text-base"
              >
                Add Course
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

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