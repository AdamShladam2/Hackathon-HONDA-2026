import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Project,
  Author,
  GitHubRepo,
  Message,
  Invitation,
  CodeRequest,
  ProjectApplication,
  TeacherOpportunity,
  OpportunityApplication,
  ProjectTask,
  ProjectMilestone,
  WorkspaceDiscussion,
  TaskStatus,
  TeacherClass,
  ClassAssignment,
  WorkEvidence,
  PastWorkRecord,
  StudentTeam,
  ReusableProjectTemplate,
  StudentSubmission,
  SimilarityReport,
  ComparisonSource,
  TeammateRating,
  CanvasCourse,
  CanvasClassmate,
  CanvasUserConnection,
  TeamMember,
  ProjectAttachedFile,
  CanvasAssignment,
  UserIdentity,
  PeerAssessment,
} from '../types';
import { LAB_REPORT_DEMO_PROJECT, LAB_REPORT_DOC_EVIDENCE } from '../data/labReportDemo';
import {
  loadSavedCanvasConnection,
  saveCanvasConnection,
  clearCanvasConnection,
  connectCanvasBySchoolEmail,
  connectCanvasByCalendarFeed,
  getAllClassmates,
  fetchCanvasAssignments,
} from '../services/canvasService';
import {
  ALL_DEMO_ACCOUNTS,
  DEMO_STUDENTS,
  INITIAL_WORK_PROJECTS,
  INITIAL_APPLICATIONS,
  calculateCompatibilityScore,
} from '../data/mockData';
import {
  INITIAL_TEACHER_CLASSES,
  INITIAL_CLASS_ASSIGNMENTS,
  INITIAL_WORK_EVIDENCES,
  INITIAL_PAST_WORK_RECORDS,
  INITIAL_STUDENT_TEAMS,
  DEMO_TEACHER,
  DEMO_TEACHER_ENGR,
  INITIAL_REUSABLE_PROJECT_TEMPLATES,
  INITIAL_STUDENT_SUBMISSIONS,
  INITIAL_COMPARISON_SOURCES,
} from '../data/teacherData';
import { INITIAL_OPPORTUNITY_APPLICATIONS, INITIAL_TEACHER_OPPORTUNITIES } from '../data/teacherOpportunityData';
import {
  INITIAL_SHOWCASE_PROJECTS,
  INITIAL_CLASS_PROJECTS,
  INITIAL_MESSAGES,
  INITIAL_INVITATIONS,
  INITIAL_CODE_REQUESTS,
} from '../data/campusData';
import { INITIAL_TEAMMATE_RATINGS, getUserRatingSummary } from '../data/ratingData';
import { ENGR_STUDENT_ID, ENGR_STUDENT_PAST_WORK, ENGR_STUDENT_RATINGS } from '../data/engrStudentDemo';
import { fetchUserRepos } from '../services/github';
import { calculateSimilarity } from '../services/similarityChecker';
import {
  AppMode,
  getCampusForEmail,
  isSameCampus,
  authorBelongsToCampus,
  isBlockedEmail,
  BLOCKED_EMAIL_MESSAGE,
  migrateLegacyEmails,
} from '../services/campusAccess';
import { InstitutionMeta } from '../data/canvasData';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning';
  message: string;
}

export type ViewType =
  | 'discover'
  | 'find-teammates'
  | 'my-projects'
  | 'profile'
  | 'showcase'
  | 'campus-hub'
  | 'work-hub'
  | 'teacher-dashboard'
  | 'course-posts'
  | 'teacher-students'
  | 'teacher-opportunities'
  | 'teacher-integrity'
  | 'teammate-match'
  | 'inbox'
  | 'workspace'
  | 'canvas-classes'
  | 'my-classes'
  | 'opportunities';

// Views that only exist in Campus mode (.edu accounts) or Discover mode (everyone)
export const CAMPUS_VIEWS: ViewType[] = [
  'campus-hub',
  'my-classes',
  'canvas-classes',
  'opportunities',
  'teacher-dashboard',
  'course-posts',
  'teacher-students',
  'teacher-opportunities',
  'teacher-integrity',
];
// Teachers only see these three views
export const TEACHER_VIEWS: ViewType[] = ['teacher-students', 'course-posts', 'teacher-integrity', 'teacher-opportunities'];
export const DISCOVER_VIEWS: ViewType[] = ['discover', 'work-hub', 'showcase'];

interface AppContextType {
  // Current user & account switching
  currentUser: Author;
  allDemoAccounts: Author[];
  campusDirectory: Author[]; // Other app users at the signed-in user's campus
  switchUser: (userId: string) => void;
  isSignedIn: boolean;
  signInWithEmail: (details: { email: string; name: string; identity: UserIdentity }) => { success: boolean; message: string };
  signOut: () => void;
  userRepos: GitHubRepo[];
  isGitHubConnecting: boolean;
  connectGitHub: (username: string) => Promise<{ success: boolean; count: number; source: 'api' | 'mock' }>;
  disconnectGitHub: () => void;

  // App modes: Campus (verified .edu, scoped to the user's school) vs Discover (everyone)
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  hasChosenMode: boolean;
  userCampus: InstitutionMeta | null;
  canAccessCampus: boolean;
  campusClassProjects: Project[];
  campusClassAssignments: ClassAssignment[];

  // Canvas LMS & School Email Integration
  canvasConnection: CanvasUserConnection;
  isDemoAccount: boolean;
  isCanvasConnecting: boolean;
  connectCanvas: (
    email: string,
    apiToken?: string,
    customDomain?: string,
    calendarFeedUrl?: string
  ) => Promise<{ success: boolean; message: string }>;
  disconnectCanvas: () => void;
  isCanvasModalOpen: boolean;
  openCanvasModal: () => void;
  closeCanvasModal: () => void;
  selectedCanvasCourseId: string;
  setSelectedCanvasCourseId: (id: string) => void;
  allCanvasClassmates: CanvasClassmate[];
  classmatesLookingForTeam: CanvasClassmate[];
  addPeerAssessments: (projectId: string, assessments: PeerAssessment[]) => void;
  loadCanvasAssignments: (
    courseId: string
  ) => Promise<{ assignments: CanvasAssignment[]; source: 'canvas_api' | 'calendar_feed' | 'directory' }>;

  // Projects
  projects: Project[]; // All Showcase projects (combines work + campus showcase)
  workProjects: Project[]; // Work Hub projects
  classProjects: Project[]; // Campus Hub class projects
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;

  // Navigation
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;

  // Modals
  isShareModalOpen: boolean;
  openShareModal: (initialData?: Partial<Project>) => void;
  closeShareModal: () => void;
  shareModalInitialData?: Partial<Project>;

  isCreateWorkModalOpen: boolean;
  openCreateWorkModal: (initialData?: Partial<Project>) => void;
  closeCreateWorkModal: () => void;

  isAccountSwitcherOpen: boolean;
  openAccountSwitcher: () => void;
  closeAccountSwitcher: () => void;

  isGitHubModalOpen: boolean;
  openGitHubModal: () => void;
  closeGitHubModal: () => void;

  isCollaborateModalOpen: boolean;
  collaborateTargetProject: Project | null;
  openCollaborateModal: (project: Project) => void;
  closeCollaborateModal: () => void;
  classInviteTarget: { author: Author; courseHint?: string } | null;
  openClassInvite: (author: Author, courseHint?: string) => void;
  closeClassInvite: () => void;

  isApplyModalOpen: boolean;
  applyTargetProject: Project | null;
  openApplyModal: (project: Project) => void;
  closeApplyModal: () => void;

  isMessageModalOpen: boolean;
  messageTargetAuthor: Author | null;
  messageTargetProject?: Project | null;
  openMessageModal: (author: Author, project?: Project) => void;
  closeMessageModal: () => void;

  // Workspace
  activeWorkspaceProject: Project | null;
  openWorkspace: (project: Project) => void;
  closeWorkspace: () => void;
  addTask: (projectId: string, task: Omit<ProjectTask, 'id' | 'createdAt' | 'createdById'>) => void;
  updateTaskStatus: (projectId: string, taskId: string, status: TaskStatus, deliverableUrl?: string, feedbackNote?: string) => void;
  addMilestone: (projectId: string, milestone: Omit<ProjectMilestone, 'id'>) => void;
  toggleMilestone: (projectId: string, milestoneId: string) => void;
  addWorkspaceDiscussion: (projectId: string, content: string) => void;

  // Teacher & Academic Integrity Dashboard
  teacherClasses: TeacherClass[];
  classAssignments: ClassAssignment[];
  studentTeams: StudentTeam[];
  workEvidences: WorkEvidence[];
  pastWorkRecords: Record<string, PastWorkRecord[]>;
  createTeacherClass: (classData: Omit<TeacherClass, 'id'>) => TeacherClass;
  createClassAssignment: (assignmentData: Omit<ClassAssignment, 'id' | 'createdAt' | 'teacherId' | 'teacherName'>) => ClassAssignment;
  updateAssignmentStatus: (assignmentId: string, status: 'Draft' | 'Published' | 'Archived') => void;
  toggleAssignmentArchive: (assignmentId: string) => void;
  deleteClassAssignment: (assignmentId: string) => void;
  submitWorkEvidence: (evidence: Omit<WorkEvidence, 'id' | 'date'>) => WorkEvidence;
  reviewContribution: (evidenceId: string, status: 'Reviewer-confirmed' | 'Needs clarification', feedback: string) => void;

  // Teacher Project Search & Classroom Reusable Templates
  reusableProjectTemplates: ReusableProjectTemplate[];
  addProjectToClass: (template: ReusableProjectTemplate, customData: Partial<ClassAssignment>) => ClassAssignment;

  // Classroom Student Submissions & AI-Assisted Similarity Checker
  studentSubmissions: StudentSubmission[];
  comparisonSources: ComparisonSource[];
  submitStudentWork: (submissionData: Omit<StudentSubmission, 'id' | 'submissionDate' | 'similarityChecked'>) => StudentSubmission;
  runSimilarityCheck: (submissionId: string, mode?: 'text' | 'code') => Promise<SimilarityReport>;
  updateSimilarityReview: (
    reportId: string,
    status: SimilarityReport['teacherReviewStatus'],
    notes: string,
    requestExplanation?: boolean
  ) => void;

  // Modals for Similarity & Assignment Management
  inspectingSimilarityReport: SimilarityReport | null;
  openSimilarityReport: (report: SimilarityReport) => void;
  closeSimilarityReport: () => void;

  isAddProjectModalOpen: boolean;
  templateToAddToClass: ReusableProjectTemplate | null;
  openAddProjectModal: (template: ReusableProjectTemplate) => void;
  closeAddProjectModal: () => void;

  isCreateAssignmentModalOpen: boolean;
  openCreateAssignmentModal: () => void;
  closeCreateAssignmentModal: () => void;

  isStudentSubmitModalOpen: boolean;
  targetAssignmentForSubmission: ClassAssignment | null;
  openStudentSubmitModal: (assignment: ClassAssignment) => void;
  closeStudentSubmitModal: () => void;

  // Contribution Portfolio & Revision Viewer Modals
  viewingPortfolioUser: Author | null;
  openPortfolio: (user: Author) => void;
  closePortfolio: () => void;
  viewingDocumentEvidence: WorkEvidence | null;
  openDocumentTimeline: (evidence: WorkEvidence) => void;
  closeDocumentTimeline: () => void;

  // Quick Demo Switching
  loginAsTeacher: (teacherId?: string) => void;
  loginAsStudent: (studentId?: string) => void;

  // Project Actions
  addProject: (
    projectData: Omit<Project, 'id' | 'createdAt' | 'viewCount' | 'interestCount' | 'author' | 'teamMembers'> & {
      teamMembers?: TeamMember[];
      attachedFiles?: ProjectAttachedFile[];
    },
    options?: { campusHub?: boolean }
  ) => Project;
  addWorkProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'viewCount' | 'interestCount' | 'author' | 'teamMembers'>) => Project;
  toggleInterest: (projectId: string) => void;

  // Inbox & Applications
  applications: ProjectApplication[];
  isTeacher: boolean;
  teacherOpportunities: TeacherOpportunity[];
  opportunityApplications: OpportunityApplication[];
  addTeacherOpportunity: (position: Omit<TeacherOpportunity, 'id' | 'teacherId' | 'teacherName' | 'teacherAvatar' | 'department' | 'school' | 'status' | 'createdAt'>) => void;
  setTeacherOpportunityStatus: (positionId: string, status: TeacherOpportunity['status']) => void;
  applyToTeacherOpportunity: (positionId: string, message?: string, resume?: ProjectAttachedFile) => void;
  setOpportunityApplicationStatus: (applicationId: string, status: OpportunityApplication['status']) => void;
  applyToProject: (
    projectId: string,
    roleApplied: string,
    introduction: string,
    availability: string,
    learningGoals?: string,
    resume?: ProjectAttachedFile
  ) => void;
  setUserResume: (resume: ProjectAttachedFile | undefined) => void;
  acceptApplication: (applicationId: string) => void;
  declineApplication: (applicationId: string) => void;

  messages: Message[];
  invitations: Invitation[];
  codeRequests: CodeRequest[];
  unreadCount: number;
  inboxTab: 'messages' | 'invitations' | 'codeRequests' | 'applications';
  setInboxTab: (tab: 'messages' | 'invitations' | 'codeRequests' | 'applications') => void;

  sendMessage: (toAuthor: Author, content: string, project?: Project) => void;
  sendReply: (messageId: string, content: string) => void;
  markMessageRead: (messageId: string) => void;

  sendInvitation: (
    projectId: string,
    projectTitle: string,
    toAuthor: Author,
    roleOffered: string,
    note: string,
    extra?: { assignmentName?: string; courseCode?: string }
  ) => void;
  acceptInvitation: (invitationId: string) => void;
  declineInvitation: (invitationId: string) => void;

  requestCodeAccess: (project: Project, note: string) => void;
  acceptCodeRequest: (requestId: string) => void;
  declineCodeRequest: (requestId: string) => void;

  // Teammate Ratings & Peer Feedback
  teammateRatings: TeammateRating[];
  addTeammateRating: (ratingData: Omit<TeammateRating, 'id' | 'createdAt'>) => void;
  getUserRatings: (userId: string) => TeammateRating[];
  getUserRatingSummaryData: (userId: string) => { averageScore: number; reviewCount: number; ratings: TeammateRating[] };

  // AI-Assisted Contribution Analysis Modal
  analyzingProject: Project | null;
  openContributionAnalysisModal: (project: Project) => void;
  closeContributionAnalysisModal: () => void;

  // Rate Teammate Modal
  isRateTeammateModalOpen: boolean;
  ratingTargetUser: Author | null;
  ratingTargetProject: Project | null;
  openRateTeammateModal: (user: Author, project?: Project) => void;
  closeRateTeammateModal: () => void;

  // Onboarding Modal
  isOnboardingModalOpen: boolean;
  openOnboardingModal: () => void;
  closeOnboardingModal: () => void;

  // Helpers
  getCompatibility: (project: Project) => ReturnType<typeof calculateCompatibilityScore>;

  // Feedback Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'skillsink_hub_v2_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (raw) return JSON.parse(migrateLegacyEmails(raw));
  } catch (e) {
    console.warn(`Error loading ${key} from storage:`, e);
  }
  return fallback;
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Error saving ${key} to storage:`, e);
  }
}

// Simple initials avatar for accounts created by email sign-in
function initialsAvatar(name: string): string {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="160" height="160" fill="#4f46e5"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial,sans-serif" font-size="64" font-weight="700" fill="#fff">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current User with fallback to Alex Chen
  const [currentUser, setCurrentUser] = useState<Author>(() => {
    return loadFromStorage<Author>('currentUser', DEMO_STUDENTS[0]);
  });

  const [isSignedIn, setIsSignedIn] = useState<boolean>(() => loadFromStorage<boolean>('isSignedIn', true));
  // Accounts created by signing in with an email (stored in this browser only)
  const [localAccounts, setLocalAccounts] = useState<Author[]>(() => loadFromStorage<Author[]>('localAccounts', []));

  const [userRepos, setUserRepos] = useState<GitHubRepo[]>([]);
  const [isGitHubConnecting, setIsGitHubConnecting] = useState(false);

  // Showcase Projects
  const [projects, setProjects] = useState<Project[]>(() => {
    return loadFromStorage<Project[]>('projects', [...INITIAL_WORK_PROJECTS, ...INITIAL_SHOWCASE_PROJECTS]);
  });

  // Class Projects for Campus Hub
  const [classProjects, setClassProjects] = useState<Project[]>(() => {
    const stored = loadFromStorage<Project[]>('classProjects', INITIAL_CLASS_PROJECTS);
    // The lab report demo is refreshed from its seed (keeping ratings added since), so saved data picks up demo updates
    const savedDemo = stored.find((p) => p.id === LAB_REPORT_DEMO_PROJECT.id);
    const demo = { ...LAB_REPORT_DEMO_PROJECT, peerAssessments: savedDemo?.peerAssessments || LAB_REPORT_DEMO_PROJECT.peerAssessments };
    return savedDemo ? stored.map((p) => (p.id === demo.id ? demo : p)) : [demo, ...stored];
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeWorkspaceProject, setActiveWorkspaceProject] = useState<Project | null>(null);
  const [activeView, setActiveViewState] = useState<ViewType>(() =>
    loadFromStorage<AppMode>('appMode', 'discover') === 'campus' ? 'campus-hub' : 'discover'
  );
  const [appMode, setAppModeState] = useState<AppMode>(() => loadFromStorage<AppMode>('appMode', 'discover'));
  const [hasChosenMode, setHasChosenMode] = useState<boolean>(() => loadFromStorage<boolean>('hasChosenMode', false));

  // Campus identity comes from the account email (.edu only); older saved users fall back to the demo record
  const accountEmail =
    currentUser.email || ALL_DEMO_ACCOUNTS.find((a) => a.id === currentUser.id)?.email || '';
  const userCampus = getCampusForEmail(accountEmail);
  // Demo personas may use built-in sample Canvas courses; real accounts load live Canvas data
  const isDemoAccount = ALL_DEMO_ACCOUNTS.some((a) => a.id === currentUser.id);
  const canAccessCampus = userCampus !== null;

  // Teammate Ratings state
  const [teammateRatings, setTeammateRatings] = useState<TeammateRating[]>(() => {
    // Seeds the ENGR 1181 demo student's ratings into browsers that saved ratings before she existed
    const saved = loadFromStorage<TeammateRating[]>('teammateRatings', INITIAL_TEAMMATE_RATINGS);
    return [...saved, ...ENGR_STUDENT_RATINGS.filter((r) => !saved.some((s) => s.id === r.id))];
  });

  // Contribution Analysis Modal & Rate Teammate Modal & Onboarding Modal
  const [analyzingProject, setAnalyzingProject] = useState<Project | null>(null);
  const [isRateTeammateModalOpen, setIsRateTeammateModalOpen] = useState(false);
  const [ratingTargetUser, setRatingTargetUser] = useState<Author | null>(null);
  const [ratingTargetProject, setRatingTargetProject] = useState<Project | null>(null);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  // Modals state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareModalInitialData, setShareModalInitialData] = useState<Partial<Project> | undefined>(undefined);

  const [isCreateWorkModalOpen, setIsCreateWorkModalOpen] = useState(false);
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);

  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  // Canvas LMS & School Email Integration state
  const [rawCanvasConnection, setCanvasConnection] = useState<CanvasUserConnection>(() => loadSavedCanvasConnection());
  const [isCanvasConnecting, setIsCanvasConnecting] = useState(false);
  // Canvas API token is kept in memory only for this session, never persisted
  const [canvasApiToken, setCanvasApiToken] = useState<string | undefined>(undefined);

  // A Canvas connection only counts when it belongs to the signed-in user's own campus
  const canvasOwner = (rawCanvasConnection.ownerEmail || rawCanvasConnection.schoolEmail || '').toLowerCase();
  const canvasMatchesCampus =
    rawCanvasConnection.isConnected &&
    canvasOwner === accountEmail.toLowerCase() &&
    (isDemoAccount ||
      rawCanvasConnection.source === 'canvas_api_token' ||
      rawCanvasConnection.source === 'canvas_calendar_feed') &&
    isSameCampus(getCampusForEmail(rawCanvasConnection.schoolEmail), userCampus);
  const canvasConnection: CanvasUserConnection = canvasMatchesCampus
    ? rawCanvasConnection
    : {
        isConnected: false,
        schoolEmail: '',
        institutionName: userCampus?.name || '',
        institutionDomain: '',
        source: 'domain_simulation',
        courses: [],
      };
  const [isCanvasModalOpen, setIsCanvasModalOpen] = useState(false);
  const [selectedCanvasCourseId, setSelectedCanvasCourseId] = useState<string>('all');

  const [isCollaborateModalOpen, setIsCollaborateModalOpen] = useState(false);
  const [collaborateTargetProject, setCollaborateTargetProject] = useState<Project | null>(null);
  const [classInviteTarget, setClassInviteTarget] = useState<{ author: Author; courseHint?: string } | null>(null);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyTargetProject, setApplyTargetProject] = useState<Project | null>(null);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageTargetAuthor, setMessageTargetAuthor] = useState<Author | null>(null);
  const [messageTargetProject, setMessageTargetProject] = useState<Project | null>(null);

  // Inbox & Applications state
  const [applications, setApplications] = useState<ProjectApplication[]>(() => {
    return loadFromStorage<ProjectApplication[]>('applications', INITIAL_APPLICATIONS);
  });
  const [teacherOpportunities, setTeacherOpportunities] = useState<TeacherOpportunity[]>(() =>
    loadFromStorage<TeacherOpportunity[]>('teacherOpportunities', INITIAL_TEACHER_OPPORTUNITIES)
  );
  const [opportunityApplications, setOpportunityApplications] = useState<OpportunityApplication[]>(() =>
    loadFromStorage<OpportunityApplication[]>('opportunityApplications', INITIAL_OPPORTUNITY_APPLICATIONS)
  );
  const [messages, setMessages] = useState<Message[]>(() => {
    return loadFromStorage<Message[]>('messages', INITIAL_MESSAGES);
  });
  const [invitations, setInvitations] = useState<Invitation[]>(() => {
    return loadFromStorage<Invitation[]>('invitations', INITIAL_INVITATIONS);
  });
  const [codeRequests, setCodeRequests] = useState<CodeRequest[]>(() => {
    return loadFromStorage<CodeRequest[]>('codeRequests', INITIAL_CODE_REQUESTS);
  });
  const [inboxTab, setInboxTab] = useState<'messages' | 'invitations' | 'codeRequests' | 'applications'>('applications');

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Teacher & Academic Integrity Dashboard States
  const [teacherClasses, setTeacherClasses] = useState<TeacherClass[]>(() => {
    return loadFromStorage<TeacherClass[]>('teacherClasses', INITIAL_TEACHER_CLASSES);
  });
  const [classAssignments, setClassAssignments] = useState<ClassAssignment[]>(() => {
    return loadFromStorage<ClassAssignment[]>('classAssignments', INITIAL_CLASS_ASSIGNMENTS);
  });
  const [studentTeams, setStudentTeams] = useState<StudentTeam[]>(() => {
    return loadFromStorage<StudentTeam[]>('studentTeams', INITIAL_STUDENT_TEAMS);
  });
  const [workEvidences, setWorkEvidences] = useState<WorkEvidence[]>(() => {
    const stored = loadFromStorage<WorkEvidence[]>('workEvidences', INITIAL_WORK_EVIDENCES);
    // The lab report demo's Google Doc was added later, so make sure saved data includes it
    return stored.some((e) => e.id === LAB_REPORT_DOC_EVIDENCE.id) ? stored : [LAB_REPORT_DOC_EVIDENCE, ...stored];
  });
  const [pastWorkRecords, setPastWorkRecords] = useState<Record<string, PastWorkRecord[]>>(() => {
    const saved = loadFromStorage<Record<string, PastWorkRecord[]>>('pastWorkRecords', INITIAL_PAST_WORK_RECORDS);
    // The ENGR 1181 demo student's records always come from the seed, like the lab report demo
    return { ...saved, [ENGR_STUDENT_ID]: ENGR_STUDENT_PAST_WORK };
  });

  // Teacher Project Search & Reusable Templates
  const [reusableProjectTemplates, setReusableProjectTemplates] = useState<ReusableProjectTemplate[]>(() => {
    return loadFromStorage<ReusableProjectTemplate[]>('reusableProjectTemplates', INITIAL_REUSABLE_PROJECT_TEMPLATES);
  });

  // Classroom Student Submissions
  const [studentSubmissions, setStudentSubmissions] = useState<StudentSubmission[]>(() => {
    return loadFromStorage<StudentSubmission[]>('studentSubmissions', INITIAL_STUDENT_SUBMISSIONS);
  });

  // Reference comparison sources
  const [comparisonSources, setComparisonSources] = useState<ComparisonSource[]>(() => {
    return loadFromStorage<ComparisonSource[]>('comparisonSources', INITIAL_COMPARISON_SOURCES);
  });

  // Modals for Similarity & Add to Class
  const [inspectingSimilarityReport, setInspectingSimilarityReport] = useState<SimilarityReport | null>(null);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [templateToAddToClass, setTemplateToAddToClass] = useState<ReusableProjectTemplate | null>(null);
  const [isCreateAssignmentModalOpen, setIsCreateAssignmentModalOpen] = useState(false);
  const [isStudentSubmitModalOpen, setIsStudentSubmitModalOpen] = useState(false);
  const [targetAssignmentForSubmission, setTargetAssignmentForSubmission] = useState<ClassAssignment | null>(null);

  // Contribution Portfolio & Revision Viewer Modals
  const [viewingPortfolioUser, setViewingPortfolioUser] = useState<Author | null>(null);
  const [viewingDocumentEvidence, setViewingDocumentEvidence] = useState<WorkEvidence | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveToStorage('currentUser', currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveToStorage('appMode', appMode);
  }, [appMode]);

  useEffect(() => {
    saveToStorage('classProjects', classProjects);
  }, [classProjects]);

  useEffect(() => {
    saveToStorage('isSignedIn', isSignedIn);
  }, [isSignedIn]);

  useEffect(() => {
    saveToStorage('localAccounts', localAccounts);
  }, [localAccounts]);

  useEffect(() => {
    saveToStorage('hasChosenMode', hasChosenMode);
  }, [hasChosenMode]);

  // Drop back to Discover when the signed-in account can't use Campus mode
  useEffect(() => {
    if (appMode === 'campus' && !canAccessCampus) {
      setAppModeState('discover');
      setActiveViewState('discover');
    }
  }, [appMode, canAccessCampus]);

  useEffect(() => {
    saveToStorage('projects', projects);
  }, [projects]);

  useEffect(() => {
    saveToStorage('applications', applications);
  }, [applications]);
  useEffect(() => {
    saveToStorage('teacherOpportunities', teacherOpportunities);
  }, [teacherOpportunities]);
  useEffect(() => {
    saveToStorage('opportunityApplications', opportunityApplications);
  }, [opportunityApplications]);

  useEffect(() => {
    saveToStorage('messages', messages);
  }, [messages]);

  useEffect(() => {
    saveToStorage('invitations', invitations);
  }, [invitations]);

  useEffect(() => {
    saveToStorage('codeRequests', codeRequests);
  }, [codeRequests]);

  useEffect(() => {
    saveToStorage('teacherClasses', teacherClasses);
  }, [teacherClasses]);

  useEffect(() => {
    saveToStorage('classAssignments', classAssignments);
  }, [classAssignments]);

  useEffect(() => {
    saveToStorage('studentTeams', studentTeams);
  }, [studentTeams]);

  useEffect(() => {
    saveToStorage('workEvidences', workEvidences);
  }, [workEvidences]);

  useEffect(() => {
    saveToStorage('pastWorkRecords', pastWorkRecords);
  }, [pastWorkRecords]);

  useEffect(() => {
    saveToStorage('reusableProjectTemplates', reusableProjectTemplates);
  }, [reusableProjectTemplates]);

  useEffect(() => {
    saveToStorage('studentSubmissions', studentSubmissions);
  }, [studentSubmissions]);

  useEffect(() => {
    saveToStorage('comparisonSources', comparisonSources);
  }, [comparisonSources]);

  useEffect(() => {
    saveToStorage('teammateRatings', teammateRatings);
  }, [teammateRatings]);

  const campusLockedMessage = 'Campus mode is only available to accounts with a .edu school email.';

  const setAppMode = (mode: AppMode) => {
    if (mode === 'campus' && !canAccessCampus) {
      showToast(campusLockedMessage, 'warning');
      return;
    }
    setAppModeState(mode);
    setHasChosenMode(true);
    setActiveViewState(mode === 'campus' ? 'campus-hub' : 'discover');
  };

  const isTeacher = currentUser.identities.includes('Teacher / Professor');

  // Teacher mode is Campus-only with three views; any other route lands on their class posts
  useEffect(() => {
    if (!isSignedIn || !isTeacher) return;
    if (!hasChosenMode) setHasChosenMode(true);
    if (appMode !== 'campus') setAppModeState('campus');
    if (!TEACHER_VIEWS.includes(activeView)) setActiveViewState('course-posts');
  }, [isSignedIn, isTeacher, hasChosenMode, appMode, activeView]);

  // Navigating to a mode-specific view switches into that mode (Campus requires a .edu account)
  const setActiveView = (view: ViewType) => {
    if (CAMPUS_VIEWS.includes(view)) {
      if (!canAccessCampus) {
        showToast(campusLockedMessage, 'warning');
        return;
      }
      setAppModeState('campus');
    } else if (DISCOVER_VIEWS.includes(view)) {
      setAppModeState('discover');
    }
    setActiveViewState(view);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Switch User
  const switchUser = (userId: string) => {
    const target = ALL_DEMO_ACCOUNTS.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setIsSignedIn(true);
      setUserRepos([]);
      showToast(`Switched profile to: ${target.name} (${target.identities.join(', ')})`, 'info');
    }
  };

  // Email sign-in: reuses a matching demo or local account, otherwise creates one in this browser
  const signInWithEmail = ({ email, name, identity }: { email: string; name: string; identity: UserIdentity }) => {
    // Old buckeyemail.osu.edu addresses sign in to the same @osu.edu account
    const cleanEmail = migrateLegacyEmails(email.trim().toLowerCase());
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (isBlockedEmail(cleanEmail)) {
      return { success: false, message: BLOCKED_EMAIL_MESSAGE };
    }
    const sameEmail = (a: Author) => (a.email || '').toLowerCase() === cleanEmail;
    let account: Author | undefined = localAccounts.find(sameEmail) || ALL_DEMO_ACCOUNTS.find(sameEmail);

    if (!account) {
      const cleanName = name.trim();
      if (!cleanName) {
        return { success: false, message: 'Please enter your name to create your account.' };
      }
      const campus = getCampusForEmail(cleanEmail);
      const isTeacher = identity === 'Teacher / Professor';
      account = {
        id: `user_local_${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        avatar: initialsAvatar(cleanName),
        bio: '',
        identities: [identity],
        school: campus && !isTeacher ? campus.name : undefined,
        organization: campus && isTeacher ? campus.name : undefined,
        skills: [],
        githubConnected: false,
      };
      const created = account;
      setLocalAccounts((prev) => [...prev, created]);
    }

    const signedIn: Author = account;
    setCurrentUser(signedIn);
    setUserRepos([]);
    setIsSignedIn(true);
    setHasChosenMode(false);
    showToast(`Signed in as ${signedIn.name}`, 'success');
    return { success: true, message: '' };
  };

  // Sessions from blocked email domains (e.g. signed in before the block) are signed out
  useEffect(() => {
    if (isSignedIn && isBlockedEmail(currentUser.email)) {
      signOut();
      showToast(BLOCKED_EMAIL_MESSAGE, 'warning');
    }
  }, [isSignedIn, currentUser.email]);

  const signOut = () => {
    setIsSignedIn(false);
    setHasChosenMode(false);
    setAppModeState('discover');
    setActiveViewState('discover');
    setUserRepos([]);
    showToast('Signed out', 'info');
  };

  // Reset Demo Data
  const resetAllDemoData = () => {
    localStorage.clear();
    setCurrentUser(DEMO_STUDENTS[0]);
    setProjects([...INITIAL_WORK_PROJECTS, ...INITIAL_SHOWCASE_PROJECTS]);
    setApplications(INITIAL_APPLICATIONS);
    setTeacherOpportunities(INITIAL_TEACHER_OPPORTUNITIES);
    setOpportunityApplications(INITIAL_OPPORTUNITY_APPLICATIONS);
    setMessages(INITIAL_MESSAGES);
    setInvitations(INITIAL_INVITATIONS);
    setCodeRequests(INITIAL_CODE_REQUESTS);
    setTeacherClasses(INITIAL_TEACHER_CLASSES);
    setClassAssignments(INITIAL_CLASS_ASSIGNMENTS);
    setStudentTeams(INITIAL_STUDENT_TEAMS);
    setWorkEvidences([LAB_REPORT_DOC_EVIDENCE, ...INITIAL_WORK_EVIDENCES]);
    setPastWorkRecords({ ...INITIAL_PAST_WORK_RECORDS, [ENGR_STUDENT_ID]: ENGR_STUDENT_PAST_WORK });
    setReusableProjectTemplates(INITIAL_REUSABLE_PROJECT_TEMPLATES);
    setStudentSubmissions(INITIAL_STUDENT_SUBMISSIONS);
    setComparisonSources(INITIAL_COMPARISON_SOURCES);
    setTeammateRatings([...INITIAL_TEAMMATE_RATINGS, ...ENGR_STUDENT_RATINGS]);
    showToast('Demo data reset to fresh state', 'info');
  };

  // Teammate Ratings Handlers
  const addTeammateRating = (ratingData: Omit<TeammateRating, 'id' | 'createdAt'>) => {
    const newRating: TeammateRating = {
      ...ratingData,
      id: `rate-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setTeammateRatings((prev) => [newRating, ...prev]);
    showToast(`Teammate feedback submitted for ${ratingData.targetUserName}! (${newRating.overallScore}/5.0)`, 'success');
  };

  const getUserRatings = (userId: string) => {
    return teammateRatings.filter((r) => r.targetUserId === userId && !r.flagged);
  };

  const getUserRatingSummaryData = (userId: string) => {
    return getUserRatingSummary(userId, teammateRatings);
  };

  // Contribution Analysis Modal
  const openContributionAnalysisModal = (project: Project) => {
    setAnalyzingProject(project);
  };

  const closeContributionAnalysisModal = () => {
    setAnalyzingProject(null);
  };

  // Rate Teammate Modal
  const openRateTeammateModal = (user: Author, project?: Project) => {
    setRatingTargetUser(user);
    setRatingTargetProject(project || null);
    setIsRateTeammateModalOpen(true);
  };

  const closeRateTeammateModal = () => {
    setRatingTargetUser(null);
    setRatingTargetProject(null);
    setIsRateTeammateModalOpen(false);
  };

  // Onboarding Modal
  const openOnboardingModal = () => {
    setIsOnboardingModalOpen(true);
  };

  const closeOnboardingModal = () => {
    setIsOnboardingModalOpen(false);
  };

  // Modal helpers
  const openSimilarityReport = (report: SimilarityReport) => {
    setInspectingSimilarityReport(report);
  };

  const closeSimilarityReport = () => {
    setInspectingSimilarityReport(null);
  };

  const openAddProjectModal = (template: ReusableProjectTemplate) => {
    setTemplateToAddToClass(template);
    setIsAddProjectModalOpen(true);
  };

  const closeAddProjectModal = () => {
    setTemplateToAddToClass(null);
    setIsAddProjectModalOpen(false);
  };

  const openCreateAssignmentModal = () => {
    setIsCreateAssignmentModalOpen(true);
  };

  const closeCreateAssignmentModal = () => {
    setIsCreateAssignmentModalOpen(false);
  };

  const openStudentSubmitModal = (assignment: ClassAssignment) => {
    setTargetAssignmentForSubmission(assignment);
    setIsStudentSubmitModalOpen(true);
  };

  const closeStudentSubmitModal = () => {
    setTargetAssignmentForSubmission(null);
    setIsStudentSubmitModalOpen(false);
  };

  // Teacher & Academic Integrity Dashboard Actions
  const createTeacherClass = (classData: Omit<TeacherClass, 'id'>) => {
    const newClass: TeacherClass = {
      ...classData,
      id: `class-${Date.now()}`,
    };
    setTeacherClasses((prev) => [newClass, ...prev]);
    showToast(`Created class: ${newClass.code} - ${newClass.name}`, 'success');
    return newClass;
  };

  const createClassAssignment = (
    assignmentData: Omit<ClassAssignment, 'id' | 'createdAt' | 'teacherId' | 'teacherName'>
  ) => {
    const newAssignment: ClassAssignment = {
      ...assignmentData,
      id: `assign-${Date.now()}`,
      createdAt: new Date().toISOString(),
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      studentTeamIds: [],
      instructionsText: assignmentData.instructionsText || assignmentData.instructions || '',
      groupSize: assignmentData.groupSize || {
        min: assignmentData.teamSizeMin || 1,
        max: assignmentData.teamSizeMax || 4,
      },
      status: assignmentData.status || 'Published',
      isArchived: false,
    };
    setClassAssignments((prev) => [newAssignment, ...prev]);

    // Register assignment instructions in comparison sources for boilerplate filtering
    setComparisonSources((prev) => [
      {
        id: `source-prompt-${newAssignment.id}`,
        title: `${newAssignment.classCode} Assignment Prompt: ${newAssignment.title}`,
        sourceType: 'Course Material',
        rawText: `${newAssignment.instructionsText} Objectives: ${(newAssignment.learningObjectives || []).join('. ')}. Deliverables: ${newAssignment.expectedDeliverables.join('. ')}.`,
        isAuthorized: true,
      },
      ...prev,
    ]);

    showToast(`Created academic assignment: "${newAssignment.title}" with anti-copying protections`, 'success');
    return newAssignment;
  };

  const updateAssignmentStatus = (assignmentId: string, status: 'Draft' | 'Published' | 'Archived') => {
    setClassAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, status, isArchived: status === 'Archived' } : a))
    );
    showToast(`Assignment status updated to: ${status}`, 'info');
  };

  const toggleAssignmentArchive = (assignmentId: string) => {
    setClassAssignments((prev) =>
      prev.map((a) => {
        if (a.id === assignmentId) {
          const nextArchived = !a.isArchived;
          return { ...a, isArchived: nextArchived, status: nextArchived ? 'Archived' : 'Published' };
        }
        return a;
      })
    );
    showToast('Assignment archive state updated', 'info');
  };

  const deleteClassAssignment = (assignmentId: string) => {
    setClassAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
    showToast('Assignment removed from class', 'info');
  };

  const addProjectToClass = (
    template: ReusableProjectTemplate,
    customData: Partial<ClassAssignment>
  ): ClassAssignment => {
    const targetClass = teacherClasses.find((c) => c.id === customData.classId) || teacherClasses[0];
    const newAssignment: ClassAssignment = {
      id: `assign-${Date.now()}`,
      title: customData.title || template.title,
      classId: targetClass.id,
      classCode: targetClass.code,
      className: targetClass.name,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      description: customData.description || template.summary,
      instructionsText: customData.instructionsText || customData.instructions || template.description,
      instructions: customData.instructionsText || customData.instructions || template.description,
      learningObjectives: customData.learningObjectives || template.learningObjectives,
      expectedDeliverables: customData.expectedDeliverables || template.expectedDeliverables,
      requiredSkills: customData.requiredSkills || template.skills,
      groupSize: {
        min: customData.teamSizeMin || template.suggestedTeamSize.min,
        max: customData.teamSizeMax || template.suggestedTeamSize.max,
      },
      teamSizeMin: customData.teamSizeMin || template.suggestedTeamSize.min,
      teamSizeMax: customData.teamSizeMax || template.suggestedTeamSize.max,
      dueDate: customData.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      collaborationRules:
        customData.collaborationRules ||
        'High-level conceptual collaboration permitted across teams; codebases, benchmarks, and written reports must be unique.',
      submissionRequirements:
        customData.submissionRequirements ||
        'Written synthesis report, architecture schema, and private repository link.',
      allowPublicShowcase: customData.allowPublicShowcase ?? false,
      requireTeacherApprovalForShowcase: true,
      hideSourceCodeByDefault: true,
      preventPublicRepoAttachment: true,
      codePolicy: 'No code or on-request only (strict academic anti-copying guarantee)',
      assignmentType: customData.assignmentType || (template.suggestedTeamSize.max > 1 ? 'Group' : 'Individual'),
      gradingRubric: customData.gradingRubric || template.defaultGradingRubric,
      milestones: customData.milestones || [],
      academicIntegrityPolicy:
        customData.academicIntegrityPolicy ||
        'Automated n-gram shingle similarity checking is applied against peer submissions and reference solutions. Text overlap is evaluated in teacher review.',
      status: customData.status || 'Published',
      isArchived: false,
      sourceTemplateId: template.id,
      createdAt: new Date().toISOString(),
      studentTeamIds: [],
    };

    setClassAssignments((prev) => [newAssignment, ...prev]);

    // Register assignment instructions in comparison sources
    setComparisonSources((prev) => [
      {
        id: `source-prompt-${newAssignment.id}`,
        title: `${newAssignment.classCode} Assignment Prompt: ${newAssignment.title}`,
        sourceType: 'Course Material',
        rawText: `${newAssignment.instructionsText} Objectives: ${(newAssignment.learningObjectives || []).join('. ')}. Deliverables: ${newAssignment.expectedDeliverables.join('. ')}.`,
        isAuthorized: true,
      },
      ...prev,
    ]);

    showToast(`Added "${newAssignment.title}" to ${newAssignment.classCode} (${newAssignment.status})!`, 'success');
    return newAssignment;
  };

  const submitStudentWork = (
    submissionData: Omit<StudentSubmission, 'id' | 'submissionDate' | 'similarityChecked'>
  ): StudentSubmission => {
    const newSubmission: StudentSubmission = {
      ...submissionData,
      id: `sub-${Date.now()}`,
      submissionDate: new Date().toISOString(),
      similarityChecked: false,
      revisionStatus: 'Original',
      gradeStatus: 'Ungraded',
    };

    setStudentSubmissions((prev) => [newSubmission, ...prev]);

    // Register this student's submission in comparison sources for peer overlap detection
    setComparisonSources((prev) => [
      {
        id: `source-peer-${newSubmission.id}`,
        title: `${newSubmission.assignmentTitle} - Submission by ${newSubmission.studentName}`,
        authorName: newSubmission.studentName,
        sourceType: 'Peer Submission',
        rawText: newSubmission.textContent,
        rawCode: newSubmission.codeSnippet,
        isAuthorized: true,
      },
      ...prev,
    ]);

    showToast(`Work submitted for "${newSubmission.assignmentTitle}"! Ready for similarity review.`, 'success');
    return newSubmission;
  };

  const runSimilarityCheck = async (
    submissionId: string,
    mode: 'text' | 'code' = 'text'
  ): Promise<SimilarityReport> => {
    const targetSub = studentSubmissions.find((s) => s.id === submissionId);
    if (!targetSub) {
      throw new Error(`Submission ${submissionId} not found`);
    }

    // Exclude current student's own submission from comparison sources
    const eligibleSources = comparisonSources.filter(
      (src) => src.id !== `source-peer-${submissionId}` && !src.title.includes(targetSub.studentName)
    );

    const report = calculateSimilarity(targetSub, eligibleSources, mode);

    setStudentSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              similarityChecked: true,
              similarityReport: report,
            }
          : s
      )
    );

    if (inspectingSimilarityReport && inspectingSimilarityReport.submissionId === submissionId) {
      setInspectingSimilarityReport(report);
    }

    showToast(
      `Similarity check complete for ${targetSub.studentName}: ${report.overallOverlapPercent}% text overlap detected (${report.matchingPassages.length} passages)`,
      report.overallOverlapPercent > 40 ? 'warning' : 'info'
    );

    return report;
  };

  const updateSimilarityReview = (
    reportId: string,
    status: SimilarityReport['teacherReviewStatus'],
    notes: string,
    requestExplanation: boolean = false
  ) => {
    setStudentSubmissions((prev) =>
      prev.map((s) => {
        if (s.similarityReport && s.similarityReport.id === reportId) {
          const updatedReport: SimilarityReport = {
            ...s.similarityReport,
            teacherReviewStatus: status,
            teacherNotes: notes,
            teacherReviewDate: new Date().toISOString().split('T')[0],
            studentExplanationRequested: requestExplanation,
          };
          return {
            ...s,
            similarityReport: updatedReport,
          };
        }
        return s;
      })
    );

    if (inspectingSimilarityReport && inspectingSimilarityReport.id === reportId) {
      setInspectingSimilarityReport((curr) =>
        curr
          ? {
              ...curr,
              teacherReviewStatus: status,
              teacherNotes: notes,
              teacherReviewDate: new Date().toISOString().split('T')[0],
              studentExplanationRequested: requestExplanation,
            }
          : null
      );
    }

    showToast(`Updated review decision: "${status}"`, 'success');
  };

  const submitWorkEvidence = (
    evidenceData: Omit<WorkEvidence, 'id' | 'date'>
  ) => {
    // Generate simulated revision history for Google Docs / Slides if none provided
    const timeline = evidenceData.documentTimeline && evidenceData.documentTimeline.length > 0
      ? evidenceData.documentTimeline
      : (evidenceData.evidenceType === 'Google Docs' || evidenceData.evidenceType === 'Google Slides')
        ? [
            {
              timestamp: new Date().toISOString(),
              authorName: currentUser.name,
              authorId: currentUser.id,
              action: `Authored: ${evidenceData.title}`,
              section: evidenceData.claimedSections?.[0] || 'Core Deliverable',
              note: 'Simulated collaborative revision event for hackathon demo.',
            },
            {
              timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
              authorName: currentUser.name,
              authorId: currentUser.id,
              action: 'Drafted implementation notes & architecture schema',
              section: 'Architecture & Specifications',
              note: 'Initial revision and section scaffold.',
            },
          ]
        : undefined;

    const newEvidence: WorkEvidence = {
      ...evidenceData,
      id: `ev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      documentTimeline: timeline,
      contributors: evidenceData.contributors || [
        { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
      ],
    };

    setWorkEvidences((prev) => [newEvidence, ...prev]);

    // Also link into the user's past work record
    setPastWorkRecords((prev) => {
      const userRecords = prev[currentUser.id] || [];
      const existingRecordIndex = userRecords.findIndex(
        (r) => r.projectId === evidenceData.associatedProjectId
      );

      if (existingRecordIndex >= 0) {
        const updatedRecords = [...userRecords];
        updatedRecords[existingRecordIndex] = {
          ...updatedRecords[existingRecordIndex],
          evidenceList: [newEvidence, ...updatedRecords[existingRecordIndex].evidenceList],
        };
        return { ...prev, [currentUser.id]: updatedRecords };
      } else {
        const newRecord: PastWorkRecord = {
          id: `pw-${Date.now()}`,
          projectId: evidenceData.associatedProjectId || 'proj-academic',
          projectTitle: evidenceData.associatedProjectTitle || 'Class Project Contribution',
          isAcademicProject: true,
          role: 'Contributor & Implementer',
          responsibilities: [evidenceData.description],
          skillsDemonstrated: (currentUser.skills || []).slice(0, 4),
          individualContributionSummary: evidenceData.description,
          completedTasks: [evidenceData.title],
          evidenceList: [newEvidence],
          reviewerConfirmedCount: 0,
          overallStatus: newEvidence.status,
          isPublicShowcaseApproved: true,
        };
        return { ...prev, [currentUser.id]: [newRecord, ...userRecords] };
      }
    });

    showToast(`Evidence "${newEvidence.title}" submitted successfully for instructor review!`, 'success');
    return newEvidence;
  };

  const reviewContribution = (
    evidenceId: string,
    status: 'Reviewer-confirmed' | 'Needs clarification',
    feedback: string
  ) => {
    setWorkEvidences((prev) =>
      prev.map((ev) => {
        if (ev.id === evidenceId) {
          return {
            ...ev,
            status,
            reviewedBy: {
              id: currentUser.id,
              name: currentUser.name,
              role: currentUser.jobTitle || 'Course Instructor (Prof. Robert Hayes)',
            },
            reviewedDate: new Date().toISOString().split('T')[0],
            reviewerFeedback: feedback,
          };
        }
        return ev;
      })
    );

    // Update in pastWorkRecords across all users
    setPastWorkRecords((prev) => {
      const nextRecords: Record<string, PastWorkRecord[]> = {};
      for (const [userId, records] of Object.entries(prev)) {
        nextRecords[userId] = records.map((record) => {
          let hasUpdatedEvidence = false;
          const updatedEvidenceList = record.evidenceList.map((ev) => {
            if (ev.id === evidenceId) {
              hasUpdatedEvidence = true;
              return {
                ...ev,
                status,
                reviewedBy: {
                  id: currentUser.id,
                  name: currentUser.name,
                  role: currentUser.jobTitle || 'Course Instructor (Prof. Robert Hayes)',
                },
                reviewedDate: new Date().toISOString().split('T')[0],
                reviewerFeedback: feedback,
              };
            }
            return ev;
          });

          if (hasUpdatedEvidence) {
            const confirmedCount = updatedEvidenceList.filter((e) => e.status === 'Reviewer-confirmed').length;
            return {
              ...record,
              evidenceList: updatedEvidenceList,
              reviewerConfirmedCount: confirmedCount,
              overallStatus: confirmedCount > 0 ? 'Reviewer-confirmed' : status,
              reviewerNotes: feedback,
              reviewedByTeacher: currentUser.name,
              reviewedDate: new Date().toISOString().split('T')[0],
            };
          }
          return record;
        });
      }
      return nextRecords;
    });

    showToast(
      status === 'Reviewer-confirmed'
        ? `Contribution officially verified with instructor feedback stamp!`
        : `Clarification requested with instructor notes sent to student.`,
      status === 'Reviewer-confirmed' ? 'success' : 'info'
    );
  };

  const openPortfolio = (user: Author) => {
    setViewingPortfolioUser(user);
  };

  const closePortfolio = () => {
    setViewingPortfolioUser(null);
  };

  const openDocumentTimeline = (evidence: WorkEvidence) => {
    setViewingDocumentEvidence(evidence);
  };

  const closeDocumentTimeline = () => {
    setViewingDocumentEvidence(null);
  };

  const loginAsTeacher = (teacherId?: string) => {
    const teacher = teacherId === DEMO_TEACHER_ENGR.id ? DEMO_TEACHER_ENGR : DEMO_TEACHER;
    setCurrentUser(teacher);
    setIsSignedIn(true);
    setAppModeState('campus');
    setActiveViewState('course-posts');
    setHasChosenMode(true);
    showToast(`Logged in as ${teacher.name} (Teacher / Professor)`, 'success');
  };

  const loginAsStudent = (studentId = 'user_alex_chen') => {
    const student = ALL_DEMO_ACCOUNTS.find((a) => a.id === studentId) || DEMO_STUDENTS[0];
    setCurrentUser(student);
    setIsSignedIn(true);
    const studentCampus = getCampusForEmail(student.email);
    setAppModeState(studentCampus ? 'campus' : 'discover');
    setHasChosenMode(true);
    setActiveViewState(studentCampus ? 'campus-hub' : 'discover');
    showToast(`Logged in as ${student.name} (Student)`, 'info');
  };

  // Connect GitHub
  const connectGitHub = async (
    username: string
  ): Promise<{ success: boolean; count: number; source: 'api' | 'mock' }> => {
    setIsGitHubConnecting(true);
    const result = await fetchUserRepos(username);
    setIsGitHubConnecting(false);

    if (result.repos.length > 0) {
      setUserRepos(result.repos);
      setCurrentUser((prev) => ({
        ...prev,
        githubUsername: username.trim().replace(/^@/, ''),
        githubConnected: true,
      }));
      showToast(
        result.source === 'api'
          ? `Successfully connected GitHub: @${username} (${result.repos.length} public repos loaded)`
          : `Connected @${username} (Loaded ${result.repos.length} repositories)`,
        'success'
      );
      return { success: true, count: result.repos.length, source: result.source };
    } else {
      showToast('Could not load repositories. Please check username.', 'warning');
      return { success: false, count: 0, source: 'mock' };
    }
  };

  const disconnectGitHub = () => {
    setCurrentUser((prev) => ({
      ...prev,
      githubUsername: '',
      githubConnected: false,
    }));
    setUserRepos([]);
    showToast('GitHub disconnected', 'info');
  };

  // Canvas LMS Methods & Helpers
  const connectCanvas = async (
    email: string,
    apiToken?: string,
    customDomain?: string,
    calendarFeedUrl?: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!userCampus) {
      showToast(campusLockedMessage, 'warning');
      return { success: false, message: campusLockedMessage };
    }
    const emailCampus = getCampusForEmail(email);
    if (emailCampus && !isSameCampus(emailCampus, userCampus)) {
      const msg = `You can only connect Canvas for your own campus (${userCampus.name}).`;
      showToast(msg, 'warning');
      return { success: false, message: msg };
    }
    setIsCanvasConnecting(true);
    try {
      const res = calendarFeedUrl
        ? await connectCanvasByCalendarFeed(email, calendarFeedUrl)
        : await connectCanvasBySchoolEmail(email, apiToken, customDomain, isDemoAccount);
      const owned = { ...res.connection, ownerEmail: accountEmail.toLowerCase() };
      saveCanvasConnection(owned);
      setCanvasConnection(owned);
      setCanvasApiToken(calendarFeedUrl ? undefined : apiToken?.trim() || undefined);
      setIsCanvasConnecting(false);
      showToast(res.message, 'success');
      return { success: true, message: res.message };
    } catch (err: any) {
      setIsCanvasConnecting(false);
      const errMsg = err?.message || 'Failed to connect to Canvas LMS. Please verify your school email.';
      showToast(errMsg, 'warning');
      return { success: false, message: errMsg };
    }
  };

  const disconnectCanvas = () => {
    const cleared = clearCanvasConnection();
    setCanvasConnection(cleared);
    setCanvasApiToken(undefined);
    showToast('Canvas LMS disconnected', 'info');
  };

  const openCanvasModal = () => setIsCanvasModalOpen(true);
  const closeCanvasModal = () => setIsCanvasModalOpen(false);

  const allCanvasClassmates = getAllClassmates(canvasConnection.courses || []);

  const campusDirectory = [...ALL_DEMO_ACCOUNTS, ...localAccounts].filter(
    (a, i, all) =>
      a.id !== currentUser.id && authorBelongsToCampus(a, userCampus) && all.findIndex((b) => b.id === a.id) === i
  );

  // Saves a reviewer's ratings, replacing their earlier rating of the same person on the same assignment
  const addPeerAssessments = (projectId: string, assessments: PeerAssessment[]) => {
    const merge = (p: Project): Project => {
      if (p.id !== projectId) return p;
      const replaced = (p.peerAssessments || []).filter(
        (old) =>
          !assessments.some(
            (n) =>
              n.reviewerId === old.reviewerId &&
              n.revieweeId === old.revieweeId &&
              n.assignmentName.toLowerCase() === old.assignmentName.toLowerCase()
          )
      );
      const names = new Set([...(p.projectAssignments || []), ...assessments.map((a) => a.assignmentName)]);
      return { ...p, peerAssessments: [...replaced, ...assessments], projectAssignments: Array.from(names) };
    };
    setClassProjects((prev) => prev.map(merge));
    setProjects((prev) => prev.map(merge));
    setSelectedProject((prev) => (prev ? merge(prev) : prev));
    showToast(`Saved ${assessments.length} peer assessment${assessments.length === 1 ? '' : 's'}`, 'success');
  };

  const loadCanvasAssignments = async (courseId: string) => {
    const course = canvasConnection.courses.find((c) => c.id === courseId);
    if (!canvasConnection.isConnected || !course) {
      return { assignments: [] as CanvasAssignment[], source: 'directory' as const };
    }
    return fetchCanvasAssignments(canvasConnection, course, canvasApiToken);
  };

  // Campus-scoped coursework: only projects and assignments from the user's own school
  const campusClassProjects = classProjects.filter(
    (p) =>
      (p.school || '').toLowerCase() === (userCampus?.name || '').toLowerCase() ||
      authorBelongsToCampus(p.author, userCampus)
  );
  const campusClassAssignments = classAssignments.filter((a) => {
    const teacher = ALL_DEMO_ACCOUNTS.find((acc) => acc.id === a.teacherId);
    return teacher ? authorBelongsToCampus(teacher, userCampus) : a.teacherId === currentUser.id;
  });
  const classmatesLookingForTeam = allCanvasClassmates.filter((c) => c.lookingForTeam);

  // Modal handlers
  const openShareModal = (initialData?: Partial<Project>) => {
    setShareModalInitialData(initialData);
    setIsShareModalOpen(true);
  };
  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setShareModalInitialData(undefined);
  };

  const openCreateWorkModal = (initialData?: Partial<Project>) => {
    setShareModalInitialData(initialData);
    setIsCreateWorkModalOpen(true);
  };
  const closeCreateWorkModal = () => {
    setIsCreateWorkModalOpen(false);
    setShareModalInitialData(undefined);
  };

  const openAccountSwitcher = () => setIsAccountSwitcherOpen(true);
  const closeAccountSwitcher = () => setIsAccountSwitcherOpen(false);

  const openGitHubModal = () => setIsGitHubModalOpen(true);
  const closeGitHubModal = () => setIsGitHubModalOpen(false);

  const openCollaborateModal = (project: Project) => {
    setCollaborateTargetProject(project);
    setIsCollaborateModalOpen(true);
  };
  const closeCollaborateModal = () => {
    setCollaborateTargetProject(null);
    setIsCollaborateModalOpen(false);
  };

  const openClassInvite = (author: Author, courseHint?: string) => setClassInviteTarget({ author, courseHint });
  const closeClassInvite = () => setClassInviteTarget(null);

  const openApplyModal = (project: Project) => {
    setApplyTargetProject(project);
    setIsApplyModalOpen(true);
  };
  const closeApplyModal = () => {
    setApplyTargetProject(null);
    setIsApplyModalOpen(false);
  };

  const openMessageModal = (author: Author, project?: Project) => {
    setMessageTargetAuthor(author);
    setMessageTargetProject(project || null);
    setIsMessageModalOpen(true);
  };
  const closeMessageModal = () => {
    setMessageTargetAuthor(null);
    setMessageTargetProject(null);
    setIsMessageModalOpen(false);
  };

  // Workspace handlers
  const openWorkspace = (project: Project) => {
    // Keep reference updated
    const live = projects.find((p) => p.id === project.id) || project;
    setActiveWorkspaceProject(live);
    setActiveView('workspace');
  };

  const closeWorkspace = () => {
    setActiveWorkspaceProject(null);
    setActiveView('work-hub');
  };

  const addTask = (projectId: string, taskData: Omit<ProjectTask, 'id' | 'createdAt' | 'createdById'>) => {
    const newTask: ProjectTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdById: currentUser.id,
      createdAt: new Date().toISOString(),
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const tasks = p.tasks || [];
          return {
            ...p,
            tasks: [...tasks, newTask],
          };
        }
        return p;
      })
    );

    if (activeWorkspaceProject?.id === projectId) {
      setActiveWorkspaceProject((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          tasks: [...(prev.tasks || []), newTask],
        };
      });
    }

    showToast(`Task "${newTask.title}" added to project!`, 'success');
  };

  const updateTaskStatus = (
    projectId: string,
    taskId: string,
    status: TaskStatus,
    deliverableUrl?: string,
    feedbackNote?: string
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const tasks = (p.tasks || []).map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status,
                  deliverableUrl: deliverableUrl !== undefined ? deliverableUrl : t.deliverableUrl,
                  feedbackNote: feedbackNote !== undefined ? feedbackNote : t.feedbackNote,
                }
              : t
          );
          return { ...p, tasks };
        }
        return p;
      })
    );

    if (activeWorkspaceProject?.id === projectId) {
      setActiveWorkspaceProject((prev) => {
        if (!prev) return null;
        const tasks = (prev.tasks || []).map((t) =>
          t.id === taskId
            ? {
                ...t,
                status,
                deliverableUrl: deliverableUrl !== undefined ? deliverableUrl : t.deliverableUrl,
                feedbackNote: feedbackNote !== undefined ? feedbackNote : t.feedbackNote,
              }
            : t
        );
        return { ...prev, tasks };
      });
    }

    showToast(`Task status updated to "${status}"`, 'success');
  };

  const addMilestone = (projectId: string, milestoneData: Omit<ProjectMilestone, 'id'>) => {
    const newMilestone: ProjectMilestone = {
      ...milestoneData,
      id: `m-${Date.now()}`,
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            milestones: [...(p.milestones || []), newMilestone],
          };
        }
        return p;
      })
    );

    if (activeWorkspaceProject?.id === projectId) {
      setActiveWorkspaceProject((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          milestones: [...(prev.milestones || []), newMilestone],
        };
      });
    }

    showToast('Project milestone added', 'success');
  };

  const toggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const milestones = (p.milestones || []).map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          );
          return { ...p, milestones };
        }
        return p;
      })
    );

    if (activeWorkspaceProject?.id === projectId) {
      setActiveWorkspaceProject((prev) => {
        if (!prev) return null;
        const milestones = (prev.milestones || []).map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        return { ...prev, milestones };
      });
    }
  };

  const addWorkspaceDiscussion = (projectId: string, content: string) => {
    const newDisc: WorkspaceDiscussion = {
      id: `disc-${Date.now()}`,
      projectId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.jobTitle || (currentUser.identities.includes('Student') ? 'Student Contributor' : 'Team Member'),
      content,
      timestamp: new Date().toISOString(),
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            discussions: [...(p.discussions || []), newDisc],
          };
        }
        return p;
      })
    );

    if (activeWorkspaceProject?.id === projectId) {
      setActiveWorkspaceProject((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          discussions: [...(prev.discussions || []), newDisc],
        };
      });
    }

    showToast('Posted message to project workspace', 'success');
  };

  // Add General Showcase Project
  const addProject = (
    projectData: Omit<Project, 'id' | 'createdAt' | 'viewCount' | 'interestCount' | 'author' | 'teamMembers'> & {
      teamMembers?: TeamMember[];
      attachedFiles?: ProjectAttachedFile[];
    },
    options?: { campusHub?: boolean }
  ) => {
    const authorContributionDesc =
      projectData.teamMembers?.find((m) => m.id === currentUser.id)?.contributionDescription;

    const defaultTeam: TeamMember[] = [
      {
        id: currentUser.id,
        name: currentUser.name,
        role: 'Project Creator & Lead',
        avatar: currentUser.avatar,
        identity: currentUser.identities[0] || 'Student',
        contributionDescription:
          authorContributionDesc || 'Project lead, architecture design, and core implementation.',
      },
    ];

    const teamMembers: TeamMember[] =
      projectData.teamMembers && projectData.teamMembers.length > 0
        ? projectData.teamMembers
        : defaultTeam;

    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      author: currentUser,
      teamMembers,
      attachedFiles: projectData.attachedFiles || [],
      interestCount: 1,
      userInterested: true,
      viewCount: 1,
      createdAt: new Date().toISOString(),
      tasks: [],
      milestones: [
        { id: `m-${Date.now()}`, projectId: `proj-${Date.now()}`, title: 'Project Kickoff & Spec', targetDate: '2026-11-15', completed: true },
        { id: `m-${Date.now() + 1}`, projectId: `proj-${Date.now()}`, title: 'First Working Prototype', targetDate: '2026-12-01', completed: false },
      ],
    };

    if (options?.campusHub && userCampus) {
      const classProject: Project = { ...newProject, hubType: 'campus', school: userCampus.name };
      setClassProjects((prev) => [classProject, ...prev]);
      showToast(`"${classProject.title}" was added to ${userCampus.name} Campus Hub`, 'success');
      return classProject;
    }

    setProjects((prev) => [newProject, ...prev]);
    showToast(`"${newProject.title}" is now published to collabr!`, 'success');
    return newProject;
  };

  // Add Work Hub Project
  const addWorkProject = (
    projectData: Omit<Project, 'id' | 'createdAt' | 'viewCount' | 'interestCount' | 'author' | 'teamMembers'>
  ) => {
    const newProject: Project = {
      ...projectData,
      id: `work-proj-${Date.now()}`,
      hubType: 'work',
      author: currentUser,
      teamMembers: [
        {
          id: currentUser.id,
          name: currentUser.name,
          role: 'Project Owner & Lead',
          avatar: currentUser.avatar,
          identity: currentUser.identities[0] || 'Working professional',
        },
      ],
      interestCount: 1,
      userInterested: true,
      viewCount: 1,
      createdAt: new Date().toISOString(),
      tasks: [
        {
          id: `task-${Date.now()}-1`,
          projectId: `work-proj-${Date.now()}`,
          title: 'Initial Architecture Review & Environment Setup',
          description: 'Establish shared repository structure, initial CI testing, and documentation draft.',
          assignedToId: currentUser.id,
          assignedToName: currentUser.name,
          assignedToAvatar: currentUser.avatar,
          status: 'In Progress',
          priority: 'High',
          dueDate: '2026-11-01',
          createdById: currentUser.id,
          createdAt: new Date().toISOString(),
        },
      ],
      milestones: [
        { id: `m-${Date.now()}-1`, projectId: `work-proj-${Date.now()}`, title: 'Architecture RFC & Environment Setup', targetDate: '2026-11-05', completed: false },
        { id: `m-${Date.now()}-2`, projectId: `work-proj-${Date.now()}`, title: 'Core Deliverables Milestone', targetDate: '2026-11-25', completed: false },
      ],
      discussions: [
        {
          id: `disc-${Date.now()}`,
          projectId: `work-proj-${Date.now()}`,
          authorId: currentUser.id,
          authorName: currentUser.name,
          authorAvatar: currentUser.avatar,
          authorRole: 'Project Owner',
          content: 'Project workspace initialized! Ready for team members and collaborator assignments.',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setProjects((prev) => [newProject, ...prev]);
    showToast(`Work Hub project "${newProject.title}" created successfully!`, 'success');
    return newProject;
  };

  // Toggle Interest
  const toggleInterest = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const isCurrentlyInterested = !!p.userInterested;
          const nextCount = isCurrentlyInterested ? Math.max(0, p.interestCount - 1) : p.interestCount + 1;
          const updated = {
            ...p,
            userInterested: !isCurrentlyInterested,
            interestCount: nextCount,
          };
          if (!isCurrentlyInterested) {
            showToast(`Signaled interest in "${p.title}"`, 'success');
          }
          return updated;
        }
        return p;
      })
    );

    if (selectedProject?.id === projectId) {
      setSelectedProject((prev) => {
        if (!prev) return null;
        const isCurrentlyInterested = !!prev.userInterested;
        return {
          ...prev,
          userInterested: !isCurrentlyInterested,
          interestCount: isCurrentlyInterested ? Math.max(0, prev.interestCount - 1) : prev.interestCount + 1,
        };
      });
    }
  };

  // Apply to Work Hub Project
  const applyToProject = (
    projectId: string,
    roleApplied: string,
    introduction: string,
    availability: string,
    learningGoals?: string,
    resume?: ProjectAttachedFile
  ) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const newApp: ProjectApplication = {
      id: `app-${Date.now()}`,
      projectId,
      projectTitle: project.title,
      projectOwnerId: project.author.id,
      applicant: currentUser,
      roleApplied,
      introduction,
      availability,
      learningGoals,
      resume,
      isStudentApplication: currentUser.identities.includes('Student'),
      status: 'pending',
      timestamp: new Date().toISOString(),
      read: false,
    };

    setApplications((prev) => [newApp, ...prev]);
    showToast(`Application submitted to ${project.author.name} for "${project.title}"!`, 'success');
  };

  // Teacher opportunities (research, TA, grader, ...)
  const addTeacherOpportunity: AppContextType['addTeacherOpportunity'] = (position) => {
    const created: TeacherOpportunity = {
      ...position,
      id: `opportunity-${Date.now()}`,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      teacherAvatar: currentUser.avatar,
      department: currentUser.department,
      school: userCampus?.name || currentUser.organization,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setTeacherOpportunities((prev) => [created, ...prev]);
    showToast(`Posted "${created.title}"`, 'success');
  };

  const setTeacherOpportunityStatus = (positionId: string, status: TeacherOpportunity['status']) => {
    setTeacherOpportunities((prev) => prev.map((p) => (p.id === positionId ? { ...p, status } : p)));
  };

  const applyToTeacherOpportunity = (positionId: string, message?: string, resume?: ProjectAttachedFile) => {
    const position = teacherOpportunities.find((p) => p.id === positionId);
    if (!position) return;
    const application: OpportunityApplication = {
      id: `rapp-${Date.now()}`,
      positionId,
      applicant: currentUser,
      message,
      resume,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };
    setOpportunityApplications((prev) => [application, ...prev.filter((a) => !(a.positionId === positionId && a.applicant.id === currentUser.id))]);
    showToast(`Applied for ${position.title}`, 'success');
  };

  const setOpportunityApplicationStatus = (applicationId: string, status: OpportunityApplication['status']) => {
    setOpportunityApplications((prev) => prev.map((a) => (a.id === applicationId ? { ...a, status } : a)));
  };

  const setUserResume = (resume: ProjectAttachedFile | undefined) => {
    setCurrentUser((prev) => ({ ...prev, resume }));
    // Email accounts keep it across sign-outs
    setLocalAccounts((prev) => prev.map((a) => (a.id === currentUser.id ? { ...a, resume } : a)));
  };

  // Accept Project Application -> Adds applicant to team & workspace!
  const acceptApplication = (applicationId: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;

    setApplications((prev) =>
      prev.map((item) => (item.id === applicationId ? { ...item, status: 'accepted', read: true } : item))
    );

    // Add applicant to project team members
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === app.projectId) {
          const already = p.teamMembers.some((m) => m.id === app.applicant.id);
          if (!already) {
            return {
              ...p,
              teamMembers: [
                ...p.teamMembers,
                {
                  id: app.applicant.id,
                  name: app.applicant.name,
                  role: app.roleApplied,
                  avatar: app.applicant.avatar,
                  identity: app.applicant.identities[0] || 'Working professional',
                },
              ],
            };
          }
        }
        return p;
      })
    );

    // If active in workspace, update it
    if (activeWorkspaceProject?.id === app.projectId) {
      setActiveWorkspaceProject((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          teamMembers: [
            ...prev.teamMembers,
            {
              id: app.applicant.id,
              name: app.applicant.name,
              role: app.roleApplied,
              avatar: app.applicant.avatar,
              identity: app.applicant.identities[0] || 'Working professional',
            },
          ],
        };
      });
    }

    showToast(`Accepted application from ${app.applicant.name}! Added to "${app.projectTitle}" team.`, 'success');
  };

  const declineApplication = (applicationId: string) => {
    setApplications((prev) =>
      prev.map((item) => (item.id === applicationId ? { ...item, status: 'declined', read: true } : item))
    );
    showToast('Application declined', 'info');
  };

  // Direct Messages
  const sendMessage = (toAuthor: Author, content: string, project?: Project) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      fromUser: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        school: currentUser.school,
        jobTitle: currentUser.jobTitle,
        organization: currentUser.organization,
      },
      toUserId: toAuthor.id,
      projectId: project?.id,
      projectTitle: project?.title,
      content,
      timestamp: new Date().toISOString(),
      read: true,
      replies: [],
    };
    setMessages((prev) => [newMsg, ...prev]);
    showToast(`Message sent to ${toAuthor.name}`, 'success');
  };

  const sendReply = (messageId: string, content: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const replies = msg.replies || [];
          return {
            ...msg,
            replies: [
              ...replies,
              {
                id: `rep-${Date.now()}`,
                fromUserId: currentUser.id,
                fromUserName: currentUser.name,
                content,
                timestamp: new Date().toISOString(),
              },
            ],
          };
        }
        return msg;
      })
    );
    showToast('Reply sent', 'success');
  };

  const markMessageRead = (messageId: string) => {
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, read: true } : m)));
  };

  // Invitations
  const sendInvitation = (
    projectId: string,
    projectTitle: string,
    toAuthor: Author,
    roleOffered: string,
    note: string,
    extra?: { assignmentName?: string; courseCode?: string }
  ) => {
    const newInv: Invitation = {
      id: `inv-${Date.now()}`,
      fromUser: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        school: currentUser.school,
        jobTitle: currentUser.jobTitle,
        organization: currentUser.organization,
      },
      toUserId: toAuthor.id,
      projectId,
      projectTitle,
      roleOffered,
      note,
      ...extra,
      status: 'pending',
      timestamp: new Date().toISOString(),
      read: true,
    };
    setInvitations((prev) => [newInv, ...prev]);
    showToast(`Collaboration invite sent to ${toAuthor.name}!`, 'success');
  };

  const acceptInvitation = (invitationId: string) => {
    const invitation = invitations.find((i) => i.id === invitationId);
    if (!invitation) return;

    setInvitations((prev) =>
      prev.map((inv) => (inv.id === invitationId ? { ...inv, status: 'accepted', read: true } : inv))
    );

    // Add currentUser to the project's team members
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === invitation.projectId) {
          const alreadyMember = proj.teamMembers.some((m) => m.id === currentUser.id);
          if (!alreadyMember) {
            return {
              ...proj,
              teamMembers: [
                ...proj.teamMembers,
                {
                  id: currentUser.id,
                  name: currentUser.name,
                  role: invitation.roleOffered || 'Team Member',
                  avatar: currentUser.avatar,
                  identity: currentUser.identities[0] || 'Working professional',
                },
              ],
            };
          }
        }
        return proj;
      })
    );

    showToast(`Accepted invitation! You are now on the team for "${invitation.projectTitle}".`, 'success');
  };

  const declineInvitation = (invitationId: string) => {
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === invitationId ? { ...inv, status: 'declined', read: true } : inv))
    );
    showToast('Invitation declined', 'info');
  };

  // Code requests
  const requestCodeAccess = (project: Project, note: string) => {
    const newReq: CodeRequest = {
      id: `cr-${Date.now()}`,
      fromUser: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        school: currentUser.school,
        jobTitle: currentUser.jobTitle,
      },
      toUserId: project.author.id,
      projectId: project.id,
      projectTitle: project.title,
      note,
      status: 'pending',
      timestamp: new Date().toISOString(),
      read: true,
    };
    setCodeRequests((prev) => [newReq, ...prev]);
    showToast(`Code access request submitted for "${project.title}"`, 'success');
  };

  const acceptCodeRequest = (requestId: string) => {
    const req = codeRequests.find((r) => r.id === requestId);
    if (!req) return;

    const targetProject = [...projects, ...classProjects].find((p) => p.id === req.projectId);
    const repoUrl =
      targetProject?.githubRepo?.html_url ||
      `https://github.com/${currentUser.githubUsername || 'student'}/${req.projectTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    setCodeRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: 'accepted', read: true, revealedRepoUrl: repoUrl } : r
      )
    );

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === req.projectId) {
          const granted = proj.grantedUsers || [];
          return {
            ...proj,
            grantedUsers: [...granted, req.fromUser.id],
          };
        }
        return proj;
      })
    );

    showToast(`Code access approved for ${req.fromUser.name}.`, 'success');
  };

  const declineCodeRequest = (requestId: string) => {
    setCodeRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'declined', read: true } : r))
    );
    showToast('Code access request declined', 'info');
  };

  // Work projects filter
  const workProjects = projects.filter((p) => p.hubType === 'work');

  // Unread badge count
  const unreadMessagesCount = messages.filter((m) => m.toUserId === currentUser.id && !m.read).length;
  const unreadInvitationsCount = invitations.filter((i) => i.toUserId === currentUser.id && !i.read && i.status === 'pending').length;
  const unreadCodeRequestsCount = codeRequests.filter((r) => r.toUserId === currentUser.id && !r.read && r.status === 'pending').length;
  const unreadApplicationsCount = applications.filter((a) => a.projectOwnerId === currentUser.id && !a.read && a.status === 'pending').length;
  const unreadCount = unreadMessagesCount + unreadInvitationsCount + unreadCodeRequestsCount + unreadApplicationsCount;

  // Compatibility score helper
  const getCompatibility = (project: Project) => {
    return calculateCompatibilityScore(currentUser, project);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allDemoAccounts: ALL_DEMO_ACCOUNTS,
        campusDirectory,
        addPeerAssessments,
        switchUser,
        isSignedIn,
        signInWithEmail,
        signOut,
        userRepos,
        isGitHubConnecting,
        connectGitHub,
        disconnectGitHub,
        appMode,
        setAppMode,
        hasChosenMode,
        userCampus,
        canAccessCampus,
        campusClassProjects,
        campusClassAssignments,
        // Canvas LMS & School Email Integration
        canvasConnection,
        isDemoAccount,
        isCanvasConnecting,
        connectCanvas,
        disconnectCanvas,
        isCanvasModalOpen,
        openCanvasModal,
        closeCanvasModal,
        selectedCanvasCourseId,
        setSelectedCanvasCourseId,
        allCanvasClassmates,
        classmatesLookingForTeam,
        loadCanvasAssignments,
        projects,
        workProjects,
        classProjects,
        selectedProject,
        setSelectedProject,
        activeView,
        setActiveView,
        isShareModalOpen,
        openShareModal,
        closeShareModal,
        shareModalInitialData,
        isCreateWorkModalOpen,
        openCreateWorkModal,
        closeCreateWorkModal,
        isAccountSwitcherOpen,
        openAccountSwitcher,
        closeAccountSwitcher,
        isGitHubModalOpen,
        openGitHubModal,
        closeGitHubModal,
        isCollaborateModalOpen,
        collaborateTargetProject,
        openCollaborateModal,
        closeCollaborateModal,
        classInviteTarget,
        openClassInvite,
        closeClassInvite,
        isApplyModalOpen,
        applyTargetProject,
        openApplyModal,
        closeApplyModal,
        isMessageModalOpen,
        messageTargetAuthor,
        messageTargetProject,
        openMessageModal,
        closeMessageModal,
        activeWorkspaceProject,
        openWorkspace,
        closeWorkspace,
        addTask,
        updateTaskStatus,
        addMilestone,
        toggleMilestone,
        addWorkspaceDiscussion,
        addProject,
        addWorkProject,
        toggleInterest,
        applications,
        isTeacher,
        teacherOpportunities,
        opportunityApplications,
        addTeacherOpportunity,
        setTeacherOpportunityStatus,
        applyToTeacherOpportunity,
        setOpportunityApplicationStatus,
        applyToProject,
        setUserResume,
        acceptApplication,
        declineApplication,
        messages,
        invitations,
        codeRequests,
        unreadCount,
        inboxTab,
        setInboxTab,
        sendMessage,
        sendReply,
        markMessageRead,
        sendInvitation,
        acceptInvitation,
        declineInvitation,
        requestCodeAccess,
        acceptCodeRequest,
        declineCodeRequest,
        getCompatibility,
        toasts,
        showToast,
        removeToast,
        resetAllDemoData,
        teacherClasses,
        classAssignments,
        studentTeams,
        workEvidences,
        pastWorkRecords,
        createTeacherClass,
        createClassAssignment,
        updateAssignmentStatus,
        toggleAssignmentArchive,
        deleteClassAssignment,
        submitWorkEvidence,
        reviewContribution,
        reusableProjectTemplates,
        addProjectToClass,
        studentSubmissions,
        comparisonSources,
        submitStudentWork,
        runSimilarityCheck,
        updateSimilarityReview,
        inspectingSimilarityReport,
        openSimilarityReport,
        closeSimilarityReport,
        isAddProjectModalOpen,
        templateToAddToClass,
        openAddProjectModal,
        closeAddProjectModal,
        isCreateAssignmentModalOpen,
        openCreateAssignmentModal,
        closeCreateAssignmentModal,
        isStudentSubmitModalOpen,
        targetAssignmentForSubmission,
        openStudentSubmitModal,
        closeStudentSubmitModal,
        viewingPortfolioUser,
        openPortfolio,
        closePortfolio,
        viewingDocumentEvidence,
        openDocumentTimeline,
        closeDocumentTimeline,
        loginAsTeacher,
        loginAsStudent,
        teammateRatings,
        addTeammateRating,
        getUserRatings,
        getUserRatingSummaryData,
        analyzingProject,
        openContributionAnalysisModal,
        closeContributionAnalysisModal,
        isRateTeammateModalOpen,
        ratingTargetUser,
        ratingTargetProject,
        openRateTeammateModal,
        closeRateTeammateModal,
        isOnboardingModalOpen,
        openOnboardingModal,
        closeOnboardingModal,
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
