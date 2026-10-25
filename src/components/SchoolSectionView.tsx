import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Share2,
  ShieldAlert,
  KeyRound,
  Eye,
  BookOpen,
  ArrowRight,
  Sparkles,
  Users,
  ShieldCheck,
  FileText,
  Plus,
  Clock,
  ExternalLink,
  Lock,
  Layers,
  ChevronRight,
  CheckCircle2,
  Search,
  Filter,
  X,
} from 'lucide-react';
import { EvidenceType } from '../types';

export const SchoolSectionView: React.FC = () => {
  const {
    campusClassProjects: classProjects,
    campusClassAssignments: classAssignments,
    userCampus,
    openShareModal,
    setSelectedProject,
    setActiveView,
    submitWorkEvidence,
    openPortfolio,
    openStudentSubmitModal,
    currentUser,
    showToast,
    canvasConnection,
    openCanvasModal,
  } = useApp();

  const [isSubmitEvidenceModalOpen, setIsSubmitEvidenceModalOpen] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState('CSE 3901 Architecture Specification & Transaction Isolation Spec');
  const [evidenceType, setEvidenceType] = useState<EvidenceType>('Google Docs');
  const [evidenceUrl, setEvidenceUrl] = useState('https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit');
  const [evidenceDesc, setEvidenceDesc] = useState('Authored Section 3: REST API Contracts and Section 4: Concurrency Isolation Model. Documented optimistic lock rollback handling.');
  const [evidenceSections, setEvidenceSections] = useState('Section 3.2, Section 4.1');
  const [selectedAssignId, setSelectedAssignId] = useState(classAssignments[0]?.id || '');

  // Course & Professor Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [professorFilter, setProfessorFilter] = useState('all');

  // Course & professor options come from this campus's own coursework
  const campusCourses = Array.from(
    new Set([
      ...classAssignments.map((a) => a.classCode),
      ...classProjects.map((p) => p.courseCode).filter(Boolean),
    ])
  ) as string[];
  const campusProfessors = Array.from(
    new Set([
      ...classAssignments.map((a) => a.teacherName),
      ...classProjects.map((p) => p.professorName).filter(Boolean),
    ])
  ) as string[];

  // Filter assignments
  const filteredAssignments = classAssignments.filter((assign) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      searchQuery === '' ||
      assign.title.toLowerCase().includes(q) ||
      assign.className.toLowerCase().includes(q) ||
      assign.classCode.toLowerCase().includes(q) ||
      assign.teacherName.toLowerCase().includes(q) ||
      assign.description.toLowerCase().includes(q);

    if (!matchSearch) return false;
    if (courseFilter !== 'all' && assign.classCode !== courseFilter) return false;
    if (professorFilter !== 'all' && assign.teacherName !== professorFilter) return false;
    return true;
  });

  // Filter student submissions
  const filteredClassProjects = classProjects.filter((proj) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      searchQuery === '' ||
      proj.title.toLowerCase().includes(q) ||
      (proj.courseCode && proj.courseCode.toLowerCase().includes(q)) ||
      (proj.courseName && proj.courseName.toLowerCase().includes(q)) ||
      (proj.professorName && proj.professorName.toLowerCase().includes(q)) ||
      proj.description.toLowerCase().includes(q);

    if (!matchSearch) return false;
    if (courseFilter !== 'all' && proj.courseCode !== courseFilter) return false;
    if (professorFilter !== 'all' && proj.professorName !== professorFilter) return false;
    return true;
  });

  const handleSubmitEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAssign = classAssignments.find((a) => a.id === selectedAssignId) || classAssignments[0];

    submitWorkEvidence({
      title: evidenceTitle,
      url: evidenceUrl,
      evidenceType: evidenceType,
      description: evidenceDesc,
      associatedProjectId: targetAssign?.id,
      associatedProjectTitle: targetAssign?.title,
      visibility: 'Team Only',
      status: 'Evidence attached',
      claimedSections: evidenceSections.split(',').map((s) => s.trim()).filter(Boolean),
      contributors: [
        { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
      ],
    });

    setIsSubmitEvidenceModalOpen(false);
  };

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* School Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-red-300 text-xs font-semibold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-red-400" />
            <span>{userCampus?.name}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus Hub: Academic Projects & Teammate Matching
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Discover teacher-managed academic assignments, form authorized student teams with verified skill synergy, and submit individual contribution deliverables for faculty review.
          </p>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <button
              onClick={() => setActiveView('teammate-match')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-purple-600/30 transition-colors"
            >
              <Users className="w-4 h-4" />
              Find Course Teammates
            </button>

            <button
              onClick={() => setIsSubmitEvidenceModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-blue-600/30 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Submit Work Evidence Link
            </button>

            <button
              onClick={() => setActiveView('canvas-classes')}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-red-600/30 transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Canvas Class Roster</span>
            </button>

            <button
              onClick={() => openPortfolio(currentUser)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 transition-colors"
            >
              View My Contribution Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* Canvas LMS Class Roster Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold border border-red-200 shrink-0">
            <GraduationCap className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm text-slate-900">
                {canvasConnection.isConnected
                  ? `${canvasConnection.institutionName} Canvas LMS Active`
                  : 'Connect Canvas LMS via School Email'}
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                {canvasConnection.isConnected ? `${canvasConnection.courses.length} Enrolled Courses` : 'Not Linked'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {canvasConnection.isConnected
                ? `Logged in with ${canvasConnection.schoolEmail}. Access classmates in your sections to form project teams.`
                : 'Use your school .edu email to connect your courses and find project partners from your class sections.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (canvasConnection.isConnected) {
              setActiveView('canvas-classes');
            } else {
              openCanvasModal();
            }
          }}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span>{canvasConnection.isConnected ? 'View Classmates Roster' : 'Connect School Email'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Academic Integrity Policy Notice */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 flex items-start gap-3.5 shadow-sm">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 space-y-1">
          <h2 className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-amber-700" />
            Academic Integrity & Anti-Copying Enforcement
          </h2>
          <p className="leading-relaxed">
            All coursework projects are protected: solution code and private repositories cannot be made public to prevent cross-semester cheating. To demonstrate your authentic skills, students attach collaborative document revision evidence (Google Docs / Slides / Pull Requests). Instructor review stamps certify individual mastery without revealing protected answers.
          </p>
        </div>
      </div>

      {/* Course & Professor Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search university projects by course code, professor, or topic..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium"
            >
              <option value="all">All Courses</option>
              {campusCourses.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={professorFilter}
              onChange={(e) => setProfessorFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium"
            >
              <option value="all">All Professors</option>
              {campusProfessors.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {(searchQuery || courseFilter !== 'all' || professorFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCourseFilter('all');
                  setProfessorFilter('all');
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Quick Course Selector Pills */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 flex-wrap text-xs">
          <span className="text-[11px] font-semibold text-slate-500">Quick Courses:</span>
          {campusCourses.slice(0, 3).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCourseFilter(courseFilter === c ? 'all' : c)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                courseFilter === c
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
          <span className="text-slate-300 mx-1">·</span>
          <span className="text-[11px] font-semibold text-slate-500">Professors:</span>
          {campusProfessors.slice(0, 2).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProfessorFilter(professorFilter === p ? 'all' : p)}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                professorFilter === p
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {p.split(' ').slice(-1)[0]}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: TEACHER-MANAGED CLASS ASSIGNMENTS (Core Requirement) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Teacher-Managed Academic Projects ({filteredAssignments.length})
            </h2>
            <p className="text-xs text-slate-500">
              Registered by Prof. Robert Hayes • Form teams and submit individual deliverables
            </p>
          </div>
          <button
            onClick={() => setActiveView('teammate-match')}
            className="text-xs font-semibold text-purple-600 hover:underline flex items-center gap-1"
          >
            <span>Match Classmates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-white border-2 border-indigo-100 hover:border-indigo-300 rounded-2xl p-5 shadow-sm space-y-4 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {assignment.classCode} • {assignment.className}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Solutions Masked
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {assignment.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {assignment.description}
                </p>
              </div>

              {/* Instructions preview */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                  Instructor Instructions & Specifications
                </span>
                <p className="text-slate-700 font-mono text-[11px] line-clamp-2 whitespace-pre-line">
                  {assignment.instructionsText}
                </p>
                {assignment.instructionsDocUrl && (
                  <a
                    href={assignment.instructionsDocUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline mt-1.5"
                  >
                    View Official Assignment Doc <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Expected Deliverables */}
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                  Required Deliverables
                </span>
                <ul className="space-y-1 text-xs text-slate-600">
                  {assignment.expectedDeliverables.slice(0, 3).map((d, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500">
                  Team size: {assignment.groupSize.min}-{assignment.groupSize.max} students
                </span>

                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  <button
                    onClick={() => openStudentSubmitModal(assignment)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Submit Work
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAssignId(assignment.id);
                      setIsSubmitEvidenceModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs border border-blue-200 transition-colors"
                  >
                    Attach Link
                  </button>
                  <button
                    onClick={() => setActiveView('teammate-match')}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-sm transition-colors"
                  >
                    Teammates
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: STUDENT COURSEWORK SUBMISSIONS */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Student Coursework Submissions ({filteredClassProjects.length})
          </h2>
          <span className="text-xs text-slate-400">{userCampus?.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredClassProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-semibold">
                    {proj.courseName}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500 font-medium">
                    {proj.codeAvailability === 'on_request'
                      ? 'Code on request'
                      : 'Demo only (No public code)'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {proj.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {proj.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-slate-500">
                  {proj.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share to Showcase CTA */}
              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <button
                  onClick={() => setSelectedProject(proj)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  View Details
                </button>
                <button
                  onClick={() => openShareModal(proj)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share to Showcase</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUBMIT WORK EVIDENCE MODAL */}
      {isSubmitEvidenceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Submit Contribution Work Evidence
                </h3>
              </div>
              <button
                onClick={() => setIsSubmitEvidenceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEvidence} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Associated Academic Assignment
                </label>
                <select
                  value={selectedAssignId}
                  onChange={(e) => setSelectedAssignId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900"
                >
                  {classAssignments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.classCode}: {a.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Deliverable Title
                </label>
                <input
                  type="text"
                  value={evidenceTitle}
                  onChange={(e) => setEvidenceTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Evidence Type
                  </label>
                  <select
                    value={evidenceType}
                    onChange={(e) => setEvidenceType(e.target.value as EvidenceType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900"
                  >
                    <option value="Google Docs">Google Docs</option>
                    <option value="Google Slides">Google Slides</option>
                    <option value="Google Sheets">Google Sheets</option>
                    <option value="GitHub PR/Commit">GitHub PR/Commit</option>
                    <option value="Figma">Figma</option>
                    <option value="Live demo">Live demo</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Claimed Section Tags
                  </label>
                  <input
                    type="text"
                    value={evidenceSections}
                    onChange={(e) => setEvidenceSections(e.target.value)}
                    placeholder="e.g. Section 3.2, Section 4"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Deliverable Link (Google Docs / GitHub PR / Live Demo)
                </label>
                <input
                  type="url"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Individual Contribution Statement & Attribution
                </label>
                <textarea
                  rows={3}
                  value={evidenceDesc}
                  onChange={(e) => setEvidenceDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900"
                  placeholder="Explain exactly what you engineered, authored, or designed..."
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900">
                <strong>Collaborative Attribution Note:</strong> Google Docs deliverables will automatically generate simulated chronological revision timestamps to verify your individual contribution during instructor review.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitEvidenceModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-sm"
                >
                  Submit for Instructor Sign-Off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
