import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Users,
  BarChart3,
  Sparkles,
  ArrowRight,
  Star,
  Search,
  Filter,
  GraduationCap,
  Briefcase,
  FolderGit2,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Paperclip,
  BookOpen,
  X,
} from 'lucide-react';
import { Project } from '../types';

export const DiscoverView: React.FC = () => {
  const {
    projects,
    setSelectedProject,
    openContributionAnalysisModal,
    setActiveView,
    openOnboardingModal,
    openRateTeammateModal,
    getUserRatingSummaryData,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'industry' | 'autonomous'>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedProfessor, setSelectedProfessor] = useState<string>('all');

  // Class coursework lives in Campus mode; Discover only shows publicly shared projects
  const allProjects = projects;

  // Primary 4-person spotlight project: BuckeyeRover Autonomous Terrain Navigator (proj-1)
  const spotlightProject =
    allProjects.find((p) => p.id === 'proj-1' || p.title.toLowerCase().includes('rover')) ||
    allProjects[0];

  // Derive available courses & professors
  const availableCourses = Array.from(
    new Set(allProjects.map((p) => p.courseCode).filter(Boolean))
  ) as string[];

  const availableProfessors = Array.from(
    new Set(allProjects.map((p) => p.professorName).filter(Boolean))
  ) as string[];

  const filteredProjects = allProjects.filter((p) => {
    const projectSkills = p.tags || p.skills || p.skillsRequired || [];
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.courseCode && p.courseCode.toLowerCase().includes(q)) ||
      (p.courseName && p.courseName.toLowerCase().includes(q)) ||
      (p.professorName && p.professorName.toLowerCase().includes(q)) ||
      projectSkills.some((s: string) => s.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    // Course filter
    if (selectedCourse !== 'all') {
      if (p.courseCode !== selectedCourse && p.courseName !== selectedCourse) return false;
    }

    // Professor filter
    if (selectedProfessor !== 'all') {
      if (p.professorName !== selectedProfessor) return false;
    }

    if (selectedCategory === 'industry') return p.hubType === 'work';
    if (selectedCategory === 'autonomous')
      return (
        (p.discipline || '').toLowerCase().includes('robotics') ||
        p.title.toLowerCase().includes('rover') ||
        projectSkills.some((s: string) => ['ROS2', 'Three.js', 'C++', 'Computer Vision'].includes(s))
      );
    return true;
  });

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'industry', label: 'Industry & Open Source' },
    { id: 'autonomous', label: 'Autonomous & Robotics' },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-12">
      {/* 5-Second Clarity Hero Section */}
      <section className="bg-gradient-to-b from-blue-50/70 via-white to-slate-50/30 border border-blue-100/80 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-sm">
        {/* Decorative subtle background elements */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          {/* Simple Tagline */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-black tracking-wide uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Swipe. Match. Build. Prove.</span>
          </div>

          {/* Primary Purpose Headline */}
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Find projects and teammates that match your skills.
          </h1>

          {/* Direct Purpose Explanation */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            collabr helps students and developers discover active initiatives, connect with proven collaborators, and build an authentic track record of verified individual contributions.
          </p>

          {/* One Clear Primary Action + Secondary Tour */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('project-discovery-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Start Discovering</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => setActiveView('find-teammates')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-sm border border-purple-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4 text-purple-600" />
              <span>Match Teammates</span>
            </button>

            <button
              onClick={openOnboardingModal}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>30-Sec Tour</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 Core Value Propositions (Clean & Scannable) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveView('find-teammates')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm mb-1">Swipe & Match</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Find teammates by skills, courses, and proven collaboration ratings (1–5).
          </p>
        </div>

        <div
          onClick={() => spotlightProject && openContributionAnalysisModal(spotlightProject)}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm mb-1">Analyze Contributions</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            AI-assisted breakdown of who did which part with transparent evidence checks.
          </p>
        </div>

        <div
          onClick={() => setActiveView('campus-hub')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm mb-1">Campus Hub</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Class assignments, student workspaces, and reviewer-confirmed contributions.
          </p>
        </div>

        <div
          onClick={() => setActiveView('profile')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm mb-1">Verified Portfolio</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Demonstrate actual deliverables, Google Docs revisions, and peer feedback.
          </p>
        </div>
      </section>

      {/* Featured 4-Person Project Spotlight (BuckeyeRover Navigator) */}
      {spotlightProject && (
        <section className="bg-white border-2 border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
                  Featured 4-Person Project
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {spotlightProject.school || spotlightProject.author.school || 'Ohio State University'} · {spotlightProject.discipline || spotlightProject.courseName || 'Computer Science & Robotics'}
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {spotlightProject.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {spotlightProject.summary || spotlightProject.description}
              </p>

              {/* 4 Contributors Pill Deck */}
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Active Contributors & Peer Ratings:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {(spotlightProject.teamMembers || []).map((member) => {
                    const ratingSummary = getUserRatingSummaryData(member.id);
                    return (
                      <div
                        key={member.id}
                        className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-xl text-xs"
                      >
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block leading-tight">
                            {member.name}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {member.role}
                          </span>
                        </div>
                        {ratingSummary.reviewCount > 0 ? (
                          <div className="flex items-center gap-0.5 text-amber-600 font-black text-[11px] bg-white px-1.5 py-0.5 rounded border border-slate-200 ml-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            <span>{ratingSummary.averageScore}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic ml-1">New</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Actions for Spotlight */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <button
                onClick={() => openContributionAnalysisModal(spotlightProject)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <BarChart3 className="w-4 h-4 text-blue-200" />
                <span>Analyze Contributions</span>
              </button>

              <button
                onClick={() => setSelectedProject(spotlightProject)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 text-slate-800 font-semibold text-xs hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Full Details</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Discovery Feed Section */}
      <section id="project-discovery-section" className="space-y-6 pt-4">
        {/* Search & Category Filter Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, course, professor, or skill..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dedicated University Course & Professor Filter Bar */}
          <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-indigo-950 font-bold shrink-0">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>University Filter:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              {/* Course Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-600">Course:</span>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white border border-indigo-200 text-indigo-950 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">All Courses</option>
                  {availableCourses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Professor Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-600">Professor:</span>
                <select
                  value={selectedProfessor}
                  onChange={(e) => setSelectedProfessor(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white border border-indigo-200 text-indigo-950 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">All Professors</option>
                  {availableProfessors.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Course Pills */}
              <div className="flex items-center gap-1 flex-wrap">
                {['CSE 3901', 'CSE 5521', 'ENGR 1181'].map((coursePill) => (
                  <button
                    key={coursePill}
                    type="button"
                    onClick={() =>
                      setSelectedCourse(selectedCourse === coursePill ? 'all' : coursePill)
                    }
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                      selectedCourse === coursePill
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100/60'
                    }`}
                  >
                    {coursePill}
                  </button>
                ))}
              </div>
            </div>

            {(selectedCourse !== 'all' || selectedProfessor !== 'all' || searchQuery.trim() !== '') && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCourse('all');
                  setSelectedProfessor('all');
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-1 text-[11px] text-indigo-700 hover:text-indigo-900 font-semibold px-2 py-1 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors self-start md:self-auto cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const isGroup = (project.teamMembers && project.teamMembers.length > 1);
            return (
              <div
                key={project.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        project.hubType === 'work'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {project.hubType === 'work' ? 'Work Hub' : 'Campus Hub'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {project.discipline || project.school || project.author.school || project.courseName || 'General'}
                    </span>
                  </div>

                  {/* Course & Professor Bar inside card */}
                  {(project.courseCode || project.professorName) && (
                    <div className="flex items-center gap-1.5 flex-wrap text-[11px] bg-slate-50 border border-slate-200/80 p-1.5 rounded-lg text-slate-700">
                      {project.courseCode && (
                        <span className="font-bold font-mono px-1.5 py-0.2 rounded bg-indigo-50 border border-indigo-200 text-indigo-900">
                          {project.courseCode}
                        </span>
                      )}
                      {project.professorName && (
                        <span className="text-slate-600 truncate">
                          Prof: <strong className="font-semibold text-slate-800">{project.professorName.split(' ').slice(-1)[0]}</strong>
                        </span>
                      )}
                      {project.attachedFiles && project.attachedFiles.length > 0 && (
                        <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded font-medium">
                          <Paperclip className="w-2.5 h-2.5 text-blue-600" />
                          <span>{project.attachedFiles.length} file{project.attachedFiles.length > 1 ? 's' : ''}</span>
                        </span>
                      )}
                    </div>
                  )}

                  <h3
                    onClick={() => setSelectedProject(project)}
                    className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {project.summary || project.description}
                  </p>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(project.tags || project.skills || project.skillsRequired || []).slice(0, 3).map((s: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                      >
                        {s}
                      </span>
                    ))}
                    {(project.tags || project.skills || project.skillsRequired || []).length > 3 && (
                      <span className="text-[11px] font-medium text-slate-400 px-1">
                        +{(project.tags || project.skills || project.skillsRequired || []).length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center -space-x-1.5">
                    {(project.teamMembers || [project.author]).slice(0, 4).map((member, i) => (
                      <img
                        key={i}
                        src={member.avatar}
                        alt={member.name}
                        title={member.name}
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                      />
                    ))}
                    {(project.teamMembers?.length || 1) > 4 && (
                      <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center ring-2 ring-white">
                        +{(project.teamMembers?.length || 1) - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isGroup && (
                      <button
                        onClick={() => openContributionAnalysisModal(project)}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        title="Analyze individual contributions"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>Audit</span>
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
