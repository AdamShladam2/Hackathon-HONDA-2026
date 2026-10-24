import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Plus,
  BookOpen,
  Sparkles,
  Users,
  Check,
  GraduationCap,
  Briefcase,
} from 'lucide-react';

export const CreateProjectModal: React.FC = () => {
  const {
    isCreateProjectOpen,
    setIsCreateProjectOpen,
    createNewProject,
    currentUser,
    currentSchool,
  } = useApp();

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState<'class' | 'personal'>('class');
  const [courseCode, setCourseCode] = useState('CSE 2221');
  const [courseName, setCourseName] = useState('Software I: Components');
  const [instructorName, setInstructorName] = useState('Prof. Alan Miller');
  const [openToJoin, setOpenToJoin] = useState(true);
  const [openRolesStr, setOpenRolesStr] = useState('Frontend Developer, UI Designer');
  const [skillsStr, setSkillsStr] = useState('React, TypeScript, CSS');
  const [tagsStr, setTagsStr] = useState('Algorithms, Web, Campus Tech');

  if (!isCreateProjectOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !currentUser) return;

    const openRoles = openRolesStr
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    const skillsNeeded = skillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    createNewProject({
      title: title.trim(),
      tagline: tagline.trim() || title.trim(),
      description: description.trim() || tagline.trim(),
      type: projectType,
      courseCode: projectType === 'class' ? courseCode.trim() : undefined,
      courseName: projectType === 'class' ? courseName.trim() : undefined,
      instructorName: projectType === 'class' ? instructorName.trim() : undefined,
      openToJoin,
      openRoles,
      skillsNeeded,
      tags: tags.length > 0 ? tags : ['Innovation', 'Collaboration'],
      ownerId: currentUser.id,
      schoolId: currentUser.schoolId,
      members: [
        {
          userId: currentUser.id,
          name: currentUser.name,
          role: 'Project Creator & Lead',
          major: currentUser.major || 'College Student',
          avatarInitial: currentUser.avatarInitial,
        },
      ],
      initialDocSummary: description.trim(),
    });

    setIsCreateProjectOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-project-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/90 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h2 id="create-project-title" className="text-base font-bold text-slate-900">
              Launch a New Project · {currentSchool?.name}
            </h2>
          </div>
          <button
            onClick={() => setIsCreateProjectOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Project Type Segmented Control */}
          <div>
            <label className="block text-[10px] tracking-wider uppercase font-bold text-slate-500 mb-1.5">
              Project Category
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setProjectType('class')}
                className={`flex-1 py-2 px-3 rounded-xl border font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  projectType === 'class'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-amber-700" />
                <span>Class Coursework Project</span>
              </button>
              <button
                type="button"
                onClick={() => setProjectType('personal')}
                className={`flex-1 py-2 px-3 rounded-xl border font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  projectType === 'personal'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>Personal / Campus Venture</span>
              </button>
            </div>
          </div>

          {/* Title & Tagline */}
          <div>
            <label className="block text-[10px] tracking-wider uppercase font-bold text-slate-500 mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. BuckeyeRoute: Campus Transit Optimizer"
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-wider uppercase font-bold text-slate-500 mb-1">
              One-Line Hook / Tagline *
            </label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Algorithmic bus arrival prediction and walking route optimizer for CABS."
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* If Class: Course info */}
          {projectType === 'class' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-[10px] tracking-wider uppercase font-bold text-slate-500 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g. CSE 2221"
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-wider uppercase font-bold text-slate-500 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="Software I: Components"
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-wider uppercase font-bold text-slate-500 mb-1">
                  Instructor Name
                </label>
                <input
                  type="text"
                  value={instructorName}
                  onChange={(e) => setInstructorName(e.target.value)}
                  placeholder="Prof. Alan Miller"
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-[10px] tracking-wider uppercase font-bold text-slate-500 mb-1">
              Detailed Scope & Objectives *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what the project solves, technical architecture, and milestones..."
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Collaborator settings */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block text-xs">
                  Recruit Teammates & Open for Collaborators
                </span>
                <span className="text-[11px] text-slate-500">
                  Allows students across your school to request to join
                </span>
              </div>
              <input
                type="checkbox"
                checked={openToJoin}
                onChange={(e) => setOpenToJoin(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>

            {openToJoin && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-[10px] tracking-wider uppercase font-bold text-slate-500 mb-1">
                    Open Roles to Recruit:
                  </label>
                  <input
                    type="text"
                    value={openRolesStr}
                    onChange={(e) => setOpenRolesStr(e.target.value)}
                    placeholder="e.g. Frontend Engineer, Circuit Prototyper"
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-wider uppercase font-bold text-slate-500 mb-1">
                    Skills Needed (comma-separated):
                  </label>
                  <input
                    type="text"
                    value={skillsStr}
                    onChange={(e) => setSkillsStr(e.target.value)}
                    placeholder="e.g. React, TypeScript, Python"
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsCreateProjectOpen(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-sm cursor-pointer active:scale-95"
            >
              Publish Project & Link Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
