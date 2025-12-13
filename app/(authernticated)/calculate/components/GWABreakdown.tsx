import { GWABreakdownProps } from "@/types";

export default function GWABreakdown({
  academicYear,
  specificRange,
  courses,
}: GWABreakdownProps) {
  if (courses.length === 0) {
    return (
      <div className="bg-white border-2 border-black rounded-[45px] p-8 shadow-[0_5px_0_#191A23] min-h-[470px]">
        <h3 className="text-3xl font-medium mb-6">GWA Breakdown</h3>
        <div className="text-center text-gray-400 mt-20">
          <p>Select "All Academic Terms" or a specific term to view the calculation breakdown.</p>
        </div>
      </div>
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
      if (course.course_type === "Academic") {
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
    <div className="bg-white border-2 border-black rounded-[45px] p-6 sm:p-8 shadow-[0_5px_0_#191A23]">
      <h3 className="text-2xl sm:text-3xl font-medium mb-1">GWA Breakdown</h3>
      <p className="text-slate-500 mb-6">{academicYear} {specificRange}</p>

      <div className="overflow-x-auto mb-6">
        <table className="w-full min-w-[600px] text-sm text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3 font-medium text-slate-600">Course Name</th>
              <th className="p-3 font-medium text-slate-600 text-center">Grade</th>
              <th className="p-3 font-medium text-slate-600 text-center">Units</th>
              <th className="p-3 font-medium text-slate-600 text-center">Weighted Grade</th>
              <th className="p-3 font-medium text-slate-600">Type</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => {
              const grade = parseFloat(String(course.grade ?? 0));
              const units = parseFloat(String(course.units ?? 0));
              const weightedGrade = (!isNaN(grade) && !isNaN(units)) ? (grade * units).toFixed(2) : "N/A";

              return (
                <tr key={course.id} className="border-b last:border-0">
                  <td className="p-3 font-medium text-slate-900">{course.course_name}</td>
                  <td className="p-3 text-center">{course.grade?.toFixed(2) ?? "N/A"}</td>
                  <td className="p-3 text-center">{course.units}</td>
                  <td className="p-3 text-center">{weightedGrade}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      course.course_type === "Academic"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {course.course_type ?? "N/A"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-200 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-slate-800 mb-2">Academic GWA Summary</h4>
          <p className="text-sm text-slate-600">
            Sum of Weighted Grades / Sum of Units
          </p>
          <p className="text-lg font-bold text-slate-900 mt-1">
            {sumOfWeightedGrades_Academic.toFixed(2)} / {sumOfUnits_Academic} = {finalAcademicGWA}
          </p>
        </div>
        <div>
          <h4 className="font-medium text-slate-800 mb-2">Total GWA Summary</h4>
          <p className="text-sm text-slate-600">
            Sum of Weighted Grades / Sum of Units
          </p>
          <p className="text-lg font-bold text-slate-900 mt-1">
            {sumOfWeightedGrades_Total.toFixed(2)} / {sumOfUnits_Total} = {finalTotalGWA}
          </p>
        </div>
      </div>
    </div>
  );
}