import React, { useMemo, useState } from 'react';
import { BarChart3, BookOpen, GraduationCap, Mail, Search, Star, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import { INITIAL_OSU_COURSES } from '../data/canvasData';
import { courseKey, shortCourseCode } from '../services/campusAccess';
import { useTeacherCourses } from '../hooks/useTeacherCourses';

interface StudentRow {
  key: string;
  name: string;
  avatar: string;
  email?: string;
  major?: string;
  courses: string[];
  posts: Project[];
  peerRating?: number;
}

const ALL_COURSES = 'all';

// Teacher view: everyone enrolled in or posting to the courses they teach
export const TeacherStudentsView: React.FC = () => {
  const { setSelectedProject, openContributionAnalysisModal, openCanvasModal } = useApp();
  const { taught, taughtKeys, coursePosts, canvasCourses } = useTeacherCourses();

  const [course, setCourse] = useState<string>(ALL_COURSES);
  const [query, setQuery] = useState('');

  // Canvas rosters for the taught courses, plus authors and team members of posts in them
  const students = useMemo(() => {
    const byName = new Map<string, StudentRow>();
    const add = (name: string, code: string, extra: Partial<StudentRow>) => {
      const key = name.trim().toLowerCase();
      const row = byName.get(key) || { key, name, avatar: extra.avatar || '', courses: [], posts: [] };
      if (!row.courses.includes(code)) row.courses.push(code);
      row.avatar = row.avatar || extra.avatar || '';
      row.email = row.email || extra.email;
      row.major = row.major || extra.major;
      row.peerRating = row.peerRating ?? extra.peerRating;
      byName.set(key, row);
      return row;
    };

    [...canvasCourses, ...INITIAL_OSU_COURSES].filter((c) => taughtKeys.has(courseKey(c.courseCode))).forEach((c) =>
      c.classmates
        .filter((cm) => cm.role === 'Student')
        .forEach((cm) =>
          add(cm.name, shortCourseCode(c.courseCode), {
            avatar: cm.avatar,
            email: cm.email,
            major: cm.major,
            peerRating: cm.peerRating,
          })
        )
    );

    coursePosts.forEach((p) => {
      const code = shortCourseCode(p.courseCode || p.classCode || '');
      const people = [
        { name: p.author.name, avatar: p.author.avatar, email: p.author.email, major: p.author.major },
        ...(p.teamMembers || []).map((m) => ({ name: m.name, avatar: m.avatar, email: m.email, major: undefined })),
      ];
      const seen = new Set<string>();
      people.forEach((person) => {
        const k = person.name.trim().toLowerCase();
        if (seen.has(k)) return;
        seen.add(k);
        add(person.name, code, person).posts.push(p);
      });
    });

    return Array.from(byName.values()).sort((a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name));
  }, [taughtKeys, coursePosts, canvasCourses]);

  const q = query.trim().toLowerCase();
  const visible = students.filter((s) => {
    if (course !== ALL_COURSES && !s.courses.includes(course)) return false;
    if (!q) return true;
    return [s.name, s.email, s.major].filter(Boolean).some((t) => (t as string).toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">My Students</h1>
          <p className="text-sm text-slate-500 mt-1">
            {students.length} students in {taught.map((t) => t.code).join(', ') || 'your courses'}, with the posts they are
            part of.
          </p>
        </div>
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email or major"
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {canvasCourses.length === 0 && (
        <div className="bg-red-50/60 border border-red-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs text-red-950">
              <p className="font-bold">Connect Carmen to load your class rosters</p>
              <p className="text-red-900/80">Your Carmen courses and their students will show up here and in Class Posts.</p>
            </div>
          </div>
          <button
            onClick={openCanvasModal}
            className="shrink-0 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
          >
            Connect Carmen
          </button>
        </div>
      )}

      {taught.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {[{ code: ALL_COURSES, name: 'All courses' }, ...taught].map((t) => (
            <button
              key={t.code}
              onClick={() => setCourse(t.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                course === t.code ? 'bg-indigo-900 text-white border-indigo-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t.code === ALL_COURSES ? t.name : t.code}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="p-10 text-center bg-white border border-dashed border-slate-300 rounded-2xl text-sm text-slate-500">
          {students.length === 0 ? 'No students found for your courses yet.' : 'No students match this search.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visible.map((s) => (
            <div key={s.key} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                {s.avatar ? (
                  <img src={s.avatar} alt="" referrerPolicy="no-referrer" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Users className="w-4 h-4 text-slate-400" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 truncate">{s.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{[s.major, s.email].filter(Boolean).join(' · ')}</p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    {s.courses.map((c) => (
                      <span key={c} className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                        <BookOpen className="w-2.5 h-2.5" />
                        {c}
                      </span>
                    ))}
                    {s.peerRating && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        {s.peerRating} peer rating
                      </span>
                    )}
                  </div>
                </div>
                {s.email && (
                  <a
                    href={`mailto:${s.email}`}
                    title={`Email ${s.name}`}
                    className="p-2 rounded-lg text-slate-500 hover:text-indigo-700 hover:bg-indigo-50"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>

              {s.posts.length > 0 ? (
                <div className="space-y-1.5 border-t border-slate-100 pt-3">
                  {s.posts.map((p) => (
                    <div key={p.id} className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedProject(p)}
                        className="flex-1 min-w-0 text-left text-xs font-semibold text-slate-800 hover:text-indigo-700 truncate cursor-pointer"
                      >
                        <span className="font-mono text-[10px] text-slate-400 mr-1.5">{shortCourseCode(p.courseCode || p.classCode || '')}</span>
                        {p.title}
                      </button>
                      <button
                        onClick={() => openContributionAnalysisModal(p)}
                        className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-[11px] font-bold cursor-pointer"
                      >
                        <BarChart3 className="w-3 h-3" />
                        Analyze
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">No posts yet in your courses.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
