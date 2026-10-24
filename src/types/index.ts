export interface School {
  id: string;
  name: string;
  domain: string;
  shortName: string;
  mascot: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  schoolId: string;
  major?: string;
  year?: string;
  department?: string;
  title?: string;
  bio: string;
  skills: string[];
  avatarInitial: string;
  workWithAgainCount: number;
  coursesTaught?: string[];
  githubUsername?: string;
  githubConnected?: boolean;
  githubRepos?: GitHubRepo[];
}


export interface Endorsement {
  id: string;
  studentId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  projectId: string;
  projectName: string;
  badge: 'Reliable' | 'Great at debugging' | 'Fast prototyper' | 'Clear communicator' | 'Creative designer' | 'Strong leadership' | 'Algorithmic rigor';
  note: string;
  createdAt: string;
}

export interface ProjectMember {
  userId: string;
  name: string;
  role: string;
  major: string;
  avatarInitial: string;
}

export interface JoinRequest {
  id: string;
  projectId: string;
  projectTitle: string;
  userId: string;
  userName: string;
  userMajor: string;
  userEmail: string;
  roleWanted: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface ProjectUpdate {
  id: string;
  title: string;
  date: string;
  authorName: string;
  content: string;
}

export interface Revision {
  id: string;
  version: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  timestamp: string;
  wordsAdded: number;
  wordsRemoved: number;
  summary: string;
  sessionDurationMinutes: number;
}

export interface RubricCriteria {
  contribution: number; // 1-5
  quality: number;      // 1-5
  collaboration: number;// 1-5
}

export interface StudentGrade {
  studentId: string;
  projectId: string;
  rubric: RubricCriteria;
  scorePercentage: number;
  letterGrade: string;
  comments: string;
  gradedAt: string;
  gradedBy: string;
}

export interface ProjectDocument {
  id: string;
  title: string;
  type: 'google_doc' | 'word';
  lastModified: string;
  wordCount: number;
  pageCount: number;
  fileName: string;
  sections: {
    heading: string;
    body: string;
  }[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  schoolId: string;
  type: 'class' | 'personal';
  courseCode?: string;
  courseName?: string;
  instructorId?: string;
  instructorName?: string;
  tags: string[];
  skillsNeeded: string[];
  openToJoin: boolean;
  openRoles: string[];
  members: ProjectMember[];
  ownerId: string;
  document: ProjectDocument;
  revisions: Revision[];
  updates: ProjectUpdate[];
  imageUrl?: string;
  grades?: Record<string, StudentGrade>; // studentId -> StudentGrade
}

export interface IdeaInterestedUser {
  userId: string;
  userName: string;
  note: string;
  createdAt: string;
}

export interface IdeaComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface Idea {
  id: string;
  title: string;
  problem: string;
  skillsNeeded: string[];
  schoolId: string;
  authorId: string;
  authorName: string;
  authorMajor: string;
  createdAt: string;
  interestedUsers: IdeaInterestedUser[];
  comments: IdeaComment[];
  convertedToProjectId?: string;
}

export type CodeAvailability = 'public' | 'on_request' | 'none';
export type ShowcaseStatus = 'active' | 'collaborating' | 'finished';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count?: number;
  updated_at: string;
}

export interface ShowcaseProject {
  id: string;
  title: string;
  summary: string;
  description: string;
  useCases: string;
  mediaUrl?: string;
  liveDemoUrl?: string;
  tags: string[];
  codeAvailability: CodeAvailability;
  githubRepo?: GitHubRepo;
  githubRepoUrl?: string; // stored when available/configured
  status: ShowcaseStatus;
  openRoles: string[];
  authorId: string;
  authorName: string;
  authorSchoolId: string;
  authorSchoolName: string;
  authorAvatarInitial: string;
  isClassProject: boolean;
  sourceClassProjectId?: string;
  viewsCount: number;
  interestedCount: number;
  userInterested?: boolean;
  createdAt: string;
}

export interface InboxMessage {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromSchoolName: string;
  toUserId: string;
  showcaseProjectId?: string;
  showcaseProjectTitle?: string;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface InboxInvitation {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromSchoolName: string;
  toUserId: string;
  projectId: string; // project ID or 'new_idea'
  projectTitle: string;
  roleOffered: string;
  note: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  read: boolean;
}

export interface InboxCodeRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromSchoolName: string;
  toUserId: string;
  showcaseProjectId: string;
  showcaseProjectTitle: string;
  reason: string;
  status: 'pending' | 'accepted' | 'declined';
  grantedRepoUrl?: string;
  createdAt: string;
  read: boolean;
}

