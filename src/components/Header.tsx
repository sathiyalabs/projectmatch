import React from 'react';
import { Users, Sparkles, RotateCcw, Zap, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenAiBuilder: () => void;
  onOpenScoreDetails: () => void;
  currentTeamCount: number;
  maxTeamSize: number;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onOpenAiBuilder,
  onOpenScoreDetails,
  currentTeamCount,
  maxTeamSize,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0A0A0B]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand & Core Philosophy */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-900/40">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-black tracking-tight text-white font-mono">
                PROJECT<span className="text-indigo-400">MATCH</span>
              </span>
              <span className="text-xs font-bold text-gray-400 font-mono tracking-wider">
                TEAM INTELLIGENCE
              </span>
            </div>
            <p className="text-[11px] font-medium text-gray-400">
              "We optimize the team, not the individual."
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Team Roster Pill */}
          <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-gray-300 border border-white/10 font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
            <span className="hidden sm:inline">Roster:</span>
            <span className="font-bold text-indigo-400">
              {currentTeamCount} / {maxTeamSize}
            </span>
          </div>

          <button
            id="open-score-details-header-btn"
            onClick={onOpenScoreDetails}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
            <span className="hidden sm:inline">Score Breakdown</span>
          </button>

          <button
            id="ai-builder-nav-btn"
            onClick={onOpenAiBuilder}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>AI Team Builder</span>
          </button>

          <button
            id="reset-team-btn"
            onClick={onReset}
            title="Reset to Initial Demo State"
            className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white border border-white/10 transition cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-gray-400" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};

