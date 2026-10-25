import React, { useEffect, useMemo, useState } from 'react';
import { Send, X } from 'lucide-react';
import { Author } from '../types';
import { useApp } from '../context/AppContext';
import { shortCourseCode } from '../services/campusAccess';

interface ClassInviteModalProps {
  target: Author;
  courseHint?: string; // class to suggest first, e.g. the course of the post the invite came from
  onClose: () => void;
}

interface AssignmentOption {
  key: string;
  name: string;
  courseCode: string;
  dueAt?: string;
}

// Works for any subject, not only CS
const PART_SUGGESTIONS = ['Research', 'Writing', 'Data analysis', 'Lab work', 'Presentation', 'Design', 'Editing'];

// Campus invite: the assignment is the only required field; class, part and message are optional, no skills
export const ClassInviteModal: React.FC<ClassInviteModalProps> = ({ target, courseHint, onClose }) => {
  const { canvasConnection, campusClassAssignments, loadCanvasAssignments, sendInvitation, showToast } = useApp();

  const [assignment, setAssignment] = useState('');
  const [courseCode, setCourseCode] = useState(courseHint ? shortCourseCode(courseHint) : '');
  const [part, setPart] = useState('');
  const [note, setNote] = useState('');
  const [canvasOptions, setCanvasOptions] = useState<AssignmentOption[]>([]);

  const courses = canvasConnection.isConnected ? canvasConnection.courses : [];

  // Upcoming assignments from every connected Canvas class
  useEffect(() => {
    let cancelled = false;
    const now = Date.now();
    Promise.all(courses.map((c) => loadCanvasAssignments(c.id).catch(() => ({ assignments: [] }))))
      .then((results) => {
        if (cancelled) return;
        setCanvasOptions(
          results
            .flatMap((r) => r.assignments)
            .filter((a) => !a.dueAt || new Date(a.dueAt).getTime() >= now)
            .map((a) => ({ key: `canvas-${a.id}`, name: a.name, courseCode: shortCourseCode(a.courseCode), dueAt: a.dueAt }))
        );
      });
    return () => {
      cancelled = true;
    };
  }, [canvasConnection.schoolEmail, courses.length]);

  const options = useMemo(() => {
    const posted: AssignmentOption[] = campusClassAssignments.map((a) => ({
      key: `class-${a.id}`,
      name: a.title,
      courseCode: shortCourseCode(a.classCode),
      dueAt: a.dueDate,
    }));
    const seen = new Set<string>();
    const hint = courseHint ? shortCourseCode(courseHint).toLowerCase() : '';
    return [...canvasOptions, ...posted]
      .filter((o) => {
        const k = `${o.courseCode}|${o.name}`.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .sort((a, b) => {
        const ah = a.courseCode.toLowerCase() === hint ? 0 : 1;
        const bh = b.courseCode.toLowerCase() === hint ? 0 : 1;
        return ah - bh || (a.dueAt || '9999').localeCompare(b.dueAt || '9999');
      })
      .slice(0, 8);
  }, [canvasOptions, campusClassAssignments, courseHint]);

  const courseCodes = Array.from(
    new Set([...courses.map((c) => shortCourseCode(c.courseCode)), ...campusClassAssignments.map((a) => shortCourseCode(a.classCode))])
  );

  const firstName = target.name.split(' ')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = assignment.trim();
    if (!name) {
      showToast('Add the assignment you want to work on together.', 'warning');
      return;
    }
    const cls = courseCode.trim();
    sendInvitation(
      `assignment:${(cls ? `${cls}-` : '') + name}`.toLowerCase().replace(/\s+/g, '-'),
      cls ? `${cls}: ${name}` : name,
      target,
      part.trim() || 'Teammate',
      note.trim() || `Hi ${firstName}, want to team up on ${name}${cls ? ` for ${cls}` : ''}?`,
      { assignmentName: name, courseCode: cls || undefined }
    );
    onClose();
  };

  const formatDue = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left"
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3 min-w-0">
            <img src={target.avatar} alt="" referrerPolicy="no-referrer" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 truncate">Invite {target.name} to team up</h3>
              <p className="text-[11px] text-slate-500 truncate">{[target.major, target.school].filter(Boolean).join(' · ')}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 rounded-lg p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 block">
              Assignment <span className="text-red-500">*</span>
            </label>
            <input
              value={assignment}
              onChange={(e) => setAssignment(e.target.value)}
              placeholder="e.g. Lab 5 report, Group presentation, Final project"
              autoFocus
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {options.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {options.map((o) => {
                  const active = assignment === o.name && courseCode === o.courseCode;
                  return (
                    <button
                      key={o.key}
                      type="button"
                      onClick={() => {
                        setAssignment(o.name);
                        setCourseCode(o.courseCode);
                      }}
                      className={`text-[11px] px-2 py-1 rounded-lg border cursor-pointer text-left ${
                        active
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <span className="font-semibold">{o.courseCode}</span> · {o.name}
                      {o.dueAt && <span className={active ? 'text-emerald-100' : 'text-slate-400'}> · due {formatDue(o.dueAt)}</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              Class <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              list="class-invite-courses"
              placeholder="e.g. ENGR 1181"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <datalist id="class-invite-courses">
              {courseCodes.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              What they could work on <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              value={part}
              onChange={(e) => setPart(e.target.value)}
              placeholder="Anything, or leave blank"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex flex-wrap gap-1.5">
              {PART_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPart(part === s ? '' : s)}
                  className={`text-[11px] px-2 py-0.5 rounded-full border cursor-pointer ${
                    part === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              Message <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder={`Hi ${firstName}, want to team up on ${assignment.trim() || 'this assignment'}?`}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!assignment.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            Send invite
          </button>
        </div>
      </form>
    </div>
  );
};

