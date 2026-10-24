import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  canShareAsPublicCode,
  filterShowcaseProjects,
  sortShowcaseProjects,
  calculateUnreadInboxCount,
  handleAcceptInvitation,
  handleCodeRequestResponse,
} from './showcase';
import { ShowcaseProject, InboxMessage, InboxInvitation, InboxCodeRequest, Project } from '../types';

describe('showcase utils & anti-copying rules', () => {
  it('blocks public code sharing for coursework projects with clear reason', () => {
    const classCheck = canShareAsPublicCode(true, 'public');
    assert.equal(classCheck.allowed, false);
    assert.match(classCheck.reason || '', /Academic integrity policy/i);

    // Should allow on_request and none for coursework
    assert.equal(canShareAsPublicCode(true, 'on_request').allowed, true);
    assert.equal(canShareAsPublicCode(true, 'none').allowed, true);

    // Personal projects can share public code
    assert.equal(canShareAsPublicCode(false, 'public').allowed, true);
    assert.equal(canShareAsPublicCode(false, 'on_request').allowed, true);
  });

  const sampleProjects: ShowcaseProject[] = [
    {
      id: 'sc-1',
      title: 'SolarSail Simulator',
      summary: 'Orbital physics engine for solar sails',
      description: 'Simulates radiation pressure on deep space craft',
      useCases: 'Aerospace engineers and physics researchers',
      tags: ['Physics', 'Rust', 'Simulation'],
      codeAvailability: 'public',
      status: 'collaborating',
      openRoles: ['Frontend Dev', 'CUDA Specialist'],
      authorId: 'user-1',
      authorName: 'Elena Rostova',
      authorSchoolId: 'stanford',
      authorSchoolName: 'Stanford University',
      authorAvatarInitial: 'E',
      isClassProject: false,
      viewsCount: 520,
      interestedCount: 42,
      createdAt: '2026-10-18T10:00:00Z',
    },
    {
      id: 'sc-2',
      title: 'BuckeyeRoute Transit',
      summary: 'Campus transit route optimization',
      description: 'Finds optimal paths between lecture halls',
      useCases: 'Ohio State students needing fast inter-building navigation',
      tags: ['TypeScript', 'Transit', 'React'],
      codeAvailability: 'on_request',
      status: 'active',
      openRoles: [],
      authorId: 'user-2',
      authorName: 'Marcus Vance',
      authorSchoolId: 'osu',
      authorSchoolName: 'The Ohio State University',
      authorAvatarInitial: 'M',
      isClassProject: true,
      viewsCount: 890,
      interestedCount: 65,
      createdAt: '2026-10-22T14:30:00Z',
    },
    {
      id: 'sc-3',
      title: 'DocLens Legal Assistant',
      summary: 'Local privacy-first contract summary tool',
      description: 'Runs offline LLM inference to spot clauses',
      useCases: 'Pre-law students and legal clinics',
      tags: ['Python', 'AI', 'NLP'],
      codeAvailability: 'none',
      status: 'collaborating',
      openRoles: ['NLP Researcher'],
      authorId: 'user-3',
      authorName: 'Priya Sharma',
      authorSchoolId: 'umich',
      authorSchoolName: 'University of Michigan',
      authorAvatarInitial: 'P',
      isClassProject: false,
      viewsCount: 310,
      interestedCount: 19,
      createdAt: '2026-10-20T12:00:00Z',
    },
  ];

  it('filters showcase projects across search, school, code availability, and collaborator flags', () => {
    // School filter
    const osuOnly = filterShowcaseProjects(sampleProjects, { schoolId: 'osu' });
    assert.equal(osuOnly.length, 1);
    assert.equal(osuOnly[0].title, 'BuckeyeRoute Transit');

    // Code availability filter
    const publicOnly = filterShowcaseProjects(sampleProjects, { codeAvailability: 'public' });
    assert.equal(publicOnly.length, 1);
    assert.equal(publicOnly[0].id, 'sc-1');

    // Looking for collaborators
    const collabOnly = filterShowcaseProjects(sampleProjects, { lookingForCollaborators: true });
    assert.equal(collabOnly.length, 2);

    // Search query matching tag or title
    const searchRust = filterShowcaseProjects(sampleProjects, { search: 'physics' });
    assert.equal(searchRust.length, 1);
    assert.equal(searchRust[0].id, 'sc-1');
  });

  it('sorts showcase projects correctly', () => {
    const mostViewed = sortShowcaseProjects(sampleProjects, 'most_viewed');
    assert.equal(mostViewed[0].id, 'sc-2'); // 890 views
    assert.equal(mostViewed[1].id, 'sc-1'); // 520 views
    assert.equal(mostViewed[2].id, 'sc-3'); // 310 views

    const mostInterested = sortShowcaseProjects(sampleProjects, 'most_interested');
    assert.equal(mostInterested[0].id, 'sc-2'); // 65 interested

    const newest = sortShowcaseProjects(sampleProjects, 'newest');
    assert.equal(newest[0].id, 'sc-2'); // Oct 22
  });

  it('calculates unread inbox counts accurately', () => {
    const msgs: InboxMessage[] = [
      {
        id: 'm1',
        fromUserId: 'u2',
        fromUserName: 'Alice',
        fromSchoolName: 'Stanford',
        toUserId: 'target-user',
        text: 'Hello!',
        createdAt: '2026-10-23',
        read: false,
      },
      {
        id: 'm2',
        fromUserId: 'u3',
        fromUserName: 'Bob',
        fromSchoolName: 'UMich',
        toUserId: 'target-user',
        text: 'Great project',
        createdAt: '2026-10-22',
        read: true,
      },
    ];

    const invites: InboxInvitation[] = [
      {
        id: 'inv1',
        fromUserId: 'u2',
        fromUserName: 'Alice',
        fromSchoolName: 'Stanford',
        toUserId: 'target-user',
        projectId: 'proj-1',
        projectTitle: 'SolarSail',
        roleOffered: 'Frontend Dev',
        note: 'Join us!',
        status: 'pending',
        createdAt: '2026-10-23',
        read: false,
      },
    ];

    const requests: InboxCodeRequest[] = [
      {
        id: 'req1',
        fromUserId: 'u4',
        fromUserName: 'David',
        fromSchoolName: 'UMich',
        toUserId: 'target-user',
        showcaseProjectId: 'sc-2',
        showcaseProjectTitle: 'BuckeyeRoute',
        reason: 'Research audit',
        status: 'pending',
        createdAt: '2026-10-23',
        read: false,
      },
    ];

    const totalUnread = calculateUnreadInboxCount(msgs, invites, requests, 'target-user');
    assert.equal(totalUnread, 3); // 1 unread msg + 1 pending invite + 1 pending req
  });

  it('accepts collaboration invite and attaches member to project', () => {
    const dummyProject: Project = {
      id: 'proj-1',
      title: 'SolarSail',
      tagline: 'Test',
      description: 'Test',
      schoolId: 'stanford',
      type: 'personal',
      tags: [],
      skillsNeeded: [],
      openToJoin: true,
      openRoles: [],
      members: [
        {
          userId: 'owner-1',
          name: 'Elena',
          role: 'Owner',
          major: 'Aero',
          avatarInitial: 'E',
        },
      ],
      ownerId: 'owner-1',
      document: {
        id: 'doc-1',
        title: 'Doc',
        type: 'google_doc',
        lastModified: '2026-10-20',
        wordCount: 100,
        pageCount: 1,
        fileName: 'Doc.gdoc',
        sections: [],
      },
      revisions: [],
      updates: [],
    };

    const invite: InboxInvitation = {
      id: 'inv1',
      fromUserId: 'owner-1',
      fromUserName: 'Elena',
      fromSchoolName: 'Stanford',
      toUserId: 'user-marcus',
      projectId: 'proj-1',
      projectTitle: 'SolarSail',
      roleOffered: 'Lead Backend Engineer',
      note: 'Love your work',
      status: 'pending',
      createdAt: '2026-10-23',
      read: false,
    };

    const updatedProjects = handleAcceptInvitation(
      invite,
      { id: 'user-marcus', name: 'Marcus Vance', major: 'CSE', avatarInitial: 'M' },
      [dummyProject]
    );

    assert.equal(updatedProjects[0].members.length, 2);
    assert.equal(updatedProjects[0].members[1].userId, 'user-marcus');
    assert.equal(updatedProjects[0].members[1].role, 'Lead Backend Engineer');
  });

  it('resolves code requests with repo url on accept', () => {
    const req: InboxCodeRequest = {
      id: 'r1',
      fromUserId: 'u1',
      fromUserName: 'Alice',
      fromSchoolName: 'UMich',
      toUserId: 'u2',
      showcaseProjectId: 'sc-1',
      showcaseProjectTitle: 'BuckeyeRoute',
      reason: 'Transit research',
      status: 'pending',
      createdAt: '2026-10-23',
      read: false,
    };

    const accepted = handleCodeRequestResponse(req, true, 'https://github.com/marcusvance-dev/buckeye-route-transit');
    assert.equal(accepted.status, 'accepted');
    assert.equal(accepted.grantedRepoUrl, 'https://github.com/marcusvance-dev/buckeye-route-transit');
    assert.equal(accepted.read, true);

    const declined = handleCodeRequestResponse(req, false);
    assert.equal(declined.status, 'declined');
    assert.equal(declined.grantedRepoUrl, undefined);
  });
});
