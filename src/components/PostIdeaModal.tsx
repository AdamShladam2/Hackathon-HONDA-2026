import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles } from 'lucide-react';

export const PostIdeaModal: React.FC = () => {
  const { isPostIdeaOpen, setIsPostIdeaOpen, addIdea, currentSchool } = useApp();

  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [skillsStr, setSkillsStr] = useState('React, Python, Mobile UX');

  if (!isPostIdeaOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !problem.trim()) return;

    const skillsNeeded = skillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    addIdea(title.trim(), problem.trim(), skillsNeeded);
    setIsPostIdeaOpen(false);
    setTitle('');
    setProblem('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-idea-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200/90 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 id="post-idea-title" className="text-base font-bold text-slate-900">
              Post an Idea Spark · {currentSchool?.name}
            </h2>
          </div>
          <button
            onClick={() => setIsPostIdeaOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-[10px] tracking-wider uppercase font-bold text-slate-500 mb-1">
              Idea Concept / Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Autonomous Lawn Mower for Campus Oval"
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-wider uppercase font-bold text-slate-500 mb-1">
              Problem to Solve & Proposed Solution *
            </label>
            <textarea
              rows={4}
              required
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe what is frustrating or inefficient on campus, and what prototype could test this..."
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-wider uppercase font-bold text-slate-500 mb-1">
              Target Skills Needed (comma-separated):
            </label>
            <input
              type="text"
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
              placeholder="e.g. React, Circuit Design, Figma, CAD"
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsPostIdeaOpen(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95"
            >
              Publish Idea Spark
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
