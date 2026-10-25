import { DocumentEditSession, SharedDocumentActivity, SharedDocumentSection, TeamMember } from '../types';

// Per-minute weight for a section's difficulty: a 5-rated section counts twice as much as a 1-rated one
export const difficultyWeight = (difficulty: number) => 0.6 + 0.2 * difficulty;

export const EFFORT_METHOD_NOTE =
  'Time is active editing time from the Google Doc version history: revisions less than 15 minutes apart count as one session. ' +
  'Effort weights each minute by the difficulty of the section being edited (1 = routine, 5 = hardest, from the assignment rubric), ' +
  'so a minute on a 5-rated section counts twice as much as a minute on a 1-rated section. ' +
  'This measures recorded activity in the document, not thinking, lab or meeting time outside it.';

export interface SectionShare {
  section: SharedDocumentSection;
  minutes: number;
  wordsAdded: number;
}

export interface MemberEffort {
  member: TeamMember;
  minutes: number;
  sessions: number;
  wordsAdded: number;
  netWords: number;
  comments: number;
  weightedEffort: number;
  effortShare: number; // 0-1 of the team's weighted effort
  timeShare: number; // 0-1 of the team's editing time
  wordShare: number; // 0-1 of the team's net words
  avgDifficulty: number; // minute-weighted
  hardMinutesShare: number; // share of their time on sections rated 4-5
  finalDayShare: number; // share of their time in the 24 hours before the deadline
  sectionsLed: SharedDocumentSection[]; // sections where they spent the most time
  sectionBreakdown: SectionShare[];
  timeline: DocumentEditSession[];
  insights: string[];
}

export interface DocumentEffortReport {
  totalMinutes: number;
  totalWeighted: number;
  members: MemberEffort[];
  balance: 'Balanced' | 'Somewhat uneven' | 'Uneven';
  teamSummary: string;
}

export const formatMinutes = (m: number) => {
  const h = Math.floor(m / 60);
  const min = Math.round(m % 60);
  return h > 0 ? `${h}h ${min.toString().padStart(2, '0')}m` : `${min}m`;
};

const pct = (x: number) => `${Math.round(x * 100)}%`;

export function analyzeDocumentEffort(doc: SharedDocumentActivity, team: TeamMember[]): DocumentEffortReport {
  const sectionById = new Map(doc.sections.map((s) => [s.id, s]));
  const due = new Date(doc.dueAt).getTime();
  const weightOf = (s: DocumentEditSession) => s.minutes * difficultyWeight(sectionById.get(s.sectionId)?.difficulty || 3);

  const totalMinutes = doc.sessions.reduce((n, s) => n + s.minutes, 0);
  const totalWeighted = doc.sessions.reduce((n, s) => n + weightOf(s), 0);
  const totalNetWords = doc.sessions.reduce((n, s) => n + s.wordsAdded - s.wordsDeleted, 0);

  // Who spent the most time in each section
  const sectionLeader = new Map<string, string>();
  doc.sections.forEach((section) => {
    const byMember = new Map<string, number>();
    doc.sessions
      .filter((s) => s.sectionId === section.id)
      .forEach((s) => byMember.set(s.memberId, (byMember.get(s.memberId) || 0) + s.minutes));
    const top = [...byMember.entries()].sort((a, b) => b[1] - a[1])[0];
    if (top) sectionLeader.set(section.id, top[0]);
  });

  const members: MemberEffort[] = team.map((member) => {
    const mine = doc.sessions.filter((s) => s.memberId === member.id).sort((a, b) => a.start.localeCompare(b.start));
    const minutes = mine.reduce((n, s) => n + s.minutes, 0);
    const weightedEffort = mine.reduce((n, s) => n + weightOf(s), 0);
    const netWords = mine.reduce((n, s) => n + s.wordsAdded - s.wordsDeleted, 0);
    const hardMinutes = mine
      .filter((s) => (sectionById.get(s.sectionId)?.difficulty || 0) >= 4)
      .reduce((n, s) => n + s.minutes, 0);
    const finalDayMinutes = mine
      .filter((s) => due - new Date(s.start).getTime() <= 24 * 60 * 60 * 1000)
      .reduce((n, s) => n + s.minutes, 0);

    const sectionBreakdown: SectionShare[] = doc.sections
      .map((section) => {
        const inSection = mine.filter((s) => s.sectionId === section.id);
        return {
          section,
          minutes: inSection.reduce((n, s) => n + s.minutes, 0),
          wordsAdded: inSection.reduce((n, s) => n + s.wordsAdded, 0),
        };
      })
      .filter((s) => s.minutes > 0)
      .sort((a, b) => b.minutes - a.minutes);

    return {
      member,
      minutes,
      sessions: mine.length,
      wordsAdded: mine.reduce((n, s) => n + s.wordsAdded, 0),
      netWords,
      comments: mine.reduce((n, s) => n + s.comments, 0),
      weightedEffort,
      effortShare: totalWeighted ? weightedEffort / totalWeighted : 0,
      timeShare: totalMinutes ? minutes / totalMinutes : 0,
      wordShare: totalNetWords ? Math.max(0, netWords) / totalNetWords : 0,
      avgDifficulty: minutes ? weightedEffortToDifficulty(weightedEffort / minutes) : 0,
      hardMinutesShare: minutes ? hardMinutes / minutes : 0,
      finalDayShare: minutes ? finalDayMinutes / minutes : 0,
      sectionsLed: doc.sections.filter((s) => sectionLeader.get(s.id) === member.id),
      sectionBreakdown,
      timeline: mine,
      insights: [],
    };
  });

  const even = members.length ? 1 / members.length : 0;
  members.forEach((m) => (m.insights = describeMember(m, even)));

  const shares = members.map((m) => m.effortShare);
  const spread = Math.max(...shares) - Math.min(...shares);
  const balance = spread < 0.15 ? 'Balanced' : spread < 0.3 ? 'Somewhat uneven' : 'Uneven';
  const ranked = [...members].sort((a, b) => b.effortShare - a.effortShare);
  const top = ranked.slice(0, 2).filter((m) => m.effortShare > even);
  const low = ranked.filter((m) => m.effortShare < even * 0.5);

  const teamSummary = [
    `The group spent ${formatMinutes(totalMinutes)} editing the report across ${doc.sessions.length} sessions.`,
    top.length > 0
      ? `${top.map((m) => m.member.name.split(' ')[0]).join(' and ')} carried ${pct(top.reduce((n, m) => n + m.effortShare, 0))} of the difficulty-weighted effort, mostly on the hardest sections.`
      : '',
    low.length > 0
      ? `${low.map((m) => m.member.name.split(' ')[0]).join(' and ')} each did less than half of an even share of the effort (an even share is ${pct(even)}).`
      : 'Every member contributed at least half an even share.',
  ]
    .filter(Boolean)
    .join(' ');

  return { totalMinutes, totalWeighted, members, balance, teamSummary };
}

// Inverts difficultyWeight to express a member's average weight as a 1-5 difficulty
function weightedEffortToDifficulty(avgWeight: number) {
  return Math.round(((avgWeight - 0.6) / 0.2) * 10) / 10;
}

function describeMember(m: MemberEffort, even: number): string[] {
  const first = m.member.name.split(' ')[0];
  if (m.minutes === 0) return [`${first} has no recorded edits in the document.`];
  const out: string[] = [];

  out.push(
    `${formatMinutes(m.minutes)} over ${m.sessions} session${m.sessions === 1 ? '' : 's'}, with ${pct(m.hardMinutesShare)} of that time on sections rated 4–5.`
  );
  if (m.sectionsLed.length > 0) {
    out.push(`Led ${m.sectionsLed.map((s) => `${s.title} (difficulty ${s.difficulty})`).join(', ')}.`);
  }
  if (m.effortShare - m.timeShare > 0.04) {
    out.push(`Their effort share (${pct(m.effortShare)}) is above their time share (${pct(m.timeShare)}) because their time went to harder sections.`);
  } else if (m.timeShare - m.effortShare > 0.04) {
    out.push(`Their effort share (${pct(m.effortShare)}) is below their time share (${pct(m.timeShare)}) because most of their time went to routine sections.`);
  }
  if (m.finalDayShare >= 0.6) {
    out.push(`${pct(m.finalDayShare)} of their editing happened in the 24 hours before the deadline.`);
  }
  if (m.comments >= 3) {
    out.push(`Left ${m.comments} review comments for teammates.`);
  }
  if (m.effortShare < even * 0.5) {
    out.push(`Less than half of an even share of the effort (an even share is ${pct(even)}).`);
  }
  return out;
}
