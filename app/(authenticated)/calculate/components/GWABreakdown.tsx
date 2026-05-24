"use client";

import { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { GWABreakdownProps } from "@/types";

export default function GWABreakdown({
  academicYear,
  specificRange,
  courses,
}: GWABreakdownProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!tableRef.current) return;
    setIsExporting(true);

    try {
      const element = tableRef.current;
      const originalStyle = element.style.width;
      element.style.width = "1200px";

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        scrollY: -window.scrollY,
        windowWidth: 1200,
      });

      element.style.width = originalStyle;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const pdfHeight = (canvasHeight * pdfWidth) / canvasWidth;

      const fileName = academicYear === "all" 
        ? "GWA-Breakdown-All Terms.pdf"
        : `GWA-Breakdown-${academicYear}${specificRange ? ` ${specificRange}` : ""}.pdf`;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      pdf.save(fileName);
    } catch (error) {
      console.error("Failed to export PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (courses.length === 0) {
    return (
      <section>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-on-surface">Detailed Calculation Breakdown</h2>
        </div>
        <div className="bg-surface-container-lowest border-2 border-dashed border-outline-variant/30 rounded-lg p-20 text-center">
          <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 opacity-20 block">search_off</span>
          <h3 className="text-xl font-bold text-on-surface mb-2">Scope Initialization Pending</h3>
          <p className="text-on-surface-variant max-w-xs mx-auto">Select &quot;All Academic Terms&quot; or a specific term to view the calculation breakdown.</p>
        </div>
      </section>
    );
  }

  let sumOfWeightedGrades_Academic = 0;
  let sumOfUnits_Academic = 0;
  let sumOfWeightedGrades_Total = 0;
  let sumOfUnits_Total = 0;

  for (const course of courses) {
    const grade = parseFloat(String(course.grade ?? 0));
    const units = parseFloat(String(course.units ?? 0));
    if (!isNaN(grade) && !isNaN(units) && units > 0) {
      const weightedGrade = grade * units;
      sumOfWeightedGrades_Total += weightedGrade;
      sumOfUnits_Total += units;
      if (course.course_type === "Academic" || course.course_type === "Major") {
        sumOfWeightedGrades_Academic += weightedGrade;
        sumOfUnits_Academic += units;
      }
    }
  }

  const finalAcademicGWA =
    sumOfUnits_Academic > 0
      ? (sumOfWeightedGrades_Academic / sumOfUnits_Academic).toFixed(2)
      : "N/A";
  const finalTotalGWA =
    sumOfUnits_Total > 0
      ? (sumOfWeightedGrades_Total / sumOfUnits_Total).toFixed(2)
      : "N/A";

  return (
    <section>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-on-surface">Detailed Calculation Breakdown</h2>
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-container-high hover:bg-surface-container-highest disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-sm font-bold transition-all active:scale-95"
        >
          {isExporting ? (
             <span className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          ) : (
            <span className="material-symbols-outlined text-base">download</span>
          )}
          <span className={isExporting ? "" : "hidden xs:inline"}>
            {isExporting ? "Generating PDF..." : "Export PDF"}
          </span>
          {!isExporting && <span className="xs:hidden">Export</span>}
        </button>
      </div>

      <div ref={tableRef} className="bg-surface-container-lowest rounded-lg shadow-[0_20px_40px_rgba(26,27,36,0.04)] overflow-x-auto print:overflow-visible">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/10">
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Course Code</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Course Title</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">Units</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">Grade</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Weighted Point</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {courses.map((course) => {
               const grade = parseFloat(String(course.grade ?? 0));
               const units = parseFloat(String(course.units ?? 0));
               const weightedGrade = (!isNaN(grade) && !isNaN(units)) ? (grade * units).toFixed(2) : "0.00";

               return (
                <tr key={course.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-8 py-4 font-bold text-primary">{course.course_code || 'N/A'}</td>
                  <td className="px-8 py-4 font-medium text-on-surface">{course.course_name}</td>
                  <td className="px-8 py-4 text-center font-medium">{course.units.toFixed(1)}</td>
                  <td className="px-8 py-4 text-center">
                    <span 
                      className="inline-flex items-center justify-center bg-primary-container text-on-primary-container rounded-sm px-3 py-1 text-[11px] font-bold"
                    >
                      {course.grade ? course.grade.toFixed(2) : "0.00"}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right font-mono font-bold">
                    {weightedGrade}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-surface-container-high font-bold border-t border-outline-variant/20">
              <td className="px-8 py-6 text-on-surface text-lg" colSpan={2}>
                Total Curriculum Weighted Average
              </td>
              <td className="px-8 py-6 text-center text-lg">{sumOfUnits_Total.toFixed(1)}</td>
              <td className="px-8 py-6"></td>
              <td className="px-8 py-6 text-right text-2xl text-primary tracking-tighter">
                {finalTotalGWA}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Legend / Note Area */}
      <div className="mt-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-surface-container-low p-6 rounded-lg shadow-sm border-l-4 border-primary">
          <h4 className="font-bold text-on-surface mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">info</span>
            Calculation Logic
          </h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            GWA is calculated by multiplying the grade by the number of units, then dividing the sum of the weighted points by the total number of units (excluding non-weighted courses like PE or NSTP).
          </p>
        </div>
        <div className="flex-1 bg-surface-container-low p-6 rounded-lg shadow-sm border-l-4 border-on-surface">
          <h4 className="font-bold text-on-surface mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">priority_high</span>
            Requirement Warning
          </h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Maintain a GWA of at least 1.75 to remain eligible for the University Scholarship. Monitor your semester performance to stay on track.
          </p>
        </div>
      </div>
    </section>
  );
}