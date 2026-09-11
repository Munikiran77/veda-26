"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, CheckCircle2, AlertCircle, Loader2, ShieldAlert } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface OpenDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  escrowId: string;
  projectTitle: string;
  studentName: string;
  amount: number | string;
  onSuccess: () => void;
}

const DISPUTE_REASONS = [
  "Work does not match specifications",
  "Incomplete deliverables",
  "Quality concerns",
  "Missed requirements",
  "Unresponsive / communication breakdown",
  "Other",
];

export function OpenDisputeModal({
  isOpen,
  onClose,
  escrowId,
  projectTitle,
  studentName,
  amount,
  onSuccess,
}: OpenDisputeModalProps) {
  const [reason, setReason] = useState(DISPUTE_REASONS[0]);
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const numericAmount = typeof amount === "number" ? amount : parseFloat(String(amount)) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!description.trim() || description.trim().length < 10) {
      setError("Please describe the dispute in detail (at least 10 characters).");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await apiClient.post("/api/disputes", {
        escrowId,
        reason,
        description: description.trim(),
        evidence: evidence.trim() || null,
      });

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setIsSuccess(false);
      }, 1500);
    } catch (err: any) {
      setError(err?.message || "Failed to open dispute. Please try again.");
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
          className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-[var(--color-border-subtle)]"
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
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
              <ShieldAlert size={15} />
              <span>Escrow Dispute Mechanism</span>
            </div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              Open Payment Dispute
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Securely pause escrow release for <span className="font-semibold text-[var(--color-text-primary)]">{projectTitle}</span>
            </p>
          </div>

          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <AlertTriangle size={26} />
              </div>
              <h3 className="text-base font-bold text-gray-900">Dispute Filed Successfully</h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                Payment of <strong className="text-gray-900">₹{numericAmount.toLocaleString("en-IN")}</strong> is now held in dispute until resolution. Both parties will be notified.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Escrow summary banner */}
              <div className="rounded-xl border border-amber-200/70 bg-amber-50/60 p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-amber-800 font-medium">Secured in Escrow</span>
                  <p className="text-sm font-bold text-amber-950">
                    ₹{numericAmount.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-amber-800 font-medium">Student</span>
                  <p className="text-xs font-bold text-amber-950">{studentName}</p>
                </div>
              </div>

              {/* Reason selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--color-text-primary)]">
                  Dispute Reason
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-white p-2.5 text-xs text-[var(--color-text-primary)] focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                >
                  {DISPUTE_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--color-text-primary)]">
                  Description of Issue
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain clearly what deliverables are incomplete or why the work does not meet the agreed requirements..."
                  className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-white p-3 text-xs text-[var(--color-text-primary)] placeholder:text-gray-400 focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Optional evidence URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--color-text-primary)]">
                  Evidence URL / References <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  placeholder="e.g. https://github.com/issue/... or specific commit hash"
                  className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-white p-2.5 text-xs text-[var(--color-text-primary)] placeholder:text-gray-400 focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Notice */}
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Opening a dispute immediately pauses escrow release. The funds will remain locked until mutual agreement or arbiter resolution.
              </p>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Filing Dispute...
                    </>
                  ) : (
                    "Submit Dispute"
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
