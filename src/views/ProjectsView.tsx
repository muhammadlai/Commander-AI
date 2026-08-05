import React, { useState } from 'react';
import { 
  FolderGit2, 
  Plus, 
  Search, 
  ExternalLink, 
  Trash2, 
  Star, 
  Code2, 
  Layers,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useCommander } from '../hooks/useCommander';
import { ProjectModal } from '../components/ProjectModal';
import { ProjectStatus } from '../types';

export const ProjectsView: React.FC = () => {
  const { projects, createProject, deleteProject, isLoadingProjects } = useCommander();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.techStack.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12 animate-fadeIn" id="view-projects">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <FolderGit2 className="w-6 h-6 text-cyan-400" />
            Projects & Architecture Services
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Registered microservice repositories, tech stacks, and deployment references for Commander AI.
          </p>
        </div>

        <button
          id="btn-open-create-project"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Register Project
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by name, tech stack, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 backdrop-blur-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'active', 'in_progress', 'planning', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono capitalize whitespace-nowrap border transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 font-semibold shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200 hover:border-white/20'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-500/40 shadow-xl flex flex-col justify-between group transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-400 transition-colors">
                      {proj.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500 block">
                      ID: {proj.id}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${
                    proj.status === 'active'
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                      : proj.status === 'in_progress'
                      ? 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  {proj.status.replace('_', ' ')}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">{proj.description}</p>
            </div>

            <div className="space-y-3">
              {/* Tech stack badges */}
              <div className="flex flex-wrap gap-1">
                {proj.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Actions & Repo info */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-[10px] font-mono">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {new Date(proj.lastUpdated).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  {proj.repositoryUrl && (
                    <a
                      href={proj.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                      title="Repository"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => deleteProject(proj.id)}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all cursor-pointer"
                    title="Remove Project Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 text-slate-400">
          <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-200">No matching projects found</h4>
          <p className="text-xs text-slate-500 mt-1">Try resetting search filters or register a new project.</p>
        </div>
      )}

      {/* Register Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={async (projectData) => {
          await createProject(projectData);
        }}
      />
    </div>
  );
};
