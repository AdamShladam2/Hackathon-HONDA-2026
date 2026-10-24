import test from 'node:test';
import assert from 'node:assert/strict';
import { rankTeammateSuggestions, canEndorseStudent } from './teammateSuggestions';
import { User, Endorsement } from '../types';

test('ranks students based on skill match, endorsements, and work-with-again signals', () => {
  const students: User[] = [
    {
      id: 's1',
      name: 'Marcus Vance',
      email: 'vance.42@osu.edu',
      role: 'student',
      schoolId: 'osu',
      major: 'CSE',
      bio: 'Systems dev',
      skills: ['React', 'TypeScript', 'Node.js', 'Algorithms'],
      avatarInitial: 'M',
      workWithAgainCount: 4,
    },
    {
      id: 's2',
      name: 'Priya Sharma',
      email: 'sharma.89@osu.edu',
      role: 'student',
      schoolId: 'osu',
      major: 'Design',
      bio: 'Product designer',
      skills: ['Figma', 'UI/UX', 'User Research', 'Design Systems'],
      avatarInitial: 'P',
      workWithAgainCount: 2,
    },
    {
      id: 's3',
      name: 'Elena Rostova',
      email: 'rostova.12@osu.edu',
      role: 'student',
      schoolId: 'osu',
      major: 'ECE',
      bio: 'Hardware engineer',
      skills: ['C++', 'Microcontrollers', 'Circuit Design'],
      avatarInitial: 'E',
      workWithAgainCount: 1,
    },
  ];

  const endorsements: Endorsement[] = [
    {
      id: 'e1',
      studentId: 's1',
      authorId: 's2',
      authorName: 'Priya Sharma',
      authorRole: 'Designer',
      projectId: 'proj-1',
      projectName: 'Campus Transit',
      badge: 'Great at debugging',
      note: 'Found edge cases in transit routing immediately',
      createdAt: '2026-10-10',
    },
  ];

  const suggestions = rankTeammateSuggestions(students, ['React', 'TypeScript'], 'current-user', endorsements);

  assert.equal(suggestions.length, 3);
  assert.equal(suggestions[0].student.id, 's1'); // Marcus has skills + endorsement + high workWithAgain
  assert.ok(suggestions[0].matchedSkills.includes('React'));
  assert.ok(suggestions[0].reasons.some((r) => r.includes('Matched 2 requested skills')));
});

test('verifies endorsement eligibility only when users shared a project', () => {
  const sharedProjects = [
    {
      members: [{ userId: 'user-a' }, { userId: 'user-b' }],
    },
  ];

  // Eligible teammate
  const eligibleCheck = canEndorseStudent('user-a', 'user-b', sharedProjects);
  assert.equal(eligibleCheck.eligible, true);

  // Self endorsement forbidden
  const selfCheck = canEndorseStudent('user-a', 'user-a', sharedProjects);
  assert.equal(selfCheck.eligible, false);

  // Strangers not eligible
  const strangerCheck = canEndorseStudent('user-a', 'user-c', sharedProjects);
  assert.equal(strangerCheck.eligible, false);
  assert.match(strangerCheck.reason || '', /same project/i);
});
