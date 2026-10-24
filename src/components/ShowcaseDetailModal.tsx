import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ExternalLink,
  Github,
  Star,
  Lock,
  Eye,
  Heart,
  MessageSquare,
  UserPlus,
  KeyRound,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Share2,
  Calendar,
  Layers,
  Send,
  Code2,
} from 'lucide-react';

export const ShowcaseDetailModal: React.FC = () => {
  const {
    showcaseProjects,
    selectedShowcaseProjectId,
    setSelectedShowcaseProjectId,
    toggleShowcaseInterest,
    sendDirectMessage,
    sendCollaborationInvitation,
    requestCodeAccess,
    currentUser,
    currentSchool,
    projects,
    users,
    inboxCodeRequests,
    inboxInvitations,
  } = useApp();

  const [activeActionModal, setActiveActionModal] = useState<
    'none' | 'message' | 'invite' | 'requestCode'
  >('none');

  // Action form states
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const [selectedInviteProject, setSelectedInviteProject] = useState<string>('new_idea');
  const [inviteRole, setInviteRole] = useState('Frontend Dev');
  const [inviteNote, setInviteNote] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  const [requestCodeReason, setRequestCodeReason] = useState('');
  const [requestCodeSent, setRequestCodeSent] = useState(false);

  if (!selectedShowcaseProjectId) return null;

  const project = showcaseProjects.find((p) => p.id === selectedShowcaseProjectId);
  if (!project) return null;

  const author = users.find((u) => u.id === project.authorId);
  const isOwner = currentUser?.id === project.authorId;

  // Check if current user has an active code request for this project
  const existingCodeRequest = inboxCodeRequests.find(
    (r) => r.showcaseProjectId === project.id && r.fromUserId === currentUser?.id
  );

  const isCodeAccessGranted =
    project.codeAvailability === 'public' ||
    (existingCodeRequest && existingCodeRequest.status === 'accepted');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendDirectMessage(project.authorId, messageText.trim(), project.id, project.title);
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setMessageText('');
      setActiveActionModal('none');
    }, 1500);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteRole.trim()) return;

    let projTitle = 'New Project / Idea';
    if (selectedInviteProject !== 'new_idea') {
      const match = projects.find((p) => p.id === selectedInviteProject);
      if (match) projTitle = match.title;
    }

    sendCollaborationInvitation(
      project.authorId,
      selectedInviteProject,
      projTitle,
      inviteRole.trim(),
      inviteNote.trim() || `I would love for you to join ${projTitle} as ${inviteRole.trim()}!`
    );
    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
      setInviteNote('');
      setActiveActionModal('none');
    }, 1500);
  };

  const handleSendCodeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestCodeReason.trim()) return;
    requestCodeAccess(project.authorId, project.id, project.title, requestCodeReason.trim());
    setRequestCodeSent(true);
    setTimeout(() => {
      setRequestCodeSent(false);
      setRequestCodeReason('');
      setActiveActionModal('none');
    }, 1500);
  };

  // User's own projects they can invite the author to
  const userProjects = projects.filter(
    (p) => currentUser && (p.ownerId === currentUser.id || p.members.some((m) => m.userId === currentUser.id))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-white text-slate-800 border border-slate-200 shadow-xs">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              {project.authorSchoolName}
            </span>

            {project.codeAvailability === 'public' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Code2 className="w-3.5 h-3.5" />
                Code public
              </span>
            )}
            {project.codeAvailability === 'on_request' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <Lock className="w-3.5 h-3.5" />
                Code on request
              </span>
            )}
            {project.codeAvailability === 'none' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                <Eye className="w-3.5 h-3.5" />
                No code
              </span>
            )}

            {project.isClassProject && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 border border-indigo-200">
                Coursework Project
              </span>
            )}
          </div>

          <button
            onClick={() => setSelectedShowcaseProjectId(null)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Title & One-Line Summary */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {project.title}
              </h2>
              {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors border border-indigo-200"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Live Demo
                </a>
              )}
            </div>
            <p className="text-sm sm:text-base font-medium text-slate-600 leading-relaxed">
              {project.summary}
            </p>
          </div>

          {/* Media / Screenshot Banner */}
          {project.mediaUrl && (
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs max-h-72">
              <img
                src={project.mediaUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Description & Use Cases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                About the Project
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                {project.description}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                What it does & How to use it
              </h4>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-2">
                <p>{project.useCases}</p>
                <div className="pt-2 border-t border-slate-200 flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Project Status:</span>
                  <span className="capitalize px-2 py-0.5 rounded bg-white border border-slate-200 font-medium">
                    {project.status === 'collaborating' ? 'Looking for collaborators' : project.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Collaborator Open Roles Banner */}
          {project.status === 'collaborating' && project.openRoles.length > 0 && (
            <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-900">
                <UserPlus className="w-4 h-4 text-indigo-600" />
                Active Call for Collaborators:
              </div>
              <p className="text-xs text-indigo-800">
                The author is looking for student partners to join and build together. Available roles:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {project.openRoles.map((role, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-3 py-1 rounded-md bg-white text-indigo-900 border border-indigo-200 shadow-xs"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* GitHub Repository Card */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Source Code & Repository
            </h4>

            {project.codeAvailability === 'public' && (project.githubRepo || project.githubRepoUrl) ? (
              <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <Github className="w-5 h-5 text-indigo-400" />
                    <span className="font-mono text-sm font-bold text-white">
                      {project.githubRepo?.full_name || project.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Public Repository
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {project.githubRepo?.description || 'Open source repository verified on GitHub.'}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                    {project.githubRepo?.language && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                        {project.githubRepo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {project.githubRepo?.stargazers_count || 12} stars
                    </span>
                    {project.githubRepo?.updated_at && (
                      <span className="text-slate-500">
                        Updated {new Date(project.githubRepo.updated_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <a
                  href={project.githubRepo?.html_url || project.githubRepoUrl || 'https://github.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shrink-0 shadow-xs"
                >
                  <Github className="w-4 h-4" />
                  View on GitHub
                </a>
              </div>
            ) : project.codeAvailability === 'on_request' ? (
              <div className="bg-amber-50/70 rounded-xl p-5 border border-amber-200 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-bold text-amber-950">Code available on request</h5>
                      {existingCodeRequest?.status === 'accepted' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Access Granted!
                        </span>
                      )}
                      {existingCodeRequest?.status === 'pending' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                          Request Pending
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      {project.isClassProject
                        ? 'Because this project stems from university coursework, source code is restricted to prevent academic misconduct. The author can grant code access upon request for research or collaboration.'
                        : 'The repository is kept private by the author. Send a request to review the code or contribute.'}
                    </p>
                  </div>
                </div>

                {existingCodeRequest?.status === 'accepted' && existingCodeRequest.grantedRepoUrl && (
                  <div className="pt-2 border-t border-amber-200 flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-emerald-900 bg-white px-3 py-1.5 rounded border border-emerald-200 truncate flex-1">
                      {existingCodeRequest.grantedRepoUrl}
                    </span>
                    <a
                      href={existingCodeRequest.grantedRepoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shrink-0"
                    >
                      <Github className="w-3.5 h-3.5" />
                      Open Repo
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 flex items-center gap-3">
                <Eye className="w-5 h-5 text-slate-400 shrink-0" />
                <span>
                  This project is shown as an interactive demonstration and technical case study without public source code.
                </span>
              </div>
            )}
          </div>

          {/* Author Profile Preview */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-xs">
                {project.authorAvatarInitial}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">{project.authorName}</h4>
                  <span className="text-[11px] text-slate-500">· {project.authorSchoolName}</span>
                </div>
                <p className="text-xs text-slate-600">
                  {author?.major || 'Student Engineer'}
                  {author?.year ? ` (${author.year})` : ''}
                </p>
                {author?.githubConnected && (
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      <Github className="w-3 h-3" />
                      GitHub connected: @{author.githubUsername || 'marcusvance-dev'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-mono">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                {project.viewsCount} views
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 font-mono text-rose-600 font-semibold">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                {project.interestedCount} interested
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="border-t border-slate-200 bg-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          {/* Interested Button */}
          <button
            onClick={() => toggleShowcaseInterest(project.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 ${
              project.userInterested
                ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs'
                : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                project.userInterested ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
            {project.userInterested ? 'Interested' : 'Interested?'} ({project.interestedCount})
          </button>

          {/* Contact & Collab Buttons (only if not own project) */}
          {!isOwner && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Message Button */}
              <button
                onClick={() => setActiveActionModal('message')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-semibold text-xs transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                Message
              </button>

              {/* Invite to collaborate Button */}
              <button
                onClick={() => setActiveActionModal('invite')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 active:scale-95 text-indigo-700 border border-indigo-200 font-semibold text-xs transition-all"
              >
                <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
                Invite to collaborate
              </button>

              {/* Request Code Access (only if on_request) */}
              {project.codeAvailability === 'on_request' && (
                <button
                  disabled={existingCodeRequest?.status === 'accepted'}
                  onClick={() => setActiveActionModal('requestCode')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all active:scale-95 ${
                    existingCodeRequest?.status === 'accepted'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                      : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  {existingCodeRequest?.status === 'accepted'
                    ? 'Code Access Granted'
                    : existingCodeRequest?.status === 'pending'
                    ? 'Request Pending'
                    : 'Request code access'}
                </button>
              )}
            </div>
          )}

          {isOwner && (
            <div className="text-xs text-indigo-600 font-semibold flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              You are the author of this showcase project
            </div>
          )}
        </div>
      </div>

      {/* SUB-MODAL 1: MESSAGE AUTHOR */}
      {activeActionModal === 'message' && (
        <div className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Message {project.authorName}
                </h3>
              </div>
              <button
                onClick={() => setActiveActionModal('none')}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {messageSent ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">Message Sent!</h4>
                <p className="text-xs text-slate-500">
                  Your message has been delivered to {project.authorName}'s Inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Regarding {project.title}
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder={`Hi ${project.authorName}, I saw your project on the Showcase and wanted to ask about...`}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveActionModal('none')}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SUB-MODAL 2: INVITE TO COLLABORATE */}
      {activeActionModal === 'invite' && (
        <div className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Invite {project.authorName} to Collaborate
                </h3>
              </div>
              <button
                onClick={() => setActiveActionModal('none')}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {inviteSent ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">Invitation Sent!</h4>
                <p className="text-xs text-slate-500">
                  {project.authorName} will receive an invite notification in their Inbox to join your project.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Select Project to Invite To:
                  </label>
                  <select
                    value={selectedInviteProject}
                    onChange={(e) => setSelectedInviteProject(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="new_idea">+ A new project / idea</option>
                    {userProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.type === 'class' ? 'Class Project' : 'Personal Project'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Role Offered:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Frontend Dev, UI/UX Designer, ML Engineer"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Personal Note / Pitch:
                  </label>
                  <textarea
                    rows={3}
                    placeholder={`Hey ${project.authorName}, we really admired your work on ${project.title} and think your skills would be awesome for our sprint...`}
                    value={inviteNote}
                    onChange={(e) => setInviteNote(e.target.value)}
                    className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveActionModal('none')}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Send Collaboration Invite
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SUB-MODAL 3: REQUEST CODE ACCESS */}
      {activeActionModal === 'requestCode' && (
        <div className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Request Code Access
                </h3>
              </div>
              <button
                onClick={() => setActiveActionModal('none')}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {requestCodeSent ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">Code Request Sent!</h4>
                <p className="text-xs text-slate-500">
                  {project.authorName} has received your request. When approved, the repository URL will be revealed in your Inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendCodeRequest} className="space-y-4">
                <div className="rounded-lg bg-amber-50 p-3 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  Provide a brief explanation of why you'd like access to this repository (e.g. academic review, audit, potential collaboration).
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Reason for Request:
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder={`Hi ${project.authorName}, I'm working on a similar system and would love to review your implementation to cite it or explore integration...`}
                    value={requestCodeReason}
                    onChange={(e) => setRequestCodeReason(e.target.value)}
                    className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveActionModal('none')}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
