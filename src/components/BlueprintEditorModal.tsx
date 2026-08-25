import React, { useState } from 'react';
import { ProjectBlueprint, PriorityLevel } from '../types';
import { X, Save, Plus, Trash2, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BlueprintEditorModalProps {
  blueprint: ProjectBlueprint;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: ProjectBlueprint) => void;
}

export const BlueprintEditorModal: React.FC<BlueprintEditorModalProps> = ({
  blueprint,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ProjectBlueprint>({ ...blueprint });
  const [newCap, setNewCap] = useState('');
  const [newCapPriority, setNewCapPriority] = useState<PriorityLevel>('Critical');
  const [newRole, setNewRole] = useState('');
  const [newInterest, setNewInterest] = useState('');

  if (!isOpen) return null;

  const handleAddCapability = () => {
    if (!newCap.trim()) return;
    const capName = newCap.trim();
    if (!formData.requiredCapabilities.includes(capName)) {
      setFormData({
        ...formData,
        requiredCapabilities: [...formData.requiredCapabilities, capName],
        priorities: [...formData.priorities, { capability: capName, priority: newCapPriority }],
      });
      setNewCap('');
    }
  };

  const handleRemoveCapability = (cap: string) => {
    setFormData({
      ...formData,
      requiredCapabilities: formData.requiredCapabilities.filter((c) => c !== cap),
      priorities: formData.priorities.filter((p) => p.capability !== cap),
    });
  };

  const handlePriorityChange = (cap: string, priority: PriorityLevel) => {
    const existing = formData.priorities.find((p) => p.capability.toLowerCase() === cap.toLowerCase());
    if (existing) {
      setFormData({
        ...formData,
        priorities: formData.priorities.map((p) =>
          p.capability.toLowerCase() === cap.toLowerCase() ? { ...p, priority } : p
        ),
      });
    } else {
      setFormData({
        ...formData,
        priorities: [...formData.priorities, { capability: cap, priority }],
      });
    }
  };

  const handleAddRole = () => {
    if (!newRole.trim()) return;
    if (!formData.requiredRoles.includes(newRole.trim())) {
      setFormData({
        ...formData,
        requiredRoles: [...formData.requiredRoles, newRole.trim()],
      });
      setNewRole('');
    }
  };

  const handleRemoveRole = (role: string) => {
    setFormData({
      ...formData,
      requiredRoles: formData.requiredRoles.filter((r) => r !== role),
    });
  };

  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    if (!formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()],
      });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((i) => i !== interest),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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

          <div className="border-b border-white/10 pb-4">
            <h3 className="text-xl font-black text-white">Edit Project Blueprint</h3>
            <p className="text-xs text-gray-400">
              Update project goals, required capabilities, priorities, and timeline to test live team scoring.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
            {/* Title & Type */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-bold text-gray-300 mb-1 font-mono">Project Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-gray-500 focus:border-indigo-500 focus:bg-white/10 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1 font-mono">Project Type</label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#1a1a20] px-3 py-2 text-white focus:border-indigo-500 focus:outline-hidden"
                >
                  <option value="Hackathon">Hackathon</option>
                  <option value="Startup MVP">Startup MVP</option>
                  <option value="Open Source">Open Source</option>
                  <option value="Enterprise Prototype">Enterprise Prototype</option>
                </select>
              </div>
            </div>

            {/* Goal */}
            <div>
              <label className="block font-bold text-gray-300 mb-1 font-mono">Goal</label>
              <textarea
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-gray-500 focus:border-indigo-500 focus:bg-white/10 focus:outline-hidden"
                required
              />
            </div>

            {/* Timeline, Team Size, Target Users */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="block font-bold text-gray-300 mb-1 font-mono">Timeline</label>
                <input
                  type="text"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-gray-500 focus:border-indigo-500 focus:bg-white/10 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-300 mb-1 font-mono">Team Size</label>
                <input
                  type="number"
                  min={2}
                  max={8}
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) || 4 })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-gray-500 focus:border-indigo-500 focus:bg-white/10 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-300 mb-1 font-mono">Target Users</label>
                <input
                  type="text"
                  value={formData.targetUsers}
                  onChange={(e) => setFormData({ ...formData, targetUsers: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-gray-500 focus:border-indigo-500 focus:bg-white/10 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Required Capabilities & Priorities */}
            <div>
              <label className="block font-bold text-gray-300 mb-1.5 font-mono">
                Required Capabilities & Priorities
              </label>
              <div className="space-y-2">
                {formData.requiredCapabilities.map((cap) => {
                  const pObj = formData.priorities.find((p) => p.capability.toLowerCase() === cap.toLowerCase());
                  const priority = pObj ? pObj.priority : 'Critical';

                  return (
                    <div
                      key={cap}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-2.5"
                    >
                      <span className="font-bold text-white text-xs">{cap}</span>
                      <div className="flex items-center gap-2">
                        <select
                          value={priority}
                          onChange={(e) => handlePriorityChange(cap, e.target.value as PriorityLevel)}
                          className="rounded-lg border border-white/10 bg-[#1a1a20] px-2 py-1 text-xs font-semibold text-gray-200"
                        >
                          <option value="Critical">Critical (1.0)</option>
                          <option value="Important">Important (0.7)</option>
                          <option value="Optional">Optional (0.4)</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveCapability(cap)}
                          className="rounded p-1 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New Capability */}
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Security, UX, Data"
                  value={newCap}
                  onChange={(e) => setNewCap(e.target.value)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder:text-gray-500 focus:border-indigo-500 focus:bg-white/10 focus:outline-hidden"
                />
                <select
                  value={newCapPriority}
                  onChange={(e) => setNewCapPriority(e.target.value as PriorityLevel)}
                  className="rounded-xl border border-white/10 bg-[#1a1a20] px-2 py-1.5 text-xs font-semibold text-gray-200"
                >
                  <option value="Critical">Critical</option>
                  <option value="Important">Important</option>
                  <option value="Optional">Optional</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddCapability}
                  className="flex items-center gap-1 rounded-xl bg-white/10 border border-white/10 px-3 py-1.5 text-xs font-bold text-gray-200 hover:bg-white/20 transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Target Roles */}
            <div>
              <label className="block font-bold text-gray-300 mb-1.5 font-mono">Required Roles</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {formData.requiredRoles.map((role) => (
                  <span
                    key={role}
                    className="flex items-center gap-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 text-xs text-indigo-300 font-medium font-mono"
                  >
                    <span>{role}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRole(role)}
                      className="text-indigo-400 hover:text-indigo-200 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. DevOps Engineer"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder:text-gray-500 focus:border-indigo-500 focus:bg-white/10 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAddRole}
                  className="flex items-center gap-1 rounded-xl bg-white/10 border border-white/10 px-3 py-1.5 text-xs font-bold text-gray-200 hover:bg-white/20 transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Role</span>
                </button>
              </div>
            </div>

            {/* Domain Interests */}
            <div>
              <label className="block font-bold text-gray-300 mb-1.5 font-mono">Project Interests</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {formData.interests.map((interest) => (
                  <span
                    key={interest}
                    className="flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-gray-300 font-medium font-mono"
                  >
                    <span>{interest}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="text-gray-400 hover:text-gray-200 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. AI, Healthcare, Fintech"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder:text-gray-500 focus:border-indigo-500 focus:bg-white/10 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="flex items-center gap-1 rounded-xl bg-white/10 border border-white/10 px-3 py-1.5 text-xs font-bold text-gray-200 hover:bg-white/20 transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Interest</span>
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-xl shadow-indigo-950 hover:bg-indigo-500 transition cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save & Recalculate</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
