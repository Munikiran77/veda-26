"use client";

import { motion } from "framer-motion";
import { ExternalLink, Code, Plus, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import type { PortfolioProject, WorkProject } from "@/types";
import { formatINR } from "@/lib/utils";

export function PortfolioSection({ portfolio, onAddProject }: { portfolio: PortfolioProject[]; onAddProject: () => void }) {
  return (
    <div className="mb-12">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Portfolio</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Showcase your best work and demonstrate what you can build.
          </p>
        </div>
        <button
          onClick={onAddProject}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portfolio.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="flex flex-col rounded-2xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                {project.projectType}
              </span>
              {project.completionDate && (
                <span className="text-xs text-[var(--color-text-tertiary)]">{project.completionDate}</span>
              )}
            </div>
            
            <h3 className="mb-2 text-lg font-bold text-[var(--color-text-primary)] leading-snug">
              {project.title}
            </h3>
            <p className="mb-4 text-sm text-[var(--color-text-secondary)] line-clamp-2">
              {project.description}
            </p>
            
            <div className="mb-6 flex flex-wrap gap-2 mt-auto">
              {project.technologies.map((tech) => (
                <span key={tech} className="rounded-lg bg-[var(--color-canvas-surface)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-text-secondary)]">
                  {tech}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-3 border-t border-[var(--color-border-subtle)] pt-4">
              <a
                href={project.githubUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-border-subtle)] px-4 py-2 text-sm font-semibold transition-colors ${
                  project.githubUrl ? "bg-white text-[var(--color-text-primary)] hover:bg-[var(--color-canvas-surface)]" : "bg-gray-50 text-gray-400 cursor-not-allowed"
                }`}
                onClick={(e) => !project.githubUrl && e.preventDefault()}
              >
                <Code size={16} />
                Code
              </a>
              <a
                href={project.demoUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-border-subtle)] px-4 py-2 text-sm font-semibold transition-colors ${
                  project.demoUrl ? "bg-white text-[var(--color-text-primary)] hover:bg-[var(--color-canvas-surface)]" : "bg-gray-50 text-gray-400 cursor-not-allowed"
                }`}
                onClick={(e) => !project.demoUrl && e.preventDefault()}
              >
                <ExternalLink size={16} />
                Demo
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function SkillBridgeProjects({ projects }: { projects: (WorkProject & { project: import("@/types").Project })[] }) {
  if (projects.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="mb-6 text-xl font-bold text-[var(--color-text-primary)]">
        Completed SkillBridge Projects
      </h2>
      <div className="flex flex-col gap-6">
        {projects.map((work, i) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 p-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex-1">
              <h3 className="mb-1 text-lg font-bold text-[var(--color-text-primary)]">
                {work.project.title}
              </h3>
              <p className="mb-3 text-sm text-[var(--color-text-secondary)]">
                Client: <span className="font-medium text-[var(--color-text-primary)]">{work.project.client}</span> • Completed: {work.completedAt}
              </p>
              {work.review && (
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="mb-1 flex items-center gap-1 text-sm font-bold text-yellow-600">
                    {work.rating} <Star size={14} className="fill-current" />
                  </div>
                  <p className="text-sm italic text-gray-700">&quot;{work.review}&quot;</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-3 sm:items-end">
              <div className="text-right hidden sm:block">
                <span className="text-lg font-bold text-[var(--color-text-primary)]">{formatINR(work.earnings || work.project?.budget)}</span>
                <p className="text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">Earnings</p>
              </div>
              <Link
                href={`/student/projects/${work.projectId}`}
                className="group flex items-center justify-center gap-1.5 rounded-xl bg-white border border-[var(--color-border-subtle)] px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-canvas-surface)] transition-colors w-full sm:w-auto"
              >
                View Project
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export interface ClientReviewItem {
  id: string;
  rating: number;
  review: string;
  client: string;
  projectTitle?: string;
  verifiedSkills?: string[];
  qualityRating?: number | null;
  communicationRating?: number | null;
  timelinessRating?: number | null;
  professionalismRating?: number | null;
}

export function ClientReviews({ reviews }: { reviews: ClientReviewItem[] }) {
  if (reviews.length === 0) {
    return (
      <div className="mb-12">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Client Reviews & Evidence</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Feedback and skills verified by clients on completed projects.
          </p>
        </div>
        <div className="rounded-2xl border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-canvas-bg)] p-8 text-center">
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">No reviews yet</p>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
            Client reviews and verified skills will appear here once you complete projects.
          </p>
        </div>
      </div>
    );
  }

  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="mb-12">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Client Reviews & Evidence</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Verified proof of delivery from real-world SkillBridge engagements.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-[var(--color-canvas-surface)] px-4 py-2 border border-[var(--color-border-subtle)]">
          <div className="text-lg font-bold text-[var(--color-text-primary)]">{avgRating} / 5</div>
          <div className="h-6 w-px bg-[var(--color-border-subtle)]" />
          <div className="text-xs text-[var(--color-text-secondary)]">
            Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((rev) => (
          <div key={rev.id} className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-sm flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm font-bold text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(rev.rating) ? "fill-current" : "text-gray-300"} />
                ))}
                <span className="ml-1 text-[var(--color-text-primary)]">{rev.rating}.0</span>
              </div>
              {rev.projectTitle && (
                <span className="text-[11px] font-medium text-gray-500 truncate max-w-[160px]">
                  {rev.projectTitle}
                </span>
              )}
            </div>

            <p className="mb-4 text-sm italic leading-relaxed text-gray-700 flex-1">
              &quot;{rev.review}&quot;
            </p>

            {/* Verified Skills from this Project */}
            {rev.verifiedSkills && rev.verifiedSkills.length > 0 && (
              <div className="mb-3 rounded-xl bg-emerald-50/70 p-2.5 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                  Skills Verified in this Project:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {rev.verifiedSkills.map((sk) => (
                    <span key={sk} className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200 shadow-2xs">
                      <span>✓</span> {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dimensional Ratings Breakdown if available */}
            {(rev.qualityRating || rev.communicationRating || rev.timelinessRating || rev.professionalismRating) && (
              <div className="mb-3 flex flex-wrap gap-2 text-[10px] font-semibold text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100">
                {rev.qualityRating && <span>Quality: <strong className="text-gray-800">{rev.qualityRating}★</strong></span>}
                {rev.communicationRating && <span>Comm: <strong className="text-gray-800">{rev.communicationRating}★</strong></span>}
                {rev.timelinessRating && <span>Time: <strong className="text-gray-800">{rev.timelinessRating}★</strong></span>}
                {rev.professionalismRating && <span>Prof: <strong className="text-gray-800">{rev.professionalismRating}★</strong></span>}
              </div>
            )}

            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mt-auto pt-2 border-t border-gray-100">
              — {rev.client}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
