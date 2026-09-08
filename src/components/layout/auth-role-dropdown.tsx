"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type AuthMode = "login" | "signup";

export interface AuthOption {
  role: string;
  description: string;
  href: string;
  color: "blue" | "purple";
}

export interface AuthConfigItem {
  header: string;
  options: AuthOption[];
  switchPrompt: string;
  switchAction: string;
  targetMode: AuthMode;
}

export const AUTH_CONFIG: Record<AuthMode, AuthConfigItem> = {
  login: {
    header: "Choose how you want to log in",
    options: [
      {
        role: "Student",
        description: "Access your student account",
        href: "/student/login",
        color: "blue",
      },
      {
        role: "Client",
        description: "Access your client account",
        href: "/client/login",
        color: "purple",
      },
    ],
    switchPrompt: "Don't have an account?",
    switchAction: "Sign up",
    targetMode: "signup",
  },
  signup: {
    header: "Choose your account type",
    options: [
      {
        role: "Student",
        description: "Create a student account",
        href: "/student/signup",
        color: "blue",
      },
      {
        role: "Client",
        description: "Create a client account",
        href: "/client/signup",
        color: "purple",
      },
    ],
    switchPrompt: "Already have an account?",
    switchAction: "Log in",
    targetMode: "login",
  },
};

export interface AuthRoleDropdownProps {
  mode: AuthMode;
  onClose: () => void;
  onSwitchMode?: (mode: AuthMode) => void;
  align?: "left" | "right";
  className?: string;
}

export function AuthRoleDropdown({
  mode,
  onClose,
  onSwitchMode,
  align = "right",
  className,
}: AuthRoleDropdownProps) {
  const config = AUTH_CONFIG[mode];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -4 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      role="menu"
      aria-label={config.header}
      className={cn(
        "absolute top-full mt-2 z-50 w-72 sm:w-80 rounded-2xl bg-white/95 backdrop-blur-md border border-[#14141e]/[0.08] shadow-[0_12px_32px_rgba(20,20,35,0.08),0_2px_6px_rgba(20,20,35,0.04)] p-2 focus:outline-hidden",
        align === "left" ? "left-0 origin-top-left" : "right-0 origin-top-right",
        className
      )}
    >
      {/* Header */}
      <div className="px-3 pt-2 pb-1.5">
        <p className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-[0.06em]">
          {config.header}
        </p>
      </div>

      <div className="my-1 h-px w-full bg-[#14141e]/[0.05]" />

      {/* Role Options */}
      <div className="space-y-1">
        {config.options.map((opt) => (
          <Link
            key={opt.role}
            href={opt.href}
            onClick={onClose}
            role="menuitem"
            className="group flex items-center justify-between rounded-xl p-2.5 text-left transition-all duration-150 hover:bg-[#f5f5f7] active:bg-[#ebebee] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${
                  opt.color === "blue"
                    ? "bg-blue-500/10 text-blue-600"
                    : "bg-purple-500/10 text-purple-600"
                }`}
              >
                {opt.color === "blue" ? (
                  <GraduationCap className="h-5 w-5" />
                ) : (
                  <Briefcase className="h-4.5 w-4.5" />
                )}
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#1c1c1e] tracking-tight">
                  {opt.role}
                </p>
                <p className="text-[12px] text-[#8e8e93] leading-snug">
                  {opt.description}
                </p>
              </div>
            </div>

            <ChevronRight className="h-4 w-4 text-[#8e8e93] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#1c1c1e] shrink-0 ml-2" />
          </Link>
        ))}
      </div>

      {/* Footer Switcher */}
      {onSwitchMode && (
        <>
          <div className="my-1 h-px w-full bg-[#14141e]/[0.05]" />
          <div className="px-3 py-1.5 text-center">
            <p className="text-[12px] text-[#8e8e93]">
              {config.switchPrompt}{" "}
              <button
                type="button"
                onClick={() => onSwitchMode(config.targetMode)}
                className="font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                {config.switchAction}
              </button>
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
}
