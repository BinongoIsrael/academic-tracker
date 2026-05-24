export const calculateGWA = (courses: { grade: number | null | undefined; units: number }[]) => {
  let totalWeightedGrades = 0;
  let totalUnits = 0;

  for (const course of courses) {
    const grade = parseFloat(String(course.grade ?? 0));
    const units = parseFloat(String(course.units ?? 0));
    
    // GWA typically excludes non-numeric/zero grades unless they are part of the curriculum
    // Based on the app logic, we check for units > 0 and valid grades
    if (!isNaN(grade) && !isNaN(units) && units > 0 && grade > 0) {
      totalWeightedGrades += grade * units;
      totalUnits += units;
    }
  }

  return totalUnits > 0 ? (totalWeightedGrades / totalUnits).toFixed(2) : "0.00";
};

export const formatUnits = (units: number) => {
  return units.toFixed(1);
};

export const getSemesterShortName = (semester: string) => {
  if (semester.includes("1st")) return "S1";
  if (semester.includes("2nd")) return "S2";
  if (semester.includes("Short")) return "ST";
  return semester;
};

export const mapTermData = (t: any) => {
  const courses = t.courses || [];
  const completedCourses = courses.filter((c: any) => c.grade !== null && c.grade !== undefined);
  
  return {
    id: t.id,
    user_id: t.user_id,
    academicYear: t.academic_year,
    semester: t.semester,
    startDate: t.start_date,
    endDate: t.end_date,
    isActive: t.is_active,
    courses: courses.length,
    units: courses.reduce((sum: number, c: any) => sum + (c.units || 0), 0),
    gpa: completedCourses.length > 0
      ? completedCourses.reduce((sum: number, c: any) => sum + (c.grade || 0), 0) / completedCourses.length
      : null,
    created_at: t.created_at,
    updated_at: t.updated_at,
  };
};
