import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/server/api-response";
import { AuthError, requireAuthenticatedUser } from "@/lib/server/auth/context";
import { refundEscrow, releaseEscrow } from "@/lib/server/payments/service";
import { DisputeStatus, EscrowStatus, UserRole, WorkStatus } from "@prisma/client";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteProps) {
  try {
    const { id } = await params;
    const auth = await requireAuthenticatedUser(req);

    // 1. Authorization: Must be authenticated CLIENT
    if (auth.role !== UserRole.CLIENT || !auth.clientProfile) {
      return apiError("Only authorized clients can resolve demo disputes", 403, "FORBIDDEN");
    }

    const body = await req.json().catch(() => ({}));
    const { resolution, resolutionNote } = body;

    // 2. Validate resolution
    if (resolution !== "RELEASE_TO_STUDENT" && resolution !== "REFUND_TO_CLIENT") {
      return apiError("Resolution must be either RELEASE_TO_STUDENT or REFUND_TO_CLIENT", 400, "INVALID_RESOLUTION");
    }

    // 3. Validate resolution note
    if (!resolutionNote || typeof resolutionNote !== "string" || resolutionNote.trim().length < 5) {
      return apiError("A resolution note of at least 5 characters is required", 400, "INVALID_NOTE");
    }

    // 4. Fetch dispute and verify state
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

    // Verify ownership: Client must own the contract/escrow
    if (dispute.escrow.workContract.clientId !== auth.clientProfile.id) {
      return apiError("You do not have permission to resolve this dispute", 403, "FORBIDDEN");
    }

    if (dispute.status !== DisputeStatus.OPEN) {
      return apiError(`Cannot resolve dispute with status ${dispute.status}. Only OPEN disputes can be resolved.`, 400, "INVALID_STATE");
    }

    if (dispute.escrow.status !== EscrowStatus.DISPUTED) {
      return apiError(`Associated escrow is in status ${dispute.escrow.status}, expected DISPUTED.`, 400, "INVALID_STATE");
    }

    // 5. Execute financial release or refund using existing payment service
    if (resolution === "RELEASE_TO_STUDENT") {
      const releaseResult = await releaseEscrow(dispute.escrowId, auth);

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
            lastActivity: `Dispute resolved in favor of Student: ${resolutionNote.trim()}`,
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
        message: "Dispute resolved. Escrow funds released to student wallet.",
      });
    } else {
      // REFUND_TO_CLIENT
      const refundResult = await refundEscrow(
        dispute.escrowId,
        auth,
        `Dispute resolved in favor of Client: ${resolutionNote.trim()}`
      );

      if ("error" in refundResult) {
        return apiError(refundResult.message || "Failed to refund escrow", 400, refundResult.error);
      }

      const updatedDispute = await prisma.$transaction(async (tx) => {
        await tx.workContract.update({
          where: { id: dispute.workContractId },
          data: {
            lastActivity: `Dispute resolved in favor of Client (Refunded): ${resolutionNote.trim()}`,
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
        message: "Dispute resolved. Escrow funds refunded to client.",
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
