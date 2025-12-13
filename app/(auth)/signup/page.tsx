import React from "react";
import { SignUpForm } from "./components/SignUpForm";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
};

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 md:px-8 lg:px-16 py-8">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 max-w-7xl w-full">
        <div className="flex flex-col items-center max-w-[654px] space-y-6 lg:space-y-8 order-1">
          <div className="relative w-full max-w-[400px] lg:max-w-full h-[300px] lg:h-[407px]">
            <Image
              src="/signup-illustration.svg"
              alt="Academic success illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-center font-semibold text-2xl lg:text-[32px] leading-9 tracking-tight max-w-[499px]">
            Sign up today and take control of your academic success
          </h2>
          <p className="text-center text-gray-600 leading-7 max-w-[652px]">
            By creating your account, you&apos;ll unlock powerful tools to help you track grades, 
            calculate GPA and GWA, and predict the scores you need to achieve your goals. 
            Gradient gives you clear insights into your academic progress and helps you plan 
            smarter, so you can focus on what matters most — <span className="font-semibold">learning</span> and <span className="font-semibold">succeeding</span>.
          </p>
        </div>
        <div className="w-full max-w-[604px] order-2">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;