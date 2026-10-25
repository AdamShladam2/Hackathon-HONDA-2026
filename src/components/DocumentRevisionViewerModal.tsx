import React from 'react';
import {
  X,
  FileText,
  Clock,
  ExternalLink,
  ShieldCheck,
  User,
  GitCommit,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Presentation,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WorkEvidence, DocumentTimelineEvent } from '../types';

export const DocumentRevisionViewerModal: React.FC = () => {
  const { viewingDocumentEvidence, closeDocumentTimeline, currentUser, reviewContribution } = useApp();

  if (!viewingDocumentEvidence) return null;

  const ev: WorkEvidence = viewingDocumentEvidence;
  const isTeacher = currentUser.identities.includes('Teacher / Professor');

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'Google Docs':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'Google Slides':
        return <Presentation className="w-5 h-5 text-amber-500" />;
      case 'Google Sheets':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
      case 'GitHub PR/Commit':
        return <GitCommit className="w-5 h-5 text-purple-500" />;
      default:
        return <Layers className="w-5 h-5 text-gray-500" />;
    }
  };

  const timeline: DocumentTimelineEvent[] = ev.documentTimeline || [
    {
      timestamp: ev.date || '2026-10-24T12:00:00Z',
      authorName: ev.contributors?.[0]?.name || 'Student Contributor',
      authorId: ev.contributors?.[0]?.id || 'unknown',
      action: `Created and submitted ${ev.title}`,
      section: ev.claimedSections?.[0] || 'Main Body',
      note: 'Deliverable registered in SkillSink portfolio.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-900/50">
              {getDocIcon(ev.evidenceType)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                  {ev.evidenceType}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    ev.status === 'Reviewer-confirmed'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : ev.status === 'Needs clarification'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                  }`}
                >
                  {ev.status}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Visibility: {ev.visibility}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                {ev.title}
              </h2>
              {ev.associatedProjectTitle && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Project: <span className="font-medium text-slate-800 dark:text-slate-200">{ev.associatedProjectTitle}</span>
                </p>
              )}
            </div>
          </div>
          <button
            onClick={closeDocumentTimeline}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Simulated Disclaimer Banner (Crucial Requirement) */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-300">
                Collaborative Document Revision History (Hackathon Demo Simulation)
              </p>
              <p className="mt-1 leading-relaxed opacity-90">
                To demonstrate individual authorship verification without requiring attendees to connect production OAuth tokens, this timeline reflects simulated collaborative document revisions. In production, revision diffs, timestamped blocks, and author identity are verified through authorized Google Workspace OAuth connections.
              </p>
            </div>
          </div>

          {/* Deliverable Details & Claimed Contributions */}
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Claimed Individual Sections & Contribution Scope
              </span>
              <p className="mt-1 text-slate-800 dark:text-slate-200 leading-relaxed">
                {ev.description}
              </p>
            </div>

            {ev.claimedSections && ev.claimedSections.length > 0 && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Explicitly Authored Sections:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {ev.claimedSections.map((sec, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    >
                      {sec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Document Link */}
            {ev.url && (
              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400">Attached Deliverable Link:</span>
                <a
                  href={ev.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Open in Google Drive / Workspace <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Co-Authors & Contributors */}
          {ev.contributors && ev.contributors.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Team Document Collaborators ({ev.contributors.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {ev.contributors.map((contrib) => (
                  <div
                    key={contrib.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <img
                      src={contrib.avatar}
                      alt={contrib.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      {contrib.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chronological Revision History Timeline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Collaborative Revision Timeline ({timeline.length} events logged)
              </h4>
              <span className="text-[11px] text-slate-400">Most recent first</span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
              {timeline.map((event, index) => (
                <div key={index} className="relative group">
                  {/* Timeline bullet */}
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-blue-500 border-4 border-white dark:border-slate-900 group-hover:scale-110 transition-transform flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white">
                          {event.authorName}
                        </span>
                        {event.section && (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                            {event.section}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      {event.action}
                    </p>

                    {event.note && (
                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 italic">
                        "{event.note}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructor Review Section if already reviewed */}
          {ev.reviewedBy && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Reviewed & Verified by {ev.reviewedBy.name}
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                Role: {ev.reviewedBy.role} • Date: {ev.reviewedDate}
              </p>
              {ev.reviewerFeedback && (
                <div className="mt-2 text-xs bg-white/70 dark:bg-emerald-900/30 p-2.5 rounded-lg text-emerald-900 dark:text-emerald-200 border border-emerald-200/50 dark:border-emerald-800/40">
                  <span className="font-semibold">Instructor Reviewer Feedback:</span> {ev.reviewerFeedback}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with Teacher Quick Action */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="text-xs text-slate-500">
            {isTeacher ? (
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                Signed in as Professor Hayes • Instructor Controls Active
              </span>
            ) : (
              <span>Evidence ID: {ev.id}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isTeacher && ev.status !== 'Reviewer-confirmed' && (
              <button
                onClick={() => {
                  reviewContribution(
                    ev.id,
                    'Reviewer-confirmed',
                    'Thorough architecture schema and clear modular REST contracts. Excellent work.'
                  );
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm Contribution as Instructor
              </button>
            )}
            <button
              onClick={closeDocumentTimeline}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
            >
              Close Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
