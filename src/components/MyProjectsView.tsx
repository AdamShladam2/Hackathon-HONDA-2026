import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderKanban,
  BarChart3,
  Star,
  ExternalLink,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Project } from '../types';
import { DocumentEffortModal } from './DocumentEffortModal';

export const MyProjectsView: React.FC = () => {
  const {
    projects,
    classProjects,
    currentUser,
    openWorkspace,
    openContributionAnalysisModal,
    openRateTeammateModal,
    setActiveView,
    openCreateWorkModal,
    getUserRatingSummaryData,
  } = useApp();

  const [docAnalysisProject, setDocAnalysisProject] = useState<Project | null>(null);

  const allProjects = [...projects, ...classProjects];

  // User's projects: either author or team member
  const myProjects = allProjects.filter((p) => {
    const isAuthor = p.author.id === currentUser.id;
    const isMember = p.teamMembers?.some((m) => m.id === currentUser.id);
    return isAuthor || isMember;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {docAnalysisProject && (
        <DocumentEffortModal project={docAnalysisProject} onClose={() => setDocAnalysisProject(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Projects & Teams
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {myProjects.length} Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track collaborative workspaces, audit verified contributions, and exchange peer ratings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('discover')}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Browse More
          </button>
          <button
            onClick={() => openCreateWorkModal()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Projects List */}
      {myProjects.length > 0 ? (
        <div className="space-y-5">
          {myProjects.map((project) => {
            const myRole =
              project.teamMembers?.find((m) => m.id === currentUser.id)?.role ||
              (project.author.id === currentUser.id ? 'Project Lead' : 'Collaborator');

            const otherMembers = (project.teamMembers || []).filter((m) => m.id !== currentUser.id);
            const completedTasks = project.tasks?.filter((t) => t.status === 'Completed').length || 0;
            const totalTasks = project.tasks?.length || 0;

            return (
              <div
                key={project.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          project.hubType === 'work'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {project.hubType === 'work' ? 'Work Hub' : 'Campus Hub'}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {project.discipline || project.school || project.author.school || project.courseName || 'Team Project'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      {project.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                      Your Role: <strong className="text-blue-600">{myRole}</strong>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  {project.summary || project.description}
                </p>

                {/* Team & Teammates Rating Section */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 block">
                      Team Members ({project.teamMembers?.length || 1}):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(project.teamMembers || [project.author]).map((member) => {
                        const isMe = member.id === currentUser.id;
                        const ratingSummary = getUserRatingSummaryData(member.id);
                        return (
                          <div
                            key={member.id}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs ${
                              isMe
                                ? 'bg-blue-50/80 border-blue-200 text-blue-900'
                                : 'bg-white border-slate-200 text-slate-800'
                            }`}
                          >
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="font-semibold">{isMe ? 'You' : member.name}</span>
                            <span className="text-[10px] text-slate-400">({member.role})</span>
                            {ratingSummary.reviewCount > 0 && (
                              <div className="flex items-center gap-0.5 text-amber-600 font-bold text-[10px] bg-slate-50 px-1 py-0.2 rounded border border-slate-200">
                                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                                <span>{ratingSummary.averageScore}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tasks Counter */}
                  {totalTasks > 0 && (
                    <div className="text-xs text-slate-600 shrink-0 bg-white border border-slate-200 px-3 py-2 rounded-lg">
                      <span className="font-semibold block text-slate-900">
                        {completedTasks} of {totalTasks} Tasks Completed
                      </span>
                      <div className="w-32 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-emerald-600 h-full rounded-full"
                          style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Card Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    {/* Rate Teammate Action */}
                    {otherMembers.length > 0 && (
                      <button
                        onClick={() => openRateTeammateModal(otherMembers[0] as any, project)}
                        className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 text-purple-600" />
                        <span>Rate Teammates</span>
                      </button>
                    )}

                    {/* Analyze Contributions Action: projects written in a shared Google Doc
                        get the time and difficulty analysis of the doc's edit history */}
                    <button
                      onClick={() =>
                        project.sharedDocument ? setDocAnalysisProject(project) : openContributionAnalysisModal(project)
                      }
                      className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Analyze Contributions</span>
                    </button>
                  </div>

                  {/* Open Workspace Action */}
                  <button
                    onClick={() => openWorkspace(project)}
                    className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <FolderKanban className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Projects Joined Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            You are not currently enrolled in any active project workspaces. Start by exploring campus initiatives or matching with open teams.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveView('discover')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Discover Projects
            </button>
            <button
              onClick={() => setActiveView('find-teammates')}
              className="px-5 py-2.5 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
            >
              Match Teammates
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
