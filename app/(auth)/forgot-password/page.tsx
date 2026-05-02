"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "@/lib/auth-actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError("");

    const result = await requestPasswordReset(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4">
        <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-10 text-center shadow-[0_20px_40px_rgba(26,27,36,0.06)]">
          <div className="mx-auto w-20 h-20 bg-primary-container/20 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl text-primary">mail</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-on-surface mb-3">
            Check Your Email
          </h1>
          <p className="text-on-surface-variant text-base leading-relaxed mb-6">
            We&apos;ve sent a secured password reset link to: <br/>
            <span className="font-bold text-primary">{email}</span>
          </p>

          <div className="bg-surface rounded-lg p-6 mb-8 text-left border border-outline-variant/10">
            <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4">Secure Restoration Steps</p>
            <ol className="text-sm text-on-surface-variant space-y-3 list-decimal list-inside font-medium">
              <li>Access your registered mailbox</li>
              <li>Authenticate the restoration link</li>
              <li>Initialize your new credentials</li>
            </ol>
          </div>

          <div className="text-xs text-on-surface-variant font-medium mb-8">
            <p>Verification link expires in <span className="font-bold text-on-surface">1 hour</span>.</p>
            <p className="mt-1">Isolate your spam folder if undetected.</p>
          </div>

          <Link
            href="/signin"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline transition-all"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Authentication
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-10 shadow-[0_20px_40px_rgba(26,27,36,0.06)]">
        <header className="mb-10 text-center">
            <div className="w-12 h-12 bg-primary-container flex items-center justify-center rounded-lg mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">lock_reset</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-on-surface mb-2">
            Reset Password
            </h1>
            <p className="text-on-surface-variant text-sm font-medium leading-relaxed px-4">
            Initialize credential recovery by entering your registered email address below.
            </p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-error-container/20 border border-error/10 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2">
            <span className="material-symbols-outlined text-error text-xl">error</span>
            <p className="text-sm font-semibold text-error leading-tight">{error}</p>
          </div>
        )}

        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-[0.2em] text-on-surface-variant ml-1">Registered Email</label>
            <Input
              name="email"
              id="email"
              type="email"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border-outline-variant/30 rounded p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold h-12"
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-14 bg-primary text-on-primary rounded font-bold text-sm hover:shadow-[4px_4px_0px_#191A23] transition-all flex items-center justify-center gap-2 group"
            disabled={isLoading}
          >
            {isLoading ? "Synchronizing..." : (
                <>
                SEND RESTORATION LINK
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">send</span>
                </>
            )}
          </Button>
        </form>

        <div className="text-center mt-10">
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-all"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}