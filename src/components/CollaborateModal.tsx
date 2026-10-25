import React, { useState } from 'react';
import { Project } from '../types';
import { useApp } from '../context/AppContext';
import { X, UserPlus, Sparkles, Send } from 'lucide-react';

interface CollaborateModalProps {
  targetProject: Project;
  onClose: () => void;
}

export const CollaborateModal: React.FC<CollaborateModalProps> = ({ targetProject, onClose }) => {
  const { currentUser, projects, sendInvitation, showToast } = useApp();

  const userProjects = projects.filter((p) => p.author.id === currentUser.id);

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    userProjects.length > 0 ? userProjects[0].id : 'new_idea'
  );
  const [customProjectTitle, setCustomProjectTitle] = useState('New Project Collaboration');
  const [roleOffered, setRoleOffered] = useState('Frontend & Systems Dev');
  const [note, setNote] = useState(
    `Hey ${targetProject.author.name}! I saw your work on ${targetProject.title} and think your background would be an amazing fit for our project.`
  );

  const commonRoles = [
    'Frontend dev',
    'UI designer',
    'Firmware engineer',
    'Robotics perception specialist',
    'Full-stack engineer',
    'ML researcher',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleOffered.trim() || !note.trim()) {
      showToast('Please fill in role and collaboration note.', 'warning');
      return;
    }

    const projectTitle =
      selectedProjectId === 'new_idea'
        ? customProjectTitle
        : userProjects.find((p) => p.id === selectedProjectId)?.title || 'Joint Project';

    sendInvitation(
      selectedProjectId,
      projectTitle,
      targetProject.author,
      roleOffered.trim(),
      note.trim()
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Invite {targetProject.author.name} to Collaborate
              </h3>
              <p className="text-[11px] text-slate-500">
                Author of {targetProject.title} ({targetProject.author.school})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Choose Project */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Select Your Project *
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {userProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
              <option value="new_idea">+ A new project idea...</option>
            </select>
          </div>

          {selectedProjectId === 'new_idea' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Idea Name *
              </label>
              <input
                type="text"
                value={customProjectTitle}
                onChange={(e) => setCustomProjectTitle(e.target.value)}
                placeholder="e.g., Autonomous Quadcopter Telemetry Stack"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                required
              />
            </div>
          )}

          {/* Role Offered */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Role Offered *
            </label>
            <input
              type="text"
              value={roleOffered}
              onChange={(e) => setRoleOffered(e.target.value)}
              placeholder="e.g., Frontend dev, UI designer, Control Systems Lead"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg mb-2"
              required
            />
            <div className="flex flex-wrap gap-1.5">
              {commonRoles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRoleOffered(r)}
                  className="px-2 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Short Note */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Personalized Note *
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Invitation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
