import React, { useState } from 'react';
import { Project, CodeAvailability, ProjectStatus, GitHubRepo, ProjectAttachedFile, TeamMember } from '../types';
import { useApp } from '../context/AppContext';
import { FileAttachmentInput } from './FileAttachmentInput';
import { shortCourseCode } from '../services/campusAccess';
import {
  X,
  GitBranch,
  KeyRound,
  Eye,
  Github,
  Plus,
  Trash2,
  AlertTriangle,
  Sparkles,
  Link2,
  Video,
  Globe,
  CheckCircle2,
  FileText,
  Paperclip,
  GraduationCap,
  Users,
  BookOpen,
  UserCheck,
  FileCode,
} from 'lucide-react';

interface ShareProjectModalProps {
  onClose: () => void;
  initialData?: Partial<Project>;
}

interface FormTeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  identity?: string;
  contributionDescription: string;
}

export const ShareProjectModal: React.FC<ShareProjectModalProps> = ({ onClose, initialData }) => {
  const {
    currentUser,
    userRepos,
    connectGitHub,
    openGitHubModal,
    addProject,
    showToast,
    canvasConnection,
    allCanvasClassmates,
    appMode,
  } = useApp();

  // Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [whatItDoes, setWhatItDoes] = useState(initialData?.whatItDoes || '');
  const [targetAudience, setTargetAudience] = useState(initialData?.targetAudience || '');
  const [useCases, setUseCases] = useState<string[]>(
    initialData?.useCases && initialData.useCases.length > 0
      ? initialData.useCases
      : ['Campus coursework and research benchmarking', 'Automated student team workflow']
  );
  const [newUseCaseInput, setNewUseCaseInput] = useState('');

  // University Course & Professor Information
  const isClassProject = !!initialData?.isClassProject;
  const [courseCode, setCourseCode] = useState(
    initialData?.courseCode || (isClassProject ? 'CSE 3901' : 'CSE 3901')
  );
  const [courseName, setCourseName] = useState(
    initialData?.courseName || (isClassProject ? 'Web Applications & Cloud Systems' : 'Web Applications & Cloud Systems')
  );
  const [professorName, setProfessorName] = useState(
    initialData?.professorName || (isClassProject ? 'Dr. Rajiv Ramnath' : 'Dr. Rajiv Ramnath')
  );

  // Team Members with Contribution Descriptions ("What part of the project did this student work on?")
  const [teamMembers, setTeamMembers] = useState<FormTeamMember[]>(() => {
    if (initialData?.teamMembers && initialData.teamMembers.length > 0) {
      return initialData.teamMembers.map((m) => ({
        id: m.id,
        name: m.name,
        role: m.role || 'Team Member',
        avatar: m.avatar || currentUser.avatar,
        identity: m.identity || 'Student',
        contributionDescription:
          m.contributionDescription ||
          (m.id === currentUser.id
            ? 'Architecture design, data schema, and core project implementation.'
            : 'Contributed to deliverables, testing, and interface integration.'),
      }));
    }
    return [
      {
        id: currentUser.id,
        name: currentUser.name,
        role: 'Project Lead',
        avatar: currentUser.avatar,
        identity: currentUser.identities[0] || 'Student',
        contributionDescription:
          'Architecture design, data schema, and core project implementation.',
      },
      {
        id: 'user-teammate-2',
        name: 'Jordan Taylor',
        role: 'Frontend & UI Specialist',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        identity: 'Student',
        contributionDescription:
          'Developed interactive UI components, state management hooks, and user experience flow.',
      },
    ];
  });

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberContribution, setNewMemberContribution] = useState('');

  // Attached Files / Deliverables labeled to students
  const [attachedFiles, setAttachedFiles] = useState<ProjectAttachedFile[]>(
    initialData?.attachedFiles || []
  );

  // Media
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState(initialData?.liveDemoUrl || '');
  const [demoVideoUrl, setDemoVideoUrl] = useState(initialData?.demoVideoUrl || '');

  // Tags
  const [tags, setTags] = useState<string[]>(
    initialData?.tags || ['React', 'TypeScript', 'Web Applications', 'Engineering']
  );
  const [newTagInput, setNewTagInput] = useState('');

  // Code sharing choice
  const [codeAvailability, setCodeAvailability] = useState<CodeAvailability>(
    isClassProject ? 'on_request' : initialData?.codeAvailability || 'public'
  );

  // GitHub repo attachment
  const [selectedRepoId, setSelectedRepoId] = useState<string>(
    initialData?.githubRepo?.id ? String(initialData.githubRepo.id) : ''
  );
  const [customRepoUrl, setCustomRepoUrl] = useState(initialData?.githubRepo?.html_url || '');

  // Status & Roles
  const [status, setStatus] = useState<ProjectStatus>(
    initialData?.status || 'Looking for collaborators'
  );
  const [openRoles, setOpenRoles] = useState<string[]>(
    initialData?.openRoles || ['Data Analyst', 'Frontend Developer']
  );
  const [newRoleInput, setNewRoleInput] = useState('');

  // Quick inline github connect state
  const [inlineGithubUser, setInlineGithubUser] = useState('');
  const [isInlineConnecting, setIsInlineConnecting] = useState(false);

  const handleInlineConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineGithubUser.trim()) return;
    setIsInlineConnecting(true);
    await connectGitHub(inlineGithubUser);
    setIsInlineConnecting(false);
  };

  const addUseCase = () => {
    if (newUseCaseInput.trim()) {
      setUseCases([...useCases, newUseCaseInput.trim()]);
      setNewUseCaseInput('');
    }
  };

  const removeUseCase = (index: number) => {
    setUseCases(useCases.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const addRole = () => {
    if (newRoleInput.trim() && !openRoles.includes(newRoleInput.trim())) {
      setOpenRoles([...openRoles, newRoleInput.trim()]);
      setNewRoleInput('');
    }
  };

  const removeRole = (roleToRemove: string) => {
    setOpenRoles(openRoles.filter((r) => r !== roleToRemove));
  };

  // Add Teammate
  const handleAddTeammate = () => {
    if (!newMemberName.trim()) {
      showToast('Please enter the student teammate name.', 'warning');
      return;
    }
    const newMember: FormTeamMember = {
      id: `member-${Date.now()}`,
      name: newMemberName.trim(),
      role: newMemberRole.trim() || 'Contributor',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      identity: 'Student',
      contributionDescription:
        newMemberContribution.trim() || 'Assisted with module development and verification testing.',
    };
    setTeamMembers([...teamMembers, newMember]);
    setNewMemberName('');
    setNewMemberRole('');
    setNewMemberContribution('');
    showToast(`Added ${newMember.name} to the team roster`, 'info');
  };

  const handleRemoveTeammate = (id: string) => {
    if (id === currentUser.id) {
      showToast('You cannot remove yourself as project creator.', 'warning');
      return;
    }
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
  };

  const handleUpdateContribution = (id: string, newDesc: string) => {
    setTeamMembers(
      teamMembers.map((m) => (m.id === id ? { ...m, contributionDescription: newDesc } : m))
    );
  };

  // Add Attached File Labeled to a Student
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !summary.trim() || !description.trim()) {
      showToast('Please fill in project title, summary, and description', 'warning');
      return;
    }

    if (codeAvailability === 'public' && isClassProject) {
      showToast('Class projects cannot have public source code due to academic integrity policy.', 'warning');
      return;
    }

    // Resolve attached repo
    let attachedRepo: GitHubRepo | null = null;
    if (codeAvailability === 'public') {
      if (selectedRepoId) {
        attachedRepo = userRepos.find((r) => String(r.id) === selectedRepoId) || null;
      }
      if (!attachedRepo && customRepoUrl) {
        attachedRepo = {
          id: Date.now(),
          name: title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          full_name: `${currentUser.githubUsername || 'student'}/${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          description: summary,
          html_url: customRepoUrl,
          stargazers_count: 5,
          language: tags[0] || 'TypeScript',
          updated_at: new Date().toISOString(),
        };
      }
    }

    const screenshots = screenshotUrl.trim()
      ? [screenshotUrl.trim()]
      : initialData?.screenshots?.length
      ? initialData.screenshots
      : [
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
        ];

    // Format team members
    const finalTeamMembers: TeamMember[] = teamMembers.map((m) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      avatar: m.avatar || currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      identity: (m.identity as any) || 'Student',
      contributionDescription: m.contributionDescription,
    }));

    addProject({
      title: title.trim(),
      summary: summary.trim(),
      description: description.trim(),
      whatItDoes: whatItDoes.trim() || summary.trim(),
      useCases: useCases.length > 0 ? useCases : ['General academic and engineering application'],
      targetAudience: targetAudience.trim() || 'Students, engineers, and faculty researchers.',
      tags: tags.length > 0 ? tags : ['Project'],
      codeAvailability,
      githubRepo: attachedRepo,
      status,
      openRoles: status === 'Looking for collaborators' ? openRoles : [],
      screenshots,
      liveDemoUrl: liveDemoUrl.trim() || undefined,
      demoVideoUrl: demoVideoUrl.trim() || undefined,
      isClassProject,
      courseCode: courseCode.trim() || undefined,
      courseName: courseName.trim() || undefined,
      professorName: professorName.trim() || undefined,
      attachedFiles,
      teamMembers: finalTeamMembers,
    }, {
      // New class projects created in Campus mode go to this campus's Campus Hub
      campusHub: appMode === 'campus' && isClassProject && !initialData?.id,
    });

    onClose();
  };

  // Quick course selection presets
  // With Canvas connected, quick fill offers the student's own classes
  const canvasPresets = canvasConnection.isConnected
    ? canvasConnection.courses.map((c) => ({
        code: shortCourseCode(c.courseCode),
        name: c.name !== c.courseCode ? c.name : shortCourseCode(c.courseCode),
        prof: c.instructor.name === 'Course Instructor' ? '' : c.instructor.name,
      }))
    : [];
  const coursePresets = canvasPresets.length > 0 ? canvasPresets : [
    { code: 'CSE 3901', name: 'Web Applications & Cloud Systems', prof: 'Dr. Rajiv Ramnath' },
    { code: 'CSE 5521', name: 'Survey of Artificial Intelligence', prof: 'Dr. Evelyn Vance' },
    { code: 'ECE 5020', name: 'Mixed Signal VLSI & Embedded Systems', prof: 'Prof. Robert Hayes' },
    { code: 'ENGR 1181', name: 'Engineering Fundamentals & Design', prof: 'Dr. Sarah Lin' },
    { code: 'CS 188', name: 'Introduction to Artificial Intelligence', prof: 'Prof. Pieter Abbeel' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-blue-600 text-white font-extrabold text-[11px] flex items-center justify-center shadow-xs">
                co
              </span>
              <h2 className="text-lg font-bold text-slate-900">Post a Project on collabr</h2>
            </div>
            <p className="text-xs text-slate-500">
              {isClassProject
                ? `Publishing coursework submission from ${courseName || 'Course'}`
                : 'Share your work with university peers, professors, and cross-campus collaborators.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-left">
          {/* Academic integrity banner if sharing a class project */}
          {isClassProject && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1">
                <span className="font-bold text-amber-950 block">
                  Coursework Anti-Copying Policy Enforced
                </span>
                <p className="leading-relaxed">
                  To uphold academic integrity and prevent code plagiarism in shared courses, class projects cannot expose public source code repositories. You can choose <strong>&quot;Code available on request&quot;</strong> or <strong>&quot;No code (Demo only)&quot;</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Section 1: Course & Professor Information */}
          <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>University Course & Professor (Optional for Academic Projects)</span>
              </div>
              <span className="text-[11px] text-indigo-700 font-medium">Enables course & professor search</span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] font-semibold text-slate-500">Quick fill:</span>
              {coursePresets.map((preset) => (
                <button
                  key={preset.code}
                  type="button"
                  onClick={() => {
                    setCourseCode(preset.code);
                    setCourseName(preset.name);
                    setProfessorName(preset.prof);
                  }}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium border transition-colors cursor-pointer ${
                    courseCode === preset.code
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'
                  }`}
                >
                  {preset.code}
                  {preset.prof ? ` (${preset.prof.split(' ').slice(-1)[0]})` : ''}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g. CSE 3901"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g. Web Applications & Cloud Systems"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Professor / Instructor
                </label>
                <input
                  type="text"
                  value={professorName}
                  onChange={(e) => setProfessorName(e.target.value)}
                  placeholder="e.g. Dr. Rajiv Ramnath"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Title, Summary & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., BuckeyeRover Autonomous Terrain Navigator"
                className="w-full text-sm font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                One-Sentence Hook / Summary *
              </label>
              <input
                type="text"
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="e.g., Quad-wheel autonomous planetary rover with ROS2 telemetry, lidar mapping, and 3D web monitor."
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Detailed Technical Overview & Architecture *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the background, system architecture, key challenges solved, hardware/software stack, and performance benchmarks..."
                className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Section 3: Students & What Part Each Worked On */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                  Student Team & Individual Contribution Descriptions
                </h3>
              </div>
              <span className="text-[11px] text-emerald-800 font-medium">
                Specify what part of the project each student worked on
              </span>
            </div>

            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">{member.name}</span>
                          {member.id === currentUser.id && (
                            <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">
                              You
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">{member.role}</span>
                      </div>
                    </div>

                    {member.id !== currentUser.id && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTeammate(member.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="Remove student from team"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Student Contribution Description Input */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      What part of the project did {member.name.split(' ')[0]} work on?
                    </label>
                    <textarea
                      rows={2}
                      value={member.contributionDescription}
                      onChange={(e) => handleUpdateContribution(member.id, e.target.value)}
                      placeholder={`e.g. Lead for hardware telemetry integration, authored Kalman filter algorithm, and created the ROS2 communication bridge...`}
                      className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add Teammate Input Subform */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <span className="text-xs font-bold text-slate-800 block">
                + Add Another Student Teammate
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Student Name (e.g. Sam Patel)"
                  className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
                <input
                  type="text"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="Role (e.g. Embedded Firmware Engineer)"
                  className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <input
                type="text"
                value={newMemberContribution}
                onChange={(e) => setNewMemberContribution(e.target.value)}
                placeholder="What part did they work on? (e.g. Microcontroller I/O and motor driver circuit design)"
                className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddTeammate}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Student to Team Roster</span>
              </button>
            </div>
          </div>

          {/* Section 4: Attach Files & Label to Students */}
          <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-950">
                  Attached Deliverables & Project Files
                </h3>
              </div>
              <span className="text-[11px] text-blue-800 font-medium">
                Each file can be labeled to a specific student
              </span>
            </div>

            <FileAttachmentInput
              files={attachedFiles}
              onChange={setAttachedFiles}
              attributionOptions={teamMembers.map((m) => ({
                id: m.id,
                name: m.name,
                label: `${m.name}${m.id === currentUser.id ? ' (You)' : ''} — ${m.role}`,
              }))}
              defaultAttributionId={currentUser.id}
              allowCanvasImport={appMode === 'campus'}
              canvasCourseCode={courseCode}
            />
          </div>

          {/* Section 5: Code Access Policy */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Source Code Access Setting *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Public */}
              <label
                className={`relative flex flex-col p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  isClassProject
                    ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200'
                    : codeAvailability === 'public'
                    ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="codeAvailability"
                  disabled={isClassProject}
                  checked={codeAvailability === 'public'}
                  onChange={() => setCodeAvailability('public')}
                  className="sr-only"
                />
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1">
                  <GitBranch className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Public Code</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Link your public GitHub repository so visitors can view code and star repo.
                </p>
              </label>

              {/* Option 2: On Request */}
              <label
                className={`relative flex flex-col p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  codeAvailability === 'on_request'
                    ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="codeAvailability"
                  checked={codeAvailability === 'on_request'}
                  onChange={() => setCodeAvailability('on_request')}
                  className="sr-only"
                />
                <div className="flex items-center gap-1.5 font-bold text-amber-800 mb-1">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  <span>On Request</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Source code is private. Interested users must submit a request and wait for approval.
                </p>
              </label>

              {/* Option 3: None */}
              <label
                className={`relative flex flex-col p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  codeAvailability === 'none'
                    ? 'border-slate-500 bg-slate-100/60 ring-2 ring-slate-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="codeAvailability"
                  checked={codeAvailability === 'none'}
                  onChange={() => setCodeAvailability('none')}
                  className="sr-only"
                />
                <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>Demo Only (No Code)</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Showcase UI/UX, videos, and deliverables without sharing underlying code.
                </p>
              </label>
            </div>
          </div>

          {/* GitHub Repo Selector (if public) */}
          {codeAvailability === 'public' && !isClassProject && (
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-slate-800" />
                  <span className="text-xs font-bold text-slate-800">
                    Attach GitHub Repository
                  </span>
                </div>
                {currentUser.githubConnected && (
                  <span className="text-[11px] text-emerald-700 font-medium">
                    Connected as @{currentUser.githubUsername}
                  </span>
                )}
              </div>

              {currentUser.githubConnected ? (
                <div>
                  <select
                    value={selectedRepoId}
                    onChange={(e) => setSelectedRepoId(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a repository...</option>
                    {userRepos.map((repo) => (
                      <option key={repo.id} value={String(repo.id)}>
                        {repo.full_name} ({repo.stargazers_count} ★) - {repo.language || 'Code'}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500">
                    Connect your GitHub account or paste a public repo URL:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customRepoUrl}
                      onChange={(e) => setCustomRepoUrl(e.target.value)}
                      placeholder="https://github.com/username/project-repo"
                      className="flex-1 text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={openGitHubModal}
                      className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Connect GitHub
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tags for skills, languages, topics */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Tags for Skills, Languages, & Topics
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag (e.g., Python, Computer Vision, Robotics)..."
                className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* Links & Optional Media */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Live Demo Link (Optional)
              </label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  placeholder="https://myproject.demo.dev"
                  className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Demo Video Link (Optional)
              </label>
              <div className="relative">
                <Video className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={demoVideoUrl}
                  onChange={(e) => setDemoVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Publish to collabr</span>
          </button>
        </div>
      </div>
    </div>
  );
};
