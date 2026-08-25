import React, { useEffect, useState, useRef } from 'react';
import { Candidate, CandidateImpactResult, ScoreBreakdown } from '../../types';
import { ArrowRight, TrendingUp, Sparkles, Check, Users, UserPlus } from 'lucide-react';

interface CinematicSimulationProps {
  currentTeam: Candidate[];
  simulatedCandidate: Candidate | null;
  impactResult: CandidateImpactResult | null;
  teamScore: ScoreBreakdown;
  onNext: () => void;
  onSelectCandidate?: (candidate: Candidate) => void;
  allImpacts?: CandidateImpactResult[];
  appMode?: 'guided' | 'custom';
  nextButtonText?: string;
  onGoToCandidates?: () => void;
}

export const CinematicSimulation: React.FC<CinematicSimulationProps> = ({
  currentTeam,
  simulatedCandidate,
  impactResult,
  teamScore,
  onNext,
  onSelectCandidate,
  allImpacts = [],
  appMode = 'guided',
  nextButtonText,
  onGoToCandidates,
}) => {
  // Real-time smooth score interpolation from currentScore to newScore
  const initialScore = impactResult ? impactResult.currentScore : teamScore.totalScore;
  const [displayedScore, setDisplayedScore] = useState<number>(initialScore);
  const [animStage, setAnimStage] = useState<number>(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!impactResult) return;

    setDisplayedScore(impactResult.currentScore);
    setAnimStage(0);

    const timer1 = setTimeout(() => setAnimStage(1), 250);
    const timer2 = setTimeout(() => setAnimStage(2), 500);
    const timer3 = setTimeout(() => {
      setAnimStage(3);
      const start = impactResult.currentScore;
      const target = impactResult.newScore;
      const startTime = performance.now();
      const duration = 750; // smooth 750ms score count-up

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (target - start) * easeOut;
        setDisplayedScore(Math.round(current * 10) / 10);

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animate);
        }
      };
      animFrameRef.current = requestAnimationFrame(animate);
    }, 700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [impactResult?.candidate?.id, impactResult?.newScore, impactResult?.currentScore]);

  // Fallback when no candidate is selected / available
  if (!simulatedCandidate || !impactResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-in fade-in duration-500">
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-8 sm:p-12 text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 mb-4">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-sans">No candidate selected</h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto mt-1 font-mono">
            Select a candidate from Candidates to simulate whole-team fit impact and capability closure.
          </p>
          {onGoToCandidates && (
            <button
              onClick={onGoToCandidates}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-mono font-bold text-white shadow-lg shadow-indigo-950/60 hover:bg-indigo-500 transition cursor-pointer"
            >
              <span>VIEW CANDIDATE POOL</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  const isPositive = impactResult.teamImpact > 0;
  const isNegative = impactResult.teamImpact < 0;

  // Get missing gaps from current state to illustrate resolution dynamically
  const initialMissingGaps = (impactResult.currentGaps || []).filter(
    (g) => g.status === 'MISSING' || g.status === 'PARTIALLY COVERED'
  );

  const defaultNextText = appMode === 'custom' ? 'PROCEED TO FINAL DECISION' : 'COMPARE CANDIDATES';
  const ctaText = nextButtonText || defaultNextText;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Category Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-indigo-400 uppercase flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              {appMode === 'custom' ? '06 / REAL-TIME SIMULATION' : '05 / REAL-TIME SIMULATION'}
            </span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1 font-sans">
            SIMULATING: {simulatedCandidate.name.toUpperCase()}
          </h2>
        </div>

        {/* Quick candidate switcher */}
        {allImpacts.length > 0 && onSelectCandidate && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[10px] font-mono text-gray-400 uppercase mr-1 hidden sm:inline">
              Test other:
            </span>
            {allImpacts.slice(0, 5).map((item) => {
              const isSelected = item.candidate.id === simulatedCandidate.id;
              return (
                <button
                  key={item.candidate.id}
                  onClick={() => onSelectCandidate(item.candidate)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-mono font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {item.candidate.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="py-8 space-y-8">
        
        {/* Visual Transformation Board */}
        <div className="rounded-3xl border border-indigo-500/40 bg-[#101117] p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-600/15 blur-3xl" />
          
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-300 mb-6 flex items-center gap-2">
            <span>TEAM + CANDIDATE → NEW TEAM FIT</span>
          </div>

          {/* Roster Strip showing foundation + incoming candidate */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {currentTeam.map((member) => (
              <div
                key={member.id}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex items-center gap-3"
              >
                <div className="h-10 w-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold font-mono text-indigo-300">
                  {member.name[0]}
                </div>
                <div>
                  <div className="text-sm font-bold text-white font-sans">{member.name}</div>
                  <div className="text-[11px] text-gray-400 font-mono">
                    Domains: {member.domains.join(', ')}
                  </div>
                </div>
              </div>
            ))}

            {/* Simulated Incoming Candidate */}
            <div
              className={`rounded-2xl border p-4 flex items-center gap-3 transition-all duration-500 ${
                animStage >= 1
                  ? 'border-indigo-400 bg-indigo-950/50 shadow-lg shadow-indigo-950/60 scale-[1.02]'
                  : 'border-dashed border-white/20 bg-transparent opacity-50'
              }`}
            >
              <div className="h-10 w-10 rounded-xl bg-indigo-600 border border-indigo-400 flex items-center justify-center font-bold font-mono text-white shadow-md">
                +
              </div>
              <div>
                <div className="text-sm font-bold text-white font-sans flex items-center gap-1.5">
                  <span>{simulatedCandidate.name}</span>
                  <span className="text-[9px] font-mono bg-indigo-500/30 px-1.5 py-0.5 rounded text-indigo-200">
                    SIMULATED
                  </span>
                </div>
                <div className="text-[11px] text-indigo-300 font-mono">
                  {simulatedCandidate.domains.join(' + ')} • {simulatedCandidate.availability}
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Gap Resolution Transformation Cards */}
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {initialMissingGaps.length > 0 ? (
              initialMissingGaps.map((gap) => {
                const isClosed = impactResult.gapsClosed.includes(gap.capability);
                return (
                  <div
                    key={gap.capability}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-mono font-bold text-gray-300">
                        {gap.capability} Requirement
                      </div>
                      <div className="text-[10px] font-mono text-gray-400 uppercase">
                        Priority: {gap.priority}
                      </div>
                    </div>
                    {isClosed && animStage >= 2 ? (
                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 font-mono bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/40 animate-in zoom-in-95 duration-300">
                        <Check className="h-3.5 w-3.5" />
                        <span>COVERED ✓</span>
                      </div>
                    ) : (
                      <div className="text-xs font-bold text-rose-400 font-mono bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                        MISSING
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 text-center py-2 text-xs font-mono text-emerald-400">
                ✓ All baseline capabilities currently addressed. Simulating complementary depth.
              </div>
            )}
          </div>

          {/* Transformation Impact Counter */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-b from-[#151724] to-[#0f1018] p-6 sm:p-8 text-center relative">
            <div className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-widest mb-1">
              UPDATED TEAM FIT SCORE
            </div>

            <div className="flex items-baseline justify-center gap-3">
              <span className="text-gray-400 font-mono text-2xl line-through">
                {impactResult.currentScore.toFixed(1)}
              </span>
              <span className="text-gray-400 font-mono text-2xl">→</span>
              <span
                className={`text-5xl sm:text-7xl font-black font-mono tracking-tight transition-colors duration-300 ${
                  isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-white'
                }`}
              >
                {displayedScore.toFixed(1)}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-gray-400 font-mono">/ 100</span>
            </div>

            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1 text-xs font-mono font-bold text-gray-200">
              <TrendingUp className={`h-4 w-4 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`} />
              <span>
                {isPositive ? '+' : ''}
                {impactResult.teamImpact.toFixed(1)} TEAM IMPACT
              </span>
            </div>

            <div className="mt-3 text-xs font-mono text-gray-400">
              {impactResult.keyHighlight}
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="pt-2 flex justify-between items-center">
          <div className="text-xs text-gray-400 font-mono">
            {appMode === 'custom' ? 'Step 6 of 7' : 'Step 5 of 8'}
          </div>
          <button
            id="sim-to-compare-btn"
            onClick={onNext}
            className="inline-flex items-center gap-2.5 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-950/60 hover:bg-indigo-500 transition cursor-pointer active:scale-95"
          >
            <span>{ctaText}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
