import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  GitBranch,
  Star,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BarChart3,
  ExternalLink,
  MessageSquare,
  Users,
  Download,
} from 'lucide-react';
import { analyzeProjectContributions, ASSESSMENT_METHODOLOGY_NOTICE } from '../services/contributionAnalysisService';
import { MemberContributionAnalysis, Author } from '../types';

export const ContributionAnalysisModal: React.FC = () => {
  const {
    analyzingProject,
    closeContributionAnalysisModal,
    workEvidences,
    teammateRatings,
    openDocumentTimeline,
    openRateTeammateModal,
    allDemoAccounts,
    showToast,
  } = useApp();

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [showMethodology, setShowMethodology] = useState<boolean>(false);

  if (!analyzingProject) return null;

  const report = analyzeProjectContributions(analyzingProject, workEvidences, teammateRatings);
  const activeMember = report.members.find((m) => m.memberId === selectedMemberId) || report.members[0];

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${analyzingProject.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-contribution-report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Contribution analysis report exported successfully', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden border border-slate-200 flex flex-col my-4">
        {/* Header Bar */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                  Team Contribution Audit
                </span>
                <span className="text-xs text-slate-400">· {report.members.length} Contributors</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                {analyzingProject.title}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              title="Export report as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              onClick={closeContributionAnalysisModal}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Transparent Notice Banner */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-blue-900 mr-1.5">Objective Activity Share Metric:</span>
                <span className="text-slate-600">
                  Calculated from completed tasks, verified document revisions, commits, and instructor confirmations.
                  Represents <strong>recorded activity in the system</strong>, NOT an estimate of total human effort.
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowMethodology(!showMethodology)}
              className="text-blue-700 font-bold hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How was this assessed?</span>
              {showMethodology ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Expandable Methodology Explanation */}
          {showMethodology && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-2 animate-in fade-in duration-150">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Transparent Assessment Methodology & Formula
              </h4>
              <p className="leading-relaxed text-slate-600">
                {ASSESSMENT_METHODOLOGY_NOTICE}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <div className="font-bold text-slate-900">Completed Task</div>
                  <div className="text-blue-600 font-black">+20 pts</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <div className="font-bold text-slate-900">Deliverable Doc</div>
                  <div className="text-blue-600 font-black">+30 pts</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <div className="font-bold text-slate-900">Reviewer Verified</div>
                  <div className="text-emerald-600 font-black">+25 pts</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <div className="font-bold text-slate-900">Git Commits/PR</div>
                  <div className="text-purple-600 font-black">+25 pts</div>
                </div>
              </div>
            </div>
          )}

          {/* High-level Project Summary & Progress Bar Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left 2 Cols: Team Documented Share Overview */}
            <div className="lg:col-span-2 bg-slate-50/50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Estimated Documented Activity Share
                  </h3>
                  <p className="text-xs text-slate-500">
                    Proportion of recorded system activity across all 4 contributors
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {report.completedTasks} of {report.totalTasks} Tasks Done
                </span>
              </div>

              {/* Stacked multi-color progress bar */}
              <div className="h-4 w-full rounded-full bg-slate-200 overflow-hidden flex shadow-inner">
                {report.members.map((m, idx) => {
                  const colors = [
                    'bg-blue-600',
                    'bg-indigo-600',
                    'bg-emerald-600',
                    'bg-amber-500',
                  ];
                  const color = colors[idx % colors.length];
                  return (
                    <div
                      key={m.memberId}
                      style={{ width: `${m.documentedContributionShare || 25}%` }}
                      className={`${color} h-full transition-all relative group cursor-pointer`}
                      title={`${m.memberName}: ${m.documentedContributionShare}%`}
                      onClick={() => setSelectedMemberId(m.memberId)}
                    />
                  );
                })}
              </div>

              {/* Members Quick Pill Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {report.members.map((m, idx) => {
                  const dotColors = [
                    'bg-blue-600',
                    'bg-indigo-600',
                    'bg-emerald-600',
                    'bg-amber-500',
                  ];
                  const dotColor = dotColors[idx % dotColors.length];
                  const isSelected = (activeMember.memberId === m.memberId);
                  return (
                    <button
                      key={m.memberId}
                      onClick={() => setSelectedMemberId(m.memberId)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                          : 'bg-white/70 border-slate-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                        <span className="font-bold text-xs text-slate-800 truncate">
                          {m.memberName.split(' ')[0]}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-black text-slate-900 tabular-nums">
                          {m.documentedContributionShare}%
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            m.evidenceCoverage === 'High'
                              ? 'bg-emerald-50 text-emerald-700'
                              : m.evidenceCoverage === 'Moderate'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {m.evidenceCoverage}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right 1 Col: AI Summary Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Contribution Summary</span>
                </div>
                <h4 className="font-bold text-sm text-white mb-2">Grounded Synthesis</h4>
                <p className="text-xs text-indigo-100/90 leading-relaxed">
                  {report.overallProjectSummary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-indigo-800/60 text-[11px] text-indigo-200 flex items-center justify-between">
                <span>Verified Evidence: {report.confirmedDeliverables} items</span>
                <span className="font-bold text-emerald-400">Strictly Grounded</span>
              </div>
            </div>
          </div>

          {/* Member Deep-Dive Card */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Member Card Header */}
            <div className="p-5 sm:p-6 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={activeMember.memberAvatar}
                  alt={activeMember.memberName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">
                      {activeMember.memberName}
                    </h3>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                        activeMember.evidenceCoverage === 'High'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : activeMember.evidenceCoverage === 'Moderate'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {activeMember.evidenceCoverage} Evidence
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{activeMember.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Teammate Rating Badge */}
                {activeMember.peerAverageScore ? (
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    <span className="font-black text-xs text-slate-900">
                      {activeMember.peerAverageScore} / 5.0
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ({activeMember.peerFeedbackCount} reviews)
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                    New contributor
                  </span>
                )}

                {/* Rate Teammate button */}
                <button
                  onClick={() => {
                    const targetUser: Author = allDemoAccounts.find((a) => a.id === activeMember.memberId) || {
                      id: activeMember.memberId,
                      name: activeMember.memberName,
                      avatar: activeMember.memberAvatar,
                      bio: activeMember.summaryText,
                      identities: ['Student'],
                      school: 'The Ohio State University',
                      skills: activeMember.demonstratedSkills,
                      githubConnected: false,
                    };
                    openRateTeammateModal(targetUser, analyzingProject);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Rate Teammate</span>
                </button>
              </div>
            </div>

            {/* Member Card Content */}
            <div className="p-5 sm:p-6 space-y-5">
              {/* Grounded Member Summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-1">
                  Documented Role & Work Summary:
                </span>
                {activeMember.summaryText}
              </div>

              {/* Investigation Prompt if Devon Miller / Limited Evidence */}
              {activeMember.questionsForInvestigation && activeMember.questionsForInvestigation.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 text-xs text-amber-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Incomplete Evidence Flag — Suggested Questions for Investigation</span>
                  </div>
                  <p className="text-amber-800 leading-relaxed">
                    System activity logs show limited code commits or document revisions for this contributor. Before drawing conclusions, teachers or project leads should investigate:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-amber-900 font-medium">
                    {activeMember.questionsForInvestigation.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tasks & Deliverables Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Completed Tasks */}
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">
                      Completed Tasks ({activeMember.tasksCompletedCount} of {activeMember.tasksAssignedCount})
                    </span>
                  </div>
                  {activeMember.completedTaskTitles.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {activeMember.completedTaskTitles.map((title, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{title}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No completed tasks recorded in workspace.</p>
                  )}
                </div>

                {/* Deliverables & Evidence */}
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">
                      Document & Code Evidence ({activeMember.deliverablesSubmitted.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {activeMember.documentEvidence.length > 0 ? (
                      activeMember.documentEvidence.map((ev) => (
                        <div
                          key={ev.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="font-semibold text-slate-800 truncate">{ev.title}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {ev.status === 'Reviewer-confirmed' && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                Verified
                              </span>
                            )}
                            <button
                              onClick={() => openDocumentTimeline(ev)}
                              className="text-blue-600 hover:text-blue-800 p-1 cursor-pointer"
                              title="Inspect collaborative revision timeline"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No verified document artifacts linked.</p>
                    )}

                    {activeMember.githubEvidence && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <GitBranch className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span className="font-semibold text-slate-800 truncate">
                            {activeMember.githubEvidence.commitsCount} Commits · {activeMember.githubEvidence.pullRequestsCount} Merged PRs
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                          GitHub Linked
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Demonstrated Skills Chips */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Demonstrated Technical & Professional Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeMember.demonstratedSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Academic Integrity Guaranteed · No private code leaked</span>
          </div>
          <button
            onClick={closeContributionAnalysisModal}
            className="px-5 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
