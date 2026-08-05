import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Search, 
  Plus, 
  Pin, 
  Trash2, 
  Edit3, 
  Tag, 
  Calendar, 
  Sparkles, 
  Layers, 
  HardDrive, 
  Check, 
  X, 
  Copy, 
  UserCircle, 
  FolderGit2, 
  MessageSquare, 
  Target, 
  Sliders, 
  FileText, 
  CheckSquare, 
  BookOpen,
  Filter
} from 'lucide-react';
import { memoryService } from '../services/memoryService';
import { LongTermMemoryItem, MemoryType, MemoryImportance } from '../types';

export const MemoryCenterView: React.FC = () => {
  const [memories, setMemories] = useState<LongTermMemoryItem[]>([]);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [importanceFilter, setImportanceFilter] = useState<string>('all');
  const [pinnedOnly, setPinnedOnly] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Add/Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formType, setFormType] = useState<MemoryType>('Knowledge');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formContent, setFormContent] = useState<string>('');
  const [formTags, setFormTags] = useState<string>('ai, system');
  const [formImportance, setFormImportance] = useState<MemoryImportance>('medium');
  const [formPinned, setFormPinned] = useState<boolean>(false);

  useEffect(() => {
    refreshMemories();
  }, []);

  const refreshMemories = () => {
    setMemories(memoryService.getMemories());
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormType('Knowledge');
    setFormTitle('');
    setFormContent('');
    setFormTags('ai, system');
    setFormImportance('medium');
    setFormPinned(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: LongTermMemoryItem) => {
    setEditingId(item.id);
    setFormType(item.type);
    setFormTitle(item.title);
    setFormContent(item.content);
    setFormTags(item.tags.join(', '));
    setFormImportance(item.importance);
    setFormPinned(item.pinned);
    setIsModalOpen(true);
  };

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const tagsArray = formTags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingId) {
      memoryService.updateMemory(editingId, {
        type: formType,
        title: formTitle.trim(),
        content: formContent.trim(),
        tags: tagsArray,
        importance: formImportance,
        pinned: formPinned
      });
    } else {
      memoryService.storeMemory({
        type: formType,
        title: formTitle.trim(),
        content: formContent.trim(),
        tags: tagsArray,
        importance: formImportance,
        pinned: formPinned
      });
    }

    setIsModalOpen(false);
    refreshMemories();
  };

  const handleDelete = (id: string) => {
    memoryService.deleteMemory(id);
    refreshMemories();
  };

  const handleTogglePin = (id: string) => {
    memoryService.togglePinMemory(id);
    refreshMemories();
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const memoryTypesList: (MemoryType | 'All')[] = [
    'All',
    'User Profile',
    'Projects',
    'Conversations',
    'Goals',
    'Preferences',
    'Notes',
    'Tasks',
    'Knowledge'
  ];

  const getTypeIcon = (type: MemoryType) => {
    switch (type) {
      case 'User Profile': return UserCircle;
      case 'Projects': return FolderGit2;
      case 'Conversations': return MessageSquare;
      case 'Goals': return Target;
      case 'Preferences': return Sliders;
      case 'Notes': return FileText;
      case 'Tasks': return CheckSquare;
      case 'Knowledge': return BookOpen;
      default: return Brain;
    }
  };

  const stats = memoryService.getMemoryStats();

  const filteredMemories = memories
    .filter(m => selectedType === 'All' || m.type === selectedType)
    .filter(m => importanceFilter === 'all' || m.importance === importanceFilter)
    .filter(m => !pinnedOnly || m.pinned)
    .filter(m => 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">MEMORY CENTER</h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-mono font-bold">
                LONG-TERM STORE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Indexed Long-Term Context • 8 Memory Domains • Automatic Synthesis
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Store New Memory
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Total Memories</span>
            <span className="text-xl font-bold font-mono text-cyan-300">{stats.total} Entries</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-950 border border-amber-800 text-amber-400">
            <Pin className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Pinned Memories</span>
            <span className="text-xl font-bold font-mono text-amber-300">{stats.pinned} Items</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Recent (48h)</span>
            <span className="text-xl font-bold font-mono text-indigo-300">{stats.recent} Updated</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Memory Footprint</span>
            <span className="text-xl font-bold font-mono text-emerald-300">{stats.approxKB} KB</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="space-y-3 bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search memory titles, contents, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setPinnedOnly(!pinnedOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border cursor-pointer transition-all ${
                pinnedOnly ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <Pin className="w-3.5 h-3.5" /> Pinned Only
            </button>

            <select
              value={importanceFilter}
              onChange={(e) => setImportanceFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">All Importance</option>
              <option value="high">High Importance</option>
              <option value="medium">Medium Importance</option>
              <option value="low">Low Importance</option>
            </select>
          </div>
        </div>

        {/* Memory Domain Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-800/60">
          {memoryTypesList.map((type) => {
            const IconComp = type === 'All' ? Layers : getTypeIcon(type as MemoryType);
            const count = type === 'All' ? stats.total : (stats.byType[type] || 0);

            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                  selectedType === type
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{type}</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-900 text-[10px] text-slate-500">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Memory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMemories.map((mem) => {
          const IconComp = getTypeIcon(mem.type);

          return (
            <div
              key={mem.id}
              className={`bg-slate-900/80 border p-5 rounded-2xl flex flex-col justify-between transition-all group shadow-lg relative ${
                mem.pinned ? 'border-amber-500/40 bg-amber-950/10' : 'border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
                      <IconComp className="w-4 h-4" />
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-950 border border-slate-800 text-cyan-300">
                      {mem.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePin(mem.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        mem.pinned ? 'text-amber-400 bg-amber-950/60' : 'text-slate-500 hover:text-slate-200'
                      }`}
                      title={mem.pinned ? "Unpin Memory" : "Pin Memory"}
                    >
                      <Pin className={`w-3.5 h-3.5 ${mem.pinned ? 'fill-amber-400' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(mem)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
                      title="Edit Memory"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(mem.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete Memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors mb-2">
                  {mem.title}
                </h3>
                
                <p className="text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-wrap line-clamp-4 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                  {mem.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex flex-wrap items-center gap-1">
                  <Tag className="w-3 h-3 text-slate-500" />
                  {mem.tags.map((t, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-950 text-[10px] font-mono text-slate-400 border border-slate-800">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                  <span>Source: {mem.sourceAgent || 'Commander'}</span>
                  <span>{new Date(mem.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredMemories.length === 0 && (
          <div className="col-span-full py-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
            <Brain className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400 font-mono">No matching long-term memory entries found.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Memory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveMemory}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl animate-scaleUp"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400" />
                {editingId ? 'Edit Memory Entry' : 'Store New Memory Entry'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Memory Type Domain:</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as MemoryType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50"
                >
                  {memoryTypesList.filter(t => t !== 'All').map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Importance Weight:</label>
                <select
                  value={formImportance}
                  onChange={(e) => setFormImportance(e.target.value as MemoryImportance)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="high">High Importance</option>
                  <option value="medium">Medium Importance</option>
                  <option value="low">Low Importance</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Memory Title:</label>
              <input
                type="text"
                required
                placeholder="e.g. System Security Governance Policy"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Memory Content:</label>
              <textarea
                rows={5}
                required
                placeholder="Write detailed memory context..."
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 font-sans focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Tags (comma separated):</label>
              <input
                type="text"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="check-pinned"
                checked={formPinned}
                onChange={(e) => setFormPinned(e.target.checked)}
                className="rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="check-pinned" className="text-xs font-mono text-slate-300 cursor-pointer">
                Pin to top of Memory Center
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                Save Memory Entry
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
