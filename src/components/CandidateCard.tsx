import React, { useState } from 'react';
import { CandidateImpactResult, Candidate } from '../types';
import {
  TrendingUp,
  TrendingDown,
  Play,
  UserPlus,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from 'lucide-react';

interface CandidateCardProps {
  impactResult: CandidateImpactResult;
  onSimulate: (candidate: Candidate) => void;
  onAdd: (candidate: Candidate) => void;
  onViewProfile: (candidate: Candidate) => void;
  isSimulatingActive?: boolean;
  isAnySimulationActive?: boolean;
  isTopRanked?: boolean;
  isTeamFull?: boolean;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  impactResult,
  onSimulate,
  onAdd,
  onViewProfile,
  isSimulatingActive = false,
  isAnySimulationActive = false,
  isTopRanked = false,
  isTeamFull = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { candidate, teamImpact, newScore, currentScore, gapsClosed, keyHighlight } = impactResult;

  const isPositive = teamImpact > 0;
  const isNegative = teamImpact < 0;
  const isDimmed = isAnySimulationActive && !isSimulatingActive;

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border p-4 sm:p-5 shadow-lg transition-all duration-300 backdrop-blur-md ${
        isSimulatingActive
          ? 'border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/60 shadow-indigo-950/50 scale-[1.01]'
          : isDimmed
          ? 'opacity-60 hover:opacity-100 border-white/5 bg-[#0e0e11]'
          : isTopRanked && isPositive
          ? 'border-emerald-500/30 bg-gradient-to-b from-[#131715] to-[#0f1210] hover:border-emerald-500/50'
          : isNegative
          ? 'border-rose-500/20 bg-gradient-to-b from-[#171113] to-[#120e10] hover:border-rose-500/30'
          : 'border-white/10 bg-[#111114] hover:border-white/20'
      }`}
    >
      <div>
        {/* Top Header: Candidate Name, Role & Dominated Team Impact */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-bold text-white tracking-tight">{candidate.name}</h4>
              <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-bold text-gray-300 border border-white/10 font-mono">
                {candidate.role}
              </span>
            </div>
            <div className="mt-1 text-xs text-gray-400 font-mono">
              Domains: <span className="text-gray-200 font-semibold">{candidate.domains.join(' + ')}</span>
            </div>
          </div>

          {/* TEAM IMPACT METRIC (Primary Visually Dominant Badge) */}
          <div className="text-right shrink-0">
            <div
              className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-black font-mono shadow-md ${
                isPositive
                  ? 'bg-emerald-600 text-white shadow-emerald-950/50'
                  : isNegative
                  ? 'bg-rose-600 text-white shadow-rose-950/50'
                  : 'bg-white/10 text-gray-300'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : isNegative ? (
                <TrendingDown className="h-3.5 w-3.5" />
              ) : null}
              <span>
                {isPositive ? `+${teamImpact.toFixed(1)}` : teamImpact.toFixed(1)} TEAM IMPACT
              </span>
            </div>
            <div className="mt-1 text-[11px] font-mono text-gray-400">
              {currentScore.toFixed(1)} → <span className={isPositive ? 'font-bold text-emerald-400' : 'text-gray-300'}>{newScore.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* GAP CONTRIBUTION (Clean, authoritative semantic badges) */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          {gapsClosed.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono text-gray-400">Closes:</span>
              {gapsClosed.map((gap) => (
                <span
                  key={gap}
                  className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-xs font-bold text-emerald-300 font-mono"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  {gap} ✓
                </span>
              ))}
            </div>
          ) : isNegative ? (
            <div className="inline-flex items-center gap-1.5 rounded-md bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-xs text-rose-300 font-medium">
              <AlertCircle className="h-3 w-3 text-rose-400 shrink-0" />
              <span>Does not close current gaps / creates redundancy</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-xs text-gray-400 font-medium">
              <span>Does not close current gaps</span>
            </div>
          )}
        </div>

        {/* Progressive Disclosure: Collapsed Details */}
        <div className="mt-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-white transition cursor-pointer"
          >
            <span>{isExpanded ? 'Hide skills & background' : 'Show skills & background'}</span>
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          {isExpanded && (
            <div className="mt-2 space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs animate-in fade-in duration-200">
              <p className="text-gray-400 italic">"{candidate.bio}"</p>
              <div>
                <div className="text-[10px] font-bold uppercase text-gray-400 font-mono">Skills:</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {candidate.skills.map((s, idx) => (
                    <span key={idx} className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[11px] text-gray-200 font-mono">
                      {s.name} ({s.years}y)
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
                <Clock className="h-3 w-3 text-gray-400" />
                <span>Availability: <strong className="text-white">{candidate.availability}</strong></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Controls */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
        <button
          onClick={() => onViewProfile(candidate)}
          className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-white transition cursor-pointer px-1.5 py-1"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>Profile</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id={`simulate-${candidate.id}`}
            onClick={() => onSimulate(candidate)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold font-mono transition cursor-pointer active:scale-98 ${
              isSimulatingActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50 ring-2 ring-indigo-400/50'
                : 'border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:text-white'
            }`}
          >
            <Play className={`h-3 w-3 ${isSimulatingActive ? 'fill-white' : 'fill-current'}`} />
            <span>{isSimulatingActive ? 'SIMULATING' : 'SIMULATE'}</span>
          </button>

          {isTeamFull ? (
            <button
              id={`add-team-${candidate.id}`}
              disabled
              title="Target roster limit reached"
              className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-bold text-gray-500 font-mono cursor-not-allowed opacity-60"
            >
              <span>ROSTER FULL</span>
            </button>
          ) : (
            <button
              id={`add-team-${candidate.id}`}
              onClick={() => onAdd(candidate)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-950 hover:bg-indigo-500 transition cursor-pointer active:scale-98"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>ADD TO TEAM</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
