import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ClientMessagesView } from "@/components/client";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Messages | Client Portal | SkillBridge",
  description: "Communicate directly with student candidates and hired talent on SkillBridge.",
};

function MessagesLoadingFallback() {
  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Messages
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
          Communicate directly with student candidates and hired talent on your projects.
        </p>
      </div>
      <div className="flex h-[calc(100vh-13.5rem)] min-h-[580px] items-center justify-center rounded-2xl border border-[var(--color-border-subtle)] bg-white shadow-xs">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-xs text-[var(--color-text-secondary)]">Loading messages workspace...</span>
        </div>
      </div>
    </div>
  );
}

export default function ClientMessagesPage() {
  return (
    <Suspense fallback={<MessagesLoadingFallback />}>
      <ClientMessagesView />
    </Suspense>
  );
}
