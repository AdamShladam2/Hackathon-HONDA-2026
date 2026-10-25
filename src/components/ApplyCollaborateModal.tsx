import React, { useState } from 'react';
import { Project } from '../types';
import { useApp } from '../context/AppContext';
import { X, Send, GraduationCap, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react';

interface ApplyCollaborateModalProps {
  project: Project;
  onClose: () => void;
}

export const ApplyCollaborateModal: React.FC<ApplyCollaborateModalProps> = ({ project, onClose }) => {
  const { currentUser, applyToProject, showToast } = useApp();

  const isStudent = currentUser.identities.includes('Student');

  const [roleApplied, setRoleApplied] = useState<string>(
    project.openRoles && project.openRoles.length > 0
      ? project.openRoles[0]
      : 'Collaborator / Contributor'
  );
  const [introduction, setIntroduction] = useState<string>(
    isStudent
      ? `Hi ${project.author.name}! I am an engineering student at ${currentUser.school || 'university'} interested in contributing to ${project.title}. I have experience with ${currentUser.skills?.slice(0, 3).join(', ') || 'modern software'} and would love to collaborate.`
      : `Hi ${project.author.name}! I would love to collaborate on ${project.title}. My background in ${currentUser.industry || 'software engineering'} aligns well with your project roadmap.`
  );
  const [availability, setAvailability] = useState<string>(currentUser.availability || '10 hrs/week');
  const [learningGoals, setLearningGoals] = useState<string>(
    isStudent
      ? 'Gain production-grade code experience, collaborate on systems architecture, and contribute to open source.'
      : 'Build open-source tooling, collaborate with multidisciplinary builders.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleApplied.trim() || !introduction.trim()) {
      showToast('Please provide your desired role and a brief introduction.', 'warning');
      return;
    }

    applyToProject(
      project.id,
      roleApplied.trim(),
      introduction.trim(),
      availability.trim(),
      learningGoals.trim()
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              {isStudent ? <GraduationCap className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Apply to Collaborate: {project.title}
              </h3>
              <p className="text-[11px] text-slate-500">
                Project Owner: {project.author.name} ({project.author.jobTitle || project.author.organization || 'Lead'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {isStudent && project.openToStudents && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Student Cross-Hub Opportunity</strong>
                This project is marked &quot;Open to Students and Early-Career Collaborators&quot;. The project owner welcomes student mentees and hands-on contributors.
              </div>
            </div>
          )}

          {/* Role selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Role You Are Applying For *
            </label>
            {project.openRoles && project.openRoles.length > 0 ? (
              <select
                value={roleApplied}
                onChange={(e) => setRoleApplied(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer mb-2"
              >
                {project.openRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
                <option value="General Contributor">Other / General Contributor</option>
              </select>
            ) : (
              <input
                type="text"
                value={roleApplied}
                onChange={(e) => setRoleApplied(e.target.value)}
                placeholder="e.g., Frontend dev, UI designer, Systems tester"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                required
              />
            )}
          </div>

          {/* Introduction */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Short Introduction & Qualifications *
            </label>
            <textarea
              rows={3}
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="Tell the project owner why you are excited to collaborate and what relevant experience you bring..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
              required
            />
          </div>

          {/* Weekly Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Weekly Availability *
              </label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="e.g. 8-12 hrs/week"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Your Primary Skillset
              </label>
              <div className="text-xs text-slate-500 p-2 bg-slate-50 border border-slate-200 rounded-lg truncate">
                {currentUser.skills?.slice(0, 4).join(', ') || 'Software Development'}
              </div>
            </div>
          </div>

          {/* Learning / Value Goals */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Expected Learning Goals or Key Contributions
            </label>
            <input
              type="text"
              value={learningGoals}
              onChange={(e) => setLearningGoals(e.target.value)}
              placeholder="What do you hope to learn or ship during this collaboration?"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Application</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
