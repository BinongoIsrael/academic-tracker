import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      
      console.error("Auth callback error:", error);
      const errorParams = new URLSearchParams();
      
      if (error.message.includes("code verifier")) {
        errorParams.set("error_code", "invalid_code");
        errorParams.set("error_description", "The authentication link is invalid or has expired. Please request a new one.");
      } else if (error.message.includes("expired")) {
        errorParams.set("error_code", "otp_expired");
        errorParams.set("error_description", "The confirmation link has expired. Email links are valid for one hour.");
      } else if (error.message.includes("already been used")) {
        errorParams.set("error", "access_denied");
        errorParams.set("error_description", "This confirmation link has already been used.");
      } else {
        errorParams.set("error", "access_denied");
        errorParams.set("error_description", error.message || "An error occurred during authentication.");
      }
      
      return NextResponse.redirect(`${origin}/error?${errorParams.toString()}`);
      
    } catch (error: any) {
      console.error("Auth callback exception:", error);
      
      const errorParams = new URLSearchParams();
      
      if (error.message?.includes("code verifier") || error.code === "validation_failed") {
        errorParams.set("error_code", "invalid_code");
        errorParams.set("error_description", "The authentication link is invalid or has expired. Please request a new one.");
      } else if (error.message?.includes("expired")) {
        errorParams.set("error_code", "otp_expired");
        errorParams.set("error_description", "The confirmation link has expired. Email links are valid for one hour.");
      } else {
        errorParams.set("error", "server_error");
        errorParams.set("error_description", error.message || "An unexpected error occurred during authentication.");
      }
      
      return NextResponse.redirect(`${origin}/error?${errorParams.toString()}`);
    }
  }

  //no error code provided, default
  const errorParams = new URLSearchParams({
    error: "access_denied",
    error_description: "No authentication code provided.",
  });
  
  return NextResponse.redirect(`${origin}/error?${errorParams.toString()}`);
}