"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { AlertCircle, Mail, Clock, XCircle } from "lucide-react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  const errorDescription = searchParams.get("error_description");

  const getErrorInfo = () => {
    if (errorCode === "otp_expired") {
      return {
        title: "Link Expired",
        message: "The confirmation link has expired. Email links are valid for 24 hours.",
        icon: <Clock className="w-16 h-16 text-orange-500" />,
        suggestions: [
          "Request a new confirmation email",
          "Check your email for the most recent link",
          "Make sure to click the link within 24 hours",
        ],
      };
    }

    if (error === "access_denied" || errorDescription?.includes("invalid")) {
      return {
        title: "Invalid Link",
        message: "The confirmation link is invalid or has already been used.",
        icon: <XCircle className="w-16 h-16 text-red-500" />,
        suggestions: [
          "Request a new confirmation email",
          "Make sure you're using the latest link from your email",
          "Check that you clicked the complete link",
        ],
      };
    }

    return {
      title: "Authentication Error",
      message: errorDescription || "An error occurred during authentication.",
      icon: <AlertCircle className="w-16 h-16 text-red-500" />,
      suggestions: [
        "Try signing in again",
        "Contact support if the problem persists",
      ],
    };
  };

  const errorInfo = getErrorInfo();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-slate-300 rounded-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 flex items-center justify-center mb-4">
            {errorInfo.icon}
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            {errorInfo.title}
          </h1>
          <p className="text-gray-600 text-sm">
            {errorInfo.message}
          </p>
        </div>

        {errorCode === "otp_expired" && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2 text-left">
              <Mail className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-orange-800">
                <p className="font-medium mb-1">Need a new link?</p>
                <p className="text-xs">
                  Go to the sign-in page and enter your email to receive a fresh confirmation link.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-medium text-gray-700 mb-2">What to do next:</p>
          <ul className="text-sm text-gray-600 space-y-1.5">
            {errorInfo.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>

        {errorCode && (
          <div className="text-xs text-gray-400 mb-6 font-mono bg-gray-50 p-2 rounded">
            Error Code: {errorCode}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Link
            href="/signin"
            className="w-full px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
          >
            Go to Sign In
          </Link>
          <Link
            href="/signup"
            className="w-full px-4 py-2 bg-white border border-gray-300 text-slate-900 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Create New Account
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Need help?{" "}
          <Link href="/support" className="text-slate-900 hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}