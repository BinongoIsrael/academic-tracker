import { GWABreakdownProps } from "@/types";

export default function GWABreakdown({
  academicYear,
  specificRange,
  courses,
}: GWABreakdownProps) {
  if (courses.length === 0) {
    return (
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-on-surface">Detailed Calculation Breakdown</h2>
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
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-on-surface">Detailed Calculation Breakdown</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest rounded-md text-sm font-semibold transition-colors">
          <span className="material-symbols-outlined text-sm">download</span>
          Export PDF
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-lg shadow-[0_20px_40px_rgba(26,27,36,0.04)] overflow-hidden">
        <table className="w-full text-left border-collapse">
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
                    <span className="inline-block px-2 py-1 bg-primary-container text-on-primary-container text-sm font-bold rounded-sm">
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
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border-l-4 border-primary">
          <h4 className="font-bold text-on-surface mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">info</span>
            Calculation Logic
          </h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            GWA is calculated by multiplying the grade by the number of units, then dividing the sum of the weighted points by the total number of units (excluding non-weighted courses like PE or NSTP).
          </p>
        </div>
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border-l-4 border-on-surface">
          <h4 className="font-bold text-on-surface mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">priority_high</span>
            Requirement Warning
          </h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Maintain a GWA of at least 1.75 to remain eligible for the University Scholarship. Review your &apos;Academic Goals&apos; for personalized targets.
          </p>
        </div>
      </div>
    </section>
  );
}