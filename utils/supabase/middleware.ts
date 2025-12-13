import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const currentPath = request.nextUrl.pathname;

  const authCallbackPaths = ["/auth/callback", "/auth/confirm"];

  const publicPaths = [
    "/",
    "/signin",
    "/signup",
    "/confirm",
    "/forgot-password",
    "/reset-password",
    "/error"
  ];
  const isPublicPath = publicPaths.includes(currentPath);
  const isAuthCallback = authCallbackPaths.includes(currentPath);

  if (isAuthCallback) {
    return response
  }
  if (!user && !isPublicPath) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (user && (currentPath === "/signin" || currentPath === "/signup" || currentPath === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}
