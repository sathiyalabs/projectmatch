import React, { useState } from 'react';
import { Candidate, Skill, AvailabilityStatus, SkillLevel } from '../types';
import { X, UserPlus, Sparkles, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (member: Candidate) => void;
  isCandidateMode?: boolean;
  isTeamFull?: boolean;
  teamSize?: number;
}

const AVAILABLE_DOMAINS = [
  'ML',
  'Frontend',
  'Backend',
  'Cloud',
  'Security',
  'Data',
  'UX',
  'Product',
];

const PRESET_PROFILES: Array<Omit<Candidate, 'id'>> = [
  {
    name: 'Sarah Chen',
    role: 'Full Stack Engineer',
    domains: ['Frontend', 'Backend'],
    availability: 'Full',
    bio: 'Full stack builder specialized in TypeScript, React, and Node.js microservices.',
    interests: ['AI', 'Startups', 'Education'],
    skills: [
      { name: 'React', level: 'Expert', years: 3 },
      { name: 'Node.js', level: 'Expert', years: 3 },
      { name: 'REST APIs', level: 'Intermediate', years: 2 },
    ],
  },
  {
    name: 'David Kim',
    role: 'Cloud Architect',
    domains: ['Cloud'],
    availability: 'Full',
    bio: 'Cloud and infrastructure specialist experienced in AWS container clusters.',
    interests: ['Cloud', 'DevOps'],
    skills: [
      { name: 'AWS', level: 'Expert', years: 4 },
      { name: 'Docker', level: 'Expert', years: 3 },
      { name: 'Terraform', level: 'Expert', years: 2 },
    ],
  },
  {
    name: 'Elena Rostova',
    role: 'Backend & Security Specialist',
    domains: ['Backend', 'Security'],
    availability: 'Partial',
    bio: 'Hardened API developer with deep background in authentication and threat models.',
    interests: ['Cybersecurity', 'AI'],
    skills: [
      { name: 'FastAPI', level: 'Expert', years: 3 },
      { name: 'API Security', level: 'Expert', years: 3 },
      { name: 'OWASP', level: 'Expert', years: 2 },
    ],
  },
  {
    name: 'Marcus Vance',
    role: 'ML Research Engineer',
    domains: ['ML'],
    availability: 'Full',
    bio: 'Specialist in deep neural networks, transformer pipelines, and NLP models.',
    interests: ['AI', 'Research'],
    skills: [
      { name: 'Python', level: 'Expert', years: 4 },
      { name: 'PyTorch', level: 'Expert', years: 3 },
      { name: 'NLP', level: 'Expert', years: 3 },
    ],
  },
];

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  isCandidateMode = false,
  isTeamFull = false,
  teamSize = 4,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [availability, setAvailability] = useState<AvailabilityStatus>('Full');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<Skill[]>([
    { name: '', level: 'Intermediate', years: 2 },
  ]);

  if (!isOpen) return null;

  const handleToggleDomain = (domain: string) => {
    setSelectedDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  };

  const handleAddSkillRow = () => {
    setSkills((prev) => [...prev, { name: '', level: 'Intermediate', years: 2 }]);
  };

  const handleRemoveSkillRow = (index: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSkillChange = (
    index: number,
    field: keyof Skill,
    value: string | number
  ) => {
    setSkills((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleLoadPreset = (preset: Omit<Candidate, 'id'>) => {
    setName(preset.name);
    setRole(preset.role);
    setSelectedDomains(preset.domains);
    setAvailability(preset.availability);
    setBio(preset.bio);
    setSkills(preset.skills);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!isCandidateMode && isTeamFull) return;

    const validSkills = skills.filter((s) => s.name.trim().length > 0);

    const newCandidate: Candidate = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim(),
      role: role.trim() || (isCandidateMode ? 'Candidate' : 'Team Member'),
      domains: selectedDomains.length > 0 ? selectedDomains : ['General'],
      availability,
      bio: bio.trim() || `${name} joined the custom workspace.`,
      interests: ['AI', 'Tech'],
      skills:
        validSkills.length > 0
          ? validSkills
          : [{ name: 'Core Engineering', level: 'Intermediate', years: 2 }],
    };

    onAdd(newCandidate);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/15 bg-[#111114] p-6 shadow-2xl sm:p-8 backdrop-blur-xl"
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
              <UserPlus className="h-3.5 w-3.5 text-indigo-400" />
              <span>{isCandidateMode ? 'CUSTOM CANDIDATE' : 'TEAM MEMBER CREATOR'}</span>
            </div>
            <h2 className="mt-2 text-xl sm:text-2xl font-black text-white font-sans">
              {isCandidateMode ? 'Add Candidate to Pool' : 'Add Team Member'}
            </h2>
            <p className="mt-1 text-xs text-gray-400 font-mono">
              Specify explicit domain tags. The deterministic engine evaluates capability strictly from domains.
            </p>
          </div>

          {!isCandidateMode && isTeamFull && (
            <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs font-mono text-amber-300">
              ⚠️ Note: The team roster is currently at capacity ({teamSize}/{teamSize} members). Adding this member will expand your team beyond target size.
            </div>
          )}

          {/* Preset Fillers */}
          <div className="mt-4 pt-2">
            <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              <span>Or Pick a Ready Template:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_PROFILES.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleLoadPreset(preset)}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-left hover:border-indigo-500/40 hover:bg-indigo-500/10 transition cursor-pointer"
                >
                  <div className="font-bold text-xs text-white truncate">{preset.name}</div>
                  <div className="text-[10px] text-gray-400 truncate">{preset.role}</div>
                  <div className="text-[9px] text-indigo-300 font-mono mt-1">
                    {preset.domains.join(' + ')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-gray-400 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-gray-400 mb-1">
                  Role Title
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Backend Engineer"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Explicit Domains Selector (CRITICAL) */}
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-indigo-300 mb-1.5">
                Explicit Capability Domains (Authoritative for Gap Closure) *
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_DOMAINS.map((domain) => {
                  const isSelected = selectedDomains.includes(domain);
                  return (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => handleToggleDomain(domain)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {isSelected ? '✓ ' : ''}{domain}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Availability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-gray-400 mb-1">
                  Availability Status
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as AvailabilityStatus)}
                  className="w-full rounded-xl border border-white/10 bg-[#141418] px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Full">Full (100% Commitment)</option>
                  <option value="Partial">Partial (75% Commitment)</option>
                  <option value="Limited">Limited (40% Commitment)</option>
                  <option value="Unavailable">Unavailable (0% Commitment)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-gray-400 mb-1">
                  Brief Bio / Context
                </label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Focuses on distributed event streaming."
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Dynamic Skills Rows */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-mono font-bold uppercase text-gray-400">
                  Skills & Tools
                </label>
                <button
                  type="button"
                  onClick={handleAddSkillRow}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3 w-3" /> Add Skill
                </button>
              </div>

              <div className="space-y-2">
                {skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => handleSkillChange(idx, 'name', e.target.value)}
                      placeholder="Skill name (e.g. FastAPI, AWS)"
                      className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                    <select
                      value={skill.level}
                      onChange={(e) =>
                        handleSkillChange(idx, 'level', e.target.value as SkillLevel)
                      }
                      className="w-32 rounded-lg border border-white/10 bg-[#141418] px-2 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                    {skills.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSkillRow(idx)}
                        className="p-1.5 text-gray-500 hover:text-rose-400 transition cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-mono font-bold text-gray-400 hover:bg-white/5 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isCandidateMode && isTeamFull}
                className={`rounded-xl px-6 py-2 text-xs font-mono font-bold transition shadow-lg ${
                  !isCandidateMode && isTeamFull
                    ? 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-950/50 cursor-pointer'
                }`}
              >
                {!isCandidateMode && isTeamFull
                  ? `Roster Full (${teamSize}/${teamSize})`
                  : isCandidateMode
                  ? 'Add to Candidates'
                  : 'Add to Current Team'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
