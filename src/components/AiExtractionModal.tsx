import React, { useState } from 'react';
import { ProjectBlueprint } from '../types';
import { Sparkles, X, ArrowRight, AlertCircle, Loader2, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DEMO_PROJECT_BLUEPRINT } from '../engine/seedData';

interface AiExtractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlueprintExtracted: (blueprint: ProjectBlueprint) => void;
}

export const AiExtractionModal: React.FC<AiExtractionModalProps> = ({
  isOpen,
  onClose,
  onBlueprintExtracted,
}) => {
  const [prompt, setPrompt] = useState(
    "We're building an AI-powered campus assistant for a 24-hour hackathon. We need ML, Frontend, Backend, and Cloud infrastructure to support real-time student Q&A."
  );
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  if (!isOpen) return null;

  const samplePrompts = [
    {
      label: 'Campus AI Assistant (Hackathon)',
      text: "We're building an AI-powered campus assistant for a 24-hour hackathon. We need ML, Frontend, Backend, and Cloud capabilities.",
    },
    {
      label: 'Fintech Fraud Analyzer (Startup MVP)',
      text: "We're building a real-time fintech fraud detection system for high-volume transactions. We need Data Engineering, Backend, Security, and Cloud DevOps.",
    },
    {
      label: 'Accessible EdTech Canvas (Open Source)',
      text: "We're creating an accessible learning platform with intuitive visual canvas design. We need Frontend, UX Research, Prototyping, and Backend.",
    },
  ];

  const handleExtract = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setStatusMessage(null);
    setIsFallback(false);

    try {
      const response = await fetch('/api/extract-blueprint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();

      if (data.blueprint) {
        const extracted: ProjectBlueprint = {
          id: `proj-${Date.now()}`,
          title: data.blueprint.title || 'Custom Technical Project',
          projectType: data.blueprint.projectType || 'Hackathon',
          goal: data.blueprint.goal || prompt.trim(),
          targetUsers: data.blueprint.targetUsers || 'End users & stakeholders',
          timeline: data.blueprint.timeline || 'Flexible Timeline',
          teamSize: Number(data.blueprint.teamSize) || 4,
          requiredRoles: data.blueprint.requiredRoles || [
            'ML Engineer',
            'Frontend Engineer',
            'Backend Engineer',
            'Cloud / DevOps Engineer',
          ],
          requiredCapabilities: data.blueprint.requiredCapabilities || [
            'ML',
            'Frontend',
            'Backend',
            'Cloud',
          ],
          priorities: data.blueprint.priorities || [
            { capability: 'ML', priority: 'Critical' },
            { capability: 'Frontend', priority: 'Critical' },
            { capability: 'Backend', priority: 'Critical' },
            { capability: 'Cloud', priority: 'Important' },
          ],
          interests: data.blueprint.interests || ['Innovation', 'Technology'],
          constraints: data.blueprint.constraints || ['Sprint deadline'],
        };

        onBlueprintExtracted(extracted);
        onClose();
      } else {
        throw new Error('Invalid blueprint format');
      }
    } catch (err) {
      console.warn('Fallback blueprint generation from prompt:', err);
      const text = prompt.trim();
      const lower = text.toLowerCase();
      const caps: { capability: string; priority: 'Critical' | 'Important' }[] = [];
      if (/(?:ml|ai|model|vision|nlp)/i.test(text)) caps.push({ capability: 'ML', priority: 'Critical' });
      if (/(?:frontend|ui|dashboard|mobile|canvas)/i.test(text)) caps.push({ capability: 'Frontend', priority: 'Critical' });
      if (/(?:backend|api|server|microservice)/i.test(text)) caps.push({ capability: 'Backend', priority: 'Critical' });
      if (/(?:cloud|infra|devops|aws|gcp)/i.test(text)) caps.push({ capability: 'Cloud', priority: 'Important' });
      if (/(?:security|auth|fraud)/i.test(text)) caps.push({ capability: 'Security', priority: 'Important' });
      if (caps.length === 0) {
        caps.push({ capability: 'Frontend', priority: 'Critical' }, { capability: 'Backend', priority: 'Critical' });
      }

      let timeline = 'Flexible Timeline';
      const hm = text.match(/(\d+)\s*(?:hours?|hrs?)/i);
      if (hm) timeline = `${hm[1]} hours`;

      let teamSize = 4;
      const tm = text.match(/(?:team of|have|need)\s*(\d+)/i) || text.match(/(\d+)\s*(?:people|members)/i);
      if (tm) teamSize = parseInt(tm[1], 10);

      let title = 'Custom Technical Project';
      if (lower.includes('campus navigation')) title = 'Campus Navigation System';
      else if (lower.includes('fraud detection')) title = 'Fraud Detection Platform';
      else if (lower.includes('disaster response')) title = 'AI Disaster Response Platform';

      const customFallback: ProjectBlueprint = {
        id: `proj-${Date.now()}`,
        title,
        projectType: 'Hackathon',
        goal: text,
        targetUsers: 'Target Users & Stakeholders',
        timeline,
        teamSize,
        requiredRoles: caps.map((c) => `${c.capability} Specialist`),
        requiredCapabilities: caps.map((c) => c.capability),
        priorities: caps,
        interests: ['Innovation', 'Technology'],
        constraints: ['Sprint milestone'],
      };

      onBlueprintExtracted(customFallback);
      onClose();
    } finally {
      setIsLoading(false);
    }
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
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>NATURAL LANGUAGE EXTRACTION</span>
            </div>
            <h3 className="mt-2 text-2xl font-black text-white">
              Build My Team with Project Description
            </h3>
            <p className="mt-1 text-xs text-gray-400">
              Describe your project in natural language. Gemini will extract requirements, priorities, and capabilities into an editable Project Blueprint.
            </p>
          </div>

          {/* Prompt input */}
          <div className="mt-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 font-mono">
              Project Description / Idea
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="e.g. We are building an AI-powered campus assistant for a 24-hour hackathon..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-3.5 text-xs text-white placeholder:text-gray-500 focus:border-indigo-500 focus:bg-white/10 focus:outline-hidden leading-relaxed"
            />
          </div>

          {/* Sample Prompts */}
          <div className="mt-3">
            <div className="text-[11px] font-bold text-gray-400 mb-1.5 font-mono">
              Or choose a sample scenario:
            </div>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(sample.text)}
                  className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-gray-300 hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-200 transition text-left cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Message (if fallback or error) */}
          {statusMessage && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center justify-end gap-2 border-t border-white/10 pt-4">
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="submit-ai-extract-btn"
              onClick={handleExtract}
              disabled={isLoading || !prompt.trim()}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-xl shadow-indigo-950 hover:bg-indigo-500 disabled:opacity-60 transition cursor-pointer active:scale-98"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Extracting Blueprint...</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 text-indigo-300" />
                  <span>Generate Blueprint</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
