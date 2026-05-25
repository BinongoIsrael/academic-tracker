import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

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
      .select(`
        *,
        courses (
          *,
          assessments (
            *,
            assessment_grades (*)
          )
        )
      `)
      .eq("user_id", user.id);
    if (termsError) throw termsError;

    const mappedTerms = (termsData || []).map((t: any) => ({
      id: t.id,
      user_id: t.user_id,
      academicYear: t.academic_year,
      semester: t.semester,
      startDate: t.start_date,
      endDate: t.end_date,
      isActive: t.is_active,
      created_at: t.created_at,
      updated_at: t.updated_at,
      courses: t.courses || [],
    }));

    const now = new Date();
    // Prioritize date-driven active term, then falls back to isActive flag
    let activeTerm = mappedTerms.find((t) => 
      t.startDate && t.endDate && 
      new Date(t.startDate).setHours(0,0,0,0) <= now.getTime() && 
      new Date(t.endDate).setHours(23,59,59,999) >= now.getTime()
    ) || mappedTerms.find((t) => t.isActive) || null;

    if (!activeTerm) {
      // Find the nearest upcoming term
      const futureTerms = mappedTerms
        .filter((t) => t.startDate && new Date(t.startDate).getTime() > now.getTime())
        .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime());
      if (futureTerms.length > 0) {
        activeTerm = futureTerms[0];
      }
    }

    if (!activeTerm) {
      return NextResponse.json({ recommendation: "### No Active Term Found\n\nI couldn't find an active or upcoming academic term to analyze. Please add or set a term as active to get a recommendation." }, { status: 200 });
    }

    const courses = activeTerm.courses;

    if (!courses || courses.length === 0) {
        return NextResponse.json({ recommendation: `### No Courses in Current Term\n\nThere are no courses listed for the term **${activeTerm.academicYear} ${activeTerm.semester}**. Add courses to this term to get a recommendation.` }, { status: 200 });
    }

    const analysisData = {
        term: `${activeTerm.academicYear} ${activeTerm.semester}`,
        courses: courses.map((course: any) => ({
            course_name: course.course_name,
            units: course.units,
            assessments: (course.assessments || []).map((assessment: any) => ({
                name: assessment.assessment_name,
                percentage: assessment.percentage,
                grades: (assessment.assessment_grades || []).length > 0 
                  ? assessment.assessment_grades.map((g: any) => g.grade) 
                  : null,
            })),
        })),
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
        "recommendation": "Markdown string. Use H2 for main sections and H3 for sub-points. Use blockquotes for critical warnings or key insights. Use bold text for course names and important metrics. Use bullet points for clear action items.",
        "milestones": {
          "gpaVelocity": "String like '0.4' or '0.2' representing projected GPA increase",
          "optimalTrajectory": "Short string like 'Opt', 'High', or 'Good' representing the trajectory"
        }
      }
    `;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    let result;
    let retries = 0;
    const maxRetries = 2;

    while (retries <= maxRetries) {
      try {
        result = await model.generateContent(prompt);
        break;
      } catch (error: any) {
        if (error.status === 503 && retries < maxRetries) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        throw error;
      }
    }

    if (!result) {
      throw new Error("Failed to generate content after retries.");
    }

    const responseText = result.response.text();
    const responseData = JSON.parse(responseText);

    return NextResponse.json({ 
      recommendation: responseData.recommendation,
      milestones: responseData.milestones 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error in recommendation API:", error);
    
    if (error.status === 503) {
      return NextResponse.json({ 
        error: "The AI model is currently experiencing high demand. Please try again in a few moments." 
      }, { status: 503 });
    }

    return NextResponse.json({ error: error.message || "Failed to generate recommendation." }, { status: 500 });
  }
}