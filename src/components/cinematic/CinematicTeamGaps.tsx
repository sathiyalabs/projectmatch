import React from 'react';
import { Candidate, TeamGap, ProjectBlueprint } from '../../types';
import { ArrowRight, CheckCircle2, AlertCircle, ShieldX, Check } from 'lucide-react';

interface CinematicTeamGapsProps {
  currentTeam: Candidate[];
  teamGaps: TeamGap[];
  blueprint: ProjectBlueprint;
  onNext: () => void;
}

export const CinematicTeamGaps: React.FC<CinematicTeamGapsProps> = ({
  currentTeam,
  teamGaps,
  blueprint,
  onNext,
}) => {
  const missingGaps = teamGaps.filter((g) => g.status === 'MISSING');
  const coveredGaps = teamGaps.filter((g) => g.status === 'STRONGLY COVERED' || g.status === 'PARTIALLY COVERED');

  const missingCapNames = missingGaps.map((g) => g.capability);
  const coveredCapNames = coveredGaps.map((g) => g.capability);
  const allCovered = missingGaps.length === 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Category Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-indigo-400 uppercase">
            03 / TEAM GAP ANALYSIS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1 font-sans">
            {allCovered ? 'TEAM GAPS — ALL CAPABILITIES COVERED' : `TEAM GAPS — ${missingGaps.length} MISSING`}
          </h2>
        </div>
        <div
          className={`rounded-full border px-3.5 py-1.5 text-xs font-mono font-bold ${
            allCovered
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {allCovered ? 'ALL CAPABILITIES COVERED' : 'BOTTLENECK IDENTIFIED'}
        </div>
      </div>

      <div className="py-8 space-y-8">
        {/* Visual Mapping: Current Team Coverage vs Missing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Covered Section */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-6 flex flex-col justify-between animate-in fade-in duration-500">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 mb-4">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>CURRENTLY COVERED</span>
                </span>
                <span className="bg-emerald-500/20 px-2 py-0.5 rounded text-[10px] text-emerald-300 border border-emerald-500/30 font-bold">
                  {coveredGaps.length} COVERED
                </span>
              </div>

              <div className="space-y-3">
                {coveredGaps.map((gap) => (
                  <div
                    key={gap.capability}
                    className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3"
                  >
                    <div>
                      <div className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                        <span>{gap.capability}</span>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <div className="text-[10px] text-emerald-300/80 font-mono mt-0.5">
                        Covered by: {gap.coveredBy.map((c) => c.memberName).join(', ')}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      ✓ COVERED
                    </span>
                  </div>
                ))}

                {coveredGaps.length === 0 && (
                  <div className="py-6 text-center text-xs font-mono text-gray-400">
                    No capabilities covered yet. Add team members to cover required domains.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-500/20 text-xs font-mono text-emerald-300/80">
              {coveredCapNames.length > 0
                ? `✓ ${coveredCapNames.join(' & ')} capabilities strongly covered by current team.`
                : 'No capabilities currently satisfied.'}
            </div>
          </div>

          {/* Missing Gaps Section - Highlighted after covered */}
          {allCovered ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 mb-4">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>ZERO MISSING GAPS</span>
                  </span>
                  <span className="bg-emerald-500/20 px-2 py-0.5 rounded text-[10px] text-emerald-300 border border-emerald-500/30 font-bold">
                    100% COVERED
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300 space-y-1">
                  <div className="font-bold text-white">All Required Blueprint Capabilities Satisfied</div>
                  <div>The current team covers every required domain specified in the blueprint.</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-500/20 text-xs font-mono text-emerald-300/80">
                ✓ No critical bottlenecks detected for this project.
              </div>
            </div>
          ) : (
            <div
              className="rounded-2xl border border-rose-500/40 bg-rose-950/15 p-6 flex flex-col justify-between shadow-lg shadow-rose-950/20 animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both"
              style={{ animationDelay: '200ms' }}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400 mb-4">
                  <span className="flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4" />
                    <span>MISSING</span>
                  </span>
                  <span className="bg-rose-500/20 px-2 py-0.5 rounded text-[10px] text-rose-300 border border-rose-500/30 font-bold">
                    {missingGaps.length} UNMET
                  </span>
                </div>

                <div className="space-y-3">
                  {missingGaps.map((gap) => (
                    <div
                      key={gap.capability}
                      className="flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3"
                    >
                      <div>
                        <div className="text-sm font-bold text-white font-mono">{gap.capability}</div>
                        <div className="text-[10px] text-rose-300/90 font-mono uppercase tracking-wider mt-0.5">
                          Priority: {gap.priority}
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-400 font-mono bg-rose-500/20 px-2.5 py-1 rounded-lg border border-rose-500/40">
                        <ShieldX className="h-3.5 w-3.5" />
                        <span>{gap.priority.toUpperCase()}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-500/20 text-xs font-mono text-rose-300/80">
                ⚠️ {missingCapNames.join(' + ')} capabilities are required to complete the team.
              </div>
            </div>
          )}
        </div>

        {/* Narrative Callout */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
          <p className="text-xs sm:text-sm text-gray-300 font-mono">
            {allCovered ? (
              <span>
                All required capabilities currently satisfied by active team roster. You can still evaluate candidates for depth and availability.
              </span>
            ) : (
              <span>
                <strong>Target Search Constraint:</strong> Search candidates with explicit domain coverage for{' '}
                <span className="text-indigo-400 font-bold">{missingCapNames.join(' + ')}</span> without adding duplicate ML redundancy.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="pt-2 flex justify-end">
        <button
          id="find-best-match-btn"
          onClick={onNext}
          className="inline-flex items-center gap-2.5 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-950/60 hover:bg-indigo-500 transition cursor-pointer active:scale-95"
        >
          <span>{allCovered ? 'EVALUATE CANDIDATE POOL' : 'FIND THE BEST MATCH'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
