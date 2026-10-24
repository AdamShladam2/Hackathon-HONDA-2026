import test from 'node:test';
import assert from 'node:assert/strict';
import { computeContributionStats } from './contributions';
import { ProjectMember, Revision } from '../types';

test('computes contribution metrics and identifies when one student did most of the work', () => {
  const members: ProjectMember[] = [
    { userId: 'u1', name: 'Marcus Vance', role: 'Lead Dev', major: 'CSE', avatarInitial: 'M' },
    { userId: 'u2', name: 'Elena Rostova', role: 'Hardware Specialist', major: 'ECE', avatarInitial: 'E' },
    { userId: 'u3', name: 'Jordan Hayes', role: 'Documentation', major: 'Finance', avatarInitial: 'J' },
  ];

  const revisions: Revision[] = [
    {
      id: 'rev-1',
      version: 'v0.1',
      authorId: 'u1',
      authorName: 'Marcus Vance',
      authorRole: 'Lead Dev',
      timestamp: '2026-10-10T14:30:00Z',
      wordsAdded: 850,
      wordsRemoved: 20,
      summary: 'Initial architecture & data model',
      sessionDurationMinutes: 120,
    },
    {
      id: 'rev-2',
      version: 'v0.2',
      authorId: 'u1',
      authorName: 'Marcus Vance',
      authorRole: 'Lead Dev',
      timestamp: '2026-10-12T16:00:00Z',
      wordsAdded: 720,
      wordsRemoved: 40,
      summary: 'Route optimization algorithm & bus schedule integration',
      sessionDurationMinutes: 90,
    },
    {
      id: 'rev-3',
      version: 'v0.3',
      authorId: 'u2',
      authorName: 'Elena Rostova',
      authorRole: 'Hardware Specialist',
      timestamp: '2026-10-14T11:00:00Z',
      wordsAdded: 300,
      wordsRemoved: 10,
      summary: 'Hardware telemetry sensor interface docs',
      sessionDurationMinutes: 60,
    },
    {
      id: 'rev-4',
      version: 'v0.4',
      authorId: 'u3',
      authorName: 'Jordan Hayes',
      authorRole: 'Documentation',
      timestamp: '2026-10-15T09:00:00Z',
      wordsAdded: 100,
      wordsRemoved: 5,
      summary: 'Executive summary fixes',
      sessionDurationMinutes: 30,
    },
  ];

  const summary = computeContributionStats(members, revisions);

  assert.equal(summary.totalRevisions, 4);
  assert.equal(summary.totalWordsAdded, 1970);
  assert.equal(summary.studentStats.length, 3);

  // Marcus should be top contributor with > 60% words added
  const marcusStat = summary.studentStats.find((s) => s.userId === 'u1')!;
  assert.ok(marcusStat.wordsAdded > 1500);
  assert.ok(marcusStat.percentageOfWordsAdded >= 60);
  assert.equal(marcusStat.hasDisproportionateShare, true);
  assert.equal(summary.highDisparityDetected, true);
  assert.equal(summary.highestContributorId, 'u1');
});
