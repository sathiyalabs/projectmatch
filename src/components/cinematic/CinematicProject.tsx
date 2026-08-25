import React, { useState } from 'react';
import { ProjectBlueprint, PriorityLevel } from '../../types';
import {
  ArrowRight,
  Clock,
  Users,
  Target,
  Layers,
  Sparkles,
  Edit3,
  Check,
  Plus,
  Trash2,
} from 'lucide-react';

interface CinematicProjectProps {
  blueprint: ProjectBlueprint;
  onNext: () => void;
  onOpenAiBuilder: () => void;
  onUpdateBlueprint?: (blueprint: ProjectBlueprint) => void;
}

const ALL_DOMAINS = [
  'ML',
  'Frontend',
  'Backend',
  'Cloud',
  'Security',
  'Data',
  'UX',
  'Product',
];

export const CinematicProject: React.FC<CinematicProjectProps> = ({
  blueprint,
  onNext,
  onOpenAiBuilder,
  onUpdateBlueprint,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(blueprint.title);
  const [editedGoal, setEditedGoal] = useState(blueprint.goal);
  const [editedTimeline, setEditedTimeline] = useState(blueprint.timeline);
  const [editedTeamSize, setEditedTeamSize] = useState(blueprint.teamSize);
  const [editedPriorities, setEditedPriorities] = useState(blueprint.priorities);

  // Sync state whenever blueprint prop changes
  React.useEffect(() => {
    setEditedTitle(blueprint.title);
    setEditedGoal(blueprint.goal);
    setEditedTimeline(blueprint.timeline);
    setEditedTeamSize(blueprint.teamSize);
    setEditedPriorities(blueprint.priorities);
    setIsEditing(false);
  }, [blueprint]);

  const handleSave = () => {
    if (onUpdateBlueprint) {
      onUpdateBlueprint({
        ...blueprint,
        title: editedTitle.trim() || 'Custom Project',
        goal: editedGoal.trim() || 'Project objective',
        timeline: editedTimeline.trim() || 'Flexible Timeline',
        teamSize: editedTeamSize,
        priorities: editedPriorities,
        requiredCapabilities: editedPriorities.map((p) => p.capability),
      });
    }
    setIsEditing(false);
  };

  const handleToggleDomain = (domain: string) => {
    const exists = editedPriorities.find((p) => p.capability === domain);
    if (exists) {
      setEditedPriorities((prev) => prev.filter((p) => p.capability !== domain));
    } else {
      setEditedPriorities((prev) => [
        ...prev,
        { capability: domain, priority: 'Critical' },
      ]);
    }
  };

  const handleTogglePriority = (domain: string) => {
    setEditedPriorities((prev) =>
      prev.map((p) => {
        if (p.capability === domain) {
          const nextPriority: PriorityLevel =
            p.priority === 'Critical' ? 'Important' : 'Critical';
          return { ...p, priority: nextPriority };
        }
        return p;
      })
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Category Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-indigo-400 uppercase">
            01 / PROJECT BLUEPRINT
          </span>
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-indigo-500 bg-black/60 px-3 py-1.5 text-2xl sm:text-3xl font-black text-white font-sans focus:outline-none"
            />
          ) : (
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1 font-sans">
              {blueprint.title}
            </h2>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-mono font-bold text-gray-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            {isEditing ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Save Edits</span>
              </>
            ) : (
              <>
                <Edit3 className="h-3.5 w-3.5 text-indigo-400" />
                <span>Edit Blueprint</span>
              </>
            )}
          </button>
          <button
            onClick={onOpenAiBuilder}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2 text-xs font-mono font-bold text-indigo-300 hover:bg-indigo-500/20 transition cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">AI Describe</span>
          </button>
        </div>
      </div>

      {/* Goal & Description */}
      <div className="py-8 space-y-6">
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 sm:p-8 backdrop-blur-md shadow-xl">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-indigo-400" />
              <span>PROJECT OBJECTIVE</span>
            </div>
            {isEditing && (
              <span className="text-[10px] text-indigo-400 font-mono">Editing Mode</span>
            )}
          </div>
          {isEditing ? (
            <textarea
              rows={3}
              value={editedGoal}
              onChange={(e) => setEditedGoal(e.target.value)}
              className="mt-3 w-full rounded-xl border border-indigo-500 bg-black/60 p-3 text-sm sm:text-base text-white focus:outline-none font-sans leading-relaxed"
            />
          ) : (
            <p className="mt-3 text-lg sm:text-xl text-gray-200 font-medium leading-relaxed">
              "{blueprint.goal}"
            </p>
          )}
        </div>

        {/* Metadata Rail */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono font-bold text-gray-400 uppercase">Timeline</div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedTimeline}
                  onChange={(e) => setEditedTimeline(e.target.value)}
                  className="mt-0.5 w-full rounded border border-white/10 bg-black/40 px-2 py-0.5 text-xs text-white font-mono"
                />
              ) : (
                <div className="text-sm font-bold text-white font-mono">{blueprint.timeline.toUpperCase()}</div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono font-bold text-gray-400 uppercase">Target Roster</div>
              {isEditing ? (
                <select
                  value={editedTeamSize}
                  onChange={(e) => setEditedTeamSize(Number(e.target.value))}
                  className="mt-0.5 w-full rounded border border-white/10 bg-[#141418] px-2 py-0.5 text-xs text-white font-mono"
                >
                  <option value={2}>2 Members Total</option>
                  <option value={3}>3 Members Total</option>
                  <option value={4}>4 Members Total</option>
                  <option value={5}>5 Members Total</option>
                  <option value={6}>6 Members Total</option>
                  <option value={7}>7 Members Total</option>
                  <option value={8}>8 Members Total</option>
                  <option value={9}>9 Members Total</option>
                  <option value={10}>10 Members Total</option>
                </select>
              ) : (
                <div className="text-sm font-bold text-white font-mono">{blueprint.teamSize} MEMBERS TOTAL</div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-gray-400 uppercase">Required Domains</div>
              <div className="text-sm font-bold text-white font-mono">
                {isEditing ? editedPriorities.length : blueprint.priorities.length} CAPABILITIES
              </div>
            </div>
          </div>
        </div>

        {/* Priority Requirements Tags */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
              Deterministic Capability Requirements
            </div>
            {isEditing && (
              <span className="text-[10px] text-gray-400 font-mono">
                Click domain to toggle • Click badge to toggle Critical / Important
              </span>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {ALL_DOMAINS.map((domain) => {
                  const req = editedPriorities.find((p) => p.capability === domain);
                  const isSelected = !!req;

                  return (
                    <div key={domain} className="inline-flex items-center rounded-lg border border-white/10 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => handleToggleDomain(domain)}
                        className={`px-3 py-1.5 text-xs font-mono font-bold transition cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{domain}
                      </button>
                      {isSelected && (
                        <button
                          type="button"
                          onClick={() => handleTogglePriority(domain)}
                          className={`px-2 py-1.5 text-[10px] font-mono font-bold uppercase transition cursor-pointer border-l border-white/20 ${
                            req.priority === 'Critical'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-indigo-500/20 text-indigo-300'
                          }`}
                        >
                          {req.priority}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {blueprint.priorities.map((item) => (
                <span
                  key={item.capability}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-bold border ${
                    item.priority === 'Critical'
                      ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                      : 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
                  }`}
                >
                  <span>{item.capability}</span>
                  <span className="text-[10px] opacity-75 font-normal uppercase">({item.priority})</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Primary CTA */}
      <div className="pt-4 flex justify-end gap-3">
        {isEditing && (
          <button
            onClick={handleSave}
            className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition cursor-pointer"
          >
            Save Changes
          </button>
        )}
        <button
          id="define-team-btn"
          onClick={() => {
            if (isEditing) handleSave();
            onNext();
          }}
          className="inline-flex items-center gap-2.5 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-950/60 hover:bg-indigo-500 transition cursor-pointer active:scale-95"
        >
          <span>CONFIRM & BUILD TEAM</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
