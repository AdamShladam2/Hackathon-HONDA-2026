import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { computeContributionStats } from '../utils/contributions';
import { calculateGradeFromRubric, canViewStudentGrade } from '../utils/rubric';
import { RubricCriteria } from '../types';
import {
  GraduationCap,
  History,
  BarChart3,
  Lock,
  Download,
  AlertTriangle,
  Award,
  CheckCircle2,
  FileText,
  Clock,
  ShieldCheck,
  Check,
  AlertCircle,
  Link,
  ChevronRight,
  Globe,
} from 'lucide-react';

export const ClassProjectsView: React.FC = () => {
  const {
    projects,
    currentUser,
    currentSchool,
    saveStudentGrade,
    setSelectedStudentId,
    setActiveTab,
    setIsShareProjectOpen,
    setShareSourceClassProject,
  } = useApp();

  const classProjects = useMemo(() => {
    if (!currentUser) return [];
    return projects.filter(
      (p) => p.schoolId === currentUser.schoolId && p.type === 'class'
    );
  }, [projects, currentUser]);

  const [selectedClassProjectId, setSelectedClassProjectId] = useState<string>(
    classProjects[0]?.id || 'proj-1'
  );

  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'history' | 'document'>('analytics');
  const [downloadNotice, setDownloadNotice] = useState('');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState('');

  const currentClassProject = useMemo(() => {
    return classProjects.find((p) => p.id === selectedClassProjectId) || classProjects[0];
  }, [classProjects, selectedClassProjectId]);

  const contributionSummary = useMemo(() => {
    if (!currentClassProject) return null;
    return computeContributionStats(
      currentClassProject.members,
      currentClassProject.revisions
    );
  }, [currentClassProject]);

  const isTeacher = currentUser?.role === 'teacher';

  // Rubric local edit state per student with review decision toggle chip
  const [rubricDrafts, setRubricDrafts] = useState<
    Record<
      string,
      {
        rubric: RubricCriteria;
        comments: string;
        decision: 'approved' | 'revision_needed';
        evidenceLink: string;
      }
    >
  >({});

  React.useEffect(() => {
    if (!currentClassProject) return;
    const initial: Record<
      string,
      {
        rubric: RubricCriteria;
        comments: string;
        decision: 'approved' | 'revision_needed';
        evidenceLink: string;
      }
    > = {};

    for (const member of currentClassProject.members) {
      const existingGrade = currentClassProject.grades?.[member.userId];
      initial[member.userId] = {
        rubric: existingGrade?.rubric || { contribution: 4, quality: 4, collaboration: 4 },
        comments: existingGrade?.comments || '',
        decision: 'approved',
        evidenceLink: `https://github.osu.edu/cse2221/${currentClassProject.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}/commits/${member.userId}`,
      };
    }
    setRubricDrafts(initial);
  }, [currentClassProject]);

  const handleSaveGradeForStudent = (studentId: string) => {
    if (!currentClassProject || !isTeacher) return;
    const draft = rubricDrafts[studentId];
    if (!draft) return;

    saveStudentGrade(
      currentClassProject.id,
      studentId,
      draft.rubric,
      draft.comments
    );

    setSaveSuccessNotice(`Grade and rubric decision saved for student!`);
    setTimeout(() => setSaveSuccessNotice(''), 3500);
  };

  const handleDownloadFile = () => {
    if (!isTeacher) return;
    setDownloadNotice(`Downloading class archive: ${currentClassProject?.document.fileName}...`);
    setTimeout(() => {
      const blob = new Blob(
        [
          `OFFICIAL CLASS SUBMISSION ARCHIVE\nCourse: ${currentClassProject?.courseCode} - ${currentClassProject?.courseName}\nInstitution: ${currentSchool?.name}\nInstructor: ${currentClassProject?.instructorName}\nDocument: ${currentClassProject?.document.fileName}\nWord Count: ${currentClassProject?.document.wordCount}\n\nREVISION HISTORY LOG:\n${currentClassProject?.revisions.map((r) => `[${r.timestamp}] ${r.authorName} (${r.authorRole}) +${r.wordsAdded}/-${r.wordsRemoved} words: "${r.summary}"`).join('\n')}\n\nDOCUMENT BODY:\n${currentClassProject?.document.sections.map((s) => `\n### ${s.heading}\n${s.body}\n`).join('\n')}`,
        ],
        { type: 'text/plain;charset=utf-8' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentClassProject.document.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadNotice(`Downloaded "${currentClassProject.document.fileName}" successfully.`);
      setTimeout(() => setDownloadNotice(''), 4000);
    }, 500);
  };

  if (!currentClassProject) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 text-center">
        <p className="text-sm text-slate-500">No class projects available for this school.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200/90">
        <div>
          <div className="flex items-center gap-2 text-[10px] tracking-wider uppercase font-bold text-indigo-700 mb-1.5">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Academic Coursework & Contribution Audit · {currentSchool?.name}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Class Projects & Version Histories
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
            Audit transparent document revision logs, measure individual student workload distributions, and review rubric assessments with academic integrity permissions.
          </p>
        </div>

        {/* Project Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {classProjects.map((cp) => (
            <button
              key={cp.id}
              onClick={() => setSelectedClassProjectId(cp.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                cp.id === currentClassProject.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="font-mono font-bold">{cp.courseCode}</span>
              <span className="hidden sm:inline font-normal opacity-80 ml-1.5 font-mono text-[11px]">
                ({cp.members.length} students)
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Project Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[10px] tracking-wider uppercase text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-mono">
              {currentClassProject.courseCode}
            </span>
            <span className="text-slate-600 font-semibold text-xs">
              {currentClassProject.courseName}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500 text-xs">Instructor: <strong className="text-slate-700">{currentClassProject.instructorName}</strong></span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {currentClassProject.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            {currentClassProject.description}
          </p>
        </div>

        {/* Document Action & Permission Lock */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          {isTeacher ? (
            <button
              onClick={handleDownloadFile}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Instructors possess full archive download rights"
            >
              <Download className="w-4 h-4" />
              <span>Download Project File (.docx)</span>
            </button>
          ) : (
            <div
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 text-xs flex items-center gap-2.5 cursor-help select-none"
              title="Document downloading is restricted to course instructors to preserve academic integrity. Students have view-only access."
            >
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <div className="font-bold text-slate-800 text-[11px]">Download Restricted</div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Students: View-only audit mode
                </div>
              </div>
            </div>
          )}

          {/* Share to Public Showcase button */}
          <button
            onClick={() => {
              setShareSourceClassProject(currentClassProject);
              setIsShareProjectOpen(true);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-slate-50 text-slate-700 hover:text-indigo-600 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Share this coursework to the public cross-campus Showcase"
          >
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>Share to Showcase</span>
          </button>
        </div>
      </div>


      {downloadNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {saveSuccessNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccessNotice}</span>
        </div>
      )}

      {/* Sub-Tabs: Contribution Analytics vs Version History vs Document Preview */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-2xs font-bold'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Contribution Breakdown & Grading</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'history'
              ? 'bg-indigo-600 text-white shadow-2xs font-bold'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Version History ({currentClassProject.revisions.length} Revisions)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('document')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'document'
              ? 'bg-indigo-600 text-white shadow-2xs font-bold'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Document Spec & Outline</span>
        </button>
      </div>

      {/* TAB 1: Contribution Analytics & Teacher Grading Panel */}
      {activeSubTab === 'analytics' && contributionSummary && (
        <div className="space-y-8">
          {/* Disproportionate Contribution Warning Notice */}
          {contributionSummary.highDisparityDetected && (
            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/90 text-amber-950 flex items-start gap-3 shadow-2xs">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div className="font-bold text-sm text-amber-950">
                  Disproportionate Workload Disparity Detected
                </div>
                <p className="text-amber-900 leading-relaxed">
                  Analysis of {contributionSummary.totalRevisions} revisions indicates that{' '}
                  <strong className="text-black">
                    {
                      contributionSummary.studentStats.find(
                        (s) => s.userId === contributionSummary.highestContributorId
                      )?.name
                    }
                  </strong>{' '}
                  authored{' '}
                  <span className="font-mono font-bold">
                    {
                      contributionSummary.studentStats.find(
                        (s) => s.userId === contributionSummary.highestContributorId
                      )?.percentageOfWordsAdded
                    }%
                  </span>{' '}
                  of all document words and submitted {
                    contributionSummary.studentStats.find(
                      (s) => s.userId === contributionSummary.highestContributorId
                    )?.revisionCount
                  } of {contributionSummary.totalRevisions} edit sessions.
                </p>
              </div>
            </div>
          )}

          {/* Aggregate Metrics Bar with Monospace Numerals */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="text-[10px] tracking-wider uppercase font-bold text-slate-400">
                Total Words Added
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums text-emerald-700">
                +{contributionSummary.totalWordsAdded.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                -{contributionSummary.totalWordsRemoved} removed
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="text-[10px] tracking-wider uppercase font-bold text-slate-400">
                Revision Count
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
                {contributionSummary.totalRevisions}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Verified commits</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="text-[10px] tracking-wider uppercase font-bold text-slate-400">
                Active Edit Sessions
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
                {contributionSummary.totalSessions}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                ~{contributionSummary.totalSessionHours} hrs collaborative work
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="text-[10px] tracking-wider uppercase font-bold text-slate-400">
                Active Teammates
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
                {currentClassProject.members.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                {isTeacher ? 'Grading sheet ready' : 'Confidential view'}
              </div>
            </div>
          </div>

          {/* Visual Contribution Breakdown Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Contribution Share by Student (% of Words Written)
            </h3>

            {/* Stacked Percentage Bar with Indigo/Emerald/Amber Colors */}
            <div className="w-full h-8 rounded-xl overflow-hidden flex bg-slate-100 border border-slate-200">
              {contributionSummary.studentStats.map((stat, i) => {
                const colors = ['bg-indigo-600', 'bg-slate-700', 'bg-amber-600', 'bg-emerald-600'];
                return (
                  <div
                    key={stat.userId}
                    style={{ width: `${stat.percentageOfWordsAdded}%` }}
                    className={`${colors[i % colors.length]} h-full transition-all flex items-center justify-center text-white text-[11px] font-bold font-mono`}
                    title={`${stat.name}: ${stat.percentageOfWordsAdded}% (${stat.wordsAdded} words)`}
                  >
                    {stat.percentageOfWordsAdded >= 10 && `${stat.percentageOfWordsAdded}%`}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
              {contributionSummary.studentStats.map((stat, i) => {
                const colors = ['bg-indigo-600', 'bg-slate-700', 'bg-amber-600', 'bg-emerald-600'];
                return (
                  <div key={stat.userId} className="flex items-center gap-1.5">
                    <span className={`w-3 h-3 rounded-full ${colors[i % colors.length]}`} />
                    <span className="font-bold text-slate-800">{stat.name}:</span>
                    <span className="text-slate-500 font-mono tabular-nums">
                      {stat.percentageOfWordsAdded}% ({stat.wordsAdded.toLocaleString()} words · {stat.revisionCount} revisions)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contributor Cards with Teacher Review Sheet */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Individual Contributor Records & {isTeacher ? 'Grading Rubric Sheets' : 'Evaluations'}
              </h3>
              {!isTeacher && (
                <div className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Grades confidential to student & instructor</span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {contributionSummary.studentStats.map((stat) => {
                const canSeeGrade = canViewStudentGrade(
                  currentUser?.id || '',
                  currentUser?.role || 'student',
                  stat.userId
                );

                const existingGrade = currentClassProject.grades?.[stat.userId];
                const draft = rubricDrafts[stat.userId] || {
                  rubric: existingGrade?.rubric || { contribution: 4, quality: 4, collaboration: 4 },
                  comments: existingGrade?.comments || '',
                  decision: 'approved',
                  evidenceLink: '',
                };

                const calculatedScore = calculateGradeFromRubric(draft.rubric);

                return (
                  <div
                    key={stat.userId}
                    className={`bg-white rounded-2xl border transition-all p-6 shadow-2xs ${
                      stat.hasDisproportionateShare
                        ? 'border-indigo-300 ring-1 ring-indigo-100'
                        : 'border-slate-200/90'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                      {/* Left: Student Contribution Info */}
                      <div className="space-y-3.5 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-950 font-bold text-sm flex items-center justify-center border border-amber-300">
                            {stat.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-bold text-slate-900">{stat.name}</h4>
                              {stat.hasDisproportionateShare && (
                                <span className="text-[10px] tracking-wider uppercase font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                                  Primary Author ({stat.percentageOfWordsAdded}% of docs)
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500">
                              {stat.role} · {stat.major}
                            </div>
                          </div>
                        </div>

                        {/* Breakdown Metrics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Words Added</span>
                            <span className="text-emerald-700 font-bold font-mono text-sm tabular-nums">
                              +{stat.wordsAdded.toLocaleString()}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Revisions</span>
                            <span className="text-slate-800 font-bold font-mono text-sm tabular-nums">
                              {stat.revisionCount} commits
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Active Days</span>
                            <span className="text-slate-800 font-bold font-mono text-sm tabular-nums">
                              {stat.activeDaysCount} days
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Total Work Time</span>
                            <span className="text-slate-800 font-bold font-mono text-sm tabular-nums">
                              {Math.round((stat.totalSessionMinutes / 60) * 10) / 10} hrs
                            </span>
                          </div>
                        </div>

                        <div>
                          <button
                            onClick={() => {
                              setSelectedStudentId(stat.userId);
                              setActiveTab('profile');
                            }}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
                          >
                            View {stat.name}'s Track Record & Endorsements &rarr;
                          </button>
                        </div>
                      </div>

                      {/* Right: Teacher Review Sheet or Student Confidential Grade View */}
                      <div className="w-full lg:w-96 p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shrink-0 space-y-4">
                        {isTeacher ? (
                          /* Teacher Editable Rubric Review Sheet */
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                                <span>Instructor Review Sheet</span>
                              </span>

                              <div className="text-right">
                                <span className="text-xs font-mono font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                                  {calculatedScore.letterGrade} ({calculatedScore.scorePercentage}%)
                                </span>
                              </div>
                            </div>

                            {/* Decision Toggle Chips: Approved vs Revision Needed */}
                            <div>
                              <span className="block text-[10px] tracking-wider uppercase font-bold text-slate-500 mb-1.5">
                                Review Decision Status
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setRubricDrafts((prev) => ({
                                      ...prev,
                                      [stat.userId]: { ...draft, decision: 'approved' },
                                    }))
                                  }
                                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                    draft.decision === 'approved'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50'
                                  }`}
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Approved</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setRubricDrafts((prev) => ({
                                      ...prev,
                                      [stat.userId]: { ...draft, decision: 'revision_needed' },
                                    }))
                                  }
                                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                    draft.decision === 'revision_needed'
                                      ? 'bg-amber-600 text-white shadow-xs'
                                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-amber-50'
                                  }`}
                                >
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  <span>Revision Needed</span>
                                </button>
                              </div>
                            </div>

                            {/* Monospace Evidence Link Input */}
                            <div>
                              <label className="block text-[10px] tracking-wider uppercase font-bold text-slate-500 mb-1">
                                Commit / Evidence Verification URL
                              </label>
                              <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-700">
                                <Link className="w-3 h-3 text-slate-400 shrink-0" />
                                <input
                                  type="text"
                                  value={draft.evidenceLink}
                                  onChange={(e) =>
                                    setRubricDrafts((prev) => ({
                                      ...prev,
                                      [stat.userId]: { ...draft, evidenceLink: e.target.value },
                                    }))
                                  }
                                  className="w-full bg-transparent font-mono text-[10px] text-slate-600 focus:outline-hidden"
                                />
                              </div>
                            </div>

                            {/* 3 Rubric Sliders */}
                            <div className="space-y-2.5 text-xs">
                              <div>
                                <div className="flex justify-between text-slate-700 mb-1">
                                  <span>Contribution Volume (35%)</span>
                                  <span className="font-mono font-bold text-slate-900">{draft.rubric.contribution}/5</span>
                                </div>
                                <input
                                  type="range"
                                  min="1"
                                  max="5"
                                  value={draft.rubric.contribution}
                                  onChange={(e) =>
                                    setRubricDrafts((prev) => ({
                                      ...prev,
                                      [stat.userId]: {
                                        ...draft,
                                        rubric: { ...draft.rubric, contribution: parseInt(e.target.value) },
                                      },
                                    }))
                                  }
                                  className="w-full accent-indigo-600 cursor-pointer"
                                />
                              </div>

                              <div>
                                <div className="flex justify-between text-slate-700 mb-1">
                                  <span>Quality & Architecture (35%)</span>
                                  <span className="font-mono font-bold text-slate-900">{draft.rubric.quality}/5</span>
                                </div>
                                <input
                                  type="range"
                                  min="1"
                                  max="5"
                                  value={draft.rubric.quality}
                                  onChange={(e) =>
                                    setRubricDrafts((prev) => ({
                                      ...prev,
                                      [stat.userId]: {
                                        ...draft,
                                        rubric: { ...draft.rubric, quality: parseInt(e.target.value) },
                                      },
                                    }))
                                  }
                                  className="w-full accent-indigo-600 cursor-pointer"
                                />
                              </div>

                              <div>
                                <div className="flex justify-between text-slate-700 mb-1">
                                  <span>Collaboration & Punctuality (30%)</span>
                                  <span className="font-mono font-bold text-slate-900">{draft.rubric.collaboration}/5</span>
                                </div>
                                <input
                                  type="range"
                                  min="1"
                                  max="5"
                                  value={draft.rubric.collaboration}
                                  onChange={(e) =>
                                    setRubricDrafts((prev) => ({
                                      ...prev,
                                      [stat.userId]: {
                                        ...draft,
                                        rubric: { ...draft.rubric, collaboration: parseInt(e.target.value) },
                                      },
                                    }))
                                  }
                                  className="w-full accent-indigo-600 cursor-pointer"
                                />
                              </div>
                            </div>

                            {/* Comments Box */}
                            <div>
                              <label className="block text-[10px] tracking-wider uppercase font-bold text-slate-500 mb-1">
                                Private Feedback to {stat.name}:
                              </label>
                              <textarea
                                rows={2}
                                value={draft.comments}
                                onChange={(e) =>
                                  setRubricDrafts((prev) => ({
                                    ...prev,
                                    [stat.userId]: {
                                      ...draft,
                                      comments: e.target.value,
                                    },
                                  }))
                                }
                                placeholder="Add specific feedback on architecture, commit balance, or lab conduct..."
                                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-800"
                              />
                            </div>

                            <button
                              onClick={() => handleSaveGradeForStudent(stat.userId)}
                              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                            >
                              Save Grade & Rubric
                            </button>
                          </div>
                        ) : canSeeGrade ? (
                          /* Student viewing their OWN grade */
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                <Award className="w-4 h-4 text-emerald-600" />
                                <span>Your Course Evaluation</span>
                              </span>
                              {existingGrade ? (
                                <span className="font-mono font-bold text-xs bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                                  Grade: {existingGrade.letterGrade} ({existingGrade.scorePercentage}%)
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">Pending review</span>
                              )}
                            </div>

                            {existingGrade ? (
                              <div className="space-y-2 text-xs text-slate-600">
                                <div className="grid grid-cols-3 gap-1 text-[11px] bg-white p-2 rounded border border-slate-200 font-mono">
                                  <div>Contrib: {existingGrade.rubric.contribution}/5</div>
                                  <div>Quality: {existingGrade.rubric.quality}/5</div>
                                  <div>Collab: {existingGrade.rubric.collaboration}/5</div>
                                </div>
                                <div className="bg-white p-2.5 rounded border border-slate-200 text-slate-700 italic">
                                  "{existingGrade.comments || 'Great work throughout the semester.'}"
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  Evaluated by {existingGrade.gradedBy}
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-slate-500">
                                Prof. {currentClassProject.instructorName?.split(' ').pop()} has not published your individual grade yet.
                              </p>
                            )}
                          </div>
                        ) : (
                          /* Peer Confidential View */
                          <div className="py-6 text-center text-xs text-slate-400 space-y-2">
                            <Lock className="w-5 h-5 mx-auto text-slate-300" />
                            <div className="font-bold text-slate-700">Confidential Evaluation</div>
                            <p className="text-[11px] text-slate-400 px-2 leading-relaxed">
                              Grades and instructor comments are visible strictly to {stat.name} and the course instructor.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Full Simulated Version History */}
      {activeSubTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Document Revision Ledger ({currentClassProject.revisions.length} Commits)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Detailed audit trail linked directly to {currentClassProject.document.fileName}.
              </p>
            </div>

            <div className="text-xs font-mono text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
              Total Delta: <strong className="text-emerald-700">+{contributionSummary?.totalWordsAdded}</strong> / <strong className="text-rose-600">-{contributionSummary?.totalWordsRemoved}</strong>
            </div>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {currentClassProject.revisions.map((rev) => (
              <div key={rev.id} className="relative group">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[9px] font-bold flex items-center justify-center ring-4 ring-white">
                  {rev.authorName.charAt(0)}
                </div>

                <div className="bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200/90 p-4 text-xs transition-colors space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 text-sm">{rev.authorName}</strong>
                      <span className="text-slate-400 font-mono text-xs">({rev.version})</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500">{rev.authorRole}</span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-emerald-700 font-bold">+{rev.wordsAdded}</span>
                      <span className="text-rose-600 font-bold">-{rev.wordsRemoved}</span>
                      <span className="text-slate-400 text-[10px]">{rev.timestamp.replace('T', ' ').replace('Z', '')}</span>
                    </div>
                  </div>

                  <p className="text-slate-700 font-medium">"{rev.summary}"</p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1 border-t border-slate-200/50">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>Session Duration: {rev.sessionDurationMinutes} min</span>
                    </span>
                    <span>·</span>
                    <span>Document: {currentClassProject.document.fileName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Document Outline & Spec */}
      {activeSubTab === 'document' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-indigo-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {currentClassProject.document.fileName}
                  </h3>
                  <div className="text-xs text-slate-500 font-mono">
                    {currentClassProject.document.wordCount} words · {currentClassProject.document.pageCount} pages · Updated {currentClassProject.document.lastModified}
                  </div>
                </div>
              </div>

              {isTeacher ? (
                <button
                  onClick={handleDownloadFile}
                  className="px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Document Archive</span>
                </button>
              ) : (
                <div
                  className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg select-none font-mono"
                  title="Document downloading is restricted to course instructors to preserve academic integrity. Students have view-only access."
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Download restricted to instructors</span>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50/50 rounded-xl border border-slate-200 space-y-6 font-serif">
              {currentClassProject.document.sections.map((sec, i) => (
                <div key={i} className="space-y-2">
                  <h4 className="font-sans font-bold text-slate-900 text-sm">
                    {sec.heading}
                  </h4>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                    {sec.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
