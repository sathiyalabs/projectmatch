import React, { useEffect, useState, useRef } from 'react';
import {
  Candidate,
  CandidateImpactResult,
  ProjectBlueprint,
  TeamGap,
  ScoreBreakdown,
} from '../types';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Zap,
  Users,
  ShieldCheck,
  Flame,
  Check,
} from 'lucide-react';

interface TeamTransformationHeroProps {
  blueprint: ProjectBlueprint;
  currentTeam: Candidate[];
  teamScore: ScoreBreakdown;
  teamGaps: TeamGap[];
  candidateImpacts: CandidateImpactResult[];
  activeSimulatedResult: CandidateImpactResult | null;
  onSimulateCandidate: (candidate: Candidate) => void;
  onClearSimulation: () => void;
  onAddCandidate: (candidate: Candidate) => void;
  onOpenScoreDetails: () => void;
}

export const TeamTransformationHero: React.FC<TeamTransformationHeroProps> = ({
  blueprint,
  currentTeam,
  teamScore,
  teamGaps,
  candidateImpacts,
  activeSimulatedResult,
  onSimulateCandidate,
  onClearSimulation,
  onAddCandidate,
  onOpenScoreDetails,
}) => {
  // If no simulation is active, default to displaying the top recommended candidate as preview
  const topCandidateImpact = candidateImpacts.length > 0 ? candidateImpacts[0] : null;
  const displayedImpact = activeSimulatedResult || topCandidateImpact;

  const isSimulated = !!activeSimulatedResult;
  const isPositive = displayedImpact ? displayedImpact.teamImpact > 0 : false;
  const isNegative = displayedImpact ? displayedImpact.teamImpact < 0 : false;

  // Real-time smooth score interpolation
  const [interpolatedScore, setInterpolatedScore] = useState<number>(
    displayedImpact ? displayedImpact.newScore : teamScore.totalScore
  );
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const target = displayedImpact ? displayedImpact.newScore : teamScore.totalScore;
    const start = interpolatedScore;
    const startTime = performance.now();
    const duration = 500; // 500ms smooth transition

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * easeOut;
      setInterpolatedScore(Math.round(current * 10) / 10);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [displayedImpact?.newScore, teamScore.totalScore]);

  const missingGaps = teamGaps.filter((g) => g.status === 'MISSING');

  // Rahul vs Karthik helper for explicit reasoning narrative
  const getExplanation = () => {
    if (!displayedImpact) return 'Select a candidate to simulate team impact';
    const cName = displayedImpact.candidate.name;
    const isRahul = displayedImpact.candidate.id === 'cand-rahul';
    const isKarthik = displayedImpact.candidate.id === 'cand-karthik';

    if (isKarthik) {
      return 'Closes critical Backend + Cloud requirement gaps (+18.0 fit).';
    }
    if (isRahul) {
      return 'Strong individual candidate. Does not close current gaps (ML already covered by Arjun).';
    }
    if (displayedImpact.gapsClosed.length > 0) {
      return `Closes ${displayedImpact.gapsClosed.join(' + ')}.`;
    }
    if (displayedImpact.teamImpact < 0) {
      return 'Does not close current gaps; creates domain redundancy.';
    }
    return displayedImpact.keyHighlight;
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111115] p-4 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-300">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />

      {/* Top Banner & Quick Candidate Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-indigo-400 font-mono">
              TEAM TRANSFORMATION PIPELINE
            </div>
            <div className="text-xs text-gray-300 font-medium">
              {isSimulated ? (
                <span>
                  Simulating impact of{' '}
                  <strong className="text-white font-semibold">{displayedImpact?.candidate.name}</strong> on current roster
                </span>
              ) : (
                <span>
                  Project:{' '}
                  <strong className="text-white font-semibold">{blueprint.title}</strong> — Optimizing whole-team fit
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Simulation Candidates Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
          <span className="text-[10px] font-bold text-gray-400 font-mono uppercase mr-1 hidden sm:inline">
            Quick Compare:
          </span>
          {candidateImpacts.slice(0, 5).map((item) => {
            const isSelected = activeSimulatedResult?.candidate.id === item.candidate.id;
            return (
              <button
                key={item.candidate.id}
                onClick={() => onSimulateCandidate(item.candidate)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono font-bold transition-all cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50 ring-2 ring-indigo-400/50'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 hover:text-white'
                }`}
              >
                <span>{item.candidate.name}</span>
                <span
                  className={`text-[10px] ${
                    item.teamImpact > 0
                      ? 'text-emerald-400'
                      : item.teamImpact < 0
                      ? 'text-rose-400'
                      : 'text-gray-400'
                  }`}
                >
                  {item.teamImpact > 0 ? `+${item.teamImpact.toFixed(1)}` : item.teamImpact.toFixed(1)}
                </span>
              </button>
            );
          })}

          {isSimulated && (
            <button
              onClick={onClearSimulation}
              title="Clear Active Simulation"
              className="flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-[11px] font-mono font-semibold text-gray-400 hover:bg-white/10 hover:text-white border border-white/10 transition cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* The 4-Stage Transformation Visual Pipeline */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4 lg:gap-3 items-stretch">
        
        {/* Stage 1: CURRENT TEAM */}
        <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition duration-300">
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-2.5">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-indigo-400" />
                <span>1. CURRENT TEAM</span>
              </span>
              <span className="text-gray-400">{currentTeam.length}/{blueprint.teamSize}</span>
            </div>

            <div className="space-y-2">
              {currentTeam.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-2.5 py-1.5 border border-white/5"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-600/30 text-indigo-300 text-[10px] font-bold font-mono">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate">{member.name}</div>
                      <div className="text-[10px] text-gray-400 truncate">{member.role}</div>
                    </div>
                  </div>
                  <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-300 font-mono shrink-0">
                    {member.domains[0]}
                  </span>
                </div>
              ))}

              {currentTeam.length === 0 && (
                <div className="py-4 text-center text-xs text-gray-400">Team is empty</div>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span>Baseline Fit:</span>
            <span className="font-bold text-white">{teamScore.totalScore.toFixed(1)}/100</span>
          </div>
        </div>

        {/* Stage 2: TEAM GAPS */}
        <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition duration-300">
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-2.5">
              <span className="flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-rose-400" />
                <span>2. TEAM GAPS</span>
              </span>
              <span className="text-rose-400 font-bold">{missingGaps.length} Missing</span>
            </div>

            <div className="space-y-2">
              {missingGaps.map((gap) => {
                const isClosedInSim =
                  isSimulated &&
                  (activeSimulatedResult?.gapsClosed.some(
                    (gc) => gc.toLowerCase() === gap.capability.toLowerCase()
                  ) || false);

                return (
                  <div
                    key={gap.capability}
                    className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 border transition-all duration-300 ${
                      isClosedInSim
                        ? 'border-emerald-500/50 bg-emerald-950/40 shadow-sm shadow-emerald-950/50'
                        : 'border-rose-500/30 bg-rose-950/20'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white capitalize">{gap.capability}</div>
                      <div className="text-[9px] font-mono text-gray-400 uppercase">{gap.priority}</div>
                    </div>
                    {isClosedInSim ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 font-mono bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/40 animate-pulse">
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span>COVERED</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-400 font-mono bg-rose-500/20 px-1.5 py-0.5 rounded border border-rose-500/30">
                        MISSING
                      </span>
                    )}
                  </div>
                );
              })}

              {missingGaps.length === 0 && (
                <div className="py-4 text-center text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 mx-auto mb-1" />
                  All capabilities covered!
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-white/5 text-[11px] font-mono text-gray-400">
            <span>Critical bottlenecks</span>
          </div>
        </div>

        {/* Stage 3: CANDIDATE SIMULATION NODE */}
        <div
          className={`flex flex-col justify-between rounded-xl border p-4 transition-all duration-300 ${
            isSimulated
              ? 'border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-500/40'
              : 'border-white/10 bg-white/[0.02]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-2.5">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span>{isSimulated ? '3. SIMULATED CANDIDATE' : '3. CANDIDATE PREVIEW'}</span>
              </span>
              {isSimulated ? (
                <span className="rounded bg-indigo-500/30 px-1.5 py-0.5 text-[9px] font-bold text-indigo-300 font-mono animate-pulse">
                  SIMULATING
                </span>
              ) : (
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-gray-300 font-mono">
                  PREVIEW
                </span>
              )}
            </div>

            {displayedImpact ? (
              <div className="space-y-2">
                <div className="rounded-lg bg-white/5 p-2.5 border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-white">{displayedImpact.candidate.name}</span>
                    <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-bold text-indigo-300 font-mono">
                      {displayedImpact.candidate.role}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-gray-300 font-mono">
                    Domains: <strong className="text-white">{displayedImpact.candidate.domains.join(' + ')}</strong>
                  </div>
                </div>

                {/* Gap Resolution Outcome */}
                {displayedImpact.gapsClosed.length > 0 ? (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 bg-emerald-500/15 p-2 rounded-lg border border-emerald-500/30">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Closes: {displayedImpact.gapsClosed.join(' + ')}</span>
                  </div>
                ) : displayedImpact.candidate.id === 'cand-rahul' ? (
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-rose-300 bg-rose-500/15 p-2 rounded-lg border border-rose-500/30">
                    <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                    <span>Redundant: ML already covered by Arjun</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 bg-white/5 p-2 rounded-lg border border-white/10">
                    <span>Does not close current gaps</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-gray-400">No candidate selected</div>
            )}
          </div>

          {/* Action to Add directly */}
          <div className="mt-3 pt-2 border-t border-white/5">
            {displayedImpact && (
              currentTeam.length >= blueprint.teamSize ? (
                <button
                  id="hero-add-to-team-btn"
                  disabled
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-bold text-gray-400 cursor-not-allowed opacity-75"
                  title={`Target roster full (${currentTeam.length}/${blueprint.teamSize})`}
                >
                  <Users className="h-3 w-3 text-gray-500" />
                  <span>Roster Full ({currentTeam.length}/{blueprint.teamSize})</span>
                </button>
              ) : (
                <button
                  id="hero-add-to-team-btn"
                  onClick={() => onAddCandidate(displayedImpact.candidate)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition cursor-pointer active:scale-95"
                >
                  <span>Add {displayedImpact.candidate.name.split(' ')[0]} to Roster</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              )
            )}
          </div>
        </div>

        {/* Stage 4: TEAM IMPACT */}
        <div
          className={`flex flex-col justify-between rounded-xl border p-4 transition-all duration-300 ${
            isPositive
              ? 'border-emerald-500/40 bg-gradient-to-b from-[#141b18] to-[#0f1412] shadow-lg shadow-emerald-950/30'
              : isNegative
              ? 'border-rose-500/40 bg-gradient-to-b from-[#1b1414] to-[#140f0f] shadow-lg shadow-rose-950/30'
              : 'border-white/10 bg-white/[0.02]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-2">
              <span className="flex items-center gap-1">
                <TrendingUp className={`h-3.5 w-3.5 ${isPositive ? 'text-emerald-400' : 'text-gray-400'}`} />
                <span>4. TEAM IMPACT</span>
              </span>
              <button
                onClick={onOpenScoreDetails}
                className="text-gray-400 hover:text-white underline cursor-pointer text-[10px] font-mono"
              >
                Formula
              </button>
            </div>

            {displayedImpact ? (
              <div className="text-center py-2">
                {/* Large Team Impact Delta Badge */}
                <div
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-base font-black font-mono shadow-lg ${
                    isPositive
                      ? 'bg-emerald-600 text-white shadow-emerald-950/50 ring-1 ring-emerald-400/40'
                      : isNegative
                      ? 'bg-rose-600 text-white shadow-rose-950/50 ring-1 ring-rose-400/40'
                      : 'bg-white/10 text-gray-300'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : isNegative ? (
                    <TrendingDown className="h-4 w-4" />
                  ) : null}
                  <span>
                    {isPositive ? `+${displayedImpact.teamImpact.toFixed(1)}` : displayedImpact.teamImpact.toFixed(1)}
                  </span>
                </div>

                {/* Score Progression Strip with Interpolated Live Value */}
                <div className="mt-2 text-xs font-mono font-bold text-gray-300 flex items-center justify-center gap-1.5">
                  <span>{displayedImpact.currentScore.toFixed(1)}</span>
                  <span className="text-gray-500">→</span>
                  <span className={`text-sm ${isPositive ? 'text-emerald-400 font-black' : 'text-rose-400 font-black'}`}>
                    {interpolatedScore.toFixed(1)}
                  </span>
                  <span className="text-gray-500">/ 100</span>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-gray-400">Score unchanged</div>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-white/5 text-[11px] font-medium text-center">
            <span className={isPositive ? 'text-emerald-300' : isNegative ? 'text-rose-300' : 'text-gray-400'}>
              {getExplanation()}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
