import { User, Endorsement } from '../types';

export interface TeammateSuggestion {
  student: User;
  score: number;
  matchedSkills: string[];
  reasons: string[];
  endorsements: Endorsement[];
  workWithAgainCount: number;
}

export function rankTeammateSuggestions(
  students: User[],
  requiredSkills: string[],
  currentUserId: string,
  endorsements: Endorsement[]
): TeammateSuggestion[] {
  const normSkills = requiredSkills.map((s) => s.toLowerCase().trim()).filter(Boolean);

  const results: TeammateSuggestion[] = [];

  for (const student of students) {
    if (student.id === currentUserId || student.role !== 'student') {
      continue;
    }

    const studentSkillsLower = student.skills.map((s) => s.toLowerCase());
    const matchedSkills = student.skills.filter((s) =>
      normSkills.includes(s.toLowerCase())
    );

    const studentEndorsements = endorsements.filter((e) => e.studentId === student.id);
    const workWithAgainCount = student.workWithAgainCount || 0;

    // Scoring formula:
    // +15 pts per matched skill
    // +8 pts per teammate endorsement
    // +6 pts per "want to work with again" signal
    let score =
      matchedSkills.length * 15 +
      studentEndorsements.length * 8 +
      workWithAgainCount * 6;

    const reasons: string[] = [];

    if (matchedSkills.length > 0) {
      reasons.push(
        `Matched ${matchedSkills.length} requested skill${
          matchedSkills.length > 1 ? 's' : ''
        }: ${matchedSkills.join(', ')}`
      );
    }

    if (studentEndorsements.length > 0) {
      const topBadge = studentEndorsements[0];
      reasons.push(
        `Endorsed for "${topBadge.badge}" on ${topBadge.projectName}`
      );
    }

    if (workWithAgainCount > 0) {
      reasons.push(
        `${workWithAgainCount} past teammate${
          workWithAgainCount > 1 ? 's' : ''
        } voted "want to work with again"`
      );
    }

    // Default reason if empty
    if (reasons.length === 0) {
      reasons.push(`Student in ${student.major || 'College of Engineering'}`);
    }

    results.push({
      student,
      score,
      matchedSkills,
      reasons,
      endorsements: studentEndorsements,
      workWithAgainCount,
    });
  }

  // Sort by highest recommendation score first
  return results.sort((a, b) => b.score - a.score);
}

export function canEndorseStudent(
  currentUserId: string,
  targetStudentId: string,
  sharedProjects: { members: { userId: string }[] }[]
): { eligible: boolean; reason?: string } {
  if (currentUserId === targetStudentId) {
    return { eligible: false, reason: 'You cannot endorse yourself.' };
  }

  const hasSharedProject = sharedProjects.some((project) => {
    const memberIds = project.members.map((m) => m.userId);
    return memberIds.includes(currentUserId) && memberIds.includes(targetStudentId);
  });

  if (!hasSharedProject) {
    return {
      eligible: false,
      reason:
        'Endorsements can only be given by someone who collaborated on the same project.',
    };
  }

  return { eligible: true };
}
