import React from 'react';
import { Users, RotateCcw, ChevronLeft, ChevronRight, LayoutDashboard, Sparkles, Sliders } from 'lucide-react';

export type CinematicStep =
  | 'opening'
  | 'describe'
  | 'project'
  | 'currentTeam'
  | 'teamGaps'
  | 'bestMatch'
  | 'simulation'
  | 'comparison'
  | 'decision';

interface CinematicNavProps {
  currentStep: CinematicStep;
  onSelectStep: (step: CinematicStep) => void;
  onReset: () => void;
  onToggleViewMode: () => void;
  isWorkspaceMode: boolean;
  currentTeamCount: number;
  maxTeamSize: number;
  appMode?: 'guided' | 'custom';
  onSwitchMode?: (mode: 'guided' | 'custom') => void;
  hasCustomProject?: boolean;
}

const GUIDED_STEPS: { id: CinematicStep; label: string }[] = [
  { id: 'opening', label: 'STATEMENT' },
  { id: 'project', label: 'PROJECT' },
  { id: 'currentTeam', label: 'TEAM' },
  { id: 'teamGaps', label: 'GAPS' },
  { id: 'bestMatch', label: 'MATCH' },
  { id: 'simulation', label: 'SIMULATE' },
  { id: 'comparison', label: 'COMPARE' },
  { id: 'decision', label: 'DECIDE' },
];

const CUSTOM_STEPS: { id: CinematicStep; label: string }[] = [
  { id: 'describe', label: 'DESCRIBE' },
  { id: 'project', label: 'BLUEPRINT' },
  { id: 'currentTeam', label: 'TEAM' },
  { id: 'teamGaps', label: 'GAPS' },
  { id: 'comparison', label: 'CANDIDATES' },
  { id: 'simulation', label: 'SIMULATE' },
  { id: 'decision', label: 'DECIDE' },
];

export const CinematicNav: React.FC<CinematicNavProps> = ({
  currentStep,
  onSelectStep,
  onReset,
  onToggleViewMode,
  isWorkspaceMode,
  currentTeamCount,
  maxTeamSize,
  appMode = 'guided',
  onSwitchMode,
  hasCustomProject = false,
}) => {
  const steps = appMode === 'custom' ? CUSTOM_STEPS : GUIDED_STEPS;
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectStep(steps[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1].id;
      if (appMode === 'custom' && !hasCustomProject && nextStep !== 'describe') {
        return;
      }
      onSelectStep(nextStep);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A0A0B]/90 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectStep(appMode === 'custom' ? 'describe' : 'opening')}
            className="flex items-center gap-2 cursor-pointer text-left group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-950/50 group-hover:bg-indigo-500 transition">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-white font-mono flex items-center gap-1">
                PROJECT<span className="text-indigo-400">MATCH</span>
              </div>
              <div className="text-[9px] font-mono font-bold tracking-wider text-gray-400 uppercase hidden sm:block">
                TEAM INTELLIGENCE
              </div>
            </div>
          </button>

          {/* Mode Badge / Selector */}
          {onSwitchMode && (
            <div className="hidden lg:flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-xl p-0.5 ml-2">
              <button
                onClick={() => onSwitchMode('guided')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer ${
                  appMode === 'guided'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Guided Demo
              </button>
              <button
                onClick={() => onSwitchMode('custom')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer ${
                  appMode === 'custom'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Build Your Own
              </button>
            </div>
          )}
        </div>

        {/* Cinematic Step Progress Rail */}
        {currentStep !== 'opening' && (
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-full p-1 shadow-inner">
            {steps
              .filter((s) => s.id !== 'opening')
              .map((step) => {
                const isActive = currentStep === step.id;
                const thisIdx = steps.findIndex((x) => x.id === step.id);
                const isPast = currentIndex > thisIdx;
                const isDisabled = appMode === 'custom' && !hasCustomProject && step.id !== 'describe';

                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      if (!isDisabled) onSelectStep(step.id);
                    }}
                    disabled={isDisabled}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold transition-all ${
                      isDisabled
                        ? 'text-gray-600 opacity-40 cursor-not-allowed'
                        : isActive
                        ? 'bg-indigo-600 text-white shadow-sm cursor-pointer'
                        : isPast
                        ? 'text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer'
                        : 'text-gray-500 hover:text-gray-300 cursor-pointer'
                    }`}
                  >
                    <span>{step.label}</span>
                  </button>
                );
              })}
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Step Back / Next Arrow Buttons (when not opening) */}
          {currentStep !== 'opening' && currentIndex >= 0 && (
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-0.5">
              <button
                onClick={handlePrev}
                disabled={currentIndex <= 0}
                aria-label="Previous step"
                className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-[10px] font-mono text-gray-400 px-1 font-bold">
                {currentIndex + 1}/{steps.length}
              </span>
              <button
                onClick={handleNext}
                disabled={currentIndex >= steps.length - 1}
                aria-label="Next step"
                className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Roster Badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-xl bg-white/5 px-2.5 py-1 text-xs font-mono font-semibold text-gray-300 border border-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] text-gray-400">Roster:</span>
            <span className="font-bold text-indigo-300">{currentTeamCount}/{maxTeamSize}</span>
          </div>

          {/* Mode Switcher: Guided Story vs Full Cockpit */}
          <button
            onClick={onToggleViewMode}
            title={isWorkspaceMode ? 'Switch to Guided Story Experience' : 'Switch to Full Workspace Cockpit'}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold border transition cursor-pointer ${
              isWorkspaceMode
                ? 'border-indigo-500/50 bg-indigo-600 text-white shadow-md'
                : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{isWorkspaceMode ? 'Cockpit Mode' : 'Guided Flow'}</span>
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={onReset}
            title="Reset to Initial Demo State"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-2 text-xs text-gray-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
