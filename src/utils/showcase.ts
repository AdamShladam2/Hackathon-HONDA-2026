import {
  ShowcaseProject,
  CodeAvailability,
  GitHubRepo,
  InboxMessage,
  InboxInvitation,
  InboxCodeRequest,
  Project,
} from '../types';

export interface ShowcaseFilterOptions {
  search?: string;
  schoolId?: string;
  codeAvailability?: CodeAvailability | 'all';
  lookingForCollaborators?: boolean;
  selectedTag?: string;
}

/**
 * Anti-copying rule enforcement:
 * Course projects cannot be shared with public code to protect academic integrity.
 */
export function canShareAsPublicCode(
  isClassProject: boolean,
  choice: CodeAvailability
): { allowed: boolean; reason?: string } {
  if (isClassProject && choice === 'public') {
    return {
      allowed: false,
      reason:
        'Academic integrity policy: Coursework projects cannot be shared with public code repositories to prevent plagiarism and honor code violations across universities. Please choose "Code on request" or "No code".',
    };
  }
  return { allowed: true };
}

/**
 * Filter showcase projects based on search, school, code access, collaborator status, and tags.
 */
export function filterShowcaseProjects(
  projects: ShowcaseProject[],
  filters: ShowcaseFilterOptions
): ShowcaseProject[] {
  return projects.filter((project) => {
    // Search query
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      const matchTitle = project.title.toLowerCase().includes(q);
      const matchSummary = project.summary.toLowerCase().includes(q);
      const matchDesc = project.description.toLowerCase().includes(q);
      const matchAuthor = project.authorName.toLowerCase().includes(q);
      const matchSchool = project.authorSchoolName.toLowerCase().includes(q);
      const matchTags = project.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchDesc && !matchAuthor && !matchSchool && !matchTags) {
        return false;
      }
    }

    // School filter
    if (filters.schoolId && filters.schoolId !== 'all') {
      if (project.authorSchoolId !== filters.schoolId) {
        return false;
      }
    }

    // Code availability filter
    if (filters.codeAvailability && filters.codeAvailability !== 'all') {
      if (project.codeAvailability !== filters.codeAvailability) {
        return false;
      }
    }

    // Looking for collaborators filter
    if (filters.lookingForCollaborators) {
      if (project.status !== 'collaborating' && project.openRoles.length === 0) {
        return false;
      }
    }

    // Specific tag filter
    if (filters.selectedTag && filters.selectedTag !== 'all') {
      if (!project.tags.includes(filters.selectedTag)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort showcase projects
 */
export function sortShowcaseProjects(
  projects: ShowcaseProject[],
  sortBy: 'newest' | 'most_viewed' | 'most_interested'
): ShowcaseProject[] {
  const cloned = [...projects];
  switch (sortBy) {
    case 'most_viewed':
      return cloned.sort((a, b) => b.viewsCount - a.viewsCount);
    case 'most_interested':
      return cloned.sort((a, b) => b.interestedCount - a.interestedCount);
    case 'newest':
    default:
      return cloned.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

/**
 * Calculate total unread count for the navigation badge
 */
export function calculateUnreadInboxCount(
  messages: InboxMessage[],
  invitations: InboxInvitation[],
  codeRequests: InboxCodeRequest[],
  forUserId: string
): number {
  const unreadMessages = messages.filter((m) => m.toUserId === forUserId && !m.read).length;
  const unreadInvites = invitations.filter(
    (inv) => inv.toUserId === forUserId && inv.status === 'pending' && !inv.read
  ).length;
  const unreadRequests = codeRequests.filter(
    (req) => req.toUserId === forUserId && req.status === 'pending' && !req.read
  ).length;

  return unreadMessages + unreadInvites + unreadRequests;
}

/**
 * Handle accepting an invitation to join a project
 */
export function handleAcceptInvitation(
  invitation: InboxInvitation,
  userToAdd: { id: string; name: string; major?: string; avatarInitial: string },
  projects: Project[]
): Project[] {
  if (invitation.projectId === 'new_idea') {
    return projects;
  }

  return projects.map((p) => {
    if (p.id === invitation.projectId) {
      const alreadyMember = p.members.some((m) => m.userId === userToAdd.id);
      if (alreadyMember) return p;

      return {
        ...p,
        members: [
          ...p.members,
          {
            userId: userToAdd.id,
            name: userToAdd.name,
            role: invitation.roleOffered || 'Collaborator',
            major: userToAdd.major || 'Computer Science',
            avatarInitial: userToAdd.avatarInitial || 'M',
          },
        ],
      };
    }
    return p;
  });
}

/**
 * Handle responding to a code access request
 */
export function handleCodeRequestResponse(
  request: InboxCodeRequest,
  accept: boolean,
  repoUrl?: string
): InboxCodeRequest {
  return {
    ...request,
    status: accept ? 'accepted' : 'declined',
    grantedRepoUrl: accept ? (repoUrl || 'https://github.com/campusr/verified-student-repo') : undefined,
    read: true,
  };
}

/**
 * Curated high-fidelity mock GitHub repositories for demo fallback
 */
export const MOCK_GITHUB_REPOS: Record<string, GitHubRepo[]> = {
  'marcusvance-dev': [
    {
      id: 98101,
      name: 'buckeye-route-transit',
      full_name: 'marcusvance-dev/buckeye-route-transit',
      description: 'Campus transit route engine with real-time bus telemetry and ADA-compliant pathing.',
      html_url: 'https://github.com/marcusvance-dev/buckeye-route-transit',
      language: 'TypeScript',
      stargazers_count: 142,
      forks_count: 19,
      updated_at: '2026-10-22T19:40:00Z',
    },
    {
      id: 98102,
      name: 'distributed-sim-engine',
      full_name: 'marcusvance-dev/distributed-sim-engine',
      description: 'Zero-copy distributed multi-agent simulation framework in Rust.',
      html_url: 'https://github.com/marcusvance-dev/distributed-sim-engine',
      language: 'Rust',
      stargazers_count: 88,
      forks_count: 12,
      updated_at: '2026-10-15T11:20:00Z',
    },
    {
      id: 98103,
      name: 'canvas-rubric-sync',
      full_name: 'marcusvance-dev/canvas-rubric-sync',
      description: 'CLI tool syncing Git commit history directly into LMS rubric contribution views.',
      html_url: 'https://github.com/marcusvance-dev/canvas-rubric-sync',
      language: 'Python',
      stargazers_count: 34,
      forks_count: 4,
      updated_at: '2026-09-28T16:05:00Z',
    },
    {
      id: 98104,
      name: 'react-tactile-deck',
      full_name: 'marcusvance-dev/react-tactile-deck',
      description: 'Fluid spring physics card stack component with dynamic stamp feedback.',
      html_url: 'https://github.com/marcusvance-dev/react-tactile-deck',
      language: 'TypeScript',
      stargazers_count: 61,
      forks_count: 7,
      updated_at: '2026-10-20T08:15:00Z',
    },
  ],
  default: [
    {
      id: 81001,
      name: 'cross-campus-collaborator',
      full_name: 'student/cross-campus-collaborator',
      description: 'Inter-university team formation and skills matching algorithm.',
      html_url: 'https://github.com/student/cross-campus-collaborator',
      language: 'TypeScript',
      stargazers_count: 77,
      forks_count: 8,
      updated_at: '2026-10-21T14:30:00Z',
    },
    {
      id: 81002,
      name: 'neuro-vision-retina',
      full_name: 'student/neuro-vision-retina',
      description: 'Lightweight CNN inference on edge devices for retinal diagnostic scans.',
      html_url: 'https://github.com/student/neuro-vision-retina',
      language: 'Python',
      stargazers_count: 129,
      forks_count: 23,
      updated_at: '2026-10-19T09:12:00Z',
    },
    {
      id: 81003,
      name: 'quantum-anneal-opt',
      full_name: 'student/quantum-anneal-opt',
      description: 'Quadratic Unconstrained Binary Optimization (QUBO) benchmark suite.',
      html_url: 'https://github.com/student/quantum-anneal-opt',
      language: 'Julia',
      stargazers_count: 52,
      forks_count: 5,
      updated_at: '2026-10-10T17:45:00Z',
    },
  ],
};
