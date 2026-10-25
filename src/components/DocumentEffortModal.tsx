import React, { useMemo, useState } from 'react';
import { X, FileText, Clock, Gauge, MessageSquare, Star, Info, CalendarClock } from 'lucide-react';
import { Project } from '../types';
import { analyzeDocumentEffort, EFFORT_METHOD_NOTE, formatMinutes } from '../services/documentEffortService';

// One color per member, used in every chart on this screen
const MEMBER_COLORS = ['#4f46e5', '#059669', '#d97706', '#e11d48', '#0891b2', '#7c3aed'];

const ACTIVITY_LABELS = { writing: 'Writing', revising: 'Revising', reviewing: 'Reviewing', data: 'Data & plots' } as const;

const pct = (x: number) => `${Math.round(x * 100)}%`;

const DifficultyDots: React.FC<{ value: number }> = ({ value }) => (
  <span className="inline-flex gap-0.5" aria-label={`Difficulty ${value} of 5`} title={`Difficulty ${value} of 5`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} className={`w-1.5 h-1.5 rounded-full ${n <= value ? 'bg-rose-500' : 'bg-slate-200'}`} />
    ))}
  </span>
);

// Analysis of each group member's work in the shared Google Doc: time spent,
// how difficult the sections they worked on were, and when they worked
export const DocumentEffortModal: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => {
  const doc = project.sharedDocument!;
  const report = useMemo(() => analyzeDocumentEffort(doc, project.teamMembers), [doc, project.teamMembers]);
  const [showMethod, setShowMethod] = useState(false);

  const colorOf = (memberId: string) =>
    MEMBER_COLORS[Math.max(0, project.teamMembers.findIndex((m) => m.id === memberId)) % MEMBER_COLORS.length];
  const nameOf = (memberId: string) => project.teamMembers.find((m) => m.id === memberId)?.name.split(' ')[0] || 'Unknown';

  const peerAverage = (memberId: string) => {
    const received = (project.peerAssessments || []).filter(
      (a) => a.revieweeId === memberId && a.assignmentName.toLowerCase() === doc.assignmentName.toLowerCase()
    );
    return received.length ? { avg: received.reduce((n, a) => n + a.rating, 0) / received.length, count: received.length } : null;
  };

  const due = new Date(doc.dueAt);
  const days = Array.from(
    doc.sessions
      .slice()
      .sort((a, b) => a.start.localeCompare(b.start))
      .reduce((map, s) => {
        const day = new Date(s.start).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        map.set(day, [...(map.get(day) || []), s]);
        return map;
      }, new Map<string, typeof doc.sessions>())
  );
  const dueDay = due.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

  const balanceStyle =
    report.balance === 'Balanced'
      ? 'bg-emerald-100 text-emerald-800'
      : report.balance === 'Somewhat uneven'
      ? 'bg-amber-100 text-amber-800'
      : 'bg-rose-100 text-rose-800';

  const shareBars: { label: string; key: 'effortShare' | 'timeShare' | 'wordShare'; hint: string }[] = [
    { label: 'Effort', key: 'effortShare', hint: 'Time weighted by section difficulty' },
    { label: 'Time', key: 'timeShare', hint: 'Active editing time' },
    { label: 'Words', key: 'wordShare', hint: 'Net words in the final document' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden border border-slate-200 flex flex-col my-4">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-start justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-sky-300">
              <FileText className="w-3.5 h-3.5" />
              Google Doc contribution analysis
            </p>
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight truncate">{doc.title}</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {project.courseCode} · {doc.assignmentName} · due{' '}
              {due.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })} ·{' '}
              {doc.finalWordCount.toLocaleString()} words
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer shrink-0" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Team summary */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${balanceStyle}`}>{report.balance} workload</span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatMinutes(report.totalMinutes)} total editing
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {doc.sessions.length} sessions · {doc.sections.length} sections
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{report.teamSummary}</p>

            {/* Share bars */}
            <div className="space-y-2 pt-1">
              {shareBars.map((bar) => (
                <div key={bar.key} className="grid grid-cols-[64px_1fr] items-center gap-3">
                  <span className="text-xs font-bold text-slate-700" title={bar.hint}>
                    {bar.label}
                  </span>
                  <div className="flex h-6 rounded-md overflow-hidden gap-0.5 bg-slate-100">
                    {report.members.map((m) => (
                      <div
                        key={m.member.id}
                        style={{ width: `${m[bar.key] * 100}%`, background: colorOf(m.member.id) }}
                        className="h-full flex items-center justify-center text-[10px] font-bold text-white overflow-hidden whitespace-nowrap"
                        title={`${m.member.name}: ${pct(m[bar.key])} of ${bar.hint.toLowerCase()}`}
                      >
                        {m[bar.key] >= 0.08 ? pct(m[bar.key]) : ''}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-x-4 gap-y-1 pl-[76px]">
                {report.members.map((m) => (
                  <span key={m.member.id} className="inline-flex items-center gap-1.5 text-[11px] text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: colorOf(m.member.id) }} />
                    {m.member.name}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Member cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.members.map((m) => {
              const peer = peerAverage(m.member.id);
              return (
                <div key={m.member.id} className="border border-slate-200 rounded-xl p-4 space-y-3" style={{ borderTop: `4px solid ${colorOf(m.member.id)}` }}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={m.member.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{m.member.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{m.member.role}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-black tabular-nums" style={{ color: colorOf(m.member.id) }}>
                        {pct(m.effortShare)}
                      </p>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">of effort</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-slate-50 rounded-lg py-1.5">
                      <p className="text-xs font-bold text-slate-900 tabular-nums">{formatMinutes(m.minutes)}</p>
                      <p className="text-[10px] text-slate-500">time</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg py-1.5">
                      <p className="text-xs font-bold text-slate-900 tabular-nums inline-flex items-center gap-1">
                        <Gauge className="w-3 h-3 text-rose-500" />
                        {m.avgDifficulty.toFixed(1)}
                      </p>
                      <p className="text-[10px] text-slate-500">avg difficulty</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg py-1.5">
                      <p className="text-xs font-bold text-slate-900 tabular-nums">{Math.max(0, m.netWords).toLocaleString()}</p>
                      <p className="text-[10px] text-slate-500">net words</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg py-1.5">
                      <p className="text-xs font-bold text-slate-900 tabular-nums inline-flex items-center gap-1">
                        {peer ? (
                          <>
                            <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                            {peer.avg.toFixed(1)}
                          </>
                        ) : (
                          '–'
                        )}
                      </p>
                      <p className="text-[10px] text-slate-500">{peer ? `peer (${peer.count})` : 'no peer rating'}</p>
                    </div>
                  </div>

                  {/* Where their time went */}
                  <div className="space-y-1">
                    {m.sectionBreakdown.map((s) => (
                      <div key={s.section.id} className="grid grid-cols-[1fr_auto] items-center gap-2 text-[11px]">
                        <div className="min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-slate-700">{s.section.title}</span>
                            <DifficultyDots value={s.section.difficulty} />
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-0.5">
                            <div className="h-full rounded-full" style={{ width: `${(s.minutes / m.minutes) * 100}%`, background: colorOf(m.member.id) }} />
                          </div>
                        </div>
                        <span className="text-slate-500 tabular-nums w-12 text-right">{formatMinutes(s.minutes)}</span>
                      </div>
                    ))}
                  </div>

                  <ul className="space-y-1 text-xs text-slate-700 list-disc pl-4">
                    {m.insights.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </section>

          {/* Sections */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">Who worked on each section</h3>
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
              {doc.sections.map((section) => {
                const sessions = doc.sessions.filter((s) => s.sectionId === section.id);
                const total = sessions.reduce((n, s) => n + s.minutes, 0);
                const byMember = report.members
                  .map((m) => ({ id: m.member.id, minutes: sessions.filter((s) => s.memberId === m.member.id).reduce((n, s) => n + s.minutes, 0) }))
                  .filter((x) => x.minutes > 0);
                return (
                  <div key={section.id} className="grid grid-cols-1 sm:grid-cols-[220px_1fr_56px] items-center gap-2 sm:gap-3 px-3 py-2.5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{section.title}</span>
                        <DifficultyDots value={section.difficulty} />
                      </div>
                      <p className="text-[10px] text-slate-500 truncate" title={section.difficultyReason}>
                        {section.difficultyReason}
                      </p>
                    </div>
                    <div className="flex h-4 rounded overflow-hidden gap-px bg-slate-100">
                      {byMember.map((x) => (
                        <div
                          key={x.id}
                          style={{ width: `${(x.minutes / total) * 100}%`, background: colorOf(x.id) }}
                          title={`${nameOf(x.id)}: ${formatMinutes(x.minutes)}`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-500 tabular-nums sm:text-right">{formatMinutes(total)}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Timeline */}
          <section className="space-y-2">
            <h3 className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
              <CalendarClock className="w-4 h-4 text-slate-500" />
              Editing timeline
            </h3>
            <div className="space-y-3">
              {days.map(([day, sessions]) => (
                <div key={day} className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-1 sm:gap-3">
                  <p className={`text-xs font-bold ${day === dueDay ? 'text-rose-600' : 'text-slate-600'}`}>
                    {day}
                    {day === dueDay && <span className="block text-[10px] font-semibold">Due tonight</span>}
                  </p>
                  <div className="space-y-1">
                    {sessions.map((s) => {
                      const section = doc.sections.find((x) => x.id === s.sectionId);
                      return (
                        <div key={s.id} className="flex items-start gap-2 text-[11px] p-2 rounded-lg bg-slate-50 border-l-4" style={{ borderLeftColor: colorOf(s.memberId) }}>
                          <span className="text-slate-500 tabular-nums w-14 shrink-0">
                            {new Date(s.start).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="font-bold text-slate-800">{nameOf(s.memberId)}</span>
                            <span className="text-slate-500">
                              {' '}
                              · {section?.title} · {ACTIVITY_LABELS[s.activity]} · {formatMinutes(s.minutes)} · +{s.wordsAdded}/−{s.wordsDeleted} words
                            </span>
                            {s.comments > 0 && (
                              <span className="inline-flex items-center gap-0.5 text-slate-500">
                                {' '}
                                · <MessageSquare className="w-3 h-3" /> {s.comments}
                              </span>
                            )}
                            <span className="block text-slate-700">{s.note}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Method */}
          <section className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3">
            <button type="button" onClick={() => setShowMethod(!showMethod)} className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
              <Info className="w-3.5 h-3.5" />
              How effort is calculated
            </button>
            {showMethod && <p className="mt-2 leading-relaxed">{EFFORT_METHOD_NOTE}</p>}
          </section>
        </div>
      </div>
    </div>
  );
};
