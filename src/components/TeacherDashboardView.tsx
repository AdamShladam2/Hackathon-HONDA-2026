import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  FolderPlus,
  Users,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
  Plus,
  ChevronRight,
  Eye,
  AlertCircle,
  Lock,
  Calendar,
  Send,
  MessageSquare,
  Award,
  Scale,
  Archive,
  Trash2,
  Compass,
  BarChart3,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TeacherClass, ClassAssignment, WorkEvidence, StudentTeam } from '../types';
import { TeacherBrowseProjectsView } from './TeacherBrowseProjectsView';
import { TeacherIntegrityDashboardView } from './TeacherIntegrityDashboardView';

export const TeacherDashboardView: React.FC = () => {
  const {
    currentUser,
    teacherClasses,
    classAssignments,
    studentTeams,
    workEvidences,
    projects,
    classProjects,
    openContributionAnalysisModal,
    createTeacherClass,
    createClassAssignment,
    updateAssignmentStatus,
    toggleAssignmentArchive,
    deleteClassAssignment,
    studentSubmissions,
    reusableProjectTemplates,
    reviewContribution,
    openDocumentTimeline,
    openPortfolio,
    allDemoAccounts,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'browse-projects' | 'assignments' | 'similarity' | 'reviews' | 'teams' | 'classes' | 'integrity'
  >('browse-projects');

  const [assignmentStatusFilter, setAssignmentStatusFilter] = useState<'All' | 'Published' | 'Draft' | 'Archived'>('All');

  // Create Assignment Modal / Form State
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [assignClassCode, setAssignClassCode] = useState('CSE 3901');
  const [assignClassName, setAssignClassName] = useState('Web Applications');
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDescription, setAssignDescription] = useState('');
  const [assignInstructions, setAssignInstructions] = useState('');
  const [assignDocUrl, setAssignDocUrl] = useState('https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit');
  const [assignDeliverables, setAssignDeliverables] = useState<string[]>([
    'Architecture Specification (Google Docs)',
    'API Implementation & Route Controllers',
    'Interactive UI Component Library',
    'Individual Contribution Statement with Attached Evidence',
  ]);
  const [newDeliverableInput, setNewDeliverableInput] = useState('');
  const [assignSkills, setAssignSkills] = useState('React, TypeScript, Node.js, SQL');
  const [assignMinGroup, setAssignMinGroup] = useState(3);
  const [assignMaxGroup, setAssignMaxGroup] = useState(4);
  const [assignDueDate, setAssignDueDate] = useState('2026-11-30');
  const [assignCollabRules, setAssignCollabRules] = useState('Team members must collaborate on architecture and divide modules. Direct cross-team code sharing is strictly prohibited.');
  const [assignSubmissionReqs, setAssignSubmissionReqs] = useState('Attach individual Google Docs / Git commit evidence links to your SkillSink portfolio for instructor review.');
  const [assignHideCode, setAssignHideCode] = useState(true);
  const [assignPreventPublicRepo, setAssignPreventPublicRepo] = useState(true);
  const [assignAllowShowcase, setAssignAllowShowcase] = useState(true);
  const [assignRequireApproval, setAssignRequireApproval] = useState(true);

  // Create Class State
  const [isCreatingClass, setIsCreatingClass] = useState(false);
  const [newClassCode, setNewClassCode] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [newClassSemester, setNewClassSemester] = useState('Autumn 2026');

  // Review Feedback Modal/State
  const [reviewingEvidenceId, setReviewingEvidenceId] = useState<string | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState('Rigorous modular architecture and clean documentation. Verified for CSE 3901 individual contribution credit.');

  const handleAddDeliverable = () => {
    if (newDeliverableInput.trim()) {
      setAssignDeliverables([...assignDeliverables, newDeliverableInput.trim()]);
      setNewDeliverableInput('');
    }
  };

  const handleRemoveDeliverable = (idx: number) => {
    setAssignDeliverables(assignDeliverables.filter((_, i) => i !== idx));
  };

  const handleCreateAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle.trim()) {
      showToast('Please enter an assignment title', 'warning');
      return;
    }

    createClassAssignment({
      classCode: assignClassCode,
      className: assignClassName,
      title: assignTitle,
      description: assignDescription,
      instructionsText: assignInstructions,
      instructionsDocUrl: assignDocUrl,
      expectedDeliverables: assignDeliverables,
      requiredSkills: assignSkills.split(',').map((s) => s.trim()).filter(Boolean),
      groupSize: { min: assignMinGroup, max: assignMaxGroup },
      dueDate: assignDueDate,
      collaborationRules: assignCollabRules,
      submissionRequirements: assignSubmissionReqs,
      isTeacherManaged: true,
      hideSourceCodeByDefault: assignHideCode,
      preventPublicRepoAttachment: assignPreventPublicRepo,
      allowPublicShowcase: assignAllowShowcase,
      requireTeacherApprovalForShowcase: assignRequireApproval,
      studentTeamIds: [],
    });

    setIsCreatingAssignment(false);
    // Reset form
    setAssignTitle('');
    setAssignDescription('');
    setAssignInstructions('');
  };

  const handleCreateClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassCode.trim() || !newClassName.trim()) {
      showToast('Please fill out course code and name', 'warning');
      return;
    }
    createTeacherClass({
      code: newClassCode,
      name: newClassName,
      semester: newClassSemester,
      enrolledStudentsCount: 0,
      activeTeamsCount: 0,
      assignmentsCount: 0,
    });
    setIsCreatingClass(false);
    setNewClassCode('');
    setNewClassName('');
  };

  const pendingReviews = workEvidences.filter((e) => e.status === 'Evidence attached');
  const completedReviews = workEvidences.filter((e) => e.status === 'Reviewer-confirmed' || e.status === 'Needs clarification');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner: Distinction & Verification Info */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex items-start justify-between gap-6 flex-wrap relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              Dedicated Teacher & Academic Integrity Dashboard
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Faculty Coursework Administration • {currentUser.name}
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed">
              Manage coursework assignments with built-in anti-plagiarism guardrails. Authorize teams, verify individual Google Docs/Git evidence without exposing solutions to public search, and confirm authentic student contributions.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 flex-wrap">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Anti-Plagiarism Protection Active
              </span>
              <span>•</span>
              <span>{teacherClasses.length} Courses</span>
              <span>•</span>
              <span>{classAssignments.length} Academic Assignments</span>
              <span>•</span>
              <span className="text-amber-300 font-semibold">{pendingReviews.length} Submissions Awaiting Review</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsCreatingAssignment(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              <FolderPlus className="w-4 h-4" />
              Create Class Assignment
            </button>
            <button
              onClick={() => setIsCreatingClass(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/15 flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Class
            </button>
          </div>
        </div>

        {/* Demo Disclaimer Banner */}
        <div className="mt-6 p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Role-Based Experience:</strong> You are currently signed in under the simulated Professor account ({currentUser.name}, {currentUser.organization}). This dashboard is completely separated from Work Hub project creation and requires no paid subscription.
          </span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-6 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('browse-projects')}
            className={`py-2 px-1 border-b-2 font-semibold text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'browse-projects'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Compass className="w-4 h-4" />
            Browse Projects ({reusableProjectTemplates.length})
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`py-2 px-1 border-b-2 font-semibold text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'assignments'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Classroom Projects ({classAssignments.length})
          </button>

          <button
            onClick={() => setActiveTab('similarity')}
            className={`py-2 px-1 border-b-2 font-semibold text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'similarity'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Scale className="w-4 h-4" />
            Integrity & Similarity ({studentSubmissions.length})
            {studentSubmissions.filter((s) => !s.similarityReport || s.similarityReport.teacherReviewStatus === 'Not reviewed').length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 font-bold">
                {studentSubmissions.filter((s) => !s.similarityReport || s.similarityReport.teacherReviewStatus === 'Not reviewed').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-2 px-1 border-b-2 font-semibold text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Contribution Reviews
            {pendingReviews.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 font-bold">
                {pendingReviews.length} new
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('teams')}
            className={`py-2 px-1 border-b-2 font-semibold text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'teams'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
            Student Teams ({studentTeams.length})
          </button>

          <button
            onClick={() => setActiveTab('classes')}
            className={`py-2 px-1 border-b-2 font-semibold text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'classes'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            My Classes ({teacherClasses.length})
          </button>

          <button
            onClick={() => setActiveTab('integrity')}
            className={`py-2 px-1 border-b-2 font-semibold text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'integrity'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Integrity Policies
          </button>
        </nav>
      </div>

      {/* TAB 0: BROWSE PROJECTS (CURRICULUM SEARCH) */}
      {activeTab === 'browse-projects' && <TeacherBrowseProjectsView />}

      {/* TAB 1: ASSIGNMENTS / CLASS PROJECTS */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Teacher-Managed Classroom Projects
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage coursework assignments with automatic source code masking and restricted public repo attachment.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Status Filter */}
              <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs">
                {(['All', 'Published', 'Draft', 'Archived'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setAssignmentStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      assignmentStatusFilter === st
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsCreatingAssignment(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
              >
                <FolderPlus className="w-4 h-4" />
                Create Class Project
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classAssignments
              .filter((a) => {
                if (assignmentStatusFilter === 'All') return true;
                if (assignmentStatusFilter === 'Archived') return a.isArchived;
                return (a.status || 'Published') === assignmentStatusFilter && !a.isArchived;
              })
              .map((assignment) => (
                <div
                  key={assignment.id}
                  className={`bg-white dark:bg-slate-800/60 rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                    assignment.isArchived
                      ? 'border-slate-300 dark:border-slate-700 opacity-75'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Badge Row */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {assignment.classCode} • {assignment.className}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            assignment.status === 'Draft'
                              ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                              : assignment.isArchived
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          {assignment.isArchived ? 'Archived' : assignment.status || 'Published'}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Anti-Copying Active
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {assignment.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                        {assignment.description}
                      </p>
                    </div>

                    {/* Learning Objectives Preview if available */}
                    {assignment.learningObjectives && assignment.learningObjectives.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Learning Objectives:
                        </span>
                        {assignment.learningObjectives.slice(0, 2).map((obj, i) => (
                          <div key={i} className="text-slate-600 dark:text-slate-300 truncate">
                            • {obj}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Deliverables snippet */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Expected Deliverables ({assignment.expectedDeliverables.length})
                      </span>
                      <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                        {assignment.expectedDeliverables.slice(0, 3).map((d, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span className="truncate">{d}</span>
                          </li>
                        ))}
                        {assignment.expectedDeliverables.length > 3 && (
                          <li className="text-[11px] text-slate-400 pl-5">
                            +{assignment.expectedDeliverables.length - 3} more deliverables
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1">
                      {assignment.requiredSkills.map((sk, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Due {assignment.dueDate}
                      </div>
                      <div className="font-medium text-slate-700 dark:text-slate-300">
                        Group size: {assignment.teamSizeMin || assignment.groupSize?.min || 1}-{assignment.teamSizeMax || assignment.groupSize?.max || 4} students
                      </div>
                    </div>

                    {/* Lifecycle action buttons */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <button
                        type="button"
                        onClick={() =>
                          updateAssignmentStatus(
                            assignment.id,
                            assignment.status === 'Draft' ? 'Published' : 'Draft'
                          )
                        }
                        className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 text-[11px] font-medium"
                      >
                        {assignment.status === 'Draft' ? 'Publish to Class' : 'Move to Draft'}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleAssignmentArchive(assignment.id)}
                          className="p-1 text-slate-400 hover:text-amber-600"
                          title={assignment.isArchived ? 'Restore Assignment' : 'Archive Assignment'}
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteClassAssignment(assignment.id)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                          title="Delete Assignment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 1.5: SIMILARITY CHECKER & INTEGRITY DASHBOARD */}
      {activeTab === 'similarity' && <TeacherIntegrityDashboardView />}

      {/* TAB 2: CONTRIBUTION REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Student Contribution Reviews
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Verify individual student deliverables, inspect Google Docs collaborative revision logs, and provide instructor verification stamps.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                {pendingReviews.length} Pending Sign-Off
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                {completedReviews.length} Confirmed
              </span>
            </div>
          </div>

          {/* Pending Submissions Queue */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Submissions Awaiting Instructor Review ({pendingReviews.length})
            </h3>

            {pendingReviews.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                  All student contributions currently reviewed!
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  When students submit new Google Docs, Slides, or Git pull requests, they will appear here.
                </p>
              </div>
            ) : (
              pendingReviews.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white dark:bg-slate-800/80 rounded-2xl border-2 border-amber-300 dark:border-amber-700/80 p-5 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900">
                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Awaiting Instructor Sign-Off
                          </span>
                          <span className="text-xs font-medium text-slate-500">
                            {ev.evidenceType}
                          </span>
                          <span className="text-xs text-slate-400">
                            Submitted: {ev.date}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                          {ev.title}
                        </h4>

                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          Assignment: {ev.associatedProjectTitle}
                        </p>
                      </div>
                    </div>

                    {/* Quick Review Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openDocumentTimeline(ev)}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 transition-colors flex items-center gap-1.5"
                      >
                        <Clock className="w-4 h-4" />
                        Inspect Document Revision Logs
                      </button>

                      <button
                        onClick={() => {
                          setReviewingEvidenceId(ev.id);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Review & Confirm
                      </button>
                    </div>
                  </div>

                  {/* Claimed Contribution Description */}
                  <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800 text-xs">
                    <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                      Student Claimed Work Description & Section Attribution
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {ev.description}
                    </p>

                    {ev.claimedSections && (
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        <span className="text-slate-400 font-medium">Claimed Sections:</span>
                        {ev.claimedSections.map((sec, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 font-mono text-[11px]"
                          >
                            {sec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Student Author Preview */}
                  {ev.contributors && (
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Lead Author:</span>
                        <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                          <img
                            src={ev.contributors[0]?.avatar}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span>{ev.contributors[0]?.name}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const authorAccount = allDemoAccounts.find((a) => a.id === ev.contributors?.[0]?.id);
                          if (authorAccount) openPortfolio(authorAccount);
                        }}
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Student Full Contribution Portfolio
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Completed Reviews List */}
          <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Previously Verified Submissions ({completedReviews.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedReviews.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {ev.status}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Verified {ev.reviewedDate}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {ev.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {ev.description}
                  </p>

                  {ev.reviewerFeedback && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200 italic">
                      Instructor Stamp: "{ev.reviewerFeedback}"
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => openDocumentTimeline(ev)}
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      View Timeline
                    </button>

                    {ev.url && (
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                      >
                        Source <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT TEAMS */}
      {activeTab === 'teams' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Authorized Student Teams
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Teams formed for coursework via skill matching. Monitor individual team member contributions and progress.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studentTeams.map((team) => (
              <div
                key={team.id}
                className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {team.classCode}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {team.teamName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Assignment: {team.assignmentTitle}
                    </p>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {team.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600 dark:text-slate-400">Team Deliverable Progress</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">{team.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${team.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Team Members List */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Team Members ({team.members.length})
                  </span>
                  <div className="space-y-2">
                    {team.members.map((member) => (
                      <div
                        key={member.studentId}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={member.studentAvatar}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white block">
                              {member.studentName}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              {member.role}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            {member.contributionsCount} deliverables
                          </span>
                          <button
                            onClick={() => {
                              const authorAccount = allDemoAccounts.find((a) => a.id === member.studentId);
                              if (authorAccount) openPortfolio(authorAccount);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-blue-600 transition-colors"
                            title="Inspect Portfolio"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Contribution Audit Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Evidence Coverage: <strong>{team.members.length} members</strong>
                  </span>
                  <button
                    onClick={() => {
                      const allPs = [...projects, ...classProjects];
                      const matchingProject = allPs.find(
                        (p) =>
                          p.title.toLowerCase().includes(team.teamName.toLowerCase()) ||
                          p.title.toLowerCase().includes(team.assignmentTitle.toLowerCase()) ||
                          p.id === 'proj-1'
                      ) || allPs[0];
                      openContributionAnalysisModal(matchingProject);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Analyze Team Contributions</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MY CLASSES */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Course Catalog & Enrollment
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage registered courses, semester rosters, and active project team counts.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingClass(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Register New Course
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teacherClasses.map((c) => (
              <div
                key={c.id}
                className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {c.code}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {c.semester}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {c.name}
                </h3>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-center">
                    <span className="text-xl font-bold text-slate-900 dark:text-white block">
                      {c.enrolledStudentsCount}
                    </span>
                    <span className="text-[11px] text-slate-500">Enrolled Students</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-center">
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400 block">
                      {c.activeTeamsCount}
                    </span>
                    <span className="text-[11px] text-slate-500">Active Teams</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-center">
                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 block">
                      {c.assignmentsCount}
                    </span>
                    <span className="text-[11px] text-slate-500">Assignments</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">ID: {c.id}</span>
                  <button
                    onClick={() => setActiveTab('assignments')}
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    View Course Assignments <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ACADEMIC INTEGRITY SETTINGS */}
      {activeTab === 'integrity' && (
        <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Academic Integrity & Anti-Copying Enforcement Policies
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              SkillSink is designed to let university students discover compatible teammates and verify authentic contributions without turning into a homework-sharing repository or exposing protected assignment solution files.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Source Code & Solution Masking
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Enforced
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Source code solution files for teacher-managed coursework are kept strictly private to enrolled team members and course faculty. Non-enrolled users browsing portfolios cannot view or download full code solutions.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Public GitHub Repo Prevention
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Enforced
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Students cannot attach public GitHub repository URLs to class project entries. This blocks future semester students from scraping past assignment code.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Showcase Instructor Sign-Off Gate
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Before any coursework project can appear in the public cross-school Showcase, the instructor must approve a redacted summary that reveals project skills without leaking assignment test cases or solutions.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Collaborative Authorship Verification
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  Google Docs / Slides
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Students attach collaborative Google Docs with revision timelines to prove which team member wrote which section, combating "free-rider" problems in group academic projects.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CLASS ASSIGNMENT MODAL */}
      {isCreatingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Create Teacher-Managed Academic Project
                </h3>
              </div>
              <button
                onClick={() => setIsCreatingAssignment(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignmentSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={assignClassCode}
                    onChange={(e) => setAssignClassCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="e.g. CSE 3901"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Course Name
                  </label>
                  <input
                    type="text"
                    value={assignClassName}
                    onChange={(e) => setAssignClassName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="e.g. Web Applications"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="e.g. Distributed Consensus Engine"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  One-Line Description
                </label>
                <input
                  type="text"
                  value={assignDescription}
                  onChange={(e) => setAssignDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Summary of assignment objectives and learning goals"
                  required
                />
              </div>

              {/* Paste Assignment Instructions Directly */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Paste Assignment Instructions & Rubric Directly
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAssignInstructions(`INSTRUCTIONS & DELIVERABLES:
1. Architecture Document: Formulate state transitions in Google Docs with team attribution.
2. Implementation: Build modular microservices using TypeScript / Node.js.
3. Integrity Policy: All code is private. Public repository publishing is strictly prohibited.`);
                    }}
                    className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Insert Sample Rubric
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={assignInstructions}
                  onChange={(e) => setAssignInstructions(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px]"
                  placeholder="Paste complete instructions, requirements, test cases, and rubric here..."
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Instructions Document Link (Optional)
                </label>
                <input
                  type="url"
                  value={assignDocUrl}
                  onChange={(e) => setAssignDocUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="https://docs.google.com/document/d/..."
                />
              </div>

              {/* Expected Deliverables */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Expected Deliverables
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newDeliverableInput}
                    onChange={(e) => setNewDeliverableInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                    placeholder="e.g. Unit tests with 90% coverage"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDeliverable();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1">
                  {assignDeliverables.map((deliv, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    >
                      <span className="text-slate-700 dark:text-slate-300 text-xs">{deliv}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(idx)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Required Skills (CSV)
                  </label>
                  <input
                    type="text"
                    value={assignSkills}
                    onChange={(e) => setAssignSkills(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Group Size (Min / Max)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={assignMinGroup}
                      onChange={(e) => setAssignMinGroup(Number(e.target.value))}
                      className="w-1/2 px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={assignMaxGroup}
                      onChange={(e) => setAssignMaxGroup(Number(e.target.value))}
                      className="w-1/2 px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={assignDueDate}
                    onChange={(e) => setAssignDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Academic Integrity Switches */}
              <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-3">
                <span className="font-bold text-indigo-900 dark:text-indigo-200 block uppercase tracking-wider text-[11px]">
                  Academic Integrity & Anti-Copying Enforcement Settings
                </span>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={assignHideCode}
                    onChange={(e) => setAssignHideCode(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      Hide source code and solution files from public browsing by default
                    </span>
                    <p className="text-slate-500 text-[11px]">
                      Prevents other students from downloading full code implementations.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={assignPreventPublicRepo}
                    onChange={(e) => setAssignPreventPublicRepo(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      Prevent public GitHub repository attachment through the class sharing form
                    </span>
                    <p className="text-slate-500 text-[11px]">
                      Enforces anti-copying rule so assignment repos are not publicly exposed.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={assignRequireApproval}
                    onChange={(e) => setAssignRequireApproval(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      Require teacher approval before any student can share a project summary to the public Showcase
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingAssignment(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-sm"
                >
                  Publish Academic Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CLASS MODAL */}
      {isCreatingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Register New University Course
            </h3>
            <form onSubmit={handleCreateClassSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  value={newClassCode}
                  onChange={(e) => setNewClassCode(e.target.value)}
                  placeholder="e.g. CSE 4471"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g. Information Security"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Semester
                </label>
                <input
                  type="text"
                  value={newClassSemester}
                  onChange={(e) => setNewClassSemester(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingClass(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW FEEDBACK MODAL */}
      {reviewingEvidenceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Instructor Contribution Review & Verification Stamp
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Your feedback note and confirmation badge will be stamped onto the student's contribution portfolio and verified across teammate matching cards.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Instructor Feedback & Assessment Notes
              </label>
              <textarea
                rows={4}
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => {
                  reviewContribution(reviewingEvidenceId, 'Needs clarification', reviewFeedback);
                  setReviewingEvidenceId(null);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 border border-amber-200 dark:border-amber-800"
              >
                Request Clarification
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReviewingEvidenceId(null)}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reviewContribution(reviewingEvidenceId, 'Reviewer-confirmed', reviewFeedback);
                    setReviewingEvidenceId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm"
                >
                  Stamp & Confirm Contribution
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
