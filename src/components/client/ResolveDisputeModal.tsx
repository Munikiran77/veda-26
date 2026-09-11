"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Scale, CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck, RefreshCcw } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface ResolveDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  disputeId: string;
  projectTitle: string;
  studentName: string;
  amount: number | string;
  reason: string;
  description: string;
  evidence?: string | null;
  onSuccess: (message: string) => void;
}

export function ResolveDisputeModal({
  isOpen,
  onClose,
  disputeId,
  projectTitle,
  studentName,
  amount,
  reason,
  description,
  evidence,
  onSuccess,
}: ResolveDisputeModalProps) {
  const [resolutionNote, setResolutionNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numAmount = typeof amount === "number" ? amount : parseFloat(String(amount)) || 0;

  const handleResolve = async (resolution: "RELEASE_TO_STUDENT" | "REFUND_TO_CLIENT") => {
    if (isSubmitting) return;

    if (!resolutionNote.trim() || resolutionNote.trim().length < 5) {
      setError("Please provide a resolution justification note of at least 5 characters.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await apiClient.post<any>(`/api/disputes/${disputeId}/resolve`, {
        resolution,
        resolutionNote: resolutionNote.trim(),
      });

      const message =
        resolution === "RELEASE_TO_STUDENT"
          ? `Dispute resolved: ₹${numAmount.toLocaleString("en-IN")} released to ${studentName}'s wallet.`
          : `Dispute resolved: ₹${numAmount.toLocaleString("en-IN")} refunded to client.`;

      onSuccess(res?.message || message);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to resolve dispute. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative z-10 w-full max-w-xl rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-[var(--color-border-subtle)]"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="mb-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1">
              <Scale size={15} />
              <span>Demo Arbitration Interface</span>
            </div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              Resolve Escrow Dispute
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Simulated hackathon arbiter control — No real legal arbitration
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Dispute Context Card */}
          <div className="space-y-3.5 mb-5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-surface)] p-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2.5">
              <div>
                <span className="text-[11px] text-gray-500 font-medium">Disputed Escrow Amount</span>
                <p className="text-lg font-bold text-[var(--color-text-primary)]">
                  ₹{numAmount.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-gray-500 font-medium">Student Freelancer</span>
                <p className="text-xs font-bold text-[var(--color-text-primary)]">{studentName}</p>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-gray-500 font-medium">Project</span>
              <p className="text-xs font-semibold text-[var(--color-text-primary)] mt-0.5">{projectTitle}</p>
            </div>

            <div>
              <span className="text-[11px] text-gray-500 font-medium">Dispute Claim Reason</span>
              <p className="text-xs font-semibold text-rose-700 mt-0.5">{reason}</p>
            </div>

            <div>
              <span className="text-[11px] text-gray-500 font-medium">Claim Description</span>
              <p className="text-xs text-gray-700 mt-0.5 leading-relaxed bg-white p-2.5 rounded-lg border border-[var(--color-border-subtle)]">
                {description}
              </p>
            </div>

            {evidence && (
              <div>
                <span className="text-[11px] text-gray-500 font-medium">Evidence / References</span>
                <p className="text-xs text-blue-600 mt-0.5 font-mono break-all">{evidence}</p>
              </div>
            )}
          </div>

          {/* Resolution Justification Input */}
          <div className="space-y-1.5 mb-5">
            <label className="block text-xs font-semibold text-[var(--color-text-primary)]">
              Arbitration Ruling Justification <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="Provide the reasoning for this arbitration outcome (e.g. Work meets deliverables criteria / Deliverables incomplete)..."
              className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-white p-3 text-xs text-[var(--color-text-primary)] placeholder:text-gray-400 focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Ruling Actions */}
          <div className="border-t border-[var(--color-border-subtle)] pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Release to Student button */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleResolve("RELEASE_TO_STUDENT")}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-xs"
                >
                  {isSubmitting ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <ShieldCheck size={14} />
                  )}
                  <span>Release to Student</span>
                </button>

                {/* Refund to Client button */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleResolve("REFUND_TO_CLIENT")}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50 transition-colors shadow-xs"
                >
                  {isSubmitting ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <RefreshCcw size={14} />
                  )}
                  <span>Refund to Client</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
