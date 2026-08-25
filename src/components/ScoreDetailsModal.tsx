import React from 'react';
import { ScoreBreakdown } from '../types';
import {
  X,
  CheckCircle2,
  Cpu,
  Clock,
  HeartHandshake,
  Brain,
  Activity,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScoreDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  breakdown: ScoreBreakdown;
  teamCount: number;
}

export const ScoreDetailsModal: React.FC<ScoreDetailsModalProps> = ({
  isOpen,
  onClose,
  breakdown,
  teamCount,
}) => {
  if (!isOpen) return null;

  const subScores = [
    {
      label: 'Requirement Fulfillment',
      weight: '40%',
      val: breakdown.requirementFulfillment,
      icon: CheckCircle2,
      formula: 'Σ(bestCoverage_i × priorityWeight_i) / Σ(priorityWeight_i) × 100',
      desc: 'Measures how well the active team covers project-required capabilities according to priority weights (Critical: 1.0, Important: 0.7, Optional: 0.4).',
      color: 'bg-indigo-500',
      textColor: 'text-indigo-400',
    },
    {
      label: 'Complementarity',
      weight: '25%',
      val: breakdown.complementarity,
      icon: Cpu,
      formula: 'uniqueDomainStrength / totalDomainStrength × 100',
      desc: 'Penalizes redundant capability duplication and rewards diverse, non-overlapping skill coverage across unique domains.',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
    },
    {
      label: 'Availability',
      weight: '15%',
      val: breakdown.availability,
      icon: Clock,
      formula: 'Avg(memberAvailabilityScore)',
      desc: 'Calculates the average sprint time commitment readiness across the active roster (Full: 100, Mostly: 75, Limited: 40).',
      color: 'bg-sky-500',
      textColor: 'text-sky-400',
    },
    {
      label: 'Interest Alignment',
      weight: '10%',
      val: breakdown.interestAlignment,
      icon: HeartHandshake,
      formula: 'Proportion of shared project domain interests',
      desc: 'Evaluates passion and domain enthusiasm alignment with target project goals and problem spaces.',
      color: 'bg-purple-500',
      textColor: 'text-purple-400',
    },
    {
      label: 'Experience Depth',
      weight: '10%',
      val: breakdown.experience,
      icon: Brain,
      formula: 'Relevant skill levels + bounded years modifier',
      desc: 'Evaluates proficiency tier and years of experience across skills directly relevant to project needs.',
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/15 bg-[#111114] p-6 shadow-2xl sm:p-8 backdrop-blur-xl"
        >
          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="border-b border-white/10 pb-4">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-500/20 px-2.5 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30 font-mono">
              <Activity className="h-3.5 w-3.5" />
              <span>DETERMINISTIC SCORING ENGINE</span>
            </div>
            <h3 className="mt-2 text-2xl font-black text-white">
              Why This Score? (5-Pillar Breakdown)
            </h3>
            <p className="mt-1 text-xs text-gray-400">
              Team Fit is computed with zero random weights or LLM hallucination:
              <code className="ml-1 text-indigo-300 font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                0.40×Req + 0.25×Comp + 0.15×Avail + 0.10×Int + 0.10×Exp
              </code>
            </p>
          </div>

          {/* Total Score Hero */}
          <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
                CURRENT TEAM FIT SCORE
              </div>
              <div className="text-3xl font-black text-white font-mono mt-0.5">
                {breakdown.totalScore.toFixed(1)} <span className="text-base text-gray-400">/ 100</span>
              </div>
            </div>
            <div className="text-right text-xs text-gray-400">
              Evaluated across <strong className="text-white">{teamCount}</strong> active member(s)
            </div>
          </div>

          {/* Detailed Pillars */}
          <div className="mt-5 space-y-3">
            {subScores.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${pillar.textColor}`} />
                      <span className="text-sm font-bold text-white">{pillar.label}</span>
                      <span className="rounded bg-white/5 px-2 py-0.5 text-xs font-bold text-gray-400 border border-white/10 font-mono">
                        Weight: {pillar.weight}
                      </span>
                    </div>

                    <div className="text-base font-black text-white font-mono">
                      {pillar.val.toFixed(1)}%
                    </div>
                  </div>

                  {/* Progress track */}
                  <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full ${pillar.color}`}
                      style={{ width: `${pillar.val}%` }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                    {pillar.desc}
                  </p>

                  <div className="mt-2 text-[11px] font-mono text-gray-500 bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                    Formula: {pillar.formula}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Action */}
          <div className="mt-6 flex justify-end border-t border-white/10 pt-4">
            <button
              onClick={onClose}
              className="rounded-xl bg-white/10 px-5 py-2 text-xs font-bold text-white hover:bg-white/15 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
