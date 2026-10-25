import React, { useState, useEffect } from 'react';
import { Project, CodeAvailability, ProjectStatus, GitHubRepo } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  GitBranch,
  KeyRound,
  Eye,
  Github,
  Plus,
  Trash2,
  AlertTriangle,
  Sparkles,
  Link2,
  Video,
  Globe,
  CheckCircle2,
} from 'lucide-react';

interface ShareProjectModalProps {
  onClose: () => void;
  initialData?: Partial<Project>;
}

export const ShareProjectModal: React.FC<ShareProjectModalProps> = ({ onClose, initialData }) => {
  const {
    currentUser,
    userRepos,
    connectGitHub,
    openGitHubModal,
    addProject,
    showToast,
  } = useApp();

  // Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [whatItDoes, setWhatItDoes] = useState(initialData?.whatItDoes || '');
  const [targetAudience, setTargetAudience] = useState(initialData?.targetAudience || '');
  const [useCases, setUseCases] = useState<string[]>(
    initialData?.useCases && initialData.useCases.length > 0
      ? initialData.useCases
      : ['Campus coursework and research benchmarking', 'Automated student team workflow']
  );
  const [newUseCaseInput, setNewUseCaseInput] = useState('');

  // Media
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState(initialData?.liveDemoUrl || '');
  const [demoVideoUrl, setDemoVideoUrl] = useState(initialData?.demoVideoUrl || '');

  // Tags
  const [tags, setTags] = useState<string[]>(initialData?.tags || ['React', 'TypeScript', 'Web']);
  const [newTagInput, setNewTagInput] = useState('');

  // Code sharing choice
  const isClassProject = !!initialData?.isClassProject;
  const [codeAvailability, setCodeAvailability] = useState<CodeAvailability>(
    isClassProject ? 'on_request' : initialData?.codeAvailability || 'public'
  );

  // GitHub repo attachment
  const [selectedRepoId, setSelectedRepoId] = useState<string>(
    initialData?.githubRepo?.id ? String(initialData.githubRepo.id) : ''
  );
  const [customRepoUrl, setCustomRepoUrl] = useState(initialData?.githubRepo?.html_url || '');

  // Status & Roles
  const [status, setStatus] = useState<ProjectStatus>(
    initialData?.status || 'Looking for collaborators'
  );
  const [openRoles, setOpenRoles] = useState<string[]>(
    initialData?.openRoles || ['Frontend dev', 'UI designer']
  );
  const [newRoleInput, setNewRoleInput] = useState('');

  // Quick inline github connect state
  const [inlineGithubUser, setInlineGithubUser] = useState('');
  const [isInlineConnecting, setIsInlineConnecting] = useState(false);

  const handleInlineConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineGithubUser.trim()) return;
    setIsInlineConnecting(true);
    await connectGitHub(inlineGithubUser);
    setIsInlineConnecting(false);
  };

  const addUseCase = () => {
    if (newUseCaseInput.trim()) {
      setUseCases([...useCases, newUseCaseInput.trim()]);
      setNewUseCaseInput('');
    }
  };

  const removeUseCase = (index: number) => {
    setUseCases(useCases.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const addRole = () => {
    if (newRoleInput.trim() && !openRoles.includes(newRoleInput.trim())) {
      setOpenRoles([...openRoles, newRoleInput.trim()]);
      setNewRoleInput('');
    }
  };

  const removeRole = (roleToRemove: string) => {
    setOpenRoles(openRoles.filter((r) => r !== roleToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !summary.trim() || !description.trim()) {
      showToast('Please fill in project title, summary, and description', 'warning');
      return;
    }

    if (codeAvailability === 'public' && isClassProject) {
      showToast('Class projects cannot have public source code due to academic integrity policy.', 'warning');
      return;
    }

    // Resolve attached repo
    let attachedRepo: GitHubRepo | null = null;
    if (codeAvailability === 'public') {
      if (selectedRepoId) {
        attachedRepo = userRepos.find((r) => String(r.id) === selectedRepoId) || null;
      }
      if (!attachedRepo && customRepoUrl) {
        attachedRepo = {
          id: Date.now(),
          name: title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          full_name: `${currentUser.githubUsername || 'student'}/${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          description: summary,
          html_url: customRepoUrl,
          stargazers_count: 5,
          language: tags[0] || 'TypeScript',
          updated_at: new Date().toISOString(),
        };
      }
    }

    const screenshots = screenshotUrl.trim()
      ? [screenshotUrl.trim()]
      : initialData?.screenshots?.length
      ? initialData.screenshots
      : [
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
        ];

    addProject({
      title: title.trim(),
      summary: summary.trim(),
      description: description.trim(),
      whatItDoes: whatItDoes.trim() || summary.trim(),
      useCases: useCases.length > 0 ? useCases : ['General academic and engineering application'],
      targetAudience: targetAudience.trim() || 'Students, engineers, and faculty researchers.',
      tags: tags.length > 0 ? tags : ['Project'],
      codeAvailability,
      githubRepo: attachedRepo,
      status,
      openRoles: status === 'Looking for collaborators' ? openRoles : [],
      screenshots,
      liveDemoUrl: liveDemoUrl.trim() || undefined,
      demoVideoUrl: demoVideoUrl.trim() || undefined,
      isClassProject,
      courseName: initialData?.courseName,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Share a Project to the Showcase</h2>
            <p className="text-xs text-slate-500">
              {isClassProject
                ? `Publishing coursework submission from ${initialData?.courseName || 'Class'}`
                : 'Visible to students and faculty across all universities.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-left">
          {/* Academic integrity banner if sharing a class project */}
          {isClassProject && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1">
                <span className="font-bold text-amber-950 block">
                  Coursework Anti-Copying Policy Enforced
                </span>
                <p className="leading-relaxed">
                  To uphold academic integrity and prevent code plagiarism in shared courses, class projects cannot expose public source code repositories. You can choose <strong>&quot;Code available on request&quot;</strong> or <strong>&quot;No code (Demo only)&quot;</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Title, Summary & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., BuckeyeRover Autonomous Terrain Navigator"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                placeholder="A concise, punchy description shown on project cards (max 120 characters)"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Description *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail the technical architecture, problem statement, key algorithms, benchmarks, or experimental results..."
                className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed"
                required
              />
            </div>
          </div>

          {/* Section: What it does & How to use it */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                What it does / How to use it
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Explain the real-world utility, user interaction steps, and intended audience.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Workflow & How to Use It
              </label>
              <textarea
                rows={2}
                value={whatItDoes}
                onChange={(e) => setWhatItDoes(e.target.value)}
                placeholder="Describe what a user does: e.g., 'Connects to ROS2 topic /camera/depth, registers 3D point cloud, and generates local spline trajectories.'"
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Audience / Who it is for
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., Robotics teams, STEM researchers, student developers"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Use Cases
              </label>
              <div className="space-y-2 mb-2">
                {useCases.map((uc, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <span className="text-slate-800">› {uc}</span>
                    <button
                      type="button"
                      onClick={() => removeUseCase(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newUseCaseInput}
                  onChange={(e) => setNewUseCaseInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addUseCase();
                    }
                  }}
                  placeholder="Add a concrete use case..."
                  className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
                <button
                  type="button"
                  onClick={addUseCase}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Add Use Case
                </button>
              </div>
            </div>
          </div>

          {/* Code Sharing Choice (REQUIRED - 3 Options) */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Code Sharing Choice *
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Decide whether to provide public code, keep code on request, or show as demo only.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Public Code */}
              <label
                className={`flex flex-col p-3.5 rounded-xl border transition-all cursor-pointer ${
                  codeAvailability === 'public'
                    ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500'
                    : isClassProject
                    ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <GitBranch className="w-4 h-4 text-emerald-600" />
                    <span>1. Public code</span>
                  </div>
                  <input
                    type="radio"
                    name="codeAvailability"
                    value="public"
                    disabled={isClassProject}
                    checked={codeAvailability === 'public'}
                    onChange={() => setCodeAvailability('public')}
                    className="text-emerald-600"
                  />
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Link a GitHub repo. Full code is visible to everyone on your project page.
                </p>
                {isClassProject && (
                  <span className="text-[10px] text-rose-600 font-semibold mt-2">
                    Blocked for class projects
                  </span>
                )}
              </label>

              {/* Option 2: Code available on request */}
              <label
                className={`flex flex-col p-3.5 rounded-xl border transition-all cursor-pointer ${
                  codeAvailability === 'on_request'
                    ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <KeyRound className="w-4 h-4 text-amber-600" />
                    <span>2. On request</span>
                  </div>
                  <input
                    type="radio"
                    name="codeAvailability"
                    value="on_request"
                    checked={codeAvailability === 'on_request'}
                    onChange={() => setCodeAvailability('on_request')}
                    className="text-amber-600"
                  />
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Hidden by default. Students can send you an access request in your Inbox.
                </p>
              </label>

              {/* Option 3: No code */}
              <label
                className={`flex flex-col p-3.5 rounded-xl border transition-all cursor-pointer ${
                  codeAvailability === 'none'
                    ? 'border-slate-600 bg-slate-100 ring-1 ring-slate-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Eye className="w-4 h-4 text-slate-600" />
                    <span>3. No code</span>
                  </div>
                  <input
                    type="radio"
                    name="codeAvailability"
                    value="none"
                    checked={codeAvailability === 'none'}
                    onChange={() => setCodeAvailability('none')}
                    className="text-slate-600"
                  />
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Shown as a demo and description only. No repository links.
                </p>
              </label>
            </div>

            {/* GitHub Repo Attachment (Active when Public Code is selected) */}
            {codeAvailability === 'public' && !isClassProject && (
              <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-slate-800" />
                    <span className="text-xs font-bold text-slate-900">Attach GitHub Repository</span>
                  </div>

                  {currentUser.githubConnected ? (
                    <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      Connected: @{currentUser.githubUsername}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={openGitHubModal}
                      className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      Connect GitHub Account
                    </button>
                  )}
                </div>

                {currentUser.githubConnected ? (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Select from your fetched repositories:
                    </label>
                    <select
                      value={selectedRepoId}
                      onChange={(e) => {
                        setSelectedRepoId(e.target.value);
                        const repo = userRepos.find((r) => String(r.id) === e.target.value);
                        if (repo) setCustomRepoUrl(repo.html_url);
                      }}
                      className="w-full text-xs font-mono p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="">-- Choose a public repo --</option>
                      {userRepos.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.language || 'Code'} · ★ {r.stargazers_count})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-600">
                      Connect your GitHub username to quickly attach any public repository:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inlineGithubUser}
                        onChange={(e) => setInlineGithubUser(e.target.value)}
                        placeholder="Enter GitHub username (e.g., alexchen)..."
                        className="flex-1 text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleInlineConnect}
                        disabled={isInlineConnecting}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      >
                        {isInlineConnecting ? 'Fetching...' : 'Connect'}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Or paste GitHub Repository URL directly:
                  </label>
                  <input
                    type="url"
                    value={customRepoUrl}
                    onChange={(e) => setCustomRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/repository"
                    className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Project Status & Open Roles */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Project Status *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Active', 'Looking for collaborators', 'Finished'] as ProjectStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatus(st)}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        status === st
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* If looking for collaborators: Add Open Roles */}
            {status === 'Looking for collaborators' && (
              <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-950">
                    Open Roles Wanted for Collaborators
                  </span>
                  <span className="text-[11px] text-blue-700">
                    Students can apply or message about these roles
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {openRoles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-blue-300 text-blue-900 rounded-lg text-xs font-medium"
                    >
                      <span>{role}</span>
                      <button
                        type="button"
                        onClick={() => removeRole(role)}
                        className="text-blue-400 hover:text-rose-600 transition-colors cursor-pointer"
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
                    placeholder="e.g., Frontend dev, UI designer, Firmware specialist..."
                    className="flex-1 text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addRole}
                    className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Add Role
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tags for skills, languages, topics */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Tags for Skills, Languages, & Topics
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag (e.g., Python, Computer Vision, Robotics)..."
                className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* Links & Optional Media */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Live Demo Link (Optional)
              </label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  placeholder="https://myproject.demo.dev"
                  className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Demo Video Link (Optional)
              </label>
              <div className="relative">
                <Video className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={demoVideoUrl}
                  onChange={(e) => setDemoVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Publish to Showcase
          </button>
        </div>
      </div>
    </div>
  );
};
