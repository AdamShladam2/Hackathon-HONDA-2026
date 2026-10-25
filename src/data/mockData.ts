import {
  Project,
  Author,
  Message,
  Invitation,
  CodeRequest,
  ProjectApplication,
  ProjectTask,
  ProjectMilestone,
} from '../types';

// ==========================================
// 1. DEMO ACCOUNTS (13 diverse fictional personas)
// ==========================================

// 5 Working Professionals
export const DEMO_PROFESSIONALS: Author[] = [
  {
    id: 'user_sarah_lin',
    name: 'Sarah Lin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    bio: 'Principal AI Engineer with 8 years building distributed model inference pipelines and autonomous agent frameworks.',
    identities: ['Working professional', 'Industry mentor'],
    jobTitle: 'Principal AI Research Engineer',
    organization: 'OmniNeural Labs',
    industry: 'Artificial Intelligence & Machine Learning',
    yearsOfExperience: 8,
    skills: ['Python', 'PyTorch', 'vLLM', 'Distributed Systems', 'FastAPI', 'CUDA'],
    nonTechnicalSkills: ['Technical Leadership', 'System Architecture', 'Mentorship', 'Roadmapping'],
    portfolioUrl: 'https://sarahlin-ai.dev',
    professionalInterests: ['Edge ML Inference', 'Open Source AI', 'Agent Coordination Protocols'],
    availability: '10 hrs/week',
    collaborationPreferences: 'Remote Async with bi-weekly architecture syncs',
    openToMentoring: true,
    seekingMentorship: false,
    preferredProjectTypes: ['Open-source AI frameworks', 'Developer tools', 'Cross-campus student projects'],
    githubUsername: 'sarahlin-ai',
    githubConnected: true,
  },
  {
    id: 'user_david_park',
    name: 'David Park',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    bio: 'Staff Cloud Infrastructure Architect specializing in Kubernetes operators, eBPF network observability, and multi-region resilience.',
    identities: ['Working professional'],
    jobTitle: 'Staff Cloud Infrastructure Architect',
    organization: 'ScaleGrid Systems',
    industry: 'Cloud & Distributed Systems',
    yearsOfExperience: 7,
    skills: ['Go', 'Kubernetes', 'eBPF', 'Terraform', 'Rust', 'gRPC'],
    nonTechnicalSkills: ['Capacity Planning', 'Production Incident Triage', 'Architecture RFCs'],
    portfolioUrl: 'https://davidpark.infra.dev',
    professionalInterests: ['Cloud Cost Optimization', 'Zero Trust Networking', 'Developer Platforms'],
    availability: '8-10 hrs/week',
    collaborationPreferences: 'Remote Async (GitHub Issues + PRs)',
    openToMentoring: true,
    seekingMentorship: false,
    preferredProjectTypes: ['Open-source DevOps tools', 'Infrastructure monitoring'],
    githubUsername: 'davidpark-cloud',
    githubConnected: true,
  },
  {
    id: 'user_elena_rostova',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80',
    bio: 'Product Design Systems Lead obsessed with high-density ergonomic design, WCAG AAA accessibility, and design tokens.',
    identities: ['Working professional', 'Industry mentor'],
    jobTitle: 'Design Systems Lead',
    organization: 'Forma Studio',
    industry: 'UI/UX Design',
    yearsOfExperience: 6,
    skills: ['Figma', 'Design Systems', 'TypeScript', 'TailwindCSS', 'Accessibility (a11y)', 'User Research'],
    nonTechnicalSkills: ['Design Critiques', 'Product Strategy', 'Design-to-Engineering Handoff'],
    portfolioUrl: 'https://elenarostova.design',
    professionalInterests: ['Calm Tech Interfaces', 'Scientific Dashboard Design', 'Ergonomic Tooling'],
    availability: '6 hrs/week',
    collaborationPreferences: 'Remote with Figma brainstorms',
    openToMentoring: true,
    seekingMentorship: false,
    preferredProjectTypes: ['Open-source UI component libraries', 'Civic tech apps'],
    githubUsername: 'elenarostova-ui',
    githubConnected: true,
  },
  {
    id: 'user_marcus_thorne',
    name: 'Marcus Thorne',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&auto=format&fit=crop&q=80',
    bio: 'Head of Threat Modeling & Application Security. Veteran of enterprise penetration testing and zero-knowledge protocols.',
    identities: ['Working professional'],
    jobTitle: 'Head of Application Security',
    organization: 'Vanguard Shield Cyber',
    industry: 'Cybersecurity',
    yearsOfExperience: 9,
    skills: ['Rust', 'Python', 'Cryptography', 'Threat Modeling', 'Static Analysis', 'OWASP'],
    nonTechnicalSkills: ['Security Auditing', 'Regulatory Compliance', 'Executive Communication'],
    portfolioUrl: 'https://marcusthorne.sec',
    professionalInterests: ['Supply Chain Security', 'Post-Quantum Cryptography', 'Defensive Tooling'],
    availability: '5 hrs/week',
    collaborationPreferences: 'Remote Async, high code review rigor',
    openToMentoring: false,
    seekingMentorship: false,
    preferredProjectTypes: ['Security scanners', 'Hardened open-source utilities'],
    githubUsername: 'mthorne-sec',
    githubConnected: false,
  },
  {
    id: 'user_amara_okafor',
    name: 'Amara Okafor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    bio: 'VP of Health Informatics Strategy bridging clinical outcomes and secure FHIR data pipelines. Former hospital medical physicist.',
    identities: ['Working professional'],
    jobTitle: 'VP of Health Informatics Strategy',
    organization: 'Medivance Health',
    industry: 'HealthTech & Biotechnology',
    yearsOfExperience: 10,
    skills: ['Health Informatics', 'HL7/FHIR', 'Python', 'SQL', 'Clinical Data Governance', 'Biostatistics'],
    nonTechnicalSkills: ['Clinical Trials Planning', 'HIPAA Compliance', 'Stakeholder Management'],
    portfolioUrl: 'https://amaraokafor.health',
    professionalInterests: ['Patient Data Democratization', 'Predictive Diagnostics', 'Public Health Tooling'],
    availability: '5 hrs/week',
    collaborationPreferences: 'Remote Advisory and sprint reviews',
    openToMentoring: true,
    seekingMentorship: false,
    preferredProjectTypes: ['Civic HealthTech', 'Open clinical research datasets'],
    githubUsername: 'amara-health',
    githubConnected: false,
  },
];

// 3 Independent Developers / Recent Grads
export const DEMO_INDEPENDENTS: Author[] = [
  {
    id: 'user_devon_miller',
    name: 'Devon Miller',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&auto=format&fit=crop&q=80',
    bio: 'Recent Graduate (UMich EECS). Building high-performance audio synthesis engines and DSP pipelines in WebAssembly AudioWorklet.',
    identities: ['Recent graduate', 'Independent creator / developer'],
    school: 'University of Michigan',
    major: 'Performing Arts Technology & EECS',
    graduationYear: "'26",
    jobTitle: 'Independent Audio DSP Developer',
    industry: 'MusicTech & Audio DSP',
    yearsOfExperience: 1,
    skills: ['C++', 'WebAssembly', 'WebAudio', 'TypeScript', 'DSP', 'React'],
    nonTechnicalSkills: ['Sound Design', 'Acoustic Theory', 'Product Prototyping'],
    portfolioUrl: 'https://devonmiller-dsp.io',
    professionalInterests: ['Spatial Audio', 'Real-time WebAudio engines', 'Creative Coding'],
    availability: '20 hrs/week',
    collaborationPreferences: 'Flexible, loves pair programming and discord hack sessions',
    openToMentoring: false,
    seekingMentorship: true,
    preferredProjectTypes: ['Audio tools', 'Creative technology', 'Interactive web experiences'],
    collaborationRating: 3.8,
    reviewCount: 2,
    githubUsername: 'devonmiller-dsp',
    githubConnected: true,
  },
  {
    id: 'user_kai_tanaka',
    name: 'Kai Tanaka',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    bio: 'Independent full-stack builder & open source maintainer. Building developer analytics and privacy-first financial visualization tools.',
    identities: ['Independent creator / developer'],
    jobTitle: 'Independent Software Creator',
    industry: 'FinTech & Developer Tools',
    yearsOfExperience: 3,
    skills: ['TypeScript', 'Next.js', 'PostgreSQL', 'TailwindCSS', 'Node.js', 'Docker'],
    nonTechnicalSkills: ['Indie Hacking', 'UI/UX Prototyping', 'Content Writing'],
    portfolioUrl: 'https://kaitanaka.co',
    professionalInterests: ['Micro-SaaS', 'Personal Finance Dashboards', 'Open Source Sustenance'],
    availability: '15 hrs/week',
    collaborationPreferences: 'Async Github + quick daily updates',
    openToMentoring: false,
    seekingMentorship: false,
    preferredProjectTypes: ['Open source utilities', 'Collaborative finance trackers'],
    githubUsername: 'kaitanaka-dev',
    githubConnected: true,
  },
  {
    id: 'user_siddharth_rao',
    name: 'Siddharth Rao',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=160&auto=format&fit=crop&q=80',
    bio: 'Recent Master’s graduate in Computational Data Science. Passionate about knowledge graph construction and semantic retrieval.',
    identities: ['Recent graduate', 'Independent creator / developer'],
    school: 'Purdue University',
    major: 'MS Computational Data Science',
    graduationYear: "'26",
    jobTitle: 'Data & Graph Intelligence Researcher',
    industry: 'Data Analytics & Knowledge Graphs',
    yearsOfExperience: 2,
    skills: ['Python', 'Neo4j', 'LangChain', 'DuckDB', 'FastAPI', 'Pandas'],
    nonTechnicalSkills: ['Data Storytelling', 'Benchmark Analysis', 'Academic Writing'],
    portfolioUrl: 'https://siddharthrao.ai',
    professionalInterests: ['Graph Neural Networks', 'Semantic Search', 'Scientific Citation Graphs'],
    availability: '15 hrs/week',
    collaborationPreferences: 'Async with weekly sprint checkpoints',
    openToMentoring: false,
    seekingMentorship: true,
    preferredProjectTypes: ['Data pipelines', 'Knowledge graph exploration'],
    githubUsername: 'siddharth-rao-data',
    githubConnected: false,
  },
];

// 3 Industry Mentors
export const DEMO_MENTORS: Author[] = [
  {
    id: 'user_dr_evelyn_vance',
    name: 'Dr. Evelyn Vance',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
    bio: 'Director of Autonomous Systems at Apex Robotics with 14 years industry experience. Former NASA JPL contractor. Devoted to coaching students on ROS2, sensor fusion, and systems engineering.',
    identities: ['Industry mentor', 'Working professional'],
    jobTitle: 'Director of Autonomous Systems',
    organization: 'Apex Dynamics',
    industry: 'Robotics & Hardware',
    yearsOfExperience: 14,
    skills: ['Robotics', 'ROS2', 'SLAM', 'C++', 'Computer Vision', 'Embedded RTOS', 'Sensor Fusion'],
    nonTechnicalSkills: ['Engineering Mentorship', 'Career Coaching', 'Grant Review', 'Systems Safety'],
    portfolioUrl: 'https://evelynvance-robotics.org',
    professionalInterests: ['Planetary Exploration Rovers', 'Undergraduate STEM Research', 'Safety-Critical Perception'],
    availability: '4 hrs/week dedicated mentoring',
    collaborationPreferences: 'Weekly 1:1 mentorship calls and design review sessions',
    openToMentoring: true,
    seekingMentorship: false,
    preferredProjectTypes: ['Student competition rovers', 'Autonomous vehicle prototypes'],
    githubUsername: 'evelynvance-robotics',
    githubConnected: true,
  },
  {
    id: 'user_rachel_sterling',
    name: 'Rachel Sterling',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=160&auto=format&fit=crop&q=80',
    bio: 'Staff Bioinformatics Systems Architect at BioCompute. Mentoring early-career women and underrepresented engineers in scalable computational genomics and data integrity.',
    identities: ['Industry mentor', 'Working professional'],
    jobTitle: 'Staff Bioinformatics Architect',
    organization: 'BioCompute Corporation',
    industry: 'Biotechnology & HealthTech',
    yearsOfExperience: 12,
    skills: ['Python', 'Nextflow', 'Docker', 'Genomics', 'Bioinformatics', 'Cloud High-Performance Computing'],
    nonTechnicalSkills: ['Career Development', 'Resume & Portfolio Review', 'Scientific Publishing Advice'],
    portfolioUrl: 'https://rachelsterling.bio',
    professionalInterests: ['Single-cell RNA Pipelines', 'Open Source Genomics', 'Mentorship Equity'],
    availability: '4 hrs/week dedicated mentoring',
    collaborationPreferences: 'Bi-weekly code & architecture reviews',
    openToMentoring: true,
    seekingMentorship: false,
    preferredProjectTypes: ['Biomedical open source tools', 'Signal processing visualizers'],
    githubUsername: 'rachel-bio-arch',
    githubConnected: true,
  },
  {
    id: 'user_carlos_mendez',
    name: 'Carlos Mendez',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
    bio: 'Founder and IoT hardware fellow at GreenStack IoT. Passionate about guiding student and early-career innovators in building rugged clean-energy prototypes.',
    identities: ['Industry mentor', 'Independent creator / developer'],
    jobTitle: 'Founder & Principal Hardware Architect',
    organization: 'GreenStack IoT Fellows',
    industry: 'CleanTech & IoT',
    yearsOfExperience: 11,
    skills: ['IoT', 'ESP32', 'Embedded C/C++', 'MQTT', 'Hardware Prototyping', 'PCB Design', 'Solar Systems'],
    nonTechnicalSkills: ['Hardware DFM', 'Venture Bootstrapping', 'Prototyping Strategy'],
    portfolioUrl: 'https://carlosmendez.iot',
    professionalInterests: ['Off-grid Telemetry', 'Precision AgTech', 'Open Hardware Standards'],
    availability: '5 hrs/week dedicated mentoring',
    collaborationPreferences: 'Hands-on schematics review and weekly progress check-ins',
    openToMentoring: true,
    seekingMentorship: false,
    preferredProjectTypes: ['CleanTech prototypes', 'Environmental sensors'],
    githubUsername: 'carlos-greenstack',
    githubConnected: false,
  },
];

// 2 Students
export const DEMO_STUDENTS: Author[] = [
  {
    id: 'user_alex_chen',
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    school: 'Ohio State University',
    major: 'Computer Science & Engineering',
    graduationYear: "'27",
    bio: 'Senior computer science student specializing in edge perception, real-time telemetry dashboards, and ROS2 navigation. Lead on Buckeye Rover sensor telemetry.',
    identities: ['Student'],
    skills: ['React', 'TypeScript', 'C++', 'ROS2', 'Python', 'TailwindCSS', 'WebSockets'],
    nonTechnicalSkills: ['Team Communication', 'Rapid Prototyping'],
    portfolioUrl: 'https://alexchen.osu.edu',
    professionalInterests: ['Robotics', 'Full-stack Engineering', 'Space Flight Controllers'],
    availability: '15 hrs/week',
    collaborationPreferences: 'Hybrid / Remote with sprint goals',
    openToMentoring: false,
    seekingMentorship: true,
    preferredProjectTypes: ['Autonomous vehicles', 'Mission control dashboards', 'Open-source developer tooling'],
    collaborationRating: 4.8,
    reviewCount: 5,
    githubUsername: 'alexchen',
    githubConnected: false, // Can be connected in demo step 1
  },
  {
    id: 'user_maya_lin',
    name: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
    school: 'Purdue University',
    major: 'Human-Centered Design & Computer Graphics',
    graduationYear: "'28",
    bio: 'Sophomore UX designer and frontend enthusiast seeking hands-on mentorship on professional production applications.',
    identities: ['Student'],
    skills: ['Figma', 'React', 'CSS/Tailwind', 'Wireframing', 'User Interviews', 'Prototyping'],
    nonTechnicalSkills: ['Empathy Mapping', 'Design Systems Documentation'],
    portfolioUrl: 'https://mayalin.design',
    professionalInterests: ['Design Systems', 'Accessible EdTech', 'Product Tooling'],
    availability: '12 hrs/week',
    collaborationPreferences: 'Remote with pairing sessions',
    openToMentoring: false,
    seekingMentorship: true,
    preferredProjectTypes: ['Design systems', 'Student utility tools', 'Accessible interfaces'],
    collaborationRating: 4.6,
    reviewCount: 3,
    githubUsername: 'mayalin-ux',
    githubConnected: true,
  },
];

import { DEMO_TEACHER } from './teacherData';

// All Demo Accounts List for Switcher (includes Dedicated Teacher Account)
export const ALL_DEMO_ACCOUNTS: Author[] = [
  DEMO_TEACHER,
  ...DEMO_PROFESSIONALS,
  ...DEMO_INDEPENDENTS,
  ...DEMO_MENTORS,
  ...DEMO_STUDENTS,
];

export { DEMO_TEACHER };

// Default initial user is Alex Chen (or Sarah Lin when testing professional flow)
export const CURRENT_USER: Author = DEMO_STUDENTS[0];

// ==========================================
// 2. WORK HUB PROJECTS (8 rich, diverse projects)
// ==========================================

export const INITIAL_WORK_PROJECTS: Project[] = [
  {
    id: 'work-proj-1',
    title: 'OmniVortex: Real-Time Multi-Agent AI Workflow Orchestrator',
    summary: 'Open-source distributed control plane coordinating autonomous LLM agents with verifiable state execution.',
    description: 'OmniVortex provides an asynchronous message bus and deterministic state engine for coordinating agentic workflows across local models and cloud endpoints. Designed to replace brittle Python chain scripts with compile-time type-safe agent state machines.',
    whatItDoes: 'Allows developers to declare agent toolsets, state rollback checkpoints, and validation barriers in Go or TypeScript. Streams execution trees via WebSockets with real-time token telemetry and debugging replays.',
    useCases: [
      'Enterprises orchestrating complex customer resolution pipelines.',
      'Research labs running multi-agent game-theoretic simulations.',
      'Developers building local-first agent assistants with Ollama.'
    ],
    targetAudience: 'Software engineers, AI developers, and distributed systems architects.',
    tags: ['Artificial Intelligence', 'Go', 'TypeScript', 'Distributed Systems', 'Agentic AI'],
    codeAvailability: 'public',
    githubRepo: {
      id: 801,
      name: 'omnivortex-engine',
      full_name: 'omnineural-labs/omnivortex-engine',
      description: 'Distributed multi-agent workflow runtime and telemetry orchestrator built for resilience.',
      html_url: 'https://github.com/omnineural-labs/omnivortex-engine',
      stargazers_count: 320,
      language: 'Go',
      updated_at: '2026-10-23T16:00:00Z',
      forks_count: 48,
    },
    status: 'Looking for collaborators',
    openRoles: ['Frontend dev (React & Canvas)', 'Go Backend Engineer', 'Documentation Lead'],
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    ],
    liveDemoUrl: 'https://omnivortex.dev',
    author: DEMO_PROFESSIONALS[0], // Sarah Lin
    teamMembers: [
      { id: DEMO_PROFESSIONALS[0].id, name: DEMO_PROFESSIONALS[0].name, role: 'Lead Architect & Maintainer', avatar: DEMO_PROFESSIONALS[0].avatar, identity: 'Working professional' },
      { id: DEMO_MENTORS[0].id, name: DEMO_MENTORS[0].name, role: 'Advisory Mentor (Systems Safety)', avatar: DEMO_MENTORS[0].avatar, identity: 'Industry mentor' }
    ],
    interestCount: 145,
    userInterested: true,
    viewCount: 940,
    createdAt: '2026-10-20T10:00:00Z',
    hubType: 'work',
    industry: 'Artificial Intelligence & Machine Learning',
    category: 'Artificial intelligence and machine learning',
    skillsRequired: ['TypeScript', 'Go', 'React', 'Distributed Systems'],
    skillsPreferred: ['WebSockets', 'TailwindCSS', 'Docker'],
    experienceLevel: 'Mixed',
    estimatedDuration: '2-3 months',
    collaborationType: 'Remote',
    targetTeamSize: 5,
    deliverables: [
      'Interactive visual workflow canvas in React/Canvas',
      'High-throughput Go WebSocket streaming server',
      'Comprehensive developer documentation & benchmark suite'
    ],
    compensationInfo: 'Collaborative Open Source (Apache 2.0) with developer contributor grants on launch.',
    openToStudents: true, // OPEN TO STUDENTS & EARLY CAREER!
    seekingIndustryMentor: false,
    hasMentor: true,
    mentorName: 'Dr. Evelyn Vance (Apex Robotics)',
    tasks: [
      {
        id: 'task-101',
        projectId: 'work-proj-1',
        title: 'Build interactive workflow DAG visualizer canvas',
        description: 'Implement node-based visual rendering for multi-agent step execution using React and Canvas/SVG. Needs zoom/pan and live status pulses.',
        assignedToId: 'user_alex_chen',
        assignedToName: 'Alex Chen',
        assignedToAvatar: DEMO_STUDENTS[0].avatar,
        status: 'In Progress',
        priority: 'High',
        dueDate: '2026-11-05',
        createdById: DEMO_PROFESSIONALS[0].id,
        createdAt: '2026-10-21T11:00:00Z',
      },
      {
        id: 'task-102',
        projectId: 'work-proj-1',
        title: 'Define JSON schema for agent checkpoint serialization',
        description: 'Specify standardized JSON schema for saving agent conversation state and tool execution logs to disk.',
        assignedToId: DEMO_PROFESSIONALS[0].id,
        assignedToName: 'Sarah Lin',
        assignedToAvatar: DEMO_PROFESSIONALS[0].avatar,
        status: 'Completed',
        priority: 'Medium',
        dueDate: '2026-10-24',
        createdById: DEMO_PROFESSIONALS[0].id,
        createdAt: '2026-10-20T12:00:00Z',
      },
      {
        id: 'task-103',
        projectId: 'work-proj-1',
        title: 'Write quick-start guide and sample Ollama local agent',
        description: 'Produce a simple step-by-step tutorial showing developers how to orchestrate two local Ollama models in 5 minutes.',
        status: 'To Do',
        priority: 'Medium',
        dueDate: '2026-11-12',
        createdById: DEMO_PROFESSIONALS[0].id,
        createdAt: '2026-10-22T14:00:00Z',
      },
    ],
    milestones: [
      { id: 'm-1', projectId: 'work-proj-1', title: 'v0.1 Core Event Bus Specification', targetDate: '2026-10-25', completed: true, deliverableNote: 'Completed initial Go gRPC message bus protocol' },
      { id: 'm-2', projectId: 'work-proj-1', title: 'v0.2 Interactive Canvas & Telemetry Dashboard', targetDate: '2026-11-10', completed: false, deliverableNote: 'Currently integrating WebSocket state streaming' },
      { id: 'm-3', projectId: 'work-proj-1', title: 'v0.3 Public Alpha Launch & Contributor Workshop', targetDate: '2026-11-30', completed: false },
    ],
    discussions: [
      {
        id: 'disc-1',
        projectId: 'work-proj-1',
        authorId: DEMO_PROFESSIONALS[0].id,
        authorName: 'Sarah Lin',
        authorAvatar: DEMO_PROFESSIONALS[0].avatar,
        authorRole: 'Lead Architect',
        content: 'Welcome team! We just merged the initial Go state engine. For our frontend and student contributors, the DAG visualizer task is now unblocked.',
        timestamp: '2026-10-23T14:30:00Z',
      },
    ],
  },
  {
    id: 'work-proj-2',
    title: 'CloudMesh: Zero-Trust eBPF Kubernetes Micro-Segmentation',
    summary: 'Kernel-level lightweight network policy enforcer providing packet-level service mesh security without sidecars.',
    description: 'CloudMesh injects minimal eBPF programs into the Linux networking tc hook to enforce cryptographic pod-to-pod identity. By bypassing heavy Envoy sidecars, it slashes latency by 85% and eliminates megabytes of proxy memory per node.',
    whatItDoes: 'Compiles declarative YAML security policies into high-speed kernel bytecode maps. Emits real-time packet drop logs and connection latency histograms directly to Prometheus.',
    useCases: [
      'High-frequency trading and low-latency financial systems.',
      'Massive edge Kubernetes clusters with tight CPU/RAM budgets.',
      'SaaS providers needing strict tenant boundary isolation.'
    ],
    targetAudience: 'DevOps engineers, cloud platform teams, and security engineers.',
    tags: ['Cybersecurity', 'Cloud & Distributed Systems', 'Go', 'eBPF', 'Kubernetes'],
    codeAvailability: 'public',
    githubRepo: {
      id: 802,
      name: 'cloudmesh-ebpf',
      full_name: 'scalegrid-open/cloudmesh-ebpf',
      description: 'Zero-sidecar eBPF network policy and micro-segmentation engine for Kubernetes.',
      html_url: 'https://github.com/scalegrid-open/cloudmesh-ebpf',
      stargazers_count: 240,
      language: 'Go',
      updated_at: '2026-10-22T18:15:00Z',
      forks_count: 31,
    },
    status: 'Looking for collaborators',
    openRoles: ['Linux Kernel & C Dev', 'Kubernetes Operator Engineer', 'Grafana Dashboard Designer'],
    screenshots: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    ],
    author: DEMO_PROFESSIONALS[1], // David Park
    teamMembers: [
      { id: DEMO_PROFESSIONALS[1].id, name: DEMO_PROFESSIONALS[1].name, role: 'Cloud Platform Lead', avatar: DEMO_PROFESSIONALS[1].avatar, identity: 'Working professional' },
      { id: DEMO_PROFESSIONALS[3].id, name: DEMO_PROFESSIONALS[3].name, role: 'Security Reviewer', avatar: DEMO_PROFESSIONALS[3].avatar, identity: 'Working professional' }
    ],
    interestCount: 98,
    userInterested: false,
    viewCount: 650,
    createdAt: '2026-10-18T14:30:00Z',
    hubType: 'work',
    industry: 'Cloud & Distributed Systems',
    category: 'Cybersecurity',
    skillsRequired: ['Go', 'Kubernetes', 'Linux', 'Networking'],
    skillsPreferred: ['C', 'eBPF', 'Prometheus'],
    experienceLevel: 'Advanced',
    estimatedDuration: '3-6 months',
    collaborationType: 'Remote',
    targetTeamSize: 4,
    deliverables: [
      'Kubernetes DaemonSet with automatic eBPF hook loader',
      'CLI tool for live traffic packet tracing',
      'Helm chart and production hardening documentation'
    ],
    compensationInfo: 'Open-source collaboration with enterprise sponsor bounty pool.',
    openToStudents: false, // Professional focused
    seekingIndustryMentor: false,
    tasks: [],
    milestones: [
      { id: 'm-201', projectId: 'work-proj-2', title: 'Kernel TC hook benchmark', targetDate: '2026-11-01', completed: true },
      { id: 'm-202', projectId: 'work-proj-2', title: 'CRD policy controller', targetDate: '2026-11-20', completed: false },
    ],
  },
  {
    id: 'work-proj-3',
    title: 'AuraUI: Ergonomic High-Density Component Library',
    summary: 'Accessible, token-driven React & Tailwind component system designed for scientific and telemetry cockpits.',
    description: 'Most modern web libraries prioritize giant whitespace over information density. AuraUI provides compact, keyboard-navigable tables, split-panes, sparklines, and metric cards with zero layout shift and 100% WCAG AAA contrast fidelity.',
    whatItDoes: 'Empowers developers of lab tools, CAD visualizers, and trading terminals to build dense, legible interfaces with tactile keyboard shortcuts and customizable ergonomic typography.',
    useCases: [
      'University research lab instrument software.',
      'Financial risk modeling spreadsheets and trading consoles.',
      'Telemetry dashboards for space, marine, and rover prototypes.'
    ],
    targetAudience: 'Frontend developers, UX designers, and scientific software engineers.',
    tags: ['UI/UX Design', 'React', 'TypeScript', 'TailwindCSS', 'Design Systems', 'Accessibility'],
    codeAvailability: 'public',
    githubRepo: {
      id: 803,
      name: 'aura-ui-system',
      full_name: 'forma-studio/aura-ui-system',
      description: 'High-density ergonomic design system components for mission control and technical dashboards.',
      html_url: 'https://github.com/forma-studio/aura-ui-system',
      stargazers_count: 512,
      language: 'TypeScript',
      updated_at: '2026-10-24T09:00:00Z',
      forks_count: 73,
    },
    status: 'Looking for collaborators',
    openRoles: ['React Component Engineer', 'Accessibility (a11y) Specialist', 'Documentation Writer'],
    screenshots: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    ],
    liveDemoUrl: 'https://auraui.design',
    author: DEMO_PROFESSIONALS[2], // Elena Rostova
    teamMembers: [
      { id: DEMO_PROFESSIONALS[2].id, name: DEMO_PROFESSIONALS[2].name, role: 'Design Systems Lead', avatar: DEMO_PROFESSIONALS[2].avatar, identity: 'Working professional' },
      { id: DEMO_STUDENTS[1].id, name: DEMO_STUDENTS[1].name, role: 'Junior UI Contributor', avatar: DEMO_STUDENTS[1].avatar, identity: 'Student' }
    ],
    interestCount: 167,
    userInterested: true,
    viewCount: 1120,
    createdAt: '2026-10-17T08:00:00Z',
    hubType: 'work',
    industry: 'UI/UX Design',
    category: 'UI/UX design',
    skillsRequired: ['React', 'TypeScript', 'TailwindCSS'],
    skillsPreferred: ['Radix UI', 'Storybook', 'Figma'],
    experienceLevel: 'Mixed',
    estimatedDuration: '1-3 months',
    collaborationType: 'Remote',
    targetTeamSize: 4,
    deliverables: [
      'Storybook interactive component documentation',
      'NPM package with tree-shakable TypeScript exports',
      'Figma Community UI kit with tokens sync'
    ],
    compensationInfo: 'Collaborative Open Source project with revenue-share on upcoming pro themes.',
    openToStudents: true, // OPEN TO STUDENTS!
    seekingIndustryMentor: false,
    tasks: [
      {
        id: 'task-301',
        projectId: 'work-proj-3',
        title: 'Audit color contrast ratios for dark mode data table',
        description: 'Ensure all tabular numerals and cell selection highlights maintain 4.5:1 contrast against dark slate backgrounds.',
        assignedToId: DEMO_STUDENTS[1].id,
        assignedToName: 'Maya Lin',
        assignedToAvatar: DEMO_STUDENTS[1].avatar,
        status: 'In Progress',
        priority: 'High',
        dueDate: '2026-10-30',
        createdById: DEMO_PROFESSIONALS[2].id,
        createdAt: '2026-10-22T09:00:00Z',
      },
    ],
    milestones: [
      { id: 'm-301', projectId: 'work-proj-3', title: 'Core typography & tokens release', targetDate: '2026-10-15', completed: true },
      { id: 'm-302', projectId: 'work-proj-3', title: 'Tabular data components & keyboard navigation', targetDate: '2026-11-05', completed: false },
    ],
  },
  {
    id: 'work-proj-4',
    title: 'OpenPulse FHIR: Patient-Owned Health Record Sync & Decoupler',
    summary: 'Local-first encrypted patient health record synchronization utility using Apple Health & Epic FHIR APIs.',
    description: 'Empowers patients to liberate their electronic health records from hospital silos. Downloads medical histories, lab blood panels, and medication lists into an encrypted SQLite container that runs completely on the user’s personal laptop or phone.',
    whatItDoes: 'Connects via SMART on FHIR OAuth to patient portals, parses messy clinical code classifications (LOINC, SNOMED), and generates privacy-preserving summaries that can be shared with doctors without middlemen.',
    useCases: [
      'Patients managing complex chronic illnesses across multiple healthcare systems.',
      'Clinical researchers aggregating opt-in de-identified cohort studies.',
      'Caregivers tracking health vitals for elderly family members.'
    ],
    targetAudience: 'Healthcare advocates, patients, and privacy-conscious software engineers.',
    tags: ['HealthTech', 'Privacy', 'Python', 'FHIR', 'TypeScript', 'SQLite'],
    codeAvailability: 'on_request',
    status: 'Active',
    openRoles: ['Frontend Mobile Dev', 'FHIR Specialist', 'Security Auditor'],
    screenshots: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    ],
    author: DEMO_PROFESSIONALS[4], // Amara Okafor
    teamMembers: [
      { id: DEMO_PROFESSIONALS[4].id, name: DEMO_PROFESSIONALS[4].name, role: 'Clinical Lead & Product', avatar: DEMO_PROFESSIONALS[4].avatar, identity: 'Working professional' },
      { id: DEMO_MENTORS[1].id, name: DEMO_MENTORS[1].name, role: 'Bioinformatics Advisory Mentor', avatar: DEMO_MENTORS[1].avatar, identity: 'Industry mentor' }
    ],
    interestCount: 82,
    userInterested: false,
    viewCount: 490,
    createdAt: '2026-10-15T11:00:00Z',
    hubType: 'work',
    industry: 'HealthTech & Biotechnology',
    category: 'Community impact',
    skillsRequired: ['TypeScript', 'SQLite', 'FHIR API', 'Privacy'],
    skillsPreferred: ['React Native', 'Python', 'Cryptography'],
    experienceLevel: 'Intermediate',
    estimatedDuration: '3-6 months',
    collaborationType: 'Remote',
    targetTeamSize: 4,
    deliverables: [
      'Local encrypted SQLite sync engine',
      'Clean interactive laboratory range timeline',
      'Clinical research consent & export module'
    ],
    compensationInfo: 'Civic non-profit initiative with open grant funding.',
    openToStudents: true, // OPEN TO STUDENTS!
    seekingIndustryMentor: false,
    hasMentor: true,
    mentorName: 'Rachel Sterling (BioCompute)',
    tasks: [],
    milestones: [
      { id: 'm-401', projectId: 'work-proj-4', title: 'FHIR JSON parser specification', targetDate: '2026-10-28', completed: true },
      { id: 'm-402', projectId: 'work-proj-4', title: 'End-to-end encrypted SQLite sync', targetDate: '2026-11-15', completed: false },
    ],
  },
  {
    id: 'work-proj-5',
    title: 'SafeForge: Software Supply Chain Dependency Provenance Verifier',
    summary: 'Fast CLI tool analyzing open-source package source code diffs, maintainer shifts, and typosquatting risks.',
    description: 'SafeForge plugs into CI/CD build environments to evaluate incoming npm, PyPI, and crates.io dependencies. It detects suspicious commit patterns, dormant repo transfers, and obfuscated post-install scripts before they reach production.',
    whatItDoes: 'Computes cryptographic hashes across package tarballs, cross-references Sigstore transparency logs, and flags risky AST modifications with zero false positive alerts.',
    useCases: [
      'DevOps security pipelines checking third-party packages before deployment.',
      'Open-source maintainers auditing external pull requests.',
      'Security researchers tracking real-world malicious supply-chain attacks.'
    ],
    targetAudience: 'Security engineers, site reliability engineers, and compliance teams.',
    tags: ['Cybersecurity', 'Rust', 'CLI', 'Supply Chain', 'Python'],
    codeAvailability: 'public',
    githubRepo: {
      id: 805,
      name: 'safeforge-audit',
      full_name: 'vanguard-shield/safeforge-audit',
      description: 'Zero-overhead software supply chain provenance verifier and maintainer anomaly detector.',
      html_url: 'https://github.com/vanguard-shield/safeforge-audit',
      stargazers_count: 185,
      language: 'Rust',
      updated_at: '2026-10-21T15:00:00Z',
      forks_count: 22,
    },
    status: 'Looking for collaborators',
    openRoles: ['Rust Systems Engineer', 'Python AST Specialist', 'CLI UX Designer'],
    screenshots: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    ],
    author: DEMO_PROFESSIONALS[3], // Marcus Thorne
    teamMembers: [
      { id: DEMO_PROFESSIONALS[3].id, name: DEMO_PROFESSIONALS[3].name, role: 'Maintainer & Security Lead', avatar: DEMO_PROFESSIONALS[3].avatar, identity: 'Working professional' }
    ],
    interestCount: 71,
    userInterested: false,
    viewCount: 420,
    createdAt: '2026-10-12T16:00:00Z',
    hubType: 'work',
    industry: 'Cybersecurity',
    category: 'Cybersecurity',
    skillsRequired: ['Rust', 'Static Analysis', 'Security'],
    skillsPreferred: ['GitHub Actions', 'Python', 'Sigstore'],
    experienceLevel: 'Advanced',
    estimatedDuration: '2-4 months',
    collaborationType: 'Remote',
    targetTeamSize: 3,
    deliverables: [
      'High-performance Rust CLI binary with zero dependencies',
      'GitHub Action for automatic PR dependency scans',
      'Published threat dataset of neutralized malicious packages'
    ],
    compensationInfo: 'Open-source collaborative project with vulnerability bounty incentives.',
    openToStudents: false,
    seekingIndustryMentor: false,
  },
  {
    id: 'work-proj-6',
    title: 'BioGraphix: Semantic Biomedical Knowledge Graph Engine',
    summary: 'Graph database pipeline linking PubMed papers, gene variants, and clinical trial outcomes in real time.',
    description: 'An open-source scientific discovery engine that ingests thousands of medical preprints and biomedical ontologies. Uses vector embeddings and Neo4j cypher graphs to uncover hidden drug repurposing hypotheses and molecular mechanisms.',
    whatItDoes: 'Allows cancer researchers and geneticists to run natural-language queries that translate into multi-hop relationship traversals across proteins, genes, and approved pharmaceutical compounds.',
    useCases: [
      'Biotech startups searching for candidate therapeutic targets.',
      'Academic bioinformatics research labs exploring disease mechanisms.',
      'Medical students preparing systematic literature reviews.'
    ],
    targetAudience: 'Bioinformatics researchers, data scientists, and computational biologists.',
    tags: ['Data Analytics', 'Biomedical', 'Neo4j', 'Python', 'Knowledge Graphs', 'NLP'],
    codeAvailability: 'public',
    githubRepo: {
      id: 806,
      name: 'biographix-engine',
      full_name: 'siddharth-rao-data/biographix-engine',
      description: 'Open biomedical literature and clinical trial knowledge graph extraction pipeline.',
      html_url: 'https://github.com/siddharth-rao-data/biographix-engine',
      stargazers_count: 140,
      language: 'Python',
      updated_at: '2026-10-19T20:00:00Z',
      forks_count: 19,
    },
    status: 'Looking for collaborators',
    openRoles: ['Graph Database Dev (Neo4j/DuckDB)', 'Frontend Visualizer (WebGL)', 'Clinical Validator'],
    screenshots: [
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    ],
    author: DEMO_INDEPENDENTS[2], // Siddharth Rao (Recent Grad)
    teamMembers: [
      { id: DEMO_INDEPENDENTS[2].id, name: DEMO_INDEPENDENTS[2].name, role: 'Lead Data Researcher', avatar: DEMO_INDEPENDENTS[2].avatar, identity: 'Recent graduate' }
    ],
    interestCount: 64,
    userInterested: false,
    viewCount: 390,
    createdAt: '2026-10-10T12:00:00Z',
    hubType: 'work',
    industry: 'Data Analytics & Knowledge Graphs',
    category: 'Data analytics',
    skillsRequired: ['Python', 'Neo4j', 'FastAPI'],
    skillsPreferred: ['DuckDB', 'Three.js / WebGL', 'Biomedical Ontologies'],
    experienceLevel: 'Intermediate',
    estimatedDuration: '1-3 months',
    collaborationType: 'Remote',
    targetTeamSize: 3,
    deliverables: [
      'FastAPI backend with vector-grounded Cypher query generator',
      'Interactive 3D graph visualizer in the browser',
      'Public dataset of 250,000 interlinked clinical trials'
    ],
    compensationInfo: 'Collaborative Open Source project. Academic publication co-authorship included.',
    openToStudents: true, // OPEN TO STUDENTS!
    seekingIndustryMentor: true, // SEEKING MENTOR!
  },
  {
    id: 'work-proj-7',
    title: 'AgriSense IoT: Solar Microgrid Telemetry & LoRa Gateway',
    summary: 'Hardware gateway and cloud dashboard connecting rural farm sensors over 15km LoRa mesh links.',
    description: 'An open hardware IoT architecture engineered for remote farms with intermittent cellular coverage. Transmits soil moisture, ambient humidity, and microgrid solar charging telemetry over long-range LoRa radio to a central gateway.',
    whatItDoes: 'Sleeps at sub-microamp power consumption, wakes every 10 minutes to sample sensors, and buffers measurements locally during storms to guarantee zero data loss.',
    useCases: [
      'Sustainable urban agriculture and university test farms.',
      'Remote conservation zones monitoring groundwater levels.',
      'Community solar cooperatives tracking battery degradation.'
    ],
    targetAudience: 'Hardware engineers, IoT enthusiasts, and environmental researchers.',
    tags: ['CleanTech', 'IoT', 'Hardware', 'LoRa', 'Embedded', 'C++', 'ESP32'],
    codeAvailability: 'public',
    githubRepo: {
      id: 807,
      name: 'agrisense-lora-mesh',
      full_name: 'greenstack-iot/agrisense-lora-mesh',
      description: 'Ultra-low power LoRa telemetry nodes and gateway firmware for precision agriculture.',
      html_url: 'https://github.com/greenstack-iot/agrisense-lora-mesh',
      stargazers_count: 215,
      language: 'C++',
      updated_at: '2026-10-23T11:00:00Z',
      forks_count: 38,
    },
    status: 'Looking for collaborators',
    openRoles: ['Firmware Dev (ESP32/FreeRTOS)', 'Web Dashboard Engineer', 'Hardware PCB Reviewer'],
    screenshots: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
    ],
    author: DEMO_MENTORS[2], // Carlos Mendez (Mentor & Independent)
    teamMembers: [
      { id: DEMO_MENTORS[2].id, name: DEMO_MENTORS[2].name, role: 'Hardware Architect & Mentor', avatar: DEMO_MENTORS[2].avatar, identity: 'Industry mentor' }
    ],
    interestCount: 110,
    userInterested: true,
    viewCount: 710,
    createdAt: '2026-10-08T09:30:00Z',
    hubType: 'work',
    industry: 'CleanTech & IoT',
    category: 'Open-source development',
    skillsRequired: ['Embedded C++', 'ESP32', 'IoT', 'Hardware'],
    skillsPreferred: ['MQTT', 'React', 'PCB Design'],
    experienceLevel: 'Mixed',
    estimatedDuration: '2-4 months',
    collaborationType: 'Hybrid',
    targetTeamSize: 4,
    deliverables: [
      'Tested KiCad PCB schematics for solar battery charging board',
      'C++ FreeRTOS node firmware with power-saving deep sleep',
      'Real-time web telemetry console with offline caching'
    ],
    compensationInfo: 'Open hardware project (CERN OHL) sponsored by CleanTech fellowship.',
    openToStudents: true, // OPEN TO STUDENTS & EARLY CAREER!
    seekingIndustryMentor: false,
    hasMentor: true,
    mentorName: 'Carlos Mendez (GreenStack IoT)',
    tasks: [],
    milestones: [
      { id: 'm-701', projectId: 'work-proj-7', title: 'LoRa 15km test range verification', targetDate: '2026-10-18', completed: true },
      { id: 'm-702', projectId: 'work-proj-7', title: 'Web dashboard & MQTT broker integration', targetDate: '2026-11-12', completed: false },
    ],
  },
  {
    id: 'work-proj-8',
    title: 'AudioCanvas WebDSP: Modular Browser Synthesizer Framework',
    summary: 'WebAssembly AudioWorklet framework allowing musicians and developers to patch modular DSP nodes in real time.',
    description: 'An open-source digital audio workstation library running purely in browser threads. Compiles custom C++ DSP algorithms into high-speed WebAssembly audio nodes with sub-3 millisecond audio buffer latency.',
    whatItDoes: 'Provides visual patch cables connecting oscillators, envelope generators, convolution reverbs, and Fourier spectrogram scopes directly inside the web browser.',
    useCases: [
      'Interactive web instruments and browser game sound design.',
      'University digital signal processing acoustics coursework.',
      'Generative audio installations and interactive art exhibits.'
    ],
    targetAudience: 'Music software developers, creative technologists, and sound engineers.',
    tags: ['MusicTech', 'WebAssembly', 'C++', 'DSP', 'TypeScript', 'WebAudio'],
    codeAvailability: 'public',
    githubRepo: {
      id: 808,
      name: 'audiocanvas-webdsp',
      full_name: 'devonmiller-dsp/audiocanvas-webdsp',
      description: 'Real-time modular WebAssembly AudioWorklet DSP synthesis and patch framework.',
      html_url: 'https://github.com/devonmiller-dsp/audiocanvas-webdsp',
      stargazers_count: 280,
      language: 'C++',
      updated_at: '2026-10-24T12:00:00Z',
      forks_count: 42,
    },
    status: 'Finished',
    openRoles: [],
    screenshots: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
    ],
    liveDemoUrl: 'https://audiocanvas.dev',
    author: DEMO_INDEPENDENTS[0], // Devon Miller
    teamMembers: [
      { id: DEMO_INDEPENDENTS[0].id, name: DEMO_INDEPENDENTS[0].name, role: 'Audio Core Developer', avatar: DEMO_INDEPENDENTS[0].avatar, identity: 'Recent graduate' }
    ],
    interestCount: 154,
    userInterested: false,
    viewCount: 980,
    createdAt: '2026-10-04T14:00:00Z',
    hubType: 'work',
    industry: 'MusicTech & Audio DSP',
    category: 'Software development',
    skillsRequired: ['C++', 'WebAssembly', 'TypeScript', 'WebAudio'],
    skillsPreferred: ['DSP', 'TailwindCSS'],
    experienceLevel: 'Intermediate',
    estimatedDuration: 'Completed',
    collaborationType: 'Remote',
    targetTeamSize: 2,
    deliverables: ['Production WebAssembly DSP engine', 'Interactive web documentation'],
    compensationInfo: 'Open-source MIT licensed.',
    openToStudents: true,
  },
];

// Re-export Showcase projects and Class projects from previous step
export { INITIAL_SHOWCASE_PROJECTS, INITIAL_CLASS_PROJECTS, INITIAL_MESSAGES, INITIAL_INVITATIONS, INITIAL_CODE_REQUESTS } from './campusData';

// Initial applications seeded in the system
export const INITIAL_APPLICATIONS: ProjectApplication[] = [
  {
    id: 'app-seed-1',
    projectId: 'work-proj-1',
    projectTitle: 'OmniVortex: Real-Time Multi-Agent AI Workflow Orchestrator',
    projectOwnerId: 'user_sarah_lin',
    applicant: DEMO_STUDENTS[0], // Alex Chen applying to Sarah Lin's project!
    roleApplied: 'Frontend dev (React & Canvas)',
    introduction: 'Hi Sarah! I am an undergraduate senior in CSE at Ohio State with extensive React, WebSockets, and state management experience on our student rover telemetry stack. I would love to contribute to the visual DAG canvas and learn from your architecture experience.',
    availability: '12 hrs/week',
    learningGoals: 'Gain experience in high-performance WebSockets streaming and multi-agent systems architecture.',
    isStudentApplication: true,
    status: 'pending',
    timestamp: '2026-10-24T14:00:00Z',
    read: false,
  },
];

// Deterministic Compatibility Score Calculation Helper
export function calculateCompatibilityScore(
  user: Author,
  project: Project
): {
  overallScore: number;
  skillsMatch: { score: number; matched: string[]; missing: string[] };
  industryMatch: { score: number; aligned: boolean };
  experienceMatch: { score: number; label: string };
  availabilityMatch: { score: number; label: string };
  explanation: string;
} {
  const userSkills = (user.skills || []).map((s) => s.toLowerCase());
  const required = (project.skillsRequired || project.tags || []).map((s) => s.toLowerCase());

  // 1. Skills match (max 40 pts)
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  required.forEach((req) => {
    const isMatched = userSkills.some(
      (us) => us.includes(req) || req.includes(us)
    );
    if (isMatched) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  const skillsScore =
    required.length > 0
      ? Math.round((matchedSkills.length / required.length) * 40)
      : 30;

  // 2. Industry / Category match (max 25 pts)
  const userIndustry = (user.industry || '').toLowerCase();
  const projIndustry = (project.industry || project.category || '').toLowerCase();
  const isIndustryAligned =
    userIndustry.length > 0 &&
    (userIndustry.includes(projIndustry) || projIndustry.includes(userIndustry));
  const industryScore = isIndustryAligned ? 25 : 15;

  // 3. Experience level match (max 15 pts)
  let expScore = 15;
  let expLabel = 'Well matched';
  const years = user.yearsOfExperience || 1;
  const projectLevel = project.experienceLevel || 'Mixed';

  if (projectLevel === 'Advanced' && years < 3) {
    expScore = 10;
    expLabel = 'Stretch learning opportunity';
  } else if (projectLevel === 'Beginner' && years > 5) {
    expScore = 12;
    expLabel = 'Senior mentorship potential';
  }

  // 4. Availability & Working style match (max 20 pts)
  const userAvail = (user.availability || '').toLowerCase();
  let availScore = 18;
  let availLabel = 'High schedule compatibility';
  if (userAvail.includes('5') && project.estimatedDuration?.includes('3-6')) {
    availScore = 14;
    availLabel = 'Part-time async commitment';
  }

  const overall = Math.min(99, Math.max(45, skillsScore + industryScore + expScore + availScore));

  const explanation =
    matchedSkills.length > 0
      ? `Strong overlap on ${matchedSkills.slice(0, 3).join(', ')} with ${expLabel.toLowerCase()} and ${availLabel.toLowerCase()}.`
      : `Good complementary profile with ${expLabel.toLowerCase()} and solid motivation for cross-discipline teamwork.`;

  return {
    overallScore: overall,
    skillsMatch: {
      score: skillsScore,
      matched: matchedSkills,
      missing: missingSkills,
    },
    industryMatch: {
      score: industryScore,
      aligned: isIndustryAligned,
    },
    experienceMatch: {
      score: expScore,
      label: expLabel,
    },
    availabilityMatch: {
      score: availScore,
      label: availLabel,
    },
    explanation,
  };
}
