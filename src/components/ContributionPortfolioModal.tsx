import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  FileText,
  GitPullRequest,
  ExternalLink,
  Presentation,
  FileSpreadsheet,
  Layers,
  Award,
  Sparkles,
  Lock,
  Clock,
  MessageSquare,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Author, PastWorkRecord, WorkEvidence } from '../types';

export const ContributionPortfolioModal: React.FC = () => {
  const {
    viewingPortfolioUser,
    closePortfolio,
    pastWorkRecords,
    openDocumentTimeline,
    currentUser,
    openMessageModal,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'academic' | 'professional'>('all');

  if (!viewingPortfolioUser) return null;

  const author: Author = viewingPortfolioUser;
  const records: PastWorkRecord[] = pastWorkRecords[author.id] || [];

  const filteredRecords = records.filter((r) => {
    if (activeFilter === 'academic') return r.isAcademicProject;
    if (activeFilter === 'professional') return !r.isAcademicProject;
    return true;
  });

  const totalConfirmed = records.reduce((acc, r) => acc + (r.reviewerConfirmedCount || 0), 0);
  const totalEvidences = records.reduce((acc, r) => acc + (r.evidenceList?.length || 0), 0);

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case 'Google Docs':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'Google Slides':
        return <Presentation className="w-4 h-4 text-amber-500" />;
      case 'Google Sheets':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
      case 'GitHub PR/Commit':
        return <GitPullRequest className="w-4 h-4 text-purple-500" />;
      default:
        return <Layers className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-800 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {author.name}
                  </h2>
                  {author.school && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
                      {author.school}
                    </span>
                  )}
                  {author.organization && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300">
                      {author.organization}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {author.jobTitle || author.major || author.bio}
                </p>

                {/* Verified Badges Strip */}
                <div className="flex items-center gap-3 mt-2 flex-wrap text-xs">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{totalConfirmed} Reviewer-Confirmed Deliverables</span>
                  </div>

                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 font-medium">
                    <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>{records.length} Project Records ({totalEvidences} Evidence Items)</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={closePortfolio}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Academic Integrity Guardrail Notice */}
          <div className="mt-4 p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>
                <strong>Academic Integrity Protection:</strong> Raw course assignment code solutions and repository branches are restricted to instructors & team members. Only verified skill demonstrations and instructor-signed summaries are displayed.
              </span>
            </div>
            {author.id !== currentUser.id && (
              <button
                onClick={() => {
                  closePortfolio();
                  openMessageModal(author);
                }}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1 shadow-sm transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Message {author.name.split(' ')[0]}
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              All Work ({records.length})
            </button>
            <button
              onClick={() => setActiveFilter('academic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeFilter === 'academic'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>🎓</span>
              Academic Coursework ({records.filter((r) => r.isAcademicProject).length})
            </button>
            <button
              onClick={() => setActiveFilter('professional')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeFilter === 'professional'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>💼</span>
              Open Source & Independent ({records.filter((r) => !r.isAcademicProject).length})
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                No past work records matching this filter
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Records will appear here as coursework and projects are completed.
              </p>
            </div>
          ) : (
            filteredRecords.map((record) => (
              <div
                key={record.id}
                className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 shadow-sm space-y-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                {/* Project Record Header */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {record.isAcademicProject ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                          <span>🎓</span> Teacher-Managed Course Project • {record.courseCode}
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300 dark:border-purple-800 flex items-center gap-1">
                          <span>💼</span> Independent / Showcase
                        </span>
                      )}

                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          record.overallStatus === 'Reviewer-confirmed'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                        }`}
                      >
                        {record.overallStatus}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                      {record.projectTitle}
                    </h3>

                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                      Role: {record.role}
                    </p>
                  </div>

                  {record.reviewedByTeacher && (
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl px-3 py-1.5 flex items-center gap-2 text-right">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <div className="text-left">
                        <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                          Reviewer Confirmed
                        </div>
                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400">
                          By {record.reviewedByTeacher} ({record.reviewedDate})
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Individual Contribution Summary */}
                <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Individual Contribution Statement
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {record.individualContributionSummary}
                  </p>
                </div>

                {/* Specific Responsibilities */}
                {record.responsibilities && record.responsibilities.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                      Key Deliverables & Responsibilities
                    </span>
                    <ul className="space-y-1">
                      {record.responsibilities.map((resp, i) => (
                        <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills Demonstrated Chips */}
                {record.skillsDemonstrated && record.skillsDemonstrated.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                      Skills Demonstrated & Validated
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {record.skillsDemonstrated.map((sk, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attached Work Evidence List */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-500" />
                      Attached Work Evidence ({record.evidenceList?.length || 0})
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Click item to inspect collaborative timeline
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {record.evidenceList?.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                            {getEvidenceIcon(ev.evidenceType)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {ev.title}
                              </span>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  ev.status === 'Reviewer-confirmed'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : ev.status === 'Needs clarification'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                                }`}
                              >
                                {ev.status}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {ev.evidenceType}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                              {ev.description}
                            </p>

                            {/* Reviewer Note if available */}
                            {ev.reviewerFeedback && (
                              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 italic font-medium">
                                Instructor Stamp: "{ev.reviewerFeedback}" — {ev.reviewedBy?.name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          {(ev.evidenceType === 'Google Docs' ||
                            ev.evidenceType === 'Google Slides' ||
                            ev.documentTimeline) && (
                            <button
                              onClick={() => openDocumentTimeline(ev)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 transition-colors flex items-center gap-1.5"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              View Revision Timeline
                            </button>
                          )}

                          {ev.url && (
                            <a
                              href={ev.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                              title="Open link"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between text-xs">
          <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Verified contribution record under SkillSink Academic & Professional standards</span>
          </div>
          <button
            onClick={closePortfolio}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
