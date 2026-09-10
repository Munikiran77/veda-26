"use client";

import React, { useState, useEffect, useContext, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import {
  useStudentAuth,
  StudentAuthProvider,
  StudentAuthContext,
} from "@/components/student/student-auth-context";
import { cn } from "@/lib/utils";

export interface SkillCategory {
  id: string;
  label: string;
  skills: string[];
}

export const INTEREST_CATEGORIES: SkillCategory[] = [
  {
    id: "tech",
    label: "Development",
    skills: [
      "Web Development",
      "Frontend Development",
      "Backend Development",
      "Full-Stack Development",
      "Mobile App Development",
      "React",
      "Next.js",
      "Node.js",
      "Python",
    ],
  },
  {
    id: "data-ai",
    label: "Data & AI",
    skills: [
      "Artificial Intelligence",
      "Machine Learning",
      "Data Science",
      "Data Analytics",
      "Cloud Computing",
      "Cybersecurity",
      "DevOps",
    ],
  },
  {
    id: "design",
    label: "Design & Creative",
    skills: [
      "UI/UX Design",
      "Graphic Design",
      "Product Design",
      "Video Editing",
      "Motion Graphics",
      "3D Design",
    ],
  },
  {
    id: "business",
    label: "Marketing & Content",
    skills: [
      "Digital Marketing",
      "Social Media Management",
      "Content Writing",
      "Copywriting",
      "SEO",
      "Technical Writing",
    ],
  },
];

function StudentSignupFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, signup } = useStudentAuth();

  const from = searchParams.get("from");
  const target =
    from &&
    from.startsWith("/student") &&
    from !== "/student/login" &&
    from !== "/student/signup"
      ? from
      : "/student";

  // If already authenticated as a student, automatically proceed to destination
  useEffect(() => {
    if (!isLoading && user && user.role === "student") {
      window.location.replace(target);
    }
  }, [user, isLoading, target]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("tech");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleInterest = (skill: string) => {
    setError(null);
    setSelectedInterests((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((s) => s !== skill);
      }
      if (prev.length >= 5) {
        setError("You can select up to 5 fields of interest.");
        return prev;
      }
      return [...prev, skill];
    });
  };

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

    if (selectedInterests.length === 0) {
      setError("Please select at least 1 field of interest.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(cleanName, cleanEmail, password, selectedInterests);
      window.location.href = target;
    } catch (err: any) {
      setError(err.message || "Failed to create student account. Please try again.");
      setIsSubmitting(false);
    }
  };

  // If already authenticated or verifying session, show clean redirect/loading state without form or manual banner
  if (isLoading || (user && user.role === "student")) {
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
              {user ? "Redirecting to your workspace..." : "Verifying student session..."}
            </h1>
            <p className="mt-1 text-[14px] text-[var(--color-text-secondary)]">
              {user
                ? `Signed in as ${user.name || user.email}`
                : "Checking authentication session..."}
            </p>
          </div>
        </div>

        {/* Redirecting card */}
        <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-bg)] p-8 shadow-2xs text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-[var(--color-text-primary)] border-t-transparent" />
          </div>
          <p className="text-[13px] text-[var(--color-text-secondary)]">
            {user
              ? `Taking you directly to ${target === "/student/projects" ? "Find Projects" : "Student Dashboard"}...`
              : "Please wait..."}
          </p>
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

          {/* Fields of Interest / Skills Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-[13px] font-semibold text-[var(--color-text-primary)]">
                Fields of Interest <span className="text-red-500">*</span>
              </label>
              <span
                className={cn(
                  "text-[11px] font-medium transition-colors",
                  selectedInterests.length > 0
                    ? "text-blue-600 font-semibold"
                    : "text-[var(--color-text-tertiary)]"
                )}
              >
                {selectedInterests.length}/5 selected
              </span>
            </div>
            <p className="text-[12px] text-[var(--color-text-secondary)]">
              Select 1 to 5 areas you&apos;d like to work on to get matched with projects.
            </p>

            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {INTEREST_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "rounded-full px-3 py-1 text-[12px] font-medium transition-all cursor-pointer shrink-0",
                    activeCategory === cat.id
                      ? "bg-[var(--color-text-primary)] text-white shadow-xs"
                      : "bg-[var(--color-canvas-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/5"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Interest Chips for Active Category */}
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-surface)]/50 p-3 min-h-[90px]">
              <div className="flex flex-wrap gap-1.5">
                {INTEREST_CATEGORIES.find((c) => c.id === activeCategory)?.skills.map((skill) => {
                  const isSelected = selectedInterests.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleInterest(skill)}
                      aria-pressed={isSelected}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-all duration-150 cursor-pointer",
                        isSelected
                          ? "bg-blue-600 text-white shadow-xs hover:bg-blue-700"
                          : "bg-white text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] hover:bg-[#f5f5f7] active:bg-[#eaeaea]"
                      )}
                    >
                      {isSelected ? (
                        <Check className="h-3 w-3 shrink-0 stroke-[2.5]" />
                      ) : (
                        <span className="text-[var(--color-text-tertiary)] font-bold">+</span>
                      )}
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Summary Tags */}
            {selectedInterests.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-medium text-[var(--color-text-tertiary)] mr-1">
                  Selected:
                </span>
                {selectedInterests.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-700"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => toggleInterest(skill)}
                      className="text-blue-600 hover:text-blue-900 ml-0.5 cursor-pointer font-bold"
                      aria-label={`Remove ${skill}`}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
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
          href={`/student/login${from && from !== "/student" && from !== "/student/signup" && from !== "/student/login" ? `?from=${encodeURIComponent(from)}` : ""}`}
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
