export type CodeAvailability = 'public' | 'on_request' | 'none';

export type ProjectStatus = 'Active' | 'Looking for collaborators' | 'Finished';

export type HubType = 'campus' | 'work';

export type UserIdentity =
  | 'Student'
  | 'Working professional'
  | 'Independent creator / developer'
  | 'Recent graduate'
  | 'Industry mentor'
  | 'Teacher / Professor';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Mixed';

export type CollaborationType = 'Remote' | 'Hybrid' | 'In-person';

export type TaskStatus = 'To Do' | 'In Progress' | 'In Review' | 'Completed';

export type TaskPriority = 'Low' | 'Medium' | 'High';

export type VerificationStatus =
  | 'Self-reported'
  | 'Evidence attached'
  | 'Reviewer-confirmed'
  | 'Needs clarification';

export type EvidenceType =
  | 'Google Docs'
  | 'Google Slides'
  | 'Google Sheets'
  | 'GitHub Repository'
  | 'GitHub PR/Commit'
  | 'Figma'
  | 'Live Demo'
  | 'Deliverable Document';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  forks_count?: number;
  default_branch?: string;
}

export interface DocumentTimelineEvent {
  timestamp: string;
  authorName: string;
  authorId: string;
  action: string; // e.g. "Drafted Section 3: REST API Specifications"
  section: string;
  note: string;
}

export interface WorkEvidence {
  id: string;
  title: string;
  url: string;
  evidenceType: EvidenceType;
  description: string; // Description of individual contribution
  associatedProjectId: string;
  associatedProjectTitle: string;
  associatedTaskId?: string;
  associatedTaskTitle?: string;
  date: string;
  visibility: 'Public' | 'Team Only' | 'Private';
  status: VerificationStatus;
  reviewedBy?: {
    id: string;
    name: string;
    role: string;
  };
  reviewedDate?: string;
  reviewerFeedback?: string;
  claimedSections?: string[];
  contributors?: { id: string; name: string; avatar?: string }[];
  documentTimeline?: DocumentTimelineEvent[];
}

export interface PastWorkRecord {
  id: string;
  projectId: string;
  projectTitle: string;
  isAcademicProject?: boolean;
  courseCode?: string;
  role: string;
  responsibilities: string[];
  skillsDemonstrated: string[];
  individualContributionSummary: string;
  completedTasks: string[];
  evidenceList: WorkEvidence[];
  reviewerConfirmedCount: number;
  overallStatus: VerificationStatus;
  reviewerNotes?: string;
  reviewedByTeacher?: string;
  reviewedDate?: string;
  isPublicShowcaseApproved?: boolean;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  identities: UserIdentity[];

  // Student specific
  school?: string;
  major?: string;
  graduationYear?: string;
  contributionPortfolio?: PastWorkRecord[];

  // Teacher / Professor specific
  department?: string;
  coursesTaught?: string[];
  officeHours?: string;

  // Professional specific
  jobTitle?: string;
  organization?: string;
  industry?: string;
  yearsOfExperience?: number;
  skills?: string[];
  nonTechnicalSkills?: string[];
  portfolioUrl?: string;
  professionalInterests?: string[];
  availability?: string; // e.g. "5-10 hrs/week"
  collaborationPreferences?: string; // e.g. "Remote Async"
  openToMentoring?: boolean;
  seekingMentorship?: boolean;
  preferredProjectTypes?: string[];

  // Collaboration Ratings & Reviews
  collaborationRating?: number;
  reviewCount?: number;
  recentRatings?: TeammateRating[];

  // GitHub
  githubUsername?: string;
  githubConnected: boolean;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedToId?: string;
  assignedToName?: string;
  assignedToAvatar?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  deliverableUrl?: string;
  evidenceId?: string;
  feedbackNote?: string;
  createdById: string;
  createdAt: string;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  targetDate: string;
  completed: boolean;
  deliverableNote?: string;
}

export interface WorkspaceDiscussion {
  id: string;
  projectId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole?: string;
  content: string;
  timestamp: string;
}

export interface RubricCriterion {
  id: string;
  criterion?: string;
  title?: string;
  weight?: number;
  maxPoints?: number;
  description: string;
}

export interface AssignmentMilestone {
  id: string;
  title: string;
  dueDate: string;
  deliverable: string;
}

// Teacher-managed academic assignment
export interface ClassAssignment {
  id: string;
  classCode: string; // e.g. "CSE 3901"
  className: string; // e.g. "Web Applications"
  classId?: string;
  title: string; // Assignment title
  description: string;
  instructionsText: string; // Pasted instructions
  instructions?: string; // alias
  instructionsDocUrl?: string; // Attached doc link
  expectedDeliverables: string[];
  requiredSkills: string[];
  groupSize: { min: number; max: number };
  teamSizeMin?: number;
  teamSizeMax?: number;
  dueDate: string;
  collaborationRules: string;
  submissionRequirements: string;
  isTeacherManaged?: true;
  codePolicy?: string;
  allowPublicShowcase: boolean; // Integrity setting
  requireTeacherApprovalForShowcase?: boolean;
  hideSourceCodeByDefault?: boolean;
  preventPublicRepoAttachment?: boolean;
  teacherId: string;
  teacherName: string;
  studentTeamIds: string[];
  createdAt: string;

  // New Classroom Management fields
  learningObjectives?: string[];
  gradingRubric?: RubricCriterion[];
  milestones?: AssignmentMilestone[];
  assignmentType?: 'individual' | 'group' | 'Individual' | 'Group';
  academicIntegrityPolicy?: string;
  status?: 'draft' | 'published' | 'archived' | 'Draft' | 'Published' | 'Archived';
  isArchived?: boolean;
  sourceTemplateId?: string; // If cloned from a reusable template
}

export interface TeacherClass {
  id: string;
  code: string;
  name: string;
  semester: string;
  enrolledStudentsCount: number;
  activeTeamsCount: number;
  assignmentsCount: number;
}

export interface StudentTeam {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  classCode: string;
  teamName: string;
  members: {
    studentId: string;
    studentName: string;
    studentAvatar: string;
    role: string;
    contributionsCount: number;
  }[];
  progressPercent: number;
  status: 'Forming' | 'In Progress' | 'Submitted for Review' | 'Graded';
  evidenceSubmitted: WorkEvidence[];
}

export interface ProjectAttachedFile {
  id: string;
  name: string;
  size?: string;
  type?: string;
  url: string;
  labeledStudentId?: string;
  labeledStudentName?: string;
  description?: string;
  uploadedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  identity?: UserIdentity;
  contributionDescription?: string; // Description of what part of the project this student worked on
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  whatItDoes: string;
  useCases: string[];
  targetAudience: string;
  tags: string[];
  codeAvailability: CodeAvailability;
  githubRepo?: GitHubRepo | null;
  status: ProjectStatus;
  openRoles: string[];
  screenshots?: string[];
  demoVideoUrl?: string;
  liveDemoUrl?: string;
  author: Author;
  teamMembers: TeamMember[];
  interestCount: number;
  userInterested?: boolean;
  viewCount: number;
  createdAt: string;

  // Attached deliverables & labeled student files
  attachedFiles?: ProjectAttachedFile[];

  // Hub identification
  hubType?: HubType; // 'campus' | 'work'

  // Campus & Teacher specific
  isClassProject?: boolean;
  courseName?: string;
  courseCode?: string; // e.g. "CSE 3901", "CSE 5521", "MECHENG 481", "CS 188"
  classCode?: string;
  professorName?: string; // e.g. "Dr. Rajiv Ramnath", "Dr. Evelyn Vance"
  professorEmail?: string;
  isTeacherManaged?: boolean;
  assignmentId?: string;
  allowPublicShowcase?: boolean;
  teacherApprovalStatus?: 'pending' | 'approved' | 'rejected' | 'not_requested';
  approvedSafeSummary?: string;
  grantedUsers?: string[]; // IDs of users granted code access

  // Work Hub specific
  industry?: string;
  category?: string;
  skillsRequired?: string[];
  skillsPreferred?: string[];
  experienceLevel?: ExperienceLevel;
  estimatedDuration?: string;
  collaborationType?: CollaborationType;
  targetTeamSize?: number;
  deliverables?: string[];
  compensationInfo?: string;
  openToStudents?: boolean;
  seekingIndustryMentor?: boolean;
  hasMentor?: boolean;
  mentorName?: string;

  // Workspace items attached
  tasks?: ProjectTask[];
  milestones?: ProjectMilestone[];
  discussions?: WorkspaceDiscussion[];
  repositoryUrl?: string;
  documentationUrl?: string;
  evidenceList?: WorkEvidence[];
  skills?: string[];
  discipline?: string;
  school?: string;
}

export interface ProjectApplication {
  id: string;
  projectId: string;
  projectTitle: string;
  projectOwnerId: string;
  applicant: Author;
  roleApplied: string;
  introduction: string;
  availability: string;
  learningGoals?: string;
  isStudentApplication: boolean;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: string;
  read: boolean;
}

export interface Message {
  id: string;
  fromUser: {
    id: string;
    name: string;
    avatar: string;
    school?: string;
    jobTitle?: string;
    organization?: string;
  };
  toUserId: string;
  projectId?: string;
  projectTitle?: string;
  content: string;
  timestamp: string;
  read: boolean;
  replies?: {
    id: string;
    fromUserId: string;
    fromUserName: string;
    content: string;
    timestamp: string;
  }[];
}

export interface Invitation {
  id: string;
  fromUser: {
    id: string;
    name: string;
    avatar: string;
    school?: string;
    jobTitle?: string;
    organization?: string;
  };
  toUserId: string;
  projectId: string;
  projectTitle: string;
  roleOffered: string;
  note: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: string;
  read: boolean;
}

export interface CodeRequest {
  id: string;
  fromUser: {
    id: string;
    name: string;
    avatar: string;
    school?: string;
    jobTitle?: string;
  };
  toUserId: string;
  projectId: string;
  projectTitle: string;
  note: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: string;
  read: boolean;
  revealedRepoUrl?: string;
}

export interface CompatibilityBreakdown {
  overallScore: number;
  skillsMatch: { score: number; matched: string[]; missing: string[] };
  industryMatch: { score: number; aligned: boolean };
  experienceMatch: { score: number; label: string };
  availabilityMatch: { score: number; label: string };
  explanation: string;
}

// ==========================================
// TEACHER PROJECT SEARCH & REUSABLE TEMPLATES
// ==========================================
export interface ReusableProjectTemplate {
  id: string;
  title: string;
  summary: string;
  description: string;
  subject: string; // e.g. "Computer Science & Engineering", "Robotics", "Web Systems"
  discipline: string; // e.g. "Distributed Systems", "Artificial Intelligence", "HCI"
  skills: string[];
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mixed';
  projectType: 'Coursework' | 'Open Source' | 'Capstone' | 'Lab' | 'Independent';
  estimatedDuration: string; // e.g. "3-4 weeks"
  suggestedTeamSize: { min: number; max: number };
  universityOrCourse?: string; // e.g. "Ohio State CSE 3901", "MIT 6.033"
  expectedDeliverables: string[];
  learningObjectives: string[];
  defaultGradingRubric: RubricCriterion[];
  isReusableTemplate: true;
  reusablePermissions: 'Permitted for Classroom Reuse';
  creatorName: string;
  creatorAvatar: string;
  creatorRole: string;
  visibility: 'Public Reusable';
  tags: string[];
}

// ==========================================
// STUDENT SUBMISSIONS FOR CLASSROOM PROJECTS
// ==========================================
export interface StudentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  classCode: string;
  className: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  isGroupSubmission: boolean;
  groupName?: string;
  groupMembers?: {
    studentId: string;
    studentName: string;
    studentAvatar: string;
    role: string;
  }[];
  submissionDate: string;
  revisionStatus?: 'Original' | 'Revision 1' | 'Final';
  textContent: string; // Written work or pasted text
  codeSnippet?: string; // Source code snippet
  codeLanguage?: string;
  githubUrl?: string; // Permitted repo or PR link
  googleDocsUrl?: string; // Permitted Google Docs link
  supportingEvidenceUrls?: string[];
  individualContributionDesc: string; // What the student did
  similarityChecked: boolean;
  similarityReport?: SimilarityReport;
  gradeStatus?: 'Ungraded' | 'Graded';
  score?: number;
}

// ==========================================
// AI-ASSISTED SIMILARITY REPORT & PASSAGES
// ==========================================
export interface MatchingPassage {
  id: string;
  matchedText: string;
  normalizedMatch: string;
  sourceDocumentId: string;
  sourceDocumentTitle: string;
  sourceType: 'Peer Submission' | 'Reference Solution' | 'Course Material' | 'Public Example';
  sourceExcerpt: string;
  isBoilerplate: boolean; // True if matched assignment instructions or template prompts
  startIndex?: number;
  endIndex?: number;
}

export interface ComparisonSource {
  id: string;
  title: string;
  authorName?: string;
  sourceType: 'Peer Submission' | 'Reference Solution' | 'Course Material' | 'Public Example';
  rawText: string;
  rawCode?: string;
  isAuthorized: boolean;
}

export interface SimilarityReport {
  id: string;
  submissionId: string;
  studentName: string;
  assignmentTitle: string;
  calculatedAt: string;
  detectionMode: 'text' | 'code';
  overallOverlapPercent: number; // e.g. 24% (Clearly labeled text-overlap percentage, NEVER labeled as plagiarism or cheating probability)
  matchingPassages: MatchingPassage[];
  sourceBreakdown: {
    sourceId: string;
    sourceTitle: string;
    sourceType: 'Peer Submission' | 'Reference Solution' | 'Course Material' | 'Public Example';
    overlapPercent: number;
    passageCount: number;
  }[];
  commonBoilerplateMatches: string[];
  aiExplanation?: string; // Optional Gemini summary explaining potentially meaningful similarities
  aiExplanationLoading?: boolean;
  limitationsNotice: string;
  teacherReviewStatus: 'Not reviewed' | 'Reviewed — acceptable overlap' | 'Needs clarification' | 'Further investigation needed';
  teacherNotes?: string;
  teacherReviewDate?: string;
  studentExplanationRequested?: boolean;
}

// ==========================================
// TEAMMATE RATINGS & STRUCTURED PEER FEEDBACK
// ==========================================
export interface TeammateRating {
  id: string;
  projectId: string;
  projectTitle: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  reviewerRole: 'Peer' | 'Project Owner' | 'Teacher / Instructor';
  targetUserId: string;
  targetUserName: string;
  ratings: {
    communication: number; // 1-5
    reliability: number; // 1-5
    collaboration: number; // 1-5
    qualityOfDeliverables: number; // 1-5
  };
  overallScore: number; // average of the 4 categories
  writtenFeedback?: string;
  createdAt: string;
  flagged?: boolean;
}

// ==========================================
// INDIVIDUAL CONTRIBUTION ANALYSIS
// ==========================================
export interface MemberContributionAnalysis {
  memberId: string;
  memberName: string;
  memberAvatar: string;
  role: string;
  tasksAssignedCount: number;
  tasksCompletedCount: number;
  completedTaskTitles: string[];
  deliverablesSubmitted: string[];
  documentEvidence: WorkEvidence[];
  githubEvidence?: {
    repoName: string;
    commitsCount?: number;
    pullRequestsCount?: number;
    keyPrTitles?: string[];
  };
  reviewerConfirmedCount: number;
  peerFeedbackCount: number;
  peerAverageScore?: number;
  
  // Documented participation metrics & transparency
  documentedContributionShare?: number; // Estimated % of documented activity, only if sufficient comparable evidence
  evidenceCoverage: 'High' | 'Moderate' | 'Limited' | 'Insufficient';
  evidenceLimitations?: string;
  
  // Grounded summary (Gemini or deterministic fallback)
  summaryText: string;
  demonstratedSkills: string[];
  questionsForInvestigation?: string[];
}

export interface ProjectContributionReport {
  projectId: string;
  projectTitle: string;
  calculatedAt: string;
  totalTasks: number;
  completedTasks: number;
  totalDeliverables: number;
  confirmedDeliverables: number;
  members: MemberContributionAnalysis[];
  overallProjectSummary: string;
  evidenceCompletenessNote: string;
  assessmentMethodology: string; // Explains transparent calculation
  aiAssisted: boolean;
}

// ==========================================
// CANVAS LMS & SCHOOL EMAIL INTEGRATION
// ==========================================
export interface CanvasClassmate {
  id: string;
  name: string;
  email: string; // School email e.g. "alexchen@buckeyemail.osu.edu"
  avatar: string;
  role: 'Student' | 'Teaching Assistant' | 'Instructor';
  courseId: string;
  courseCode: string;
  courseName: string;
  section: string;
  major: string;
  graduationYear: string;
  skills: string[];
  lookingForTeam: boolean;
  teammatePitch?: string;
  preferredRole?: string;
  verifiedDeliverablesCount: number;
  peerRating?: number;
  reviewCount?: number;
  githubUsername?: string;
  githubConnected?: boolean;
  availability?: string;
  associatedDemoAccountId?: string;
}

export interface CanvasCourse {
  id: string;
  courseCode: string; // e.g. "CSE 3901", "CSE 5521"
  name: string; // e.g. "Web Applications"
  term: string; // e.g. "Spring 2026"
  department: string;
  section: string;
  canvasUrl: string;
  instructor: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  studentCount: number;
  lookingForTeamCount: number;
  classmates: CanvasClassmate[];
}

export interface CanvasUserConnection {
  isConnected: boolean;
  schoolEmail: string;
  studentId?: string;
  institutionName: string;
  institutionDomain: string; // e.g. "osu.instructure.com"
  connectedAt?: string;
  source: 'verified_sso' | 'canvas_api_token' | 'domain_simulation';
  courses: CanvasCourse[];
}

