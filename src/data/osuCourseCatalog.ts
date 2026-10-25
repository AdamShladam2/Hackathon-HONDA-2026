// ==========================================
// OHIO STATE UNIVERSITY COURSE CATALOG
// ==========================================
// Every course offered on the Columbus campus in Summer 2026, Autumn 2026 and
// Spring 2027, pulled from OSU's public class search API (content.osu.edu/v2/classes/search).
// The JSON is ~2 MB, so it is loaded on demand instead of bundled with the app.

export interface OsuCatalogCourse {
  code: string; // e.g. "CSE 3901"
  subject: string; // e.g. "CSE"
  catalogNumber: string; // e.g. "3901"
  title: string;
  department: string; // e.g. "Computer Science & Engineering"
  college: string; // e.g. "Engineering"
  career: string; // e.g. "Undergraduate", "Graduate"
  minUnits: number;
  maxUnits: number;
  component: string; // e.g. "Lecture", "Laboratory"
}

let catalogPromise: Promise<OsuCatalogCourse[]> | null = null;

export function loadOsuCourseCatalog(): Promise<OsuCatalogCourse[]> {
  if (!catalogPromise) {
    catalogPromise = import('./osuCourseCatalog.json').then(
      (mod) => mod.default as OsuCatalogCourse[]
    );
  }
  return catalogPromise;
}

const normalizeCode = (code: string) => code.replace(/\s+/g, '').toUpperCase();

export async function findOsuCourse(code: string): Promise<OsuCatalogCourse | undefined> {
  const target = normalizeCode(code);
  const catalog = await loadOsuCourseCatalog();
  return catalog.find((c) => normalizeCode(c.code) === target);
}

export async function searchOsuCourses(query: string, limit = 25): Promise<OsuCatalogCourse[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const compact = normalizeCode(q);
  const catalog = await loadOsuCourseCatalog();
  const results: OsuCatalogCourse[] = [];
  for (const c of catalog) {
    if (
      normalizeCode(c.code).startsWith(compact) ||
      c.title.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q)
    ) {
      results.push(c);
      if (results.length >= limit) break;
    }
  }
  return results;
}
