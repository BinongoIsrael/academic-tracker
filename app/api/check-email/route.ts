import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = createClient();
    
    //query to check if email exists already, prevents confirmation email not sending for already existing user with same email address
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    const exists = !error && data !== null;

    return NextResponse.json({ exists });
  } catch (error) {
    console.error("Error checking email:", error);
    return NextResponse.json({ exists: false });
  }
}