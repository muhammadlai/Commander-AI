import React, { useState } from 'react';
import { X, FolderPlus, Plus, Code } from 'lucide-react';
import { ProjectStatus } from '../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (project: {
    name: string;
    description: string;
    techStack: string[];
    status: ProjectStatus;
    repositoryUrl?: string;
  }) => Promise<void>;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>(['TypeScript', 'FastAPI']);
  const [status, setStatus] = useState<ProjectStatus>('active');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await onCreate({
        name: name.trim(),
        description: description.trim(),
        techStack,
        status,
        repositoryUrl: repositoryUrl.trim() || undefined,
      });
      onClose();
      // Reset form
      setName('');
      setDescription('');
      setTechStack(['TypeScript', 'FastAPI']);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div 
        id="modal-create-project"
        className="w-full max-w-lg bg-[#0a0a10]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative text-slate-100 overflow-hidden"
      >
        {/* Background Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <FolderPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Register New Microservice / Project</h3>
            <p className="text-xs text-slate-400">Add a modular system component to the Commander AI index.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Autonomous Vector Streamer"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 backdrop-blur-sm"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Brief description of the component architecture..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 resize-none backdrop-blur-sm"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">Tech Stack Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add tech (e.g. Python, Docker, Qdrant)"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTech(); } }}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {techStack.map(t => (
                <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-xs font-mono text-cyan-300">
                  {t}
                  <button type="button" onClick={() => handleRemoveTech(t)} className="text-slate-400 hover:text-slate-200 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 backdrop-blur-sm"
              >
                <option value="active" className="bg-slate-900 text-slate-200">Active</option>
                <option value="in_progress" className="bg-slate-900 text-slate-200">In Progress</option>
                <option value="planning" className="bg-slate-900 text-slate-200">Planning</option>
                <option value="archived" className="bg-slate-900 text-slate-200">Archived</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">Repository URL</label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={repositoryUrl}
                onChange={(e) => setRepositoryUrl(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 backdrop-blur-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Registering...' : 'Create Project Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
