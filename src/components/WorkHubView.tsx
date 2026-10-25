import React, { useState, useMemo } from 'react';
import { Project, Author } from '../types';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  Users,
  Sparkles,
  Search,
  Filter,
  GraduationCap,
  ShieldCheck,
  Plus,
  ExternalLink,
  ChevronRight,
  GitBranch,
  Star,
  Layers,
  Heart,
  Lightbulb,
  Building2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface WorkHubViewProps {
  onSelectProject: (project: Project) => void;
}

export const WorkHubView: React.FC<WorkHubViewProps> = ({ onSelectProject }) => {
  const {
    currentUser,
    workProjects,
    allDemoAccounts,
    openCreateWorkModal,
    openWorkspace,
    openApplyModal,
    toggleInterest,
    getCompatibility,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'recommended' | 'collaborators' | 'students' | 'my-projects' | 'members'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [openToStudentsOnly, setOpenToStudentsOnly] = useState(false);
  const [seekingMentorsOnly, setSeekingMentorsOnly] = useState(false);

  // My Work projects (owned or joined)
  const myWorkProjects = useMemo(() => {
    return workProjects.filter(
      (p) => p.author.id === currentUser.id || p.teamMembers.some((m) => m.id === currentUser.id)
    );
  }, [workProjects, currentUser]);

  // Unique industries
  const industries = useMemo(() => {
    const list = new Set<string>();
    workProjects.forEach((p) => {
      if (p.industry) list.add(p.industry);
    });
    return Array.from(list);
  }, [workProjects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return workProjects.filter((project) => {
      // Tab pre-filters
      if (activeTab === 'collaborators' && project.status !== 'Looking for collaborators') {
        return false;
      }
      if (activeTab === 'students' && !project.openToStudents) {
        return false;
      }
      if (activeTab === 'my-projects') {
        const isMine = project.author.id === currentUser.id || project.teamMembers.some((m) => m.id === currentUser.id);
        if (!isMine) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = project.title.toLowerCase().includes(q);
        const matchSummary = project.summary.toLowerCase().includes(q);
        const matchAuthor = project.author.name.toLowerCase().includes(q);
        const matchIndustry = (project.industry || '').toLowerCase().includes(q);
        const matchSkills = (project.skillsRequired || []).some((s) => s.toLowerCase().includes(q));
        const matchRoles = (project.openRoles || []).some((r) => r.toLowerCase().includes(q));
        if (!matchTitle && !matchSummary && !matchAuthor && !matchIndustry && !matchSkills && !matchRoles) {
          return false;
        }
      }

      // Industry filter
      if (selectedIndustry !== 'all' && project.industry !== selectedIndustry) {
        return false;
      }

      // Experience filter
      if (selectedExperience !== 'all' && project.experienceLevel !== selectedExperience) {
        return false;
      }

      // Open to students filter
      if (openToStudentsOnly && !project.openToStudents) {
        return false;
      }

      // Seeking mentors filter
      if (seekingMentorsOnly && !project.seekingIndustryMentor) {
        return false;
      }

      return true;
    });
  }, [
    workProjects,
    activeTab,
    searchQuery,
    selectedIndustry,
    selectedExperience,
    openToStudentsOnly,
    seekingMentorsOnly,
    currentUser,
  ]);

  // Recommended opportunities sorted by compatibility score
  const recommendedProjects = useMemo(() => {
    return [...workProjects].sort((a, b) => {
      const scoreA = getCompatibility(a).overallScore;
      const scoreB = getCompatibility(b).overallScore;
      return scoreB - scoreA;
    });
  }, [workProjects, currentUser]);

  const isStudent = currentUser.identities.includes('Student');

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Editorial Hero Banner */}
      <div className="relative overflow-hidden bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">
            <Briefcase className="w-4 h-4" />
            <span>Work Hub · Professional & Independent Network</span>
            <span aria-hidden="true">·</span>
            <span>Open to Working Pros & Students</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2" style={{ textWrap: 'balance' }}>
            Build production-grade projects with industry peers and mentors.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            A collaborative space for working professionals, independent developers, and university students.
            Discover open-source initiatives, share architecture specs, and build cross-functional teams with shared workspaces.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => openCreateWorkModal()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create a Work Project</span>
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Student Cross-Hub Opportunities</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cross-Hub Mentorship & Student Guidance Banner */}
      {isStudent && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950 space-y-0.5">
              <span className="font-bold block">
                Welcome Student Collaborator ({currentUser.name})!
              </span>
              <p className="text-emerald-900 leading-relaxed">
                As an Ohio State student, you can apply directly to professional projects marked <strong>&quot;Open to Students&quot;</strong> to gain real-world architecture experience, receive code reviews, and join shared project workspaces.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab('students');
              setOpenToStudentsOnly(true);
            }}
            className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shrink-0 cursor-pointer shadow-2xs"
          >
            Show Student Openings
          </button>
        </div>
      )}

      {/* Nav Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            All Projects ({workProjects.length})
          </button>

          <button
            onClick={() => setActiveTab('recommended')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'recommended'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Recommended for You</span>
          </button>

          <button
            onClick={() => setActiveTab('collaborators')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'collaborators'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Looking for Collaborators</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'students'
                ? 'bg-emerald-700 text-white'
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Open to Students</span>
          </button>

          <button
            onClick={() => setActiveTab('my-projects')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'my-projects'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            My Work Projects ({myWorkProjects.length})
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'members'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Member Directory</span>
          </button>
        </div>

        <button
          onClick={() => openCreateWorkModal()}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Work Project</span>
        </button>
      </div>

      {/* Filter and Search Bar (Active for Projects tabs) */}
      {activeTab !== 'members' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, skills (Go, PyTorch, React), open role, or author..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="all">All Industries</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>

              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <button
              onClick={() => setOpenToStudentsOnly(!openToStudentsOnly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-medium cursor-pointer transition-colors ${
                openToStudentsOnly
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Open to Students only</span>
            </button>

            <button
              onClick={() => setSeekingMentorsOnly(!seekingMentorsOnly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-medium cursor-pointer transition-colors ${
                seekingMentorsOnly
                  ? 'bg-purple-50 border-purple-300 text-purple-800 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Seeking Industry Mentor</span>
            </button>

            {(searchQuery || selectedIndustry !== 'all' || selectedExperience !== 'all' || openToStudentsOnly || seekingMentorsOnly) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedIndustry('all');
                  setSelectedExperience('all');
                  setOpenToStudentsOnly(false);
                  setSeekingMentorsOnly(false);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 ml-auto cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* View: Member Directory */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">
              Professional & Academic Member Directory ({allDemoAccounts.length})
            </h2>
            <span className="text-xs text-slate-400">Collaborators across universities and industry</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allDemoAccounts.map((member) => (
              <div
                key={member.id}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 shadow-xs space-y-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{member.name}</h3>
                    <div className="text-xs font-medium text-blue-700 truncate">
                      {member.jobTitle || member.school || member.identities.join(', ')}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {member.organization || member.major || member.industry}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {member.bio}
                </p>

                {/* Skills chips */}
                <div className="flex flex-wrap gap-1">
                  {(member.skills || []).slice(0, 4).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    {member.availability || 'Available for projects'}
                  </span>
                  {member.openToMentoring && (
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.2 rounded">
                      Open to Mentor
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View: Project Cards Grid (All, Recommended, Collaborators, Students, My Projects) */}
      {activeTab !== 'members' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong className="text-slate-900">{filteredProjects.length}</strong>{' '}
              {filteredProjects.length === 1 ? 'project' : 'projects'}
            </span>
            {activeTab === 'recommended' && (
              <span className="text-blue-600 font-semibold">
                Ranked by deterministic compatibility match for {currentUser.name}
              </span>
            )}
          </div>

          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-xs text-slate-400">
              No matching work projects found. Try adjusting filters or create a new project.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredProjects.map((project) => {
                const compatibility = getCompatibility(project);
                const isMyTeam = project.teamMembers.some((m) => m.id === currentUser.id);

                return (
                  <div
                    key={project.id}
                    onClick={() => onSelectProject(project)}
                    className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between text-left space-y-4"
                  >
                    <div>
                      {/* Top Bar: Compatibility Match & Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Compatibility Badge with score breakdown */}
                          <div
                            className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200"
                            title={`Match breakdown: Skills ${compatibility.skillsMatch.score}/40, Industry ${compatibility.industryMatch.score}/25, Experience ${compatibility.experienceMatch.score}/15, Schedule ${compatibility.availabilityMatch.score}/20`}
                          >
                            <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span>{compatibility.overallScore}% Match</span>
                          </div>

                          {project.openToStudents && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                              <GraduationCap className="w-3 h-3 text-emerald-600" />
                              Open to Students
                            </span>
                          )}

                          {project.status === 'Looking for collaborators' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                              <Users className="w-3 h-3 text-blue-600" />
                              Open Roles
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleInterest(project.id);
                          }}
                          className={`p-1.5 rounded-md transition-colors ${
                            project.userInterested ? 'text-rose-600 bg-rose-50' : 'text-slate-400 hover:text-rose-600'
                          }`}
                          title="Save project"
                        >
                          <Heart className={`w-4 h-4 ${project.userInterested ? 'fill-rose-500' : ''}`} />
                        </button>
                      </div>

                      {/* Title & Summary */}
                      <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                        {project.summary}
                      </p>

                      {/* Open Roles Preview */}
                      {project.openRoles && project.openRoles.length > 0 && (
                        <div className="mb-3 p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1">
                          <span className="font-bold text-slate-700 text-[11px] block">
                            Seeking Roles:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {project.openRoles.map((r, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-white border border-slate-200 text-slate-800 rounded text-[11px] font-medium"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Skills required */}
                      <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500 mb-3">
                        <span className="font-medium text-slate-400">Tech:</span>
                        {(project.skillsRequired || project.tags || []).slice(0, 4).map((skill) => (
                          <span key={skill} className="px-2 py-0.2 bg-slate-100 rounded text-slate-700">
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Compatibility explanation pill */}
                      <div className="text-[11px] text-blue-900 bg-blue-50/60 p-2 rounded-lg border border-blue-100">
                        <span className="font-semibold text-blue-950">Match insight:</span>{' '}
                        {compatibility.explanation}
                      </div>
                    </div>

                    {/* Footer: Author & Workspace CTA */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={project.author.avatar}
                          alt={project.author.name}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div className="truncate">
                          <span className="font-semibold text-slate-900 truncate block">
                            {project.author.name}
                          </span>
                          <span className="text-[11px] text-slate-500 truncate block">
                            {project.author.jobTitle || project.author.school || 'Lead'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isMyTeam ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openWorkspace(project);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer shadow-2xs"
                          >
                            <span>Open Workspace</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openApplyModal(project);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
                          >
                            <span>Apply</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
