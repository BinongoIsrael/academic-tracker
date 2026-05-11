import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { Term, Course, Assessment, AssessmentGrade } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(_req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "API key not configured." }, { status: 500 });
  }

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: termsData, error: termsError } = await supabase
      .from("terms")
      .select("*")
      .eq("user_id", user.id);
    if (termsError) throw termsError;

  const mappedTerms: Term[] = (termsData || []).map((t: any) => ({
      id: t.id,
      user_id: t.user_id,
      academicYear: t.academic_year,
      semester: t.semester,
      startDate: t.start_date,
      endDate: t.end_date,
      isActive: t.is_active,
      created_at: t.created_at,
      updated_at: t.updated_at,
      courses: 0,
      units: 0,
      gpa: 0,
    }));

    const now = new Date();
    let activeTerm = mappedTerms.find((t) => t.isActive) || null;
    if (!activeTerm) {
      activeTerm = mappedTerms.find((t) => new Date(t.startDate!) <= now && new Date(t.endDate!) >= now) || null;
    }
    if (!activeTerm) {
      const futureTerms = mappedTerms
        .filter((t) => new Date(t.startDate!) > now)
        .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime());
      if (futureTerms.length > 0) {
        activeTerm = futureTerms[0];
      }
    }

    if (!activeTerm) {
      return NextResponse.json({ recommendation: "### No Active Term Found\n\nI couldn't find an active or upcoming academic term to analyze. Please add or set a term as active to get a recommendation." }, { status: 200 });
    }

    const { data: courses, error: coursesError } = await supabase
      .from("courses")
      .select("*")
      .eq("term_id", activeTerm.id);
    if (coursesError) throw coursesError;

    if (!courses || courses.length === 0) {
        return NextResponse.json({ recommendation: `### No Courses in Current Term\n\nThere are no courses listed for the term **${activeTerm.academicYear} ${activeTerm.semester}**. Add courses to this term to get a recommendation.` }, { status: 200 });
    }

    const courseIds = (courses as Course[]).map((c: Course) => c.id);
    const { data: assessments, error: assessmentsError } = await supabase.from("assessments").select("*").in("course_id", courseIds);
    if (assessmentsError) throw assessmentsError;
    const { data: assessmentGrades, error: gradesError } = await supabase.from("assessment_grades").select("*").in("course_id", courseIds);
    if (gradesError) throw gradesError;

    const analysisData = {
        term: `${activeTerm.academicYear} ${activeTerm.semester}`,
        courses: (courses as Course[]).map((course: Course) => {
            const courseAssessments = (assessments as Assessment[]).filter((a: Assessment) => a.course_id === course.id);
            return {
                course_name: course.course_name,
                units: course.units,
                assessments: courseAssessments.map((assessment: Assessment) => {
                    const gradesForAssessment = (assessmentGrades as AssessmentGrade[]).filter((g: AssessmentGrade) => g.assessment_id === assessment.id);
                    return {
                        name: assessment.assessment_name,
                        percentage: assessment.percentage,
                        grades: gradesForAssessment.length > 0 ? gradesForAssessment.map((g: AssessmentGrade) => g.grade) : null,
                    };
                }),
            };
        }),
    };

    const prompt = `
      You are an expert academic advisor bot. Your tone is insightful and professional.
      A student needs proactive advice for their current, ongoing academic term. Analyze their course structure and any early assessment grades they've received.

      **IMPORTANT INSTRUCTIONS:**
      - Get straight to the point. Do not include a conversational greeting or introduction like "Hello!" or "It's a pleasure...".
      - Do not use any emojis.
      - The response must be in JSON format.

      Here is the student's data for the current term in JSON format:
      ${JSON.stringify(analysisData, null, 2)}

      Based on this data, return a JSON object with the following structure:
      {
        "recommendation": "Markdown string with sections: **Courses to Watch** and **Proactive Recommendations**",
        "milestones": {
          "gpaVelocity": "String like '0.4' or '0.2' representing projected GPA increase",
          "optimalTrajectory": "Short string like 'Opt', 'High', or 'Good' representing the trajectory"
        }
      }
    `;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const responseData = JSON.parse(responseText);

    return NextResponse.json({ 
      recommendation: responseData.recommendation,
      milestones: responseData.milestones 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error in recommendation API:", error);
    return NextResponse.json({ error: error.message || "Failed to generate recommendation." }, { status: 500 });
  }
}