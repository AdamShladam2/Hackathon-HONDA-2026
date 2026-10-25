import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserIdentity } from '../types';
import {
  Github,
  Star,
  ExternalLink,
  GitBranch,
  CheckCircle2,
  Calendar,
  Users,
  LogOut,
  FolderKanban,
  Heart,
  Plus,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Globe,
  Clock,
  Sparkles,
  ArrowRight,
  Edit2,
  Check,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    userRepos,
    disconnectGitHub,
    openGitHubModal,
    openCreateWorkModal,
    openAccountSwitcher,
    projects,
    setSelectedProject,
    openWorkspace,
    openPortfolio,
    setActiveView,
    getUserRatingSummaryData,
    openRateTeammateModal,
    allDemoAccounts,
    canvasConnection,
    openCanvasModal,
    appMode,
  } = useApp();

  const ratingSummary = getUserRatingSummaryData(currentUser.id);

  const userProjects = projects.filter((p) => p.author.id === currentUser.id);

  // Teams user is on (as a team member, whether created or accepted invite)
  const teamsJoined = projects.filter((p) =>
    p.teamMembers.some((m) => m.id === currentUser.id)
  );

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shadow-sm"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-extrabold text-slate-900">{currentUser.name}</h1>
                {currentUser.githubConnected ? (
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    GitHub Connected (@{currentUser.githubUsername})
                  </span>
                ) : (
                  <button
                    onClick={openGitHubModal}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    + Connect GitHub
                  </button>
                )}

                {/* Canvas LMS Connection Badge (Campus mode only) */}
                {appMode !== 'campus' ? null : canvasConnection.isConnected ? (
                  <button
                    onClick={() => setActiveView('canvas-classes')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-800 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full hover:bg-red-100 transition-colors cursor-pointer"
                    title="View Canvas classes and classmates"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-red-600" />
                    <span>Canvas ({canvasConnection.courses.length} Classes)</span>
                  </button>
                ) : (
                  <button
                    onClick={openCanvasModal}
                    className="text-xs text-red-600 hover:underline font-medium flex items-center gap-1"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>+ Connect Canvas via School Email</span>
                  </button>
                )}
              </div>

              {/* Roles / Job title / School */}
              <div className="text-xs text-slate-700 font-semibold flex items-center gap-2 flex-wrap">
                {currentUser.jobTitle && (
                  <span className="text-blue-700">{currentUser.jobTitle}</span>
                )}
                {currentUser.organization && (
                  <span>at {currentUser.organization}</span>
                )}
                {currentUser.school && (
                  <span>
                    {currentUser.school} ({currentUser.major} &apos;{currentUser.graduationYear})
                  </span>
                )}
              </div>

              {/* User Identities Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentUser.identities.map((id) => (
                  <span
                    key={id}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    {id}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto flex-wrap">
            <button
              onClick={() => openPortfolio(currentUser)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>View Past Work</span>
            </button>

            {currentUser.identities.includes('Teacher / Professor') && (
              <button
                onClick={() => setActiveView('teacher-dashboard')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-2xs cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Teacher Dashboard</span>
              </button>
            )}

            <button
              onClick={openAccountSwitcher}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-slate-600" />
              <span>Switch Persona</span>
            </button>

            <button
              onClick={() => openCreateWorkModal()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100 pt-4">
          {currentUser.bio}
        </p>

        {/* Professional Details Grid (Years exp, availability, industry, skills) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
              Professional Details
            </span>
            <div className="text-slate-800 font-medium">
              Industry: <strong>{currentUser.industry || 'Software Engineering'}</strong>
            </div>
            {currentUser.yearsOfExperience !== undefined && (
              <div className="text-slate-600">
                Experience: <strong>{currentUser.yearsOfExperience} years</strong>
              </div>
            )}
            {currentUser.portfolioUrl && (
              <a
                href={currentUser.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1 pt-1"
              >
                <Globe className="w-3 h-3" />
                <span>Personal Portfolio</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
              Collaboration Preferences
            </span>
            <div className="text-slate-800">
              Availability:{' '}
              <strong>{currentUser.availability || '10 hrs/week'}</strong>
            </div>
            <div className="text-slate-600">
              Mode:{' '}
              <strong>{currentUser.collaborationPreferences || 'Remote Async'}</strong>
            </div>

          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
              Skills & Expertise
            </span>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {(currentUser.skills || []).map((s) => (
                <span
                  key={s}
                  className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-800"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Teammate Collaboration Ratings & Peer Reviews Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">
                Teammate Collaboration Ratings & Peer Reviews
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified peer feedback across completed coursework & team sprints.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {ratingSummary.reviewCount > 0 ? (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span className="text-sm font-black text-amber-900">
                  {ratingSummary.averageScore} / 5
                </span>
                <span className="text-xs text-amber-700">
                  collaboration rating — {ratingSummary.reviewCount} project reviews
                </span>
              </div>
            ) : (
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 italic">
                New contributor
              </span>
            )}

            <button
              onClick={() => {
                const other = allDemoAccounts.find((a) => a.id !== currentUser.id) || allDemoAccounts[1];
                openRateTeammateModal(other);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Star className="w-3.5 h-3.5 text-blue-600" />
              <span>Rate a Teammate</span>
            </button>
          </div>
        </div>

        {/* Reviews List */}
        {ratingSummary.ratings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ratingSummary.ratings.map((rating) => (
              <div
                key={rating.id}
                className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rating.reviewerAvatar}
                      alt={rating.reviewerName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        {rating.reviewerName}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {rating.reviewerRole}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-xs font-black text-amber-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{rating.overallScore}</span>
                  </div>
                </div>

                <div className="text-[11px] font-semibold text-blue-700 truncate">
                  Project: {rating.projectTitle}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3 rounded-lg border border-slate-200/70">
                  "{rating.writtenFeedback}"
                </p>

                {/* Criteria Mini Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] pt-1">
                  <div className="bg-white p-1 rounded border text-center text-slate-600">
                    Comm: <strong>{rating.ratings.communication}★</strong>
                  </div>
                  <div className="bg-white p-1 rounded border text-center text-slate-600">
                    Reliability: <strong>{rating.ratings.reliability}★</strong>
                  </div>
                  <div className="bg-white p-1 rounded border text-center text-slate-600">
                    Collab: <strong>{rating.ratings.collaboration}★</strong>
                  </div>
                  <div className="bg-white p-1 rounded border text-center text-slate-600">
                    Quality: <strong>{rating.ratings.qualityOfDeliverables}★</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
            <span className="text-xs font-bold text-slate-700 block">New contributor</span>
            <p className="text-xs text-slate-400 mt-1">
              Collaborate on team projects to earn peer ratings and build your verified collaboration track record.
            </p>
          </div>
        )}
      </div>

      {/* GitHub Section: Repositories List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-slate-900" />
            <h2 className="text-sm font-bold text-slate-900">
              Public GitHub Repositories
            </h2>
            {currentUser.githubConnected && (
              <span className="text-xs font-mono text-slate-400">
                ({userRepos.length} loaded)
              </span>
            )}
          </div>

          {!currentUser.githubConnected ? (
            <button
              onClick={openGitHubModal}
              className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Connect to fetch your repositories →
            </button>
          ) : (
            <button
              onClick={disconnectGitHub}
              className="text-xs text-slate-400 hover:text-rose-600 cursor-pointer"
            >
              Disconnect
            </button>
          )}
        </div>

        {currentUser.githubConnected ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userRepos.slice(0, 4).map((repo) => (
              <div
                key={repo.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold font-mono text-blue-600 hover:underline truncate inline-flex items-center gap-1"
                  >
                    <span>{repo.name}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                  <div className="flex items-center gap-1 text-xs font-mono text-amber-500 shrink-0">
                    <Star className="w-3 h-3 fill-amber-500" />
                    <span className="tabular-nums font-semibold">{repo.stargazers_count}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {repo.description || 'Public GitHub repository.'}
                </p>

                <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500 font-mono">
                  {repo.language && (
                    <span className="font-semibold text-slate-700">{repo.language}</span>
                  )}
                  {repo.updated_at && (
                    <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
            <p className="text-xs text-slate-500">
              No GitHub profile connected yet. Connect your GitHub account to showcase your top repositories.
            </p>
            <button
              onClick={openGitHubModal}
              className="px-3.5 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Connect GitHub Username
            </button>
          </div>
        )}
      </div>

      {/* Your Showcase & Work Projects */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">
            Projects Authored by You ({userProjects.length})
          </h2>
        </div>

        {userProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{proj.title}</span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {proj.hubType === 'work' ? 'Work Hub' : 'Campus Hub'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{proj.summary}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <span>Interest: {proj.interestCount}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openWorkspace(proj);
                      }}
                      className="text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      Workspace →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-400">
            You haven&apos;t created any personal projects yet. Click &quot;Create Project&quot; to begin!
          </div>
        )}
      </div>

      {/* Teams & Shared Workspaces You're On */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">
          Teams & Active Project Workspaces ({teamsJoined.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamsJoined.map((proj) => {
            const myMembership = proj.teamMembers.find((m) => m.id === currentUser.id);
            return (
              <div
                key={proj.id}
                onClick={() => openWorkspace(proj)}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{proj.title}</h3>
                  <div className="text-[11px] text-slate-500">
                    Lead: {proj.author.name} ({proj.author.organization || proj.author.school})
                  </div>
                  <div className="text-xs font-medium text-blue-700 mt-1">
                    Your Role: <span className="font-semibold">{myMembership?.role || 'Team Member'}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 flex items-center gap-1"
                >
                  <span>Open Workspace</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
