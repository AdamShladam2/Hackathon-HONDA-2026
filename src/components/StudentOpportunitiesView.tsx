import React, { useMemo, useState } from 'react';
import { Briefcase, Building2, CheckCircle2, Clock, GraduationCap, MapPin, Search, Sparkles, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResumePicker } from './ResumePicker';
import { ProfessorOpportunitiesSection } from './ProfessorOpportunitiesSection';

// Campus copy of Work Hub's "Student Cross-Hub Opportunities": professional projects
// whose owners marked them open to students, with compatibility and a direct apply button
export const StudentOpportunitiesView: React.FC = () => {
  const { currentUser, workProjects, applications, openApplyModal, setSelectedProject, getCompatibility, userCampus, setUserResume } =
    useApp();

  const [query, setQuery] = useState('');
  const [industry, setIndustry] = useState('all');

  const openings = useMemo(
    () =>
      workProjects
        .filter((p) => p.openToStudents && p.author.id !== currentUser.id)
        .map((p) => ({ project: p, compatibility: getCompatibility(p) }))
        .sort((a, b) => b.compatibility.overallScore - a.compatibility.overallScore),
    [workProjects, currentUser.id]
  );

  const industries = Array.from(new Set(openings.map((o) => o.project.industry).filter(Boolean))) as string[];
  const q = query.trim().toLowerCase();
  const visible = openings.filter(({ project: p }) => {
    if (industry !== 'all' && p.industry !== industry) return false;
    if (!q) return true;
    return [p.title, p.summary, p.industry, p.author.organization, ...(p.openRoles || []), ...(p.skillsRequired || p.tags || [])]
      .filter(Boolean)
      .some((t) => (t as string).toLowerCase().includes(q));
  });

  const appliedTo = (projectId: string) =>
    applications.find((a) => a.projectId === projectId && a.applicant.id === currentUser.id);
  const isTeamMember = (projectId: string) =>
    workProjects.find((p) => p.id === projectId)?.teamMembers.some((m) => m.id === currentUser.id);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
          <GraduationCap className="w-4 h-4" />
          Student Cross-Hub Opportunities
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Work on real projects with professionals.</h1>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl">
          These Work Hub projects are open to {userCampus ? `${userCampus.name} ` : ''}students. Apply for a role to get
          hands-on experience and code reviews alongside your classes.
        </p>
        <p className="text-xs text-slate-400 mt-3">
          {openings.length} open {openings.length === 1 ? 'project' : 'projects'} · ranked by how well they match your skills
        </p>
      </div>

      {/* Saved resume, attached to applications by default */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="sm:w-56 shrink-0">
          <p className="text-sm font-bold text-slate-900">Your resume</p>
          <p className="text-[11px] text-slate-500">
            {currentUser.resume ? 'Attached to your applications. You can change it per application.' : 'Add one so project owners can see your experience.'}
          </p>
        </div>
        <div className="flex-1 min-w-0">
          <ResumePicker value={currentUser.resume} onChange={setUserResume} compact />
        </div>
      </div>

      <ProfessorOpportunitiesSection />

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by role, skill, company or topic"
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
        >
          <option value="all">All industries</option>
          {industries.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <div className="p-10 text-center bg-white border border-dashed border-slate-300 rounded-2xl text-sm text-slate-500">
          No student openings match these filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {visible.map(({ project: p, compatibility }) => {
            const application = appliedTo(p.id);
            const joined = isTeamMember(p.id);
            return (
              <div
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex flex-col gap-3"
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200"
                    title={compatibility.explanation}
                  >
                    <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                    {compatibility.overallScore}% match
                  </span>
                  {p.industry && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{p.industry}</span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{p.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mt-0.5">{p.summary}</p>
                </div>

                {p.openRoles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {p.openRoles.map((r) => (
                      <span key={r} className="text-[11px] font-medium px-2 py-0.5 rounded border border-emerald-200 bg-emerald-50/50 text-emerald-900">
                        {r}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                  {p.estimatedDuration && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {p.estimatedDuration}
                    </span>
                  )}
                  {p.collaborationType && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {p.collaborationType}
                    </span>
                  )}
                  {p.experienceLevel && (
                    <span className="inline-flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {p.experienceLevel} level
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Team of {p.teamMembers.length}
                    {p.targetTeamSize ? ` / ${p.targetTeamSize}` : ''}
                  </span>
                </div>

                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={p.author.avatar} alt="" referrerPolicy="no-referrer" className="w-7 h-7 rounded-full object-cover" />
                    <div className="min-w-0 text-xs">
                      <p className="font-semibold text-slate-800 truncate">{p.author.name}</p>
                      {p.author.organization && (
                        <p className="text-[11px] text-slate-500 truncate inline-flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {p.author.organization}
                        </p>
                      )}
                    </div>
                  </div>
                  {joined ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" /> On the team
                    </span>
                  ) : application ? (
                    <span className="text-xs font-bold text-slate-500 capitalize">Application {application.status}</span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openApplyModal(p);
                      }}
                      className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 cursor-pointer"
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
