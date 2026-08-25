import React, { useState } from 'react';
import { ProjectBlueprint } from '../../types';
import { Sparkles, ArrowRight, Loader2, AlertCircle, Edit3, Compass, Flame } from 'lucide-react';

interface CinematicCustomDescribeProps {
  onBlueprintExtracted: (blueprint: ProjectBlueprint) => void;
  onSwitchToGuidedDemo: () => void;
}

const PRESET_EXAMPLES = [
  {
    title: 'Disaster Response Platform',
    category: 'Hackathon',
    prompt:
      "We're building an AI-powered disaster response platform for a 24-hour hackathon. We need ML for risk prediction, a frontend emergency dashboard, backend incident processing, and cloud infrastructure for real-time alerts.",
    roles: ['ML Engineer', 'Frontend Engineer', 'Backend Engineer', 'Cloud Engineer'],
    domains: [
      { capability: 'ML', priority: 'Critical' as const },
      { capability: 'Frontend', priority: 'Critical' as const },
      { capability: 'Backend', priority: 'Critical' as const },
      { capability: 'Cloud', priority: 'Important' as const },
    ],
  },
  {
    title: 'Fraud Detection Platform',
    category: 'Fintech Startup',
    prompt:
      "We're building an enterprise real-time transaction fraud detection platform. We require ML anomaly models, scalable backend event stream ingestion, cybersecurity protection, and cloud high-availability infrastructure.",
    roles: ['ML Engineer', 'Backend Engineer', 'Security Engineer', 'Cloud Engineer'],
    domains: [
      { capability: 'ML', priority: 'Critical' as const },
      { capability: 'Backend', priority: 'Critical' as const },
      { capability: 'Security', priority: 'Important' as const },
      { capability: 'Cloud', priority: 'Important' as const },
    ],
  },
  {
    title: 'Adaptive Learning Canvas',
    category: 'EdTech MVP',
    prompt:
      "We're developing an accessible interactive canvas for neurodivergent students. We need rich Frontend UI, UX design systems, Backend assessment storage, and Data analytics.",
    roles: ['Frontend Engineer', 'UX Designer', 'Backend Engineer', 'Data Engineer'],
    domains: [
      { capability: 'Frontend', priority: 'Critical' as const },
      { capability: 'UX', priority: 'Critical' as const },
      { capability: 'Backend', priority: 'Important' as const },
      { capability: 'Data', priority: 'Important' as const },
    ],
  },
];

export const CinematicCustomDescribe: React.FC<CinematicCustomDescribeProps> = ({
  onBlueprintExtracted,
  onSwitchToGuidedDemo,
}) => {
  const [prompt, setPrompt] = useState(
    'We are building a campus navigation system using computer vision. We need ML, mobile/frontend development, backend APIs and cloud deployment. We have 5 people and 36 hours.'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('ANALYZING PROJECT');
  const [showTimeoutRecovery, setShowTimeoutRecovery] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const buildFallbackBlueprint = (text: string): ProjectBlueprint => {
    const lower = text.toLowerCase();
    const capabilities: Array<{ capability: string; priority: 'Critical' | 'Important' }> = [];

    const addCap = (cap: string, prio: 'Critical' | 'Important') => {
      if (!capabilities.some((c) => c.capability === cap)) {
        capabilities.push({ capability: cap, priority: prio });
      }
    };

    if (/(?:ml|machine learning|ai|model|computer vision|vision|nlp|deep learning|healthcare|risk)/i.test(text)) {
      addCap('ML', 'Critical');
    }
    if (/(?:frontend|front-end|ui|ux\/ui|dashboard|mobile|canvas|interface|client|react|web app)/i.test(text)) {
      addCap('Frontend', 'Critical');
    }
    if (/(?:backend|back-end|server|api|apis|microservice|database|fastapi|node)/i.test(text)) {
      addCap('Backend', 'Critical');
    }
    if (/(?:security|cybersecurity|auth|threat|fraud|protection)/i.test(text)) {
      addCap('Security', 'Important');
    }
    if (/(?:cloud|infra|infrastructure|devops|aws|gcp|deployment|docker|high-availability)/i.test(text)) {
      addCap('Cloud', 'Important');
    }
    if (/(?:data|analytics|pipeline|etl|warehouse|stream)/i.test(text)) {
      addCap('Data', 'Important');
    }
    if (/(?:ux|user experience|design|figma|accessible|accessibility)/i.test(text)) {
      addCap('UX', 'Critical');
    }
    if (/(?:product|pm|agile)/i.test(text)) {
      addCap('Product', 'Important');
    }

    if (capabilities.length === 0) {
      capabilities.push(
        { capability: 'Frontend', priority: 'Critical' },
        { capability: 'Backend', priority: 'Critical' }
      );
    }

    // Dynamic timeline
    let timeline = 'Flexible Timeline';
    const hourMatch = text.match(/(\d+)\s*(?:hours?|hrs?|hour)/i);
    const dayMatch = text.match(/(\d+)\s*(?:days?|day)/i);
    const weekMatch = text.match(/(\d+|one|two|three|four)\s*(?:weeks?|week)/i);
    if (hourMatch) timeline = `${hourMatch[1]} hours`;
    else if (dayMatch) timeline = `${dayMatch[1]} days`;
    else if (weekMatch) timeline = `${weekMatch[1]} week${weekMatch[1] !== '1' && weekMatch[1] !== 'one' ? 's' : ''}`;

    // Dynamic team size
    let teamSize = 4;
    const teamMatch1 = text.match(/(?:team of|roster of|size of|have|need)\s*(\d+)/i);
    const teamMatch2 = text.match(/(\d+)\s*(?:people|members|engineers|person|devs|developers)/i);
    if (teamMatch2) teamSize = parseInt(teamMatch2[1], 10);
    else if (teamMatch1) teamSize = parseInt(teamMatch1[1], 10);

    // Title
    let title = 'Custom Technical Project';
    if (lower.includes('healthcare')) title = 'AI Healthcare Platform';
    else if (lower.includes('campus navigation')) title = 'Campus Navigation System';
    else if (lower.includes('fraud detection')) title = 'Fraud Detection Platform';
    else if (lower.includes('disaster response')) title = 'AI Disaster Response Platform';
    else if (lower.includes('adaptive learning') || lower.includes('learning platform') || lower.includes('online learning')) title = 'Interactive Learning Platform';

    return {
      id: `custom-proj-${Date.now()}`,
      title,
      projectType: 'Hackathon',
      goal: text,
      targetUsers: 'Target Users & Stakeholders',
      timeline,
      teamSize: Math.max(2, Math.min(12, teamSize)),
      requiredRoles: capabilities.map((c) => `${c.capability} Specialist`),
      requiredCapabilities: capabilities.map((c) => c.capability),
      priorities: capabilities,
      interests: ['AI', 'Innovation'],
      constraints: ['Sprint timeline'],
    };
  };

  const handleAnalyze = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setErrorNotice(null);
    setShowTimeoutRecovery(false);
    setLoadingStep('ANALYZING PROJECT');

    const step1Timer = setTimeout(() => {
      setLoadingStep('IDENTIFYING REQUIREMENTS');
    }, 1200);

    const step2Timer = setTimeout(() => {
      setLoadingStep('BUILDING BLUEPRINT');
    }, 2600);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 7000); // 7.0s bounded client timeout

    try {
      const response = await fetch('/api/extract-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);

      if (!response.ok) {
        throw new Error('Backend extraction returned status ' + response.status);
      }

      const data = await response.json();

      if (data.blueprint && data.blueprint.goal) {
        // Validation check
        const targetRoster = Number(data.blueprint.teamSize) || 4;
        const validCapabilities = Array.isArray(data.blueprint.requiredCapabilities) && data.blueprint.requiredCapabilities.length > 0
          ? data.blueprint.requiredCapabilities
          : ['Frontend', 'Backend'];

        const bp: ProjectBlueprint = {
          id: `custom-proj-${Date.now()}`,
          title: data.blueprint.title || 'Custom Technical Project',
          projectType: data.blueprint.projectType || 'Hackathon',
          goal: data.blueprint.goal || prompt.trim(),
          targetUsers: data.blueprint.targetUsers || 'End users & stakeholders',
          timeline: data.blueprint.timeline || 'Flexible Timeline',
          teamSize: Math.max(2, Math.min(12, targetRoster)),
          requiredRoles: data.blueprint.requiredRoles || validCapabilities.map((c: string) => `${c} Specialist`),
          requiredCapabilities: validCapabilities,
          priorities: Array.isArray(data.blueprint.priorities) && data.blueprint.priorities.length > 0
            ? data.blueprint.priorities
            : validCapabilities.map((c: string) => ({ capability: c, priority: 'Critical' })),
          interests: data.blueprint.interests || ['Innovation', 'Technology'],
          constraints: data.blueprint.constraints || ['Sprint milestone'],
        };
        onBlueprintExtracted(bp);
      } else {
        throw new Error('Invalid blueprint structure received');
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);

      console.warn('Extraction notice:', err?.message || err);
      setShowTimeoutRecovery(true);
      if (err?.name === 'AbortError') {
        setErrorNotice('Extraction timed out. You can retry or proceed directly to edit the blueprint.');
      } else {
        setErrorNotice('AI extraction is temporarily unavailable. You can retry or open the editable blueprint form.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditManually = () => {
    const manualBp = buildFallbackBlueprint(prompt.trim() || 'Custom Project');
    onBlueprintExtracted(manualBp);
  };

  const handleSelectPreset = (preset: typeof PRESET_EXAMPLES[0]) => {
    setPrompt(preset.prompt);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Category Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-indigo-400 uppercase">
            CUSTOM MODE / STEP 01
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1 font-sans">
            WHAT ARE YOU BUILDING?
          </h2>
        </div>
        <button
          onClick={onSwitchToGuidedDemo}
          className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs font-mono font-bold text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          ← Guided Demo
        </button>
      </div>

      <div className="py-8 space-y-6">
        {/* Large Natural Language Input */}
        <div className="rounded-2xl border border-white/15 bg-[#111114] p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
          <div className="flex items-center justify-between mb-3">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Describe your project in your own words</span>
            </label>
            <span className="text-[10px] font-mono text-gray-400">
              AI will extract requirements & priorities
            </span>
          </div>

          <textarea
            rows={5}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your project in your own words..."
            className="w-full rounded-xl border border-white/10 bg-black/50 p-4 text-sm sm:text-base text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none font-sans leading-relaxed resize-y"
          />

          {/* Preset Prompts Rail */}
          <div className="mt-4 pt-3 border-t border-white/5">
            <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Flame className="h-3 w-3 text-amber-400" />
              <span>Or Try a Scenario Preset:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESET_EXAMPLES.map((preset) => (
                <button
                  key={preset.title}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-left hover:border-indigo-500/40 hover:bg-indigo-500/10 transition cursor-pointer"
                >
                  <div className="font-bold text-xs text-white">{preset.title}</div>
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">{preset.category}</div>
                  <div className="text-[9px] text-indigo-300 font-mono mt-1">
                    {preset.domains.map((d) => d.capability).join(' + ')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {errorNotice && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-300 font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
              <span>{errorNotice}</span>
            </div>
            {showTimeoutRecovery && (
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  className="rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-bold text-amber-200 hover:bg-amber-500/30 transition cursor-pointer"
                >
                  RETRY
                </button>
                <button
                  type="button"
                  onClick={handleEditManually}
                  className="rounded-lg bg-white/10 border border-white/20 px-3 py-1 text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer"
                >
                  EDIT MANUALLY
                </button>
              </div>
            )}
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleEditManually}
            className="text-xs font-mono text-gray-400 hover:text-indigo-300 transition cursor-pointer underline decoration-white/20 underline-offset-4"
          >
            Or Skip to Manual Blueprint Form →
          </button>

          <button
            id="analyze-project-btn"
            disabled={isLoading || !prompt.trim()}
            onClick={handleAnalyze}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-950/70 hover:bg-indigo-500 disabled:opacity-50 transition cursor-pointer active:scale-95 font-mono"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>{loadingStep}...</span>
              </>
            ) : (
              <>
                <span>EXTRACT INFORMATION</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
