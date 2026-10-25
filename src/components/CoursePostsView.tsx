import React, { useState } from 'react';
import { BarChart3, BookOpen, Clock, GraduationCap, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import { courseKey } from '../services/campusAccess';
import { useTeacherCourses } from '../hooks/useTeacherCourses';
import { ProjectCard } from './ProjectCard';
import { DocumentEffortModal } from './DocumentEffortModal';

const ALL_COURSES = 'all';

// Teacher view: posts made in the courses they teach, each with contribution analysis
export const CoursePostsView: React.FC = () => {
  const { currentUser, userCampus, setSelectedProject, openContributionAnalysisModal } = useApp();
  const { taught, coursePosts, postKey } = useTeacherCourses();

  const [course, setCourse] = useState<string>(ALL_COURSES);
  const [query, setQuery] = useState('');
  const [docProject, setDocProject] = useState<Project | null>(null);

  const countFor = (code: string) => coursePosts.filter((p) => postKey(p) === courseKey(code)).length;

  const q = query.trim().toLowerCase();
  const visible = coursePosts.filter((p) => {
    if (course !== ALL_COURSES && postKey(p) !== courseKey(course)) return false;
    if (!q) return true;
    return [p.title, p.summary, p.description, p.author.name, ...(p.teamMembers || []).map((m) => m.name)]
      .filter(Boolean)
      .some((t) => (t as string).toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6">
      {docProject && <DocumentEffortModal project={docProject} onClose={() => setDocProject(null)} />}

      <div className="bg-indigo-950 text-white rounded-2xl p-6 sm:p-8">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-2">
          <GraduationCap className="w-4 h-4" />
          Class Posts · {currentUser.name}
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Student work in your classes.</h1>
        <p className="text-sm text-indigo-200 mt-2 max-w-2xl">
          Every post {userCampus ? `${userCampus.name} ` : ''}students made for a course you teach. Analyze a post to see who
          did what, based on files, tasks and Google Doc version history.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {taught.map((t) => (
            <button
              key={t.code}
              onClick={() => setCourse(course === t.code ? ALL_COURSES : t.code)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-left cursor-pointer ${
                course === t.code ? 'bg-white text-indigo-950 border-white' : 'bg-white/10 hover:bg-white/15 border-white/15'
              }`}
            >
              <BookOpen className={`w-4 h-4 ${course === t.code ? 'text-indigo-600' : 'text-indigo-300'}`} />
              <span>
                <span className="block text-sm font-bold">{t.code}</span>
                <span className={`block text-[11px] ${course === t.code ? 'text-indigo-700' : 'text-indigo-200'}`}>
                  {t.name} · {countFor(t.code)} {countFor(t.code) === 1 ? 'post' : 'posts'}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts or students"
          className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {visible.length === 0 ? (
        <div className="p-10 text-center bg-white border border-dashed border-slate-300 rounded-2xl text-sm text-slate-500">
          {taught.length === 0
            ? 'Add the courses you teach to your profile to see their posts.'
            : q
            ? 'No posts match this search.'
            : 'No posts in your classes yet.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {visible.map((p) => (
            <div key={p.id} className="flex flex-col gap-2">
              <ProjectCard project={p} onSelect={setSelectedProject} />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => openContributionAnalysisModal(p)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Analyze contributions
                </button>
                {p.sharedDocument && (
                  <button
                    onClick={() => setDocProject(p)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Google Doc effort
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
