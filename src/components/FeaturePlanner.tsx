import React, { useState } from 'react';
import {
  ListTodo,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Trash2,
  Tag,
  ArrowUpRight
} from 'lucide-react';
import { FeatureTask } from '../types';

interface FeaturePlannerProps {
  tasks: FeatureTask[];
  onAddTask: (task: Omit<FeatureTask, 'id' | 'createdAt'>) => void;
  onUpdateStatus: (id: string, status: FeatureTask['status']) => void;
  onDeleteTask: (id: string) => void;
  suggestedFeatures?: { title: string; description: string; priority: 'High' | 'Medium' | 'Low' }[];
}

export const FeaturePlanner: React.FC<FeaturePlannerProps> = ({
  tasks,
  onAddTask,
  onUpdateStatus,
  onDeleteTask,
  suggestedFeatures = []
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [suggestedFilesStr, setSuggestedFilesStr] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        status: 'planned',
        suggestedFiles: suggestedFilesStr.split(',').map((s) => s.trim()).filter(Boolean)
      });
      setTitle('');
      setDescription('');
      setSuggestedFilesStr('');
      setShowAddModal(false);
    }
  };

  const getPriorityBadge = (p: 'High' | 'Medium' | 'Low') => {
    switch (p) {
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#1A1A1A] text-rose-400 border border-rose-500/20">High Priority</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#1A1A1A] text-amber-400 border border-amber-500/20">Medium Priority</span>;
      case 'Low':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#1A1A1A] text-blue-400 border border-blue-500/20">Low Priority</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-[#0E0E0E] border border-[#262626] rounded-xl p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-lg">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-100">Project Feature Planner & Roadmap</h3>
            <p className="text-xs text-gray-400">
              Track and organize requested features to apply to this Google Drive project
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-md shadow-sm transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Feature</span>
        </button>
      </div>

      {/* AI Suggested Features Section */}
      {suggestedFeatures.length > 0 && (
        <div className="bg-[#0E0E0E] border border-[#262626] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI Suggested Enhancements for this Project</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {suggestedFeatures.map((sf, idx) => (
              <div
                key={idx}
                className="bg-[#141414] border border-[#262626] rounded-lg p-3.5 space-y-2 transition-colors group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-xs font-bold text-gray-200 group-hover:text-blue-300 transition-colors">
                      {sf.title}
                    </h4>
                    {getPriorityBadge(sf.priority)}
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    {sf.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onAddTask({
                      title: sf.title,
                      description: sf.description,
                      priority: sf.priority,
                      status: 'planned',
                      suggestedFiles: []
                    });
                  }}
                  className="w-full mt-2 py-1 px-2.5 bg-[#1A1A1A] hover:bg-[#222222] text-blue-400 border border-[#333333] rounded text-[11px] font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <span>Add to Roadmap</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Planned Column */}
        <div className="bg-[#0E0E0E] border border-[#262626] rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#262626] pb-2">
            <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-blue-400" />
              Planned
            </span>
            <span className="text-xs bg-[#1A1A1A] text-gray-400 px-2 py-0.5 rounded font-mono border border-[#262626]">
              {tasks.filter((t) => t.status === 'planned').length}
            </span>
          </div>

          <div className="space-y-2.5">
            {tasks
              .filter((t) => t.status === 'planned')
              .map((t) => (
                <div
                  key={t.id}
                  className="bg-[#141414] border border-[#262626] rounded-lg p-3 space-y-2 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-gray-200">{t.title}</h4>
                    {getPriorityBadge(t.priority)}
                  </div>
                  {t.description && (
                    <p className="text-[11px] text-gray-400 leading-relaxed">{t.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-[#262626]">
                    <button
                      onClick={() => onUpdateStatus(t.id, 'in_progress')}
                      className="text-[10px] text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Start Progress →
                    </button>
                    <button
                      onClick={() => onDeleteTask(t.id)}
                      className="text-gray-600 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-[#0E0E0E] border border-[#262626] rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#262626] pb-2">
            <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              In Progress
            </span>
            <span className="text-xs bg-[#1A1A1A] text-gray-400 px-2 py-0.5 rounded font-mono border border-[#262626]">
              {tasks.filter((t) => t.status === 'in_progress').length}
            </span>
          </div>

          <div className="space-y-2.5">
            {tasks
              .filter((t) => t.status === 'in_progress')
              .map((t) => (
                <div
                  key={t.id}
                  className="bg-[#141414] border border-[#262626] rounded-lg p-3 space-y-2 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-gray-200">{t.title}</h4>
                    {getPriorityBadge(t.priority)}
                  </div>
                  {t.description && (
                    <p className="text-[11px] text-gray-400 leading-relaxed">{t.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-[#262626]">
                    <button
                      onClick={() => onUpdateStatus(t.id, 'completed')}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                      Mark Completed ✓
                    </button>
                    <button
                      onClick={() => onDeleteTask(t.id)}
                      className="text-gray-600 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Completed Column */}
        <div className="bg-[#0E0E0E] border border-[#262626] rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#262626] pb-2">
            <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Completed
            </span>
            <span className="text-xs bg-[#1A1A1A] text-gray-400 px-2 py-0.5 rounded font-mono border border-[#262626]">
              {tasks.filter((t) => t.status === 'completed').length}
            </span>
          </div>

          <div className="space-y-2.5">
            {tasks
              .filter((t) => t.status === 'completed')
              .map((t) => (
                <div
                  key={t.id}
                  className="bg-[#141414] border border-[#262626] rounded-lg p-3 space-y-2 shadow-sm opacity-80"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-gray-400 line-through">{t.title}</h4>
                    {getPriorityBadge(t.priority)}
                  </div>
                  {t.description && (
                    <p className="text-[11px] text-gray-500 leading-relaxed">{t.description}</p>
                  )}
                  <div className="flex items-center justify-end pt-2 border-t border-[#262626]">
                    <button
                      onClick={() => onDeleteTask(t.id)}
                      className="text-gray-600 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0E0E0E] border border-[#262626] rounded-xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-gray-100">Add New Feature Request</h3>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-400 block mb-1">Feature Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Add dark mode toggle or API endpoint"
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] rounded-md text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed functional scope or requirement..."
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] rounded-md text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-400 block mb-1">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] rounded-md text-xs text-gray-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 bg-[#1A1A1A] hover:bg-[#222222] text-gray-300 text-xs rounded-md border border-[#333333]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-md shadow-sm"
                >
                  Save Feature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
