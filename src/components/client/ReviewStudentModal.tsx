"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, CheckCircle2, AlertCircle, Loader2, Award } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface ReviewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  studentName: string;
  projectTitle: string;
  projectSkills: string[];
  onSuccess: () => void;
}

export function ReviewStudentModal({
  isOpen,
  onClose,
  contractId,
  studentName,
  projectTitle,
  projectSkills,
  onSuccess,
}: ReviewStudentModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [qualityRating, setQualityRating] = useState<number>(5);
  const [communicationRating, setCommunicationRating] = useState<number>(5);
  const [timelinessRating, setTimelinessRating] = useState<number>(5);
  const [professionalismRating, setProfessionalismRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(projectSkills || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [updatedSkillsInfo, setUpdatedSkillsInfo] = useState<Array<{ skillName: string; oldScore: number; newScore: number; growth: number; level: string }>>([]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!comment.trim() || comment.trim().length < 5) {
      setError("Please provide feedback of at least 5 characters.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await apiClient.post<any>("/api/reviews", {
        workContractId: contractId,
        rating,
        qualityRating,
        communicationRating,
        timelinessRating,
        professionalismRating,
        comment: comment.trim(),
        verifiedSkills: selectedSkills,
      });

      if (res.data?.updatedSkills) {
        setUpdatedSkillsInfo(res.data.updatedSkills);
      }

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setIsSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err?.message || "Failed to submit review. Please try again.");
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
          className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-[var(--color-border-subtle)]"
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
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              <Award size={15} />
              <span>Living Skill Passport • Verification</span>
            </div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              Rate & Verify {studentName}
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Project: <span className="font-medium text-[var(--color-text-primary)]">{projectTitle}</span>
            </p>
          </div>

          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Review & Verification Submitted!</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Contract completed and Living Skill Passport updated for {studentName}.
                </p>
              </div>

              {updatedSkillsInfo.length > 0 && (
                <div className="mx-auto max-w-md rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-left space-y-2">
                  <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">
                    ⚡ Verified Skill Boosts:
                  </span>
                  <div className="space-y-1.5">
                    {updatedSkillsInfo.map((sk, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs font-medium text-emerald-800 bg-white/80 rounded-lg px-2.5 py-1.5 border border-emerald-100">
                        <span>{sk.skillName}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-400 line-through text-[11px]">{sk.oldScore}</span>
                          <span>→</span>
                          <span className="font-bold text-emerald-700">{sk.newScore}</span>
                          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                            +{sk.growth}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Overall Star Rating */}
              <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-surface)] p-4 text-center">
                <label className="block text-xs font-semibold text-[var(--color-text-primary)] uppercase tracking-wider mb-2">
                  Overall Rating
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110 focus:outline-hidden"
                      >
                        <Star
                          size={28}
                          className={filled ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  {rating === 5 ? "5.0 — Outstanding" : rating === 4 ? "4.0 — Very Good" : rating === 3 ? "3.0 — Average" : `${rating}.0 — Needs Improvement`}
                </p>
              </div>

              {/* Criteria Sub-ratings (4 Dimensions) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { label: "Quality", val: qualityRating, set: setQualityRating },
                  { label: "Communication", val: communicationRating, set: setCommunicationRating },
                  { label: "Timeliness", val: timelinessRating, set: setTimelinessRating },
                  { label: "Professionalism", val: professionalismRating, set: setProfessionalismRating },
                ].map((crit) => (
                  <div key={crit.label} className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-2.5 text-center">
                    <span className="text-[11px] font-medium text-gray-500 block mb-1">{crit.label}</span>
                    <div className="flex items-center justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => crit.set(s)}
                          className="p-0.5 focus:outline-hidden"
                        >
                          <Star
                            size={13}
                            className={crit.val >= s ? "fill-amber-400 text-amber-400" : "text-gray-200"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills Verification Checklist */}
              {projectSkills && projectSkills.length > 0 && (
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900">
                      Skills Demonstrated & Verified
                    </span>
                    <span className="text-[11px] text-blue-600 font-medium">
                      Select all that apply
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-700 leading-relaxed">
                    Skills selected here will be verified on the student&apos;s profile because they were demonstrated in this completed project.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {projectSkills.map((skill) => {
                      const isChecked = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                            isChecked
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {isChecked && <CheckCircle2 size={13} />}
                          <span>{skill}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Comment */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--color-text-primary)]">
                  Feedback & Review Comment
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={`Write your honest feedback about ${studentName}'s work, communication, and delivery...`}
                  className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-white p-3 text-xs text-[var(--color-text-primary)] placeholder:text-gray-400 focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>

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
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Submitting Review...
                    </>
                  ) : (
                    "Submit Review & Verify"
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
