import {
  Author,
  TeacherClass,
  ClassAssignment,
  WorkEvidence,
  PastWorkRecord,
  StudentTeam,
  ReusableProjectTemplate,
  StudentSubmission,
  ComparisonSource,
  RubricCriterion,
  AssignmentMilestone,
} from '../types';

// ==========================================
// 1. DEDICATED TEACHER ACCOUNT
// ==========================================
export const DEMO_TEACHER: Author = {
  id: 'user_prof_robert_hayes',
  name: 'Prof. Robert Hayes',
  avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&auto=format&fit=crop&q=80',
  bio: 'Professor of Computer Science & Engineering and Director of Undergraduate Systems Curriculum at Ohio State University. Focused on distributed systems, software engineering pedagogy, and authentic learning assessment.',
  identities: ['Teacher / Professor'],
  jobTitle: 'Professor of Computer Science & Engineering',
  organization: 'Ohio State University',
  department: 'Department of Computer Science & Engineering',
  coursesTaught: ['CSE 3901: Web Applications', 'CSE 5521: Survey of Artificial Intelligence'],
  officeHours: 'Tuesdays & Thursdays 2:00 PM - 4:00 PM (Dreese Labs 418)',
  githubUsername: 'prof-hayes-osu',
  githubConnected: true,
};

// ==========================================
// 2. COURSES / CLASSES
// ==========================================
export const INITIAL_TEACHER_CLASSES: TeacherClass[] = [
  {
    id: 'class-cse3901',
    code: 'CSE 3901',
    name: 'Web Applications',
    semester: 'Autumn 2026',
    enrolledStudentsCount: 42,
    activeTeamsCount: 11,
    assignmentsCount: 2,
  },
  {
    id: 'class-cse5521',
    code: 'CSE 5521',
    name: 'Survey of Artificial Intelligence',
    semester: 'Autumn 2026',
    enrolledStudentsCount: 36,
    activeTeamsCount: 9,
    assignmentsCount: 1,
  },
];

// ==========================================
// 3. TEACHER-MANAGED CLASS ASSIGNMENTS
// ==========================================
export const INITIAL_CLASS_ASSIGNMENTS: ClassAssignment[] = [
  {
    id: 'assign-cse3901-lab-inventory',
    classCode: 'CSE 3901',
    className: 'Web Applications',
    title: 'Full-Stack Collaborative Lab Inventory System',
    description: 'Design and deploy a secure, multi-tier web application tracking university hardware lab checkouts, equipment availability, and barcode reservation schedules.',
    instructionsText: `ASSIGNMENT INSTRUCTIONS & SPECIFICATIONS:
1. Architecture Requirements:
   - React 19 frontend with TypeScript and clean state management.
   - RESTful Express/Node API with JWT session tokens and role-based route middleware.
   - Relational database with transactional asset locks for simultaneous checkout requests.
2. Group Collaboration:
   - Form teams of 3 to 4 students using SkillSink skill matching.
   - Document individual contributions in the shared Google Docs Architecture Specification.
   - Attach functional evidence links (Google Docs, PRs, Figma designs) for individual grading review.
3. Academic Integrity & Anti-Copying Protections:
   - Source code solutions MUST remain private to enrolled team members.
   - Public GitHub repository attachment is strictly prevented to avoid cross-semester code plagiarism.
   - Public Showcase entries require instructor approval of a safe, non-solution project summary.`,
    instructionsDocUrl: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
    expectedDeliverables: [
      'Architecture & API Specification (Google Docs)',
      'Relational Database Schema & Migrations',
      'Interactive Equipment Checkout & Inventory UI',
      'Integration Test Suite with 85%+ Coverage',
      'Individual Contribution Statement with Attached Evidence',
    ],
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'SQL', 'REST APIs'],
    groupSize: { min: 3, max: 4 },
    dueDate: '2026-11-20',
    collaborationRules: 'All team members must write and verify their own individual tasks. Direct code copying between student groups is an academic integrity violation.',
    submissionRequirements: 'Submit individual evidence links and contribution summaries through the SkillSink Coursework workspace.',
    isTeacherManaged: true,
    allowPublicShowcase: true,
    requireTeacherApprovalForShowcase: true,
    hideSourceCodeByDefault: true,
    preventPublicRepoAttachment: true,
    teacherId: DEMO_TEACHER.id,
    teacherName: DEMO_TEACHER.name,
    studentTeamIds: ['team-buckeye-devs-1', 'team-web-arch-2'],
    createdAt: '2026-10-10T09:00:00Z',
  },
  {
    id: 'assign-cse5521-robotics-ik',
    classCode: 'CSE 5521',
    className: 'Survey of Artificial Intelligence',
    title: 'Multi-Joint Robotic Arm Inverse Kinematics Solver',
    description: 'Implement numeric inverse kinematics algorithms (Levenberg-Marquardt and Jacobian Transpose) for a 6-DOF robotic manipulator avoiding geometric obstacles.',
    instructionsText: `ASSIGNMENT INSTRUCTIONS:
1. Formulate kinematic Jacobian matrices for a 6-DOF revolute joint virtual robot.
2. Implement numerical convergence damping to handle kinematic singularities.
3. Benchmark path planning execution time across 500 randomized target coordinates.
4. Academic Integrity Notice: STRICTLY PROTECTED ASSIGNMENT.
   - Public showcase is DISABLED by default.
   - No public source code repository or online hosting permitted.`,
    expectedDeliverables: [
      'Kinematics Formulation Math Paper (Google Docs)',
      'Algorithm Convergence Benchmark Report',
      'Python / C++ Simulation Module (Private)',
    ],
    requiredSkills: ['Python', 'Linear Algebra', 'Kinematics', 'NumPy', 'Robotics'],
    groupSize: { min: 2, max: 3 },
    dueDate: '2026-11-28',
    collaborationRules: 'Pair or trio mathematical derivation. Code must remain private to team members.',
    submissionRequirements: 'Upload benchmark graphs and mathematical derivation document link.',
    isTeacherManaged: true,
    allowPublicShowcase: false, // RESTRICTED: No public showcase allowed!
    requireTeacherApprovalForShowcase: true,
    hideSourceCodeByDefault: true,
    preventPublicRepoAttachment: true,
    teacherId: DEMO_TEACHER.id,
    teacherName: DEMO_TEACHER.name,
    studentTeamIds: ['team-kinematics-alpha'],
    createdAt: '2026-10-12T11:00:00Z',
  },
  {
    id: 'assign-cse3901-dining-estimator',
    classCode: 'CSE 3901',
    className: 'Web Applications',
    title: 'Real-Time Campus Dining Queue Predictor',
    description: 'Construct a campus dining line wait estimator using historical card swipe distributions and student check-ins.',
    instructionsText: `ASSIGNMENT INSTRUCTIONS:
Build a progressive web application estimating cafeteria lines during peak hours. Focus on mobile accessibility and edge latency.`,
    expectedDeliverables: ['Mobile Web Interface', 'Prediction Engine API', 'Individual Contribution Evidence'],
    requiredSkills: ['React', 'CSS/Tailwind', 'FastAPI', 'Data Analysis'],
    groupSize: { min: 2, max: 4 },
    dueDate: '2026-12-05',
    collaborationRules: 'Standard course collaboration. Solutions private.',
    submissionRequirements: 'Individual evidence documentation required.',
    isTeacherManaged: true,
    allowPublicShowcase: true,
    requireTeacherApprovalForShowcase: true,
    hideSourceCodeByDefault: true,
    preventPublicRepoAttachment: true,
    teacherId: DEMO_TEACHER.id,
    teacherName: DEMO_TEACHER.name,
    studentTeamIds: ['team-dining-pulse'],
    createdAt: '2026-10-15T14:00:00Z',
  },
];

// ==========================================
// 4. WORK EVIDENCE RECORDS (with Fictional Document Timelines)
// ==========================================
export const INITIAL_WORK_EVIDENCES: WorkEvidence[] = [
  {
    id: 'ev-alex-docs-arch',
    title: 'CSE 3901 Lab Inventory Architecture Specification & REST API Schema',
    url: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
    evidenceType: 'Google Docs',
    description: 'Authored complete Section 3 & Section 4: Defined RESTful endpoints (/api/equipment, /api/reservations/lock), JWT session validation, and database transaction boundaries for concurrent checkout conflict handling.',
    associatedProjectId: 'assign-cse3901-lab-inventory',
    associatedProjectTitle: 'Full-Stack Collaborative Lab Inventory System',
    associatedTaskId: 'task-lab-spec',
    associatedTaskTitle: 'Author REST API specification & database concurrency spec',
    date: '2026-10-24',
    visibility: 'Team Only',
    status: 'Evidence attached', // Awaiting teacher review for priority demo!
    claimedSections: ['Section 3: REST API Contracts', 'Section 4: Transactional Isolation Model'],
    contributors: [
      { id: 'user_alex_chen', name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80' },
      { id: 'user_daniel_miller', name: 'Daniel Miller', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80' },
      { id: 'user_elena_ramos', name: 'Elena Ramos', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80' },
    ],
    // Fictional Document Revision Events clearly labeled as demo simulation
    documentTimeline: [
      {
        timestamp: '2026-10-24T14:15:00Z',
        authorName: 'Alex Chen',
        authorId: 'user_alex_chen',
        action: 'Drafted Section 3.2: Reservation Locking API & HTTP 409 Conflict Handling',
        section: 'Section 3.2',
        note: 'Added Swagger schema and error payload examples.',
      },
      {
        timestamp: '2026-10-24T11:30:00Z',
        authorName: 'Alex Chen',
        authorId: 'user_alex_chen',
        action: 'Created Section 4: Concurrency Matrix & Database Isolation Level (SERIALIZABLE)',
        section: 'Section 4.1',
        note: 'Specified Postgres advisory locks to prevent double-checkout race conditions.',
      },
      {
        timestamp: '2026-10-23T16:45:00Z',
        authorName: 'Daniel Miller',
        authorId: 'user_daniel_miller',
        action: 'Added Section 2: User Persona Definitions & Lab Manager Permissions',
        section: 'Section 2.1',
        note: 'Defined lab assistant check-in flow.',
      },
      {
        timestamp: '2026-10-23T09:20:00Z',
        authorName: 'Alex Chen',
        authorId: 'user_alex_chen',
        action: 'Document Initialized with Master Table of Contents & Team Standards',
        section: 'Overview',
        note: 'Set up styling conventions and contribution attribution tags.',
      },
    ],
  },
  {
    id: 'ev-alex-github-pr',
    title: 'Pull Request #14: Implement Optimistic UI Cache and Inventory Transaction Lock',
    url: 'https://github.com/osu-cse3901/lab-inventory/pull/14',
    evidenceType: 'GitHub PR/Commit',
    description: 'Engineered optimistic state updates in React frontend combined with backend transaction rollback tests. Added 18 unit tests with 94% coverage.',
    associatedProjectId: 'assign-cse3901-lab-inventory',
    associatedProjectTitle: 'Full-Stack Collaborative Lab Inventory System',
    date: '2026-10-22',
    visibility: 'Team Only',
    status: 'Reviewer-confirmed',
    reviewedBy: {
      id: DEMO_TEACHER.id,
      name: DEMO_TEACHER.name,
      role: 'Course Instructor (Prof. Robert Hayes)',
    },
    reviewedDate: '2026-10-23',
    reviewerFeedback: 'Rigorous transaction isolation and clean test coverage. Exactly the standard expected for CSE 3901.',
  },
  {
    id: 'ev-elena-figma',
    title: 'Interactive Equipment Checkout & QR Scanner Figma Prototypes',
    url: 'https://figma.com/file/sample-cse3901-lab-inventory',
    evidenceType: 'Figma',
    description: 'Designed high-fidelity mobile and desktop checkout flows with barcode scanner views and WCAG AAA color contrast compliance.',
    associatedProjectId: 'assign-cse3901-lab-inventory',
    associatedProjectTitle: 'Full-Stack Collaborative Lab Inventory System',
    date: '2026-10-21',
    visibility: 'Team Only',
    status: 'Reviewer-confirmed',
    reviewedBy: {
      id: DEMO_TEACHER.id,
      name: DEMO_TEACHER.name,
      role: 'Course Instructor (Prof. Robert Hayes)',
    },
    reviewedDate: '2026-10-22',
    reviewerFeedback: 'Clean ergonomic layouts and responsive mobile adaptation for barcode scanning in hardware labs.',
  },
  {
    id: 'ev-alex-rover-pr',
    title: 'PR #42: RealSense D435i Stereo Odometry Integration & Point Cloud Filter',
    url: 'https://github.com/osu-robotics/buckeye-rover-vision/pull/42',
    evidenceType: 'GitHub PR/Commit',
    description: 'Implemented C++ ROS2 node reading depth streams, filtering ground plane outliers, and streaming 30Hz odometry to navigators.',
    associatedProjectId: 'proj-1',
    associatedProjectTitle: 'BuckeyeRover Autonomous Terrain Navigator',
    date: '2026-10-18',
    visibility: 'Public',
    status: 'Reviewer-confirmed',
    reviewedBy: {
      id: 'user_dr_evelyn_vance',
      name: 'Dr. Evelyn Vance',
      role: 'Industry Mentor (Director at Apex Dynamics)',
    },
    reviewedDate: '2026-10-19',
    reviewerFeedback: 'Excellent C++ memory management and low latency (<8ms) point cloud downsampling.',
    contributors: [
      { id: 'user_alex_chen', name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160' },
    ],
  },
  {
    id: 'ev-marcus-firmware-spec',
    title: 'Google Docs: LiDAR Stereo-Camera Fusion Node Specification',
    url: 'https://docs.google.com/document/d/1demo-marcus-fusion-spec/edit',
    evidenceType: 'Google Docs',
    description: 'Detailed C++ ROS2 zero-copy memory ring buffer architecture and coordinate transformation matrices.',
    associatedProjectId: 'proj-1',
    associatedProjectTitle: 'BuckeyeRover Autonomous Terrain Navigator',
    date: '2026-10-17',
    visibility: 'Public',
    status: 'Reviewer-confirmed',
    reviewedBy: {
      id: 'user_dr_evelyn_vance',
      name: 'Dr. Evelyn Vance',
      role: 'Industry Mentor (Director at Apex Dynamics)',
    },
    reviewedDate: '2026-10-18',
    reviewerFeedback: 'Verified lock-free queue concurrency and memory bounds.',
    contributors: [
      { id: 'author_marcus_v', name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160' },
    ],
  },
  {
    id: 'ev-elena-rover-whitepaper',
    title: 'Google Docs: Sensor Fusion Accuracy & Field Trial Whitepaper',
    url: 'https://docs.google.com/document/d/1demo-elena-sensor-accuracy-paper/edit',
    evidenceType: 'Google Docs',
    description: 'Empirical accuracy benchmarks, obstacle misclassification rates, and sensor failure mode recovery models.',
    associatedProjectId: 'proj-1',
    associatedProjectTitle: 'BuckeyeRover Autonomous Terrain Navigator',
    date: '2026-10-19',
    visibility: 'Public',
    status: 'Reviewer-confirmed',
    reviewedBy: {
      id: 'user_dr_evelyn_vance',
      name: 'Dr. Evelyn Vance',
      role: 'Industry Mentor (Director at Apex Dynamics)',
    },
    reviewedDate: '2026-10-20',
    reviewerFeedback: 'Rigorous empirical statistical confidence intervals and comprehensive obstacle test log.',
    contributors: [
      { id: 'dev_elena_r', name: 'Elena Ramos', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160' },
    ],
  },
  {
    id: 'ev-devon-test-outline',
    title: 'Google Docs: Initial Rover Test Outline Draft',
    url: 'https://docs.google.com/document/d/1draft-devon-test-outline/edit',
    evidenceType: 'Google Docs',
    description: 'Rough bulleted outline of test scenarios; unlinked to repository automated test suite.',
    associatedProjectId: 'proj-1',
    associatedProjectTitle: 'BuckeyeRover Autonomous Terrain Navigator',
    date: '2026-10-20',
    visibility: 'Team Only',
    status: 'Self-reported', // INCOMPLETE EVIDENCE EXAMPLE!
    contributors: [
      { id: 'user_devon_miller', name: 'Devon Miller', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160' },
    ],
  },
];

// ==========================================
// 5. CONTRIBUTION PORTFOLIO RECORDS (Past Work)
// ==========================================
export const INITIAL_PAST_WORK_RECORDS: Record<string, PastWorkRecord[]> = {
  user_alex_chen: [
    {
      id: 'pw-alex-1',
      projectId: 'assign-cse3901-lab-inventory',
      projectTitle: 'CSE 3901: Full-Stack Collaborative Lab Inventory System',
      isAcademicProject: true,
      courseCode: 'CSE 3901',
      role: 'Full-Stack Systems Lead',
      responsibilities: [
        'Architected REST API contracts and relational database schema',
        'Implemented optimistic locking for concurrent equipment reservations',
        'Built automated integration test suite with 94% code coverage',
      ],
      skillsDemonstrated: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'API Design', 'System Architecture'],
      individualContributionSummary: 'Designed the complete backend reservation protocol, wrote the core transaction isolation engine in TypeScript, and authored the 16-page Architecture Specification in Google Docs with full team consensus.',
      completedTasks: [
        'Author REST API specification & database concurrency spec',
        'Implement optimistic UI cache and reservation transaction lock',
        'Configure CI/CD integration tests on GitHub Actions',
      ],
      evidenceList: [
        INITIAL_WORK_EVIDENCES[0], // Google Docs (Awaiting review / In review)
        INITIAL_WORK_EVIDENCES[1], // GitHub PR (Confirmed by Prof. Hayes)
      ],
      reviewerConfirmedCount: 1,
      overallStatus: 'Evidence attached',
      reviewerNotes: 'Verified PR #14. Architecture specification Google Doc submitted for instructor sign-off.',
      reviewedByTeacher: 'Prof. Robert Hayes',
      reviewedDate: '2026-10-23',
      isPublicShowcaseApproved: true,
    },
    {
      id: 'pw-alex-2',
      projectId: 'proj-1',
      projectTitle: 'BuckeyeRover Autonomous Terrain Navigator',
      isAcademicProject: false,
      role: 'Perception & Telemetry Lead',
      responsibilities: [
        'Sensor fusion for dual RealSense D435i depth cameras and Velodyne LiDAR',
        'ROS2 WebSockets bridge for live browser telemetry cockpit',
      ],
      skillsDemonstrated: ['C++', 'ROS2', 'Computer Vision', 'WebSockets', 'React'],
      individualContributionSummary: 'Engineered real-time stereo odometry and low-latency WebSockets visualizer for Mars competition rover field trials.',
      completedTasks: [
        'Integrate RealSense stereo odometry node in C++',
        'Build real-time 60fps telemetry visualizer',
      ],
      evidenceList: [
        INITIAL_WORK_EVIDENCES[3], // Rover PR (Confirmed by Mentor Dr. Evelyn Vance)
      ],
      reviewerConfirmedCount: 1,
      overallStatus: 'Reviewer-confirmed',
      reviewerNotes: 'Production-ready perception code reviewed and verified during student rover competition trials.',
      reviewedByTeacher: 'Dr. Evelyn Vance (Apex Dynamics)',
      reviewedDate: '2026-10-19',
      isPublicShowcaseApproved: true,
    },
  ],
  user_maya_lin: [
    {
      id: 'pw-maya-1',
      projectId: 'work-proj-3',
      projectTitle: 'AuraUI: Ergonomic High-Density Component Library',
      isAcademicProject: false,
      role: 'Junior UI/UX Contributor',
      responsibilities: [
        'Audited WCAG AAA contrast ratios for dark mode tables',
        'Created interactive Storybook accessibility documentation',
      ],
      skillsDemonstrated: ['Figma', 'React', 'TailwindCSS', 'Accessibility (a11y)'],
      individualContributionSummary: 'Partnered with design systems lead Elena Rostova to refine high-density tabular typography and test screen-reader navigation.',
      completedTasks: ['Audit color contrast ratios for dark mode data table'],
      evidenceList: [
        {
          id: 'ev-maya-figma-aura',
          title: 'AuraUI Accessible Contrast Matrix & Token Map',
          url: 'https://figma.com/file/sample-auraui-tokens',
          evidenceType: 'Figma',
          description: 'Documented 4.5:1 contrast ratios for 24 data cell variants across light and dark themes.',
          associatedProjectId: 'work-proj-3',
          associatedProjectTitle: 'AuraUI',
          date: '2026-10-22',
          visibility: 'Public',
          status: 'Reviewer-confirmed',
          reviewedBy: {
            id: 'user_elena_rostova',
            name: 'Elena Rostova',
            role: 'Design Systems Lead (Forma Studio)',
          },
          reviewedDate: '2026-10-23',
          reviewerFeedback: 'Rigorous attention to contrast ratios and keyboard focus rings. Great student growth!',
        },
      ],
      reviewerConfirmedCount: 1,
      overallStatus: 'Reviewer-confirmed',
      reviewerNotes: 'Verified by industry mentor Elena Rostova.',
      isPublicShowcaseApproved: true,
    },
  ],
};

// ==========================================
// 6. STUDENT TEAMS IN TEACHER DASHBOARD
// ==========================================
export const INITIAL_STUDENT_TEAMS: StudentTeam[] = [
  {
    id: 'team-buckeye-devs-1',
    assignmentId: 'assign-cse3901-lab-inventory',
    assignmentTitle: 'Full-Stack Collaborative Lab Inventory System',
    classCode: 'CSE 3901',
    teamName: 'Team Buckeye Devs',
    members: [
      {
        studentId: 'user_alex_chen',
        studentName: 'Alex Chen',
        studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
        role: 'Full-Stack Systems Lead',
        contributionsCount: 2,
      },
      {
        studentId: 'user_daniel_miller',
        studentName: 'Daniel Miller',
        studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
        role: 'Backend API Developer',
        contributionsCount: 1,
      },
      {
        studentId: 'user_elena_ramos',
        studentName: 'Elena Ramos',
        studentAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
        role: 'Frontend & UI Specialist',
        contributionsCount: 1,
      },
    ],
    progressPercent: 75,
    status: 'In Progress',
    evidenceSubmitted: [
      INITIAL_WORK_EVIDENCES[0],
      INITIAL_WORK_EVIDENCES[1],
      INITIAL_WORK_EVIDENCES[2],
    ],
  },
  {
    id: 'team-kinematics-alpha',
    assignmentId: 'assign-cse5521-robotics-ik',
    assignmentTitle: 'Multi-Joint Robotic Arm Inverse Kinematics Solver',
    classCode: 'CSE 5521',
    teamName: 'Team Kinematics Alpha',
    members: [
      {
        studentId: 'user_alex_chen',
        studentName: 'Alex Chen',
        studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
        role: 'Numeric Solver Lead',
        contributionsCount: 1,
      },
      {
        studentId: 'user_marcus_vance',
        studentName: 'Marcus Vance',
        studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
        role: 'Simulation & Benchmarking',
        contributionsCount: 1,
      },
    ],
    progressPercent: 60,
    status: 'In Progress',
    evidenceSubmitted: [],
  },
];

// ==========================================
// 7. SEARCHABLE REUSABLE PROJECT TEMPLATES
// ==========================================
export const INITIAL_REUSABLE_PROJECT_TEMPLATES: ReusableProjectTemplate[] = [
  {
    id: 'tmpl-quadcopter-mapping',
    title: 'Autonomous Quadcopter 3D Mapping & ROS2 Pathfinding',
    summary: 'Design a simulation pipeline for a multi-rotor drone mapping unknown cluttered environments using LiDAR SLAM and Nav2.',
    description: 'Students implement an autonomous exploration node in ROS2 (C++ / Python) that converts octree point clouds into 3D occupancy voxels, generates dynamic A* trajectory splines, and navigates around geometric obstacles under sensor noise.',
    subject: 'Computer Science & Engineering',
    discipline: 'Robotics & Autonomous Systems',
    skills: ['ROS2', 'C++', 'Python', 'Computer Vision', 'SLAM', 'Path Planning'],
    difficultyLevel: 'Advanced',
    projectType: 'Coursework',
    estimatedDuration: '4-6 weeks',
    suggestedTeamSize: { min: 3, max: 4 },
    universityOrCourse: 'Ohio State CSE 5521 / MIT 16.485',
    expectedDeliverables: [
      'ROS2 Octomap Voxel Generation Node',
      '3D Trajectory Optimization & Smoothing Module',
      'Gazebo Simulation Benchmark Report with 95%+ Path Success',
      'Individual Contribution Document with Revision Evidence',
    ],
    learningObjectives: [
      'Master spatial transformation frames (tf2) in multi-rotor flight',
      'Implement numerical path smoothing algorithms with kinematic limits',
      'Analyze LiDAR point cloud density and sensor drift',
    ],
    defaultGradingRubric: [
      { id: 'rub-1', criterion: 'Point Cloud Voxelization & Filter Performance', weight: 25, description: 'Correct ground-plane rejection and low latency voxel updates under 20ms.' },
      { id: 'rub-2', criterion: 'Trajectory Convergence & Obstacle Margin', weight: 35, description: 'Safe buffer distance of >=0.5m maintained across 50 simulated obstacles.' },
      { id: 'rub-3', criterion: 'Software Architecture & Modular ROS2 Nodes', weight: 20, description: 'Clean message typing, parameterized launch files, and test coverage.' },
      { id: 'rub-4', criterion: 'Individual Evidence & Collaborative Log', weight: 20, description: 'Verifiable individual task attribution via Google Docs / Git commit evidence.' },
    ],
    isReusableTemplate: true,
    reusablePermissions: 'Permitted for Classroom Reuse',
    creatorName: 'Dr. Evelyn Vance',
    creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
    creatorRole: 'Director of Autonomous Systems, Apex Dynamics',
    visibility: 'Public Reusable',
    tags: ['Robotics', 'ROS2', 'Autonomous Systems', 'SLAM', 'Simulation'],
  },
  {
    id: 'tmpl-distributed-raft-kv',
    title: 'Distributed Key-Value Store with Raft Consensus',
    summary: 'Construct a linearizable, fault-tolerant key-value store using the Raft distributed consensus protocol.',
    description: 'A systems programming assignment where student pairs build leader election, log replication, snapshotting, and network partition recovery from scratch in Go or Rust. Verified through randomized network chaos test suites.',
    subject: 'Computer Science & Engineering',
    discipline: 'Distributed Systems',
    skills: ['Go', 'Distributed Systems', 'Consensus Protocols', 'gRPC', 'Concurrency'],
    difficultyLevel: 'Advanced',
    projectType: 'Coursework',
    estimatedDuration: '3-4 weeks',
    suggestedTeamSize: { min: 2, max: 3 },
    universityOrCourse: 'UC Berkeley CS 162 / Stanford CS 244B',
    expectedDeliverables: [
      'Raft Core Consensus Engine (Election & Log Replication)',
      'Linearizable RPC Key-Value Server & Client Stubs',
      'Automated Chaos Failure Test Suite (Jepsen-style partitions)',
      'Individual Architecture Specification',
    ],
    learningObjectives: [
      'Understand safety vs liveness guarantees in consensus protocols',
      'Implement asynchronous RPC heartbeats and election term transitions',
      'Diagnose concurrency race conditions and deadlock states',
    ],
    defaultGradingRubric: [
      { id: 'rub-5', criterion: 'Leader Election Safety & Term Monotonicity', weight: 30, description: 'Zero split-brain occurrences under 100 randomized network split scenarios.' },
      { id: 'rub-6', criterion: 'Log Consistency & Compaction', weight: 30, description: 'Snapshot generation and safe truncation without data loss.' },
      { id: 'rub-7', criterion: 'Code Quality & Race-Free Concurrency', weight: 20, description: 'Passes go test -race with zero goroutine leaks.' },
      { id: 'rub-8', criterion: 'Individual Contribution Attribution', weight: 20, description: 'Clearly isolated module ownership confirmed in documentation.' },
    ],
    isReusableTemplate: true,
    reusablePermissions: 'Permitted for Classroom Reuse',
    creatorName: 'David Park',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    creatorRole: 'Staff Infrastructure Architect, ScaleGrid Systems',
    visibility: 'Public Reusable',
    tags: ['Distributed Systems', 'Go', 'Raft', 'Consensus', 'Cloud'],
  },
  {
    id: 'tmpl-dining-line-predictor',
    title: 'Real-Time Campus Dining Queue Predictor & Mobile UI',
    summary: 'Build a mobile web application predicting cafeteria wait times using card swipe distributions and crowdsourced check-ins.',
    description: 'An applied software engineering project emphasizing full-stack React/Tailwind frontend integration, REST APIs, and privacy-preserving student check-in telemetry.',
    subject: 'Web & Mobile Systems',
    discipline: 'Full-Stack Software Engineering',
    skills: ['React', 'TypeScript', 'TailwindCSS', 'Node.js', 'REST APIs'],
    difficultyLevel: 'Intermediate',
    projectType: 'Coursework',
    estimatedDuration: '2-3 weeks',
    suggestedTeamSize: { min: 2, max: 4 },
    universityOrCourse: 'Ohio State CSE 3901',
    expectedDeliverables: [
      'Mobile-First Responsive Dining Hall Wait Visualizer',
      'Prediction Engine API with Historical Moving Averages',
      'Accessible UI Meeting WCAG AA Color Contrast Standards',
      'Individual Contribution Deliverables with Google Docs Timeline',
    ],
    learningObjectives: [
      'Design accessible and touch-friendly mobile layouts',
      'Handle optimistic UI updates and network latency gracefully',
      'Collaborate using modular component architecture and Git workflows',
    ],
    defaultGradingRubric: [
      { id: 'rub-9', criterion: 'UI Usability & Mobile Accessibility', weight: 35, description: 'Responsive design from 320px to 1440px with keyboard navigable tabs.' },
      { id: 'rub-10', criterion: 'API Design & Error Boundaries', weight: 30, description: 'REST contracts with informative HTTP status codes.' },
      { id: 'rub-11', criterion: 'Test Coverage & Performance', weight: 20, description: 'Unit tests for prediction algorithms and UI rendering.' },
      { id: 'rub-12', criterion: 'Individual Evidence Quality', weight: 15, description: 'Reviewer-verified deliverables demonstrating individual contributions.' },
    ],
    isReusableTemplate: true,
    reusablePermissions: 'Permitted for Classroom Reuse',
    creatorName: 'Prof. Robert Hayes',
    creatorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&auto=format&fit=crop&q=80',
    creatorRole: 'Professor of CSE, Ohio State University',
    visibility: 'Public Reusable',
    tags: ['Web Applications', 'React', 'TypeScript', 'Campus Tech'],
  },
  {
    id: 'tmpl-edge-keyword-spotter',
    title: 'Edge AI Audio Keyword Spotter for Low-Power Microcontrollers',
    summary: 'Deploy an ultra-low-power neural network on ARM Cortex-M or ESP32 microcontrollers detecting voice wake-words.',
    description: 'Students capture acoustic speech samples, train a depthwise separable convolutional network (DS-CNN) in PyTorch, quantize weights to INT8, and run inference within 64KB SRAM constraints.',
    subject: 'Computer Science & Engineering',
    discipline: 'Embedded Systems & TinyML',
    skills: ['C++', 'Embedded Systems', 'PyTorch', 'TinyML', 'DSP', 'Edge Computing'],
    difficultyLevel: 'Intermediate',
    projectType: 'Lab',
    estimatedDuration: '2-3 weeks',
    suggestedTeamSize: { min: 1, max: 2 },
    universityOrCourse: 'Georgia Tech CS 8803 / Harvard CS 249r',
    expectedDeliverables: [
      'PyTorch Speech Spectrogram Preprocessing Pipeline',
      'INT8 Quantized Model Running on Embedded Simulator / Microcontroller',
      'Latency and Accuracy Benchmark Matrix (>90% accuracy, <50ms inference)',
      'Individual Hardware Lab Notebook',
    ],
    learningObjectives: [
      'Extract MFCC (Mel-Frequency Cepstral Coefficients) audio features',
      'Understand fixed-point arithmetic vs floating point limitations in MCU hardware',
      'Balance inference latency, memory footprint, and false rejection rate',
    ],
    defaultGradingRubric: [
      { id: 'rub-13', criterion: 'Model Quantization & Footprint Limit', weight: 40, description: 'Model stays strictly under 64KB RAM and achieves <60ms execution.' },
      { id: 'rub-14', criterion: 'Keyword Recognition Accuracy', weight: 35, description: 'Accuracy >=90% on clean audio and >=80% under 10dB ambient noise.' },
      { id: 'rub-15', criterion: 'Documentation & Clean Embedded C++', weight: 25, description: 'Clean peripheral driver code without dynamic heap allocations.' },
    ],
    isReusableTemplate: true,
    reusablePermissions: 'Permitted for Classroom Reuse',
    creatorName: 'Carlos Mendez',
    creatorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
    creatorRole: 'Principal Hardware Architect, GreenStack IoT',
    visibility: 'Public Reusable',
    tags: ['Embedded Systems', 'TinyML', 'Audio AI', 'C++', 'IoT'],
  },
  {
    id: 'tmpl-civic-voting-drop',
    title: 'Accessible Civic Voting Location & Ballot Drop Finder',
    summary: 'Build an accessible, multilingual web application directing voters to certified ballot drop-offs and accessible voting centers.',
    description: 'Focuses on universal design, multi-language localization, offline accessibility (service workers), and screen reader compatibility.',
    subject: 'Human-Computer Interaction',
    discipline: 'HCI & Accessible Tech',
    skills: ['React', 'Accessibility (a11y)', 'WCAG AAA', 'TailwindCSS', 'Figma'],
    difficultyLevel: 'Beginner',
    projectType: 'Coursework',
    estimatedDuration: '2-3 weeks',
    suggestedTeamSize: { min: 2, max: 3 },
    universityOrCourse: 'Purdue University CGT / University of Washington HCDE',
    expectedDeliverables: [
      'WCAG AAA High-Contrast Civic Voting Location Map',
      'Screen-Reader Tested Navigation Protocol',
      'Multilingual Translation Dictionary (English, Spanish, Mandarin)',
      'User Testing Evaluation Report with 5 Test Participants',
    ],
    learningObjectives: [
      'Apply universal design principles for visually impaired and elderly users',
      'Write semantic HTML and ARIA landmarks verified with screen readers',
      'Conduct usability sessions and iterate based on participant friction',
    ],
    defaultGradingRubric: [
      { id: 'rub-16', criterion: 'Accessibility Audit & Zero Critical Violations', weight: 40, description: 'Zero axe-core accessibility errors and perfect keyboard navigability.' },
      { id: 'rub-17', criterion: 'Design System Documentation', weight: 30, description: 'Figma tokens, contrast ratios, and clear tap target spacing.' },
      { id: 'rub-18', criterion: 'Individual Usability Test Records', weight: 30, description: 'Authentic qualitative test notes with student team attribution.' },
    ],
    isReusableTemplate: true,
    reusablePermissions: 'Permitted for Classroom Reuse',
    creatorName: 'Maya Lin',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
    creatorRole: 'UX & Accessibility Designer',
    visibility: 'Public Reusable',
    tags: ['Accessibility', 'HCI', 'Civic Tech', 'Design Systems', 'Frontend'],
  },
  {
    id: 'tmpl-telehealth-portal',
    title: 'Healthcare Patient Portal with Encrypted Triage Records',
    summary: 'Develop a HIPAA-conscious patient appointment and doctor messaging portal with encrypted session storage and role-based access.',
    description: 'A full-stack web systems capstone focusing on cryptographic session management, audit log immutability, and clean UI workflows for clinical specialists and patients.',
    subject: 'Software Engineering & HealthTech',
    discipline: 'Healthcare Information Systems',
    skills: ['TypeScript', 'React', 'Node.js', 'Cryptography', 'SQL', 'Security'],
    difficultyLevel: 'Intermediate',
    projectType: 'Capstone',
    estimatedDuration: '4 weeks',
    suggestedTeamSize: { min: 3, max: 4 },
    universityOrCourse: 'Johns Hopkins CS 421 / Ohio State CSE 3901',
    expectedDeliverables: [
      'Encrypted Patient Health Questionnaire & Appointment Portal',
      'Role-Based Doctor / Nurse / Patient Security Middleware',
      'Immutable Audit Logging Engine',
      'Team Security Threat Model Document',
    ],
    learningObjectives: [
      'Implement principle of least privilege in healthcare route access',
      'Prevent common web vulnerabilities (XSS, CSRF, SQL Injection)',
      'Document security threat models using STRIDE methodology',
    ],
    defaultGradingRubric: [
      { id: 'rub-19', criterion: 'Security Architecture & Authorization Defense', weight: 40, description: 'Zero unauthorized data leaks across patient boundaries.' },
      { id: 'rub-20', criterion: 'Clinical Workflow Usability', weight: 30, description: 'Clean intuitive triage intake forms.' },
      { id: 'rub-21', criterion: 'Individual Contribution Evidence', weight: 30, description: 'Verified commits and architecture documents with team timestamps.' },
    ],
    isReusableTemplate: true,
    reusablePermissions: 'Permitted for Classroom Reuse',
    creatorName: 'Rachel Sterling',
    creatorAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=160&auto=format&fit=crop&q=80',
    creatorRole: 'Staff Bioinformatics Architect, BioCompute',
    visibility: 'Public Reusable',
    tags: ['Healthcare', 'Security', 'TypeScript', 'Web Applications', 'SQL'],
  },
];

// ==========================================
// 8. AUTHORIZED COMPARISON REFERENCE SOURCES
// ==========================================
export const INITIAL_COMPARISON_SOURCES: ComparisonSource[] = [
  {
    id: 'src-cse3901-assignment-prompt',
    title: 'CSE 3901 Lab Inventory Assignment Prompt & Specifications',
    authorName: 'Prof. Robert Hayes',
    sourceType: 'Course Material',
    rawText: `ASSIGNMENT INSTRUCTIONS & SPECIFICATIONS:
1. Architecture Requirements:
   - React 19 frontend with TypeScript and clean state management.
   - RESTful Express/Node API with JWT session tokens and role-based route middleware.
   - Relational database with transactional asset locks for simultaneous checkout requests.
2. Group Collaboration:
   - Form teams of 3 to 4 students using SkillSink skill matching.
   - Document individual contributions in the shared Google Docs Architecture Specification.
   - Attach functional evidence links for individual grading review.
3. Academic Integrity & Anti-Copying Protections:
   - Source code solutions MUST remain private to enrolled team members.
   - Public GitHub repository attachment is strictly prevented to avoid cross-semester code plagiarism.
   - Public Showcase entries require instructor approval of a safe, non-solution project summary.`,
    isAuthorized: true,
  },
  {
    id: 'src-postgres-concurrency-notes',
    title: 'Course Lecture 14: Relational Transaction Isolation & Concurrency Control',
    authorName: 'Prof. Robert Hayes',
    sourceType: 'Course Material',
    rawText: `In PostgreSQL, advisory locks provide application-level locking without holding table-wide row locks. The statement SELECT pg_advisory_xact_lock(hashtext(item_id)) obtains an exclusive transaction-level lock on the specific asset. When simultaneous checkout requests occur, transactions operating under SERIALIZABLE isolation will detect serialization anomalies and raise SQLSTATE 40001 (serialization_failure), requiring clients to perform an optimistic backoff and retry loop.`,
    isAuthorized: true,
  },
  {
    id: 'src-peer-sub-patel',
    title: 'Kevin Patel: Database Advisory Locking and Inventory Transaction Spec',
    authorName: 'Kevin Patel',
    sourceType: 'Peer Submission',
    rawText: `We establish a SERIALIZABLE isolation level with exponential backoff retry logic. The checkout transaction acquires an advisory lock pg_advisory_xact_lock using the integer hash of the equipment item id. If a lock conflict occurs within the 250ms lease window, the client initiates an optimistic state rollback and responds with HTTP 409 Conflict. All asset state transitions are logged to the immutable checkout_events ledger with employee ID attribution and ISO timestamp verification.`,
    isAuthorized: true,
  },
  {
    id: 'src-robotics-kinematics-notes',
    title: 'CSE 5521 Inverse Kinematics Formulation Reference',
    authorName: 'Prof. Robert Hayes',
    sourceType: 'Reference Solution',
    rawText: `The Levenberg-Marquardt algorithm provides damped least-squares solutions to the inverse kinematics equation delta_theta = J_transpose * (J * J_transpose + lambda^2 * I)^(-1) * delta_x. The damping factor lambda prevents singular value explosion near joint limit boundaries. Convergence benchmark requires reaching Cartesian error tolerance epsilon < 0.001 within 100 iterations across 500 randomized target vectors.`,
    isAuthorized: true,
  },
];

// ==========================================
// 9. STUDENT SUBMISSIONS FOR CLASSROOM INTEGRITY
// ==========================================
export const INITIAL_STUDENT_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-alex-chen',
    assignmentId: 'assign-cse3901-lab-inventory',
    assignmentTitle: 'Full-Stack Collaborative Lab Inventory System',
    classCode: 'CSE 3901',
    className: 'Web Applications',
    studentId: 'user_alex_chen',
    studentName: 'Alex Chen',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    isGroupSubmission: true,
    groupName: 'Team Buckeye Devs',
    groupMembers: [
      { studentId: 'user_alex_chen', studentName: 'Alex Chen', studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80', role: 'Full-Stack Systems Lead' },
      { studentId: 'user_daniel_miller', studentName: 'Daniel Miller', studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80', role: 'Backend API Developer' },
      { studentId: 'user_elena_ramos', studentName: 'Elena Ramos', studentAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80', role: 'Frontend & UI Specialist' },
    ],
    submissionDate: '2026-10-24T14:30:00Z',
    revisionStatus: 'Original',
    textContent: `COLLABORATIVE ARCHITECTURE & REST SPECIFICATION:
Authored by Alex Chen (Lead Systems Architect).
Project: Full-Stack Collaborative Lab Inventory System for CSE 3901 Web Applications.

1. High-Level Architecture Overview:
Our team built a multi-tier web application tracking university hardware lab checkouts, equipment availability, and barcode reservation schedules. The system is deployed with a React 19 frontend with TypeScript and clean state management, communicating over HTTPS to a RESTful Express/Node API with JWT session tokens and role-based route middleware.

2. Concurrency Control and Isolation:
To handle simultaneous checkout requests across lab kiosks, we configured a relational database with transactional asset locks for simultaneous checkout requests. We enforce SERIALIZABLE isolation on the /api/reservations/lock endpoint. If two student workers scan the same hardware barcode at the exact same millisecond, the Postgres engine detects the conflict and serializes the update, preventing double-checkout state corruption.

3. Testing and Code Quality:
We developed an integration test suite with 85%+ coverage verifying authentication routes, session expiration, and rollback conditions under concurrent simulated network traffic.`,
    codeSnippet: `// Server-side transactional checkout handler with Postgres advisory lock
export async function checkoutEquipment(req: Request, res: Response) {
  const { equipmentId, studentId, expectedReturnDate } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE');
    const lockResult = await client.query('SELECT pg_try_advisory_xact_lock($1)', [hashId(equipmentId)]);
    if (!lockResult.rows[0].pg_try_advisory_xact_lock) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Equipment currently locked by simultaneous kiosk session.' });
    }
    const item = await client.query('SELECT * FROM equipment WHERE id = $1 FOR UPDATE', [equipmentId]);
    if (item.rows[0].status !== 'AVAILABLE') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Item already checked out.' });
    }
    await client.query('UPDATE equipment SET status = $1, current_borrower = $2 WHERE id = $3', ['CHECKED_OUT', studentId, equipmentId]);
    await client.query('COMMIT');
    return res.status(200).json({ success: true, message: 'Equipment reserved successfully.' });
  } catch (err) {
    await client.query('ROLLBACK');
    return res.status(500).json({ error: 'Internal transaction error.' });
  } finally {
    client.release();
  }
}`,
    codeLanguage: 'TypeScript',
    googleDocsUrl: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
    individualContributionDesc: 'Authored Section 1 and Section 2: Implemented the backend transaction isolation protocol in Node/PostgreSQL and wrote the full 16-page Architecture Spec in Google Docs.',
    similarityChecked: true,
    similarityReport: {
      id: 'sim-rep-alex',
      submissionId: 'sub-alex-chen',
      studentName: 'Alex Chen',
      assignmentTitle: 'Full-Stack Collaborative Lab Inventory System',
      calculatedAt: '2026-10-24T14:35:00Z',
      detectionMode: 'text',
      overallOverlapPercent: 18, // Legitimate overlap from assignment instructions and rubric
      matchingPassages: [
        {
          id: 'p-1',
          matchedText: 'React 19 frontend with TypeScript and clean state management, communicating over HTTPS to a RESTful Express/Node API with JWT session tokens and role-based route middleware.',
          normalizedMatch: 'react 19 frontend with typescript and clean state management communicating over https to a restful express node api with jwt session tokens and role based route middleware',
          sourceDocumentId: 'src-cse3901-assignment-prompt',
          sourceDocumentTitle: 'CSE 3901 Lab Inventory Assignment Prompt & Specifications',
          sourceType: 'Course Material',
          sourceExcerpt: '1. Architecture Requirements: - React 19 frontend with TypeScript and clean state management. - RESTful Express/Node API with JWT session tokens...',
          isBoilerplate: true,
        },
        {
          id: 'p-2',
          matchedText: 'relational database with transactional asset locks for simultaneous checkout requests',
          normalizedMatch: 'relational database with transactional asset locks for simultaneous checkout requests',
          sourceDocumentId: 'src-cse3901-assignment-prompt',
          sourceDocumentTitle: 'CSE 3901 Lab Inventory Assignment Prompt & Specifications',
          sourceType: 'Course Material',
          sourceExcerpt: 'Relational database with transactional asset locks for simultaneous checkout requests.',
          isBoilerplate: true,
        },
      ],
      sourceBreakdown: [
        {
          sourceId: 'src-cse3901-assignment-prompt',
          sourceTitle: 'CSE 3901 Lab Inventory Assignment Prompt & Specifications',
          sourceType: 'Course Material',
          overlapPercent: 18,
          passageCount: 2,
        },
      ],
      commonBoilerplateMatches: [
        'React 19 frontend with TypeScript and clean state management',
        'relational database with transactional asset locks for simultaneous checkout requests',
      ],
      aiExplanation: `AI-Assisted Analysis Summary (Text Shingle Mode):
• Detected Overlap: 18% of word sequences match authorized reference documents.
• Primary Match: CSE 3901 Lab Inventory Assignment Prompt & Specifications (Course Material) accounts for 18% of matching shingles.
• Contextual Finding: Overlapping passages match standard assignment specifications and rubric requirements provided in the course instructions. This constitutes normal instructional boilerplate rather than copied solution logic.
• Recommendation: Acceptable overlap. The substantive architectural design, API endpoints, and code implementation are original work authored by the student team.`,
      limitationsNotice: 'Similarity does not prove plagiarism. Common instructions, quotations, templates, and authorized collaboration may create legitimate overlap. A teacher must review the evidence and assignment rules before reaching a conclusion.',
      teacherReviewStatus: 'Reviewed — acceptable overlap',
      teacherNotes: 'Confirmed. Overlap is solely assignment rubric requirements quoted in Section 1. Original architecture is verified.',
      teacherReviewDate: '2026-10-24',
    },
  },
  {
    id: 'sub-daniel-miller',
    assignmentId: 'assign-cse3901-lab-inventory',
    assignmentTitle: 'Full-Stack Collaborative Lab Inventory System',
    classCode: 'CSE 3901',
    className: 'Web Applications',
    studentId: 'user_daniel_miller',
    studentName: 'Daniel Miller',
    studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    isGroupSubmission: true,
    groupName: 'Team Buckeye Devs',
    submissionDate: '2026-10-24T12:15:00Z',
    revisionStatus: 'Original',
    textContent: `DATABASE CONCURRENCY & TRANSACTION ISOLATION MODULE:
Submitted by Daniel Miller.

We establish a SERIALIZABLE isolation level with exponential backoff retry logic. The checkout transaction acquires an advisory lock pg_advisory_xact_lock using the integer hash of the equipment item id. If a lock conflict occurs within the 250ms lease window, the client initiates an optimistic state rollback and responds with HTTP 409 Conflict. All asset state transitions are logged to the immutable checkout_events ledger with employee ID attribution and ISO timestamp verification.

In our stress benchmark, 50 concurrent transactions were executed against a single hardware item. The advisory lock correctly serialized all 50 attempts with zero dirty reads and zero race conditions.`,
    codeSnippet: `// Advisory lock helper
const acquireLock = async (client, id) => {
  return await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [id]);
};`,
    codeLanguage: 'JavaScript',
    individualContributionDesc: 'Wrote the transaction locking loops and benchmarked simultaneous checkout collisions.',
    similarityChecked: true,
    similarityReport: {
      id: 'sim-rep-daniel',
      submissionId: 'sub-daniel-miller',
      studentName: 'Daniel Miller',
      assignmentTitle: 'Full-Stack Collaborative Lab Inventory System',
      calculatedAt: '2026-10-24T13:00:00Z',
      detectionMode: 'text',
      overallOverlapPercent: 54, // Intentionally overlapping with Kevin Patel (sub-kevin-patel)
      matchingPassages: [
        {
          id: 'p-dan-1',
          matchedText: 'We establish a SERIALIZABLE isolation level with exponential backoff retry logic. The checkout transaction acquires an advisory lock pg_advisory_xact_lock using the integer hash of the equipment item id. If a lock conflict occurs within the 250ms lease window, the client initiates an optimistic state rollback and responds with HTTP 409 Conflict. All asset state transitions are logged to the immutable checkout_events ledger with employee ID attribution and ISO timestamp verification.',
          normalizedMatch: 'we establish a serializable isolation level with exponential backoff retry logic the checkout transaction acquires an advisory lock pg advisory xact lock using the integer hash of the equipment item id if a lock conflict occurs within the 250ms lease window the client initiates an optimistic state rollback and responds with http 409 conflict all asset state transitions are logged to the immutable checkout events ledger with employee id attribution and iso timestamp verification',
          sourceDocumentId: 'src-peer-sub-patel',
          sourceDocumentTitle: 'Kevin Patel: Database Advisory Locking and Inventory Transaction Spec',
          sourceType: 'Peer Submission',
          sourceExcerpt: 'We establish a SERIALIZABLE isolation level with exponential backoff retry logic. The checkout transaction acquires an advisory lock pg_advisory_xact_lock using the integer hash of the equipment item id...',
          isBoilerplate: false,
        },
      ],
      sourceBreakdown: [
        {
          sourceId: 'src-peer-sub-patel',
          sourceTitle: 'Kevin Patel: Database Advisory Locking and Inventory Transaction Spec',
          sourceType: 'Peer Submission',
          overlapPercent: 54,
          passageCount: 1,
        },
      ],
      commonBoilerplateMatches: [],
      aiExplanation: `AI-Assisted Analysis Summary (Text Shingle Mode):
• Detected Overlap: 54% of word sequences match authorized reference documents.
• Primary Match: Kevin Patel: Database Advisory Locking and Inventory Transaction Spec (Peer Submission) accounts for 54% of matching shingles.
• Contextual Finding: The entire core paragraph describing the SERIALIZABLE isolation level, advisory lock function call, and 250ms lease window is verbatim identical between Daniel Miller and peer student Kevin Patel.
• Recommendation: Flagged for teacher review. Recommend requesting clarification from both students to determine whether they collaborated legitimately or shared text across different groups.`,
      limitationsNotice: 'Similarity does not prove plagiarism. Common instructions, quotations, templates, and authorized collaboration may create legitimate overlap. A teacher must review the evidence and assignment rules before reaching a conclusion.',
      teacherReviewStatus: 'Needs clarification',
      teacherNotes: 'Identical paragraph shared with Kevin Patel. Need to clarify if this was cross-group collaboration.',
      teacherReviewDate: '2026-10-24',
      studentExplanationRequested: true,
    },
  },
  {
    id: 'sub-kevin-patel',
    assignmentId: 'assign-cse3901-lab-inventory',
    assignmentTitle: 'Full-Stack Collaborative Lab Inventory System',
    classCode: 'CSE 3901',
    className: 'Web Applications',
    studentId: 'user_kevin_patel',
    studentName: 'Kevin Patel',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    isGroupSubmission: true,
    groupName: 'Team Web Arch 2',
    submissionDate: '2026-10-24T11:45:00Z',
    revisionStatus: 'Original',
    textContent: `INVENTORY TRANSACTION ENGINE & ADVISORY LOCKS:
Submitted by Kevin Patel.

We establish a SERIALIZABLE isolation level with exponential backoff retry logic. The checkout transaction acquires an advisory lock pg_advisory_xact_lock using the integer hash of the equipment item id. If a lock conflict occurs within the 250ms lease window, the client initiates an optimistic state rollback and responds with HTTP 409 Conflict. All asset state transitions are logged to the immutable checkout_events ledger with employee ID attribution and ISO timestamp verification.

Our architecture ensures zero deadlocks by enforcing deterministic alphanumeric order on multi-item asset lock acquisitions.`,
    individualContributionDesc: 'Engineered the transaction isolation guarantees and ledger logging table schema.',
    similarityChecked: true,
    similarityReport: {
      id: 'sim-rep-kevin',
      submissionId: 'sub-kevin-patel',
      studentName: 'Kevin Patel',
      assignmentTitle: 'Full-Stack Collaborative Lab Inventory System',
      calculatedAt: '2026-10-24T13:05:00Z',
      detectionMode: 'text',
      overallOverlapPercent: 56, // Intentionally overlapping with Daniel Miller
      matchingPassages: [
        {
          id: 'p-kev-1',
          matchedText: 'We establish a SERIALIZABLE isolation level with exponential backoff retry logic. The checkout transaction acquires an advisory lock pg_advisory_xact_lock using the integer hash of the equipment item id. If a lock conflict occurs within the 250ms lease window, the client initiates an optimistic state rollback and responds with HTTP 409 Conflict. All asset state transitions are logged to the immutable checkout_events ledger with employee ID attribution and ISO timestamp verification.',
          normalizedMatch: 'we establish a serializable isolation level with exponential backoff retry logic the checkout transaction acquires an advisory lock pg advisory xact lock using the integer hash of the equipment item id if a lock conflict occurs within the 250ms lease window the client initiates an optimistic state rollback and responds with http 409 conflict all asset state transitions are logged to the immutable checkout events ledger with employee id attribution and iso timestamp verification',
          sourceDocumentId: 'sub-daniel-miller',
          sourceDocumentTitle: 'Daniel Miller: Database Concurrency & Advisory Lock Spec',
          sourceType: 'Peer Submission',
          sourceExcerpt: 'We establish a SERIALIZABLE isolation level with exponential backoff retry logic. The checkout transaction acquires an advisory lock pg_advisory_xact_lock using the integer hash of the equipment item id...',
          isBoilerplate: false,
        },
      ],
      sourceBreakdown: [
        {
          sourceId: 'sub-daniel-miller',
          sourceTitle: 'Daniel Miller: Database Concurrency & Advisory Lock Spec',
          sourceType: 'Peer Submission',
          overlapPercent: 56,
          passageCount: 1,
        },
      ],
      commonBoilerplateMatches: [],
      aiExplanation: `AI-Assisted Analysis Summary (Text Shingle Mode):
• Detected Overlap: 56% of word sequences match authorized reference documents.
• Primary Match: Daniel Miller: Database Concurrency & Advisory Lock Spec (Peer Submission) accounts for 56% of matching shingles.
• Contextual Finding: Substantial exact-sequence overlap in the core transactional specification paragraph. Both students describe the same 250ms lease window and retry logic verbatim.
• Recommendation: Human instructor review recommended to evaluate whether students shared text across different project groups.`,
      limitationsNotice: 'Similarity does not prove plagiarism. Common instructions, quotations, templates, and authorized collaboration may create legitimate overlap. A teacher must review the evidence and assignment rules before reaching a conclusion.',
      teacherReviewStatus: 'Not reviewed',
    },
  },
  {
    id: 'sub-elena-ramos',
    assignmentId: 'assign-cse3901-lab-inventory',
    assignmentTitle: 'Full-Stack Collaborative Lab Inventory System',
    classCode: 'CSE 3901',
    className: 'Web Applications',
    studentId: 'user_elena_ramos',
    studentName: 'Elena Ramos',
    studentAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
    isGroupSubmission: true,
    groupName: 'Team Buckeye Devs',
    submissionDate: '2026-10-24T10:20:00Z',
    revisionStatus: 'Original',
    textContent: `EQUIPMENT QR SCANNER & ACCESSIBLE UI COMPONENT SPECIFICATION:
Author: Elena Ramos (UI & Accessibility Lead).

We built a mobile-responsive camera feed scanner using the BarcodeDetector browser API with fallback to zxing-js. The camera view aligns a visual reticle with audible tactile feedback on successful tag detection. The inventory dashboard supports high-contrast dark mode with 7.2:1 contrast ratios exceeding WCAG AAA guidelines. State management relies on custom React hooks with optimistic badge updates so students immediately see equipment reserved before server roundtrips complete.`,
    individualContributionDesc: 'Engineered the mobile camera scanner component, designed high-density item list, and verified screen-reader accessibility.',
    similarityChecked: true,
    similarityReport: {
      id: 'sim-rep-elena',
      submissionId: 'sub-elena-ramos',
      studentName: 'Elena Ramos',
      assignmentTitle: 'Full-Stack Collaborative Lab Inventory System',
      calculatedAt: '2026-10-24T10:25:00Z',
      detectionMode: 'text',
      overallOverlapPercent: 6,
      matchingPassages: [],
      sourceBreakdown: [],
      commonBoilerplateMatches: [],
      aiExplanation: `AI-Assisted Analysis Summary (Text Shingle Mode):
• Detected Overlap: 6% of word sequences match authorized reference documents.
• Contextual Finding: The submission is almost completely original. The minor overlap consists of generic web terms (React hooks, state management).
• Recommendation: Acceptable independent work.`,
      limitationsNotice: 'Similarity does not prove plagiarism. Common instructions, quotations, templates, and authorized collaboration may create legitimate overlap. A teacher must review the evidence and assignment rules before reaching a conclusion.',
      teacherReviewStatus: 'Reviewed — acceptable overlap',
      teacherNotes: 'Excellent original accessibility work. Verified.',
      teacherReviewDate: '2026-10-24',
    },
  },
  {
    id: 'sub-marcus-vance',
    assignmentId: 'assign-cse5521-robotics-ik',
    assignmentTitle: 'Multi-Joint Robotic Arm Inverse Kinematics Solver',
    classCode: 'CSE 5521',
    className: 'Survey of Artificial Intelligence',
    studentId: 'user_marcus_vance',
    studentName: 'Marcus Vance',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    isGroupSubmission: true,
    groupName: 'Team Kinematics Alpha',
    submissionDate: '2026-10-23T16:00:00Z',
    revisionStatus: 'Original',
    textContent: `NUMERICAL INVERSE KINEMATICS & LEVENBERG-MARQUARDT CONVERGENCE:
Student: Marcus Vance (CSE 5521).

We implement the Levenberg-Marquardt algorithm providing damped least-squares solutions to the inverse kinematics equation delta_theta = J_transpose * (J * J_transpose + lambda^2 * I)^(-1) * delta_x. The damping factor lambda prevents singular value explosion near joint limit boundaries.

To benchmark trajectory convergence, we tested 500 randomized target coordinates across the 1.2m reachable workspace sphere. The solver achieved 99.4% convergence with mean iteration count of 14.2 steps and average solving latency of 1.8 milliseconds in NumPy.`,
    codeSnippet: `def solve_ik_step(J, delta_x, lambda_damp=0.01):
    jt = J.T
    damping = (lambda_damp ** 2) * np.eye(J.shape[0])
    delta_theta = jt @ np.linalg.inv(J @ jt + damping) @ delta_x
    return delta_theta`,
    codeLanguage: 'Python',
    individualContributionDesc: 'Formulated the damped Jacobian transpose equations and ran numerical benchmarks in Python.',
    similarityChecked: true,
    similarityReport: {
      id: 'sim-rep-marcus',
      submissionId: 'sub-marcus-vance',
      studentName: 'Marcus Vance',
      assignmentTitle: 'Multi-Joint Robotic Arm Inverse Kinematics Solver',
      calculatedAt: '2026-10-23T16:15:00Z',
      detectionMode: 'text',
      overallOverlapPercent: 14,
      matchingPassages: [
        {
          id: 'p-marc-1',
          matchedText: 'The Levenberg-Marquardt algorithm provides damped least-squares solutions to the inverse kinematics equation delta_theta = J_transpose * (J * J_transpose + lambda^2 * I)^(-1) * delta_x. The damping factor lambda prevents singular value explosion near joint limit boundaries.',
          normalizedMatch: 'the levenberg marquardt algorithm provides damped least squares solutions to the inverse kinematics equation delta theta j transpose j j transpose lambda 2 i 1 delta x the damping factor lambda prevents singular value explosion near joint limit boundaries',
          sourceDocumentId: 'src-robotics-kinematics-notes',
          sourceDocumentTitle: 'CSE 5521 Inverse Kinematics Formulation Reference',
          sourceType: 'Reference Solution',
          sourceExcerpt: 'The Levenberg-Marquardt algorithm provides damped least-squares solutions to the inverse kinematics equation...',
          isBoilerplate: true,
        },
      ],
      sourceBreakdown: [
        {
          sourceId: 'src-robotics-kinematics-notes',
          sourceTitle: 'CSE 5521 Inverse Kinematics Formulation Reference',
          sourceType: 'Reference Solution',
          overlapPercent: 14,
          passageCount: 1,
        },
      ],
      commonBoilerplateMatches: ['Levenberg-Marquardt algorithm provides damped least-squares solutions'],
      aiExplanation: `AI-Assisted Analysis Summary (Text Shingle Mode):
• Detected Overlap: 14% of word sequences match authorized reference documents.
• Primary Match: CSE 5521 Inverse Kinematics Formulation Reference (Reference Solution).
• Contextual Finding: Overlapping text is the standard mathematical definition of the damped least-squares Jacobian matrix provided in lecture notes. The benchmarking implementation and results are original.
• Recommendation: Acceptable overlap. Standard equation quotation.`,
      limitationsNotice: 'Similarity does not prove plagiarism. Common instructions, quotations, templates, and authorized collaboration may create legitimate overlap. A teacher must review the evidence and assignment rules before reaching a conclusion.',
      teacherReviewStatus: 'Not reviewed',
    },
  },
  {
    id: 'sub-sophia-wu',
    assignmentId: 'assign-cse5521-robotics-ik',
    assignmentTitle: 'Multi-Joint Robotic Arm Inverse Kinematics Solver',
    classCode: 'CSE 5521',
    className: 'Survey of Artificial Intelligence',
    studentId: 'user_sophia_wu',
    studentName: 'Sophia Wu',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    isGroupSubmission: false,
    submissionDate: '2026-10-23T14:10:00Z',
    revisionStatus: 'Final',
    textContent: `COLLISION AVOIDANCE TRAJECTORY PLANNING & REVOLUTE JOINT NULL-SPACE CONTROL:
Student: Sophia Wu.

We project secondary obstacle avoidance gradients into the null-space of the primary Jacobian matrix: delta_theta = J_pinv * delta_x + (I - J_pinv * J) * grad_phi. This guarantees end-effector Cartesian goal tracking while joints avoid convex polyhedral obstacles. In our evaluation, the manipulator cleared all 3 dynamic obstacles with zero link collisions.`,
    individualContributionDesc: 'Derived null-space projection equations and implemented obstacle gradient repulsion.',
    similarityChecked: true,
    similarityReport: {
      id: 'sim-rep-sophia',
      submissionId: 'sub-sophia-wu',
      studentName: 'Sophia Wu',
      assignmentTitle: 'Multi-Joint Robotic Arm Inverse Kinematics Solver',
      calculatedAt: '2026-10-23T14:20:00Z',
      detectionMode: 'text',
      overallOverlapPercent: 8,
      matchingPassages: [],
      sourceBreakdown: [],
      commonBoilerplateMatches: [],
      aiExplanation: `AI-Assisted Analysis Summary (Text Shingle Mode):
• Detected Overlap: 8% of word sequences match authorized reference documents.
• Contextual Finding: Null-space projection equations match standard textbook formulations. The trajectory avoidance derivation is rigorous and original.
• Recommendation: Reviewed and confirmed by instructor.`,
      limitationsNotice: 'Similarity does not prove plagiarism. Common instructions, quotations, templates, and authorized collaboration may create legitimate overlap. A teacher must review the evidence and assignment rules before reaching a conclusion.',
      teacherReviewStatus: 'Reviewed — acceptable overlap',
      teacherNotes: 'Formulaic similarities stem from standard textbook null-space definitions. Clean original obstacle repulsion logic. Approved.',
      teacherReviewDate: '2026-10-23',
    },
  },
];
