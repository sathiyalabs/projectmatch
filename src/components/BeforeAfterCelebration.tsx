import React from 'react';
import { CandidateImpactResult, Candidate } from '../types';
import {
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Zap,
  Award,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BeforeAfterCelebrationProps {
  lastAddedResult: CandidateImpactResult | null;
  onDismiss: () => void;
}

export const BeforeAfterCelebration: React.FC<BeforeAfterCelebrationProps> = ({
  lastAddedResult,
  onDismiss,
}) => {
  if (!lastAddedResult) return null;

  const { candidate, currentScore, newScore, teamImpact, gapsClosed, newGaps } = lastAddedResult;
  const isPositive = teamImpact > 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-[#111114] p-6 text-center shadow-2xl sm:p-8 backdrop-blur-xl"
        >
          {/* Dismiss button */}
          <button
            onClick={onDismiss}
            className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Celebration Icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-950 border border-indigo-400/30">
            <Award className="h-7 w-7 text-amber-300" />
          </div>

          <div className="mt-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30 font-mono">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              ROSTER EXPANDED SUCCESSFULLY
            </span>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
              {candidate.name} Joined the Team!
            </h3>
            <p className="mt-1 text-xs text-gray-400">
              {candidate.role} • {candidate.domains.join(', ')}
            </p>
          </div>

          {/* Before / After Transformation Box */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="grid grid-cols-3 items-center">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                  TEAM BEFORE
                </div>
                <div className="mt-1 text-2xl font-black text-gray-400 sm:text-3xl font-mono">
                  {currentScore.toFixed(1)}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <ArrowRight className="h-4 w-4" />
                </div>
                <span className="mt-1 text-[11px] font-bold text-emerald-400 font-mono">
                  +{teamImpact.toFixed(1)} Impact
                </span>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
                  TEAM AFTER
                </div>
                <div className="mt-1 text-2xl font-black text-white sm:text-3xl font-mono">
                  {newScore.toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          {/* Gap Status Transitions */}
          {gapsClosed.length > 0 && (
            <div className="mt-5 text-left">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 font-mono">
                Capabilities Closed & Covered:
              </div>
              <div className="space-y-1.5">
                {gapsClosed.map((gap) => (
                  <div
                    key={gap}
                    className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-200"
                  >
                    <span className="font-bold text-white">{gap}</span>
                    <span className="flex items-center gap-1 font-bold text-emerald-300 font-mono">
                      MISSING → <span className="underline text-emerald-400">COVERED</span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action button */}
          <div className="mt-6">
            <button
              id="dismiss-celebration-btn"
              onClick={onDismiss}
              className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-xl shadow-indigo-950 hover:bg-indigo-500 transition cursor-pointer active:scale-98"
            >
              Continue Optimizing Team
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
