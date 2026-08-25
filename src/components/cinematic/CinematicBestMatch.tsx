import React, { useState } from 'react';
import { CandidateImpactResult, ProjectBlueprint, TeamGap } from '../../types';
import { Play, Sparkles, CheckCircle2, TrendingUp, ShieldCheck, ArrowRight, Check, ChevronDown, ChevronUp, Layers } from 'lucide-react';

interface CinematicBestMatchProps {
  topImpact: CandidateImpactResult;
  blueprint?: ProjectBlueprint;
  teamGaps?: TeamGap[];
  onSimulate: (candidate: CandidateImpactResult['candidate']) => void;
  onNext: () => void;
}

export const CinematicBestMatch: React.FC<CinematicBestMatchProps> = ({
  topImpact,
  blueprint,
  teamGaps = [],
  onSimulate,
  onNext,
}) => {
  const [isWhyOpen, setIsWhyOpen] = useState(true);
  const candidate = topImpact.candidate;

  const handleSimulateClick = () => {
    onSimulate(candidate);
    onNext();
  };

  // Deterministic baseline covered capabilities
  const baselineCovered = teamGaps.filter(
    (g) => g.status === 'STRONGLY COVERED' || g.status === 'PARTIALLY COVERED'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Category Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-indigo-400 uppercase">
            04 / BEST MATCH RECOMMENDATION
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1 font-sans">
            #1 COMPLEMENTARY MATCH
          </h2>
        </div>
        <div className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          <span>RANK #1 CANDIDATE</span>
        </div>
      </div>

      <div className="py-8 space-y-6">
        {/* Candidate Presentation Card */}
        <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-b from-[#131422] to-[#0f0f15] p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-indigo-600 border border-indigo-400/40 flex items-center justify-center text-white font-bold font-mono text-xl shadow-lg shadow-indigo-950/60">
                {candidate.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-sans">{candidate.name}</h3>
                <p className="text-sm font-semibold text-indigo-300 font-mono">{candidate.role}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-400 font-mono">
                  <span>Availability:</span>
                  <span className="text-emerald-400 font-bold">{candidate.availability}</span>
                </div>
              </div>
            </div>

            {/* Team Impact Delta Badge */}
            <div className="sm:text-right">
              <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                CALCULATED TEAM IMPACT
              </div>
              <div className="mt-1 inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-3.5 py-1.5 text-xl sm:text-2xl font-black font-mono text-emerald-400 shadow-md">
                <TrendingUp className="h-5 w-5" />
                <span>+{topImpact.teamImpact.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Explicit Domains & Gap Closure Summary */}
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider mb-2">
                Explicit Candidate Domains
              </div>
              <div className="flex flex-wrap gap-2">
                {candidate.domains.map((dom) => (
                  <span
                    key={dom}
                    className="rounded-lg bg-indigo-500/20 border border-indigo-500/40 px-3 py-1 text-xs font-mono font-bold text-indigo-200"
                  >
                    {dom}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-400 italic">"{candidate.bio}"</p>
            </div>

            {/* Gap Closure Summary */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
              <div className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <ShieldCheck className="h-4 w-4" />
                <span>CLOSES TEAM GAPS</span>
              </div>
              <div className="space-y-1.5">
                {topImpact.gapsClosed.length > 0 ? (
                  topImpact.gapsClosed.map((gap) => (
                    <div key={gap} className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span>Closes {gap} requirement</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs font-mono text-gray-400">
                    Does not close current gaps
                  </div>
                )}
              </div>
              <div className="mt-3 text-xs font-mono text-emerald-300/90 pt-2 border-t border-emerald-500/20 flex items-center justify-between">
                <span>Team Fit:</span>
                <span>
                  <strong className="text-gray-300">{topImpact.currentScore.toFixed(1)}</strong> →{' '}
                  <strong className="text-emerald-400 text-sm font-black">{topImpact.newScore.toFixed(1)} / 100</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* WHY THIS MATCH? (Deterministic Explainability) */}
        <div className="rounded-2xl border border-white/10 bg-[#111115] p-5 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setIsWhyOpen(!isWhyOpen)}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                WHY THIS MATCH?
              </span>
            </div>
            {isWhyOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </button>

          {isWhyOpen && (
            <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-xs font-mono animate-in fade-in duration-200">
              {topImpact.gapsClosed.map((gap) => {
                const reqPriority = blueprint?.priorities.find((p) => p.capability === gap)?.priority || 'Critical';
                return (
                  <div key={gap} className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>
                      <strong>{gap}</strong> — {reqPriority} capability gap closed directly
                    </span>
                  </div>
                );
              })}
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>
                  <strong>Availability:</strong> {candidate.availability} ({candidate.availability === 'Full' ? 'Full bandwidth commitment' : 'Flexible availability'})
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>
                  <strong>Domain Efficiency:</strong> High capability complementarity with zero unnecessary redundancy penalty
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-indigo-300 text-[11px]">
                <span>Deterministic Score Boost:</span>
                <span className="font-bold text-emerald-400">+{topImpact.teamImpact.toFixed(1)} Team Fit Delta</span>
              </div>
            </div>
          )}
        </div>

        {/* Small Visual Capability Resolution Matrix (Instant Comprehension) */}
        {blueprint && blueprint.priorities.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2 mb-3">
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              <span>TEAM NEEDS RESOLUTION</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {blueprint.priorities.map((item) => {
                const isExisting = baselineCovered.some((g) => g.capability === item.capability);
                const isClosedByCandidate = topImpact.gapsClosed.includes(item.capability);

                return (
                  <div
                    key={item.capability}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 px-3.5 py-2 text-xs font-mono"
                  >
                    <span className="font-bold text-white">{item.capability}</span>
                    {isExisting ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="h-3 w-3" /> Foundation ✓
                      </span>
                    ) : isClosedByCandidate ? (
                      <span className="text-indigo-300 font-bold flex items-center gap-1">
                        → {candidate.name.split(' ')[0]} ✓
                      </span>
                    ) : (
                      <span className="text-gray-500">Unresolved</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-gray-400 font-mono">
            Directly test whole-team transformation in real-time simulation.
          </div>
          <button
            id="simulate-karthik-btn"
            onClick={handleSimulateClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-950/70 hover:bg-indigo-500 transition cursor-pointer active:scale-95"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>SIMULATE {candidate.name.split(' ')[0].toUpperCase()}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
