import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/server/api-response";
import { AuthError, requireAuthenticatedUser } from "@/lib/server/auth/context";
import { EscrowStatus, ProjectStatus, UserRole, WorkStatus } from "@prisma/client";
import { calculateSkillUpdateOnReview } from "@/lib/skill-passport";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuthenticatedUser(req);

    // 1. Require authenticated CLIENT
    if (auth.role !== UserRole.CLIENT || !auth.clientProfile) {
      return apiError("Only clients can submit reviews", 403, "FORBIDDEN");
    }

    const body = await req.json().catch(() => ({}));
    const {
      workContractId,
      rating,
      qualityRating,
      communicationRating,
      timelinessRating,
      professionalismRating,
      comment,
      verifiedSkills,
    } = body;

    // 2. Validate workContractId
    if (!workContractId || typeof workContractId !== "string" || !workContractId.trim()) {
      return apiError("workContractId is required", 400, "BAD_REQUEST");
    }

    // 3. Confirm the client owns the WorkContract and derive identities from DB
    const contract = await prisma.workContract.findUnique({
      where: { id: workContractId.trim() },
      include: {
        project: {
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
          },
        },
        student: {
          include: {
            user: true,
          },
        },
        client: true,
        review: true,
        escrow: true,
      },
    });

    if (!contract) {
      return apiError("Work contract not found", 404, "NOT_FOUND");
    }

    // Confirm ownership
    if (contract.clientId !== auth.clientProfile.id) {
      return apiError("You do not have permission to review this contract", 403, "FORBIDDEN");
    }

    // 4. Confirm work has reached AWAITING_REVIEW or COMPLETED
    if (contract.status !== WorkStatus.AWAITING_REVIEW && contract.status !== WorkStatus.COMPLETED) {
      return apiError("Work contract is not ready for review. Status must be Awaiting Review or Completed.", 400, "INVALID_STATE");
    }

    // 5. Prevent duplicate reviews
    if (contract.review) {
      return apiError("A review has already been submitted for this contract", 409, "DUPLICATE_REVIEW");
    }

    // 6. Validate every rating is integer 1–5
    const parsedRating = Number(rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return apiError("Overall rating must be an integer between 1 and 5", 400, "INVALID_RATING");
    }

    const validateSubRating = (val: any, name: string) => {
      if (val !== undefined && val !== null) {
        const num = Number(val);
        if (!Number.isInteger(num) || num < 1 || num > 5) {
          throw new Error(`${name} must be an integer between 1 and 5`);
        }
        return num;
      }
      return null;
    };

    let parsedQuality: number | null = null;
    let parsedComm: number | null = null;
    let parsedTime: number | null = null;
    let parsedProf: number | null = null;

    try {
      parsedQuality = validateSubRating(qualityRating, "Quality rating");
      parsedComm = validateSubRating(communicationRating, "Communication rating");
      parsedTime = validateSubRating(timelinessRating, "Timeliness rating");
      parsedProf = validateSubRating(professionalismRating, "Professionalism rating");
    } catch (err: any) {
      return apiError(err.message, 400, "INVALID_RATING");
    }

    // Calculate composite client rating
    const allRatingDimensions = [parsedRating, parsedQuality, parsedComm, parsedTime, parsedProf].filter(
      (v): v is number => typeof v === "number" && v > 0
    );
    const clientRatingAvg = allRatingDimensions.reduce((a, b) => a + b, 0) / allRatingDimensions.length;

    // 7. Validate comment length
    if (!comment || typeof comment !== "string" || comment.trim().length < 5) {
      return apiError("Comment must be at least 5 characters long", 400, "INVALID_COMMENT");
    }

    if (comment.trim().length > 2000) {
      return apiError("Comment exceeds maximum length of 2000 characters", 400, "INVALID_COMMENT");
    }

    // 8. Validate verifiedSkills against actual ProjectSkill records
    const projectSkillsMap = new Map<string, { skillId: string; name: string }>();
    for (const ps of contract.project.skills) {
      if (ps.skill?.name) {
        projectSkillsMap.set(ps.skill.name.toLowerCase().trim(), {
          skillId: ps.skillId,
          name: ps.skill.name,
        });
      }
    }

    const validVerifiedSkillNames: string[] = [];
    const validSkillIdsToVerify: string[] = [];

    if (Array.isArray(verifiedSkills)) {
      for (const skillItem of verifiedSkills) {
        if (typeof skillItem === "string") {
          const match = projectSkillsMap.get(skillItem.toLowerCase().trim());
          if (match && !validVerifiedSkillNames.includes(match.name)) {
            validVerifiedSkillNames.push(match.name);
            validSkillIdsToVerify.push(match.skillId);
          }
        }
      }
    }

    // Atomic transaction: Create Review, Mark Contract COMPLETED, Update StudentSkills
    const { createdReview, updatedSkillsSummary } = await prisma.$transaction(async (tx) => {
      // 1. Create Review
      const rev = await tx.review.create({
        data: {
          workContractId: contract.id,
          projectId: contract.projectId,
          clientId: contract.clientId,
          studentId: contract.studentId,
          rating: parsedRating,
          qualityRating: parsedQuality,
          communicationRating: parsedComm,
          timelinessRating: parsedTime,
          professionalismRating: parsedProf,
          comment: comment.trim(),
          verifiedSkills: validVerifiedSkillNames,
        },
      });

      // 2. Mark WorkContract COMPLETED
      await tx.workContract.update({
        where: { id: contract.id },
        data: {
          status: WorkStatus.COMPLETED,
          progress: 100,
          lastActivity: `Completed & Reviewed by Client (${parsedRating}★)`,
        },
      });

      // 3. Mark Project COMPLETED
      await tx.project.update({
        where: { id: contract.projectId },
        data: { status: ProjectStatus.COMPLETED },
      });

      // 4. Update StudentSkills: calculate living score & verify
      const updatedSkillsList: Array<{
        skillName: string;
        oldScore: number;
        newScore: number;
        growth: number;
        level: string;
      }> = [];

      for (const skillId of validSkillIdsToVerify) {
        const existing = await tx.studentSkill.findUnique({
          where: {
            studentId_skillId: {
              studentId: contract.studentId,
              skillId,
            },
          },
          include: { skill: true },
        });

        const currentScore = existing?.score && existing.score > 0 ? existing.score : 72;
        const currentProjects = existing?.projectsCompletedCount ?? 0;
        const prof = existing?.proficiency || "INTERMEDIATE";

        const updateResult = calculateSkillUpdateOnReview({
          currentScore,
          currentProjectsCount: currentProjects,
          proficiency: prof,
          clientRatingAvg,
        });

        const skillName = existing?.skill?.name || projectSkillsMap.get(skillId)?.name || "Skill";

        await tx.studentSkill.upsert({
          where: {
            studentId_skillId: {
              studentId: contract.studentId,
              skillId,
            },
          },
          create: {
            studentId: contract.studentId,
            skillId,
            proficiency: "ADVANCED",
            isVerified: true,
            score: updateResult.score,
            verificationLevel: updateResult.verificationLevel,
            projectsCompletedCount: updateResult.projectsCompletedCount,
            recentGrowth: updateResult.recentGrowth,
          },
          update: {
            isVerified: true,
            score: updateResult.score,
            verificationLevel: updateResult.verificationLevel,
            projectsCompletedCount: updateResult.projectsCompletedCount,
            recentGrowth: updateResult.recentGrowth,
          },
        });

        updatedSkillsList.push({
          skillName,
          oldScore: currentScore,
          newScore: updateResult.score,
          growth: updateResult.recentGrowth,
          level: updateResult.verificationLevel,
        });
      }

      return { createdReview: rev, updatedSkillsSummary: updatedSkillsList };
    });

    return apiSuccess({
      review: createdReview,
      verifiedSkills: validVerifiedSkillNames,
      updatedSkills: updatedSkillsSummary,
      message: "Review submitted successfully and skills verified in Living Skill Passport.",
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return apiError(error.message, error.status, error.code);
    }
    console.error("POST /api/reviews error:", error);
    return apiError(error.message || "Failed to submit review", 500, "INTERNAL_ERROR");
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const contractId = searchParams.get("contractId");

    const where: any = {};

    if (studentId) {
      // Support studentProfile.id OR user.id
      where.OR = [
        { studentId },
        { student: { userId: studentId } },
      ];
    } else if (contractId) {
      where.workContractId = contractId;
    } else {
      // Default: require at least studentId or contractId
      return apiError("studentId or contractId query parameter is required", 400, "BAD_REQUEST");
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
        project: {
          select: {
            id: true,
            title: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const sanitized = reviews.map((r) => ({
      id: r.id,
      workContractId: r.workContractId,
      projectId: r.projectId,
      projectTitle: r.project?.title || "Project",
      clientName: r.client?.companyName || r.client?.user?.name || "Client",
      client: {
        companyName: r.client?.companyName || r.client?.user?.name || "Client",
      },
      rating: r.rating,
      qualityRating: r.qualityRating,
      communicationRating: r.communicationRating,
      timelinessRating: r.timelinessRating,
      professionalismRating: r.professionalismRating,
      comment: r.comment,
      verifiedSkills: r.verifiedSkills,
      createdAt: r.createdAt.toISOString(),
    }));

    return apiSuccess(sanitized);
  } catch (error: any) {
    console.error("GET /api/reviews error:", error);
    return apiError("Failed to fetch reviews", 500, "INTERNAL_ERROR");
  }
}
