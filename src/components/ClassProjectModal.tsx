import React, { useEffect, useMemo, useState } from 'react';
import { X, Github, Users, Paperclip, ClipboardCheck, Plus, Trash2, Search, GraduationCap, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PeerAssessment, Project, ProjectAttachedFile, TeamMember } from '../types';
import { FileAttachmentInput } from './FileAttachmentInput';
import { PeerAssessmentEditor, PeerRatingDraft, draftToAssessments } from './PeerAssessmentEditor';
import { courseKey, isEduEmail, shortCourseCode } from '../services/campusAccess';

interface ClassProjectModalProps {
  onClose: () => void;
  initialData?: Partial<Project>;
}

const OTHER_CLASS = '__other';
const GITHUB_URL = /^https:\/\/(www\.)?github\.com\/[^/\s]+\/[^/\s]+/i;

const initialsAvatar = (name: string) => {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#6366f1"/><text x="50%" y="54%" font-family="sans-serif" font-size="26" fill="#fff" text-anchor="middle" dominant-baseline="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Campus class project: pick the class, add partners, upload files or a folder,
// optionally link GitHub, and rate each partner's work on each assignment.
export const ClassProjectModal: React.FC<ClassProjectModalProps> = ({ onClose, initialData }) => {
  const {
    currentUser,
    canvasConnection,
    campusDirectory,
    allCanvasClassmates,
    addProject,
    showToast,
    loadCanvasAssignments,
  } = useApp();

  const courses = canvasConnection.isConnected ? canvasConnection.courses : [];
  const initialCourse = courses.find((c) => courseKey(c.courseCode) === courseKey(initialData?.courseCode));
  const [courseId, setCourseId] = useState(initialCourse?.id || (initialData?.courseCode ? OTHER_CLASS : courses[0]?.id || OTHER_CLASS));
  const [otherCode, setOtherCode] = useState(initialCourse ? '' : initialData?.courseCode || '');
  const [otherName, setOtherName] = useState(initialCourse ? '' : initialData?.courseName || '');
  const course = courses.find((c) => c.id === courseId) || null;

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [githubUrl, setGithubUrl] = useState('');
  const [files, setFiles] = useState<ProjectAttachedFile[]>([]);

  // Partners (the creator is always on the team)
  const [partners, setPartners] = useState<TeamMember[]>([]);
  const [myPart, setMyPart] = useState('');
  const [partnerQuery, setPartnerQuery] = useState('');

  // Assignments covered by the project, and this user's rating of each partner per assignment
  const [assignments, setAssignments] = useState<string[]>([]);
  const [newAssignment, setNewAssignment] = useState('');
  const [canvasAssignmentNames, setCanvasAssignmentNames] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<string, Record<string, PeerRatingDraft>>>({});

  useEffect(() => {
    setCanvasAssignmentNames([]);
    if (!course) return;
    let cancelled = false;
    loadCanvasAssignments(course.id)
      .then((res) => !cancelled && setCanvasAssignmentNames(res.assignments.map((a) => a.name)))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [course?.id]);

  // Everyone at this campus on the app, plus Canvas classmates, de-duplicated by email
  const candidates = useMemo(() => {
    const byKey = new Map<string, { id: string; name: string; email?: string; avatar: string; detail: string; inClass: boolean }>();
    const classKey = course ? courseKey(course.courseCode) : '';
    allCanvasClassmates
      .filter((c) => c.role === 'Student')
      .forEach((c) =>
        byKey.set(c.email.toLowerCase(), {
          id: c.id,
          name: c.name,
          email: c.email,
          avatar: c.avatar,
          detail: `${shortCourseCode(c.courseCode)} · ${c.major}`,
          inClass: !!classKey && courseKey(c.courseCode) === classKey,
        })
      );
    campusDirectory.forEach((a) => {
      const key = (a.email || a.id).toLowerCase();
      if (!byKey.has(key))
        byKey.set(key, { id: a.id, name: a.name, email: a.email, avatar: a.avatar, detail: a.major || a.school || '', inClass: false });
    });
    return Array.from(byKey.values()).filter((c) => (c.email || '').toLowerCase() !== (currentUser.email || '').toLowerCase());
  }, [allCanvasClassmates, campusDirectory, course?.id, currentUser]);

  const q = partnerQuery.trim().toLowerCase();
  const suggestions = candidates
    .filter((c) => !partners.some((p) => p.id === c.id))
    .filter((c) => !q || c.name.toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q))
    .sort((a, b) => Number(b.inClass) - Number(a.inClass) || a.name.localeCompare(b.name))
    .slice(0, 6);
  const typedEmail = isEduEmail(q) && !candidates.some((c) => (c.email || '').toLowerCase() === q) ? q : '';

  const addPartner = (p: { id: string; name: string; email?: string; avatar: string }) => {
    setPartners([...partners, { id: p.id, name: p.name, email: p.email, avatar: p.avatar, role: 'Partner', identity: 'Student', contributionDescription: '' }]);
    setPartnerQuery('');
  };

  const addPartnerByEmail = (email: string) => {
    const name = email
      .split('@')[0]
      .replace(/[._\d]+/g, ' ')
      .trim()
      .replace(/\b\w/g, (ch) => ch.toUpperCase()) || email;
    addPartner({ id: `partner-${email}`, name, email, avatar: initialsAvatar(name) });
  };

  const removePartner = (id: string) => {
    setPartners(partners.filter((p) => p.id !== id));
    setRatings(Object.fromEntries(Object.entries(ratings).map(([a, rows]) => [a, Object.fromEntries(Object.entries(rows).filter(([pid]) => pid !== id))])));
    setFiles(files.map((f) => (f.labeledStudentId === id ? { ...f, labeledStudentId: 'team', labeledStudentName: 'Whole Team Deliverable' } : f)));
  };

  const updatePartner = (id: string, patch: Partial<TeamMember>) =>
    setPartners(partners.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const addAssignment = (name: string) => {
    const clean = name.trim();
    if (!clean || assignments.some((a) => a.toLowerCase() === clean.toLowerCase())) return;
    setAssignments([...assignments, clean]);
    setNewAssignment('');
  };

  const removeAssignment = (name: string) => {
    setAssignments(assignments.filter((a) => a !== name));
    const { [name]: _removed, ...rest } = ratings;
    setRatings(rest);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const courseCode = course ? shortCourseCode(course.courseCode) : shortCourseCode(otherCode);
    const courseName = course ? (course.name !== course.courseCode ? course.name : courseCode) : otherName.trim();
    if (!courseCode) return showToast('Pick the class this project is for.', 'warning');
    if (!title.trim() || !description.trim()) return showToast('Add a project title and description.', 'warning');
    if (files.length === 0) return showToast('Upload your project files or folder.', 'warning');
    if (githubUrl.trim() && !GITHUB_URL.test(githubUrl.trim()))
      return showToast('The GitHub link should look like https://github.com/user/repo.', 'warning');

    const team: TeamMember[] = [
      {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: 'Project Lead',
        avatar: currentUser.avatar,
        identity: currentUser.identities[0] || 'Student',
        contributionDescription: myPart.trim() || undefined,
      },
      ...partners.map((p) => ({ ...p, contributionDescription: p.contributionDescription?.trim() || undefined })),
    ];
    const peerAssessments: PeerAssessment[] = assignments.flatMap((a) =>
      draftToAssessments(ratings[a] || {}, partners, a, currentUser)
    );
    const firstSentence = description.trim().split(/(?<=[.!?])\s/)[0];

    addProject(
      {
        title: title.trim(),
        summary: firstSentence.length > 160 ? `${firstSentence.slice(0, 157)}...` : firstSentence,
        description: description.trim(),
        whatItDoes: firstSentence,
        useCases: [],
        targetAudience: `${courseCode} students and instructors`,
        tags: [courseCode],
        codeAvailability: 'on_request',
        githubRepo: null,
        repositoryUrl: githubUrl.trim() || undefined,
        status: 'Active',
        openRoles: [],
        screenshots: [],
        isClassProject: true,
        courseCode,
        courseName: courseName || undefined,
        professorName: course && course.instructor.name !== 'Course Instructor' ? course.instructor.name : undefined,
        attachedFiles: files,
        teamMembers: team,
        projectAssignments: assignments,
        peerAssessments,
      },
      { campusHub: true }
    );
    onClose();
  };

  const assignmentSuggestions = canvasAssignmentNames.filter((n) => !assignments.includes(n)).slice(0, 8);
  const sectionTitle = 'flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700';
  const input = 'w-full text-sm px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Submit a class project</h2>
            <p className="text-xs text-slate-500">Shared with students and instructors at your campus</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Class */}
          <section className="space-y-2">
            <h3 className={sectionTitle}>
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              Class
            </h3>
            <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className={input}>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {shortCourseCode(c.courseCode)}
                  {c.name !== c.courseCode ? ` · ${c.name}` : ''}
                </option>
              ))}
              <option value={OTHER_CLASS}>Another class...</option>
            </select>
            {courseId === OTHER_CLASS && (
              <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2">
                <input value={otherCode} onChange={(e) => setOtherCode(e.target.value)} placeholder="CSE 3901" className={input} />
                <input value={otherName} onChange={(e) => setOtherName(e.target.value)} placeholder="Class name (optional)" className={input} />
              </div>
            )}
          </section>

          {/* Project */}
          <section className="space-y-2">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title" className={`${input} font-bold`} />
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you build, and how does it work?"
              className={input}
            />
          </section>

          {/* Partners */}
          <section className="space-y-2.5">
            <h3 className={sectionTitle}>
              <Users className="w-4 h-4 text-indigo-600" />
              Project partners
              <span className="normal-case tracking-normal font-medium text-slate-400">optional</span>
            </h3>
            <div className="p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-lg flex items-center gap-2.5">
              <img src={currentUser.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800">{currentUser.name} (you) · Project Lead</p>
                <input
                  value={myPart}
                  onChange={(e) => setMyPart(e.target.value)}
                  placeholder="What you worked on (optional)"
                  className="mt-1 w-full text-[11px] px-2 py-1 bg-white border border-slate-200 rounded-md"
                />
              </div>
            </div>
            {partners.map((p) => (
              <div key={p.id} className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-start gap-2.5">
                <img src={p.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {p.name} <span className="font-normal text-slate-400">{p.email}</span>
                  </p>
                  <input
                    value={p.contributionDescription || ''}
                    onChange={(e) => updatePartner(p.id, { contributionDescription: e.target.value })}
                    placeholder={`What ${p.name.split(' ')[0]} worked on (optional)`}
                    className="w-full text-[11px] px-2 py-1 bg-white border border-slate-200 rounded-md"
                  />
                </div>
                <button type="button" onClick={() => removePartner(p.id)} className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer" title="Remove partner">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={partnerQuery}
                onChange={(e) => setPartnerQuery(e.target.value)}
                placeholder="Search classmates by name or school email"
                className={`${input} pl-9`}
              />
            </div>
            {(partnerQuery || suggestions.length > 0) && (
              <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 bg-white">
                {suggestions.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => addPartner(c)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 cursor-pointer"
                  >
                    <img src={c.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                    <span className="flex-1 min-w-0">
                      <span className="block text-xs font-semibold text-slate-800 truncate">{c.name}</span>
                      <span className="block text-[10px] text-slate-500 truncate">{c.detail || c.email}</span>
                    </span>
                    {c.inClass && <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">In this class</span>}
                    <Plus className="w-4 h-4 text-indigo-600" />
                  </button>
                ))}
                {typedEmail && (
                  <button
                    type="button"
                    onClick={() => addPartnerByEmail(typedEmail)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-indigo-700 hover:bg-indigo-50 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add {typedEmail}
                  </button>
                )}
                {suggestions.length === 0 && !typedEmail && (
                  <p className="px-3 py-2 text-[11px] text-slate-500">No match. Type their full school email to add them.</p>
                )}
              </div>
            )}
          </section>

          {/* Files */}
          <section className="space-y-2">
            <h3 className={sectionTitle}>
              <Paperclip className="w-4 h-4 text-indigo-600" />
              Project files
              <span className="normal-case tracking-normal font-medium text-rose-500">required</span>
            </h3>
            <FileAttachmentInput
              files={files}
              onChange={setFiles}
              attributionOptions={
                partners.length > 0
                  ? [{ id: currentUser.id, name: currentUser.name, label: `${currentUser.name} (you)` }, ...partners.map((p) => ({ id: p.id, name: p.name }))]
                  : undefined
              }
              allowCanvasImport
              canvasCourseCode={course?.courseCode || otherCode}
            />
          </section>

          {/* GitHub */}
          <section className="space-y-2">
            <h3 className={sectionTitle}>
              <Github className="w-4 h-4 text-slate-800" />
              GitHub repository
              <span className="normal-case tracking-normal font-medium text-slate-400">optional</span>
            </h3>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/project"
              className={`${input} font-mono text-xs`}
            />
            <p className="text-[11px] text-slate-500">Only your partners and instructors see this link.</p>
          </section>

          {/* Assignments & peer assessment */}
          <section className="space-y-2.5">
            <h3 className={sectionTitle}>
              <ClipboardCheck className="w-4 h-4 text-indigo-600" />
              Assignments & peer assessment
              <span className="normal-case tracking-normal font-medium text-slate-400">optional</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Add the assignments this project covers, then rate each partner's work on each one. Ratings are visible only to
              your team and instructors. Partners can add their own ratings later from the project page.
            </p>
            {assignmentSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {assignmentSuggestions.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => addAssignment(n)}
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border border-red-200 bg-red-50 text-red-800 hover:bg-red-100 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    {n}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={newAssignment}
                onChange={(e) => setNewAssignment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAssignment(newAssignment);
                  }
                }}
                placeholder="Assignment name, e.g. Milestone 2"
                className={input}
              />
              <button
                type="button"
                onClick={() => addAssignment(newAssignment)}
                className="px-3 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 cursor-pointer"
              >
                Add
              </button>
            </div>
            {assignments.map((a) => (
              <div key={a} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900">{a}</span>
                  <button type="button" onClick={() => removeAssignment(a)} className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer" title="Remove assignment">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {partners.length > 0 ? (
                  <PeerAssessmentEditor
                    people={partners}
                    value={ratings[a] || {}}
                    onChange={(rows) => setRatings({ ...ratings, [a]: rows })}
                  />
                ) : (
                  <p className="text-[11px] text-slate-500 italic">Add project partners above to rate their work.</p>
                )}
              </div>
            ))}
          </section>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Submit project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
