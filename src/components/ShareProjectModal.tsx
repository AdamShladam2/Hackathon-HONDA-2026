import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CodeAvailability, ShowcaseStatus, GitHubRepo } from '../types';
import { canShareAsPublicCode } from '../utils/showcase';
import {
  X,
  Plus,
  Trash2,
  Github,
  AlertTriangle,
  Lock,
  Code2,
  Eye,
  CheckCircle2,
  Sparkles,
  Link as LinkIcon,
  HelpCircle,
  GraduationCap,
  Layers,
} from 'lucide-react';

export const ShareProjectModal: React.FC = () => {
  const {
    isShareProjectOpen,
    setIsShareProjectOpen,
    shareSourceClassProject,
    setShareSourceClassProject,
    shareShowcaseProject,
    currentUser,
    connectGitHub,
    setSelectedShowcaseProjectId,
    setActiveTab,
  } = useApp();

  // Form Fields
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [useCases, setUseCases] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isClassProject, setIsClassProject] = useState(false);
  const [codeAvailability, setCodeAvailability] = useState<CodeAvailability>('public');
  const [status, setStatus] = useState<ShowcaseStatus>('collaborating');
  const [openRoles, setOpenRoles] = useState<string[]>(['Frontend Dev', 'UI Designer']);
  const [newRoleInput, setNewRoleInput] = useState('');

  // GitHub connection state in modal
  const [selectedRepoId, setSelectedRepoId] = useState<number | null>(null);
  const [customGitHubUsername, setCustomGitHubUsername] = useState('');
  const [isConnectingGitHub, setIsConnectingGitHub] = useState(false);
  const [githubConnectStatus, setGithubConnectStatus] = useState<string | null>(null);

  // Validation / Error
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pre-fill if opened from a class project
  useEffect(() => {
    if (shareSourceClassProject) {
      setTitle(shareSourceClassProject.title);
      setSummary(shareSourceClassProject.tagline || '');
      setDescription(shareSourceClassProject.description || '');
      setUseCases(
        'Developed for university coursework. Validated for academic benchmarks and peer collaboration.'
      );
      setTagsInput(shareSourceClassProject.tags.join(', '));
      setIsClassProject(true);
      // Academic integrity: class projects cannot default to public code!
      setCodeAvailability('on_request');
      setStatus(shareSourceClassProject.openToJoin ? 'collaborating' : 'active');
      setOpenRoles(shareSourceClassProject.openRoles || []);
    } else {
      // Default reset
      setIsClassProject(false);
    }
  }, [shareSourceClassProject, isShareProjectOpen]);

  // Enforce anti-copying rule when class project is toggled
  useEffect(() => {
    if (isClassProject && codeAvailability === 'public') {
      setCodeAvailability('on_request');
    }
  }, [isClassProject, codeAvailability]);

  if (!isShareProjectOpen) return null;

  const handleConnectGitHub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGitHubUsername.trim()) return;
    setIsConnectingGitHub(true);
    setGithubConnectStatus(null);

    const res = await connectGitHub(customGitHubUsername);
    setIsConnectingGitHub(false);
    if (res.success) {
      setGithubConnectStatus(`Connected! Loaded ${res.reposCount} public repositories.`);
    } else {
      setGithubConnectStatus(res.message || 'Could not load repositories.');
    }
  };

  const handleAddRole = () => {
    if (!newRoleInput.trim()) return;
    if (!openRoles.includes(newRoleInput.trim())) {
      setOpenRoles([...openRoles, newRoleInput.trim()]);
    }
    setNewRoleInput('');
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setOpenRoles(openRoles.filter((r) => r !== roleToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate anti-copying rule
    const check = canShareAsPublicCode(isClassProject, codeAvailability);
    if (!check.allowed) {
      setErrorMessage(check.reason || 'Invalid code sharing option for coursework.');
      return;
    }

    if (!title.trim() || !summary.trim() || !description.trim() || !useCases.trim()) {
      setErrorMessage('Please fill in all required project information.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // Selected repo object if public
    let attachedRepo: GitHubRepo | undefined;
    if (selectedRepoId && currentUser?.githubRepos) {
      attachedRepo = currentUser.githubRepos.find((r) => r.id === selectedRepoId);
    } else if (currentUser?.githubRepos && currentUser.githubRepos.length > 0) {
      attachedRepo = currentUser.githubRepos[0];
    }

    const result = shareShowcaseProject({
      title: title.trim(),
      summary: summary.trim(),
      description: description.trim(),
      useCases: useCases.trim(),
      mediaUrl: mediaUrl.trim() || undefined,
      liveDemoUrl: liveDemoUrl.trim() || undefined,
      tags: tags.length > 0 ? tags : ['Student Project', 'Open Source'],
      codeAvailability,
      githubRepo: codeAvailability === 'public' ? attachedRepo : undefined,
      githubRepoUrl: attachedRepo?.html_url,
      status,
      openRoles: status === 'collaborating' ? openRoles : [],
      isClassProject,
      sourceClassProjectId: shareSourceClassProject?.id,
    });

    if (result.success) {
      setIsShareProjectOpen(false);
      setShareSourceClassProject(null);
      setActiveTab('showcase');
    } else {
      setErrorMessage(result.error || 'Failed to share project.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-slate-900">Share Project to Public Showcase</h2>
            <p className="text-xs text-slate-500">
              Visible to students and faculty across all universities.
            </p>
          </div>
          <button
            onClick={() => {
              setIsShareProjectOpen(false);
              setShareSourceClassProject(null);
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Academic Integrity / Coursework Banner */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isClassProject}
                onChange={(e) => setIsClassProject(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                This project was created for university coursework or class credit
              </span>
            </label>

            {isClassProject && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 leading-relaxed space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  Anti-Copying Academic Integrity Rule Active:
                </div>
                <p>
                  Class projects cannot be published with open public code repositories to prevent academic misconduct, homework copying, and honor code violations across institutions.
                </p>
                <p className="font-semibold text-amber-950">
                  "Public code" has been disabled. You may share with "Code on request" or "No code".
                </p>
              </div>
            )}
          </div>

          {/* Title & Summary */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Project Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. BuckeyeRoute: Campus Transit Optimizer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">One-Line Summary *</label>
              <input
                type="text"
                required
                placeholder="A crisp, single sentence explaining what you built"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Description & Use Cases */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Detailed Description *</label>
              <textarea
                rows={3}
                required
                placeholder="Explain the background, architecture, and technology stack..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                What it does / How to use it (Use cases & target users) *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe practical use cases: Who should use it? How do they interact with it?"
                value={useCases}
                onChange={(e) => setUseCases(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Links (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Live Demo URL (Optional)</label>
              <input
                type="url"
                placeholder="https://myproject.edu or vercel.app"
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Screenshot / Demo Video Image URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://... image link"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Tags (skills, languages, topics — comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. TypeScript, React, Python, WebGL, Transit, Robotics"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* CODE SHARING CHOICE (Required 3 Options) */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-900 block">
              Code Sharing Choice * (Select one)
            </label>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Option 1: Public Code */}
              <label
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                  isClassProject
                    ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed'
                    : codeAvailability === 'public'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="codeAvailability"
                  value="public"
                  disabled={isClassProject}
                  checked={codeAvailability === 'public'}
                  onChange={() => setCodeAvailability('public')}
                  className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">1. Public code</span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      GitHub Repo Linked
                    </span>
                    {isClassProject && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                        Blocked for coursework
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Your GitHub repository link is publicly visible so anyone can view code, stars, and languages.
                  </p>
                </div>
              </label>

              {/* Option 2: Code on request */}
              <label
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                  codeAvailability === 'on_request'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="codeAvailability"
                  value="on_request"
                  checked={codeAvailability === 'on_request'}
                  onChange={() => setCodeAvailability('on_request')}
                  className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      2. Code available on request
                    </span>
                    <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Hidden until approved
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Repository link is hidden. Other students can submit a request with their reasoning to get access.
                  </p>
                </div>
              </label>

              {/* Option 3: No code */}
              <label
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                  codeAvailability === 'none'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="codeAvailability"
                  value="none"
                  checked={codeAvailability === 'none'}
                  onChange={() => setCodeAvailability('none')}
                  className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">3. No code</span>
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      Demo & writeup only
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Project is shown as a functional demo, case study, or research paper without code access.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* GITHUB CONNECTION WIDGET (If public code chosen or available) */}
          {codeAvailability === 'public' && !isClassProject && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Github className="w-4 h-4 text-slate-800" />
                  Attach GitHub Repository
                </span>
                {currentUser?.githubConnected && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    @{currentUser.githubUsername}
                  </span>
                )}
              </div>

              {currentUser?.githubConnected && currentUser.githubRepos && currentUser.githubRepos.length > 0 ? (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-slate-600">
                    Select from your public repositories (one-click attach):
                  </label>
                  <select
                    value={selectedRepoId || currentUser.githubRepos[0].id}
                    onChange={(e) => setSelectedRepoId(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                  >
                    {currentUser.githubRepos.map((repo) => (
                      <option key={repo.id} value={repo.id}>
                        {repo.name} ({repo.language || 'Code'}, ★{repo.stargazers_count})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-600">
                    Connect your GitHub account to fetch your public repositories:
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. marcusvance-dev"
                      value={customGitHubUsername}
                      onChange={(e) => setCustomGitHubUsername(e.target.value)}
                      className="flex-1 text-xs p-2 rounded-lg border border-slate-200 bg-white"
                    />
                    <button
                      type="button"
                      disabled={isConnectingGitHub}
                      onClick={handleConnectGitHub}
                      className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shrink-0"
                    >
                      {isConnectingGitHub ? 'Fetching...' : 'Connect GitHub'}
                    </button>
                  </div>
                  {githubConnectStatus && (
                    <p className="text-xs text-emerald-700 font-medium">{githubConnectStatus}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STATUS & COLLABORATOR ROLES */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Project Status *</label>
              <div className="grid grid-cols-3 gap-2">
                {(['active', 'collaborating', 'finished'] as ShowcaseStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize border transition-all ${
                      status === st
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {st === 'collaborating' ? 'Looking for collaborators' : st}
                  </button>
                ))}
              </div>
            </div>

            {status === 'collaborating' && (
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 space-y-3 animate-in fade-in">
                <label className="text-xs font-bold text-indigo-900 block">
                  Open Roles Wanted:
                </label>
                <div className="flex flex-wrap gap-2">
                  {openRoles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-white text-indigo-900 border border-indigo-200 shadow-xs"
                    >
                      {role}
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(role)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="e.g. Backend Dev, Graphic Designer, QA Tester"
                    value={newRoleInput}
                    onChange={(e) => setNewRoleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRole();
                      }
                    }}
                    className="flex-1 text-xs p-2 rounded-lg border border-slate-200 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddRole}
                    className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
                  >
                    Add Role
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsShareProjectOpen(false);
                setShareSourceClassProject(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-xs transition-all shadow-xs"
            >
              Publish to Showcase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
