import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import {
  Search,
  Filter,
  GraduationCap,
  Users,
  UserPlus,
  BookOpen,
  ArrowUpRight,
  Sparkles,
  Layers,
  LayoutGrid,
  Check,
  X,
  Heart,
  ChevronRight,
  ShieldCheck,
  Clock,
  Code2,
  Calendar,
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';

export const ExploreFeed: React.FC = () => {
  const {
    projects,
    ideas,
    currentUser,
    currentSchool,
    setSelectedProjectId,
    setSelectedStudentId,
    setActiveTab,
    setIsCreateProjectOpen,
    setIsPostIdeaOpen,
    submitJoinRequest,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'class' | 'personal'>('all');
  const [selectedMajor, setSelectedMajor] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [onlyOpenToJoin, setOnlyOpenToJoin] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'deck'>('grid');

  // School-scoped projects
  const schoolProjects = useMemo(() => {
    if (!currentUser) return [];
    return projects.filter((p) => p.schoolId === currentUser.schoolId);
  }, [projects, currentUser]);

  // School-scoped ideas
  const schoolIdeas = useMemo(() => {
    if (!currentUser) return [];
    return ideas.filter((i) => i.schoolId === currentUser.schoolId);
  }, [ideas, currentUser]);

  // User skills for possession highlights
  const userSkillSet = useMemo(() => {
    return new Set((currentUser?.skills || []).map((s) => s.toLowerCase()));
  }, [currentUser]);

  // Extract all available skills for filters
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    schoolProjects.forEach((p) => {
      p.tags.forEach((t) => set.add(t));
      p.skillsNeeded.forEach((s) => set.add(s));
    });
    return Array.from(set).sort();
  }, [schoolProjects]);

  const allMajors = [
    'Computer Science & Engineering',
    'Electrical & Computer Engineering',
    'Visual Communication Design',
    'Finance',
    'Marketing',
    'Biology',
  ];

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return schoolProjects.filter((p) => {
      if (typeFilter !== 'all' && p.type !== typeFilter) return false;
      if (onlyOpenToJoin && !p.openToJoin) return false;

      if (selectedMajor !== 'all') {
        const hasMemberMajor = p.members.some((m) =>
          m.major.toLowerCase().includes(selectedMajor.toLowerCase())
        );
        const hasTagMajor = p.tags.some((t) =>
          t.toLowerCase().includes(selectedMajor.toLowerCase())
        );
        if (!hasMemberMajor && !hasTagMajor) return false;
      }

      if (selectedSkill !== 'all') {
        const matchesSkill =
          p.tags.includes(selectedSkill) || p.skillsNeeded.includes(selectedSkill);
        if (!matchesSkill) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCourse = p.courseCode?.toLowerCase().includes(q);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));
        const matchesMembers = p.members.some((m) => m.name.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesCourse && !matchesTags && !matchesMembers) {
          return false;
        }
      }

      return true;
    });
  }, [schoolProjects, typeFilter, onlyOpenToJoin, selectedMajor, selectedSkill, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Editorial Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/90">
        <div>
          <div className="flex items-center gap-2 text-[10px] tracking-wider uppercase font-bold text-indigo-700 mb-1.5">
            <span>{currentSchool?.name}</span>
            <span className="text-slate-400">·</span>
            <span>Collaboration Feed</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
            Student Projects & Teammate Discovery
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
            Discover real coursework and side ventures built by fellow {currentSchool?.mascot || 'students'}. Review document version histories, inspect 4-axis competency fits, and connect with peers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPostIdeaOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all cursor-pointer active:scale-95 shadow-2xs"
          >
            Post an Idea Spark
          </button>
          <button
            onClick={() => setIsCreateProjectOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-sm cursor-pointer active:scale-95"
          >
            Launch New Project
          </button>
        </div>
      </div>

      {/* Filter & View Mode Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, skills, courses (e.g. CSE 2221, React, Robotics)..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle: Grid vs Physics Deck */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Curated Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid View</span>
              </button>
              <button
                onClick={() => setViewMode('deck')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'deck'
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Tactile Gesture Physics Card Deck"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Tactile Deck</span>
              </button>
            </div>

            {/* Segmented Type Controller */}
            <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium shrink-0">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  typeFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({schoolProjects.length})
              </button>
              <button
                onClick={() => setTypeFilter('class')}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  typeFilter === 'class'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Class Work
              </button>
              <button
                onClick={() => setTypeFilter('personal')}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  typeFilter === 'personal'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Personal
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Filter Row: Majors, Skills, and Open to Join */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400">Filter by:</span>
            </div>

            <select
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-xs focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Academic Majors</option>
              {allMajors.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-xs focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Skills</option>
              {allSkills.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
            <input
              type="checkbox"
              checked={onlyOpenToJoin}
              onChange={(e) => setOnlyOpenToJoin(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
            />
            <span className="font-semibold text-xs">Looking for Collaborators only</span>
          </label>
        </div>
      </div>

      {/* Main Content Area: Deck View vs Grid View */}
      {viewMode === 'deck' ? (
        <PhysicsCardDeck
          projects={filteredProjects}
          userSkillSet={userSkillSet}
          onSelect={(proj) => setSelectedProjectId(proj.id)}
          onJoin={(proj) => {
            submitJoinRequest(proj.id, proj.openRoles[0] || 'Contributor', 'Interested in joining via deck swipe!');
          }}
        />
      ) : (
        /* Curated Grid View with 4-Axis Comparison Bars & Skill Possession Chips */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-[10px] tracking-wider uppercase font-bold text-slate-400">
              Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'} at {currentSchool?.name}
            </div>
            {(searchQuery || typeFilter !== 'all' || selectedMajor !== 'all' || selectedSkill !== 'all' || onlyOpenToJoin) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('all');
                  setSelectedMajor('all');
                  setSelectedSkill('all');
                  setOnlyOpenToJoin(false);
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No matching projects found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Try clearing search terms or selecting another category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectGridCard
                  key={project.id}
                  project={project}
                  userSkillSet={userSkillSet}
                  onSelect={() => setSelectedProjectId(project.id)}
                  onSelectStudent={(studentId) => {
                    setSelectedStudentId(studentId);
                    setActiveTab('profile');
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Idea Sparks Highlight Banner with Soft Violet Gradient */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] tracking-wider uppercase font-bold text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Campus Idea Incubator ({schoolIdeas.length} active sparks)</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Have an early concept before launching a project?</h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Post an early idea, gather feedback and "I'm interested" notes from peers, then convert it directly into a project team.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('ideas')}
          className="px-4 py-2.5 rounded-lg bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
        >
          Browse Idea Sparks &rarr;
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Curated Grid Card Component with Inset Strips & 4-Axis Comparison Bars    */
/* -------------------------------------------------------------------------- */

interface ProjectGridCardProps {
  project: Project;
  userSkillSet: Set<string>;
  onSelect: () => void;
  onSelectStudent: (studentId: string) => void;
}

const ProjectGridCard: React.FC<ProjectGridCardProps> = ({
  project,
  userSkillSet,
  onSelect,
  onSelectStudent,
}) => {
  // Deterministic 4-axis values based on project attributes
  const isClass = project.type === 'class';
  const codeIntensity = isClass ? 88 : 72;
  const systemArch = isClass ? 94 : 80;
  const researchRigor = project.courseCode?.includes('BIO') || project.courseCode?.includes('BUS') ? 92 : 78;
  const teamVelocity = project.openToJoin ? 85 : 70;

  return (
    <article
      onClick={onSelect}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300/80 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Visual Cover if present */}
      {project.imageUrl ? (
        <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
          <img
            src={project.imageUrl}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

          {/* Top Badges */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
            {isClass ? (
              <span className="font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500/90 text-slate-950 backdrop-blur-xs flex items-center gap-1 font-mono">
                <GraduationCap className="w-3 h-3" />
                <span>{project.courseCode} · Class Project</span>
              </span>
            ) : (
              <span className="font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-indigo-900/90 text-indigo-100 backdrop-blur-xs border border-indigo-700/50">
                Personal Venture
              </span>
            )}

            {project.openToJoin && (
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-600/90 text-white backdrop-blur-xs flex items-center gap-1">
                <UserPlus className="w-3 h-3" />
                <span>Joinable</span>
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="px-5 pt-5 flex items-center justify-between">
          {isClass ? (
            <span className="font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-amber-700" />
              <span>{project.courseCode} · Class Project</span>
            </span>
          ) : (
            <span className="font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-900 border border-indigo-200">
              Personal Venture
            </span>
          )}

          {project.openToJoin && (
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <UserPlus className="w-3 h-3" />
              <span>Joinable</span>
            </span>
          )}
        </div>
      )}

      {/* Main Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {project.tagline || project.description}
          </p>
        </div>

        {/* Inset Metadata Strip for Department, Duration & Team Size */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] grid grid-cols-3 gap-2 text-center text-slate-600">
          <div>
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Scope</span>
            <span className="font-semibold text-slate-800 truncate block">
              {project.courseCode || 'Campus Lab'}
            </span>
          </div>
          <div className="border-x border-slate-200/80">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Duration</span>
            <span className="font-mono text-slate-800 font-semibold text-[11px] block">
              12 Wks
            </span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Team</span>
            <span className="font-mono text-slate-800 font-semibold text-[11px] block">
              {project.members.length} Members
            </span>
          </div>
        </div>

        {/* Visual 4-Axis Comparison Bars */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[9px] uppercase tracking-wider font-bold text-slate-400 flex items-center justify-between">
            <span>Project Competency Profile</span>
            <span className="text-indigo-600 font-mono">4-Axis Fit</span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]">
            <div>
              <div className="flex justify-between text-slate-500 mb-0.5">
                <span>Code Rigor</span>
                <span className="font-mono font-bold text-slate-800">{codeIntensity}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div style={{ width: `${codeIntensity}%` }} className="h-full bg-indigo-600 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-500 mb-0.5">
                <span>Architecture</span>
                <span className="font-mono font-bold text-slate-800">{systemArch}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div style={{ width: `${systemArch}%` }} className="h-full bg-indigo-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-500 mb-0.5">
                <span>Research Depth</span>
                <span className="font-mono font-bold text-slate-800">{researchRigor}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div style={{ width: `${researchRigor}%` }} className="h-full bg-amber-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-500 mb-0.5">
                <span>Velocity</span>
                <span className="font-mono font-bold text-slate-800">{teamVelocity}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div style={{ width: `${teamVelocity}%` }} className="h-full bg-emerald-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Skill Chips: Distinction between skills user possesses vs project requested */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
            Skills & Competencies
          </div>
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 4).map((tag) => {
              const userHasSkill = userSkillSet.has(tag.toLowerCase());
              return (
                <span
                  key={tag}
                  className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 transition-all ${
                    userHasSkill
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                  title={userHasSkill ? 'You possess this matching skill!' : undefined}
                >
                  {userHasSkill && <Check className="w-2.5 h-2.5 text-indigo-600" />}
                  <span>{tag}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Seeking roles callout */}
        {project.openToJoin && project.openRoles.length > 0 && (
          <div className="bg-amber-50/70 border border-amber-200/60 rounded-lg p-2 text-[11px] text-amber-900">
            <span className="font-bold">Seeking:</span> {project.openRoles.join(', ')}
          </div>
        )}

        {/* Footer with Member Avatars & Details Link */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center -space-x-1.5 overflow-hidden">
            {project.members.map((member) => (
              <div
                key={member.userId}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectStudent(member.userId);
                }}
                className="w-7 h-7 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white hover:scale-110 transition-transform cursor-pointer"
                title={`${member.name} (${member.role})`}
              >
                {member.avatarInitial}
              </div>
            ))}
            <span className="ml-3 text-slate-500 font-mono text-[11px]">
              {project.members.length} team
            </span>
          </div>

          <div className="flex items-center gap-1 font-bold text-xs text-indigo-600 group-hover:translate-x-0.5 transition-transform">
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </article>
  );
};

/* -------------------------------------------------------------------------- */
/* Tactile Fluid Physics Card Deck with Drag Rotation & Dynamic Stamps       */
/* -------------------------------------------------------------------------- */

interface PhysicsCardDeckProps {
  projects: Project[];
  userSkillSet: Set<string>;
  onSelect: (p: Project) => void;
  onJoin: (p: Project) => void;
}

const PhysicsCardDeck: React.FC<PhysicsCardDeckProps> = ({
  projects,
  userSkillSet,
  onSelect,
  onJoin,
}) => {
  const [deckIndex, setDeckIndex] = useState(0);
  const [swipedNotice, setSwipedNotice] = useState<string | null>(null);

  const activeCard = projects[deckIndex];
  const nextCard = projects[deckIndex + 1];

  // Motion physics values for drag displacement
  const x = useMotionValue(0);
  const rotateZ = useTransform(x, (val) => `${val * 0.08}deg`);
  const interestedStampOpacity = useTransform(x, [20, 100], [0, 1]);
  const passStampOpacity = useTransform(x, [-100, -20], [1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 120 || velocity > 400) {
      // Swiped Right: Interested
      if (activeCard) {
        onJoin(activeCard);
        setSwipedNotice(`Interested in "${activeCard.title}"! Join request queued.`);
      }
      advanceCard();
    } else if (offset < -120 || velocity < -400) {
      // Swiped Left: Pass
      setSwipedNotice(`Passed "${activeCard?.title}".`);
      advanceCard();
    }
  };

  const advanceCard = () => {
    setTimeout(() => setSwipedNotice(null), 3000);
    setDeckIndex((prev) => (prev + 1 < projects.length ? prev + 1 : 0));
  };

  if (!activeCard) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
        <Sparkles className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
        <h3 className="font-bold text-slate-900">Deck complete!</h3>
        <p className="text-xs text-slate-500 mt-1">You reviewed all available campus projects.</p>
        <button
          onClick={() => setDeckIndex(0)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold"
        >
          Reset Card Deck
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-6 space-y-6 select-none">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="text-[10px] tracking-wider uppercase font-bold text-indigo-600">
          Tactile Physics Deck (Card {deckIndex + 1} of {projects.length})
        </span>
        <span className="text-[11px] font-mono">Drag Left: PASS · Drag Right: JOIN</span>
      </div>

      {swipedNotice && (
        <div className="p-2.5 bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold rounded-lg text-center animate-in fade-in">
          {swipedNotice}
        </div>
      )}

      {/* Physical Depth Stacking Container */}
      <div className="relative w-full h-[520px]">
        {/* Secondary Card Preview Beneath (scale 0.96, translateY 12px, opacity 0.7) */}
        {nextCard && (
          <div
            style={{
              transform: 'scale(0.96) translateY(14px)',
              opacity: 0.7,
            }}
            className="absolute inset-0 bg-white rounded-3xl border border-slate-200 shadow-md p-6 pointer-events-none transition-all flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400">
                Next in Deck · {nextCard.courseCode || 'Venture'}
              </span>
              <h3 className="text-base font-bold text-slate-800 mt-1">{nextCard.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1">{nextCard.tagline}</p>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Ready on deck</div>
          </div>
        )}

        {/* Active Draggable Card */}
        <motion.div
          key={activeCard.id}
          drag="x"
          dragElastic={0.6}
          dragConstraints={{ left: -220, right: 220 }}
          onDragEnd={handleDragEnd}
          style={{ x, rotateZ }}
          className="absolute inset-0 bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing overflow-hidden"
        >
          {/* Dynamic Drag Stamp: INTERESTED (Emerald) */}
          <motion.div
            style={{ opacity: interestedStampOpacity }}
            className="absolute top-6 left-6 z-30 pointer-events-none px-4 py-1.5 border-3 border-emerald-600 rounded-xl text-emerald-700 font-black tracking-widest text-lg rotate-[-12deg] bg-white/90 backdrop-blur-xs"
          >
            INTERESTED
          </motion.div>

          {/* Dynamic Drag Stamp: PASS (Rose) */}
          <motion.div
            style={{ opacity: passStampOpacity }}
            className="absolute top-6 right-6 z-30 pointer-events-none px-4 py-1.5 border-3 border-rose-600 rounded-xl text-rose-700 font-black tracking-widest text-lg rotate-[12deg] bg-white/90 backdrop-blur-xs"
          >
            PASS
          </motion.div>

          {/* Card Content Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              {activeCard.type === 'class' ? (
                <span className="font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1 font-mono">
                  <GraduationCap className="w-3 h-3 text-amber-700" />
                  <span>{activeCard.courseCode} · Class Project</span>
                </span>
              ) : (
                <span className="font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-900 border border-indigo-200">
                  Personal Venture
                </span>
              )}

              {activeCard.openToJoin && (
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Open to Join
                </span>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-snug">{activeCard.title}</h2>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed line-clamp-3">
                {activeCard.description}
              </p>
            </div>

            {/* Inset Metadata Strip */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] grid grid-cols-3 gap-2 text-center text-slate-600">
              <div>
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Department</span>
                <span className="font-semibold text-slate-800 truncate block">
                  {activeCard.courseCode ? 'College Eng.' : 'Student Lab'}
                </span>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Duration</span>
                <span className="font-mono text-slate-800 font-bold block">12 Weeks</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Team</span>
                <span className="font-mono text-slate-800 font-bold block">{activeCard.members.length} Members</span>
              </div>
            </div>

            {/* Seeking Roles */}
            {activeCard.openRoles.length > 0 && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <span className="font-bold">Recruiting:</span> {activeCard.openRoles.join(', ')}
              </div>
            )}

            {/* Skills */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Required Skills</span>
              <div className="flex flex-wrap gap-1">
                {activeCard.skillsNeeded.map((s) => {
                  const hasSkill = userSkillSet.has(s.toLowerCase());
                  return (
                    <span
                      key={s}
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        hasSkill
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {hasSkill && '✓ '}
                      {s}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onSelect(activeCard)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Inspect Full Spec & Docs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <span className="text-[10px] text-slate-400 font-mono">
              Swipe right to request join
            </span>
          </div>
        </motion.div>
      </div>

      {/* Tactile Bottom Action Controls */}
      <div className="flex items-center justify-center gap-6 pt-2">
        <button
          onClick={() => {
            setSwipedNotice(`Passed "${activeCard.title}".`);
            advanceCard();
          }}
          className="w-14 h-14 rounded-full bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-rose-500/10"
          title="Pass on this project"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={() => onSelect(activeCard)}
          className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-md hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          Open Details
        </button>

        <button
          onClick={() => {
            onJoin(activeCard);
            setSwipedNotice(`Interested in "${activeCard.title}"! Join request queued.`);
            advanceCard();
          }}
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-emerald-500/20"
          title="I'm Interested / Send Join Request"
        >
          <Heart className="w-6 h-6 stroke-[2.5] fill-white" />
        </button>
      </div>
    </div>
  );
};
