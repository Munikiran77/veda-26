import React from "react";
import type { Metadata } from "next";
import { StudentSignupForm } from "@/components/student/student-signup-form";

export const metadata: Metadata = {
  title: "Student Sign Up | SkillBridge",
  description: "Create a SkillBridge student account to browse projects, submit proposals, and build your verified portfolio.",
};

export default function StudentSignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-canvas-surface)] px-4 py-12 sm:px-6 lg:px-8">
      <StudentSignupForm />
    </div>
  );
}
