import { RubricCriteria, StudentGrade } from '../types';

export function calculateGradeFromRubric(
  rubric: RubricCriteria
): { scorePercentage: number; letterGrade: string } {
  // Contribution: 1-5 (weight: 35%)
  // Quality: 1-5 (weight: 35%)
  // Collaboration: 1-5 (weight: 30%)
  const contribScore = (rubric.contribution / 5) * 35;
  const qualityScore = (rubric.quality / 5) * 35;
  const collabScore = (rubric.collaboration / 5) * 30;

  const scorePercentage = Math.round(contribScore + qualityScore + collabScore);

  let letterGrade = 'F';
  if (scorePercentage >= 93) letterGrade = 'A';
  else if (scorePercentage >= 90) letterGrade = 'A-';
  else if (scorePercentage >= 87) letterGrade = 'B+';
  else if (scorePercentage >= 83) letterGrade = 'B';
  else if (scorePercentage >= 80) letterGrade = 'B-';
  else if (scorePercentage >= 77) letterGrade = 'C+';
  else if (scorePercentage >= 73) letterGrade = 'C';
  else if (scorePercentage >= 70) letterGrade = 'C-';
  else if (scorePercentage >= 60) letterGrade = 'D';

  return {
    scorePercentage,
    letterGrade,
  };
}

export function canViewStudentGrade(
  currentUserId: string,
  currentUserRole: 'student' | 'teacher',
  targetStudentId: string
): boolean {
  if (currentUserRole === 'teacher') {
    return true;
  }
  return currentUserId === targetStudentId;
}
