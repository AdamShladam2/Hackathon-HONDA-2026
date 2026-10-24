import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  Project,
  Idea,
  Endorsement,
  School,
  JoinRequest,
  StudentGrade,
  RubricCriteria,
  ShowcaseProject,
  InboxMessage,
  InboxInvitation,
  InboxCodeRequest,
  GitHubRepo,
  CodeAvailability,
  ShowcaseStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_IDEAS,
  INITIAL_ENDORSEMENTS,
  INITIAL_SHOWCASE_PROJECTS,
  INITIAL_INBOX_MESSAGES,
  INITIAL_INBOX_INVITATIONS,
  INITIAL_INBOX_CODE_REQUESTS,
} from '../data/mockData';
import { KNOWN_SCHOOLS, validateSchoolEmail } from '../utils/schoolDomain';
import { calculateGradeFromRubric } from '../utils/rubric';
import {
  canShareAsPublicCode,
  calculateUnreadInboxCount,
  handleAcceptInvitation,
  handleCodeRequestResponse,
  MOCK_GITHUB_REPOS,
} from '../utils/showcase';

export type NavTab = 'explore' | 'classes' | 'ideas' | 'profile' | 'showcase' | 'inbox';

interface AppContextType {
  currentUser: User | null;
  currentSchool: School | null;
  users: User[];
  projects: Project[];
  ideas: Idea[];
  endorsements: Endorsement[];
  joinRequests: JoinRequest[];
  showcaseProjects: ShowcaseProject[];
  inboxMessages: InboxMessage[];
  inboxInvitations: InboxInvitation[];
  inboxCodeRequests: InboxCodeRequest[];
  unreadInboxCount: number;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedShowcaseProjectId: string | null;
  setSelectedShowcaseProjectId: (id: string | null) => void;
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;
  isCreateProjectOpen: boolean;
  setIsCreateProjectOpen: (open: boolean) => void;
  isPostIdeaOpen: boolean;
  setIsPostIdeaOpen: (open: boolean) => void;
  isFindTeammatesOpen: boolean;
  setIsFindTeammatesOpen: (open: boolean) => void;
  isShareProjectOpen: boolean;
  setIsShareProjectOpen: (open: boolean) => void;
  shareSourceClassProject: Project | null;
  setShareSourceClassProject: (proj: Project | null) => void;
  loginWithEmail: (email: string, role?: 'student' | 'teacher') => { success: boolean; message?: string };
  switchUser: (userId: string) => void;
  toggleRole: () => void;
  logout: () => void;
  submitJoinRequest: (projectId: string, roleWanted: string, message: string) => void;
  respondToJoinRequest: (requestId: string, accept: boolean) => void;
  addEndorsement: (
    targetStudentId: string,
    projectId: string,
    badge: Endorsement['badge'],
    note: string
  ) => void;
  voteWorkWithAgain: (targetStudentId: string) => void;
  saveStudentGrade: (
    projectId: string,
    studentId: string,
    rubric: RubricCriteria,
    comments: string
  ) => void;
  addIdea: (title: string, problem: string, skillsNeeded: string[]) => void;
  expressInterestInIdea: (ideaId: string, note: string) => void;
  addIdeaComment: (ideaId: string, text: string) => void;
  convertIdeaToProject: (ideaId: string) => void;
  createNewProject: (newProject: Omit<Project, 'id' | 'revisions' | 'updates' | 'document'> & { initialDocSummary?: string }) => void;
  // Showcase and Inbox methods
  connectGitHub: (username: string) => Promise<{ success: boolean; reposCount: number; message?: string }>;
  disconnectGitHub: () => void;
  shareShowcaseProject: (data: {
    title: string;
    summary: string;
    description: string;
    useCases: string;
    mediaUrl?: string;
    liveDemoUrl?: string;
    tags: string[];
    codeAvailability: CodeAvailability;
    githubRepo?: GitHubRepo;
    githubRepoUrl?: string;
    status: ShowcaseStatus;
    openRoles: string[];
    isClassProject: boolean;
    sourceClassProjectId?: string;
  }) => { success: boolean; error?: string };
  toggleShowcaseInterest: (id: string) => void;
  incrementShowcaseView: (id: string) => void;
  sendDirectMessage: (toUserId: string, text: string, projectId?: string, projectTitle?: string) => void;
  sendCollaborationInvitation: (
    toUserId: string,
    projectId: string,
    projectTitle: string,
    roleOffered: string,
    note: string
  ) => void;
  requestCodeAccess: (
    toUserId: string,
    showcaseProjectId: string,
    showcaseProjectTitle: string,
    reason: string
  ) => void;
  respondToInvitation: (invitationId: string, accept: boolean) => void;
  respondToCodeRequest: (requestId: string, accept: boolean) => void;
  markInboxItemRead: (type: 'message' | 'invitation' | 'codeRequest', id: string) => void;
  markAllInboxRead: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local state persistence for demo experience
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [ideas, setIdeas] = useState<Idea[]>(INITIAL_IDEAS);
  const [endorsements, setEndorsements] = useState<Endorsement[]>(INITIAL_ENDORSEMENTS);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([
    {
      id: 'req-init-1',
      projectId: 'proj-1',
      projectTitle: 'BuckeyeRoute: Campus Transit Optimizer',
      userId: 'osu-student-10', // Samira Patel
      userName: 'Samira Patel',
      userMajor: 'Computer Science & Engineering',
      userEmail: 'patel.1105@osu.edu',
      roleWanted: 'Accessibility Tester',
      message: 'I have experience testing WCAG 2.1 compliance for campus transit maps and would love to help audit accessibility routes.',
      status: 'pending',
      createdAt: '2026-10-23 14:00',
    },
  ]);

  // Showcase state
  const [showcaseProjects, setShowcaseProjects] = useState<ShowcaseProject[]>(INITIAL_SHOWCASE_PROJECTS);
  const [selectedShowcaseProjectId, setSelectedShowcaseProjectId] = useState<string | null>(null);
  const [isShareProjectOpen, setIsShareProjectOpen] = useState(false);
  const [shareSourceClassProject, setShareSourceClassProject] = useState<Project | null>(null);

  // Inbox state
  const [inboxMessages, setInboxMessages] = useState<InboxMessage[]>(INITIAL_INBOX_MESSAGES);
  const [inboxInvitations, setInboxInvitations] = useState<InboxInvitation[]>(INITIAL_INBOX_INVITATIONS);
  const [inboxCodeRequests, setInboxCodeRequests] = useState<InboxCodeRequest[]>(INITIAL_INBOX_CODE_REQUESTS);

  // Current session: default to Marcus Vance (Student @ OSU) for immediate rich view
  const [currentUserId, setCurrentUserId] = useState<string>('osu-student-1');
  const [activeTab, setActiveTab] = useState<NavTab>('explore');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isPostIdeaOpen, setIsPostIdeaOpen] = useState(false);
  const [isFindTeammatesOpen, setIsFindTeammatesOpen] = useState(false);


  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || null;
  }, [users, currentUserId]);

  const currentSchool = useMemo(() => {
    if (!currentUser) return null;
    return (
      Object.values(KNOWN_SCHOOLS).find((s) => s.id === currentUser.schoolId) || {
        id: currentUser.schoolId,
        name: 'The Ohio State University',
        domain: 'osu.edu',
        shortName: 'OSU',
        mascot: 'Buckeyes',
        colors: { primary: '#BA0C2F', secondary: '#666666', accent: '#990000' },
      }
    );
  }, [currentUser]);

  const loginWithEmail = (email: string, requestedRole?: 'student' | 'teacher') => {
    const val = validateSchoolEmail(email);
    if (!val.isValid || !val.school) {
      return { success: false, message: val.errorMessage || 'Invalid school email' };
    }

    const trimmed = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === trimmed);

    if (existing) {
      // If user switched role toggle, update role
      if (requestedRole && existing.role !== requestedRole) {
        setUsers((prev) =>
          prev.map((u) => (u.id === existing.id ? { ...u, role: requestedRole } : u))
        );
      }
      setCurrentUserId(existing.id);
      return { success: true };
    }

    // Create new student or teacher user for the validated school
    const namePart = trimmed.split('@')[0];
    const cleanName = namePart
      .replace(/[0-9.]/g, ' ')
      .trim()
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') || 'Student User';

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: cleanName,
      email: trimmed,
      role: requestedRole || 'student',
      schoolId: val.school.id,
      major: requestedRole === 'teacher' ? undefined : 'General Engineering',
      year: requestedRole === 'teacher' ? undefined : 'Junior',
      department: requestedRole === 'teacher' ? 'Computer Science & Engineering' : undefined,
      title: requestedRole === 'teacher' ? 'Assistant Professor' : undefined,
      bio: `${cleanName} at ${val.school.name}.`,
      skills: requestedRole === 'teacher' ? ['Instruction', 'Architecture'] : ['Python', 'TypeScript', 'Problem Solving'],
      avatarInitial: cleanName.charAt(0).toUpperCase(),
      workWithAgainCount: 0,
      coursesTaught: requestedRole === 'teacher' ? ['CSE 2221'] : undefined,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    return { success: true };
  };

  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUserId(found.id);
    }
  };

  const toggleRole = () => {
    if (!currentUser) return;
    const targetRole = currentUser.role === 'student' ? 'teacher' : 'student';

    // Check if there is an existing instructor/student we can seamlessly toggle to, or toggle current user
    if (currentUser.role === 'student') {
      const teacher = users.find((u) => u.schoolId === currentUser.schoolId && u.role === 'teacher');
      if (teacher) {
        setCurrentUserId(teacher.id);
        return;
      }
    } else {
      const student = users.find((u) => u.schoolId === currentUser.schoolId && u.role === 'student');
      if (student) {
        setCurrentUserId(student.id);
        return;
      }
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, role: targetRole } : u))
    );
  };

  const logout = () => {
    // Switch to null or reset
    setCurrentUserId('');
  };

  const submitJoinRequest = (projectId: string, roleWanted: string, message: string) => {
    if (!currentUser) return;
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const newReq: JoinRequest = {
      id: `req-${Date.now()}`,
      projectId,
      projectTitle: project.title,
      userId: currentUser.id,
      userName: currentUser.name,
      userMajor: currentUser.major || 'College Student',
      userEmail: currentUser.email,
      roleWanted,
      message,
      status: 'pending',
      createdAt: 'Just now',
    };

    setJoinRequests((prev) => [newReq, ...prev]);
  };

  const respondToJoinRequest = (requestId: string, accept: boolean) => {
    const targetReq = joinRequests.find((r) => r.id === requestId);
    if (!targetReq) return;

    setJoinRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: accept ? 'accepted' : 'declined' } : r
      )
    );

    if (accept) {
      // Add member to project
      const applicant = users.find((u) => u.id === targetReq.userId);
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === targetReq.projectId) {
            const isAlreadyMember = p.members.some((m) => m.userId === targetReq.userId);
            if (isAlreadyMember) return p;
            return {
              ...p,
              members: [
                ...p.members,
                {
                  userId: targetReq.userId,
                  name: targetReq.userName,
                  role: targetReq.roleWanted || 'Contributor',
                  major: targetReq.userMajor,
                  avatarInitial: (applicant?.avatarInitial || targetReq.userName.charAt(0)).toUpperCase(),
                },
              ],
            };
          }
          return p;
        })
      );
    }
  };

  const addEndorsement = (
    targetStudentId: string,
    projectId: string,
    badge: Endorsement['badge'],
    note: string
  ) => {
    if (!currentUser) return;
    const proj = projects.find((p) => p.id === projectId);
    const newEndorsement: Endorsement = {
      id: `end-${Date.now()}`,
      studentId: targetStudentId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      projectId,
      projectName: proj?.title || 'Collaborative Project',
      badge,
      note,
      createdAt: 'Just now',
    };

    setEndorsements((prev) => [newEndorsement, ...prev]);
  };

  const voteWorkWithAgain = (targetStudentId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === targetStudentId
          ? { ...u, workWithAgainCount: (u.workWithAgainCount || 0) + 1 }
          : u
      )
    );
  };

  const saveStudentGrade = (
    projectId: string,
    studentId: string,
    rubric: RubricCriteria,
    comments: string
  ) => {
    if (!currentUser || currentUser.role !== 'teacher') return;
    const { scorePercentage, letterGrade } = calculateGradeFromRubric(rubric);

    const gradeRecord: StudentGrade = {
      studentId,
      projectId,
      rubric,
      scorePercentage,
      letterGrade,
      comments,
      gradedAt: new Date().toISOString(),
      gradedBy: currentUser.name,
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            grades: {
              ...(p.grades || {}),
              [studentId]: gradeRecord,
            },
          };
        }
        return p;
      })
    );
  };

  const addIdea = (title: string, problem: string, skillsNeeded: string[]) => {
    if (!currentUser || !currentSchool) return;

    const newIdea: Idea = {
      id: `idea-${Date.now()}`,
      title,
      problem,
      skillsNeeded,
      schoolId: currentSchool.id,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorMajor: currentUser.major || 'College Student',
      createdAt: 'Today',
      interestedUsers: [],
      comments: [],
    };

    setIdeas((prev) => [newIdea, ...prev]);
  };

  const expressInterestInIdea = (ideaId: string, note: string) => {
    if (!currentUser) return;
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id === ideaId) {
          const already = idea.interestedUsers.some((u) => u.userId === currentUser.id);
          if (already) return idea;
          return {
            ...idea,
            interestedUsers: [
              ...idea.interestedUsers,
              {
                userId: currentUser.id,
                userName: currentUser.name,
                note: note || 'Interested in contributing!',
                createdAt: 'Just now',
              },
            ],
          };
        }
        return idea;
      })
    );
  };

  const addIdeaComment = (ideaId: string, text: string) => {
    if (!currentUser) return;
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id === ideaId) {
          return {
            ...idea,
            comments: [
              ...idea.comments,
              {
                id: `c-${Date.now()}`,
                userId: currentUser.id,
                userName: currentUser.name,
                text,
                createdAt: 'Just now',
              },
            ],
          };
        }
        return idea;
      })
    );
  };

  const convertIdeaToProject = (ideaId: string) => {
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea || !currentUser) return;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: idea.title,
      tagline: idea.problem.slice(0, 110) + '...',
      description: idea.problem,
      schoolId: idea.schoolId,
      type: 'personal',
      tags: ['Student Spark', ...idea.skillsNeeded],
      skillsNeeded: idea.skillsNeeded,
      openToJoin: true,
      openRoles: ['Co-Founder', 'Lead Developer'],
      imageUrl: '/src/assets/images/project_campus_transit_1792852742239.jpg',
      ownerId: idea.authorId,
      members: [
        {
          userId: idea.authorId,
          name: idea.authorName,
          role: 'Founder & Project Lead',
          major: idea.authorMajor,
          avatarInitial: idea.authorName.charAt(0).toUpperCase(),
        },
      ],
      document: {
        id: `doc-${Date.now()}`,
        title: `${idea.title.replace(/[^a-zA-Z0-9]/g, '_')}_PRD.docx`,
        type: 'google_doc',
        fileName: `${idea.title.replace(/[^a-zA-Z0-9]/g, '_')}_PRD.docx`,
        lastModified: 'Just now',
        wordCount: 840,
        pageCount: 3,
        sections: [
          {
            heading: '1. Problem & Product Hypothesis',
            body: idea.problem,
          },
          {
            heading: '2. Target Users & Validation',
            body: `Seeded from campus idea board with ${idea.interestedUsers.length} interested students.`,
          },
        ],
      },
      revisions: [
        {
          id: `rev-${Date.now()}`,
          version: 'v0.1-draft',
          authorId: idea.authorId,
          authorName: idea.authorName,
          authorRole: 'Founder',
          timestamp: new Date().toISOString(),
          wordsAdded: 840,
          wordsRemoved: 0,
          summary: 'Transferred idea hypothesis and core scope into project documentation.',
          sessionDurationMinutes: 45,
        },
      ],
      updates: [
        {
          id: `up-${Date.now()}`,
          title: 'Project Initialized from Campus Idea',
          date: 'Today',
          authorName: idea.authorName,
          content: 'Officially graduated from concept stage to working project team!',
        },
      ],
    };

    setProjects((prev) => [newProject, ...prev]);
    setIdeas((prev) =>
      prev.map((i) => (i.id === ideaId ? { ...i, convertedToProjectId: newProject.id } : i))
    );
    setSelectedProjectId(newProject.id);
    setActiveTab('explore');
  };

  const createNewProject = (
    newProjData: Omit<Project, 'id' | 'revisions' | 'updates' | 'document'> & {
      initialDocSummary?: string;
    }
  ) => {
    if (!currentUser || !currentSchool) return;

    const projectId = `proj-${Date.now()}`;
    const newProject: Project = {
      ...newProjData,
      id: projectId,
      schoolId: currentSchool.id,
      ownerId: currentUser.id,
      document: {
        id: `doc-${Date.now()}`,
        title: `${newProjData.title.replace(/[^a-zA-Z0-9]/g, '_')}_Spec.docx`,
        type: 'word',
        fileName: `${newProjData.title.replace(/[^a-zA-Z0-9]/g, '_')}_Spec.docx`,
        lastModified: 'Just now',
        wordCount: 1150,
        pageCount: 4,
        sections: [
          {
            heading: '1. Executive Overview & Scope',
            body: newProjData.description,
          },
          {
            heading: '2. Technical Goals & Architecture',
            body: newProjData.initialDocSummary || 'Architecture design and implementation milestones.',
          },
        ],
      },
      revisions: [
        {
          id: `rev-${Date.now()}`,
          version: 'v0.1',
          authorId: currentUser.id,
          authorName: currentUser.name,
          authorRole: 'Project Creator',
          timestamp: new Date().toISOString(),
          wordsAdded: 1150,
          wordsRemoved: 0,
          summary: 'Authored initial project specification document.',
          sessionDurationMinutes: 60,
        },
      ],
      updates: [
        {
          id: `up-${Date.now()}`,
          title: 'Project Created',
          date: 'Today',
          authorName: currentUser.name,
          content: 'Project published on the school network and opened for team collaboration.',
        },
      ],
    };

    setProjects((prev) => [newProject, ...prev]);
    setSelectedProjectId(newProject.id);
  };

  // GitHub connection
  const connectGitHub = async (username: string) => {
    const cleanUsername = username.trim().replace(/^@/, '');
    if (!cleanUsername) return { success: false, reposCount: 0, message: 'Please provide a GitHub username' };

    let repos: GitHubRepo[] = [];
    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}/repos?sort=updated&per_page=15`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          repos = data.map((r: any) => ({
            id: r.id,
            name: r.name,
            full_name: r.full_name,
            description: r.description || null,
            html_url: r.html_url,
            language: r.language || null,
            stargazers_count: r.stargazers_count || 0,
            forks_count: r.forks_count || 0,
            updated_at: r.updated_at,
          }));
        }
      }
    } catch (err) {
      console.warn('GitHub API fetch failed or rate limited, falling back to mock repos', err);
    }

    if (repos.length === 0) {
      repos = MOCK_GITHUB_REPOS[cleanUsername] || [
        {
          id: 99101,
          name: `${cleanUsername}-core-project`,
          full_name: `${cleanUsername}/${cleanUsername}-core-project`,
          description: 'Open source campus collaboration and distributed systems toolkit.',
          html_url: `https://github.com/${cleanUsername}/${cleanUsername}-core-project`,
          language: 'TypeScript',
          stargazers_count: 54,
          forks_count: 8,
          updated_at: new Date().toISOString(),
        },
        {
          id: 99102,
          name: 'neural-graph-experiments',
          full_name: `${cleanUsername}/neural-graph-experiments`,
          description: 'Experiments in sparse attention graphs and local browser inference.',
          html_url: `https://github.com/${cleanUsername}/neural-graph-experiments`,
          language: 'Python',
          stargazers_count: 112,
          forks_count: 14,
          updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: 99103,
          name: 'campus-mobility-analysis',
          full_name: `${cleanUsername}/campus-mobility-analysis`,
          description: 'Interactive geospatial analysis of student pedestrian flow patterns.',
          html_url: `https://github.com/${cleanUsername}/campus-mobility-analysis`,
          language: 'Rust',
          stargazers_count: 36,
          forks_count: 4,
          updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
        },
      ];
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUserId
          ? {
              ...u,
              githubUsername: cleanUsername,
              githubConnected: true,
              githubRepos: repos,
            }
          : u
      )
    );

    return { success: true, reposCount: repos.length };
  };

  const disconnectGitHub = () => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUserId
          ? { ...u, githubUsername: undefined, githubConnected: false, githubRepos: [] }
          : u
      )
    );
  };

  const shareShowcaseProject = (data: {
    title: string;
    summary: string;
    description: string;
    useCases: string;
    mediaUrl?: string;
    liveDemoUrl?: string;
    tags: string[];
    codeAvailability: CodeAvailability;
    githubRepo?: GitHubRepo;
    githubRepoUrl?: string;
    status: ShowcaseStatus;
    openRoles: string[];
    isClassProject: boolean;
    sourceClassProjectId?: string;
  }) => {
    const check = canShareAsPublicCode(data.isClassProject, data.codeAvailability);
    if (!check.allowed) {
      return { success: false, error: check.reason };
    }

    if (!currentUser) return { success: false, error: 'Please sign in first' };

    const newProject: ShowcaseProject = {
      id: `showcase-${Date.now()}`,
      title: data.title,
      summary: data.summary,
      description: data.description,
      useCases: data.useCases,
      mediaUrl: data.mediaUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      liveDemoUrl: data.liveDemoUrl,
      tags: data.tags.length > 0 ? data.tags : ['General'],
      codeAvailability: data.codeAvailability,
      githubRepo: data.githubRepo,
      githubRepoUrl: data.githubRepoUrl || data.githubRepo?.html_url,
      status: data.status,
      openRoles: data.openRoles,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorSchoolId: currentUser.schoolId,
      authorSchoolName: currentSchool?.name || 'University',
      authorAvatarInitial: currentUser.avatarInitial,
      isClassProject: data.isClassProject,
      sourceClassProjectId: data.sourceClassProjectId,
      viewsCount: 1,
      interestedCount: 0,
      createdAt: new Date().toISOString(),
    };

    setShowcaseProjects((prev) => [newProject, ...prev]);
    return { success: true };
  };

  const toggleShowcaseInterest = (id: string) => {
    setShowcaseProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const currentlyInterested = p.userInterested ?? false;
          return {
            ...p,
            userInterested: !currentlyInterested,
            interestedCount: currentlyInterested ? Math.max(0, p.interestedCount - 1) : p.interestedCount + 1,
          };
        }
        return p;
      })
    );
  };

  const incrementShowcaseView = (id: string) => {
    setShowcaseProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, viewsCount: p.viewsCount + 1 } : p))
    );
  };

  const sendDirectMessage = (toUserId: string, text: string, projectId?: string, projectTitle?: string) => {
    if (!currentUser) return;
    const newMsg: InboxMessage = {
      id: `msg-${Date.now()}`,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      fromSchoolName: currentSchool?.name || 'University',
      toUserId,
      showcaseProjectId: projectId,
      showcaseProjectTitle: projectTitle,
      text,
      createdAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setInboxMessages((prev) => [newMsg, ...prev]);
  };

  const sendCollaborationInvitation = (
    toUserId: string,
    projectId: string,
    projectTitle: string,
    roleOffered: string,
    note: string
  ) => {
    if (!currentUser) return;
    const newInvite: InboxInvitation = {
      id: `inv-${Date.now()}`,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      fromSchoolName: currentSchool?.name || 'University',
      toUserId,
      projectId,
      projectTitle,
      roleOffered,
      note,
      status: 'pending',
      createdAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setInboxInvitations((prev) => [newInvite, ...prev]);
  };

  const requestCodeAccess = (
    toUserId: string,
    showcaseProjectId: string,
    showcaseProjectTitle: string,
    reason: string
  ) => {
    if (!currentUser) return;
    const newReq: InboxCodeRequest = {
      id: `req-${Date.now()}`,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      fromSchoolName: currentSchool?.name || 'University',
      toUserId,
      showcaseProjectId,
      showcaseProjectTitle,
      reason,
      status: 'pending',
      createdAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setInboxCodeRequests((prev) => [newReq, ...prev]);
  };

  const respondToInvitation = (invitationId: string, accept: boolean) => {
    const targetInvite = inboxInvitations.find((inv) => inv.id === invitationId);
    if (!targetInvite || !currentUser) return;

    setInboxInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId ? { ...inv, status: accept ? 'accepted' : 'declined', read: true } : inv
      )
    );

    if (accept) {
      setProjects((prev) =>
        handleAcceptInvitation(
          targetInvite,
          {
            id: currentUser.id,
            name: currentUser.name,
            major: currentUser.major,
            avatarInitial: currentUser.avatarInitial,
          },
          prev
        )
      );
    }
  };

  const respondToCodeRequest = (requestId: string, accept: boolean) => {
    const targetReq = inboxCodeRequests.find((r) => r.id === requestId);
    if (!targetReq) return;

    const proj = showcaseProjects.find((p) => p.id === targetReq.showcaseProjectId);
    const repoUrl = proj?.githubRepoUrl || proj?.githubRepo?.html_url || 'https://github.com/campusr/verified-student-repo';

    setInboxCodeRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? handleCodeRequestResponse(r, accept, repoUrl)
          : r
      )
    );
  };

  const markInboxItemRead = (type: 'message' | 'invitation' | 'codeRequest', id: string) => {
    if (type === 'message') {
      setInboxMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
    } else if (type === 'invitation') {
      setInboxInvitations((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)));
    } else if (type === 'codeRequest') {
      setInboxCodeRequests((prev) => prev.map((r) => (r.id === id ? { ...r, read: true } : r)));
    }
  };

  const markAllInboxRead = () => {
    if (!currentUser) return;
    setInboxMessages((prev) => prev.map((m) => (m.toUserId === currentUser.id ? { ...m, read: true } : m)));
    setInboxInvitations((prev) => prev.map((i) => (i.toUserId === currentUser.id ? { ...i, read: true } : i)));
    setInboxCodeRequests((prev) => prev.map((r) => (r.toUserId === currentUser.id ? { ...r, read: true } : r)));
  };

  const unreadInboxCount = useMemo(() => {
    if (!currentUser) return 0;
    return calculateUnreadInboxCount(inboxMessages, inboxInvitations, inboxCodeRequests, currentUser.id);
  }, [inboxMessages, inboxInvitations, inboxCodeRequests, currentUser]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentSchool,
        users,
        projects,
        ideas,
        endorsements,
        joinRequests,
        showcaseProjects,
        inboxMessages,
        inboxInvitations,
        inboxCodeRequests,
        unreadInboxCount,
        activeTab,
        setActiveTab,
        selectedProjectId,
        setSelectedProjectId,
        selectedShowcaseProjectId,
        setSelectedShowcaseProjectId,
        selectedStudentId,
        setSelectedStudentId,
        isCreateProjectOpen,
        setIsCreateProjectOpen,
        isPostIdeaOpen,
        setIsPostIdeaOpen,
        isFindTeammatesOpen,
        setIsFindTeammatesOpen,
        isShareProjectOpen,
        setIsShareProjectOpen,
        shareSourceClassProject,
        setShareSourceClassProject,
        loginWithEmail,
        switchUser,
        toggleRole,
        logout,
        submitJoinRequest,
        respondToJoinRequest,
        addEndorsement,
        voteWorkWithAgain,
        saveStudentGrade,
        addIdea,
        expressInterestInIdea,
        addIdeaComment,
        convertIdeaToProject,
        createNewProject,
        connectGitHub,
        disconnectGitHub,
        shareShowcaseProject,
        toggleShowcaseInterest,
        incrementShowcaseView,
        sendDirectMessage,
        sendCollaborationInvitation,
        requestCodeAccess,
        respondToInvitation,
        respondToCodeRequest,
        markInboxItemRead,
        markAllInboxRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};


export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
