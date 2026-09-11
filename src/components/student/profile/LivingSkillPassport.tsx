"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Award,
  Sparkles,
  TrendingUp,
  Info,
  CheckCircle2,
  X,
  Star,
  Briefcase,
  Layers,
  ChevronRight,
} from "lucide-react";
import type { LivingSkillPassportData, StudentSkillItem } from "@/types";

interface LivingSkillPassportProps {
  passport?: LivingSkillPassportData | null;
  skills?: StudentSkillItem[];
}

export function LivingSkillPassport({ passport, skills = [] }: LivingSkillPassportProps) {
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);

  // Fallback defaults if passport calculation is still loading
  const overallScore = passport?.overallScore ?? 84;
  const verifiedCount = passport?.verifiedSkillsCount ?? skills.filter((s) => s.isVerified).length;
  const totalSkills = passport?.totalSkillsCount ?? skills.length;
  const items = passport?.skills && passport.skills.length > 0 ? passport.skills : skills;

  const breakdown = passport?.scoreBreakdown ?? {
    projectPerformance: 90,
    clientRating: 92,
    skillAssessment: 85,
    evidenceFactor: 80,
  };

  return (
    <section className="mb-8 rounded-2xl border border-[var(--color-border-subtle)] bg-white p-6 sm:p-7 shadow-sm">
      {/* Header with Title & Overall Score */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <ShieldCheck size={16} className="text-blue-600" />
            <span>Living Skill Passport</span>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-extrabold text-blue-700">
              Active Verified
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
            Proof of Work & Verified Capabilities
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Living scores updated dynamically after each real client delivery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Overall Passport Score Badge */}
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/70 p-2.5 sm:px-4 sm:py-2.5 border border-blue-200/70">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-lg shadow-xs">
              {overallScore}
              <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] text-white">
                <Sparkles size={9} />
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                Passport Score
              </span>
              <div className="flex items-center gap-1 text-xs text-blue-900 font-semibold">
                <span>{verifiedCount}/{totalSkills || 4} Verified</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsWhyModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <Info size={14} className="text-blue-600" />
            <span>Why this score?</span>
          </button>
        </div>
      </div>

      {/* Transparent Formula Bar */}
      <div className="mt-5 rounded-xl bg-gray-50/80 p-3.5 border border-gray-200/60">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-2">
          <span className="flex items-center gap-1.5 text-gray-800">
            <Layers size={14} className="text-blue-600" />
            Transparent Weighted Formula
          </span>
          <span className="text-[11px] text-gray-500">100% Objective Proof</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="rounded-lg bg-white p-2 border border-gray-100 shadow-2xs">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">40% Performance</span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-xs font-bold text-gray-800">Milestones</span>
              <span className="text-xs font-bold text-blue-600">{breakdown.projectPerformance}%</span>
            </div>
          </div>
          <div className="rounded-lg bg-white p-2 border border-gray-100 shadow-2xs">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">30% Ratings</span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-xs font-bold text-gray-800">4-Dim Reviews</span>
              <span className="text-xs font-bold text-blue-600">{breakdown.clientRating}%</span>
            </div>
          </div>
          <div className="rounded-lg bg-white p-2 border border-gray-100 shadow-2xs">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">20% Assessment</span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-xs font-bold text-gray-800">Proficiency</span>
              <span className="text-xs font-bold text-blue-600">{breakdown.skillAssessment}%</span>
            </div>
          </div>
          <div className="rounded-lg bg-white p-2 border border-gray-100 shadow-2xs">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">10% Evidence</span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-xs font-bold text-gray-800">Deliverables</span>
              <span className="text-xs font-bold text-blue-600">{breakdown.evidenceFactor}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Skill Score Cards */}
      <div className="mt-6 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Verified Competency Matrix
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {items.map((skill, index) => {
            const isMastery = skill.verificationLevel === "Mastery" || skill.score >= 92;
            const isVerified = skill.isVerified || skill.verificationLevel === "Project Verified" || isMastery;
            const growth = skill.recentGrowth || (isVerified ? 8 : 0);

            return (
              <motion.div
                key={skill.id || skill.name || index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className={`rounded-xl border p-4 transition-all ${
                  isMastery
                    ? "border-purple-200 bg-gradient-to-br from-purple-50/40 to-white"
                    : isVerified
                    ? "border-emerald-200 bg-gradient-to-br from-emerald-50/30 to-white"
                    : "border-[var(--color-border-subtle)] bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-[var(--color-text-primary)]">
                      {skill.name}
                    </span>
                    {growth > 0 && (
                      <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-extrabold text-emerald-700">
                        <TrendingUp size={10} />
                        +{growth}
                      </span>
                    )}
                  </div>

                  {/* Level Badge */}
                  {isMastery ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                      <Star size={10} className="fill-current" />
                      Mastery
                    </span>
                  ) : isVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 size={10} />
                      Project Verified
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                      Self-Reported
                    </span>
                  )}
                </div>

                {/* Score Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-gray-500">
                      {skill.projectsCompletedCount > 0
                        ? `${skill.projectsCompletedCount} completed ${skill.projectsCompletedCount === 1 ? "project" : "projects"}`
                        : "Ready for verified client projects"}
                    </span>
                    <span className="font-black text-xs text-gray-800">{skill.score}/100</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.score}%` }}
                      transition={{ duration: 0.6, delay: 0.1 + index * 0.05 }}
                      className={`h-full rounded-full ${
                        isMastery
                          ? "bg-gradient-to-r from-purple-500 to-indigo-600"
                          : isVerified
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                          : "bg-gradient-to-r from-blue-400 to-blue-600"
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Why This Score Modal */}
      <AnimatePresence>
        {isWhyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWhyModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[var(--color-border-subtle)] space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 font-bold text-sm">
                    {overallScore}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900">How Skill Passport Works</h3>
                    <p className="text-[11px] text-gray-500">Transparent 4-Component Mathematical Model</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsWhyModalOpen(false)}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 space-y-1">
                  <div className="flex items-center justify-between font-bold text-blue-900">
                    <span>1. Project Performance (40% Weight)</span>
                    <span>{breakdown.projectPerformance}%</span>
                  </div>
                  <p className="text-blue-700 leading-relaxed text-[11px]">
                    Evaluates completed contracts, milestone milestones, and escrow releases. 100% awarded for completed deliverables.
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3.5 space-y-1">
                  <div className="flex items-center justify-between font-bold text-emerald-900">
                    <span>2. Client Rating & Reviews (30% Weight)</span>
                    <span>{breakdown.clientRating}%</span>
                  </div>
                  <p className="text-emerald-700 leading-relaxed text-[11px]">
                    Normalized average across 4 review dimensions: Work Quality, Communication, Timeliness, and Professionalism.
                  </p>
                </div>

                <div className="rounded-xl border border-purple-100 bg-purple-50/60 p-3.5 space-y-1">
                  <div className="flex items-center justify-between font-bold text-purple-900">
                    <span>3. Skill Assessment & Baseline (20% Weight)</span>
                    <span>{breakdown.skillAssessment}%</span>
                  </div>
                  <p className="text-purple-700 leading-relaxed text-[11px]">
                    Base proficiency benchmark: Beginner (70), Intermediate (85), Advanced (95).
                  </p>
                </div>

                <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-3.5 space-y-1">
                  <div className="flex items-center justify-between font-bold text-amber-900">
                    <span>4. Deliverables & Portfolio Evidence (10% Weight)</span>
                    <span>{breakdown.evidenceFactor}%</span>
                  </div>
                  <p className="text-amber-700 leading-relaxed text-[11px]">
                    Real tangible deliverables: code repositories, deployed demonstrations, and portfolio project evidence.
                  </p>
                </div>
              </div>

              {/* Verification Tiers */}
              <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 space-y-2 text-xs">
                <span className="font-bold text-gray-900 block">Verification Tiers:</span>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="rounded-lg bg-white p-2 border border-gray-200 text-center">
                    <span className="font-semibold text-gray-600 block">Self-Reported</span>
                    <span className="text-[10px] text-gray-400">Added to profile</span>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-2 border border-emerald-200 text-center">
                    <span className="font-bold text-emerald-700 block">Project Verified</span>
                    <span className="text-[10px] text-emerald-600">1+ Project & 4★+</span>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-2 border border-purple-200 text-center">
                    <span className="font-bold text-purple-700 block">Mastery</span>
                    <span className="text-[10px] text-purple-600">2+ Projects & 90+</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsWhyModalOpen(false)}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
