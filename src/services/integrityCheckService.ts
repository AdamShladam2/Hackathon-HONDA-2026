import { ComparisonSource, Project, StudentSubmission } from '../types';
import { analyzeDocumentEffort } from './documentEffortService';
import { calculateSimilarity } from './similarityChecker';

// Cheating-likelihood check for teachers. Each student gets a 0-100 score built from
// evidence-backed signals; the score says how likely the work needs a closer look, not that
// anyone cheated. Every signal names the data it came from so the teacher can verify it.

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface IntegritySignal {
  id: string;
  label: string;
  detail: string;
  points: number;
}

export interface StudentRisk {
  name: string;
  avatar?: string;
  role?: string;
  score: number;
  level: RiskLevel;
  signals: IntegritySignal[];
}

export interface IntegrityCheck {
  id: string; // post or submission id
  kind: 'post' | 'submission';
  title: string;
  courseCode: string;
  assignment: string;
  score: number; // highest student score
  level: RiskLevel;
  students: StudentRisk[];
  sources: string[]; // what the check looked at
  summary: string;
  summarySource: 'claude' | 'built-in';
  checkedAt: string;
}

export const INTEGRITY_METHOD_NOTE =
  'Scores add up points from signals in the Google Doc version history (very fast inserts, edits crowded into the hours before the deadline, ' +
  'a small share of the group’s editing), peer ratings, and word-sequence overlap with peer submissions and reference material. ' +
  '50 or more is High, 25-49 is Medium. A high score means the work is worth a closer look; pasting from your own notes, working offline, ' +
  'or quoting course material can all trigger signals. Talk with the student before drawing any conclusion.';

// A typist rarely sustains more than ~40 words a minute while composing; much faster inserts are usually pastes
const PASTE_WPM = 30;
const PASTE_MIN_WORDS = 100;

export const riskLevel = (score: number): RiskLevel => (score >= 50 ? 'High' : score >= 25 ? 'Medium' : 'Low');

const finish = (s: Omit<StudentRisk, 'score' | 'level'>): StudentRisk => {
  const score = Math.min(100, s.signals.reduce((n, x) => n + x.points, 0));
  return { ...s, score, level: riskLevel(score) };
};

const pct = (x: number) => `${Math.round(x * 100)}%`;

// Signals for each member of a group post, from its shared Google Doc and peer ratings
export function checkPost(project: Project): Omit<IntegrityCheck, 'summary' | 'summarySource' | 'checkedAt'> {
  const doc = project.sharedDocument;
  const team = project.teamMembers;
  const sources: string[] = [];
  const due = doc ? new Date(doc.dueAt).getTime() : 0;
  const report = doc ? analyzeDocumentEffort(doc, team) : null;
  if (doc) sources.push(`Google Doc version history (${doc.sessions.length} edit sessions)`);
  if (project.peerAssessments?.length) sources.push(`${project.peerAssessments.length} peer ratings`);

  const students = team.map((m) => {
    const signals: IntegritySignal[] = [];
    const add = (id: string, label: string, detail: string, points: number) => signals.push({ id: `${m.id}-${id}`, label, detail, points });

    if (doc && report) {
      const effort = report.members.find((e) => e.member.id === m.id);
      const sessions = doc.sessions.filter((s) => s.memberId === m.id);

      if (sessions.length === 0) {
        add('no-edits', 'No edits in the group doc', `The version history has no edits by ${m.name.split(' ')[0]}, though they are listed as "${m.role}".`, 30);
      } else {
        const fast = sessions.filter((s) => s.wordsAdded >= PASTE_MIN_WORDS && s.wordsAdded / Math.max(1, s.minutes) >= PASTE_WPM);
        fast.forEach((s, i) => {
          const at = new Date(s.start).toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' });
          add(
            `paste-${i}`,
            'Large block added at once',
            `${s.wordsAdded} words in ${s.minutes} min (${Math.round(s.wordsAdded / Math.max(1, s.minutes))} words/min) on ${at}: "${s.note}". Faster than typing, so it was likely pasted from somewhere.`,
            30
          );
        });

        const lastTwoHours = sessions.every((s) => due - new Date(s.start).getTime() <= 2 * 3600_000);
        if (lastTwoHours) {
          add('cram', 'All work in the last 2 hours', `Every edit was made within 2 hours of the ${doc.assignmentName} deadline.`, 25);
        } else if (effort && effort.finalDayShare >= 0.8) {
          add('final-day', 'Most work on the final day', `${pct(effort.finalDayShare)} of their editing time was in the 24 hours before the deadline.`, 10);
        }

        const fairShare = 1 / Math.max(1, team.length);
        if (effort && effort.effortShare < fairShare / 2) {
          add('low-share', 'Small share of the group’s work', `${pct(effort.effortShare)} of the group’s difficulty-weighted editing effort on a team of ${team.length}.`, 10);
        }
      }
    }

    const received = (project.peerAssessments || []).filter((a) => a.revieweeId === m.id);
    if (received.length >= 2) {
      const avg = received.reduce((n, a) => n + a.rating, 0) / received.length;
      if (avg <= 2.5) {
        const quote = received.find((a) => a.comment)?.comment;
        add('peers', 'Low peer ratings', `Teammates rated them ${avg.toFixed(1)}/5 (${received.length} ratings)${quote ? `: "${quote}"` : ''}.`, 15);
      }
    }

    return finish({ name: m.name, avatar: m.avatar, role: m.role, signals });
  });

  students.sort((a, b) => b.score - a.score);
  const score = students[0]?.score || 0;
  return {
    id: project.id,
    kind: 'post',
    title: project.title,
    courseCode: project.courseCode || project.classCode || '',
    assignment: doc?.assignmentName || project.projectAssignments?.[0] || project.title,
    score,
    level: riskLevel(score),
    students,
    sources: sources.length ? sources : ['Post details only (no Google Doc history or peer ratings yet)'],
  };
}

// Signals for an individual submission, from word-sequence overlap with peers and course material
export function checkSubmission(
  sub: StudentSubmission,
  sources: ComparisonSource[]
): Omit<IntegrityCheck, 'summary' | 'summarySource' | 'checkedAt'> {
  const eligible = sources.filter((s) => s.isAuthorized && !s.id.includes(sub.id));
  const mode = sub.codeSnippet ? 'code' : 'text';
  const overlap = calculateSimilarity(sub, eligible, mode);
  const signals: IntegritySignal[] = [];
  const meaningful = overlap.matchingPassages.filter((p) => !p.isBoilerplate);
  const top = overlap.sourceBreakdown[0];

  if (overlap.overallOverlapPercent >= 40) {
    signals.push({ id: 'overlap-high', label: 'High overlap with other work', detail: `${overlap.overallOverlapPercent}% of word sequences match comparison sources${top ? `, mostly ${top.sourceTitle} (${top.sourceType})` : ''}.`, points: 40 });
  } else if (overlap.overallOverlapPercent >= 20) {
    signals.push({ id: 'overlap-mid', label: 'Some overlap with other work', detail: `${overlap.overallOverlapPercent}% of word sequences match comparison sources${top ? `, mostly ${top.sourceTitle}` : ''}.`, points: 20 });
  }
  const peerPassages = meaningful.filter((p) => p.sourceType === 'Peer Submission' || p.sourceType === 'Public Example');
  if (peerPassages.length > 0) {
    signals.push({
      id: 'peer-passages',
      label: 'Matching passages with another student or public example',
      detail: `${peerPassages.length} passage(s) that are not assignment boilerplate, e.g. "${peerPassages[0].matchedText.slice(0, 90)}…" (${peerPassages[0].sourceDocumentTitle}).`,
      points: 25,
    });
  }
  if (!sub.googleDocsUrl && !sub.githubUrl && !sub.attachedFiles?.length) {
    signals.push({ id: 'no-history', label: 'No version history', detail: 'Only the final text was submitted, with no Google Doc or repository history to show how it was written.', points: 5 });
  }

  const student = finish({ name: sub.studentName, avatar: sub.studentAvatar, role: sub.isGroupSubmission ? sub.groupName : undefined, signals });
  return {
    id: sub.id,
    kind: 'submission',
    title: `${sub.studentName} — ${sub.assignmentTitle}`,
    courseCode: sub.classCode,
    assignment: sub.assignmentTitle,
    score: student.score,
    level: student.level,
    students: [student],
    sources: [`Word-sequence comparison against ${eligible.length} peer submissions and course materials`],
  };
}

// Summary written from the signals alone, used when Claude isn't configured on the server
export function builtInSummary(check: Omit<IntegrityCheck, 'summary' | 'summarySource' | 'checkedAt'>): string {
  const flagged = check.students.filter((s) => s.level !== 'Low');
  if (flagged.length === 0) {
    return `Nothing in ${check.assignment} stands out: no student has more than minor signals. No follow-up looks necessary.`;
  }
  const parts = flagged.map((s) => {
    const top = [...s.signals].sort((a, b) => b.points - a.points).slice(0, 2).map((x) => x.label.toLowerCase());
    return `${s.name} (${s.score}/100, ${s.level}) — ${top.join(' and ')}`;
  });
  return (
    `${flagged.length === 1 ? 'One student' : `${flagged.length} students`} may need a closer look in ${check.assignment}: ${parts.join('; ')}. ` +
    `These signals can have innocent explanations, such as pasting from the student’s own notes. ` +
    `A good next step is to ask ${flagged.length === 1 ? 'them' : 'each of them'} to walk you through their part and how they wrote it.`
  );
}

// Fields sent to the Claude summary endpoint: the computed signals only, no avatars or ids
export const summaryPayload = (check: Omit<IntegrityCheck, 'summary' | 'summarySource' | 'checkedAt'>) => ({
  course: check.courseCode,
  assignment: check.assignment,
  dataChecked: check.sources,
  students: check.students.map((s) => ({
    name: s.name,
    role: s.role,
    score: s.score,
    level: s.level,
    signals: s.signals.map((x) => ({ signal: x.label, evidence: x.detail, points: x.points })),
  })),
});
