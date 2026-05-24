import React, { Suspense } from "react";
import { SignUpForm } from "./components/SignUpForm";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Gradient",
};

const SignUpContent = () => {
  return (
    <main className="h-screen flex items-stretch overflow-hidden">
      <section className="hidden lg:flex lg:w-1/2 bg-brand-dark relative overflow-hidden flex-col justify-center p-16">
        <div className="z-10">
          <h1 className="text-5xl font-bold text-white tracking-tight leading-tight max-w-lg mb-16">
            Sign up today and take control of your academic success
          </h1>
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="text-sm font-bold text-brand-green tracking-widest uppercase">Academic Precision</div>
              <div className="h-px w-12 bg-white/10"></div>
            </div>
            <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
              By creating your account, you&apos;ll unlock powerful tools to help you track grades, 
              calculate GPA and GWA, and predict the scores you need to achieve your goals. 
              Gradient gives you clear insights into your academic progress.
            </p>
          </div>
        </div>
        
        <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-primary-fixed-dim rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[60%] h-[60%] bg-primary rounded-full blur-[100px]"></div>
        </div>
      </section>

      <section className="w-full lg:w-1/2 flex flex-col bg-surface-container-lowest overflow-y-auto relative">
        <div className="flex justify-between items-center px-8 py-6 z-20 w-full lg:absolute lg:top-4 lg:left-0 lg:px-8 lg:py-0">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors group">
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back to Home
          </Link>
          <div className="lg:hidden text-xl font-bold tracking-tighter text-on-surface">Gradient</div>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            <SignUpForm />
          </div>
        </div>
      </section>
    </main>
  );
};

const SignUpPage = () => {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <SignUpContent />
    </Suspense>
  );
};

export default SignUpPage;