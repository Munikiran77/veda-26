"use client";

import React, { useState, useEffect, useContext, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useStudentAuth,
  StudentAuthProvider,
  StudentAuthContext,
} from "@/components/student/student-auth-context";

function StudentSignupFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, signup } = useStudentAuth();

  const from = searchParams.get("from") || "/student";

  // If already authenticated as a student, automatically proceed to destination
  useEffect(() => {
    if (!isLoading && user && user.role === "student") {
      router.replace(from.startsWith("/student") ? from : "/student");
    }
  }, [user, isLoading, from, router]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [headline, setHeadline] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    if (!cleanName) {
      setError("Please enter your full name.");
      return;
    }

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setError("Please enter a valid university or personal email address.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(
        cleanName,
        cleanEmail,
        password,
        headline.trim() || undefined,
        college.trim() || undefined
      );
      router.push(from.startsWith("/student") ? from : "/student");
    } catch (err: any) {
      setError(err.message || "Failed to create student account. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand & Eyebrow */}
      <div className="text-center space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 group focus-visible:outline-hidden"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-text-primary)] text-white shadow-xs transition-transform group-hover:scale-105">
            <span className="text-[14px] font-bold">SB</span>
          </div>
          <span className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            SkillBridge
          </span>
        </Link>

        <div className="pt-2">
          <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
            Student Portal &bull; Role: Student
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            Create Student Account
          </h1>
          <p className="mt-1 text-[14px] text-[var(--color-text-secondary)]">
            Discover projects, submit proposals, and build your verified portfolio.
          </p>
        </div>
      </div>

      {/* Main Signup Form Card */}
      <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-bg)] p-6 sm:p-8 shadow-2xs space-y-5">
        {user && user.role === "student" && (
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5 flex items-center justify-between gap-3 text-[13px]">
            <div className="flex items-center gap-2 truncate">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-[var(--color-text-secondary)] truncate">
                Signed in as <strong className="font-semibold text-[var(--color-text-primary)]">{user.name || user.email}</strong>
              </span>
            </div>
            <Link
              href="/student"
              className="inline-flex h-8 items-center justify-center rounded-full bg-[var(--color-text-primary)] px-3.5 text-[12px] font-semibold text-white shadow-2xs hover:bg-black shrink-0 transition-all"
            >
              Continue &rarr;
            </Link>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-[13px] text-red-700 font-medium flex items-center justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-800 font-bold cursor-pointer"
            >
              &times;
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="student-name"
              className="block text-[13px] font-semibold text-[var(--color-text-primary)]"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="student-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Alex Johnson"
              autoComplete="name"
              className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-bg)] px-4 py-2.5 text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="student-email"
              className="block text-[13px] font-semibold text-[var(--color-text-primary)]"
            >
              Student / University Email <span className="text-red-500">*</span>
            </label>
            <input
              id="student-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. alex.johnson@university.edu"
              autoComplete="email"
              className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-bg)] px-4 py-2.5 text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="student-college"
              className="block text-[13px] font-semibold text-[var(--color-text-primary)]"
            >
              College / University <span className="text-[11px] font-normal text-[var(--color-text-tertiary)]">(Optional)</span>
            </label>
            <input
              id="student-college"
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="e.g. Stanford University or MIT"
              autoComplete="organization"
              className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-bg)] px-4 py-2.5 text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="student-headline"
              className="block text-[13px] font-semibold text-[var(--color-text-primary)]"
            >
              Headline / Field of Study <span className="text-[11px] font-normal text-[var(--color-text-tertiary)]">(Optional)</span>
            </label>
            <input
              id="student-headline"
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Computer Science & Full-Stack Developer"
              className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-bg)] px-4 py-2.5 text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="student-password"
              className="block text-[13px] font-semibold text-[var(--color-text-primary)]"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="student-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
              className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-bg)] px-4 py-2.5 text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-all"
            />
          </div>

          <div className="rounded-xl bg-[var(--color-canvas-surface)] p-3 text-[12px] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]">
            By creating a student account, your role will be stored as <span className="font-semibold text-[var(--color-text-primary)]">Student</span> to browse projects and submit proposals.
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--color-text-primary)] px-6 text-[14px] font-medium text-white shadow-xs transition-all hover:bg-black hover:shadow-sm active:scale-[0.98] disabled:opacity-60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Student Account</span>
            )}
          </button>
        </form>
      </div>

      {/* Switch to Login */}
      <div className="text-center text-[13px] text-[var(--color-text-secondary)]">
        Already have a student account?{" "}
        <Link
          href={`/student/login${from !== "/student" ? `?from=${encodeURIComponent(from)}` : ""}`}
          className="font-semibold text-blue-600 hover:underline"
        >
          Sign in
        </Link>
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="text-[12px] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          &larr; Back to SkillBridge Home
        </Link>
      </div>
    </div>
  );
}

export function StudentSignupForm() {
  const existingContext = useContext(StudentAuthContext);
  const content = (
    <Suspense
      fallback={
        <div className="flex justify-center p-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-text-primary)] border-t-transparent" />
        </div>
      }
    >
      <StudentSignupFormInner />
    </Suspense>
  );

  if (existingContext) {
    return content;
  }
  return <StudentAuthProvider>{content}</StudentAuthProvider>;
}
