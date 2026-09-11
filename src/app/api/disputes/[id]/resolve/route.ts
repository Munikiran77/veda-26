import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/server/api-response";
import { AuthError, requireAuthenticatedUser } from "@/lib/server/auth/context";
import { refundEscrow, releaseEscrow } from "@/lib/server/payments/service";
import { DisputeStatus, EscrowStatus, UserRole, WorkStatus } from "@prisma/client";

const DEMO_ARBITER_KEY = "sb-arbiter-demo-2026";
const ARBITER_EMAILS = [
  "arbiter@skillbridge.co",
  "admin@skillbridge.co",
];

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteProps) {
  try {
    const { id } = await params;
    const auth = await requireAuthenticatedUser(req);

    const body = await req.json().catch(() => ({}));
    const { resolution, resolutionNote } = body;

    // 1. Fetch dispute and verify existence first
    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: {
        escrow: {
          include: {
            workContract: true,
          },
        },
      },
    });

    if (!dispute) {
      return apiError("Dispute not found", 404, "NOT_FOUND");
    }

    // 2. Authorization: Caller MUST be an authorized Demo Arbiter or Administrator.
    // Hiring clients and students cannot self-arbitrate under any circumstances.
    const headerKey = req.headers.get("x-arbiter-key") || req.headers.get("x-demo-arbiter-key");
    const bodyKey = typeof body?.arbiterKey === "string" ? body.arbiterKey.trim() : null;
    const isKeyArbiter = headerKey === DEMO_ARBITER_KEY || bodyKey === DEMO_ARBITER_KEY;
    const isEmailArbiter = ARBITER_EMAILS.includes(auth.user.email.toLowerCase());
    const isAuthorizedArbiter = isKeyArbiter || isEmailArbiter;

    if (!isAuthorizedArbiter) {
      if (auth.role === UserRole.STUDENT) {
        return apiError("Students cannot resolve disputes. Platform arbitration is required.", 403, "FORBIDDEN");
      }
      if (auth.role === UserRole.CLIENT) {
        if (dispute.escrow.workContract.clientId === auth.clientProfile?.id) {
          return apiError(
            "Hiring clients cannot resolve their own disputes in their own favor. Platform or demo arbitration is required.",
            403,
            "FORBIDDEN"
          );
        }
        return apiError("You do not have permission to resolve this dispute. Platform arbitration is required.", 403, "FORBIDDEN");
      }
      return apiError("Unauthorized. Demo arbitration requires verified platform arbiter authorization.", 403, "FORBIDDEN");
    }

    // 3. Validate resolution
    if (resolution !== "RELEASE_TO_STUDENT" && resolution !== "REFUND_TO_CLIENT") {
      return apiError("Resolution must be either RELEASE_TO_STUDENT or REFUND_TO_CLIENT", 400, "INVALID_RESOLUTION");
    }

    // 4. Validate resolution note
    if (!resolutionNote || typeof resolutionNote !== "string" || resolutionNote.trim().length < 5) {
      return apiError("A resolution note of at least 5 characters is required", 400, "INVALID_NOTE");
    }

    // 5. Verify state machine conditions
    if (dispute.status !== DisputeStatus.OPEN) {
      return apiError(`Cannot resolve dispute with status ${dispute.status}. Only OPEN disputes can be resolved.`, 400, "INVALID_STATE");
    }

    if (dispute.escrow.status !== EscrowStatus.DISPUTED) {
      return apiError(`Associated escrow is in status ${dispute.escrow.status}, expected DISPUTED.`, 400, "INVALID_STATE");
    }

    // 6. Execute financial release or refund via payment service with arbiter authorization
    if (resolution === "RELEASE_TO_STUDENT") {
      const releaseResult = await releaseEscrow(dispute.escrowId, auth, { asArbiter: true });

      if ("error" in releaseResult) {
        return apiError(releaseResult.message || "Failed to release escrow", 400, releaseResult.error);
      }

      // Mark contract completed and dispute resolved
      const updatedDispute = await prisma.$transaction(async (tx) => {
        await tx.workContract.update({
          where: { id: dispute.workContractId },
          data: {
            status: WorkStatus.COMPLETED,
            progress: 100,
            lastActivity: `Dispute resolved in favor of Student by Arbiter: ${resolutionNote.trim()}`,
          },
        });

        return tx.dispute.update({
          where: { id: dispute.id },
          data: {
            status: DisputeStatus.RESOLVED_STUDENT,
            resolutionNote: resolutionNote.trim(),
            resolvedAt: new Date(),
          },
        });
      });

      return apiSuccess({
        dispute: updatedDispute,
        escrow: releaseResult.escrow,
        wallet: releaseResult.wallet,
        resolution: "RELEASE_TO_STUDENT",
        message: "Dispute resolved by platform arbitration. Escrow funds released to student wallet.",
      });
    } else {
      // REFUND_TO_CLIENT
      const refundResult = await refundEscrow(
        dispute.escrowId,
        auth,
        `Dispute resolved in favor of Client by Arbiter: ${resolutionNote.trim()}`,
        { asArbiter: true }
      );

      if ("error" in refundResult) {
        return apiError(refundResult.message || "Failed to refund escrow", 400, refundResult.error);
      }

      const updatedDispute = await prisma.$transaction(async (tx) => {
        await tx.workContract.update({
          where: { id: dispute.workContractId },
          data: {
            lastActivity: `Dispute resolved in favor of Client (Refunded) by Arbiter: ${resolutionNote.trim()}`,
          },
        });

        return tx.dispute.update({
          where: { id: dispute.id },
          data: {
            status: DisputeStatus.RESOLVED_CLIENT,
            resolutionNote: resolutionNote.trim(),
            resolvedAt: new Date(),
          },
        });
      });

      return apiSuccess({
        dispute: updatedDispute,
        escrow: refundResult.escrow,
        payment: refundResult.payment,
        resolution: "REFUND_TO_CLIENT",
        message: "Dispute resolved by platform arbitration. Escrow funds refunded to client.",
      });
    }
  } catch (error: any) {
    if (error instanceof AuthError) {
      return apiError(error.message, error.status, error.code);
    }
    console.error("POST /api/disputes/[id]/resolve error:", error);
    return apiError(error.message || "Failed to resolve dispute", 500, "INTERNAL_ERROR");
  }
}
