import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/server/api-response";
import { AuthError, requireAuthenticatedUser } from "@/lib/server/auth/context";
import { DisputeStatus, EscrowStatus, UserRole } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuthenticatedUser(req);

    const body = await req.json().catch(() => ({}));
    const { escrowId, reason, description, evidence } = body;

    // 1. Validate escrowId
    if (!escrowId || typeof escrowId !== "string" || !escrowId.trim()) {
      return apiError("escrowId is required", 400, "BAD_REQUEST");
    }

    // 2. Fetch Escrow with WorkContract and verify caller
    const escrow = await prisma.escrow.findUnique({
      where: { id: escrowId.trim() },
      include: {
        workContract: {
          include: {
            project: true,
            student: true,
            client: true,
          },
        },
        dispute: true,
      },
    });

    if (!escrow) {
      return apiError("Escrow not found", 404, "NOT_FOUND");
    }

    // 3. Caller must be Client or Student on this WorkContract
    const isClient = auth.role === UserRole.CLIENT && auth.clientProfile?.id === escrow.workContract.clientId;
    const isStudent = auth.role === UserRole.STUDENT && auth.studentProfile?.id === escrow.workContract.studentId;

    if (!isClient && !isStudent) {
      return apiError("You do not have permission to open a dispute on this escrow", 403, "FORBIDDEN");
    }

    // 4. Escrow status must be HELD
    if (escrow.status !== EscrowStatus.HELD) {
      return apiError(`Cannot dispute escrow with status ${escrow.status}. Escrow must be in HELD status.`, 400, "INVALID_STATE");
    }

    // 5. No existing active dispute for the escrow
    if (escrow.dispute && escrow.dispute.status === DisputeStatus.OPEN) {
      return apiError("An open dispute already exists for this escrow", 409, "DUPLICATE_DISPUTE");
    }

    // 6. Validate reason
    if (!reason || typeof reason !== "string" || reason.trim().length < 3) {
      return apiError("Dispute reason is required (at least 3 characters)", 400, "INVALID_REASON");
    }

    // 7. Validate description length
    if (!description || typeof description !== "string" || description.trim().length < 10) {
      return apiError("Dispute description must be at least 10 characters long", 400, "INVALID_DESCRIPTION");
    }

    if (description.trim().length > 3000) {
      return apiError("Dispute description exceeds maximum length of 3000 characters", 400, "INVALID_DESCRIPTION");
    }

    const cleanEvidence = typeof evidence === "string" && evidence.trim() ? evidence.trim() : null;

    // 8. Atomic transition: Escrow HELD -> DISPUTED and create Dispute
    const result = await prisma.$transaction(async (tx) => {
      // Transition escrow status to DISPUTED
      const updatedEscrow = await tx.escrow.update({
        where: { id: escrow.id },
        data: { status: EscrowStatus.DISPUTED },
      });

      // Update work contract lastActivity
      await tx.workContract.update({
        where: { id: escrow.workContractId },
        data: {
          lastActivity: `Dispute opened: ${reason.trim()}`,
        },
      });

      // Create Dispute record
      const createdDispute = await tx.dispute.create({
        data: {
          escrowId: escrow.id,
          workContractId: escrow.workContractId,
          openedById: auth.user.id,
          reason: reason.trim(),
          description: description.trim(),
          evidence: cleanEvidence,
          status: DisputeStatus.OPEN,
        },
        include: {
          openedBy: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
          workContract: {
            include: {
              project: { select: { title: true } },
            },
          },
        },
      });

      return { escrow: updatedEscrow, dispute: createdDispute };
    });

    return apiSuccess({
      dispute: result.dispute,
      escrow: result.escrow,
      message: "Dispute opened successfully. Payment is now held in dispute until resolution.",
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return apiError(error.message, error.status, error.code);
    }
    console.error("POST /api/disputes error:", error);
    return apiError(error.message || "Failed to open dispute", 500, "INTERNAL_ERROR");
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuthenticatedUser(req);

    // Scope disputes strictly to the authenticated user's contracts
    const where: any = {};

    if (auth.role === UserRole.CLIENT) {
      if (!auth.clientProfile) return apiSuccess([]);
      where.workContract = { clientId: auth.clientProfile.id };
    } else if (auth.role === UserRole.STUDENT) {
      if (!auth.studentProfile) return apiSuccess([]);
      where.workContract = { studentId: auth.studentProfile.id };
    } else {
      return apiSuccess([]);
    }

    const disputes = await prisma.dispute.findMany({
      where,
      include: {
        openedBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        escrow: {
          include: {
            payment: true,
          },
        },
        workContract: {
          include: {
            project: { select: { id: true, title: true } },
            student: {
              include: {
                user: { select: { name: true, email: true, avatar: true } },
              },
            },
            client: {
              include: {
                user: { select: { name: true, email: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const sanitized = disputes.map((d) => ({
      id: d.id,
      escrowId: d.escrowId,
      workContractId: d.workContractId,
      reason: d.reason,
      description: d.description,
      evidence: d.evidence,
      status: d.status,
      resolutionNote: d.resolutionNote,
      resolvedAt: d.resolvedAt ? d.resolvedAt.toISOString() : null,
      createdAt: d.createdAt.toISOString(),
      amount: d.escrow ? parseFloat(d.escrow.amount.toString()) : 0,
      currency: d.escrow?.currency || "INR",
      projectTitle: d.workContract?.project?.title || "Project",
      studentName: d.workContract?.student?.user?.name || "Student",
      clientName: d.workContract?.client?.companyName || d.workContract?.client?.user?.name || "Client",
      openedByName: d.openedBy?.name || "User",
      openedByRole: d.openedBy?.role || "USER",
    }));

    return apiSuccess(sanitized);
  } catch (error: any) {
    if (error instanceof AuthError) {
      return apiError(error.message, error.status, error.code);
    }
    console.error("GET /api/disputes error:", error);
    return apiError("Failed to fetch disputes", 500, "INTERNAL_ERROR");
  }
}
