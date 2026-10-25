import React, { useState } from 'react';
import { Project } from '../types';
import { useApp } from '../context/AppContext';
import { openAttachedFile } from '../services/fileStore';
import { ProjectPeerAssessments } from './ProjectPeerAssessments';
import {
  X,
  GitBranch,
  KeyRound,
  Eye,
  Heart,
  MessageSquare,
  UserPlus,
  Lock,
  ExternalLink,
  Github,
  Star,
  Calendar,
  CheckCircle2,
  Users,
  Video,
  Globe,
  Share2,
  Sparkles,
  GraduationCap,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  Paperclip,
  FileText,
  Download,
  UserCheck,
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const {
    currentUser,
    toggleInterest,
    openCollaborateModal,
    openApplyModal,
    openMessageModal,
    openWorkspace,
    requestCodeAccess,
    codeRequests,
    getCompatibility,
    showToast,
    openPortfolio,
  } = useApp();

  const [requestCodeModalOpen, setRequestCodeModalOpen] = useState(false);
  const [requestCodeNote, setRequestCodeNote] = useState('');
  const [showCompatibilityDetails, setShowCompatibilityDetails] = useState(false);

  // Check if current user already requested code access
  const existingCodeRequest = codeRequests.find(
    (r) => r.projectId === project.id && r.fromUser.id === currentUser.id
  );

  const isGranted =
    project.grantedUsers?.includes(currentUser.id) ||
    existingCodeRequest?.status === 'accepted';

  const isOwnProject = project.author.id === currentUser.id;
  const isTeamMember = project.teamMembers.some((m) => m.id === currentUser.id);

  const compatibility = getCompatibility(project);

  const handleRequestCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestCodeNote.trim()) {
      showToast('Please include a brief note explaining why you need code access.', 'warning');
      return;
    }
    requestCodeAccess(project, requestCodeNote.trim());
    setRequestCodeModalOpen(false);
    setRequestCodeNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col text-left">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            {project.hubType === 'work' ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                Work Hub Project
              </span>
            ) : project.isClassProject ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                Coursework Submission
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                Showcase
              </span>
            )}

            {project.codeAvailability === 'public' && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                <GitBranch className="w-3.5 h-3.5 text-emerald-600" />
                Code public
              </span>
            )}
            {project.codeAvailability === 'on_request' && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                Code on request
              </span>
            )}
            {project.codeAvailability === 'none' && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                No code (Demo only)
              </span>
            )}

            {project.openToStudents && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                Open to Students
              </span>
            )}

            {project.status === 'Looking for collaborators' && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                Open for Collaboration
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                showToast('Project link copied to clipboard', 'info');
              }}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Share link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Compatibility Breakdown Card */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shadow-2xs">
                  {compatibility.overallScore}%
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                    Collaborator Compatibility for {currentUser.name}
                  </h3>
                  <p className="text-xs text-blue-800 font-medium">
                    {compatibility.explanation}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCompatibilityDetails(!showCompatibilityDetails)}
                className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer self-start sm:self-auto"
              >
                {showCompatibilityDetails ? 'Hide breakdown ↑' : 'View match breakdown ↓'}
              </button>
            </div>

            {/* Expanded Deterministic Scoring Breakdown */}
            {showCompatibilityDetails && (
              <div className="pt-3 border-t border-blue-200/70 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-white/80 rounded-lg border border-blue-100 space-y-1">
                  <span className="font-semibold text-slate-700 block">Skills Overlap</span>
                  <div className="text-base font-bold text-blue-600 tabular-nums">
                    {compatibility.skillsMatch.score} / 40
                  </div>
                  <span className="text-[11px] text-slate-500 block truncate">
                    Matched: {compatibility.skillsMatch.matched.join(', ') || 'General STEM'}
                  </span>
                </div>

                <div className="p-2.5 bg-white/80 rounded-lg border border-blue-100 space-y-1">
                  <span className="font-semibold text-slate-700 block">Industry Alignment</span>
                  <div className="text-base font-bold text-blue-600 tabular-nums">
                    {compatibility.industryMatch.score} / 25
                  </div>
                  <span className="text-[11px] text-slate-500 block truncate">
                    {compatibility.industryMatch.aligned ? 'Strong domain fit' : 'Adjacent domain'}
                  </span>
                </div>

                <div className="p-2.5 bg-white/80 rounded-lg border border-blue-100 space-y-1">
                  <span className="font-semibold text-slate-700 block">Experience Fit</span>
                  <div className="text-base font-bold text-blue-600 tabular-nums">
                    {compatibility.experienceMatch.score} / 15
                  </div>
                  <span className="text-[11px] text-slate-500 block truncate">
                    {compatibility.experienceMatch.label}
                  </span>
                </div>

                <div className="p-2.5 bg-white/80 rounded-lg border border-blue-100 space-y-1">
                  <span className="font-semibold text-slate-700 block">Schedule & Style</span>
                  <div className="text-base font-bold text-blue-600 tabular-nums">
                    {compatibility.availabilityMatch.score} / 20
                  </div>
                  <span className="text-[11px] text-slate-500 block truncate">
                    {compatibility.availabilityMatch.label}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Title & Summary */}
          <div>
            {(project.courseCode || project.courseName || project.professorName) && (
              <div className="flex items-center gap-2 flex-wrap mb-3 p-2.5 bg-indigo-50/80 border border-indigo-200 rounded-xl text-xs text-indigo-900">
                <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
                {project.courseCode && (
                  <span className="font-bold font-mono px-2 py-0.5 rounded bg-white text-indigo-950 border border-indigo-200 shadow-2xs">
                    {project.courseCode}
                  </span>
                )}
                {project.courseName && (
                  <span className="font-semibold text-slate-800">{project.courseName}</span>
                )}
                {project.professorName && (
                  <span className="text-indigo-800 bg-white/80 border border-indigo-200 px-2 py-0.5 rounded-md font-medium sm:ml-auto">
                    Instructor: <strong className="font-semibold text-indigo-950">{project.professorName}</strong>
                  </span>
                )}
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
              {project.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              {project.summary}
            </p>

            {/* Tags row */}
            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Tags & Skills:</span>
              {(project.skillsRequired || project.tags).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md font-medium"
                >
                  #{tag}
                </span>
              ))}
              {project.industry && (
                <span className="px-2 py-1 bg-blue-50 text-blue-800 rounded-md font-medium">
                  Domain: {project.industry}
                </span>
              )}
            </div>
          </div>

          {/* Media / Screenshots / Live Demo links */}
          {(project.screenshots?.length || project.liveDemoUrl || project.demoVideoUrl) && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Media & Staging Demos
              </h2>

              {project.screenshots && project.screenshots.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.screenshots.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video group"
                    >
                      <img
                        src={imgUrl}
                        alt={`${project.title} screenshot ${i + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {project.liveDemoUrl && (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Live Interactive Demo</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                )}
                {project.demoVideoUrl && (
                  <a
                    href={project.demoVideoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Walkthrough Video</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Long Description */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Technical Overview & Architecture
            </h2>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              {project.description}
            </div>
          </div>

          {/* Attached Files & Student-Labeled Deliverables */}
          {project.attachedFiles && project.attachedFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-blue-600" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Attached Deliverables & Project Files ({project.attachedFiles.length})
                  </h2>
                </div>
                <span className="text-[11px] text-slate-500">Each deliverable is labeled to a student contributor</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.attachedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl transition-all flex flex-col justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block truncate" title={file.name}>
                            {file.name}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {file.type || 'Deliverable'} · {file.size || 'Document'}
                          </span>
                        </div>
                      </div>

                      {file.description && (
                        <p className="text-[11px] text-slate-600 leading-relaxed bg-white/80 p-2 rounded-lg border border-slate-200/60">
                          {file.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md min-w-0">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">Contributed by: {file.labeledStudentName || 'Team Member'}</span>
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          const opened = await openAttachedFile(file);
                          if (!opened) showToast(`"${file.name}" has no stored copy to open.`, 'warning');
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        <Download className="w-3 h-3" />
                        <span>{file.source === 'canvas' ? 'Open in Canvas' : 'View File'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deliverables & Collaboration Model (For Work Projects) */}
          {(project.deliverables?.length || project.compensationInfo) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs">
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Target Deliverables & Goals</h3>
                <ul className="space-y-1.5 text-slate-700">
                  {(project.deliverables || project.useCases).map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold shrink-0">›</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">Collaboration Details</h3>
                <div className="space-y-1 text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-800">Mode:</span>{' '}
                    {project.collaborationType || 'Remote'} · {project.estimatedDuration || '1-3 months'}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Experience Level:</span>{' '}
                    {project.experienceLevel || 'Mixed'}
                  </div>
                  <div className="pt-1.5 text-slate-500">
                    <span className="font-semibold text-slate-700">Project Model:</span>{' '}
                    {project.compensationInfo || 'Collaborative Open Source'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Open Roles */}
          {project.openRoles && project.openRoles.length > 0 && (
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-950">
                    Open Roles for Collaborators
                  </h3>
                </div>
                {!isTeamMember && (
                  <button
                    onClick={() => {
                      onClose();
                      openApplyModal(project);
                    }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold"
                  >
                    Apply for a Role
                  </button>
                )}
              </div>
              <p className="text-xs text-blue-900">
                The project owner is actively evaluating candidates for the following positions:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {project.openRoles.map((role, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-white border border-blue-200 text-blue-800 rounded-lg text-xs font-semibold shadow-2xs"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Linked GitHub Repo Card (if public code) */}
          {project.githubRepo && project.codeAvailability === 'public' && (
            <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-slate-300" />
                    <span className="text-xs font-mono text-slate-400">Linked Repository</span>
                  </div>
                  <h4 className="text-base font-bold font-mono text-blue-400 hover:underline">
                    {project.githubRepo.full_name}
                  </h4>
                  <p className="text-xs text-slate-300 max-w-xl">
                    {project.githubRepo.description}
                  </p>
                </div>

                <a
                  href={project.githubRepo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <span>View on GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 font-mono">
                {project.githubRepo.language && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span>{project.githubRepo.language}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="tabular-nums font-semibold">{project.githubRepo.stargazers_count} stars</span>
                </div>
                {project.githubRepo.updated_at && (
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Updated {new Date(project.githubRepo.updated_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <ProjectPeerAssessments project={project} />

          {/* Author Profile Preview & Team */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Author */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3.5">
              <img
                src={project.author.avatar}
                alt={project.author.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {project.author.name}
                  </h4>
                  {project.author.githubConnected && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded">
                      <Github className="w-2.5 h-2.5" />
                      @{project.author.githubUsername}
                    </span>
                  )}
                </div>
                <div className="text-xs text-blue-700 font-semibold truncate">
                  {project.author.jobTitle || project.author.major || project.author.identities.join(', ')}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {project.author.organization || project.author.school}
                  {project.author.yearsOfExperience && ` · ${project.author.yearsOfExperience}y exp`}
                </div>
                <p className="text-xs text-slate-600 pt-1 line-clamp-2">
                  {project.author.bio}
                </p>
                <button
                  type="button"
                  onClick={() => openPortfolio(project.author)}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>View Author's Verified Past Work</span>
                </button>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Project Team Roster & Roles</span>
                <span className="text-slate-500 tabular-nums">
                  {project.teamMembers.length} {project.teamMembers.length === 1 ? 'member' : 'members'}
                </span>
              </div>
              <div className="space-y-3">
                {project.teamMembers.map((member) => (
                  <div key={member.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-800 block truncate">{member.name}</span>
                          <span className="text-slate-500 text-[11px] block truncate">{member.role}</span>
                        </div>
                      </div>
                      {member.identity && (
                        <span className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-medium shrink-0 shadow-2xs">
                          {member.identity}
                        </span>
                      )}
                    </div>

                    {member.contributionDescription && (
                      <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-0.5">
                          What this student worked on:
                        </span>
                        <p className="text-[11px] leading-relaxed text-slate-600">
                          {member.contributionDescription}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Bar (Sticky at bottom) */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Interest button */}
          <button
            onClick={() => toggleInterest(project.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              project.userInterested
                ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-2xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                project.userInterested ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
              }`}
            />
            <span>{project.userInterested ? 'Saved' : 'Save / Interest'}</span>
            <span className="tabular-nums font-bold ml-0.5">({project.interestCount})</span>
          </button>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* If user is already on the team or owner: Open Workspace */}
            {(isTeamMember || isOwnProject) && (
              <button
                onClick={() => {
                  onClose();
                  openWorkspace(project);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs cursor-pointer"
              >
                <span>Open Project Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {!isOwnProject && !isTeamMember && (
              <>
                <button
                  onClick={() => openMessageModal(project.author, project)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                  <span>Message</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    openApplyModal(project);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Apply to Collaborate</span>
                </button>

                {project.codeAvailability === 'on_request' && !isGranted && !existingCodeRequest && (
                  <button
                    onClick={() => setRequestCodeModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Request code</span>
                  </button>
                )}
              </>
            )}

            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Request Code Access Dialog */}
      {requestCodeModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-600" />
                Request Source Code Access
              </h3>
              <button
                onClick={() => setRequestCodeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Send a request to <span className="font-semibold text-slate-900">{project.author.name}</span> for access to the repository of <span className="font-semibold text-slate-900">{project.title}</span>.
            </p>

            <form onSubmit={handleRequestCodeSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for access request *
                </label>
                <textarea
                  rows={3}
                  value={requestCodeNote}
                  onChange={(e) => setRequestCodeNote(e.target.value)}
                  placeholder="e.g., I am researching multi-agent architectures and would love to review your state rollback engine..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRequestCodeModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg cursor-pointer"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
