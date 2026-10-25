import { Author } from '../types';
import { resolveInstitutionFromEmail, InstitutionMeta } from '../data/canvasData';

export type AppMode = 'campus' | 'discover';

export function getEmailDomain(email: string): string {
  const clean = email.trim().toLowerCase();
  return clean.includes('@') ? clean.split('@')[1] : '';
}

// Campus mode is restricted to .edu addresses (including subdomains like buckeyemail.osu.edu)
export function isEduEmail(email?: string): boolean {
  if (!email) return false;
  return /^[^@\s]+@([a-z0-9-]+\.)+edu$/i.test(email.trim());
}

// Returns the campus an email belongs to, or null when the email can't access Campus mode
export function getCampusForEmail(email?: string): InstitutionMeta | null {
  if (!email || !isEduEmail(email)) return null;
  return resolveInstitutionFromEmail(email);
}

export function isSameCampus(a: InstitutionMeta | null, b: InstitutionMeta | null): boolean {
  if (!a || !b) return false;
  return a.name.toLowerCase() === b.name.toLowerCase();
}

// Whether an author (by school, organization or email) belongs to the given campus
export function authorBelongsToCampus(author: Partial<Author> | undefined, campus: InstitutionMeta | null): boolean {
  if (!author || !campus) return false;
  if (author.email && isSameCampus(getCampusForEmail(author.email), campus)) return true;
  const affiliation = (author.school || author.organization || '').toLowerCase();
  return affiliation === campus.name.toLowerCase();
}

// Canvas course codes carry section/term suffixes ("CSE 3901 (AU26)", "CSE-3901.0010").
// Returns the plain "CSE 3901" form, or the trimmed input when it has no subject + number.
export function shortCourseCode(code = ''): string {
  const m = code.match(/\b([A-Z][A-Z&]{1,9})[\s-]*(\d{3,4}[A-Z]?)\b/i);
  return m ? `${m[1].toUpperCase()} ${m[2].toUpperCase()}` : code.trim();
}

// Key for matching a post's course code against a Canvas course ("CSE3901")
export function courseKey(code = ''): string {
  return shortCourseCode(code).replace(/\s+/g, '').toUpperCase();
}
