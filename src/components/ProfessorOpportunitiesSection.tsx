import React, { useState } from 'react';
import { CheckCircle2, Clock, FlaskConical, Send, Users, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProjectAttachedFile, TeacherOpportunity } from '../types';
import { ResumePicker } from './ResumePicker';
import { formatDeadline } from './TeacherOpportunitiesView';

// Student side of teacher opportunities: open research, TA and other positions from teachers at their school
export const ProfessorOpportunitiesSection: React.FC = () => {
  const { currentUser, userCampus, teacherOpportunities, opportunityApplications } = useApp();
  const [applyTo, setApplyTo] = useState<TeacherOpportunity | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const open = teacherOpportunities.filter(
    (p) =>
      p.status === 'open' &&
      (!p.deadline || p.deadline >= today) &&
      (p.school || '').toLowerCase() === (userCampus?.name || '').toLowerCase()
  );
  const myApplication = (positionId: string) =>
    opportunityApplications.find((a) => a.positionId === positionId && a.applicant.id === currentUser.id);

  if (open.length === 0) return null;

  return (
    <section className="space-y-3">
      {applyTo && <OpportunityApplyModal position={applyTo} onClose={() => setApplyTo(null)} />}
      <div className="flex items-center gap-2">
        <FlaskConical className="w-4 h-4 text-indigo-600" />
        <h2 className="text-sm font-bold text-slate-900">From your professors</h2>
        <span className="text-[11px] font-bold px-1.5 rounded-full bg-indigo-50 text-indigo-700">{open.length}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {open.map((p) => {
          const app = myApplication(p.id);
          return (
            <div key={p.id} className="bg-white border border-indigo-200 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-600 text-white">{p.kind || 'Research'}</span>
                {p.relatedCourse && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800">{p.relatedCourse}</span>}
                {p.compensation && <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{p.compensation}</span>}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mt-0.5">{p.description}</p>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                {p.hoursPerWeek && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {p.hoursPerWeek}
                  </span>
                )}
                {p.openings && (
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-3 h-3" /> {p.openings} {p.openings === 1 ? 'opening' : 'openings'}
                  </span>
                )}
                {p.deadline && <span>Apply by {formatDeadline(p.deadline)}</span>}
              </div>
              <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <img src={p.teacherAvatar} alt="" referrerPolicy="no-referrer" className="w-7 h-7 rounded-full object-cover" />
                  <div className="min-w-0 text-xs">
                    <p className="font-semibold text-slate-800 truncate">{p.teacherName}</p>
                    {p.department && <p className="text-[11px] text-slate-500 truncate">{p.department}</p>}
                  </div>
                </div>
                {app ? (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold ${
                      app.status === 'accepted' ? 'text-emerald-700' : app.status === 'declined' ? 'text-slate-500' : 'text-indigo-700'
                    }`}
                  >
                    {app.status === 'accepted' && <CheckCircle2 className="w-4 h-4" />}
                    {app.status === 'accepted' ? 'Accepted' : app.status === 'declined' ? 'Not selected' : 'Applied'}
                  </span>
                ) : (
                  <button
                    onClick={() => setApplyTo(p)}
                    className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0 cursor-pointer"
                  >
                    Apply
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const OpportunityApplyModal: React.FC<{ position: TeacherOpportunity; onClose: () => void }> = ({ position, onClose }) => {
  const { currentUser, applyToTeacherOpportunity, setUserResume } = useApp();
  const [message, setMessage] = useState('');
  const [resume, setResume] = useState<ProjectAttachedFile | undefined>(currentUser.resume);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    applyToTeacherOpportunity(position.id, message.trim() || undefined, resume);
    if (resume && resume.id !== currentUser.resume?.id) setUserResume(resume);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <form onSubmit={submit} className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900">Apply: {position.title}</h3>
            <p className="text-[11px] text-slate-500">{position.teacherName}</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              Resume <span className="font-normal text-slate-400">(recommended)</span>
            </label>
            <ResumePicker value={resume} onChange={setResume} compact />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              Why you are interested <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="A few sentences about your interest and any related classes or experience"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer">
            Cancel
          </button>
          <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer">
            <Send className="w-3.5 h-3.5" />
            Submit application
          </button>
        </div>
      </form>
    </div>
  );
};
