import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ClientPaymentsView } from "@/components/client";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Payments & Escrow | Client Portal | SkillBridge",
  description: "Manage project escrows, release milestone payments, and track transaction history on SkillBridge.",
};

function PaymentsLoadingFallback() {
  return (
    <div className="space-y-6">
      <div className="h-6 w-32 rounded bg-gray-100 animate-pulse" />
      <div className="h-10 w-64 rounded bg-gray-100 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl border border-[var(--color-border-subtle)] bg-white p-5 animate-pulse" />
        ))}
      </div>
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
      </div>
    </div>
  );
}

export default function ClientPaymentsPage() {
  return (
    <Suspense fallback={<PaymentsLoadingFallback />}>
      <ClientPaymentsView />
    </Suspense>
  );
}
