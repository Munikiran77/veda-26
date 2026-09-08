"use client";

import React, { useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { GraduationCap, Briefcase, ArrowRight, X } from "lucide-react";

export interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GetStartedModal({ isOpen, onClose }: GetStartedModalProps) {
  const reduced = useReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Focus trap / focus first interactive element on open
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="get-started-title"
        >
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            initial={reduced ? false : { opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.95, y: 12 }}
            transition={{
              duration: reduced ? 0 : 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative w-full max-w-lg sm:max-w-xl rounded-3xl bg-white border border-[#14141e]/[0.08] shadow-[0_24px_48px_rgba(0,0,0,0.14)] p-6 sm:p-8 z-10 my-auto focus:outline-hidden"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#8e8e93] hover:text-[#1c1c1e] hover:bg-[#f5f5f7] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="mb-6 sm:mb-8 pr-8">
              <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8e8e93] mb-1.5">
                Get Started
              </span>
              <h2
                id="get-started-title"
                className="text-2xl sm:text-[28px] font-semibold tracking-tight text-[#1c1c1e] leading-snug"
              >
                Choose how you&apos;d like to use SkillBridge
              </h2>
              <p className="mt-1.5 text-[14px] text-[#5c5c62] leading-relaxed">
                Select the role that fits your goals. You can always switch or explore the platform.
              </p>
            </div>

            {/* Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Student */}
              <Link
                href="/student/login"
                onClick={onClose}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#14141e]/[0.08] bg-[#fbfbfd] p-5 sm:p-6 transition-all duration-200 hover:border-blue-500/40 hover:bg-white hover:shadow-[0_8px_24px_rgba(0,113,227,0.08)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 mb-4 transition-transform group-hover:scale-105">
                    <GraduationCap className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="text-[17px] font-semibold text-[#1c1c1e] tracking-tight">
                    Student
                  </h3>
                  <p className="mt-1.5 text-[13px] text-[#5c5c62] leading-relaxed">
                    Find projects, build experience, and grow your portfolio.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#14141e]/[0.06] flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-blue-600 group-hover:text-blue-700">
                    Continue as Student
                  </span>
                  <ArrowRight className="h-4 w-4 text-blue-600 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>

              {/* Option 2: Client */}
              <Link
                href="/client/login"
                onClick={onClose}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#14141e]/[0.08] bg-[#fbfbfd] p-5 sm:p-6 transition-all duration-200 hover:border-purple-500/40 hover:bg-white hover:shadow-[0_8px_24px_rgba(147,51,234,0.08)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 mb-4 transition-transform group-hover:scale-105">
                    <Briefcase className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="text-[17px] font-semibold text-[#1c1c1e] tracking-tight">
                    Client
                  </h3>
                  <p className="mt-1.5 text-[13px] text-[#5c5c62] leading-relaxed">
                    Post projects, discover talent, and hire skilled students.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#14141e]/[0.06] flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-purple-600 group-hover:text-purple-700">
                    Continue as Client
                  </span>
                  <ArrowRight className="h-4 w-4 text-purple-600 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            </div>

            {/* Footer Sign-in Alternatives */}
            <div className="mt-6 pt-5 border-t border-[#14141e]/[0.06] text-center">
              <p className="text-[12.5px] text-[#8e8e93]">
                Already have an account?{" "}
                <Link
                  href="/student/login"
                  onClick={onClose}
                  className="font-medium text-[#1c1c1e] hover:underline"
                >
                  Student sign in
                </Link>{" "}
                &bull;{" "}
                <Link
                  href="/client/login"
                  onClick={onClose}
                  className="font-medium text-[#1c1c1e] hover:underline"
                >
                  Client sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
