import { Revision, ProjectMember } from '../types';

export interface StudentContributionStat {
  userId: string;
  name: string;
  role: string;
  major: string;
  revisionCount: number;
  wordsAdded: number;
  wordsRemoved: number;
  netWords: number;
  totalWordActivity: number;
  percentageOfEdits: number;
  percentageOfWordsAdded: number;
  sessionCount: number;
  totalSessionMinutes: number;
  activeDaysCount: number;
  lastActiveTimestamp: string;
  hasDisproportionateShare: boolean; // Flag when > 60% of work
}

export interface ProjectContributionSummary {
  totalRevisions: number;
  totalWordsAdded: number;
  totalWordsRemoved: number;
  totalSessions: number;
  totalSessionHours: number;
  studentStats: StudentContributionStat[];
  highestContributorId?: string;
  highDisparityDetected: boolean;
}

export function computeContributionStats(
  members: ProjectMember[],
  revisions: Revision[]
): ProjectContributionSummary {
  const totalRevisions = revisions.length;
  let totalWordsAdded = 0;
  let totalWordsRemoved = 0;
  let totalSessions = 0;
  let totalSessionMinutes = 0;

  // Initialize stats per member
  const memberMap = new Map<
    string,
    {
      member: ProjectMember;
      revisions: Revision[];
      dates: Set<string>;
    }
  >();

  for (const m of members) {
    memberMap.set(m.userId, {
      member: m,
      revisions: [],
      dates: new Set<string>(),
    });
  }

  // Aggregate revisions
  for (const rev of revisions) {
    totalWordsAdded += rev.wordsAdded;
    totalWordsRemoved += rev.wordsRemoved;
    totalSessions += 1;
    totalSessionMinutes += rev.sessionDurationMinutes;

    let entry = memberMap.get(rev.authorId);
    if (!entry) {
      // Author might be a member not in initial list, gracefully add
      const fallbackMember: ProjectMember = {
        userId: rev.authorId,
        name: rev.authorName,
        role: rev.authorRole,
        major: 'General',
        avatarInitial: rev.authorName.charAt(0),
      };
      entry = {
        member: fallbackMember,
        revisions: [],
        dates: new Set<string>(),
      };
      memberMap.set(rev.authorId, entry);
    }

    entry.revisions.push(rev);
    // Parse date (YYYY-MM-DD)
    const dateStr = rev.timestamp.slice(0, 10);
    entry.dates.add(dateStr);
  }

  const studentStats: StudentContributionStat[] = [];
  let highestPercentage = 0;
  let highestContributorId: string | undefined = undefined;

  for (const [, { member, revisions: revs, dates }] of memberMap.entries()) {
    const revisionCount = revs.length;
    let added = 0;
    let removed = 0;
    let sessionMinutes = 0;
    let latestTime = '';

    for (const r of revs) {
      added += r.wordsAdded;
      removed += r.wordsRemoved;
      sessionMinutes += r.sessionDurationMinutes;
      if (!latestTime || new Date(r.timestamp) > new Date(latestTime)) {
        latestTime = r.timestamp;
      }
    }

    const percentageOfEdits =
      totalRevisions > 0 ? Math.round((revisionCount / totalRevisions) * 100) : 0;
    const percentageOfWordsAdded =
      totalWordsAdded > 0 ? Math.round((added / totalWordsAdded) * 100) : 0;

    const hasDisproportionateShare = percentageOfWordsAdded >= 60;

    if (percentageOfWordsAdded > highestPercentage) {
      highestPercentage = percentageOfWordsAdded;
      highestContributorId = member.userId;
    }

    studentStats.push({
      userId: member.userId,
      name: member.name,
      role: member.role,
      major: member.major,
      revisionCount,
      wordsAdded: added,
      wordsRemoved: removed,
      netWords: added - removed,
      totalWordActivity: added + removed,
      percentageOfEdits,
      percentageOfWordsAdded,
      sessionCount: revisionCount,
      totalSessionMinutes: sessionMinutes,
      activeDaysCount: dates.size,
      lastActiveTimestamp: latestTime || 'No activity',
      hasDisproportionateShare,
    });
  }

  // Sort by words added descending
  studentStats.sort((a, b) => b.wordsAdded - a.wordsAdded);

  const highDisparityDetected = highestPercentage >= 60 && studentStats.length > 1;

  return {
    totalRevisions,
    totalWordsAdded,
    totalWordsRemoved,
    totalSessions,
    totalSessionHours: Math.round((totalSessionMinutes / 60) * 10) / 10,
    studentStats,
    highestContributorId,
    highDisparityDetected,
  };
}
