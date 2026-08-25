import React from 'react';
import { Candidate } from '../types';
import { Users, UserMinus, ExternalLink, ShieldCheck } from 'lucide-react';

interface CurrentTeamListProps {
  team: Candidate[];
  onRemoveMember: (id: string) => void;
  onViewProfile: (candidate: Candidate) => void;
  maxTeamSize: number;
}

export const CurrentTeamList: React.FC<CurrentTeamListProps> = ({
  team,
  onRemoveMember,
  onViewProfile,
  maxTeamSize,
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111114] p-4 sm:p-5 shadow-xl backdrop-blur-md h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200 font-mono">
              CURRENT ROSTER
            </h3>
          </div>
          <div className="text-xs font-bold text-gray-400 font-mono">
            <span className="text-indigo-400">{team.length}</span> / {maxTeamSize} Members
          </div>
        </div>

        {/* Compact Team Member Chips / Nodes */}
        {team.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-white/10 p-5 text-center bg-white/[0.02]">
            <p className="text-xs font-semibold text-gray-300">Roster is empty</p>
            <p className="mt-1 text-[11px] text-gray-400">
              Add candidates below to form your core team.
            </p>
          </div>
        ) : (
          <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {team.map((member) => (
              <div
                key={member.id}
                className="group relative flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div
                  onClick={() => onViewProfile(member)}
                  className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/30 text-xs font-mono">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-xs truncate group-hover:text-indigo-300 transition">
                        {member.name}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono truncate">
                      {member.role}
                    </div>
                    <div className="text-[9px] text-indigo-400/80 font-mono mt-0.5">
                      {member.domains.join(' + ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 pl-1">
                  <button
                    onClick={() => onViewProfile(member)}
                    className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
                    title="View Profile"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => onRemoveMember(member.id)}
                    className="rounded p-1 text-gray-400 hover:bg-rose-500/20 hover:text-rose-300 transition cursor-pointer"
                    title="Remove from Team"
                  >
                    <UserMinus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
          <span>Active core capacity:</span>
        </span>
        <span className="text-gray-300 font-semibold">
          {team.map((m) => m.name.split(' ')[0]).join(', ') || 'None'}
        </span>
      </div>
    </div>
  );
};
