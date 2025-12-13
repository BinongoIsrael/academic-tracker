import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error) {
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";
        
        let redirectUrl = '';
        if (isLocalEnv) {
          redirectUrl = `${origin}${next}`;
        } else if (forwardedHost) {
          redirectUrl = `https://${forwardedHost}${next}`;
        } else {
          redirectUrl = `${origin}${next}`;
        }
        
        return NextResponse.redirect(redirectUrl);
      }
      
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
      
      const errorRedirectUrl = `${origin}/error?${errorParams.toString()}`;
      return NextResponse.redirect(errorRedirectUrl);
      
    } catch (error: any) {
      
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
      
      const exceptionRedirectUrl = `${origin}/error?${errorParams.toString()}`;
      return NextResponse.redirect(exceptionRedirectUrl);
    }
  }

  //no error code provided, default
  const errorParams = new URLSearchParams({
    error: "access_denied",
    error_description: "No authentication code provided.",
  });
  
  const noCodeRedirectUrl = `${origin}/error?${errorParams.toString()}`;
  return NextResponse.redirect(noCodeRedirectUrl);
}