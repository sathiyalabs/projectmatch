import React, { useState, useMemo } from 'react';
import { Candidate, ProjectBlueprint, CandidateImpactResult } from './types';
import {
  INITIAL_DEMO_TEAM,
  INITIAL_CANDIDATES,
  DEMO_PROJECT_BLUEPRINT,
} from './engine/seedData';
import {
  calculateTeamScore,
  identifyTeamGaps,
  calculateCandidateImpacts,
  calculateTeamImpact,
} from './engine/scoring';

// Cinematic Guided Experience Components
import { CinematicNav, CinematicStep } from './components/cinematic/CinematicNav';
import { CinematicOpening } from './components/cinematic/CinematicOpening';
import { CinematicCustomDescribe } from './components/cinematic/CinematicCustomDescribe';
import { CinematicProject } from './components/cinematic/CinematicProject';
import { CinematicCurrentTeam } from './components/cinematic/CinematicCurrentTeam';
import { CinematicTeamGaps } from './components/cinematic/CinematicTeamGaps';
import { CinematicBestMatch } from './components/cinematic/CinematicBestMatch';
import { CinematicSimulation } from './components/cinematic/CinematicSimulation';
import { CinematicComparison } from './components/cinematic/CinematicComparison';
import { CinematicDecision } from './components/cinematic/CinematicDecision';

// Modals
import { AddMemberModal } from './components/AddMemberModal';

// Workspace / Full Cockpit Components (available in Cockpit Mode)
import { ProjectBlueprintCard } from './components/ProjectBlueprintCard';
import { TeamTransformationHero } from './components/TeamTransformationHero';
import { TeamGapAnalysis } from './components/TeamGapAnalysis';
import { CurrentTeamList } from './components/CurrentTeamList';
import { CandidatePool } from './components/CandidatePool';
import { SimulationDrawer } from './components/SimulationDrawer';
import { ProfileModal } from './components/ProfileModal';
import { BlueprintEditorModal } from './components/BlueprintEditorModal';
import { AiExtractionModal } from './components/AiExtractionModal';
import { ScoreDetailsModal } from './components/ScoreDetailsModal';
import { BeforeAfterCelebration } from './components/BeforeAfterCelebration';
import { Activity, HelpCircle, UserPlus } from 'lucide-react';

export default function App() {
  // App Mode: 'guided' (Demo walkthrough with Arjun & Priya) vs 'custom' (Build your own project & team from scratch)
  const [appMode, setAppMode] = useState<'guided' | 'custom'>('guided');

  // 1. GUIDED DEMO STATE (Strictly preserved seeded data)
  const [demoProject, setDemoProject] = useState<ProjectBlueprint>(DEMO_PROJECT_BLUEPRINT);
  const [demoCurrentTeam, setDemoCurrentTeam] = useState<Candidate[]>(INITIAL_DEMO_TEAM);
  const [demoCandidates, setDemoCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);

  // 2. CUSTOM MODE STATE (Completely isolated user data, with sample demonstration pool)
  const [customProject, setCustomProject] = useState<ProjectBlueprint | null>(null);
  const [customCurrentTeam, setCustomCurrentTeam] = useState<Candidate[]>([]);
  const [customCandidates, setCustomCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);

  // Progressive Disclosure State (Cinematic Story vs Workspace Cockpit)
  const [currentStep, setCurrentStep] = useState<CinematicStep>('opening');
  const [isWorkspaceMode, setIsWorkspaceMode] = useState(false);

  // Active Simulation & Modals
  const [simulatedResult, setSimulatedResult] = useState<CandidateImpactResult | null>(null);
  const [profileCandidate, setProfileCandidate] = useState<Candidate | null>(null);
  const [isBlueprintEditorOpen, setIsBlueprintEditorOpen] = useState(false);
  const [isAiExtractorOpen, setIsAiExtractorOpen] = useState(false);
  const [isScoreDetailsOpen, setIsScoreDetailsOpen] = useState(false);
  const [celebrationResult, setCelebrationResult] = useState<CandidateImpactResult | null>(null);

  // Add Member / Candidate Modals
  const [isAddTeamMemberOpen, setIsAddTeamMemberOpen] = useState(false);
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);

  // Active State Resolution
  const activeProject = appMode === 'custom' ? customProject : demoProject;
  const activeCurrentTeam = appMode === 'custom' ? customCurrentTeam : demoCurrentTeam;
  const activeCandidates = appMode === 'custom' ? customCandidates : demoCandidates;

  // Derived calculations (Pure, Deterministic)
  const teamScore = useMemo(() => {
    if (!activeProject) {
      return {
        totalScore: 0,
        capabilityScore: 0,
        skillScore: 0,
        availabilityScore: 0,
        interestScore: 0,
        balanceScore: 0,
        fulfilledCapabilities: [],
        missingCapabilities: [],
      };
    }
    return calculateTeamScore(activeProject, activeCurrentTeam);
  }, [activeProject, activeCurrentTeam]);

  const teamGaps = useMemo(() => {
    if (!activeProject) return [];
    return identifyTeamGaps(activeProject, activeCurrentTeam);
  }, [activeProject, activeCurrentTeam]);

  const candidateImpacts = useMemo(() => {
    if (!activeProject) return [];
    return calculateCandidateImpacts(activeProject, activeCurrentTeam, activeCandidates);
  }, [activeProject, activeCurrentTeam, activeCandidates]);

  // Top candidate impact
  const topCandidateImpact = candidateImpacts.length > 0 ? candidateImpacts[0] : null;

  // Active simulated candidate or default top candidate
  const activeSimCandidate =
    simulatedResult?.candidate ||
    (topCandidateImpact ? topCandidateImpact.candidate : activeCandidates[0] || null);

  const activeSimulationImpact = useMemo(() => {
    if (!activeProject || !activeSimCandidate) return null;
    return calculateTeamImpact(activeProject, activeCurrentTeam, activeSimCandidate);
  }, [activeProject, activeCurrentTeam, activeSimCandidate]);

  // Start Custom Mode
  const handleStartCustomMode = () => {
    setAppMode('custom');
    if (!customProject) {
      setCurrentStep('describe');
    }
    setSimulatedResult(null);
    setProfileCandidate(null);
    setCelebrationResult(null);
    setIsWorkspaceMode(false);
  };

  // Start Guided Demo (restores demo state)
  const handleStartGuidedDemo = () => {
    setAppMode('guided');
    setSimulatedResult(null);
    setProfileCandidate(null);
    setCelebrationResult(null);
    setCurrentStep('opening');
    setIsWorkspaceMode(false);
  };

  // Reset current mode state
  const handleReset = () => {
    if (appMode === 'custom') {
      setCustomProject(null);
      setCustomCurrentTeam([]);
      setCustomCandidates(INITIAL_CANDIDATES);
      setCurrentStep('describe');
      setSimulatedResult(null);
      setCelebrationResult(null);
    } else {
      setDemoProject(DEMO_PROJECT_BLUEPRINT);
      setDemoCurrentTeam(INITIAL_DEMO_TEAM);
      setDemoCandidates(INITIAL_CANDIDATES);
      setCurrentStep('opening');
      setSimulatedResult(null);
      setCelebrationResult(null);
    }
  };

  // Switch modes from navigation
  const handleSwitchMode = (mode: 'guided' | 'custom') => {
    if (mode === 'custom') {
      handleStartCustomMode();
    } else {
      handleStartGuidedDemo();
    }
  };

  // Add Candidate to Team
  const handleAddCandidate = (candidate: Candidate) => {
    if (!activeProject) return;
    if (activeCurrentTeam.length >= activeProject.teamSize) return;
    const impact = calculateTeamImpact(activeProject, activeCurrentTeam, candidate);

    if (appMode === 'custom') {
      setCustomCurrentTeam((prev) => {
        if (prev.length >= activeProject.teamSize) return prev;
        return [...prev, candidate];
      });
      setCustomCandidates((prev) => prev.filter((c) => c.id !== candidate.id));
    } else {
      setDemoCurrentTeam((prev) => {
        if (prev.length >= activeProject.teamSize) return prev;
        return [...prev, candidate];
      });
      setDemoCandidates((prev) => prev.filter((c) => c.id !== candidate.id));
    }

    setSimulatedResult(null);
    setCelebrationResult(impact);
  };

  // Direct Add custom member to team
  const handleAddCustomMember = (member: Candidate) => {
    if (!activeProject) return;
    if (activeCurrentTeam.length >= activeProject.teamSize) return;
    if (appMode === 'custom') {
      setCustomCurrentTeam((prev) => {
        if (prev.length >= activeProject.teamSize) return prev;
        return [...prev, member];
      });
    } else {
      setDemoCurrentTeam((prev) => {
        if (prev.length >= activeProject.teamSize) return prev;
        return [...prev, member];
      });
    }
  };

  // Direct Add custom candidate to pool
  const handleAddCustomCandidate = (cand: Candidate) => {
    if (appMode === 'custom') {
      setCustomCandidates((prev) => [cand, ...prev]);
    } else {
      setDemoCandidates((prev) => [cand, ...prev]);
    }
  };

  // Remove Candidate from Team (returns candidate back to pool)
  const handleRemoveCandidate = (candidateId: string) => {
    if (appMode === 'custom') {
      const removedMember = customCurrentTeam.find((c) => c.id === candidateId);
      if (!removedMember) return;
      setCustomCurrentTeam((prev) => prev.filter((c) => c.id !== candidateId));
      setCustomCandidates((prev) => [...prev, removedMember]);
    } else {
      const removedMember = demoCurrentTeam.find((c) => c.id === candidateId);
      if (!removedMember) return;
      setDemoCurrentTeam((prev) => prev.filter((c) => c.id !== candidateId));
      setDemoCandidates((prev) => [...prev, removedMember]);
    }
    setSimulatedResult(null);
  };

  // Handle Simulation
  const handleSimulate = (candidate: Candidate) => {
    if (!activeProject) return;
    const impact = calculateTeamImpact(activeProject, activeCurrentTeam, candidate);
    setSimulatedResult(impact);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-gray-100 flex flex-col font-sans antialiased selection:bg-indigo-950 selection:text-indigo-200">
      
      {/* Sleek Progressive Navigation */}
      <CinematicNav
        currentStep={currentStep}
        onSelectStep={(step) => {
          if (appMode === 'custom' && !customProject && step !== 'describe') {
            return;
          }
          setCurrentStep(step);
          setIsWorkspaceMode(false);
        }}
        onReset={handleReset}
        onToggleViewMode={() => setIsWorkspaceMode((prev) => !prev)}
        isWorkspaceMode={isWorkspaceMode}
        currentTeamCount={activeCurrentTeam.length}
        maxTeamSize={activeProject?.teamSize || 4}
        appMode={appMode}
        onSwitchMode={handleSwitchMode}
        hasCustomProject={!!customProject}
      />

      {/* Progressive Disclosure Guided Experience vs Cockpit */}
      <main className="flex-1 flex flex-col justify-center">
        {isWorkspaceMode && activeProject ? (
          /* WORKSPACE COCKPIT MODE (Full Dashboard view for exploration) */
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 space-y-6 animate-in fade-in duration-300 pb-16 w-full">
            
            {/* Project Blueprint & Live Score Card */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <ProjectBlueprintCard
                  blueprint={activeProject}
                  onEdit={() => setIsBlueprintEditorOpen(true)}
                  onOpenAiBuilder={() => setIsAiExtractorOpen(true)}
                />
              </div>

              <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-[#111114] p-4 sm:p-5 shadow-xl backdrop-blur-md flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                    <Activity className="h-3.5 w-3.5 text-indigo-400" />
                    <span>CURRENT TEAM FIT</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5 font-mono">
                    <span className="text-3xl font-black text-white sm:text-4xl">
                      {teamScore.totalScore.toFixed(1)}
                    </span>
                    <span className="text-xs font-semibold text-gray-400">/ 100</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddTeamMemberOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 transition cursor-pointer"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>Add Member</span>
                  </button>
                  <button
                    id="open-score-details-pill-btn"
                    onClick={() => setIsScoreDetailsOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
                  >
                    <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Central Transformation Engine */}
            <TeamTransformationHero
              blueprint={activeProject}
              currentTeam={activeCurrentTeam}
              teamScore={teamScore}
              teamGaps={teamGaps}
              candidateImpacts={candidateImpacts}
              activeSimulatedResult={simulatedResult}
              onSimulateCandidate={handleSimulate}
              onClearSimulation={() => setSimulatedResult(null)}
              onAddCandidate={handleAddCandidate}
              onOpenScoreDetails={() => setIsScoreDetailsOpen(true)}
            />

            {/* Roster & Capabilities Grid */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <CurrentTeamList
                  team={activeCurrentTeam}
                  onRemoveMember={handleRemoveCandidate}
                  onViewProfile={(cand) => setProfileCandidate(cand)}
                  maxTeamSize={activeProject.teamSize}
                />
              </div>

              <div className="lg:col-span-6">
                <TeamGapAnalysis
                  gaps={teamGaps}
                  simulatedGapsClosed={simulatedResult?.gapsClosed}
                  simulatedCandidateName={simulatedResult?.candidate.name}
                />
              </div>
            </div>

            {/* Candidate Pool */}
            <CandidatePool
              impactResults={candidateImpacts}
              onSimulate={handleSimulate}
              onAdd={handleAddCandidate}
              onViewProfile={(cand) => setProfileCandidate(cand)}
              activeSimulatedCandidateId={simulatedResult?.candidate.id}
              isTeamFull={activeCurrentTeam.length >= (activeProject?.teamSize || 4)}
            />
          </div>
        ) : (
          /* CINEMATIC GUIDED PROGRESSIVE NARRATIVE */
          <div className="w-full flex-1 flex flex-col justify-center">
            {(currentStep === 'opening' || (appMode === 'guided' && currentStep === 'describe')) && (
              <CinematicOpening
                onEnter={() => setCurrentStep('project')}
                onBuildCustom={handleStartCustomMode}
              />
            )}

            {(currentStep === 'describe' || (appMode === 'custom' && !customProject)) && (
              <CinematicCustomDescribe
                onBlueprintExtracted={(extracted) => {
                  setCustomProject(extracted);
                  setCurrentStep('project');
                }}
                onSwitchToGuidedDemo={handleStartGuidedDemo}
              />
            )}

            {currentStep === 'project' && activeProject && (
              <CinematicProject
                blueprint={activeProject}
                onNext={() => setCurrentStep('currentTeam')}
                onOpenAiBuilder={() => setIsAiExtractorOpen(true)}
                onUpdateBlueprint={(updated) => {
                  if (appMode === 'custom') {
                    setCustomProject(updated);
                  } else {
                    setDemoProject(updated);
                  }
                }}
              />
            )}

            {currentStep === 'currentTeam' && activeProject && (
              <CinematicCurrentTeam
                currentTeam={activeCurrentTeam}
                teamScore={teamScore}
                teamGaps={teamGaps}
                maxTeamSize={activeProject.teamSize}
                onNext={() => setCurrentStep('teamGaps')}
                onAddMember={() => setIsAddTeamMemberOpen(true)}
                onRemoveMember={handleRemoveCandidate}
              />
            )}

            {currentStep === 'teamGaps' && activeProject && (
              <CinematicTeamGaps
                currentTeam={activeCurrentTeam}
                teamGaps={teamGaps}
                blueprint={activeProject}
                onNext={() => {
                  if (appMode === 'custom') {
                    setCurrentStep('comparison');
                  } else {
                    if (topCandidateImpact) {
                      setCurrentStep('bestMatch');
                    } else {
                      setCurrentStep('comparison');
                    }
                  }
                }}
              />
            )}

            {currentStep === 'bestMatch' && topCandidateImpact && (
              <CinematicBestMatch
                topImpact={topCandidateImpact}
                blueprint={activeProject}
                teamGaps={teamGaps}
                onSimulate={(cand) => handleSimulate(cand)}
                onNext={() => setCurrentStep('simulation')}
              />
            )}

            {currentStep === 'simulation' && (
              <CinematicSimulation
                currentTeam={activeCurrentTeam}
                simulatedCandidate={activeSimCandidate || null}
                impactResult={activeSimulationImpact || null}
                teamScore={teamScore}
                allImpacts={candidateImpacts}
                onSelectCandidate={(cand) => handleSimulate(cand)}
                onNext={() => {
                  if (appMode === 'custom') {
                    setCurrentStep('decision');
                  } else {
                    setCurrentStep('comparison');
                  }
                }}
                appMode={appMode}
                onGoToCandidates={() => setCurrentStep('comparison')}
              />
            )}

            {currentStep === 'comparison' && (
              <CinematicComparison
                candidateImpacts={candidateImpacts}
                activeSimulatedId={simulatedResult?.candidate.id || activeSimCandidate?.id || null}
                onSimulate={(cand) => {
                  handleSimulate(cand);
                  if (appMode === 'custom') {
                    setCurrentStep('simulation');
                  }
                }}
                onNext={() => {
                  if (appMode === 'custom') {
                    setCurrentStep('simulation');
                  } else {
                    setCurrentStep('decision');
                  }
                }}
                onAddCandidate={() => setIsAddCandidateOpen(true)}
                appMode={appMode}
              />
            )}

            {currentStep === 'decision' && (
              <CinematicDecision
                topImpact={topCandidateImpact || null}
                currentTeam={activeCurrentTeam}
                targetRoster={activeProject?.teamSize || 4}
                onAddCandidate={handleAddCandidate}
                onReset={handleReset}
                onOpenWorkspace={() => setIsWorkspaceMode(true)}
                onOpenAddCandidateModal={() => setIsAddCandidateOpen(true)}
                onGoToCandidates={() => setCurrentStep('comparison')}
                appMode={appMode}
              />
            )}
          </div>
        )}
      </main>

      {/* Global Clean Footer */}
      <footer className="border-t border-white/10 bg-[#0A0A0B] py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-center sm:flex-row sm:px-6 sm:text-left">
          <div className="text-xs font-bold text-gray-400 font-mono">
            PROJECT<span className="text-indigo-400">MATCH</span> — "We optimize the team, not the individual."
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-gray-400">
            <span>Deterministic Scoring Engine</span>
            <span>•</span>
            <span>Zero Domain Inferences</span>
          </div>
        </div>
      </footer>

      {/* Global Modals & Dialogs */}
      <SimulationDrawer
        simulationResult={simulatedResult}
        onClose={() => setSimulatedResult(null)}
        onAddCandidate={handleAddCandidate}
        isTeamFull={activeCurrentTeam.length >= (activeProject?.teamSize || 4)}
      />

      <ProfileModal
        candidate={profileCandidate}
        onClose={() => setProfileCandidate(null)}
        onSimulate={handleSimulate}
        onAdd={handleAddCandidate}
        isInTeam={profileCandidate ? activeCurrentTeam.some((m) => m.id === profileCandidate.id) : false}
        isTeamFull={activeCurrentTeam.length >= (activeProject?.teamSize || 4)}
      />

      {activeProject && (
        <BlueprintEditorModal
          blueprint={activeProject}
          isOpen={isBlueprintEditorOpen}
          onClose={() => setIsBlueprintEditorOpen(false)}
          onSave={(updated) => {
            if (appMode === 'custom') {
              setCustomProject(updated);
            } else {
              setDemoProject(updated);
            }
          }}
        />
      )}

      <AiExtractionModal
        isOpen={isAiExtractorOpen}
        onClose={() => setIsAiExtractorOpen(false)}
        onBlueprintExtracted={(extracted) => {
          if (appMode === 'custom') {
            setCustomProject(extracted);
          } else {
            setDemoProject(extracted);
          }
        }}
      />

      <ScoreDetailsModal
        isOpen={isScoreDetailsOpen}
        onClose={() => setIsScoreDetailsOpen(false)}
        breakdown={teamScore}
        teamCount={activeCurrentTeam.length}
      />

      <BeforeAfterCelebration
        lastAddedResult={celebrationResult}
        onDismiss={() => setCelebrationResult(null)}
      />

      {/* Add Team Member Modal */}
      <AddMemberModal
        isOpen={isAddTeamMemberOpen}
        onClose={() => setIsAddTeamMemberOpen(false)}
        onAdd={handleAddCustomMember}
        isCandidateMode={false}
        isTeamFull={activeCurrentTeam.length >= (activeProject?.teamSize || 4)}
        teamSize={activeProject?.teamSize || 4}
      />

      {/* Add Candidate Modal */}
      <AddMemberModal
        isOpen={isAddCandidateOpen}
        onClose={() => setIsAddCandidateOpen(false)}
        onAdd={handleAddCustomCandidate}
        isCandidateMode={true}
      />
    </div>
  );
}
