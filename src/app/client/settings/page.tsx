import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ClientSettingsView } from "@/components/client";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Settings | Client Portal | SkillBridge",
  description: "Manage company settings, client presence, and profile details on SkillBridge.",
};

function SettingsLoadingFallback() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="h-6 w-32 rounded bg-gray-100 animate-pulse" />
      <div className="h-10 w-64 rounded bg-gray-100 animate-pulse" />
      <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-8 animate-pulse space-y-6">
        <div className="h-6 w-48 rounded bg-gray-100" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-10 rounded-xl bg-gray-100" />
          <div className="h-10 rounded-xl bg-gray-100" />
        </div>
        <div className="h-28 rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}

export default function ClientSettingsPage() {
  return (
    <Suspense fallback={<SettingsLoadingFallback />}>
      <ClientSettingsView />
    </Suspense>
  );
}
