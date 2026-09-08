"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  IndianRupee,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { Payment, Escrow } from "@/types";

type FilterTab = "ALL" | "HELD" | "RELEASED" | "REFUNDED";

export function ClientPaymentsView() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [releasingId, setReleasingId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [paymentsData, escrowsData] = await Promise.all([
        apiClient.get<Payment[]>("/api/payments").catch(() => []),
        apiClient.get<Escrow[]>("/api/escrows").catch(() => []),
      ]);
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      setEscrows(Array.isArray(escrowsData) ? escrowsData : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load payments and escrow data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Release escrow funds to student wallet
  const handleReleaseEscrow = async (escrowId: string) => {
    if (releasingId) return;
    try {
      setReleasingId(escrowId);
      setActionSuccess(null);
      await apiClient.post(`/api/escrows/${escrowId}/release`);
      setActionSuccess("Escrow funds released successfully to the student.");
      await loadData();
    } catch (err: any) {
      alert(err?.message || "Failed to release escrow funds");
    } finally {
      setReleasingId(null);
    }
  };

  // Escrows map by id for quick lookup
  const escrowMap = useMemo(() => {
    const map = new Map<string, Escrow>();
    escrows.forEach((e) => {
      if (e.id) map.set(e.id, e);
      if (e.paymentId) map.set(e.paymentId, e);
    });
    return map;
  }, [escrows]);

  // Unified payment/escrow records
  const records = useMemo(() => {
    return payments.map((p) => {
      const associatedEscrow = p.escrow || escrowMap.get(p.id) || null;
      const amountNum = typeof p.amount === "number" ? p.amount : parseFloat(String(p.amount)) || 0;
      const escrowStatus = associatedEscrow?.status || (p.status === "SUCCEEDED" ? "RELEASED" : p.status);
      return {
        id: p.id,
        projectId: p.project?.id || p.projectId,
        projectTitle: p.project?.title || "Project Milestone",
        studentName: p.student?.user?.name || "Student Talent",
        studentEmail: p.student?.user?.email,
        studentAvatar: p.student?.user?.avatar || p.student?.user?.name?.charAt(0) || "S",
        amount: amountNum,
        currency: p.currency || "INR",
        paymentStatus: p.status,
        escrowId: associatedEscrow?.id || null,
        escrowStatus,
        createdAt: p.createdAt,
        heldAt: associatedEscrow?.heldAt || p.createdAt,
        releasedAt: associatedEscrow?.releasedAt,
      };
    });
  }, [payments, escrowMap]);

  // Metric computations from real records
  const stats = useMemo(() => {
    let totalFunded = 0;
    let heldInEscrow = 0;
    let releasedTotal = 0;
    let heldCount = 0;

    records.forEach((r) => {
      totalFunded += r.amount;
      if (r.escrowStatus === "HELD") {
        heldInEscrow += r.amount;
        heldCount += 1;
      } else if (r.escrowStatus === "RELEASED" || r.paymentStatus === "SUCCEEDED") {
        releasedTotal += r.amount;
      }
    });

    return {
      totalFunded,
      heldInEscrow,
      releasedTotal,
      heldCount,
      totalCount: records.length,
    };
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Tab filter
      if (activeTab === "HELD" && r.escrowStatus !== "HELD") return false;
      if (activeTab === "RELEASED" && r.escrowStatus !== "RELEASED") return false;
      if (activeTab === "REFUNDED" && r.escrowStatus !== "REFUNDED" && r.paymentStatus !== "REFUNDED") return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchProject = r.projectTitle.toLowerCase().includes(q);
        const matchStudent = r.studentName.toLowerCase().includes(q);
        if (!matchProject && !matchStudent) return false;
      }

      return true;
    });
  }, [records, activeTab, searchQuery]);

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString("en-IN")}`;
  };

  const getStatusBadge = (escrowStatus: string, paymentStatus: string) => {
    if (escrowStatus === "HELD") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
          <Clock size={12} /> Held in Escrow
        </span>
      );
    }
    if (escrowStatus === "RELEASED" || paymentStatus === "SUCCEEDED") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
          <CheckCircle2 size={12} /> Released
        </span>
      );
    }
    if (escrowStatus === "REFUNDED" || paymentStatus === "REFUNDED") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
          Refunded
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
        {paymentStatus}
      </span>
    );
  };

  if (isLoading) {
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

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50/60 p-6 text-red-800">
          <div className="flex items-center gap-3">
            <AlertCircle size={22} className="text-red-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-900">Failed to load payments</p>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadData}
            className="flex items-center gap-1.5 rounded-xl bg-red-100 px-3.5 py-2 text-xs font-semibold text-red-900 hover:bg-red-200 transition-colors"
          >
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
        <Link href="/client/dashboard" className="hover:text-[var(--color-text-primary)] transition-colors">
          Dashboard
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-[var(--color-text-primary)] font-medium">Payments & Escrow</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Payments & Escrow
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
            Manage funded project escrows, release milestone payments, and track transaction history.
          </p>
        </div>

        <Link
          href="/client/hired-students"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border-subtle)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-canvas-surface)] shadow-xs transition-colors self-start sm:self-auto"
        >
          Hired Students
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Success Notification */}
      {actionSuccess && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button
            onClick={() => setActionSuccess(null)}
            className="text-xs font-semibold text-emerald-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-5 shadow-2xs">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">Total Funded</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[var(--color-text-primary)]">
              {formatCurrency(stats.totalFunded)}
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">Across {stats.totalCount} transaction{stats.totalCount !== 1 ? "s" : ""}</p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">Funds in Escrow</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              <ShieldCheck size={12} /> Protected
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-amber-600">
              {formatCurrency(stats.heldInEscrow)}
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">{stats.heldCount} milestone{stats.heldCount !== 1 ? "s" : ""} awaiting release</p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-5 shadow-2xs">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">Released to Students</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-emerald-600">
              {formatCurrency(stats.releasedTotal)}
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">Successfully paid out</p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-5 shadow-2xs">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">Payment Security</span>
          <div className="mt-2 flex items-center gap-2">
            <ShieldCheck size={24} className="text-blue-600" />
            <span className="text-base font-semibold text-[var(--color-text-primary)]">100% Escrow</span>
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">Funds held until deliverables approved</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-border-subtle)] pb-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(
            [
              { id: "ALL", label: "All Transactions" },
              { id: "HELD", label: `In Escrow (${stats.heldCount})` },
              { id: "RELEASED", label: "Released" },
              { id: "REFUNDED", label: "Refunded" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors",
                activeTab === tab.id
                  ? "bg-[var(--color-text-primary)] text-white shadow-xs"
                  : "bg-[var(--color-canvas-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-gray-200/70"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search project or student..."
            className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-white pl-9 pr-3.5 py-2 text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600 transition-all"
          />
        </div>
      </div>

      {/* Transactions List */}
      {filteredRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border-subtle)] bg-white p-12 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-canvas-surface)] text-[var(--color-text-tertiary)]">
            <IndianRupee size={28} />
          </div>
          <h3 className="text-base font-bold text-[var(--color-text-primary)]">
            {searchQuery ? "No matching transactions" : "No payment transactions yet"}
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mt-1 mb-5 leading-relaxed">
            {searchQuery
              ? "Try adjusting your search keywords or filter tab."
              : "When you hire students and fund project milestones through SkillBridge Escrow, all your transaction details and payment releases will appear here."}
          </p>
          {!searchQuery && (
            <Link
              href="/client/hired-students"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
            >
              View Hired Students
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-white shadow-2xs overflow-hidden">
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {filteredRecords.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50/50 transition-colors"
              >
                {/* Left: Project & Student Info */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-xs">
                    {item.studentAvatar}
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/client/projects/${item.projectId}`}
                      className="text-sm font-bold text-[var(--color-text-primary)] hover:text-blue-600 hover:underline line-clamp-1 transition-colors"
                    >
                      {item.projectTitle}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--color-text-secondary)]">
                      <span>Student: <strong className="font-semibold text-[var(--color-text-primary)]">{item.studentName}</strong></span>
                      <span>&bull;</span>
                      <span>
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount, Status & Actions */}
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="text-right">
                    <p className="text-base font-bold text-[var(--color-text-primary)]">
                      {formatCurrency(item.amount)}
                    </p>
                    <div className="mt-1">
                      {getStatusBadge(item.escrowStatus, item.paymentStatus)}
                    </div>
                  </div>

                  {item.escrowStatus === "HELD" && item.escrowId && (
                    <button
                      type="button"
                      disabled={releasingId === item.escrowId}
                      onClick={() => handleReleaseEscrow(item.escrowId!)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition-colors shrink-0"
                    >
                      {releasingId === item.escrowId ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          Releasing...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={13} />
                          Release Funds
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
