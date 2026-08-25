import React from 'react';
import { TeamGap, PriorityLevel, GapStatus } from '../types';
import {
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Flame,
  Sparkles,
} from 'lucide-react';

interface TeamGapAnalysisProps {
  gaps: TeamGap[];
  simulatedGapsClosed?: string[];
  simulatedCandidateName?: string;
}

export const TeamGapAnalysis: React.FC<TeamGapAnalysisProps> = ({
  gaps,
  simulatedGapsClosed = [],
  simulatedCandidateName,
}) => {
  const missingCount = gaps.filter((g) => g.status === 'MISSING').length;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111114] p-4 sm:p-5 shadow-xl backdrop-blur-md h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200 font-mono">
              TEAM CAPABILITY COVERAGE
            </h3>
          </div>

          <div className="text-xs font-bold font-mono">
            {missingCount > 0 ? (
              <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-rose-300 border border-rose-500/30 text-[11px]">
                {missingCount} MISSING
              </span>
            ) : (
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-emerald-300 border border-emerald-500/30 text-[11px]">
                ALL COVERED
              </span>
            )}
          </div>
        </div>

        {/* Clean Capability Coverage Matrix */}
        <div className="mt-3.5 space-y-3">
          {gaps.map((gap) => {
            const isMissing = gap.status === 'MISSING';
            const isStrong = gap.status === 'STRONGLY COVERED';
            const isSimClosed =
              isMissing &&
              simulatedGapsClosed.some(
                (gc) => gc.toLowerCase() === gap.capability.toLowerCase()
              );

            // Progress bar fill percentage
            const percentage = isStrong ? 100 : gap.status === 'PARTIALLY COVERED' ? 60 : isSimClosed ? 100 : 0;

            return (
              <div key={gap.capability} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide capitalize">
                      {gap.capability}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 uppercase">
                      ({gap.priority})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    {isSimClosed ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        <Sparkles className="h-3 w-3" />
                        <span>CLOSES IN SIM</span>
                      </span>
                    ) : isMissing ? (
                      <span className="inline-flex items-center gap-1 font-bold text-rose-400 bg-rose-500/15 px-1.5 py-0.5 rounded border border-rose-500/30">
                        <AlertCircle className="h-3 w-3" />
                        <span>MISSING</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        <span>COVERED</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Animated Visual Coverage Bar */}
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5 border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      isSimClosed
                        ? 'bg-gradient-to-r from-indigo-500 via-emerald-400 to-emerald-300 animate-pulse'
                        : isMissing
                        ? 'bg-rose-500/20 w-0'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info Strip */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400">
        <span>Missing capability penalty applied</span>
        <span className="text-gray-300 font-semibold">Priority Weighted</span>
      </div>
    </div>
  );
};
