import React from 'react';
import { CandidateImpactResult, Candidate } from '../types';
import {
  X,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Clock,
  HeartHandshake,
  Brain,
  UserPlus,
  Flame,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SimulationDrawerProps {
  simulationResult: CandidateImpactResult | null;
  onClose: () => void;
  onAddCandidate: (candidate: Candidate) => void;
  isTeamFull?: boolean;
}

export const SimulationDrawer: React.FC<SimulationDrawerProps> = ({
  simulationResult,
  onClose,
  onAddCandidate,
  isTeamFull = false,
}) => {
  if (!simulationResult) return null;

  const {
    candidate,
    currentScore,
    newScore,
    teamImpact,
    currentBreakdown,
    newBreakdown,
    gapsClosed,
    currentGaps,
    newGaps,
    keyHighlight,
  } = simulationResult;

  const isPositive = teamImpact > 0;
  const isNegative = teamImpact < 0;

  const compDelta = newBreakdown.complementarity - currentBreakdown.complementarity;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/15 bg-[#111114] p-6 shadow-2xl sm:p-8 backdrop-blur-xl"
        >
          {/* Close button */}
          <button
            id="close-simulation-btn"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Simulation Header */}
          <div className="border-b border-white/10 pb-4">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-500/20 px-2.5 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30 font-mono">
              <span>TEAM FIT SIMULATION</span>
            </div>
            <h2 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">
              Simulating Team Impact with {candidate.name}
            </h2>
            <p className="mt-0.5 text-xs text-gray-400 font-medium">
              {candidate.role} • Domains: <strong className="text-gray-200">{candidate.domains.join(', ')}</strong> • Availability: {candidate.availability}
            </p>
          </div>

          {/* Primary BEFORE -> AFTER Hero Transition */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-center rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            {/* BEFORE */}
            <div className="text-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                CURRENT TEAM FIT
              </div>
              <div className="mt-1 text-4xl font-black text-gray-300 font-mono">
                {currentScore.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500 font-mono mt-0.5">out of 100</div>
            </div>

            {/* TEAM IMPACT DELTA */}
            <div className="flex flex-col items-center justify-center text-center">
              <div
                className={`inline-flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-base font-black shadow-xl font-mono ${
                  isPositive
                    ? 'bg-emerald-600 text-white shadow-emerald-950/60'
                    : isNegative
                    ? 'bg-rose-600 text-white shadow-rose-950/60'
                    : 'bg-white/10 text-gray-200'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="h-5 w-5" />
                ) : isNegative ? (
                  <TrendingDown className="h-5 w-5" />
                ) : null}
                <span>{isPositive ? `+${teamImpact.toFixed(1)}` : teamImpact.toFixed(1)}</span>
              </div>
              <span className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                TEAM IMPACT
              </span>
            </div>

            {/* AFTER */}
            <div className="text-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
                SIMULATED TEAM FIT
              </div>
              <div className="mt-1 text-4xl font-black text-indigo-400 font-mono">
                {newScore.toFixed(1)}
              </div>
              <div className="text-xs text-indigo-300/70 font-mono mt-0.5">out of 100</div>
            </div>
          </div>

          {/* Key Simulation Highlights & Outcomes */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 font-mono">
              SIMULATION OUTCOME BREAKDOWN
            </h4>

            <div className="space-y-2 text-xs">
              {/* Gaps closed checks */}
              {gapsClosed.map((gapName) => (
                <div key={gapName} className="flex items-center gap-2 text-emerald-300 font-bold bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>✓ {gapName} covered</span>
                </div>
              ))}

              {/* Complementarity status */}
              <div
                className={`flex items-center gap-2 p-2.5 rounded-xl border ${
                  compDelta >= 0
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300 font-bold'
                    : 'border-rose-500/20 bg-rose-500/10 text-rose-300 font-medium'
                }`}
              >
                {compDelta >= 0 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                )}
                <span>
                  {compDelta >= 0
                    ? `✓ Complementarity maintained/improved (+${compDelta.toFixed(1)}%)`
                    : `⚠ Redundancy penalty: Duplicate domain overlaps reduce complementarity (${compDelta.toFixed(1)}%)`}
                </span>
              </div>

              {/* Still missing requirements (if any) */}
              {newGaps
                .filter((g) => g.status === 'MISSING')
                .map((missing) => (
                  <div key={missing.capability} className="flex items-center gap-2 text-rose-300/80 bg-rose-500/5 p-2.5 rounded-xl border border-rose-500/10">
                    <Flame className="h-4 w-4 text-rose-400 shrink-0" />
                    <span>Still missing: {missing.capability} ({missing.priority})</span>
                  </div>
                ))}
            </div>

            <p className="mt-3 text-xs text-gray-400 italic bg-white/5 p-2.5 rounded-xl">
              <strong className="text-white not-italic">Key Reason: </strong>
              {keyHighlight}
            </p>
          </div>

          {/* Bottom Actions */}
          <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-white/10 pt-4">
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            {isTeamFull ? (
              <button
                id="confirm-add-from-sim-btn"
                disabled
                title="Target roster limit reached"
                className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-5 py-2.5 text-xs font-bold text-gray-500 font-mono cursor-not-allowed opacity-60"
              >
                <span>ROSTER FULL</span>
              </button>
            ) : (
              <button
                id="confirm-add-from-sim-btn"
                onClick={() => {
                  onAddCandidate(candidate);
                  onClose();
                }}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xl shadow-indigo-950 hover:bg-indigo-500 transition cursor-pointer active:scale-98"
              >
                <UserPlus className="h-4 w-4" />
                <span>ADD TO TEAM</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

