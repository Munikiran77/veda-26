"use client";

import React from "react";
import { StudentAuthProvider } from "@/components/student/student-auth-context";

export default function StudentRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentAuthProvider>{children}</StudentAuthProvider>;
}
