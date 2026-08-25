import React from 'react';
import { Candidate } from '../types';
import {
  X,
  User,
  Briefcase,
  Clock,
  ExternalLink,
  Shield,
  Layers,
  Heart,
  UserPlus,
  Play,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileModalProps {
  candidate: Candidate | null;
  onClose: () => void;
  onSimulate?: (candidate: Candidate) => void;
  onAdd?: (candidate: Candidate) => void;
  isInTeam?: boolean;
  isTeamFull?: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  candidate,
  onClose,
  onSimulate,
  onAdd,
  isInTeam = false,
  isTeamFull = false,
}) => {
  if (!candidate) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/15 bg-[#111114] p-6 shadow-2xl sm:p-8 backdrop-blur-xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Profile Header */}
          <div className="flex items-start gap-4 border-b border-white/10 pb-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 font-bold text-white text-xl shadow-lg shadow-indigo-950 border border-indigo-400/30">
              {candidate.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">{candidate.name}</h3>
                {isInTeam && (
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30 font-mono">
                    Active Roster
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-indigo-400 font-mono">{candidate.role}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-400 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  {candidate.availability}
                </span>
                <span>•</span>
                <a
                  href={candidate.linkedinUrl || 'https://linkedin.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-indigo-400 hover:underline font-semibold"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">
              Personal Bio
            </div>
            <p className="mt-1 text-xs text-gray-300 leading-relaxed italic bg-white/[0.03] p-3 rounded-xl border border-white/10">
              "{candidate.bio}"
            </p>
          </div>

          {/* Skills Breakdown */}
          <div className="mt-5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 font-mono">
              Verified Technical Skills
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {candidate.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-xs"
                >
                  <span className="font-bold text-gray-200">{skill.name}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="rounded bg-indigo-500/20 border border-indigo-500/30 px-1.5 py-0.2 text-[10px] font-bold text-indigo-300">
                      {skill.level}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">{skill.years} yrs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Domains & Interests */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 font-mono">
                Capability Domains
              </div>
              <div className="flex flex-wrap gap-1.5">
                {candidate.domains.map((d) => (
                  <span
                    key={d}
                    className="rounded-lg bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 text-xs font-semibold text-indigo-300"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 font-mono">
                Interest Alignment
              </div>
              <div className="flex flex-wrap gap-1.5">
                {candidate.interests.map((i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-white/5 border border-white/10 px-2 py-0.5 text-xs font-medium text-gray-300"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex flex-wrap items-center justify-end gap-2 border-t border-white/10 pt-4">
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
            >
              Close
            </button>

            {!isInTeam && onSimulate && (
              <button
                onClick={() => {
                  onSimulate(candidate);
                  onClose();
                }}
                className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-indigo-400 text-indigo-400" />
                <span>Simulate Impact</span>
              </button>
            )}

            {!isInTeam && onAdd && (
              isTeamFull ? (
                <button
                  disabled
                  title="Target roster limit reached"
                  className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-xs font-bold text-gray-500 font-mono cursor-not-allowed opacity-60"
                >
                  <span>Roster Full</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onAdd(candidate);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xl shadow-indigo-950 hover:bg-indigo-500 transition cursor-pointer"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Add to Team</span>
                </button>
              )
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
