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
  ShieldAlert,
  Scale,
  ArrowRight,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { Payment, Escrow } from "@/types";
import { OpenDisputeModal } from "./OpenDisputeModal";
import { ResolveDisputeModal } from "./ResolveDisputeModal";

type FilterTab = "ALL" | "HELD" | "DISPUTED" | "RELEASED" | "REFUNDED";

export function ClientPaymentsView() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [releasingId, setReleasingId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Modals state
  const [disputeModalTarget, setDisputeModalTarget] = useState<{
    escrowId: string;
    projectTitle: string;
    studentName: string;
    amount: number | string;
  } | null>(null);

  const [resolveModalTarget, setResolveModalTarget] = useState<{
    disputeId: string;
    projectTitle: string;
    studentName: string;
    amount: number | string;
    reason: string;
    description: string;
    evidence?: string | null;
  } | null>(null);

  const [isDemoArbiterActive, setIsDemoArbiterActive] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [paymentsData, escrowsData, disputesData] = await Promise.all([
        apiClient.get<Payment[]>("/api/payments").catch(() => []),
        apiClient.get<Escrow[]>("/api/escrows").catch(() => []),
        apiClient.get<any[]>("/api/disputes").catch(() => []),
      ]);
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      setEscrows(Array.isArray(escrowsData) ? escrowsData : []);
      setDisputes(Array.isArray(disputesData) ? disputesData : []);
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

  // Disputes map by escrowId
  const disputeMap = useMemo(() => {
    const map = new Map<string, any>();
    disputes.forEach((d) => {
      if (d.escrowId) map.set(d.escrowId, d);
    });
    return map;
  }, [disputes]);

  // Unified payment/escrow records
  const records = useMemo(() => {
    return payments.map((p) => {
      const associatedEscrow = p.escrow || escrowMap.get(p.id) || null;
      const amountNum = typeof p.amount === "number" ? p.amount : parseFloat(String(p.amount)) || 0;
      const associatedDispute = associatedEscrow ? disputeMap.get(associatedEscrow.id) : null;
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
        disputeId: associatedDispute?.id || null,
        disputeReason: associatedDispute?.reason || null,
        disputeDescription: associatedDispute?.description || null,
        disputeEvidence: associatedDispute?.evidence || null,
        createdAt: p.createdAt,
        heldAt: associatedEscrow?.heldAt || p.createdAt,
        releasedAt: associatedEscrow?.releasedAt,
      };
    });
  }, [payments, escrowMap, disputeMap]);

  // Metric computations from real records
  const stats = useMemo(() => {
    let totalFunded = 0;
    let heldInEscrow = 0;
    let releasedTotal = 0;
    let heldCount = 0;
    let disputedCount = 0;
    let disputedTotal = 0;

    records.forEach((r) => {
      totalFunded += r.amount;
      if (r.escrowStatus === "HELD") {
        heldInEscrow += r.amount;
        heldCount += 1;
      } else if (r.escrowStatus === "DISPUTED") {
        disputedCount += 1;
        disputedTotal += r.amount;
      } else if (r.escrowStatus === "RELEASED" || r.paymentStatus === "SUCCEEDED") {
        releasedTotal += r.amount;
      }
    });

    return {
      totalFunded,
      heldInEscrow,
      releasedTotal,
      heldCount,
      disputedCount,
      disputedTotal,
      totalCount: records.length,
    };
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Tab filter
      if (activeTab === "HELD" && r.escrowStatus !== "HELD") return false;
      if (activeTab === "DISPUTED" && r.escrowStatus !== "DISPUTED") return false;
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
    if (escrowStatus === "DISPUTED") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
          <ShieldAlert size={12} /> Dispute Raised
        </span>
      );
    }
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
            Manage funded project escrows, release milestone payments, and resolve disputes.
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
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">Disputed Funds</span>
            {stats.disputedCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                <ShieldAlert size={12} /> Active
              </span>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-rose-600">
              {formatCurrency(stats.disputedTotal)}
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">{stats.disputedCount} dispute{stats.disputedCount !== 1 ? "s" : ""} in arbitration</p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-5 shadow-2xs">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">Released to Students</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-emerald-600">
              {formatCurrency(stats.releasedTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Demo Arbitration Desk Banner */}
      {stats.disputedCount > 0 && (
        <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50/90 to-indigo-50/70 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
              <Scale size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                  Demo Arbitration Desk
                </h4>
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold",
                  isDemoArbiterActive ? "bg-purple-200 text-purple-800" : "bg-gray-200 text-gray-700"
                )}>
                  {isDemoArbiterActive ? "Arbiter Mode: Active" : "Client View: Normal"}
                </span>
              </div>
              <p className="text-xs text-purple-800 mt-0.5 max-w-xl">
                {isDemoArbiterActive
                  ? "Platform arbitration authority enabled. You can now adjudicate active disputes to release funds to the student or refund the client."
                  : "Hiring clients cannot self-arbitrate disputes. Contested funds remain safely held while awaiting independent arbitration."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsDemoArbiterActive(!isDemoArbiterActive)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-xs shrink-0",
              isDemoArbiterActive
                ? "bg-purple-700 text-white hover:bg-purple-800 ring-2 ring-purple-300"
                : "border border-purple-300 bg-white text-purple-800 hover:bg-purple-50"
            )}
          >
            <Scale size={13} />
            {isDemoArbiterActive ? "Exit Arbiter Mode" : "Simulate Demo Arbiter"}
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-border-subtle)] pb-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(
            [
              { id: "ALL", label: "All Transactions" },
              { id: "HELD", label: `In Escrow (${stats.heldCount})` },
              { id: "DISPUTED", label: `Disputed (${stats.disputedCount})` },
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
            {searchQuery ? "No matching transactions" : "No payment transactions in this category"}
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mt-1 mb-5 leading-relaxed">
            {searchQuery
              ? "Try adjusting your search keywords or filter tab."
              : "When you hire students and fund project milestones through SkillBridge Escrow, all transaction details and disputes appear here."}
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
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--color-text-secondary)] flex-wrap">
                      <span>Student: <strong className="font-semibold text-[var(--color-text-primary)]">{item.studentName}</strong></span>
                      <span>&bull;</span>
                      <span>
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {item.escrowStatus === "DISPUTED" && (
                        <span className="text-amber-700 font-semibold inline-flex items-center gap-1">
                          &bull; Awaiting Arbitration{item.disputeReason ? `: ${item.disputeReason}` : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount, Status & Actions */}
                <div className="flex items-center justify-between gap-3 sm:justify-end flex-wrap">
                  <div className="text-right">
                    <p className="text-base font-bold text-[var(--color-text-primary)]">
                      {formatCurrency(item.amount)}
                    </p>
                    <div className="mt-1">
                      {getStatusBadge(item.escrowStatus, item.paymentStatus)}
                    </div>
                  </div>

                  {/* Actions for HELD escrow */}
                  {item.escrowStatus === "HELD" && item.escrowId && (
                    <div className="flex items-center gap-2">
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

                      <button
                        type="button"
                        onClick={() =>
                          setDisputeModalTarget({
                            escrowId: item.escrowId!,
                            projectTitle: item.projectTitle,
                            studentName: item.studentName,
                            amount: item.amount,
                          })
                        }
                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors shrink-0"
                      >
                        Open Dispute
                      </button>
                    </div>
                  )}

                  {/* Actions for DISPUTED escrow */}
                  {item.escrowStatus === "DISPUTED" && (
                    isDemoArbiterActive ? (
                      <button
                        type="button"
                        onClick={() =>
                          setResolveModalTarget({
                            disputeId: item.disputeId || "",
                            projectTitle: item.projectTitle,
                            studentName: item.studentName,
                            amount: item.amount,
                            reason: item.disputeReason || "Deliverables disputed",
                            description: item.disputeDescription || "Work deliverable dispute opened by client.",
                            evidence: item.disputeEvidence,
                          })
                        }
                        className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors shrink-0"
                      >
                        <Scale size={13} />
                        Demo Arbitration
                      </button>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs font-medium text-amber-800 shrink-0">
                        <Clock size={12} className="text-amber-600" />
                        <span>Awaiting Arbitration</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Open Dispute Modal */}
      {disputeModalTarget && (
        <OpenDisputeModal
          isOpen={Boolean(disputeModalTarget)}
          onClose={() => setDisputeModalTarget(null)}
          escrowId={disputeModalTarget.escrowId}
          projectTitle={disputeModalTarget.projectTitle}
          studentName={disputeModalTarget.studentName}
          amount={disputeModalTarget.amount}
          onSuccess={() => {
            setActionSuccess("Dispute opened. Escrow status updated to Disputed.");
            loadData();
          }}
        />
      )}

      {/* Resolve Dispute Modal */}
      {resolveModalTarget && (
        <ResolveDisputeModal
          isOpen={Boolean(resolveModalTarget)}
          onClose={() => setResolveModalTarget(null)}
          disputeId={resolveModalTarget.disputeId}
          projectTitle={resolveModalTarget.projectTitle}
          studentName={resolveModalTarget.studentName}
          amount={resolveModalTarget.amount}
          reason={resolveModalTarget.reason}
          description={resolveModalTarget.description}
          evidence={resolveModalTarget.evidence}
          onSuccess={(msg) => {
            setActionSuccess(msg);
            loadData();
          }}
        />
      )}
    </div>
  );
}
