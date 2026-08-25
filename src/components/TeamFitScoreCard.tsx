import React, { useEffect, useState } from 'react';
import { ScoreBreakdown } from '../types';
import {
  Activity,
  CheckCircle2,
  Cpu,
  Clock,
  HeartHandshake,
  Brain,
  Info,
} from 'lucide-react';
import { motion } from 'motion/react';

interface TeamFitScoreCardProps {
  breakdown: ScoreBreakdown;
  teamCount: number;
}

export const TeamFitScoreCard: React.FC<TeamFitScoreCardProps> = ({
  breakdown,
  teamCount,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Smooth numeric interpolation for live score updates
  useEffect(() => {
    let start = animatedScore;
    const end = breakdown.totalScore;
    const duration = 500;
    const startTime = performance.now();

    const updateScore = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuad
      const current = start + (end - start) * (1 - (1 - progress) * (1 - progress));
      setAnimatedScore(Math.round(current * 10) / 10);

      if (progress < 1) {
        requestAnimationFrame(updateScore);
      }
    };

    requestAnimationFrame(updateScore);
  }, [breakdown.totalScore]);

  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 60) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
    if (score >= 40) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  const getBadgeColor = (score: number) => {
    if (score >= 80) return 'text-emerald-300 bg-emerald-500/20 border border-emerald-500/30';
    if (score >= 60) return 'text-indigo-300 bg-indigo-500/20 border border-indigo-500/30';
    if (score >= 40) return 'text-amber-300 bg-amber-500/20 border border-amber-500/30';
    return 'text-rose-300 bg-rose-500/20 border border-rose-500/30';
  };

  const subScores = [
    {
      label: 'Requirement Fulfillment',
      weight: '40%',
      val: breakdown.requirementFulfillment,
      icon: CheckCircle2,
      desc: 'Critical & optional capability coverage',
      color: 'bg-indigo-500',
    },
    {
      label: 'Complementarity',
      weight: '25%',
      val: breakdown.complementarity,
      icon: Cpu,
      desc: 'Domain diversity vs. redundant duplication',
      color: 'bg-emerald-500',
    },
    {
      label: 'Availability',
      weight: '15%',
      val: breakdown.availability,
      icon: Clock,
      desc: 'Sprint time commitment readiness',
      color: 'bg-sky-500',
    },
    {
      label: 'Interest Alignment',
      weight: '10%',
      val: breakdown.interestAlignment,
      icon: HeartHandshake,
      desc: 'Shared mission and domain enthusiasm',
      color: 'bg-purple-500',
    },
    {
      label: 'Experience',
      weight: '10%',
      val: breakdown.experience,
      icon: Brain,
      desc: 'Relevant depth in required tech stack',
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111114] p-5 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
            TEAM FIT INTELLIGENCE
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-gray-400 font-mono">
          <Info className="h-3.5 w-3.5" />
          <span>Deterministic 5-Pillar Equation</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
        {/* Large Score Display */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#16161C] to-[#0F0F12] p-6 text-center lg:col-span-4 shadow-inner">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
            CURRENT TEAM FIT
          </div>

          <div className="relative my-2 flex items-baseline justify-center font-mono">
            <motion.span
              key={animatedScore}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="text-5xl font-black tracking-tight text-white sm:text-6xl"
            >
              {animatedScore.toFixed(1)}
            </motion.span>
            <span className="ml-1 text-xl font-bold text-gray-400">/ 100</span>
          </div>

          <div className="mt-1">
            <span
              className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold font-mono ${getBadgeColor(
                breakdown.totalScore
              )}`}
            >
              {breakdown.totalScore >= 80
                ? 'Optimized Team'
                : breakdown.totalScore >= 60
                ? 'Viable Team'
                : breakdown.totalScore >= 40
                ? 'Gaps Present'
                : 'Critical Shortage'}
            </span>
          </div>

          <p className="mt-3 text-xs text-gray-400">
            Calculated across <span className="font-semibold text-gray-200">{teamCount}</span> active roster member(s)
          </p>
        </div>

        {/* 5 Component Sub-Scores */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-8">
          {subScores.map((sub) => {
            const Icon = sub.icon;
            return (
              <div
                key={sub.label}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-200">{sub.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-[10px] font-bold text-gray-400">({sub.weight})</span>
                    <span className="text-xs font-bold text-white">{sub.val.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className={`h-full ${sub.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.max(0, sub.val))}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>

                <div className="mt-1.5 text-[10px] text-gray-400">{sub.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
