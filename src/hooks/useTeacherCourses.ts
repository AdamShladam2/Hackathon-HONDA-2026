import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import { courseKey, shortCourseCode } from '../services/campusAccess';

export interface TaughtCourse {
  code: string; // "ENGR 1181"
  name: string; // "Fundamentals of Engineering I"
}

// The signed-in teacher's courses (their profile plus connected Carmen/Canvas courses) and the campus posts made in them
export function useTeacherCourses() {
  const { currentUser, campusClassProjects, projects, userCampus, canvasConnection } = useApp();

  // When Carmen lists instructors, keep only the courses this teacher teaches
  const canvasCourses = useMemo(() => {
    if (!canvasConnection.isConnected) return [];
    const email = (currentUser.email || '').toLowerCase();
    const own = canvasConnection.courses.filter((c) => (c.instructor?.email || '').toLowerCase() === email);
    return own.length > 0 ? own : canvasConnection.courses;
  }, [canvasConnection, currentUser.email]);

  const taught: TaughtCourse[] = useMemo(() => {
    const fromProfile = (currentUser.coursesTaught || []).map((c) => {
      const [code, ...rest] = c.split(':');
      return { code: shortCourseCode(code.trim()), name: rest.join(':').trim() || code.trim() };
    });
    const fromCanvas = canvasCourses.map((c) => ({ code: shortCourseCode(c.courseCode), name: c.name }));
    return Array.from(new Map([...fromProfile, ...fromCanvas].map((t) => [courseKey(t.code), t])).values());
  }, [currentUser.coursesTaught, canvasCourses]);
  const taughtKeys = useMemo(() => new Set(taught.map((t) => courseKey(t.code))), [taught]);

  const postKey = (p: Project) => courseKey(p.courseCode || p.classCode || '');

  // Class posts plus campus projects from the same school that name one of the teacher's courses, newest first
  const coursePosts = useMemo(() => {
    const campusName = (userCampus?.name || '').toLowerCase();
    const campusProjects = projects.filter(
      (p) => p.hubType === 'campus' && [p.school, p.author.school].some((s) => (s || '').toLowerCase() === campusName)
    );
    return Array.from(new Map([...campusClassProjects, ...campusProjects].map((p) => [p.id, p])).values())
      .filter((p) => taughtKeys.has(postKey(p)))
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }, [campusClassProjects, projects, userCampus?.name, taughtKeys]);

  return { taught, taughtKeys, coursePosts, postKey, canvasCourses };
}
