import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle,
  FileText,
  Code2,
  HelpCircle,
  ShieldCheck,
  Eye,
  ExternalLink,
  Sparkles,
  Info,
  Scale,
  Send,
  User,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SimilarityReport } from '../types';
import { MANDATORY_LIMITATIONS_NOTICE } from '../services/similarityChecker';

export const SimilarityReportModal: React.FC = () => {
  const {
    inspectingSimilarityReport,
    closeSimilarityReport,
    updateSimilarityReview,
    runSimilarityCheck,
    studentSubmissions,
  } = useApp();

  const report = inspectingSimilarityReport;
  const submission = studentSubmissions.find((s) => s.id === report?.submissionId);

  const [reviewStatus, setReviewStatus] = useState<SimilarityReport['teacherReviewStatus']>(
    report?.teacherReviewStatus || 'Not reviewed'
  );
  const [teacherNotes, setTeacherNotes] = useState<string>(report?.teacherNotes || '');
  const [requestExplanation, setRequestExplanation] = useState<boolean>(
    report?.studentExplanationRequested || false
  );
  const [activeTab, setActiveTab] = useState<'passages' | 'sources' | 'submissionText' | 'aiExplanation'>(
    'passages'
  );
  const [filterBoilerplate, setFilterBoilerplate] = useState<boolean>(true);
  const [isRechecking, setIsRechecking] = useState(false);

  // Sync internal state when report changes
  React.useEffect(() => {
    if (report) {
      setReviewStatus(report.teacherReviewStatus);
      setTeacherNotes(report.teacherNotes || '');
      setRequestExplanation(report.studentExplanationRequested || false);
    }
  }, [report]);

  if (!report) return null;

  const handleSaveDecision = () => {
    updateSimilarityReview(report.id, reviewStatus, teacherNotes, requestExplanation);
  };

  const handleToggleMode = async (mode: 'text' | 'code') => {
    if (isRechecking) return;
    setIsRechecking(true);
    try {
      await runSimilarityCheck(report.submissionId, mode);
    } finally {
      setIsRechecking(false);
    }
  };

  const displayedPassages = filterBoilerplate
    ? report.matchingPassages.filter((p) => !p.isBoilerplate)
    : report.matchingPassages;

  const boilerplateCount = report.matchingPassages.filter((p) => p.isBoilerplate).length;

  const getOverlapBadgeColor = (pct: number) => {
    if (pct < 15) return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    if (pct < 35) return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
  };

  const getReviewStatusBadge = (status: SimilarityReport['teacherReviewStatus']) => {
    switch (status) {
      case 'Reviewed — acceptable overlap':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            <CheckCircle className="w-3.5 h-3.5" />
            Reviewed — Acceptable
          </span>
        );
      case 'Needs clarification':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
            <HelpCircle className="w-3.5 h-3.5" />
            Needs Student Clarification
          </span>
        );
      case 'Further investigation needed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
            <AlertTriangle className="w-3.5 h-3.5" />
            Investigation Needed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <Eye className="w-3.5 h-3.5" />
            Not Reviewed
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <Scale className="w-3.5 h-3.5" />
                AI-Assisted Similarity Checker
              </span>
              {getReviewStatusBadge(report.teacherReviewStatus)}
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Similarity Analysis: {report.studentName}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Assignment: <span className="font-medium text-slate-800 dark:text-slate-200">{report.assignmentTitle}</span> • Checked on{' '}
              {new Date(report.calculatedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>

          <button
            onClick={closeSimilarityReport}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mandatory Ethical Notice Banner */}
        <div className="px-6 py-3 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            <span className="font-semibold uppercase tracking-wider block mb-0.5 text-amber-800 dark:text-amber-300">
              Mandatory Academic Notice:
            </span>
            {MANDATORY_LIMITATIONS_NOTICE}
            <span className="block mt-1 text-slate-600 dark:text-slate-400 italic">
              Note: The score below represents deterministic verbatim and n-gram text overlap with registered materials. It is never labeled as a plagiarism score or cheating probability.
            </span>
          </div>
        </div>

        {/* Main Body Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Top Metric Bar & Mode Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Overlap Score Card */}
            <div className={`p-4 rounded-xl border ${getOverlapBadgeColor(report.overallOverlapPercent)} flex items-center justify-between`}>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider block">
                  Text Overlap Percentage
                </span>
                <div className="text-3xl font-extrabold mt-1">
                  {report.overallOverlapPercent}%
                </div>
                <span className="text-xs opacity-80 block mt-0.5">
                  Across all comparison corpus
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium block">
                  {report.matchingPassages.length} passages detected
                </span>
                {boilerplateCount > 0 && (
                  <span className="text-xs opacity-75 block">
                    ({boilerplateCount} prompt boilerplate)
                  </span>
                )}
              </div>
            </div>

            {/* Comparison Mode Selector */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Analysis Mode
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono">
                  {report.detectionMode === 'code' ? 'Code AST/Normalize' : '5-Word Shingles'}
                </span>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleToggleMode('text')}
                  disabled={isRechecking || report.detectionMode === 'text'}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                    report.detectionMode === 'text'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Text Overlap
                </button>

                <button
                  onClick={() => handleToggleMode('code')}
                  disabled={isRechecking || report.detectionMode === 'code'}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                    report.detectionMode === 'code'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  Code Structure
                </button>
              </div>

              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {report.detectionMode === 'code'
                  ? 'Normalized tokens with comments & whitespace stripped.'
                  : 'Word shingle overlap matching consecutive phrases.'}
              </span>
            </div>

            {/* Submission Metadata */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Submission Details
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-medium">
                  {submission?.revisionStatus || 'Original'}
                </span>
              </div>
              <div className="text-slate-700 dark:text-slate-300">
                <span className="text-slate-500 dark:text-slate-400">Student: </span>
                <span className="font-medium">{report.studentName}</span>
              </div>
              {submission?.githubUrl && (
                <div className="truncate">
                  <span className="text-slate-500 dark:text-slate-400">GitHub: </span>
                  <a
                    href={submission.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                  >
                    {submission.githubUrl.replace('https://github.com/', '')}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              {submission?.googleDocsUrl && (
                <div className="truncate">
                  <span className="text-slate-500 dark:text-slate-400">Docs: </span>
                  <a
                    href={submission.googleDocsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                  >
                    Google Docs Deliverable
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('passages')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'passages'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                Matching Passages ({displayedPassages.length})
              </button>
              <button
                onClick={() => setActiveTab('sources')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'sources'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                Sources Breakdown ({report.sourceBreakdown.length})
              </button>
              <button
                onClick={() => setActiveTab('aiExplanation')}
                className={`pb-3 text-sm font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
                  activeTab === 'aiExplanation'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                AI Contextual Explanation
              </button>
              <button
                onClick={() => setActiveTab('submissionText')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'submissionText'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                Full Submitted Text
              </button>
            </div>

            {activeTab === 'passages' && boilerplateCount > 0 && (
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={filterBoilerplate}
                  onChange={(e) => setFilterBoilerplate(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Hide assignment prompt / boilerplate ({boilerplateCount})</span>
              </label>
            )}
          </div>

          {/* Tab Content: Matching Passages */}
          {activeTab === 'passages' && (
            <div className="space-y-4">
              {displayedPassages.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    No suspicious matching passages found!
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {boilerplateCount > 0
                      ? `${boilerplateCount} passage(s) matched assignment instructions/prompts and were filtered out.`
                      : 'The submitted text demonstrates unique vocabulary and structure against the database.'}
                  </p>
                </div>
              ) : (
                displayedPassages.map((passage, idx) => (
                  <div
                    key={passage.id || idx}
                    className={`p-4 rounded-xl border transition-all ${
                      passage.isBoilerplate
                        ? 'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40'
                        : passage.sourceType === 'Peer Submission'
                        ? 'border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/20'
                        : 'border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          #{idx + 1}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-medium ${
                            passage.sourceType === 'Peer Submission'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                              : passage.sourceType === 'Course Material'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          }`}
                        >
                          Source: {passage.sourceType}
                        </span>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {passage.sourceDocumentTitle}
                        </span>
                      </div>

                      {passage.isBoilerplate ? (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                          Boilerplate Prompt (Legitimate)
                        </span>
                      ) : (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-semibold">
                          Potential Overlap
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      {/* Student Submitted Excerpt */}
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                          Student's Text:
                        </span>
                        <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono whitespace-pre-wrap bg-amber-50/50 dark:bg-amber-950/20 p-2 rounded">
                          {passage.matchedText}
                        </p>
                      </div>

                      {/* Matched Source Excerpt */}
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                          Source Excerpt ({passage.sourceDocumentTitle}):
                        </span>
                        <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/60 p-2 rounded">
                          {passage.sourceExcerpt || passage.matchedText}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab Content: Sources Breakdown */}
          {activeTab === 'sources' && (
            <div className="space-y-3">
              {report.sourceBreakdown.length === 0 ? (
                <p className="text-xs text-slate-500 p-4">No sources recorded with significant overlap.</p>
              ) : (
                report.sourceBreakdown.map((src, i) => (
                  <div
                    key={src.sourceId || i}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-medium ${
                            src.sourceType === 'Peer Submission'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                              : src.sourceType === 'Course Material'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          }`}
                        >
                          {src.sourceType}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {src.sourceTitle}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Contains {src.passageCount} overlapping passage(s)
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                        {src.overlapPercent}%
                      </span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                        source overlap
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab Content: AI Contextual Explanation */}
          {activeTab === 'aiExplanation' && (
            <div className="p-5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Deterministic Overlap Analysis & Context Summary
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans bg-white dark:bg-slate-900 p-4 rounded-lg border border-indigo-100 dark:border-indigo-900/40">
                {report.aiExplanation || 'No AI explanation generated.'}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                * Note: AI-assisted explanations synthesize findings strictly from detected text matches. The instructor retains sole authority over grading and academic integrity determinations.
              </p>
            </div>
          )}

          {/* Tab Content: Full Submitted Text */}
          {activeTab === 'submissionText' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Student Written Submission
                  </span>
                  <span className="text-xs text-slate-500">
                    {submission?.textContent.length || 0} characters
                  </span>
                </div>
                <div className="text-xs text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 max-h-80 overflow-y-auto">
                  {submission?.textContent || 'No written text provided.'}
                </div>
              </div>

              {submission?.codeSnippet && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Attached Code Snippet ({submission.codeLanguage || 'TypeScript'})
                    </span>
                  </div>
                  <pre className="text-xs text-slate-800 dark:text-slate-200 font-mono whitespace-pre bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 max-h-80 overflow-x-auto overflow-y-auto">
                    {submission.codeSnippet}
                  </pre>
                </div>
              )}

              {submission?.individualContributionDesc && (
                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200 dark:border-indigo-900/40">
                  <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 block mb-1">
                    Student's Stated Individual Contribution:
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    {submission.individualContributionDesc}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Teacher Review & Decision Panel */}
          <div className="p-5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Teacher Review & Determination
                </h3>
              </div>
              {report.teacherReviewDate && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Last evaluated: {report.teacherReviewDate}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setReviewStatus('Not reviewed')}
                className={`p-3 rounded-lg border text-left text-xs font-medium transition-colors ${
                  reviewStatus === 'Not reviewed'
                    ? 'border-slate-600 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white ring-2 ring-slate-400'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="font-semibold mb-0.5">Not reviewed</div>
                <div className="text-[11px] opacity-75">Pending evaluation</div>
              </button>

              <button
                type="button"
                onClick={() => setReviewStatus('Reviewed — acceptable overlap')}
                className={`p-3 rounded-lg border text-left text-xs font-medium transition-colors ${
                  reviewStatus === 'Reviewed — acceptable overlap'
                    ? 'border-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50/50'
                }`}
              >
                <div className="font-semibold mb-0.5 text-emerald-700 dark:text-emerald-300">
                  Acceptable Overlap
                </div>
                <div className="text-[11px] opacity-75">Legitimate quotes or prompts</div>
              </button>

              <button
                type="button"
                onClick={() => setReviewStatus('Needs clarification')}
                className={`p-3 rounded-lg border text-left text-xs font-medium transition-colors ${
                  reviewStatus === 'Needs clarification'
                    ? 'border-amber-600 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-100 ring-2 ring-amber-500'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50/50'
                }`}
              >
                <div className="font-semibold mb-0.5 text-amber-700 dark:text-amber-300">
                  Needs Clarification
                </div>
                <div className="text-[11px] opacity-75">Request student response</div>
              </button>

              <button
                type="button"
                onClick={() => setReviewStatus('Further investigation needed')}
                className={`p-3 rounded-lg border text-left text-xs font-medium transition-colors ${
                  reviewStatus === 'Further investigation needed'
                    ? 'border-rose-600 bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50/50'
                }`}
              >
                <div className="font-semibold mb-0.5 text-rose-700 dark:text-rose-300">
                  Investigation Needed
                </div>
                <div className="text-[11px] opacity-75">Substantial unexplained overlap</div>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Instructor Notes & Context
              </label>
              <textarea
                value={teacherNotes}
                onChange={(e) => setTeacherNotes(e.target.value)}
                rows={2}
                placeholder="Enter confidential notes, rationale for decision, or references to assignment collaboration rules..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requestExplanation}
                  onChange={(e) => setRequestExplanation(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Notify student to submit written explanation of detected overlap</span>
              </label>

              <button
                type="button"
                onClick={handleSaveDecision}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Save Review Decision
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Instructor of Record: Prof. Robert Hayes • Ohio State CSE
          </span>
          <button
            onClick={closeSimilarityReport}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
};
