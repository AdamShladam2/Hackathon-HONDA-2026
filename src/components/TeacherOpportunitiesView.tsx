import React, { useState } from 'react';
import { Check, Clock, FileText, FlaskConical, Mail, Plus, Users, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OpportunityKind, TeacherOpportunity } from '../types';
import { openAttachedFile } from '../services/fileStore';
import { useTeacherCourses } from '../hooks/useTeacherCourses';

const COMPENSATION: NonNullable<TeacherOpportunity['compensation']>[] = ['Paid', 'Course credit', 'Volunteer'];
export const OPPORTUNITY_KINDS: OpportunityKind[] = ['Research', 'Teaching assistant', 'Grader', 'Lab assistant', 'Tutor', 'Other'];

export const formatDeadline = (d?: string) =>
  d ? new Date(`${d}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';

// Teacher view: post opportunities (research, TA, grader, ...) for students and review who applied
export const TeacherOpportunitiesView: React.FC = () => {
  const {
    currentUser,
    teacherOpportunities,
    opportunityApplications,
    addTeacherOpportunity,
    setTeacherOpportunityStatus,
    setOpportunityApplicationStatus,
    showToast,
  } = useApp();
  const { taught } = useTeacherCourses();

  const mine = teacherOpportunities.filter((p) => p.teacherId === currentUser.id);
  const [formOpen, setFormOpen] = useState(mine.length === 0);
  const [kind, setKind] = useState<OpportunityKind>('Research');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('');
  const [compensation, setCompensation] = useState<TeacherOpportunity['compensation']>();
  const [relatedCourse, setRelatedCourse] = useState('');
  const [openings, setOpenings] = useState('');
  const [deadline, setDeadline] = useState('');

  const resetForm = () => {
    setKind('Research');
    setTitle('');
    setDescription('');
    setHoursPerWeek('');
    setCompensation(undefined);
    setRelatedCourse('');
    setOpenings('');
    setDeadline('');
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Add a title and a short description.', 'warning');
      return;
    }
    addTeacherOpportunity({
      kind,
      title: title.trim(),
      description: description.trim(),
      hoursPerWeek: hoursPerWeek.trim() || undefined,
      compensation,
      relatedCourse: relatedCourse || undefined,
      openings: Number(openings) > 0 ? Number(openings) : undefined,
      deadline: deadline || undefined,
    });
    resetForm();
    setFormOpen(false);
  };

  const viewResume = async (file: NonNullable<(typeof opportunityApplications)[number]['resume']>) => {
    if (!(await openAttachedFile(file))) showToast('This resume is not stored in this browser.', 'warning');
  };

  const input = 'w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500';
  const optional = <span className="font-normal text-slate-400">(optional)</span>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Opportunities</h1>
          <p className="text-sm text-slate-500 mt-1">
            Offer research, TA, grader and other positions. Students at your school see open ones on their Opportunities page and can apply with a resume.
          </p>
        </div>
        {!formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New opportunity
          </button>
        )}
      </div>

      {formOpen && (
        <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                Type <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {OPPORTUNITY_KINDS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKind(k)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                      kind === k ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                Title <span className="text-red-500">*</span>
              </label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={kind === 'Research' ? 'e.g. Undergraduate Research Assistant' : `e.g. ENGR 1181 ${kind}`} className={input} />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                What students would do <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="The project, the tasks, and anything students should already know"
                className={`${input} resize-none`}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">Hours per week {optional}</label>
              <input value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} placeholder="e.g. 6-8 hrs/week" className={input} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">Compensation {optional}</label>
              <div className="flex flex-wrap gap-1.5">
                {COMPENSATION.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCompensation(compensation === c ? undefined : c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                      compensation === c ? 'bg-indigo-900 text-white border-indigo-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">Related course {optional}</label>
              <select value={relatedCourse} onChange={(e) => setRelatedCourse(e.target.value)} className={input}>
                <option value="">None</option>
                {taught.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.code}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Openings {optional}</label>
                <input type="number" min={1} value={openings} onChange={(e) => setOpenings(e.target.value)} className={input} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Apply by {optional}</label>
                <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={input} />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            {mine.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setFormOpen(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!title.trim() || !description.trim()}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg cursor-pointer"
            >
              Post opportunity
            </button>
          </div>
        </form>
      )}

      {mine.length === 0 && !formOpen && (
        <div className="p-10 text-center bg-white border border-dashed border-slate-300 rounded-2xl text-sm text-slate-500">
          You have not posted any opportunities yet.
        </div>
      )}

      {mine.map((pos) => {
        const apps = opportunityApplications.filter((a) => a.positionId === pos.id);
        const accepted = apps.filter((a) => a.status === 'accepted').length;
        return (
          <div key={pos.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-5 space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        pos.status === 'open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {pos.status === 'open' ? 'Open' : 'Closed'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-600 text-white">{pos.kind || 'Research'}</span>
                    {pos.relatedCourse && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800">{pos.relatedCourse}</span>}
                    {pos.compensation && <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{pos.compensation}</span>}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-indigo-600 shrink-0" />
                    {pos.title}
                  </h3>
                </div>
                <button
                  onClick={() => setTeacherOpportunityStatus(pos.id, pos.status === 'open' ? 'closed' : 'open')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  {pos.status === 'open' ? 'Close applications' : 'Reopen'}
                </button>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{pos.description}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                {pos.hoursPerWeek && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {pos.hoursPerWeek}
                  </span>
                )}
                {pos.openings && (
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-3 h-3" /> {accepted} of {pos.openings} filled
                  </span>
                )}
                {pos.deadline && <span>Apply by {formatDeadline(pos.deadline)}</span>}
              </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 space-y-3">
              <p className="text-xs font-bold text-slate-700">
                Applicants ({apps.length})
              </p>
              {apps.length === 0 ? (
                <p className="text-xs text-slate-400">No applications yet.</p>
              ) : (
                apps.map((a) => (
                  <div key={a.id} className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-start gap-3">
                    <img src={a.applicant.avatar} alt="" referrerPolicy="no-referrer" className="w-9 h-9 rounded-full object-cover shrink-0" />
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-sm font-bold text-slate-900">
                        {a.applicant.name}{' '}
                        <span className="text-[11px] font-normal text-slate-500">
                          {[a.applicant.major, a.applicant.graduationYear && `Class of ${a.applicant.graduationYear}`].filter(Boolean).join(' · ')}
                        </span>
                      </p>
                      {a.message && <p className="text-xs text-slate-600 leading-relaxed">&quot;{a.message}&quot;</p>}
                      <div className="flex flex-wrap items-center gap-3 text-[11px]">
                        {a.resume ? (
                          <button onClick={() => viewResume(a.resume!)} className="inline-flex items-center gap-1 font-semibold text-indigo-700 hover:underline cursor-pointer">
                            <FileText className="w-3 h-3" /> View resume
                          </button>
                        ) : (
                          <span className="text-slate-400">No resume</span>
                        )}
                        {a.applicant.email && (
                          <a href={`mailto:${a.applicant.email}`} className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-indigo-700">
                            <Mail className="w-3 h-3" /> {a.applicant.email}
                          </a>
                        )}
                        <span className="text-slate-400">Applied {new Date(a.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {a.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => setOpportunityApplicationStatus(a.id, 'declined')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" /> Decline
                          </button>
                          <button
                            onClick={() => setOpportunityApplicationStatus(a.id, 'accepted')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" /> Accept
                          </button>
                        </>
                      ) : (
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                            a.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {a.status === 'accepted' ? 'Accepted' : 'Declined'}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
