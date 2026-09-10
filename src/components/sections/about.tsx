"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/layout";

export function About() {
  const reduced = useReducedMotion();

  const reveal = (delay: number = 0) => ({
    initial: reduced ? false : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-10%" },
    transition: {
      duration: reduced ? 0 : 0.5,
      delay: reduced ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <section
      id="about"
      aria-label="About SkillBridge"
      className="relative w-full border-t border-[#14141e]/[0.06] bg-[var(--color-canvas-bg)] pt-16 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32 overflow-hidden scroll-mt-20 sm:scroll-mt-24 z-20"
    >
      <Container size="xl">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <motion.span
            {...reveal(0)}
            className="text-[11px] sm:text-[12px] font-semibold tracking-[0.2em] text-[#5c5c62] uppercase mb-3.5"
          >
            About SkillBridge
          </motion.span>
          <motion.h2
            {...reveal(0.08)}
            className="text-3xl sm:text-4xl lg:text-[40px] font-semibold text-[#1c1c1e] tracking-tight leading-tight mb-4"
          >
            Built for Students. Trusted by Clients.
          </motion.h2>
          <motion.p
            {...reveal(0.16)}
            className="text-base sm:text-lg text-[#48484a] max-w-2xl leading-relaxed"
          >
            SkillBridge is the dedicated freelance marketplace bridging the gap
            between academia and industry. We connect motivated student builders
            with clients looking for skilled talent to deliver real-world
            projects.
          </motion.p>
        </div>

        {/* Dual Cards: Students & Clients */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 mb-12 sm:mb-16">
          {/* For Students */}
          <motion.div
            {...reveal(0.12)}
            className="flex flex-col justify-between rounded-3xl border border-[#14141e]/[0.08] bg-white p-7 sm:p-9 shadow-[0_2px_12px_rgba(20,20,35,0.03)] hover:border-[#14141e]/[0.15] transition-all duration-300"
          >
            <div>
              <div className="flex items-center gap-3.5 mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold tracking-wider text-blue-600 uppercase">
                    For Student Builders
                  </span>
                  <h3 className="text-xl sm:text-2xl font-semibold text-[#1c1c1e] tracking-tight">
                    Launch Your Career Early
                  </h3>
                </div>
              </div>

              <p className="text-[14.5px] text-[#5c5c62] leading-relaxed mb-6">
                Turn your coursework and self-taught skills into verifiable
                industry proof. Gain hands-on project experience, build client
                relationships, and earn fair compensation before you graduate.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-[14px] text-[#48484a]">
                  <CheckCircle2 className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Discover curated projects</strong> matched to your
                    tech stack, design skills, and working availability.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-[14px] text-[#48484a]">
                  <CheckCircle2 className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Apply & communicate directly</strong> with clients
                    via seamless built-in messaging.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-[14px] text-[#48484a]">
                  <CheckCircle2 className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Complete real deliverables</strong>, receive
                    milestone payouts, and build a verified career portfolio.
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-[#14141e]/[0.06]">
              <Link
                href="/student/projects"
                prefetch={false}
                className="group inline-flex items-center gap-2 text-[14px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>Find Student Projects</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* For Clients */}
          <motion.div
            {...reveal(0.2)}
            className="flex flex-col justify-between rounded-3xl border border-[#14141e]/[0.08] bg-white p-7 sm:p-9 shadow-[0_2px_12px_rgba(20,20,35,0.03)] hover:border-[#14141e]/[0.15] transition-all duration-300"
          >
            <div>
              <div className="flex items-center gap-3.5 mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold tracking-wider text-purple-600 uppercase">
                    For Clients & Businesses
                  </span>
                  <h3 className="text-xl sm:text-2xl font-semibold text-[#1c1c1e] tracking-tight">
                    Hire Motivated Talent
                  </h3>
                </div>
              </div>

              <p className="text-[14.5px] text-[#5c5c62] leading-relaxed mb-6">
                Access ambitious university students eager to solve real
                problems. Scale your development, design, and automation needs
                with transparent collaboration and protected escrows.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-[14px] text-[#48484a]">
                  <CheckCircle2 className="h-4.5 w-4.5 text-purple-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Post project scopes</strong> with defined
                    deliverables, budgets, and clear timelines in minutes.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-[14px] text-[#48484a]">
                  <CheckCircle2 className="h-4.5 w-4.5 text-purple-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Discover pre-vetted talent</strong> with transparent
                    college credentials, portfolios, and reviews.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-[14px] text-[#48484a]">
                  <CheckCircle2 className="h-4.5 w-4.5 text-purple-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Manage milestone contracts</strong> with escrow
                    protection — release payments only when satisfied.
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-[#14141e]/[0.06]">
              <Link
                href="/client/talent"
                prefetch={false}
                className="group inline-flex items-center gap-2 text-[14px] font-semibold text-purple-600 hover:text-purple-700 transition-colors"
              >
                <span>Discover Student Talent</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Mission Highlight Banner */}
        <motion.div
          {...reveal(0.24)}
          className="rounded-3xl border border-[#14141e]/[0.08] bg-gradient-to-br from-white via-white to-[#f5f5f7] p-8 sm:p-10 lg:p-12 shadow-[0_2px_12px_rgba(20,20,35,0.03)]"
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#1c1c1e]/5 px-3 py-1 text-[11px] font-semibold text-[#1c1c1e] uppercase tracking-wider mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Our Mission</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-[#1c1c1e] tracking-tight mb-4">
              Closing the Experience Gap
            </h3>
            <p className="text-[15px] sm:text-[16px] text-[#48484a] leading-relaxed mb-8">
              Traditional freelance platforms demand years of client reviews,
              making it hard for students to start. We created SkillBridge to
              give students a dedicated launchpad for genuine career experience,
              while offering businesses agile, high-potential builders.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#14141e]/[0.06] text-left">
              <div className="flex items-start gap-3">
                <GraduationCap className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[14px] font-semibold text-[#1c1c1e]">
                    Verified Students
                  </h4>
                  <p className="text-[12.5px] text-[#5c5c62] mt-0.5 leading-snug">
                    Authentic profiles with university credentials and skills.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[14px] font-semibold text-[#1c1c1e]">
                    Protected Escrows
                  </h4>
                  <p className="text-[12.5px] text-[#5c5c62] mt-0.5 leading-snug">
                    Funds held safely until work is approved and verified.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[14px] font-semibold text-[#1c1c1e]">
                    Real Outcomes
                  </h4>
                  <p className="text-[12.5px] text-[#5c5c62] mt-0.5 leading-snug">
                    Measurable impact for clients; proof of work for students.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
