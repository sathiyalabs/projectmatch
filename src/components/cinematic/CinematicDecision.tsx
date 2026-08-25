import React, { useState } from 'react';
import { CandidateImpactResult, Candidate } from '../../types';
import { ArrowRight, CheckCircle2, UserPlus, Sparkles, RotateCcw, LayoutDashboard, Check, Users } from 'lucide-react';

interface CinematicDecisionProps {
  topImpact: CandidateImpactResult | null;
  currentTeam: Candidate[];
  maxTeamSize?: number;
  targetRoster?: number;
  onAddCandidate: (candidate: Candidate) => void;
  onReset: () => void;
  onOpenWorkspace: () => void;
  onOpenAddCandidateModal?: () => void;
  onGoToCandidates?: () => void;
  appMode?: 'guided' | 'custom';
}

export const CinematicDecision: React.FC<CinematicDecisionProps> = ({
  topImpact,
  currentTeam,
  maxTeamSize,
  targetRoster,
  onAddCandidate,
  onReset,
  onOpenWorkspace,
  onOpenAddCandidateModal,
  onGoToCandidates,
  appMode = 'guided',
}) => {
  const [isAdded, setIsAdded] = useState(false);
  const effectiveMaxTeamSize = targetRoster ?? maxTeamSize ?? 4;

  // Fallback when no candidates exist
  if (!topImpact) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-in fade-in duration-500">
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-8 sm:p-12 text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 mb-4">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-sans">No decision available</h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto mt-1 font-mono">
            Add at least one candidate to generate a recommendation and run whole-team fit optimization.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {onOpenAddCandidateModal && (
              <button
                onClick={onOpenAddCandidateModal}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-mono font-bold text-white shadow-lg shadow-indigo-950/60 hover:bg-indigo-500 transition cursor-pointer"
              >
                <UserPlus className="h-4 w-4" />
                <span>+ ADD CANDIDATE</span>
              </button>
            )}
            {onGoToCandidates && (
              <button
                onClick={onGoToCandidates}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-mono font-bold text-gray-300 hover:bg-white/10 transition cursor-pointer"
              >
                <span>VIEW CANDIDATE POOL</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const candidate = topImpact.candidate;
  const isAlreadyInTeam = currentTeam.some((m) => m.id === candidate.id);
  const isRosterFull = currentTeam.length >= effectiveMaxTeamSize && !isAlreadyInTeam;

  const handleAdd = () => {
    if (isRosterFull) return;
    onAddCandidate(candidate);
    setIsAdded(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Category Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-indigo-400 uppercase">
            {appMode === 'custom' ? '07 / FINAL TEAM DECISION' : '07 / HIRING DECISION'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1 font-sans">
            TOP COMPLEMENTARY MATCH
          </h2>
        </div>
        <div className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          <span>STRONGEST COMPLEMENTARY ADDITION</span>
        </div>
      </div>

      <div className="py-8 space-y-8">
        
        {/* Decision Summary Card */}
        <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-[#131b17] to-[#0f1412] p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center backdrop-blur-xl">
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-600/15 blur-3xl" />
          
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-4 py-1 text-xs font-mono font-bold text-emerald-300 mb-4">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span>
              {topImpact.gapsClosed.length > 0
                ? `CLOSES: ${topImpact.gapsClosed.join(' + ').toUpperCase()}`
                : 'COMPLEMENTARY PROFILE'}
            </span>
          </div>

          <h3 className="text-3xl sm:text-5xl font-black text-white font-sans tracking-tight">
            {candidate.name.toUpperCase()}
          </h3>
          <p className="text-sm font-mono text-emerald-300 font-semibold mt-1">
            {candidate.role} • Availability: <span className="text-white font-bold">{candidate.availability}</span>
          </p>

          {/* Reasoning Grid */}
          <div className="mt-6 pt-6 border-t border-emerald-500/20 text-left max-w-xl mx-auto space-y-2 text-xs font-mono">
            <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-2">
              WHY THIS CANDIDATE?
            </div>
            {topImpact.gapsClosed.length > 0 ? (
              <div className="flex items-center gap-2 text-gray-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  Closes missing required capabilities: {topImpact.gapsClosed.map((g) => `✓ ${g}`).join(', ')}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Reinforces core engineering capability without introducing domain friction</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Explicit domains: {candidate.domains.join(', ')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Availability: {candidate.availability}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Team Impact: +{topImpact.teamImpact.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Team Fit: {topImpact.currentScore.toFixed(1)} → {topImpact.newScore.toFixed(1)}</span>
            </div>
          </div>

          {/* Fit Transition */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-6">
            <div>
              <div className="text-[10px] font-mono font-bold text-gray-400 uppercase">Baseline Team Fit</div>
              <div className="text-2xl font-black text-gray-400 font-mono">
                {topImpact.currentScore.toFixed(1)} / 100
              </div>
            </div>
            <div className="text-2xl text-emerald-400 font-mono font-black hidden sm:block">→</div>
            <div>
              <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Projected Team Fit</div>
              <div className="text-4xl font-black text-emerald-400 font-mono">
                {topImpact.newScore.toFixed(1)} / 100
              </div>
            </div>
          </div>

          {/* Add to Team Action */}
          <div className="mt-8">
            {isAlreadyInTeam || isAdded ? (
              <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600/30 border border-emerald-500/50 px-8 py-4 text-sm font-bold text-emerald-200 font-mono shadow-lg">
                <Check className="h-5 w-5 text-emerald-400" />
                <span>{candidate.name} ADDED TO TEAM (ROSTER: {currentTeam.length}/{effectiveMaxTeamSize})</span>
              </div>
            ) : isRosterFull ? (
              <div className="space-y-2">
                <button
                  id="add-top-candidate-decision-btn"
                  disabled
                  className="inline-flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-8 py-4 text-base font-bold text-gray-400 font-sans cursor-not-allowed opacity-75"
                >
                  <Users className="h-5 w-5 text-gray-500" />
                  <span>ROSTER COMPLETE ({currentTeam.length}/{effectiveMaxTeamSize} MEMBERS)</span>
                </button>
                <p className="text-xs font-mono text-gray-400">
                  Target roster size reached. Remove an existing member or expand target roster in Project Blueprint to add {candidate.name}.
                </p>
              </div>
            ) : (
              <button
                id="add-top-candidate-decision-btn"
                onClick={handleAdd}
                className="inline-flex items-center gap-3 rounded-2xl bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-emerald-950/70 hover:bg-emerald-500 transition cursor-pointer active:scale-95 font-sans"
              >
                <UserPlus className="h-5 w-5" />
                <span>ADD {candidate.name.toUpperCase()} TO TEAM</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Post Decision Navigation Controls */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono font-bold text-white uppercase">Exploration Options</div>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Inspect full score breakdowns, add another candidate, or explore the full cockpit workspace.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenWorkspace}
              className="flex items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-500/15 px-4 py-2 text-xs font-mono font-bold text-indigo-300 hover:bg-indigo-500/25 transition cursor-pointer"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Full Workspace Cockpit</span>
            </button>

            <button
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-mono font-bold text-gray-300 hover:bg-white/10 transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-gray-400" />
              <span>Reset Flow</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
