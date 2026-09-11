import { LivingSkillPassportData, StudentSkillItem, SkillVerificationLevel } from "@/types";

export interface SkillPassportInput {
  skills: Array<{
    id: string;
    name?: string;
    proficiency?: string;
    isVerified?: boolean;
    score?: number;
    verificationLevel?: string;
    projectsCompletedCount?: number;
    recentGrowth?: number;
    skill?: { id: string; name: string };
  }>;
  workContracts?: Array<{
    id: string;
    status: string;
    progress?: number;
  }>;
  reviews?: Array<{
    rating: number;
    qualityRating?: number | null;
    communicationRating?: number | null;
    timelinessRating?: number | null;
    professionalismRating?: number | null;
    verifiedSkills?: string[];
  }>;
  portfolio?: Array<any>;
}

/**
 * Calculates Living Skill Passport metrics using the transparent formula:
 * - 40% Project Performance (Work contract milestones & successful completion)
 * - 30% Client Rating (4-dimension rating: Quality, Communication, Timeliness, Professionalism)
 * - 20% Skill Assessment (Technical proficiency levels)
 * - 10% Portfolio & Real Deliverables Evidence
 */
export function computeSkillPassport(input: SkillPassportInput): LivingSkillPassportData {
  const { skills = [], workContracts = [], reviews = [], portfolio = [] } = input;

  // 1. Project Performance (40%)
  let projectPerformance = 85;
  const completedContracts = workContracts.filter((c) => c.status === "COMPLETED");
  if (workContracts.length > 0) {
    const totalScore = workContracts.reduce((sum, c) => {
      if (c.status === "COMPLETED") return sum + 100;
      if (c.status === "IN_PROGRESS") return sum + Math.max(60, Math.min(95, c.progress || 75));
      return sum + 70;
    }, 0);
    projectPerformance = Math.round(totalScore / workContracts.length);
  }

  // 2. Client Rating (30%)
  let clientRatingScore = 88;
  let avgRawRating = 4.8;
  if (reviews.length > 0) {
    let ratingSum = 0;
    let validReviews = 0;
    for (const r of reviews) {
      const dimensions = [
        r.rating,
        r.qualityRating,
        r.communicationRating,
        r.timelinessRating,
        r.professionalismRating,
      ].filter((d): d is number => typeof d === "number" && d > 0);

      if (dimensions.length > 0) {
        const itemAvg = dimensions.reduce((a, b) => a + b, 0) / dimensions.length;
        ratingSum += itemAvg;
        validReviews++;
      }
    }
    if (validReviews > 0) {
      avgRawRating = ratingSum / validReviews;
      clientRatingScore = Math.round((avgRawRating / 5) * 100);
    }
  }

  // 3. Skill Assessment (20%)
  let skillAssessmentScore = 82;
  if (skills.length > 0) {
    const profSum = skills.reduce((sum, s) => {
      const prof = (s.proficiency || "INTERMEDIATE").toUpperCase();
      if (prof === "ADVANCED" || prof === "EXPERT") return sum + 95;
      if (prof === "INTERMEDIATE") return sum + 85;
      return sum + 70;
    }, 0);
    skillAssessmentScore = Math.round(profSum / skills.length);
  }

  // 4. Portfolio / Evidence Factor (10%)
  const completedCount = completedContracts.length;
  const portfolioCount = portfolio.length;
  const evidenceScore = Math.min(
    100,
    Math.max(50, completedCount * 25 + portfolioCount * 15 + reviews.length * 10)
  );

  // Transparent Weighted Composite Score
  const overallScore = Math.round(
    projectPerformance * 0.40 +
    clientRatingScore * 0.30 +
    skillAssessmentScore * 0.20 +
    evidenceScore * 0.10
  );

  // Map individual skill cards
  const sanitizedSkills: StudentSkillItem[] = skills.map((s) => {
    const skillName = s.skill?.name || s.name || "Skill";
    const prof = s.proficiency || "INTERMEDIATE";
    const isVerified = Boolean(s.isVerified);
    const projectsCompletedCount = s.projectsCompletedCount ?? (isVerified ? 1 : 0);
    const score = s.score && s.score > 0 ? s.score : isVerified ? 88 : 72;

    let verificationLevel: SkillVerificationLevel = "Self-Reported";
    if (s.verificationLevel === "Mastery" || (projectsCompletedCount >= 2 && score >= 90)) {
      verificationLevel = "Mastery";
    } else if (isVerified || s.verificationLevel === "Project Verified" || projectsCompletedCount >= 1) {
      verificationLevel = "Project Verified";
    }

    return {
      id: s.id,
      name: skillName,
      proficiency: prof,
      isVerified,
      score: Math.min(100, Math.max(0, score)),
      verificationLevel,
      projectsCompletedCount,
      recentGrowth: s.recentGrowth ?? (isVerified ? 8 : 0),
    };
  });

  const verifiedSkillsCount = sanitizedSkills.filter(
    (s) => s.isVerified || s.verificationLevel !== "Self-Reported"
  ).length;

  return {
    overallScore: Math.min(100, Math.max(0, overallScore)),
    verifiedSkillsCount,
    totalSkillsCount: sanitizedSkills.length,
    projectsCompleted: completedCount,
    averageRating: Number(avgRawRating.toFixed(1)),
    skills: sanitizedSkills,
    scoreBreakdown: {
      projectPerformance,
      clientRating: clientRatingScore,
      skillAssessment: skillAssessmentScore,
      evidenceFactor: evidenceScore,
    },
  };
}

/**
 * Calculates updated skill attributes after a verified client review.
 */
export function calculateSkillUpdateOnReview(params: {
  currentScore: number;
  currentProjectsCount: number;
  proficiency: string;
  clientRatingAvg: number; // 1-5
}) {
  const { currentScore, currentProjectsCount, proficiency, clientRatingAvg } = params;
  const newProjectsCount = currentProjectsCount + 1;

  // Base score from proficiency
  const baseProf = proficiency.toUpperCase();
  const baseScore = baseProf === "ADVANCED" || baseProf === "EXPERT" ? 85 : baseProf === "INTERMEDIATE" ? 78 : 70;

  // Bonus for client rating (5.0 rating gives up to +12 points)
  const ratingBonus = Math.round((clientRatingAvg / 5) * 12);

  // Bonus for completed projects (+4 per verified project up to +12)
  const projectBonus = Math.min(12, newProjectsCount * 4);

  const calculatedNewScore = Math.min(100, Math.max(75, baseScore + ratingBonus + projectBonus));
  const recentGrowth = Math.max(1, calculatedNewScore - (currentScore > 0 ? currentScore : 70));

  let verificationLevel: SkillVerificationLevel = "Project Verified";
  if (newProjectsCount >= 2 && calculatedNewScore >= 90) {
    verificationLevel = "Mastery";
  }

  return {
    score: calculatedNewScore,
    projectsCompletedCount: newProjectsCount,
    recentGrowth,
    verificationLevel,
    isVerified: true,
  };
}
