import React, { useState } from 'react';
import { Project, ExperienceLevel, CollaborationType, CodeAvailability, ProjectStatus } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Plus,
  Trash2,
  GitBranch,
  Github,
  Globe,
  Sparkles,
  DollarSign,
  Users,
} from 'lucide-react';

interface CreateWorkProjectModalProps {
  onClose: () => void;
  initialData?: Partial<Project>;
}

export const CreateWorkProjectModal: React.FC<CreateWorkProjectModalProps> = ({ onClose, initialData }) => {
  const { currentUser, addWorkProject, showToast } = useApp();

  const [title, setTitle] = useState(initialData?.title || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [industry, setIndustry] = useState(
    initialData?.industry || currentUser.industry || 'Artificial Intelligence & Machine Learning'
  );
  const [category, setCategory] = useState(
    initialData?.category || 'Artificial intelligence and machine learning'
  );

  // Skills
  const [skillsRequired, setSkillsRequired] = useState<string[]>(
    initialData?.skillsRequired || ['TypeScript', 'React', 'Node.js']
  );
  const [newReqSkill, setNewReqSkill] = useState('');

  const [skillsPreferred, setSkillsPreferred] = useState<string[]>(
    initialData?.skillsPreferred || ['TailwindCSS', 'WebSockets']
  );
  const [newPrefSkill, setNewPrefSkill] = useState('');

  // Roles Needed
  const [openRoles, setOpenRoles] = useState<string[]>(
    initialData?.openRoles || ['Frontend Engineer', 'Full-stack Developer']
  );
  const [newRoleInput, setNewRoleInput] = useState('');

  // Metadata
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    initialData?.experienceLevel || 'Mixed'
  );
  const [estimatedDuration, setEstimatedDuration] = useState(
    initialData?.estimatedDuration || '1-3 months'
  );
  const [collaborationType, setCollaborationType] = useState<CollaborationType>(
    initialData?.collaborationType || 'Remote'
  );
  const [targetTeamSize, setTargetTeamSize] = useState<number>(initialData?.targetTeamSize || 4);

  // Deliverables
  const [deliverables, setDeliverables] = useState<string[]>(
    initialData?.deliverables || [
      'Production-ready open source repository',
      'Interactive documentation site and benchmarks',
    ]
  );
  const [newDeliverable, setNewDeliverable] = useState('');

  // Compensation
  const [compensationInfo, setCompensationInfo] = useState(
    initialData?.compensationInfo || 'Collaborative Open Source (Unpaid / Resume Portfolio)'
  );

  // Cross-Hub Flags
  const [openToStudents, setOpenToStudents] = useState<boolean>(
    initialData?.openToStudents !== undefined ? initialData.openToStudents : true
  );
  const [seekingIndustryMentor, setSeekingIndustryMentor] = useState<boolean>(
    initialData?.seekingIndustryMentor || false
  );

  // Links & Code
  const [repositoryUrl, setRepositoryUrl] = useState(initialData?.githubRepo?.html_url || '');
  const [liveDemoUrl, setLiveDemoUrl] = useState(initialData?.liveDemoUrl || '');
  const [codeAvailability, setCodeAvailability] = useState<CodeAvailability>(
    initialData?.codeAvailability || 'public'
  );
  const [status, setStatus] = useState<ProjectStatus>('Looking for collaborators');

  const categories = [
    'Software development',
    'Artificial intelligence and machine learning',
    'Data analytics',
    'UI/UX design',
    'Business and entrepreneurship',
    'Cybersecurity',
    'Marketing',
    'Open-source development',
    'Community impact',
  ];

  const addReqSkill = () => {
    if (newReqSkill.trim() && !skillsRequired.includes(newReqSkill.trim())) {
      setSkillsRequired([...skillsRequired, newReqSkill.trim()]);
      setNewReqSkill('');
    }
  };

  const addPrefSkill = () => {
    if (newPrefSkill.trim() && !skillsPreferred.includes(newPrefSkill.trim())) {
      setSkillsPreferred([...skillsPreferred, newPrefSkill.trim()]);
      setNewPrefSkill('');
    }
  };

  const addRole = () => {
    if (newRoleInput.trim() && !openRoles.includes(newRoleInput.trim())) {
      setOpenRoles([...openRoles, newRoleInput.trim()]);
      setNewRoleInput('');
    }
  };

  const addDeliverableItem = () => {
    if (newDeliverable.trim()) {
      setDeliverables([...deliverables, newDeliverable.trim()]);
      setNewDeliverable('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !summary.trim() || !description.trim()) {
      showToast('Please fill in title, summary, and description', 'warning');
      return;
    }

    addWorkProject({
      title: title.trim(),
      summary: summary.trim(),
      description: description.trim(),
      whatItDoes: summary.trim(),
      useCases: deliverables.length > 0 ? deliverables : ['Collaborative engineering outcome'],
      targetAudience: 'Software engineers, researchers, and early-career innovators.',
      tags: [...skillsRequired, category],
      codeAvailability,
      githubRepo: repositoryUrl.trim()
        ? {
            id: Date.now(),
            name: title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            full_name: `${currentUser.githubUsername || 'skillsink-team'}/${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            description: summary,
            html_url: repositoryUrl.trim(),
            stargazers_count: 12,
            language: skillsRequired[0] || 'TypeScript',
            updated_at: new Date().toISOString(),
          }
        : null,
      status,
      openRoles: status === 'Looking for collaborators' ? openRoles : [],
      liveDemoUrl: liveDemoUrl.trim() || undefined,
      industry,
      category,
      skillsRequired,
      skillsPreferred,
      experienceLevel,
      estimatedDuration,
      collaborationType,
      targetTeamSize,
      deliverables,
      compensationInfo,
      openToStudents,
      seekingIndustryMentor,
      screenshots: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      ],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col text-left">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Create Professional Work Project</h2>
              <p className="text-xs text-slate-500">
                Created by {currentUser.name} ({currentUser.jobTitle || currentUser.identities.join(', ')})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs sm:text-sm">
          {/* Cross-Hub Collaboration Callout (CRITICAL) */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-700" />
                  <span className="font-bold text-blue-950 text-xs sm:text-sm">
                    Open to Students & Early-Career Collaborators
                  </span>
                </div>
                <p className="text-xs text-blue-900 leading-relaxed">
                  Allow university students from the Campus Hub to discover this project, apply for open roles, and gain real-world portfolio experience. You can review applications and mentor them.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={openToStudents}
                  onChange={(e) => setOpenToStudents(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-blue-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-blue-950 font-medium">
                <input
                  type="checkbox"
                  checked={seekingIndustryMentor}
                  onChange={(e) => setSeekingIndustryMentor(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Also seeking an experienced Industry Mentor for technical advisory</span>
              </label>
            </div>
          </div>

          {/* Title, Summary & Detailed Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., OmniVortex Distributed Agentic Control Plane"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                One-Line Summary *
              </label>
              <input
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="High-impact one-liner explaining the project core value"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Detailed Description *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the background problem, target technical architecture, and collaboration scope..."
                className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed"
                required
              />
            </div>
          </div>

          {/* Industry & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Project Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Industry Domain *
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g., Cloud & Distributed Systems, HealthTech"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                required
              />
            </div>
          </div>

          {/* Skills Required & Preferred */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Skills Required (Used for deterministic match scoring)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {skillsRequired.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-md text-xs font-medium"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => setSkillsRequired(skillsRequired.filter((item) => item !== s))}
                      className="text-blue-400 hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newReqSkill}
                  onChange={(e) => setNewReqSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addReqSkill();
                    }
                  }}
                  placeholder="Add required skill (e.g. Go, PyTorch, React)..."
                  className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
                <button
                  type="button"
                  onClick={addReqSkill}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Skills Preferred (Nice to have)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {skillsPreferred.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => setSkillsPreferred(skillsPreferred.filter((item) => item !== s))}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPrefSkill}
                  onChange={(e) => setNewPrefSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addPrefSkill();
                    }
                  }}
                  placeholder="Add preferred skill..."
                  className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
                <button
                  type="button"
                  onClick={addPrefSkill}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Roles Needed */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Open Roles Needed
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {openRoles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-300 text-slate-800 rounded-lg text-xs font-medium"
                >
                  <span>{role}</span>
                  <button
                    type="button"
                    onClick={() => setOpenRoles(openRoles.filter((r) => r !== role))}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRoleInput}
                onChange={(e) => setNewRoleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addRole();
                  }
                }}
                placeholder="e.g., Frontend dev, UI designer, DevOps lead..."
                className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
              <button
                type="button"
                onClick={addRole}
                className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
              >
                Add Role
              </button>
            </div>
          </div>

          {/* Experience Level, Duration, Mode, Team Size */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Mixed">Mixed (All levels)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Estimated Duration
              </label>
              <select
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="2-4 weeks">2-4 weeks</option>
                <option value="1-3 months">1-3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="Ongoing">Ongoing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Work Mode
              </label>
              <select
                value={collaborationType}
                onChange={(e) => setCollaborationType(e.target.value as any)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="In-person">In-person</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Target Team Size
              </label>
              <input
                type="number"
                min={2}
                max={15}
                value={targetTeamSize}
                onChange={(e) => setTargetTeamSize(parseInt(e.target.value) || 4)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          {/* Expected Deliverables & Compensation */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Expected Deliverables & Goals
              </label>
              <div className="space-y-1.5 mb-2">
                {deliverables.map((d, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <span>› {d}</span>
                    <button
                      type="button"
                      onClick={() => setDeliverables(deliverables.filter((_, idx) => idx !== i))}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDeliverable}
                  onChange={(e) => setNewDeliverable(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addDeliverableItem();
                    }
                  }}
                  placeholder="Add target deliverable..."
                  className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
                <button
                  type="button"
                  onClick={addDeliverableItem}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Compensation / Project Model Notice
              </label>
              <input
                type="text"
                value={compensationInfo}
                onChange={(e) => setCompensationInfo(e.target.value)}
                placeholder="e.g. Unpaid collaborative / Open Source / Future Revenue Share"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Work Hub projects represent collaborative opportunities, not automatic employment.
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GitHub Repository URL (Optional)
              </label>
              <input
                type="url"
                value={repositoryUrl}
                onChange={(e) => setRepositoryUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Live Staging Demo Link (Optional)
              </label>
              <input
                type="url"
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                placeholder="https://myproject.demo.dev"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Create Work Project
          </button>
        </div>
      </div>
    </div>
  );
};
