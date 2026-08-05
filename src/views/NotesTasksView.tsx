import React, { useState, useEffect } from 'react';
import { 
  Pin, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckSquare, 
  Square, 
  Calendar, 
  AlertCircle, 
  Tag, 
  Filter, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Clock,
  X,
  Save
} from 'lucide-react';
import { PinnedNote, CommanderTask } from '../types';
import { apiService } from '../services/apiService';

export const NotesTasksView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notes' | 'tasks'>('notes');

  // Notes state
  const [notes, setNotes] = useState<PinnedNote[]>([]);
  const [noteSearch, setNoteSearch] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');

  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Architecture');

  // Tasks state
  const [tasks, setTasks] = useState<CommanderTask[]>([]);
  const [taskFilter, setTaskFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  useEffect(() => {
    async function loadData() {
      const loadedNotes = await apiService.getPinnedNotes();
      setNotes(loadedNotes);
      const loadedTasks = await apiService.getTasks();
      setTasks(loadedTasks);
    }
    loadData();
  }, []);

  // Notes Handlers
  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const updated = await apiService.addNote(newTitle.trim(), newContent.trim(), newCategory || 'General');
    setNotes(updated);
    setNewTitle('');
    setNewContent('');
    setIsCreatingNote(false);
    await apiService.logActivity(`Saved Note "${newTitle.trim()}"`, 'note', `Category: ${newCategory}`);
  };

  const handleDeleteNote = async (id: string) => {
    const updated = await apiService.deleteNote(id);
    setNotes(updated);
    await apiService.logActivity('Deleted Note', 'note', `Note ID: ${id}`);
  };

  const handleTogglePinNote = async (id: string) => {
    const updated = notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n);
    setNotes(updated);
    // Persist to local storage
    localStorage.setItem('commander_preview_notes', JSON.stringify(updated));
  };

  const handleStartEditNote = (note: PinnedNote) => {
    setEditingNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditCategory(note.category);
  };

  const handleSaveEditNote = (id: string) => {
    const updated = notes.map(n => n.id === id ? { ...n, title: editTitle, content: editContent, category: editCategory, updatedAt: new Date().toISOString() } : n);
    setNotes(updated);
    setEditingNoteId(null);
    localStorage.setItem('commander_preview_notes', JSON.stringify(updated));
  };

  // Task Handlers
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: CommanderTask = {
      id: 'task-' + Math.random().toString(36).substring(2, 7),
      title: newTaskTitle.trim(),
      completed: false,
      priority: newTaskPriority,
      dueDate: newTaskDueDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    const updated = [newTask, ...tasks];
    setTasks(updated);
    localStorage.setItem('commander_preview_tasks', JSON.stringify(updated));

    setNewTaskTitle('');
    setNewTaskDueDate('');
    await apiService.logActivity(`Created Task "${newTask.title}"`, 'task', `Priority: ${newTaskPriority}`);
  };

  const handleToggleTask = async (id: string) => {
    const updated = await apiService.toggleTask(id);
    setTasks(updated);
  };

  const handleDeleteTask = async (id: string) => {
    const updated = await apiService.deleteTask(id);
    setTasks(updated);
  };

  // Filtered Notes
  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(noteSearch.toLowerCase()) ||
    n.content.toLowerCase().includes(noteSearch.toLowerCase()) ||
    n.category.toLowerCase().includes(noteSearch.toLowerCase())
  );

  // Filtered Tasks
  const filteredTasks = tasks.filter(t => {
    if (taskFilter === 'active') return !t.completed;
    if (taskFilter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-fadeIn" id="view-notes-tasks">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-cyan-400" />
            Commander Notes & Task Manager
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Organize architectural notes, pinned system specs, and daily development tasks locally.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pinned Notes ({notes.length})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'tasks'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tasks ({tasks.filter(t => !t.completed).length} Pending)
          </button>
        </div>
      </div>

      {/* NOTES MANAGER VIEW */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          
          {/* Top Bar: Search & New Note Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search notes or categories..."
                value={noteSearch}
                onChange={(e) => setNoteSearch(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <button
              onClick={() => setIsCreatingNote(!isCreatingNote)}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.25)] cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Note
            </button>
          </div>

          {/* Create Note Modal/Form */}
          {isCreatingNote && (
            <form onSubmit={handleCreateNote} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl animate-fadeIn">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> New System Note
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Note Title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="sm:col-span-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/50"
                  required
                />
                <input
                  type="text"
                  placeholder="Category (e.g. Metrics, API)"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <textarea
                placeholder="Detailed note content..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/50"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingNote(false)}
                  className="px-4 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400"
                >
                  Save Note
                </button>
              </div>
            </form>
          )}

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => {
              const isEditing = editingNoteId === note.id;

              return (
                <div
                  key={note.id}
                  className={`p-5 rounded-3xl border transition-all relative flex flex-col justify-between ${
                    note.pinned
                      ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-100"
                      />
                      <input
                        type="text"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-100"
                      />
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-100"
                      />
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="px-2 py-1 text-xs text-slate-400"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEditNote(note.id)}
                          className="px-3 py-1 bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        {/* Note Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-bold text-sm text-slate-100 line-clamp-1">{note.title}</h4>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleTogglePinNote(note.id)}
                              className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                                note.pinned ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                              }`}
                              title={note.pinned ? "Unpin Note" : "Pin Note"}
                            >
                              <Pin className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleStartEditNote(note)}
                              className="p-1 rounded text-slate-500 hover:text-slate-200 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Category Pill */}
                        <span className="inline-block px-2 py-0.5 rounded-full bg-slate-950 text-cyan-400 border border-slate-800 text-[10px] font-mono font-semibold mb-3">
                          {note.category}
                        </span>

                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {note.content}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>Updated {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>{note.pinned ? '📌 Pinned' : 'Saved'}</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TASK MANAGER VIEW */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          
          {/* Add Task Form Bar */}
          <form onSubmit={handleAddTask} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-cyan-400" /> Create Task
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Task description..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="sm:col-span-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/50"
                required
              />

              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)]"
              >
                Add Task
              </button>
            </div>
          </form>

          {/* Filter Bar */}
          <div className="flex items-center gap-2">
            {(['all', 'active', 'completed'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTaskFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase transition-all cursor-pointer ${
                  taskFilter === filter
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Tasks List */}
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 group ${
                  task.completed
                    ? 'bg-slate-950/40 border-slate-900 opacity-60'
                    : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button onClick={() => handleToggleTask(task.id)} className="cursor-pointer">
                    {task.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-500 group-hover:text-cyan-400" />
                    )}
                  </button>

                  <div>
                    <span className={`text-sm font-semibold ${task.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                        task.priority === 'high'
                          ? 'bg-rose-950 text-rose-400 border-rose-800'
                          : task.priority === 'medium'
                          ? 'bg-amber-950 text-amber-400 border-amber-800'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-cyan-400" /> Due: {task.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
