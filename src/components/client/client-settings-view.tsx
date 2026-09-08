"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Globe,
  Loader2,
  Mail,
  MapPin,
  RefreshCw,
  Save,
  Shield,
  User,
} from "lucide-react";
import { useClientAuth } from "./client-auth-context";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

const INDUSTRY_OPTIONS = [
  "Technology & Software",
  "E-Commerce & Retail",
  "Financial Services & FinTech",
  "Education & EdTech",
  "Healthcare & Life Sciences",
  "Design, Media & Entertainment",
  "Marketing & Advertising",
  "Consulting & Business Services",
  "Non-Profit & Social Enterprise",
  "Other",
];

interface ClientProfileData {
  id: string;
  userId: string;
  name: string;
  companyName: string;
  industry: string;
  description: string;
  location: string;
  rating?: number;
  projectsPostedCount?: number;
  studentsHiredCount?: number;
}

export function ClientSettingsView() {
  const { user, refreshSession } = useClientAuth();

  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    industry: "Technology & Software",
    location: "",
    description: "",
  });

  const [profileStats, setProfileStats] = useState<{
    rating: number;
    projectsPostedCount: number;
    studentsHiredCount: number;
  }>({
    rating: 5.0,
    projectsPostedCount: 0,
    studentsHiredCount: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get<ClientProfileData>(`/api/clients/${user.id}`);
      if (res) {
        setFormData({
          name: res.name || user.name || "",
          companyName: res.companyName || user.company || "",
          industry: res.industry || "Technology & Software",
          location: res.location || "",
          description: res.description || "",
        });
        setProfileStats({
          rating: res.rating ?? 5.0,
          projectsPostedCount: res.projectsPostedCount ?? 0,
          studentsHiredCount: res.studentsHiredCount ?? 0,
        });
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load client settings");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, user?.name, user?.company]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || isSaving) return;

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.companyName.trim()) {
      setError("Please enter your company or organization name.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      await apiClient.patch(`/api/clients/${user.id}`, {
        name: formData.name.trim(),
        companyName: formData.companyName.trim(),
        industry: formData.industry,
        location: formData.location.trim(),
        description: formData.description.trim(),
      });

      await refreshSession();
      setSuccessMessage("Client settings and profile details updated successfully!");
    } catch (err: any) {
      setError(err?.message || "Failed to update settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-32 rounded bg-gray-100 animate-pulse" />
        <div className="h-10 w-64 rounded bg-gray-100 animate-pulse" />
        <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-8 animate-pulse space-y-6">
          <div className="h-6 w-48 rounded bg-gray-100" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-10 rounded-xl bg-gray-100" />
            <div className="h-10 rounded-xl bg-gray-100" />
          </div>
          <div className="h-28 rounded-xl bg-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
        <Link href="/client/dashboard" className="hover:text-[var(--color-text-primary)] transition-colors">
          Dashboard
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-[var(--color-text-primary)] font-medium">Settings</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Settings & Company Profile
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
          Manage your organization details, contact preferences, and public client presence on SkillBridge.
        </p>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-xs font-semibold text-emerald-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-xs font-semibold text-rose-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Contact Information */}
        <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-2xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--color-border-subtle)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <User size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--color-text-primary)]">Contact Person</h2>
              <p className="text-xs text-[var(--color-text-secondary)]">Your identity as the primary account administrator</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600 transition-all"
                />
              </div>
            </div>

            {/* Account Email (Read-only) */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
                Account Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-gray-50 px-3.5 py-2.5 text-sm text-[var(--color-text-secondary)] cursor-not-allowed"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-gray-400">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-[var(--color-text-tertiary)] mt-1">Managed by authentication security.</p>
            </div>
          </div>
        </div>

        {/* Section 2: Organization & Company Profile */}
        <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-2xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--color-border-subtle)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Building2 size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--color-text-primary)]">Company & Organization</h2>
              <p className="text-xs text-[var(--color-text-secondary)]">Displayed to prospective student applicants on your projects</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
                Company / Brand Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="companyName"
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Acme Innovations"
                className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600 transition-all"
              />
            </div>

            {/* Industry */}
            <div>
              <label htmlFor="industry" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
                Industry Domain
              </label>
              <select
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600 transition-all"
              >
                {INDUSTRY_OPTIONS.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="sm:col-span-2">
              <label htmlFor="location" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
                Location / Headquarters
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Bangalore, India or Remote"
                  className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-white pl-9 pr-3.5 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600 transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
                About the Company
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Briefly describe what your organization builds, your mission, and the opportunities you offer student freelancers..."
                className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600 transition-all resize-y"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Account & Platform Stats */}
        <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--color-border-subtle)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Shield size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--color-text-primary)]">Platform Account Status</h2>
              <p className="text-xs text-[var(--color-text-secondary)]">Verified metrics associated with your client account</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-surface)] p-4">
              <span className="text-xs text-[var(--color-text-secondary)]">Projects Posted</span>
              <p className="text-xl font-bold text-[var(--color-text-primary)] mt-1">
                {profileStats.projectsPostedCount}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-surface)] p-4">
              <span className="text-xs text-[var(--color-text-secondary)]">Students Hired</span>
              <p className="text-xl font-bold text-[var(--color-text-primary)] mt-1">
                {profileStats.studentsHiredCount}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-surface)] p-4">
              <span className="text-xs text-[var(--color-text-secondary)]">Client Rating</span>
              <p className="text-xl font-bold text-amber-600 mt-1">
                {profileStats.rating.toFixed(1)} ★
              </p>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={loadProfile}
            disabled={isSaving}
            className="rounded-xl border border-[var(--color-border-subtle)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-canvas-surface)] hover:text-[var(--color-text-primary)] transition-colors disabled:opacity-50"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
