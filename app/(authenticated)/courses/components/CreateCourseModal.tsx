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

export default function CreateCourseModal({
  terms,
  onSubmit,
  isOpen,
  onClose,
}: CreateCourseFormProps & { isOpen: boolean; onClose: () => void }) {
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

  if (!isOpen) return null;

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

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div 
        className="fixed inset-0 bg-on-background/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl bg-surface-container-lowest rounded-xl shadow-2xl border border-on-surface/5 flex flex-col max-h-full sm:max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-outline-variant/20 flex justify-between items-center bg-surface shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-on-surface">Initialize New Course</h2>
            <p className="text-xs sm:text-sm text-on-surface-variant font-medium">Define parameters and assessment structures for your new course</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-container rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 overflow-y-auto custom-scrollbar">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Course Title</label>
              <input
                type="text"
                placeholder="Advanced Quantum Mechanics"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="w-full bg-surface-container border-none focus:ring-1 focus:ring-primary rounded-md py-3 px-4 transition-all font-semibold"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Academic Term</label>
              <select
                value={academicTerm}
                onChange={(e) => setAcademicTerm(e.target.value)}
                className="w-full bg-surface-container border-none focus:ring-1 focus:ring-primary rounded-md py-3 px-4 font-semibold text-sm sm:text-base custom-select"
              >
                <option value="">Select a term</option>
                {terms
                  .sort((a, b) => {
                    const yearDiff =
                      Number(b.academicYear.split("-")[0]) -
                      Number(a.academicYear.split("-")[0]);
                    if (yearDiff !== 0) return yearDiff;
                    const semesterOrder = { "1st": 0, "2nd": 1, Summer: 2 };
                    const aSemOrder = semesterOrder[a.semester as keyof typeof semesterOrder] ?? 999;
                    const bSemOrder = semesterOrder[b.semester as keyof typeof semesterOrder] ?? 999;
                    return aSemOrder - bSemOrder;
                  })
                  .map((term) => (
                    <option key={term.id} value={term.id}>
                      {term.academicYear} {term.semester}
                    </option>
                  ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Course Type</label>
              <select
                value={courseType}
                onChange={(e) => setCourseType(e.target.value)}
                className="w-full bg-surface-container border-none focus:ring-1 focus:ring-primary rounded-md py-3 px-4 font-semibold text-sm sm:text-base custom-select"
              >
                <option value="">Course Type</option>
                <option value="Major">Major</option>
                <option value="Minor">Minor</option>
                <option value="General">General</option>
                <option value="Elective">Elective</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Units</label>
              <input
                type="number"
                placeholder="Units"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                className="w-full bg-surface-container border-none focus:ring-1 focus:ring-primary rounded-md py-3 px-4 font-semibold"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Target GPA</label>
              <input
                type="number"
                step="0.05"
                placeholder="Target GPA"
                value={targetGPA}
                onChange={(e) => setTargetGPA(e.target.value)}
                className="w-full bg-surface-container border-none focus:ring-1 focus:ring-primary rounded-md py-3 px-4 font-semibold"
              />
            </div>
          </div>

          <ColorPicker
            selectedColor={courseColor}
            onColorChange={setCourseColor}
          />

          <GradeInputModeRadio
            value={gradeInputMode}
            onChange={setGradeInputMode}
          />

          {gradeInputMode === "final" ? (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Final Grade</label>
              <input
                type="number"
                step="0.01"
                placeholder="Enter final grade (e.g., 1.25)"
                value={finalGrade}
                onChange={(e) => setFinalGrade(e.target.value)}
                className="w-full bg-surface-container border-none focus:ring-1 focus:ring-primary rounded-md py-3 px-4 font-semibold"
              />
            </div>
          ) : (
            <div className="space-y-8">
              <CourseStructureRadio
                value={courseStructure}
                onChange={setCourseStructure}
              />

              {courseStructure === "Lecture + Laboratory" && (
                <WeightDistribution
                  lecturePercentage={lecturePercentage}
                  laboratoryPercentage={laboratoryPercentage}
                  onLecturePercentageChange={handleLecturePercentageChange}
                  onLaboratoryPercentageChange={handleLaboratoryPercentageChange}
                />
              )}

              <CourseAssessmentSection
                title={
                  courseStructure === "Lecture + Laboratory"
                    ? `Lecture Assessment (${lecturePercentage}%)`
                    : "Course Assessments"
                }
                assessments={lectureAssessments}
                onUpdate={updateLectureAssessment}
                onRemove={removeLectureAssessment}
                addButton={<AddAssessmentButton onClick={addLectureAssessment} />}
                expectedTotal={courseStructure === "Lecture + Laboratory" ? parseFloat(lecturePercentage) : 100}
              />

              {courseStructure === "Lecture + Laboratory" && (
                <CourseAssessmentSection
                  title={`Laboratory Assessment (${laboratoryPercentage}%)`}
                  assessments={laboratoryAssessments}
                  onUpdate={updateLaboratoryAssessment}
                  onRemove={removeLaboratoryAssessment}
                  addButton={<AddAssessmentButton onClick={addLaboratoryAssessment} />}
                  expectedTotal={parseFloat(laboratoryPercentage)}
                />
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 sm:p-8 bg-surface-container-low flex flex-col sm:flex-row justify-end items-center gap-4 shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors order-2 sm:order-1"
          >
            Discard
          </button>
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto px-8 py-4 bg-primary text-on-primary rounded font-bold text-sm hover:shadow-[4px_4px_0px_#191A23] transition-all order-1 sm:order-2"
          >
            REGISTER COURSE TO GRADIENT
          </button>
        </div>
      </div>

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