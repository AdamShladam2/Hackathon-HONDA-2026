import React, { useState } from 'react';
import {
  Scale,
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Eye,
  FileText,
  Play,
  RotateCw,
  Info,
  Clock,
  User,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StudentSubmission } from '../types';
import { MANDATORY_LIMITATIONS_NOTICE } from '../services/similarityChecker';

export const TeacherIntegrityDashboardView: React.FC = () => {
  const {
    studentSubmissions,
    runSimilarityCheck,
    openSimilarityReport,
    teacherClasses,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedReviewStatus, setSelectedReviewStatus] = useState('All');
  const [checkingId, setCheckingId] = useState<string | null>(null);

  // Compute classroom summary metrics
  const totalSubmissions = studentSubmissions.length;
  const checkedSubmissions = studentSubmissions.filter((s) => s.similarityChecked).length;
  const awaitingReview = studentSubmissions.filter(
    (s) => !s.similarityReport || s.similarityReport.teacherReviewStatus === 'Not reviewed'
  ).length;
  const elevatedOverlapCount = studentSubmissions.filter(
    (s) => s.similarityReport && s.similarityReport.overallOverlapPercent > 40
  ).length;

  const filteredSubmissions = studentSubmissions.filter((sub) => {
    const matchesSearch =
      searchQuery === '' ||
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.classCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = selectedClass === 'All' || sub.classCode === selectedClass;
    const matchesReview =
      selectedReviewStatus === 'All' ||
      (selectedReviewStatus === 'Unchecked' && !sub.similarityChecked) ||
      (sub.similarityReport && sub.similarityReport.teacherReviewStatus === selectedReviewStatus);

    return matchesSearch && matchesClass && matchesReview;
  });

  const handleRunCheck = async (submissionId: string) => {
    setCheckingId(submissionId);
    try {
      await runSimilarityCheck(submissionId, 'text');
    } finally {
      setCheckingId(null);
    }
  };

  const getOverlapBadge = (sub: StudentSubmission) => {
    if (!sub.similarityChecked || !sub.similarityReport) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          Not Checked
        </span>
      );
    }

    const pct = sub.similarityReport.overallOverlapPercent;
    let badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    if (pct >= 35) {
      badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
    } else if (pct >= 15) {
      badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md border ${badgeStyle}`}>
        {pct}% Text Overlap
      </span>
    );
  };

  const getReviewStatusBadge = (sub: StudentSubmission) => {
    if (!sub.similarityChecked || !sub.similarityReport) {
      return (
        <span className="text-xs text-slate-400 italic">
          Awaiting Initial Check
        </span>
      );
    }

    const status = sub.similarityReport.teacherReviewStatus;
    switch (status) {
      case 'Reviewed — acceptable overlap':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle className="w-3 h-3" />
            Acceptable Overlap
          </span>
        );
      case 'Needs clarification':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <HelpCircle className="w-3 h-3" />
            Needs Clarification
          </span>
        );
      case 'Further investigation needed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertTriangle className="w-3 h-3" />
            Investigation Needed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <Eye className="w-3 h-3" />
            Not Reviewed
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title & Introduction */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" />
            AI-Assisted Similarity Engine
          </span>
          <span className="text-xs text-slate-500">
            Deterministic n-gram analysis with prompt boilerplate filtering
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Classroom Submissions & Academic Integrity Dashboard
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Review written student work, attached code, and repository links. Run deterministic word-shingle checks against peer submissions, past course archives, and reference answers with teacher-controlled review workflows.
        </p>
      </div>

      {/* Mandatory Limitations Notice */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <span className="font-semibold block text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-0.5">
            Mandatory Academic Notice:
          </span>
          {MANDATORY_LIMITATIONS_NOTICE}
        </div>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Submissions
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalSubmissions}
          </div>
          <span className="text-[11px] text-slate-400">Across all courses</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Similarity Checked
          </span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {checkedSubmissions}
          </div>
          <span className="text-[11px] text-slate-400">
            {Math.round((checkedSubmissions / (totalSubmissions || 1)) * 100)}% of submissions
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Awaiting Review
          </span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {awaitingReview}
          </div>
          <span className="text-[11px] text-slate-400">Pending instructor check</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Elevated Overlap (&gt;40%)
          </span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {elevatedOverlapCount}
          </div>
          <span className="text-[11px] text-slate-400">Requires teacher scrutiny</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, assignment, or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200"
          >
            <option value="All">All Courses</option>
            {teacherClasses.map((c) => (
              <option key={c.id} value={c.code}>
                {c.code}: {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-56">
          <select
            value={selectedReviewStatus}
            onChange={(e) => setSelectedReviewStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200"
          >
            <option value="All">All Review Statuses</option>
            <option value="Unchecked">Unchecked Only</option>
            <option value="Not reviewed">Not Reviewed</option>
            <option value="Reviewed — acceptable overlap">Acceptable Overlap</option>
            <option value="Needs clarification">Needs Clarification</option>
            <option value="Further investigation needed">Investigation Needed</option>
          </select>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No submissions match the current filters
            </p>
          </div>
        ) : (
          filteredSubmissions.map((sub) => {
            const hasReport = !!sub.similarityReport;
            const report = sub.similarityReport;

            return (
              <div
                key={sub.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Student & Assignment Info */}
                <div className="flex items-start gap-3.5 max-w-xl">
                  <img
                    src={sub.studentAvatar}
                    alt={sub.studentName}
                    className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-indigo-500/20"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {sub.studentName}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {sub.classCode}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Submitted on {new Date(sub.submissionDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {sub.assignmentTitle}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {sub.individualContributionDesc}
                    </p>

                    {/* Links to repo / docs */}
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                      {sub.githubUrl && (
                        <a
                          href={sub.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-indigo-600 flex items-center gap-1 underline"
                        >
                          Code Repo
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                      {sub.googleDocsUrl && (
                        <a
                          href={sub.googleDocsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-indigo-600 flex items-center gap-1 underline"
                        >
                          Google Docs Deliverable
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                      {sub.codeSnippet && (
                        <span className="text-slate-400 font-mono">
                          +{sub.codeLanguage || 'Code'} snippet
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Center / Right: Overlap & Review Status */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                  <div className="space-y-1 text-left sm:text-right">
                    <div className="flex items-center sm:justify-end gap-2">
                      {getOverlapBadge(sub)}
                    </div>
                    <div>{getReviewStatusBadge(sub)}</div>
                    {report?.teacherNotes && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 italic block">
                        "{report.teacherNotes.slice(0, 35)}..."
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={checkingId === sub.id}
                      onClick={() => handleRunCheck(sub.id)}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                        checkingId === sub.id
                          ? 'bg-slate-100 text-slate-400'
                          : sub.similarityChecked
                          ? 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          : 'bg-indigo-600 text-white border-transparent hover:bg-indigo-700 shadow-sm'
                      }`}
                      title={sub.similarityChecked ? 'Re-run shingle check' : 'Run initial similarity check'}
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${checkingId === sub.id ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline">
                        {sub.similarityChecked ? 'Re-check' : 'Check Similarity'}
                      </span>
                    </button>

                    {hasReport && (
                      <button
                        type="button"
                        onClick={() => openSimilarityReport(report!)}
                        className="py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect Report
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
