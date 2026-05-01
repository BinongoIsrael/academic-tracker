import React, { Suspense } from "react";
import { SignInForm } from "./components/SignInForm";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Gradient",
};

const SignInContent = () => {
  return (
    <main className="h-screen flex items-stretch overflow-hidden">
      <div className="hidden lg:flex w-1/2 bg-surface-container-low relative overflow-hidden flex-col justify-center px-24">
        <div className="relative z-10 flex flex-col h-full justify-between py-24">
          <div>
            <span className="text-xs uppercase tracking-widest text-primary font-bold mb-4 block">Precision Workspace</span>
            <h1 className="text-5xl font-extrabold tracking-tight text-on-background leading-tight mb-6">
              Curate your academic <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-fixed-dim">legacy with intent.</span>
            </h1>
          </div>
          
          <p className="text-lg text-on-surface-variant max-w-md leading-relaxed">
            Access your personalized dashboard to track academic progress, manage courses, and organize your learning journey in one authoritative environment.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <Image 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS1NQmotXz4ph2U6zVhNb9vH8BDe7JrVLrlN2tLiXcerofcnzBS-ena56XIsTBoZ6qyMIx0qqZ0cFW0E0_o1KoxSXeC97iI7Mw0Mrn8bl91z8DB5H4FeUKzuzrgTxMnggo3-yG4CHZSMuVYTNc4cq8ehMgw66dHZm679qTUIbHk6ZXfLzs3O8FfQqC50NuxMwd95_peNjwzXDLkYu0cTVLM99qyoa41_dfiYd5Haat9dB81OMuzV-uyx__R9urnPLzXBWuWRvS3Kqo" 
            alt="Workspace Background"
            fill
            className="object-cover grayscale"
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col bg-surface overflow-y-auto relative">
        <div className="flex justify-between items-center px-8 py-6 z-20 w-full lg:absolute lg:top-4 lg:left-0 lg:px-8 lg:py-0">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors group">
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back to Home
          </Link>
          <div className="lg:hidden text-xl font-bold tracking-tighter text-on-background">Gradient</div>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-[440px]">
            <SignInForm />
          </div>
        </div>
      </div>
    </main>
  );
};

const SignInPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
};

export default SignInPage;