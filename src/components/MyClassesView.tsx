import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, CalendarDays, ExternalLink, GraduationCap, Layers, Plus, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CanvasAssignment, CanvasCourse, Project } from '../types';
import { courseKey, shortCourseCode } from '../services/campusAccess';
import { ProjectCard } from './ProjectCard';

const ALL_CLASSES = 'all';

// The student's enrolled classes (from Canvas) with the posts classmates made in each one
export const MyClassesView: React.FC = () => {
  const {
    canvasConnection,
    campusClassProjects,
    currentUser,
    userCampus,
    openCanvasModal,
    openShareModal,
    setSelectedProject,
    loadCanvasAssignments,
  } = useApp();

  const courses = canvasConnection.isConnected ? canvasConnection.courses : [];
  const [selectedId, setSelectedId] = useState<string>(ALL_CLASSES);
  const [upcoming, setUpcoming] = useState<CanvasAssignment[]>([]);

  const selectedCourse = courses.find((c) => c.id === selectedId) || null;

  // Posts grouped by the enrolled class they were made for
  const postsByCourse = useMemo(() => {
    const map: Record<string, Project[]> = {};
    courses.forEach((c) => {
      const key = courseKey(c.courseCode);
      map[c.id] = campusClassProjects
        .filter((p) => courseKey(p.courseCode || p.classCode) === key)
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    });
    return map;
  }, [courses, campusClassProjects]);

  const visiblePosts = selectedCourse
    ? postsByCourse[selectedCourse.id] || []
    : Array.from(new Map(Object.values(postsByCourse).flat().map((p) => [p.id, p])).values()).sort((a, b) =>
        (b.createdAt || '').localeCompare(a.createdAt || '')
      );

  useEffect(() => {
    if (!selectedCourse) {
      setUpcoming([]);
      return;
    }
    let cancelled = false;
    loadCanvasAssignments(selectedCourse.id)
      .then((res) => {
        if (cancelled) return;
        const now = Date.now();
        setUpcoming(
          res.assignments
            .filter((a) => a.dueAt && new Date(a.dueAt).getTime() >= now)
            .sort((a, b) => (a.dueAt || '').localeCompare(b.dueAt || ''))
            .slice(0, 4)
        );
      })
      // Assignments are a bonus here; the class page works without them
      .catch(() => !cancelled && setUpcoming([]));
    return () => {
      cancelled = true;
    };
  }, [selectedCourse?.id]);

  const postToClass = (course: CanvasCourse) =>
    openShareModal({
      isClassProject: true,
      courseCode: shortCourseCode(course.courseCode),
      courseName: course.name !== course.courseCode ? course.name : shortCourseCode(course.courseCode),
      professorName: course.instructor.name === 'Course Instructor' ? '' : course.instructor.name,
    });

  const classLabel = (c: CanvasCourse) => shortCourseCode(c.courseCode);
  const classTitle = (c: CanvasCourse) => (c.name !== c.courseCode ? c.name : '');

  if (!canvasConnection.isConnected) {
    return (
      <div className="max-w-xl mx-auto text-center bg-white border border-slate-200 rounded-2xl p-8 space-y-4 shadow-xs">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <BookOpen className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">See your classes</h2>
        <p className="text-sm text-slate-600">
          Connect Canvas to load the classes you're enrolled in at {userCampus?.name || 'your school'}, then see what
          your classmates are posting in each one.
        </p>
        <button
          onClick={openCanvasModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold cursor-pointer"
        >
          <GraduationCap className="w-4 h-4" />
          Connect Canvas
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            {canvasConnection.institutionName}
          </p>
          <h1 className="text-2xl font-extrabold text-slate-900">My Classes</h1>
          <p className="text-sm text-slate-600">
            {courses.length} {courses.length === 1 ? 'class' : 'classes'} from Canvas. Pick one to see posts from your
            classmates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
        {/* Class list */}
        <nav className="bg-white border border-slate-200 rounded-2xl p-2 space-y-1 lg:sticky lg:top-24">
          <button
            onClick={() => setSelectedId(ALL_CLASSES)}
            className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-left text-sm cursor-pointer ${
              !selectedCourse ? 'bg-indigo-50 text-indigo-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              All my classes
            </span>
          </button>
          {courses.map((c) => {
            const count = postsByCourse[c.id]?.length || 0;
            const active = selectedCourse?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-left cursor-pointer ${
                  active ? 'bg-indigo-50 text-indigo-800' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="min-w-0">
                  <span className={`block text-sm ${active ? 'font-bold' : 'font-semibold'}`}>{classLabel(c)}</span>
                  {classTitle(c) && <span className="block text-xs text-slate-500 truncate">{classTitle(c)}</span>}
                </span>
                <span
                  className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    count > 0 ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-500'
                  }`}
                  title={`${count} ${count === 1 ? 'post' : 'posts'}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>

        <section className="space-y-5 min-w-0">
          {/* Class header */}
          {selectedCourse ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-xl font-extrabold text-slate-900">{classLabel(selectedCourse)}</h2>
                  {classTitle(selectedCourse) && <p className="text-sm text-slate-600">{classTitle(selectedCourse)}</p>}
                  <p className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                    {selectedCourse.instructor.name !== 'Course Instructor' && (
                      <span>{selectedCourse.instructor.name}</span>
                    )}
                    {selectedCourse.term && <span>{selectedCourse.term}</span>}
                    {selectedCourse.studentCount > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {selectedCourse.studentCount} students
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={selectedCourse.canvasUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                  >
                    Open in Canvas
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => postToClass(selectedCourse)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Post to this class
                  </button>
                </div>
              </div>

              {upcoming.length > 0 && (
                <div className="border-t border-slate-100 pt-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Coming up
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {upcoming.map((a) => (
                      <li key={a.id}>
                        <a
                          href={a.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs"
                        >
                          <span className="block font-semibold text-slate-800 truncate">{a.name}</span>
                          <span className="text-slate-500">
                            Due {new Date(a.dueAt as string).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}

          {/* Posts */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              {selectedCourse ? `Posts in ${classLabel(selectedCourse)}` : 'Recent posts from your classes'}
              <span className="ml-2 text-slate-400 font-medium">{visiblePosts.length}</span>
            </h3>
            {visiblePosts.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-3">
                <p className="text-sm text-slate-600">
                  {selectedCourse
                    ? `No one has posted in ${classLabel(selectedCourse)} yet.`
                    : 'No one has posted in your classes yet.'}
                </p>
                {selectedCourse && (
                  <button
                    onClick={() => postToClass(selectedCourse)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Be the first to post
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visiblePosts.map((p) => (
                  <div key={p.id} className="relative">
                    {!selectedCourse && p.courseCode && (
                      <span className="absolute -top-2 left-3 z-10 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold shadow-sm">
                        {shortCourseCode(p.courseCode)}
                      </span>
                    )}
                    {p.author?.id === currentUser.id && (
                      <span className="absolute -top-2 right-3 z-10 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-sm">
                        Your post
                      </span>
                    )}
                    <ProjectCard project={p} onSelect={setSelectedProject} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
