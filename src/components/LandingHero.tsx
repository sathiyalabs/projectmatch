import React from 'react';
import {
  ArrowRight,
  Zap,
  Sparkles,
  Layers,
  Users2,
  AlertCircle,
  TrendingUp,
  Award,
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingHeroProps {
  onTryDemo: () => void;
  onOpenAiBuilder: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onTryDemo,
  onOpenAiBuilder,
}) => {
  const steps = [
    {
      label: 'PROJECT',
      desc: 'Requirements & Roles',
      icon: Layers,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    },
    {
      label: 'CURRENT TEAM',
      desc: 'Existing Capabilities',
      icon: Users2,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    },
    {
      label: 'TEAM GAP',
      desc: 'Missing Capabilities',
      icon: AlertCircle,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      label: 'TEAM IMPACT',
      desc: 'Net Team Improvement',
      icon: TrendingUp,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      label: 'BETTER TEAM',
      desc: 'Complete & Optimized',
      icon: Award,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    },
  ];

  return (
    <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#0F0F12] via-[#0A0A0B] to-[#0A0A0B] py-14 px-4 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-5xl text-center">
        {/* Core Tagline Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 shadow-xl mb-6 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Don't just find a person. Find what the team is missing.</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          The right project deserves the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200">right team</span>.
        </h1>

        {/* Subheading */}
        <p className="mx-auto mt-5 max-w-2xl text-base text-gray-400 sm:text-lg leading-relaxed">
          ProjectMatch understands what your project needs, identifies what your team is missing,
          and finds the people who make it stronger.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            id="hero-try-demo-btn"
            onClick={onTryDemo}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-950 hover:bg-indigo-500 transition active:scale-98 cursor-pointer"
          >
            <Zap className="h-4 w-4 text-amber-300 fill-amber-300" />
            <span>TRY DEMO (AI Campus Assistant)</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            id="hero-build-team-btn"
            onClick={onOpenAiBuilder}
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-gray-200 shadow-sm transition hover:bg-white/10 hover:text-white active:scale-98 cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>BUILD MY TEAM</span>
          </button>
        </div>

        {/* Visual Equation / Flow Pipeline */}
        <div className="mt-14 rounded-2xl border border-white/10 bg-[#111114] p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-6 font-mono">
            The ProjectMatch Intelligence Pipeline
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 sm:gap-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="relative flex flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${step.color} shadow-lg`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-3 text-xs font-bold tracking-tight text-white font-mono">
                    {step.label}
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium text-center mt-0.5">
                    {step.desc}
                  </div>

                  {index < steps.length - 1 && (
                    <div className="hidden sm:block absolute -right-2 top-4 transform translate-x-1/2 text-gray-600">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Value comparison banner */}
          <div className="mt-7 rounded-xl border border-white/5 bg-white/[0.03] p-4 text-center text-xs text-gray-300 sm:text-sm">
            <span className="font-semibold text-gray-400">Traditional Match:</span> "Who matches this project?" →{' '}
            <span className="font-bold text-indigo-400">ProjectMatch:</span> "Who makes{' '}
            <span className="underline decoration-indigo-500 underline-offset-4 text-white font-bold">THIS TEAM</span> better?"
          </div>
        </div>
      </div>
    </div>
  );
};
