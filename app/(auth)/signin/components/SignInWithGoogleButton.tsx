"use client";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth-actions";
import React from "react";
import Image from "next/image";

const SignInWithGoogleButton = () => {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full h-11 flex items-center justify-center gap-3 bg-white border border-gray-400 rounded-md hover:bg-gray-50 transition-colors"
      onClick={() => {
        signInWithGoogle();
      }}
    >
      <Image
        src="/Google-G-logo.svg"
        alt="Google"
        width={24}
        height={24}
        className="w-6 h-6"
      />
      <span className="text-sm font-medium text-black">Google</span>
    </Button>
  );
};

export default SignInWithGoogleButton;