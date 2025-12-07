import React from "react";
import { SignInForm } from "./components/SignInForm";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

const SignInPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="lg:hidden flex flex-col items-center justify-center px-4 md:px-8 py-8">
        <div className="w-full max-w-[604px] px-4 mb-12">
          <SignInForm />
        </div>
        <div className="relative w-full max-w-[400px] h-[300px] mb-8">
          <Image
            src="/signup-illustration.svg"
            alt="Academic tracker illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h2 className="text-center font-semibold text-2xl leading-9 tracking-tight max-w-[515px] mb-6 px-4">
          Sign in to view your personalized academic tracker
        </h2>
        <p className="text-center text-gray-600 leading-7 max-w-[652px] mb-8 px-4">
          Continue monitoring your grades, GPA/GWA, and predictions with the tools designed to keep your academic journey clear and organized
        </p>
      </div>

      <div className="hidden lg:flex items-center justify-center px-8 lg:px-16 py-8 min-h-screen">
        <div className="flex flex-row items-center justify-center gap-16 max-w-7xl w-full">
          <div className="flex flex-col items-center max-w-[654px] space-y-8">
            <div className="relative w-full h-[407px]">
              <Image
                src="/signup-illustration.svg"
                alt="Academic tracker illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h2 className="text-center font-semibold text-[32px] leading-9 tracking-tight max-w-[515px]">
              Sign in to view your personalized academic tracker
            </h2>
            <p className="text-center text-gray-600 leading-7 max-w-[652px]">
              Continue monitoring your grades, GPA/GWA, and predictions with the tools designed to keep your academic journey clear and organized
            </p>
          </div>
          <div className="w-full max-w-[604px]">
            <SignInForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;