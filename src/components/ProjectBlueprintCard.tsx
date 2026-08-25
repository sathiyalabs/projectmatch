import React, { useState } from 'react';
import {
  Clock,
  Users,
  Edit3,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ProjectBlueprint, PriorityLevel } from '../types';

interface ProjectBlueprintCardProps {
  blueprint: ProjectBlueprint;
  onEdit: () => void;
  onOpenAiBuilder: () => void;
}

export const ProjectBlueprintCard: React.FC<ProjectBlueprintCardProps> = ({
  blueprint,
  onEdit,
  onOpenAiBuilder,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'Critical':
        return (
          <span className="rounded bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30 font-mono">
            Critical
          </span>
        );
      case 'Important':
        return (
          <span className="rounded bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30 font-mono">
            Important
          </span>
        );
      case 'Optional':
        return (
          <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-bold text-gray-400 border border-white/10 font-mono">
            Optional
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111114] p-4 sm:p-5 shadow-xl backdrop-blur-md">
      {/* Primary Clean Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">
              PROJECT
            </div>
            <h2 className="text-lg font-black text-white tracking-tight sm:text-xl">
              {blueprint.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 border-l border-white/10 pl-3 sm:pl-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-300 font-mono bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              <span>{blueprint.timeline}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-300 font-mono bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              <Users className="h-3.5 w-3.5 text-indigo-400" />
              <span>Target: {blueprint.teamSize} members</span>
            </div>
          </div>
        </div>

        {/* Blueprint Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-white transition cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-white/5"
          >
            <span>{isExpanded ? 'Hide Blueprint' : 'View Blueprint'}</span>
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          <button
            id="edit-blueprint-btn"
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-200 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5 text-gray-400" />
            <span>Edit</span>
          </button>

          <button
            id="ai-refine-btn"
            onClick={onOpenAiBuilder}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/25 transition cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">AI Builder</span>
          </button>
        </div>
      </div>

      {/* Expandable Blueprint Details (Secondary) */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3.5">
          <p className="text-xs text-gray-300 leading-relaxed max-w-3xl">
            {blueprint.goal}
          </p>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 font-mono">
                Required Capabilities & Priorities
              </div>
              <div className="flex flex-wrap gap-1.5">
                {blueprint.requiredCapabilities.map((cap) => {
                  const pObj = blueprint.priorities.find((p) => p.capability.toLowerCase() === cap.toLowerCase());
                  const priority = pObj ? pObj.priority : 'Critical';
                  return (
                    <div
                      key={cap}
                      className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-0.5 text-xs"
                    >
                      <span className="font-semibold text-gray-200">{cap}</span>
                      {getPriorityBadge(priority)}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 font-mono">
                Target Roles
              </div>
              <div className="flex flex-wrap gap-1.5">
                {blueprint.requiredRoles.map((role) => (
                  <span
                    key={role}
                    className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-xs font-medium text-indigo-300"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

