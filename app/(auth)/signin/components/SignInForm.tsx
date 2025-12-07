import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signin } from "@/lib/auth-actions";
import SignInWithGoogleButton from "./SignInWithGoogleButton";

export function SignInForm() {
  return (
    <div className="w-full max-w-[604px] bg-white border border-slate-300 rounded-lg p-8">
      <h4 className="text-center text-slate-900 font-medium text-xl leading-7 mb-3">
        Welcome Back
      </h4>
      <p className="text-center text-subtle text-sm leading-5 mb-8">
        Fill in your information to pick up right where you left off
      </p>
      <form action="" className="space-y-4">
        <div className="w-full">
          <Input
            name="email"
            id="email"
            type="text"
            placeholder="Username"
            className="w-full h-9 px-3 py-2 text-sm border border-slate-300 rounded-md text-gray-600 placeholder:text-gray-500"
            required
          />
        </div>
        <div className="w-full">
          <Input
            name="password"
            id="password"
            type="password"
            placeholder="Email Address"
            className="w-full h-9 px-3 py-2 text-sm border border-slate-300 rounded-md text-gray-600 placeholder:text-gray-500"
            required
          />
        </div>
        <Button
          formAction={signin}
          type="submit"
          className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-md mt-5"
        >
          Sign in with Email
        </Button>
      </form>
      <div className="relative flex items-center justify-center my-6">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="px-4 text-sm font-medium text-subtle">OR CONTINUE WITH</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>
      <SignInWithGoogleButton />
      <p className="text-center text-subtle text-sm mt-6">
        Don't have an account?{" "}
        <Link href="/signup" className="text-slate-900 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}