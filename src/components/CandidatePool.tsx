import React, { useState } from 'react';
import { CandidateImpactResult, Candidate } from '../types';
import { CandidateCard } from './CandidateCard';
import {
  Users2,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';

interface CandidatePoolProps {
  impactResults: CandidateImpactResult[];
  onSimulate: (candidate: Candidate) => void;
  onAdd: (candidate: Candidate) => void;
  onViewProfile: (candidate: Candidate) => void;
  activeSimulatedCandidateId?: string | null;
  isTeamFull?: boolean;
}

export const CandidatePool: React.FC<CandidatePoolProps> = ({
  impactResults,
  onSimulate,
  onAdd,
  onViewProfile,
  activeSimulatedCandidateId,
  isTeamFull = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [showAllCandidates, setShowAllCandidates] = useState(false);

  // Top candidates: usually the first 2-4 candidates (including Karthik and Rahul)
  // Let's filter first
  const filteredResults = impactResults.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.candidate.name.toLowerCase().includes(q) ||
      item.candidate.role.toLowerCase().includes(q) ||
      item.candidate.skills.some((s) => s.name.toLowerCase().includes(q)) ||
      item.candidate.domains.some((d) => d.toLowerCase().includes(q));

    const matchesDomain =
      selectedDomain === 'ALL' ||
      item.candidate.domains.map((d) => d.toUpperCase()).includes(selectedDomain.toUpperCase());

    return matchesSearch && matchesDomain;
  });

  // Unique domains
  const allDomains = Array.from(
    new Set(impactResults.flatMap((r) => r.candidate.domains))
  );

  // If no search or filter is active, we can feature the top candidates first
  const isFiltering = searchQuery.trim().length > 0 || selectedDomain !== 'ALL';
  const displayedCandidates = isFiltering || showAllCandidates ? filteredResults : filteredResults.slice(0, 4);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111114] p-5 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users2 className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-black tracking-tight text-white font-mono">
              WHO SHOULD JOIN?
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-gray-400">
            Ranked by <strong className="text-white font-semibold">Team Impact</strong>, not individual skill.
          </p>
        </div>

        {/* Core Thesis Highlight */}
        <div className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-300 font-mono">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
          <span>Team Equation: TEAM + CANDIDATE → NEW FIT</span>
        </div>
      </div>

      {/* Candidates Grid */}
      {filteredResults.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-white/10 p-8 text-center text-gray-400 text-sm">
          No candidates match the current filter.
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {displayedCandidates.map((result, index) => (
            <CandidateCard
              key={result.candidate.id}
              impactResult={result}
              onSimulate={onSimulate}
              onAdd={onAdd}
              onViewProfile={onViewProfile}
              isSimulatingActive={activeSimulatedCandidateId === result.candidate.id}
              isAnySimulationActive={!!activeSimulatedCandidateId}
              isTopRanked={index === 0}
              isTeamFull={isTeamFull}
            />
          ))}
        </div>
      )}

      {/* Toggle View More or Explore Filter Section */}
      {!isFiltering && filteredResults.length > 4 && (
        <div className="mt-5 text-center">
          <button
            onClick={() => setShowAllCandidates(!showAllCandidates)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <span>{showAllCandidates ? 'Show Top Recommendations Only' : `View All Candidates (${filteredResults.length})`}</span>
            {showAllCandidates ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      )}

      {/* Compact Secondary Search & Domain Filter Bar */}
      <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search candidate name, role, skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-gray-500 focus:border-indigo-500 focus:bg-white/10 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[11px] font-bold text-gray-400 mr-1 font-mono">Domain:</span>
          <button
            onClick={() => setSelectedDomain('ALL')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer font-mono ${
              selectedDomain === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
            }`}
          >
            All
          </button>
          {allDomains.map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer font-mono ${
                selectedDomain === domain
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

