import React, { useEffect, useState, useRef } from 'react';
import { Candidate, ScoreBreakdown, TeamGap } from '../../types';
import { ArrowRight, UserCheck, ShieldAlert, UserPlus, UserMinus, Plus } from 'lucide-react';

interface CinematicCurrentTeamProps {
  currentTeam: Candidate[];
  teamScore: ScoreBreakdown;
  teamGaps?: TeamGap[];
  maxTeamSize?: number;
  onNext: () => void;
  onAddMember?: () => void;
  onRemoveMember?: (id: string) => void;
}

export const CinematicCurrentTeam: React.FC<CinematicCurrentTeamProps> = ({
  currentTeam,
  teamScore,
  teamGaps = [],
  maxTeamSize = 4,
  onNext,
  onAddMember,
  onRemoveMember,
}) => {
  // Score count-up interpolation
  const [displayedScore, setDisplayedScore] = useState(0);
  const animFrameRef = useRef<number | null>(null);

  const isRosterFull = currentTeam.length >= maxTeamSize;
  const isRosterOverTarget = currentTeam.length > maxTeamSize;
  const missingGapsCount = teamGaps.filter((g) => g.status === 'MISSING').length;

  useEffect(() => {
    const target = teamScore.totalScore;
    const start = 0;
    const startTime = performance.now();
    const duration = 650; // smooth 650ms transition

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
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [teamScore.totalScore]);

  // Derived supporting statement based on actual calculated gaps & team size
  const supportingStatement =
    currentTeam.length === 0
      ? 'Team roster is currently empty. Add members to begin baseline evaluation.'
      : missingGapsCount === 2
      ? 'Strong foundation. Two required capabilities remain unresolved.'
      : missingGapsCount > 0
      ? `Strong foundation. ${missingGapsCount} required capability remains unresolved.`
      : 'All required capabilities currently covered.';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Category Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-indigo-400 uppercase">
            02 / CURRENT TEAM ROSTER
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1 font-sans">
            YOUR CURRENT TEAM
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {onAddMember && !isRosterFull && (
            <button
              onClick={onAddMember}
              className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-mono font-bold transition bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600 hover:text-white cursor-pointer active:scale-95 duration-200"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>+ ADD MEMBER</span>
            </button>
          )}
          <div
            className={`rounded-full border px-3.5 py-1.5 text-xs font-mono font-bold transition-all duration-300 ${
              isRosterOverTarget
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : isRosterFull
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-white/5 border-white/10 text-gray-300'
            }`}
          >
            {isRosterOverTarget
              ? `${currentTeam.length} / ${maxTeamSize} MEMBERS (ROSTER ABOVE TARGET)`
              : isRosterFull
              ? `${currentTeam.length} / ${maxTeamSize} MEMBERS`
              : `${currentTeam.length} / ${maxTeamSize} MEMBERS ACTIVE`}
          </div>
        </div>
      </div>

      {/* Roster Above Target Alert Banner if applicable */}
      {isRosterOverTarget && (
        <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 text-xs font-mono text-amber-300 flex items-center justify-between animate-in fade-in duration-200">
          <span>⚠️ Roster size ({currentTeam.length}) exceeds blueprint target ({maxTeamSize}). Remove a member below or increase target roster in Project Blueprint.</span>
        </div>
      )}

      {/* Roster Complete Compact Banner when exact limit reached */}
      {isRosterFull && !isRosterOverTarget && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 text-xs font-mono text-emerald-300 flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="font-bold">ROSTER COMPLETE</span>
            <span className="text-emerald-500/60">•</span>
            <span>Target roster capacity of {maxTeamSize} members reached.</span>
          </div>
          <span className="text-[11px] text-emerald-400/80 hidden sm:inline">Add Member locked</span>
        </div>
      )}

      <div className="py-8 space-y-8">
        {/* Team Members Grid or Empty Roster Notice */}
        {currentTeam.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 sm:p-12 text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 mb-4">
              <UserPlus className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-sans">0 MEMBERS IN CURRENT TEAM</h3>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto mt-1 font-mono">
              Build your custom foundation from scratch. Add 1 or more initial team members with explicit domain tags.
            </p>
            {onAddMember && (
              <button
                onClick={onAddMember}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-mono font-bold text-white shadow-lg shadow-indigo-950/60 hover:bg-indigo-500 transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>+ ADD FIRST TEAM MEMBER</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentTeam.map((member) => (
              <div
                key={member.id}
                className="rounded-2xl border border-white/10 bg-[#111114] p-6 shadow-xl relative overflow-hidden backdrop-blur-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold font-mono text-base">
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white font-sans">{member.name}</h3>
                      <p className="text-xs text-gray-400 font-mono">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <UserCheck className="h-3 w-3" /> ACTIVE
                    </span>
                    {onRemoveMember && (
                      <button
                        onClick={() => onRemoveMember(member.id)}
                        className="p-1 rounded text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                        title="Remove member"
                      >
                        <UserMinus className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-gray-400">Availability:</span>
                    <span className="font-bold text-emerald-400">{member.availability}</span>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono font-bold text-gray-400 uppercase mb-1.5">
                      Explicit Domains
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {member.domains.map((dom) => (
                        <span
                          key={dom}
                          className="rounded-md bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 text-xs font-mono font-bold text-indigo-300"
                        >
                          {dom}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Interactive Add Member Slot Card when Roster is NOT full */}
            {onAddMember && !isRosterFull && (
              <button
                type="button"
                onClick={onAddMember}
                className="rounded-2xl border border-dashed border-indigo-500/30 hover:border-indigo-500/60 bg-indigo-950/10 hover:bg-indigo-950/20 p-6 flex flex-col items-center justify-center gap-2.5 transition-all duration-300 text-center cursor-pointer min-h-[160px] group active:scale-[0.99] animate-in fade-in"
              >
                <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 group-hover:bg-indigo-600/30 flex items-center justify-center text-indigo-300 transition">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold font-mono text-indigo-300 group-hover:text-white transition">
                    + ADD MEMBER
                  </div>
                  <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                    Slot {currentTeam.length + 1} of {maxTeamSize} available
                  </div>
                </div>
              </button>
            )}
          </div>
        )}

        {/* Prominent Team Fit Score Card */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#141419] to-[#0f0f12] p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
          <div className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-indigo-600/15 blur-2xl" />

          <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-indigo-400 mb-2">
            BASELINE TEAM FIT
          </div>

          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl sm:text-7xl font-black text-white font-mono tracking-tight">
              {displayedScore.toFixed(1)}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-gray-400 font-mono">/ 100</span>
          </div>

          <div className="mt-4 max-w-lg mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-300 font-medium bg-white/[0.03] border border-white/5 p-3 rounded-xl">
            <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
            <span>"{supportingStatement}"</span>
          </div>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="pt-2 flex justify-end">
        <button
          id="view-team-gaps-btn"
          onClick={onNext}
          className="inline-flex items-center gap-2.5 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-950/60 hover:bg-indigo-500 transition cursor-pointer active:scale-95"
        >
          <span>VIEW TEAM GAPS</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
