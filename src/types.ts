export type SkillLevel = 'Beginner' | 'Intermediate' | 'Expert';

export type AvailabilityStatus = 'Full' | 'Partial' | 'Mostly available' | 'Limited' | 'Unavailable';

export type PriorityLevel = 'Critical' | 'Important' | 'Optional';

export interface Skill {
  name: string;
  level: SkillLevel;
  years: number;
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  skills: Skill[];
  domains: string[];
  interests: string[];
  availability: AvailabilityStatus;
  bio: string;
  linkedinUrl?: string;
}

export interface PriorityItem {
  capability: string;
  priority: PriorityLevel;
}

export interface ProjectBlueprint {
  id: string;
  title: string;
  projectType: string;
  goal: string;
  targetUsers: string;
  timeline: string;
  teamSize: number;
  requiredRoles: string[];
  requiredCapabilities: string[];
  priorities: PriorityItem[];
  interests: string[];
  constraints: string[];
}

export type GapStatus = 'MISSING' | 'PARTIALLY COVERED' | 'STRONGLY COVERED';

export interface GapCoveredBy {
  memberName: string;
  skillName: string;
  strength: number;
  isExact: boolean;
}

export interface TeamGap {
  capability: string;
  status: GapStatus;
  coverage: number; // 0.0 to 1.0
  priority: PriorityLevel;
  coveredBy: GapCoveredBy[];
}

export interface ScoreBreakdown {
  requirementFulfillment: number; // 0 - 100
  complementarity: number;        // 0 - 100
  availability: number;           // 0 - 100
  interestAlignment: number;      // 0 - 100
  experience: number;             // 0 - 100
  totalScore: number;             // 0 - 100
}

export interface CandidateImpactResult {
  candidate: Candidate;
  currentScore: number;
  newScore: number;
  teamImpact: number;
  currentBreakdown: ScoreBreakdown;
  newBreakdown: ScoreBreakdown;
  gapsClosed: string[];
  currentGaps: TeamGap[];
  newGaps: TeamGap[];
  keyHighlight: string;
}
