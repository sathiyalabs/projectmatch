import React from 'react';
import { ArrowRight, ShieldCheck, Cpu, Zap } from 'lucide-react';

interface CinematicOpeningProps {
  onEnter: () => void;
  onBuildCustom: () => void;
}

export const CinematicOpening: React.FC<CinematicOpeningProps> = ({ onEnter, onBuildCustom }) => {
  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 py-12 overflow-hidden select-none">
      {/* Very subtle calm radial ambient lighting */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] rounded-full bg-indigo-600/10 blur-[140px] motion-safe:animate-pulse"
          style={{ animationDuration: '8s' }}
        />
        <div className="absolute h-[300px] w-[300px] rounded-full bg-purple-600/5 blur-[100px]" />
      </div>

      {/* Subtle fine dot grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Main Centered Cinematic Narrative */}
      <div className="relative z-10 max-w-3xl text-center space-y-8">
        
        {/* Central Brand Statement */}
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.12] font-sans">
            “GROWTH STARTS WITH
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-indigo-100 to-indigo-300">
              THE RIGHT ROOTS.”
            </span>
          </h1>
          <div className="text-xl sm:text-2xl font-black tracking-wider text-white font-mono flex items-center justify-center gap-1 pt-2">
            PROJECT<span className="text-indigo-400">MATCH</span>
          </div>
          <div className="text-xs sm:text-sm font-mono tracking-widest text-indigo-300 uppercase font-bold">
            TEAM INTELLIGENCE ENGINE
          </div>
          <p className="text-sm sm:text-base text-gray-300 max-w-lg mx-auto font-medium leading-relaxed pt-1">
            Build the foundation. Find the missing strengths. Grow a stronger team.
          </p>
        </div>

        {/* Thesis Callout */}
        <div
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 max-w-xl mx-auto backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both"
          style={{ animationDelay: '250ms' }}
        >
          <p className="text-xs sm:text-sm text-gray-300 font-mono italic leading-relaxed">
            "The best team is not the collection of the strongest individuals. It is the team with the right complementary capabilities."
          </p>
        </div>

        {/* Primary & Secondary Action CTAs */}
        <div
          className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 animate-in fade-in zoom-in-95 duration-700 fill-mode-both"
          style={{ animationDelay: '500ms' }}
        >
          <button
            id="enter-projectmatch-btn"
            onClick={onEnter}
            className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-8 py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-indigo-950/70 hover:bg-indigo-500 hover:shadow-indigo-900/90 transition-all duration-300 cursor-pointer active:scale-95"
          >
            <span>ENTER PROJECTMATCH</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          <button
            id="build-custom-project-btn"
            onClick={onBuildCustom}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-7 py-4 text-sm sm:text-base font-bold text-gray-200 hover:bg-white/10 hover:text-white hover:border-white/30 transition-all duration-300 cursor-pointer active:scale-95"
          >
            <span>BUILD YOUR OWN PROJECT</span>
            <ArrowRight className="h-4 w-4 text-indigo-400" />
          </button>
        </div>

        {/* Restrained Subtitle Badges */}
        <div
          className="pt-8 flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-gray-500 animate-in fade-in duration-700 fill-mode-both"
          style={{ animationDelay: '750ms' }}
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400/80" /> Deterministic Synergy
          </span>
          <span className="text-gray-700">•</span>
          <span className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-indigo-400/80" /> Zero Domain Inferences
          </span>
          <span className="text-gray-700">•</span>
          <span className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-indigo-400/80" /> Real-Time Simulation
          </span>
        </div>
      </div>
    </div>
  );
};
