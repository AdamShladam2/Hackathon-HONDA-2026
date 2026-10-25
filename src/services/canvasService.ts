import { CanvasCourse, CanvasClassmate, CanvasUserConnection, CanvasAssignment } from '../types';
import {
  resolveInstitutionFromEmail,
  generateCoursesForSchool,
  INITIAL_OSU_COURSES,
  InstitutionMeta,
  OSU_CANVAS_ASSIGNMENTS,
} from '../data/canvasData';
import { isEduEmail } from './campusAccess';

const CANVAS_STORAGE_KEY = 'skillsink_canvas_connection_v1';

export const DEFAULT_CANVAS_CONNECTION: CanvasUserConnection = {
  isConnected: true,
  schoolEmail: 'alexchen@buckeyemail.osu.edu',
  studentId: 'osu_std_49182',
  institutionName: 'Ohio State University',
  institutionDomain: 'osu.instructure.com',
  connectedAt: '2026-10-24T12:00:00Z',
  source: 'verified_sso',
  courses: INITIAL_OSU_COURSES,
};

export function loadSavedCanvasConnection(): CanvasUserConnection {
  try {
    const raw = localStorage.getItem(CANVAS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.isConnected === 'boolean') {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load canvas connection from localStorage:', err);
  }
  return DEFAULT_CANVAS_CONNECTION;
}

export function saveCanvasConnection(conn: CanvasUserConnection): void {
  try {
    localStorage.setItem(CANVAS_STORAGE_KEY, JSON.stringify(conn));
  } catch (err) {
    console.warn('Failed to save canvas connection to localStorage:', err);
  }
}

export function clearCanvasConnection(): CanvasUserConnection {
  try {
    localStorage.removeItem(CANVAS_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear canvas connection:', err);
  }
  return {
    isConnected: false,
    schoolEmail: '',
    institutionName: '',
    institutionDomain: '',
    source: 'domain_simulation',
    courses: [],
  };
}

// Canvas blocks browser cross-origin calls, so requests go through the dev server's
// /canvas-proxy route (see vite.config.ts), which forwards them to the Canvas host.
function canvasProxyUrl(domain: string, apiPath: string): string {
  return `/canvas-proxy/${domain.replace(/^https?:\/\//, '').replace(/\/+$/, '')}${apiPath}`;
}

// GETs every page of a Canvas list endpoint (Canvas paginates with a Link header)
async function canvasGetAll(domain: string, apiPath: string, apiToken: string): Promise<any[]> {
  const results: any[] = [];
  let url: string | null = canvasProxyUrl(domain, apiPath);
  for (let page = 0; url && page < 20; page++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    let res: Response;
    try {
      res = await fetch(url, {
        signal: controller.signal,
        headers: { Authorization: `Bearer ${apiToken}`, Accept: 'application/json' },
      });
    } catch {
      throw new Error(`Could not reach Canvas at ${domain}. Make sure the app is running with npm run dev.`);
    } finally {
      clearTimeout(timeoutId);
    }
    if (res.status === 401) {
      throw new Error('Canvas rejected that access token. Check that it was copied correctly and has not expired.');
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error || `Canvas request failed (${res.status}) at ${domain}.`);
    }
    const data = await res.json();
    if (Array.isArray(data)) results.push(...data);
    const next = res.headers.get('X-Canvas-Link')?.match(/<https?:\/\/([^/>]+)(\/[^>]*)>;\s*rel="next"/);
    url = next ? `/canvas-proxy/${next[1]}${next[2]}` : null;
  }
  return results;
}

export async function connectCanvasBySchoolEmail(
  email: string,
  apiToken?: string,
  customDomain?: string,
  // Demo accounts may use the built-in sample courses; real accounts need a Canvas token
  allowSampleCourses = false
): Promise<{ success: boolean; connection: CanvasUserConnection; message: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Please enter a valid school email address (e.g. yourname@osu.edu).');
  }
  if (!isEduEmail(cleanEmail)) {
    throw new Error('Canvas and Campus mode require a .edu school email address.');
  }

  const institution = resolveInstitutionFromEmail(cleanEmail);
  const domain = (customDomain?.trim() || institution.canvasUrl)
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .toLowerCase();

  let courses: CanvasCourse[] = [];
  let source: CanvasUserConnection['source'] = 'verified_sso';
  const token = apiToken?.trim();

  if (token) {
    // Live Canvas: the student's real active enrollments
    source = 'canvas_api_token';
    const liveCourses = await canvasGetAll(
      domain,
      '/api/v1/courses?enrollment_state=active&include[]=teachers&include[]=total_students&include[]=term&per_page=100',
      token
    );
    courses = liveCourses
      .filter((c: any) => c && c.id && !c.access_restricted_by_date)
      .map((c: any, idx: number) => ({
        id: `course-${c.id}`,
        courseCode: c.course_code || c.name || `Course ${idx + 1}`,
        name: c.name || c.course_code || 'Enrolled Course',
        term: c.term?.name || '',
        department: institution.name,
        section: c.sis_course_id || '',
        canvasUrl: `https://${domain}/courses/${c.id}`,
        instructor: {
          id: `inst-${c.teachers?.[0]?.id || idx}`,
          name: c.teachers?.[0]?.display_name || 'Course Instructor',
          email: '',
          avatar: c.teachers?.[0]?.avatar_image_url || '',
        },
        studentCount: c.total_students || 0,
        lookingForTeamCount: 0,
        classmates: [],
      }));
  } else if (allowSampleCourses) {
    courses = generateCoursesForSchool(cleanEmail, institution);
  } else {
    throw new Error('Paste a Canvas access token to load your real classes.');
  }

  const newConnection: CanvasUserConnection = {
    isConnected: true,
    schoolEmail: cleanEmail,
    studentId: `std_${Math.floor(100000 + Math.random() * 900000)}`,
    institutionName: institution.name,
    institutionDomain: domain,
    connectedAt: new Date().toISOString(),
    source,
    courses,
  };

  saveCanvasConnection(newConnection);

  const totalClassmates = courses.reduce((acc, c) => acc + c.classmates.length, 0);

  return {
    success: true,
    connection: newConnection,
    message: `Connected to ${institution.name} Canvas (${domain}). Found ${courses.length} enrolled classes with ${totalClassmates} classmates!`,
  };
}

export function getAllClassmates(courses: CanvasCourse[]): CanvasClassmate[] {
  const map = new Map<string, CanvasClassmate>();
  courses.forEach((c) => {
    c.classmates.forEach((cm) => {
      if (!map.has(cm.email)) {
        map.set(cm.email, cm);
      }
    });
  });
  return Array.from(map.values());
}

// Lists the student's assignments for a course along with the files they submitted.
// Uses the live Canvas REST API when an API token is available, otherwise the
// university directory data for that course.
export async function fetchCanvasAssignments(
  connection: CanvasUserConnection,
  course: CanvasCourse,
  apiToken?: string
): Promise<{ assignments: CanvasAssignment[]; source: 'canvas_api' | 'directory' }> {
  const canvasCourseNumber = course.canvasUrl.match(/\/courses\/(\d+)/)?.[1];

  if (apiToken && canvasCourseNumber && connection.institutionDomain) {
    const live = await canvasGetAll(
      connection.institutionDomain,
      `/api/v1/courses/${canvasCourseNumber}/assignments?include[]=submission&per_page=100`,
      apiToken
    );
    return {
      source: 'canvas_api',
      assignments: live.map((a: any) => ({
        id: `canvas-asg-${a.id}`,
        courseId: course.id,
        courseCode: course.courseCode,
        name: a.name,
        dueAt: a.due_at || undefined,
        pointsPossible: a.points_possible ?? undefined,
        htmlUrl: a.html_url,
        submissionStatus:
          a.submission?.workflow_state === 'graded'
            ? 'graded'
            : a.submission?.workflow_state === 'pending_review'
            ? 'pending_review'
            : a.submission?.submitted_at
            ? 'submitted'
            : 'unsubmitted',
        submittedFiles: (a.submission?.attachments || []).map((f: any) => ({
          id: `canvas-file-${f.id}`,
          displayName: f.display_name || f.filename,
          sizeBytes: f.size || 0,
          contentType: f['content-type'] || f.content_type || '',
          url: f.url || a.html_url,
        })),
      })),
    };
  }

  // Real Canvas connections need the token again after a page reload (it is never saved)
  if (connection.source === 'canvas_api_token') {
    throw new Error('Reconnect Canvas with your access token to load assignments.');
  }

  return { source: 'directory', assignments: OSU_CANVAS_ASSIGNMENTS[course.id] || [] };
}
