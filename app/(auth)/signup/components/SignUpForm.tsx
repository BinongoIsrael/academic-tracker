"use client"

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signup, signInWithGoogle } from "@/lib/auth-actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmailSignup = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const email = formData.get("email") as string;
      await signup(formData);
      router.push(`/confirm?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[604px] bg-white border border-slate-300 rounded-lg p-8">
      <h4 className="text-center text-slate-900 font-medium text-xl leading-7 mb-3">
        Create an Account
      </h4>
      <p className="text-center text-subtle text-sm leading-5 mb-8">
        Ready to enhance your academic journey? Let's get started
      </p>
      <form action={handleEmailSignup} className="space-y-4">
        <div className="w-full">
          <Input
            name="username"
            id="username"
            type="text"
            placeholder="Username"
            className="w-full h-9 px-3 py-2 text-sm border border-slate-300 rounded-md text-gray-600 placeholder:text-gray-500"
            required
            disabled={isLoading}
          />
        </div>

        <div className="w-full">
          <Input
            name="email"
            id="email"
            type="email"
            placeholder="Email Address"
            className="w-full h-9 px-3 py-2 text-sm border border-slate-300 rounded-md text-gray-600 placeholder:text-gray-500"
            required
            disabled={isLoading}
          />
        </div>

        <div className="w-full">
          <Input
            name="password"
            id="password"
            type="password"
            placeholder="Password"
            className="w-full h-9 px-3 py-2 text-sm border border-slate-300 rounded-md text-gray-600 placeholder:text-gray-500"
            required
            disabled={isLoading}
          />
        </div>

        <div className="w-full">
          <Input
            name="confirm-password"
            id="confirm-password"
            type="password"
            placeholder="Confirm Password"
            className="w-full h-9 px-3 py-2 text-sm border border-slate-300 rounded-md text-gray-600 placeholder:text-gray-500"
            required
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-md mt-5"
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Sign up with Email"}
        </Button>
      </form>

      <div className="relative flex items-center justify-center my-6">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="px-4 text-sm font-medium text-subtle">
          OR SIGN UP WITH
        </span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>
      <button
        type="button"
        onClick={() => signInWithGoogle()}
        className="w-full h-11 flex items-center justify-center gap-3 bg-white border border-gray-400 rounded-md hover:bg-gray-50 transition-colors"
        disabled={isLoading}
      >
        <Image
          src="/Google-G-logo.svg"
          alt="Google"
          width={24}
          height={24}
          className="w-6 h-6"
        />
        <span className="text-sm font-medium text-black">Google</span>
      </button>

      <p className="text-center text-subtle text-sm mt-6">
        Already have an account?{" "}
        <Link href="/signin" className="text-slate-900 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}