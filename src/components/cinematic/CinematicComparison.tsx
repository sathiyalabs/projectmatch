import React, { useState } from 'react';
import { CandidateImpactResult, Candidate } from '../../types';
import { ArrowRight, ChevronDown, ChevronUp, Play, Check, UserPlus, Plus, Table, List, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CinematicComparisonProps {
  candidateImpacts: CandidateImpactResult[];
  activeSimulatedId: string | null;
  onSimulate: (candidate: Candidate) => void;
  onNext: () => void;
  onAddCandidate?: () => void;
  appMode?: 'guided' | 'custom';
  nextButtonText?: string;
}

export const CinematicComparison: React.FC<CinematicComparisonProps> = ({
  candidateImpacts,
  activeSimulatedId,
  onSimulate,
  onNext,
  onAddCandidate,
  appMode = 'guided',
  nextButtonText,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');
  const [expandedCandidateId, setExpandedCandidateId] = useState<string | null>(null);

  // Show top 4 by default, or all if expanded
  const displayedCandidates = showAll ? candidateImpacts : candidateImpacts.slice(0, 4);

  const defaultNextText = appMode === 'custom' ? 'PROCEED TO SIMULATION' : 'PROCEED TO FINAL DECISION';
  const ctaText = nextButtonText || defaultNextText;

  // Extract all distinct domains across top candidates for the matrix
  const topCandidatesForMatrix = candidateImpacts.slice(0, 3);
  const matrixDomains = Array.from(
    new Set(topCandidatesForMatrix.flatMap((item) => item.candidate.domains))
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Category Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-indigo-400 uppercase">
            {appMode === 'custom' ? '05 / CANDIDATE POOL RANKING' : '06 / CANDIDATE POOL RANKING'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1 font-sans">
            {appMode === 'custom' ? 'CANDIDATE POOL & COMPLEMENTARITY' : 'WHOLE-TEAM COMPLEMENTARITY'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {candidateImpacts.length >= 2 && (
            <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5">
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-mono font-bold transition cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="h-3 w-3" />
                <span>Cards</span>
              </button>
              <button
                onClick={() => setViewMode('matrix')}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-mono font-bold transition cursor-pointer ${
                  viewMode === 'matrix'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Table className="h-3 w-3" />
                <span>Compare Matrix</span>
              </button>
            </div>
          )}
          {onAddCandidate && (
            <button
              onClick={onAddCandidate}
              className="flex items-center gap-1.5 rounded-full bg-indigo-600/20 border border-indigo-500/40 px-3.5 py-1.5 text-xs font-mono font-bold text-indigo-300 hover:bg-indigo-600 hover:text-white transition cursor-pointer"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>+ ADD CANDIDATE</span>
            </button>
          )}
          <div className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs font-mono font-bold text-gray-300">
            {candidateImpacts.length} CANDIDATES EVALUATED
          </div>
        </div>
      </div>

      <div className="py-8 space-y-6">
        <p className="text-xs sm:text-sm text-gray-400 font-mono">
          Ranked strictly by mathematical whole-team fit delta. Strong individual resumes that duplicate already covered domains score lower than complementary additions.
        </p>

        {/* Side-by-Side Matrix View */}
        {viewMode === 'matrix' && topCandidatesForMatrix.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111116] p-4 sm:p-6 backdrop-blur-md shadow-xl animate-in fade-in duration-300">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300 mb-4 flex items-center gap-2">
              <Table className="h-4 w-4" />
              <span>TOP CANDIDATES CAPABILITY & COMPLEMENTARITY MATRIX</span>
            </div>
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="pb-3 font-bold uppercase text-[10px]">Dimension</th>
                  {topCandidatesForMatrix.map((item, idx) => (
                    <th key={item.candidate.id} className="pb-3 text-center">
                      <div className="font-bold text-white text-sm font-sans">{item.candidate.name}</div>
                      <div className="text-[10px] text-indigo-300 font-normal">Rank #{idx + 1} ({item.candidate.role})</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {matrixDomains.map((dom) => (
                  <tr key={dom} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 font-bold text-gray-300">{dom} Domain</td>
                    {topCandidatesForMatrix.map((item) => {
                      const hasDomain = item.candidate.domains.includes(dom);
                      const closesGap = item.gapsClosed.includes(dom);
                      return (
                        <td key={item.candidate.id} className="py-2.5 text-center">
                          {hasDomain ? (
                            closesGap ? (
                              <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-xs font-bold text-emerald-300">
                                <Check className="h-3 w-3" /> Closes Gap
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded bg-white/10 px-2 py-0.5 text-xs text-gray-300">
                                ✓ Covered
                              </span>
                            )
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr>
                  <td className="py-2.5 font-bold text-gray-300">Availability</td>
                  {topCandidatesForMatrix.map((item) => (
                    <td key={item.candidate.id} className="py-2.5 text-center">
                      <span className={`font-bold ${item.candidate.availability === 'Full' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {item.candidate.availability}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-gray-300">Domain Redundancy</td>
                  {topCandidatesForMatrix.map((item) => (
                    <td key={item.candidate.id} className="py-2.5 text-center">
                      <span className={item.teamImpact > 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                        {item.teamImpact > 0 ? 'Low (Complementary)' : 'High (Duplicate)'}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-white/10 bg-white/[0.02]">
                  <td className="py-3 font-black text-white uppercase text-xs">Team Impact</td>
                  {topCandidatesForMatrix.map((item) => (
                    <td key={item.candidate.id} className="py-3 text-center">
                      <div className={`text-base font-black font-mono ${item.teamImpact > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.teamImpact > 0 ? '+' : ''}{item.teamImpact.toFixed(1)}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        Fit: {item.newScore.toFixed(1)}/100
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}

        {/* Empty Candidates State or Compact Ranked List */}
        {candidateImpacts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 sm:p-12 text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 mb-4">
              <UserPlus className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-sans">NO CANDIDATES IN POOL</h3>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto mt-1 font-mono">
              Add candidates with explicit capability domains and availability statuses to run deterministic ranking.
            </p>
            {onAddCandidate && (
              <button
                onClick={onAddCandidate}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-mono font-bold text-white shadow-lg shadow-indigo-950/60 hover:bg-indigo-500 transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>+ ADD FIRST CANDIDATE</span>
              </button>
            )}
          </div>
        ) : viewMode === 'cards' ? (
          <div className="space-y-3.5">
            {displayedCandidates.map((item, index) => {
              const isSelected = activeSimulatedId === item.candidate.id;
              const isPositive = item.teamImpact > 0;
              const isNegative = item.teamImpact < 0;
              const isWhyExpanded = expandedCandidateId === item.candidate.id;

              return (
                <div
                  key={item.candidate.id}
                  className={`rounded-2xl border p-4 sm:p-5 transition-all duration-300 backdrop-blur-md flex flex-col justify-between gap-4 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/50 shadow-xl'
                      : index === 0
                      ? 'border-emerald-500/30 bg-white/[0.03] hover:border-emerald-500/50'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Candidate Info */}
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/5 font-mono text-xs font-bold text-gray-400 border border-white/10 mt-0.5">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-base font-bold text-white font-sans">{item.candidate.name}</span>
                          <span className="text-xs text-gray-400 font-mono">({item.candidate.role})</span>
                          <span className={`text-[11px] font-mono font-semibold ${
                            item.candidate.availability === 'Full'
                              ? 'text-emerald-400'
                              : item.candidate.availability === 'Unavailable'
                              ? 'text-rose-400'
                              : 'text-amber-400'
                          }`}>
                            • {item.candidate.availability.toUpperCase()} Availability
                          </span>
                        </div>

                        {/* Explicit Domains */}
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-mono text-gray-400 uppercase">Explicit Domains:</span>
                          {item.candidate.domains.map((dom) => (
                            <span
                              key={dom}
                              className="rounded bg-white/5 border border-white/10 px-1.5 py-0.5 text-[10px] font-mono text-gray-300"
                            >
                              {dom}
                            </span>
                          ))}
                        </div>

                        {/* Gap Closure Status */}
                        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-mono">
                          <span className="text-gray-400 uppercase text-[10px]">Gap Closure:</span>
                          {item.gapsClosed.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {item.gapsClosed.map((g) => (
                                <span
                                  key={g}
                                  className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded"
                                >
                                  <Check className="h-2.5 w-2.5" /> Closes {g}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic text-[10px]">
                              Does not close current gaps
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Impact Delta & Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-0 border-white/5 shrink-0">
                      <div className="text-left sm:text-right">
                        <div className="text-[10px] font-mono font-bold text-gray-400 uppercase">Team Fit Impact</div>
                        <div
                          className={`text-base font-black font-mono flex items-center gap-1 ${
                            isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-gray-400'
                          }`}
                        >
                          <span>
                            {isPositive ? '+' : ''}
                            {item.teamImpact.toFixed(1)}
                          </span>
                          <span className="text-[11px] text-gray-400 font-normal">
                            ({item.newScore.toFixed(1)}/100)
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onSimulate(item.candidate)}
                        className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-mono font-bold transition cursor-pointer active:scale-95 ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20'
                        }`}
                      >
                        <Play className="h-3 w-3 fill-current" />
                        <span>{isSelected ? 'SIMULATING' : 'SIMULATE'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Why This Match? Explainability Drawer */}
                  <div className="pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setExpandedCandidateId(isWhyExpanded ? null : item.candidate.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-gray-400 hover:text-white transition cursor-pointer"
                    >
                      <Sparkles className="h-3 w-3 text-indigo-400" />
                      <span>{isWhyExpanded ? 'Hide Deterministic Explainability' : 'Why this impact?'}</span>
                      {isWhyExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>

                    {isWhyExpanded && (
                      <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs font-mono space-y-1.5 animate-in fade-in duration-200">
                        {item.gapsClosed.length > 0 ? (
                          item.gapsClosed.map((gap) => (
                            <div key={gap} className="flex items-center gap-1.5 text-emerald-300">
                              <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                              <span>✓ Closes required {gap} capability gap</span>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center gap-1.5 text-rose-300">
                            <AlertCircle className="h-3 w-3 text-rose-400 shrink-0" />
                            <span>No open blueprint capability gaps closed</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <span className="text-gray-400">• Availability:</span>
                          <span className="font-semibold text-white">{item.candidate.availability}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <span className="text-gray-400">• Domain Redundancy:</span>
                          <span className={item.teamImpact > 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                            {item.teamImpact > 0 ? 'Low (Complementary domain synergy)' : 'High (Overlap with existing domains)'}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400 italic pt-1">
                          "{item.keyHighlight}"
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {/* Expand / Collapse Button */}
        {candidateImpacts.length > 4 && viewMode === 'cards' && (
          <div className="text-center pt-2">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-white transition cursor-pointer"
            >
              <span>{showAll ? 'Show Top 4 Only' : `View All ${candidateImpacts.length} Candidates`}</span>
              {showAll ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* Primary CTA */}
      {candidateImpacts.length > 0 && (
        <div className="pt-4 flex justify-end">
          <button
            id="compare-to-decision-btn"
            onClick={onNext}
            className="inline-flex items-center gap-2.5 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-950/60 hover:bg-indigo-500 transition cursor-pointer active:scale-95"
          >
            <span>{ctaText}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
