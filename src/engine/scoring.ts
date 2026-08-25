import {
  Candidate,
  ProjectBlueprint,
  ScoreBreakdown,
  TeamGap,
  GapStatus,
  CandidateImpactResult,
  SkillLevel,
  AvailabilityStatus,
  PriorityLevel,
  GapCoveredBy,
} from '../types';
import { getDomainsForSkill, normalizeKey } from './taxonomy';

// Skill strength weights defined in specs
export const SKILL_STRENGTH: Record<SkillLevel, number> = {
  Beginner: 0.40,
  Intermediate: 0.70,
  Expert: 0.95,
};

// Skill level score values for experience calculation
export const SKILL_EXP_VALUES: Record<SkillLevel, number> = {
  Beginner: 40,
  Intermediate: 70,
  Expert: 95,
};

// Priority weights defined in specs
export const PRIORITY_WEIGHTS: Record<PriorityLevel, number> = {
  Critical: 1.0,
  Important: 0.7,
  Optional: 0.4,
};

// Availability scores defined in specs
export const AVAILABILITY_SCORES: Record<AvailabilityStatus, number> = {
  'Full': 100,
  'Partial': 75,
  'Mostly available': 75,
  'Limited': 40,
  'Unavailable': 0,
};

/**
 * Clamps numerical score between 0 and 100, safely handling NaN / Infinity.
 */
export function clampScore(value: number): number {
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round(value * 10) / 10));
}

/**
 * STRICT DOMAIN RULE:
 * candidate.domains is the ONLY authoritative source for determining whether a candidate
 * covers or closes a required capability/domain.
 * Do NOT infer domains from skill names (e.g. Python != Backend, SQL alone != Backend for Data specialist).
 */
export function getCandidateCapabilityCoverage(
  candidate: Candidate,
  capability: string
): { strength: number; isExact: boolean; skillName: string } {
  const normCap = normalizeKey(capability);
  const candidateDomains = (candidate.domains || []).map(normalizeKey);

  // If candidate does NOT explicitly possess this domain tag in candidate.domains,
  // coverage is strictly 0.
  if (!candidateDomains.includes(normCap)) {
    return {
      strength: 0,
      isExact: false,
      skillName: '',
    };
  }

  // Candidate explicitly possesses this domain; now determine strength from matching skills
  let bestStrength = 0;
  let isExact = false;
  let bestSkillName = '';

  for (const skill of candidate.skills) {
    const normSkill = normalizeKey(skill.name);
    const skillStrength = SKILL_STRENGTH[skill.level] || 0.40;
    const mappedDomains = getDomainsForSkill(skill.name, candidate.domains).map(normalizeKey);

    // Skill directly matches capability or maps to this capability under the candidate's explicit domains
    if (normSkill === normCap || mappedDomains.includes(normCap)) {
      const matchScore = 1.00 * skillStrength;
      if (matchScore > bestStrength) {
        bestStrength = matchScore;
        isExact = true;
        bestSkillName = skill.name;
      }
    }
  }

  // If candidate has the explicit domain tag but no specifically named skill, award baseline intermediate strength
  if (bestStrength === 0) {
    bestStrength = 0.70;
    isExact = false;
    bestSkillName = `${candidate.role} (${capability})`;
  }

  return {
    strength: Math.min(1.0, bestStrength),
    isExact,
    skillName: bestSkillName,
  };
}

/**
 * Deterministic helper for determining which required capabilities a candidate closes.
 * Conceptually: getClosedGaps(candidate, projectRequirements, currentTeam)
 * Evaluates current missing/partial gaps and checks which ones the candidate closes.
 */
export function getClosedGaps(
  candidate: Candidate,
  project: ProjectBlueprint,
  currentTeam: Candidate[]
): string[] {
  const currentGaps = identifyTeamGaps(project, currentTeam);
  const candidateDomains = (candidate.domains || []).map(normalizeKey);
  const closed: string[] = [];

  for (const gap of currentGaps) {
    if (gap.status === 'MISSING' || gap.status === 'PARTIALLY COVERED') {
      const normCap = normalizeKey(gap.capability);
      if (candidateDomains.includes(normCap)) {
        const coverage = getCandidateCapabilityCoverage(candidate, gap.capability);
        if (coverage.strength >= 0.50) {
          closed.push(gap.capability);
        }
      }
    }
  }

  return closed;
}

/**
 * Calculate Requirement Fulfillment (40% of Final Team Score)
 * RequirementFulfillment = SUM(bestCoverage * priorityWeight) / SUM(priorityWeight) * 100
 */
export function calculateRequirementFulfillment(
  project: ProjectBlueprint,
  team: Candidate[]
): number {
  if (!project.requiredCapabilities || project.requiredCapabilities.length === 0) {
    return 100;
  }
  if (!team || team.length === 0) {
    return 0;
  }

  let totalWeightedCoverage = 0;
  let totalWeight = 0;

  for (const capability of project.requiredCapabilities) {
    // Find priority for this capability
    const priorityObj = (project.priorities || []).find(
      (p) => normalizeKey(p.capability) === normalizeKey(capability)
    );
    const priority = priorityObj ? priorityObj.priority : 'Critical';
    const weight = PRIORITY_WEIGHTS[priority] || 1.0;

    // Find best coverage in team
    let bestCoverage = 0;
    for (const member of team) {
      const cov = getCandidateCapabilityCoverage(member, capability);
      if (cov.strength > bestCoverage) {
        bestCoverage = cov.strength;
      }
    }

    totalWeightedCoverage += bestCoverage * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 100;
  return clampScore((totalWeightedCoverage / totalWeight) * 100);
}

/**
 * Calculate Complementarity (25% of Final Team Score)
 * Measures useful domain diversity versus redundancy.
 * uniqueUsefulDomainStrength / totalUsefulDomainStrength * 100
 */
export function calculateComplementarity(team: Candidate[]): number {
  if (!team || team.length === 0) {
    return 0;
  }

  // Determine all domains contributed by team members
  // For each member, calculate strongest contribution to each domain
  const memberDomainContributions: Array<Map<string, number>> = [];
  const allUniqueDomains = new Set<string>();

  for (const member of team) {
    const domainMap = new Map<string, number>();

    // From skills
    for (const skill of member.skills) {
      const strength = SKILL_STRENGTH[skill.level] || 0.40;
      const domains = getDomainsForSkill(skill.name, member.domains);
      for (const d of domains) {
        allUniqueDomains.add(d);
        const current = domainMap.get(d) || 0;
        if (strength > current) {
          domainMap.set(d, strength);
        }
      }
    }

    // Also include explicit domains
    for (const d of member.domains || []) {
      allUniqueDomains.add(d);
      if (!domainMap.has(d)) {
        domainMap.set(d, 0.70); // baseline intermediate contribution
      }
    }

    memberDomainContributions.push(domainMap);
  }

  let totalUsefulDomainStrength = 0;
  for (const domainMap of memberDomainContributions) {
    for (const strength of domainMap.values()) {
      totalUsefulDomainStrength += strength;
    }
  }

  if (totalUsefulDomainStrength === 0) {
    return 0;
  }

  // Calculate sum of strongest contribution for every unique domain
  let uniqueUsefulDomainStrength = 0;
  for (const domain of allUniqueDomains) {
    let maxDomainStrength = 0;
    for (const domainMap of memberDomainContributions) {
      const s = domainMap.get(domain) || 0;
      if (s > maxDomainStrength) {
        maxDomainStrength = s;
      }
    }
    uniqueUsefulDomainStrength += maxDomainStrength;
  }

  const compValue = (uniqueUsefulDomainStrength / totalUsefulDomainStrength) * 100;
  return clampScore(Math.min(100, compValue));
}

/**
 * Calculate Availability (15% of Final Team Score)
 * Team average of availability values.
 */
export function calculateAvailability(team: Candidate[]): number {
  if (!team || team.length === 0) {
    return 0;
  }

  let total = 0;
  for (const member of team) {
    total += AVAILABILITY_SCORES[member.availability] ?? 75;
  }

  return clampScore(total / team.length);
}

/**
 * Calculate Interest Alignment (10% of Final Team Score)
 * Proportion of team members sharing project interests.
 */
export function calculateInterestAlignment(
  project: ProjectBlueprint,
  team: Candidate[]
): number {
  if (!project.interests || project.interests.length === 0) {
    return 50;
  }
  if (!team || team.length === 0) {
    return 0;
  }

  let interestScoreSum = 0;

  for (const pInterest of project.interests) {
    const normPInterest = normalizeKey(pInterest);
    let matchedMembers = 0;

    for (const member of team) {
      const hasInterest = (member.interests || []).some((mInt) => {
        const normMInt = normalizeKey(mInt);
        return (
          normMInt === normPInterest ||
          normMInt.includes(normPInterest) ||
          normPInterest.includes(normMInt)
        );
      });

      if (hasInterest) {
        matchedMembers++;
      }
    }

    const ratio = matchedMembers / team.length;
    interestScoreSum += ratio;
  }

  const avgRatio = interestScoreSum / project.interests.length;
  return clampScore(avgRatio * 100);
}

/**
 * Calculate Experience (10% of Final Team Score)
 * Relevant skills & domains evaluated with bounded years modifier.
 */
export function calculateExperience(
  project: ProjectBlueprint,
  team: Candidate[]
): number {
  if (!team || team.length === 0) {
    return 0;
  }

  const projectDomains = (project.requiredCapabilities || []).map(normalizeKey);
  const projectInterests = (project.interests || []).map(normalizeKey);

  let totalMemberExp = 0;

  for (const member of team) {
    // Find relevant skills
    const relevantSkills = member.skills.filter((skill) => {
      const skillName = normalizeKey(skill.name);
      const mapped = getDomainsForSkill(skill.name, member.domains).map(normalizeKey);
      return (
        projectDomains.some((d) => mapped.includes(d) || skillName.includes(d)) ||
        projectInterests.some((i) => skillName.includes(i))
      );
    });

    if (relevantSkills.length === 0) {
      // If no specifically mapped skills, check general skill level
      const avgGeneral =
        member.skills.reduce((acc, s) => acc + (SKILL_EXP_VALUES[s.level] || 50), 0) /
        (member.skills.length || 1);
      totalMemberExp += Math.max(30, avgGeneral * 0.6);
      continue;
    }

    const avgSkillVal =
      relevantSkills.reduce((acc, s) => acc + (SKILL_EXP_VALUES[s.level] || 50), 0) /
      relevantSkills.length;
    const avgYears =
      relevantSkills.reduce((acc, s) => acc + (s.years || 1), 0) / relevantSkills.length;

    // Years modifier capped between 0 and 10 points
    const yearsModifier = Math.min(10, avgYears * 2);
    const memberExp = Math.min(100, avgSkillVal + yearsModifier);
    totalMemberExp += memberExp;
  }

  return clampScore(totalMemberExp / team.length);
}

/**
 * Calculate Final Team Score & Breakdown
 * TeamScore = 0.40 * ReqFulfillment + 0.25 * Complementarity + 0.15 * Availability + 0.10 * Interest + 0.10 * Experience
 */
export function calculateTeamScore(
  project: ProjectBlueprint,
  team: Candidate[]
): ScoreBreakdown {
  const reqFulfillment = calculateRequirementFulfillment(project, team);
  const comp = calculateComplementarity(team);
  const avail = calculateAvailability(team);
  const interest = calculateInterestAlignment(project, team);
  const exp = calculateExperience(project, team);

  const total =
    0.40 * reqFulfillment +
    0.25 * comp +
    0.15 * avail +
    0.10 * interest +
    0.10 * exp;

  return {
    requirementFulfillment: clampScore(reqFulfillment),
    complementarity: clampScore(comp),
    availability: clampScore(avail),
    interestAlignment: clampScore(interest),
    experience: clampScore(exp),
    totalScore: clampScore(total),
  };
}

/**
 * Identify Team Gaps based on Project Requirements and Current Team
 */
export function identifyTeamGaps(
  project: ProjectBlueprint,
  team: Candidate[]
): TeamGap[] {
  if (!project.requiredCapabilities || project.requiredCapabilities.length === 0) {
    return [];
  }

  const gaps: TeamGap[] = [];

  for (const capability of project.requiredCapabilities) {
    const priorityObj = (project.priorities || []).find(
      (p) => normalizeKey(p.capability) === normalizeKey(capability)
    );
    const priority = priorityObj ? priorityObj.priority : 'Critical';

    let bestCoverage = 0;
    const coveredByList: GapCoveredBy[] = [];

    for (const member of team) {
      const cov = getCandidateCapabilityCoverage(member, capability);
      if (cov.strength > 0) {
        coveredByList.push({
          memberName: member.name,
          skillName: cov.skillName,
          strength: cov.strength,
          isExact: cov.isExact,
        });
      }
      if (cov.strength > bestCoverage) {
        bestCoverage = cov.strength;
      }
    }

    let status: GapStatus = 'MISSING';
    if (bestCoverage >= 0.70) {
      status = 'STRONGLY COVERED';
    } else if (bestCoverage > 0) {
      status = 'PARTIALLY COVERED';
    } else {
      status = 'MISSING';
    }

    gaps.push({
      capability,
      status,
      coverage: Math.round(bestCoverage * 100) / 100,
      priority,
      coveredBy: coveredByList,
    });
  }

  // Prioritize: Critical first, then Important, then Optional
  const priorityOrder: Record<PriorityLevel, number> = {
    Critical: 1,
    Important: 2,
    Optional: 3,
  };

  return gaps.sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    // Secondary: missing first
    const statusOrder: Record<GapStatus, number> = {
      'MISSING': 1,
      'PARTIALLY COVERED': 2,
      'STRONGLY COVERED': 3,
    };
    return statusOrder[a.status] - statusOrder[b.status];
  });
}

/**
 * Calculate Team Impact for a candidate joining the current team (Immutable simulation)
 */
export function calculateTeamImpact(
  project: ProjectBlueprint,
  currentTeam: Candidate[],
  candidate: Candidate
): CandidateImpactResult {
  const currentBreakdown = calculateTeamScore(project, currentTeam);
  const currentGaps = identifyTeamGaps(project, currentTeam);

  // IMMUTABLE SIMULATION
  const simulatedTeam = [...currentTeam, candidate];
  const newBreakdown = calculateTeamScore(project, simulatedTeam);
  const newGaps = identifyTeamGaps(project, simulatedTeam);

  // Calculate gaps closed deterministically from authoritative candidate.domains
  const gapsClosed = getClosedGaps(candidate, project, currentTeam);

  const teamImpact = Math.round((newBreakdown.totalScore - currentBreakdown.totalScore) * 10) / 10;

  // Generate key highlight description
  let keyHighlight = '';
  if (gapsClosed.length > 0) {
    keyHighlight = `Closes ${gapsClosed.join(' + ')}.`;
  } else if (teamImpact > 0) {
    keyHighlight = `Improves team availability and experience depth.`;
  } else if (teamImpact < 0) {
    keyHighlight = `Does not close current gaps; creates domain redundancy.`;
  } else {
    keyHighlight = `Does not close current gaps.`;
  }

  return {
    candidate,
    currentScore: currentBreakdown.totalScore,
    newScore: newBreakdown.totalScore,
    teamImpact,
    currentBreakdown,
    newBreakdown,
    gapsClosed,
    currentGaps,
    newGaps,
    keyHighlight,
  };
}

/**
 * Calculate impacts for all candidates and rank by Team Impact descending
 */
export function calculateCandidateImpacts(
  project: ProjectBlueprint,
  currentTeam: Candidate[],
  candidates: Candidate[]
): CandidateImpactResult[] {
  const results = candidates.map((candidate) =>
    calculateTeamImpact(project, currentTeam, candidate)
  );

  // Primary ranking: TeamImpact descending
  return results.sort((a, b) => b.teamImpact - a.teamImpact);
}
