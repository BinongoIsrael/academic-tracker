import React from "react";
import { SignInForm } from "./components/SignInForm";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

const SignInPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 md:px-8 lg:px-16 py-8">
      <div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-8 lg:gap-16 max-w-7xl w-full">
        <div className="w-full max-w-[604px] order-1 lg:order-2">
          <SignInForm />
        </div>
        <div className="flex flex-col items-center max-w-[654px] space-y-6 lg:space-y-8 order-2 lg:order-1">
          <div className="relative w-full max-w-[400px] lg:max-w-full h-[300px] lg:h-[407px]">
            <Image
              src="/signup-illustration.svg"
              alt="Academic tracker illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-center font-semibold text-2xl lg:text-[32px] leading-9 tracking-tight max-w-[515px]">
            Sign in to view your personalized academic tracker
          </h2>
          <p className="text-center text-gray-600 leading-7 max-w-[652px]">
            Continue monitoring your grades, GPA/GWA, and predictions with the tools designed to keep your academic journey clear and organized
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;