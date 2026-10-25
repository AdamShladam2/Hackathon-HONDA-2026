import React, { useState, useMemo } from 'react';
import { Project, CodeAvailability } from '../types';
import { ProjectCard } from './ProjectCard';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  Users,
  GitBranch,
  KeyRound,
  Eye,
  SlidersHorizontal,
  X,
  Sparkles,
  Briefcase,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';

interface ShowcaseGridProps {
  onSelectProject: (project: Project) => void;
}

export const ShowcaseGrid: React.FC<ShowcaseGridProps> = ({ onSelectProject }) => {
  const { projects, openShareModal, openCreateWorkModal } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [hubFilter, setHubFilter] = useState<'all' | 'student' | 'professional' | 'opensource' | 'collaborators' | 'mentors'>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedProfessor, setSelectedProfessor] = useState<string>('all');
  const [selectedCodeAvailability, setSelectedCodeAvailability] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'views' | 'interest'>('newest');

  const availableCourses = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.courseCode).filter(Boolean))) as string[];
  }, [projects]);

  const availableProfessors = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.professorName).filter(Boolean))) as string[];
  }, [projects]);

  const allTags = useMemo(() => {
    const countMap: Record<string, number> = {};
    projects.forEach((p) => {
      p.tags.forEach((t) => {
        countMap[t] = (countMap[t] || 0) + 1;
      });
    });
    return Object.entries(countMap)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        // Hub / Category filters
        if (hubFilter === 'student') {
          const isStudentProj =
            project.hubType === 'campus' ||
            project.author.identities?.includes('Student') ||
            !!project.author.school;
          if (!isStudentProj) return false;
        }

        if (hubFilter === 'professional') {
          if (project.hubType !== 'work') return false;
        }

        if (hubFilter === 'opensource') {
          if (project.codeAvailability !== 'public') return false;
        }

        if (hubFilter === 'collaborators') {
          if (project.status !== 'Looking for collaborators') return false;
        }

        if (hubFilter === 'mentors') {
          if (!project.seekingIndustryMentor && !project.hasMentor) return false;
        }

        // Course filter
        if (selectedCourse !== 'all') {
          if (project.courseCode !== selectedCourse && project.courseName !== selectedCourse) {
            return false;
          }
        }

        // Professor filter
        if (selectedProfessor !== 'all') {
          if (project.professorName !== selectedProfessor) {
            return false;
          }
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = project.title.toLowerCase().includes(q);
          const matchSummary = project.summary.toLowerCase().includes(q);
          const matchAuthor = project.author.name.toLowerCase().includes(q);
          const matchOrg = (project.author.organization || project.author.school || '').toLowerCase().includes(q);
          const matchTags = project.tags.some((t) => t.toLowerCase().includes(q));
          const matchRoles = (project.openRoles || []).some((r) => r.toLowerCase().includes(q));
          const matchCourse = (project.courseCode || project.courseName || '').toLowerCase().includes(q);
          const matchProf = (project.professorName || '').toLowerCase().includes(q);
          if (!matchTitle && !matchSummary && !matchAuthor && !matchOrg && !matchTags && !matchRoles && !matchCourse && !matchProf) {
            return false;
          }
        }

        // Code availability
        if (selectedCodeAvailability !== 'all' && project.codeAvailability !== selectedCodeAvailability) {
          return false;
        }

        // Tag filter
        if (selectedTag !== 'all' && !project.tags.includes(selectedTag)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'views') {
          return b.viewCount - a.viewCount;
        }
        if (sortBy === 'interest') {
          return b.interestCount - a.interestCount;
        }
        return 0;
      });
  }, [
    projects,
    hubFilter,
    selectedCourse,
    selectedProfessor,
    searchQuery,
    selectedCodeAvailability,
    selectedTag,
    sortBy,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    hubFilter !== 'all' ||
    selectedCourse !== 'all' ||
    selectedProfessor !== 'all' ||
    selectedCodeAvailability !== 'all' ||
    selectedTag !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setHubFilter('all');
    setSelectedCourse('all');
    setSelectedProfessor('all');
    setSelectedCodeAvailability('all');
    setSelectedTag('all');
    setSortBy('newest');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Editorial Header Banner */}
      <div className="relative overflow-hidden bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">
            <span>Universal Cross-Community Showcase</span>
            <span aria-hidden="true">·</span>
            <span>Campus & Work Hubs Unified</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2" style={{ textWrap: 'balance' }}>
            Discover working projects built by students & professionals.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            A universal public gallery of student research, open-source utilities, and professional engineering initiatives across campuses and industries.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => openShareModal()}
              className="px-4 py-2 text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer"
            >
              Share to Showcase
            </button>
            <button
              onClick={() => openCreateWorkModal()}
              className="px-4 py-2 text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Create Work Project
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        {/* Top line: Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all projects by title, tech stack, open roles, author, or company..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="newest">Newest additions</option>
              <option value="interest">Most interested</option>
              <option value="views">Most viewed</option>
            </select>
          </div>
        </div>

        {/* University Course & Professor Filter Controls */}
        <div className="p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-lg flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-indigo-950">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Course & Professor:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-md bg-white border border-indigo-200 text-indigo-900 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Courses</option>
              {availableCourses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <select
              value={selectedProfessor}
              onChange={(e) => setSelectedProfessor(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-md bg-white border border-indigo-200 text-indigo-900 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Professors</option>
              {availableProfessors.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            {['CSE 3901', 'CSE 5521'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCourse(selectedCourse === c ? 'all' : c)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                  selectedCourse === c
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {(selectedCourse !== 'all' || selectedProfessor !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSelectedCourse('all');
                setSelectedProfessor('all');
              }}
              className="text-[11px] text-indigo-700 hover:text-indigo-900 font-semibold underline cursor-pointer ml-auto"
            >
              Reset course/prof
            </button>
          )}
        </div>

        {/* Required Showcase Filters: All, Student, Professional, Open-Source, Looking for Collaborators, Seeking Mentors */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => setHubFilter('all')}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
              hubFilter === 'all'
                ? 'bg-slate-900 border-slate-900 text-white font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            All Projects ({projects.length})
          </button>

          <button
            onClick={() => setHubFilter('student')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
              hubFilter === 'student'
                ? 'bg-emerald-700 border-emerald-700 text-white font-semibold'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Projects</span>
          </button>

          <button
            onClick={() => setHubFilter('professional')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
              hubFilter === 'professional'
                ? 'bg-blue-700 border-blue-700 text-white font-semibold'
                : 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Professional Projects</span>
          </button>

          <button
            onClick={() => setHubFilter('opensource')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
              hubFilter === 'opensource'
                ? 'bg-slate-900 border-slate-900 text-white font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-emerald-600" />
            <span>Open-Source (Public Code)</span>
          </button>

          <button
            onClick={() => setHubFilter('collaborators')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
              hubFilter === 'collaborators'
                ? 'bg-slate-900 border-slate-900 text-white font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Looking for Collaborators</span>
          </button>

          <button
            onClick={() => setHubFilter('mentors')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
              hubFilter === 'mentors'
                ? 'bg-purple-700 border-purple-700 text-white font-semibold'
                : 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Seeking Mentors</span>
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-500 hover:text-slate-800 transition-colors ml-auto text-xs cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid Results count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800 tabular-nums">{filteredProjects.length}</strong>{' '}
          {filteredProjects.length === 1 ? 'project' : 'projects'}
        </span>
      </div>

      {/* Project Cards Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={onSelectProject}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">No matching projects found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Try adjusting your search query, or clear filters to view all projects across hubs.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
};
