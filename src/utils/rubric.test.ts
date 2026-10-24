import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateGradeFromRubric, canViewStudentGrade } from './rubric';

test('calculates score percentage and letter grade accurately from rubric', () => {
  // Max score: 5/5 on all criteria
  const maxGrade = calculateGradeFromRubric({
    contribution: 5,
    quality: 5,
    collaboration: 5,
  });
  assert.equal(maxGrade.scorePercentage, 100);
  assert.equal(maxGrade.letterGrade, 'A');

  // Solid B: 4/5 contribution, 4/5 quality, 3/5 collaboration
  // 4/5 * 35 = 28, 4/5 * 35 = 28, 3/5 * 30 = 18 -> total 74 (C)
  const midGrade = calculateGradeFromRubric({
    contribution: 4,
    quality: 4,
    collaboration: 3,
  });
  assert.equal(midGrade.scorePercentage, 74);
  assert.equal(midGrade.letterGrade, 'C');
});

test('enforces grade privacy rules: teachers see all, students see only their own', () => {
  assert.equal(canViewStudentGrade('teacher-1', 'teacher', 'student-marcus'), true);
  assert.equal(canViewStudentGrade('student-marcus', 'student', 'student-marcus'), true);
  assert.equal(canViewStudentGrade('student-elena', 'student', 'student-marcus'), false);
});
