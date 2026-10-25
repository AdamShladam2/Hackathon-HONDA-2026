import React, { useMemo, useState } from 'react';
import { BarChart3, ChevronDown, ChevronUp, FileText, GraduationCap, Info, Loader2, Play, ScanSearch, Sparkles, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Project, StudentSubmission } from '../types';
import { courseKey } from '../services/campusAccess';
import { useTeacherCourses } from '../hooks/useTeacherCourses';
import {
  INTEGRITY_METHOD_NOTE,
  IntegrityCheck,
  RiskLevel,
  builtInSummary,
  checkPost,
  checkSubmission,
  summaryPayload,
} from '../services/integrityCheckService';
import { DocumentEffortModal } from './DocumentEffortModal';

const ALL_COURSES = 'all';

const LEVEL_STYLES: Record<RiskLevel, { chip: string; bar: string }> = {
  High: { chip: 'bg-rose-100 text-rose-800 border-rose-200', bar: 'bg-rose-500' },
  Medium: { chip: 'bg-amber-100 text-amber-800 border-amber-200', bar: 'bg-amber-500' },
  Low: { chip: 'bg-emerald-100 text-emerald-800 border-emerald-200', bar: 'bg-emerald-500' },
};

type Item = { kind: 'post'; id: string; course: string; post: Project } | { kind: 'submission'; id: string; course: string; sub: StudentSubmission };

// Results survive switching tabs for the rest of the session
const checkCache = new Map<string, IntegrityCheck>();

// Teacher view: AI-assisted check of how likely work in their own courses needs an integrity review
export const TeacherIntegrityCheckView: React.FC = () => {
  const { currentUser, studentSubmissions, comparisonSources } = useApp();
  const { taught, taughtKeys, coursePosts } = useTeacherCourses();

  const [course, setCourse] = useState<string>(ALL_COURSES);
  const [checks, setChecks] = useState<Record<string, IntegrityCheck>>(() => Object.fromEntries(checkCache));
  const [summarizing, setSummarizing] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showMethod, setShowMethod] = useState(false);
  const [docProject, setDocProject] = useState<Project | null>(null);

  const items: Item[] = useMemo(
    () => [
      ...coursePosts.map((post) => ({ kind: 'post' as const, id: post.id, course: post.courseCode || post.classCode || '', post })),
      ...studentSubmissions
        .filter((sub) => taughtKeys.has(courseKey(sub.classCode)))
        .map((sub) => ({ kind: 'submission' as const, id: sub.id, course: sub.classCode, sub })),
    ],
    [coursePosts, studentSubmissions, taughtKeys]
  );

  const visible = items
    .filter((it) => course === ALL_COURSES || courseKey(it.course) === courseKey(course))
    .sort((a, b) => (checks[b.id]?.score ?? -1) - (checks[a.id]?.score ?? -1));

  const save = (check: IntegrityCheck) => {
    checkCache.set(check.id, check);
    setChecks((prev) => ({ ...prev, [check.id]: check }));
  };

  // Signals are computed here; Claude (when the server has a key) only rewrites the summary
  const runCheck = async (it: Item) => {
    const base = it.kind === 'post' ? checkPost(it.post) : checkSubmission(it.sub, comparisonSources);
    const check: IntegrityCheck = { ...base, summary: builtInSummary(base), summarySource: 'built-in', checkedAt: new Date().toISOString() };
    save(check);
    if (check.level !== 'Low') setExpanded((prev) => new Set(prev).add(check.id));

    setSummarizing((prev) => new Set(prev).add(check.id));
    try {
      const res = await fetch('/api/integrity-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(summaryPayload(base)),
      });
      if (res.ok) {
        const { summary } = (await res.json()) as { summary: string };
        save({ ...check, summary, summarySource: 'claude' });
      }
    } catch {
      // Keep the built-in summary
    } finally {
      setSummarizing((prev) => {
        const next = new Set(prev);
        next.delete(check.id);
        return next;
      });
    }
  };

  const runAll = () => visible.forEach((it) => runCheck(it));

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const checkedVisible = visible.filter((it) => checks[it.id]);
  const counts = (['High', 'Medium', 'Low'] as RiskLevel[]).map((l) => [l, checkedVisible.filter((it) => checks[it.id].level === l).length] as const);

  return (
    <div className="space-y-6">
      {docProject && <DocumentEffortModal project={docProject} onClose={() => setDocProject(null)} />}

      <div className="bg-indigo-950 text-white rounded-2xl p-6 sm:p-8">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-2">
          <GraduationCap className="w-4 h-4" />
          Integrity Check · {currentUser.name}
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Cheating likelihood in your classes</h1>
        <p className="text-sm text-indigo-200 mt-2 max-w-2xl">
          Scores each student’s work from 0 to 100 using the group Google Doc history, peer ratings and text overlap, then has Claude
          summarize what stands out. It only covers courses you teach, and a score is a reason to look closer, not proof.
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-5">
          <button
            onClick={runAll}
            disabled={visible.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-indigo-950 text-sm font-bold hover:bg-indigo-50 disabled:opacity-50"
          >
            <ScanSearch className="w-4 h-4" />
            Check all {visible.length}
          </button>
          {checkedVisible.length > 0 &&
            counts.map(([l, n]) => (
              <span key={l} className={`text-xs font-bold px-2.5 py-1 rounded-full border ${LEVEL_STYLES[l].chip}`}>
                {n} {l}
              </span>
            ))}
        </div>
      </div>

      {/* Course chips */}
      <div className="flex flex-wrap gap-2">
        {[{ code: ALL_COURSES, name: 'All courses' }, ...taught].map((t) => (
          <button
            key={t.code}
            onClick={() => setCourse(t.code)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
              course === t.code ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
            }`}
          >
            {t.code === ALL_COURSES ? t.name : t.code}
          </button>
        ))}
      </div>

      {/* How it works */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <button onClick={() => setShowMethod((v) => !v)} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Info className="w-4 h-4 text-indigo-500" />
          How the score works
          {showMethod ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showMethod && <p className="text-xs text-slate-600 mt-2 leading-relaxed">{INTEGRITY_METHOD_NOTE}</p>}
      </div>

      {visible.length === 0 && (
        <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-2xl text-slate-500 text-sm">
          No posts or submissions in {course === ALL_COURSES ? 'your courses' : course} yet.
        </div>
      )}

      <div className="space-y-3">
        {visible.map((it) => {
          const check = checks[it.id];
          const title = it.kind === 'post' ? it.post.title : `${it.sub.studentName} — ${it.sub.assignmentTitle}`;
          const people = it.kind === 'post' ? it.post.teamMembers.map((m) => m.name.split(' ')[0]).join(', ') : it.sub.studentName;
          const isOpen = check && expanded.has(it.id);
          return (
            <div key={it.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 flex flex-wrap items-center gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500 mb-1">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">{it.course}</span>
                    <span className="inline-flex items-center gap-1">
                      {it.kind === 'post' ? <Users className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                      {it.kind === 'post' ? 'Group post' : 'Submission'}
                    </span>
                    {it.kind === 'post' && it.post.sharedDocument && <span className="text-sky-700">Google Doc history</span>}
                  </div>
                  <h3 className="font-bold text-slate-900 truncate">{title}</h3>
                  <p className="text-xs text-slate-500 truncate">{people}</p>
                </div>

                {check && (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-black text-slate-900 leading-none">{check.score}</div>
                      <div className="text-[10px] text-slate-500">/ 100</div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${LEVEL_STYLES[check.level].chip}`}>{check.level}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => runCheck(it)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    <Play className="w-3.5 h-3.5" />
                    {check ? 'Re-check' : 'Check'}
                  </button>
                  {check && (
                    <button
                      onClick={() => toggle(it.id)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      {isOpen ? 'Hide' : 'Details'}
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-slate-100 bg-slate-50/60 p-4 sm:p-5 space-y-4">
                  {/* Summary */}
                  <div className="bg-white border border-indigo-100 rounded-xl p-4">
                    <p className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {check.summarySource === 'claude' ? 'Claude summary' : 'Summary'}
                      {summarizing.has(it.id) && (
                        <span className="inline-flex items-center gap-1 font-medium text-slate-500">
                          <Loader2 className="w-3 h-3 animate-spin" /> asking Claude…
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{check.summary}</p>
                    <p className="text-[11px] text-slate-400 mt-2">Checked: {check.sources.join(' · ')}</p>
                  </div>

                  {/* Students */}
                  <div className="space-y-3">
                    {check.students.map((s) => (
                      <div key={s.name} className="bg-white border border-slate-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          {s.avatar ? (
                            <img src={s.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-slate-200" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm text-slate-900">{s.name}</p>
                            {s.role && <p className="text-xs text-slate-500">{s.role}</p>}
                          </div>
                          <div className="w-28 hidden sm:block">
                            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div className={`h-full ${LEVEL_STYLES[s.level].bar}`} style={{ width: `${Math.max(3, s.score)}%` }} />
                            </div>
                          </div>
                          <span className="text-sm font-bold text-slate-800 w-8 text-right">{s.score}</span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${LEVEL_STYLES[s.level].chip}`}>{s.level}</span>
                        </div>
                        {s.signals.length > 0 ? (
                          <ul className="mt-3 space-y-2">
                            {s.signals.map((x) => (
                              <li key={x.id} className="text-xs text-slate-600 flex gap-2">
                                <span className="font-bold text-slate-400 w-8 shrink-0">+{x.points}</span>
                                <span>
                                  <span className="font-semibold text-slate-800">{x.label}.</span> {x.detail}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-2 text-xs text-slate-500">No signals.</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {it.kind === 'post' && it.post.sharedDocument && (
                    <button
                      onClick={() => setDocProject(it.post)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      Open Google Doc effort
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
