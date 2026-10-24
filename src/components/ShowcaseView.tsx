import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ShowcaseProject, CodeAvailability } from '../types';
import { filterShowcaseProjects, sortShowcaseProjects } from '../utils/showcase';
import {
  Sparkles,
  Search,
  Filter,
  Plus,
  GitFork,
  Lock,
  Eye,
  Heart,
  Users,
  ExternalLink,
  GraduationCap,
  Globe,
  Code2,
  ArrowUpDown,
  Tag,
  CheckCircle2,
} from 'lucide-react';

const COMMON_TAGS = [
  'All',
  'TypeScript',
  'Python',
  'Rust',
  'React',
  'Three.js',
  'AI',
  'Transit',
  'Sustainability',
  'Bioinformatics',
];

export const ShowcaseView: React.FC = () => {
  const {
    showcaseProjects,
    setSelectedShowcaseProjectId,
    setIsShareProjectOpen,
    toggleShowcaseInterest,
    incrementShowcaseView,
    currentUser,
  } = useApp();

  // Filters & Sorting state
  const [search, setSearch] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [codeFilter, setCodeFilter] = useState<CodeAvailability | 'all'>('all');
  const [onlyCollaborators, setOnlyCollaborators] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'most_viewed' | 'most_interested'>('most_interested');

  const filteredAndSorted = useMemo(() => {
    const filtered = filterShowcaseProjects(showcaseProjects, {
      search,
      schoolId: selectedSchool,
      codeAvailability: codeFilter,
      lookingForCollaborators: onlyCollaborators,
      selectedTag: selectedTag === 'All' ? undefined : selectedTag,
    });
    return sortShowcaseProjects(filtered, sortBy);
  }, [showcaseProjects, search, selectedSchool, codeFilter, onlyCollaborators, selectedTag, sortBy]);

  const handleCardClick = (project: ShowcaseProject) => {
    incrementShowcaseView(project.id);
    setSelectedShowcaseProjectId(project.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-8 sm:p-10 shadow-xl border border-indigo-800/40">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold tracking-wide uppercase">
            <Globe className="w-3.5 h-3.5 text-indigo-300" />
            Cross-University Public Showcase
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Built by students across all universities.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Explore live systems, open-source prototypes, and capstones shared across Ohio State, Michigan, Stanford, and beyond. Request code, message founders, or invite teammates to build together.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsShareProjectOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              Share a project
            </button>
            <div className="flex items-center gap-4 text-xs text-slate-400 pl-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {showcaseProjects.length} Public Projects
              </span>
              <span>·</span>
              <span>
                {showcaseProjects.filter((p) => p.status === 'collaborating').length} Looking for Collaborators
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Grid Graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden md:block bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects, technologies, authors, or use cases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* School Scoping Dropdown */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Universities (Cross-Campus)</option>
              <option value="osu">Ohio State (OSU)</option>
              <option value="umich">Michigan (UMich)</option>
              <option value="stanford">Stanford University</option>
            </select>

            {/* Code Availability Filter */}
            <select
              value={codeFilter}
              onChange={(e) => setCodeFilter(e.target.value as CodeAvailability | 'all')}
              className="text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Code Access</option>
              <option value="public">Public Code Only</option>
              <option value="on_request">Code on Request</option>
              <option value="none">No Code (Demos)</option>
            </select>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-medium px-2.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="most_interested">Most Interested</option>
                <option value="most_viewed">Most Viewed</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Secondary Filter Row: Collaborator Toggle & Tag Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mr-1 flex items-center gap-1">
              <Tag className="w-3 h-3" /> Topic:
            </span>
            {COMMON_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-xs px-2.5 py-1 rounded-md transition-all font-medium ${
                  selectedTag === tag
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={onlyCollaborators}
              onChange={(e) => setOnlyCollaborators(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="flex items-center gap-1.5 text-indigo-900">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              Looking for collaborators only
            </span>
          </label>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredAndSorted.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No matching showcase projects</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, school filter, or tags. You can also be the first to share a project in this category!
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedSchool('all');
              setCodeFilter('all');
              setSelectedTag('All');
              setOnlyCollaborators(false);
            }}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSorted.map((project) => {
            const isCollaborating = project.status === 'collaborating';
            return (
              <div
                key={project.id}
                onClick={() => handleCardClick(project)}
                className="group relative bg-white rounded-xl border border-slate-200/90 hover:border-indigo-400/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer overflow-hidden"
              >
                {/* Media Banner preview if available */}
                {project.mediaUrl && (
                  <div className="relative h-40 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                    <img
                      src={project.mediaUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                    
                    {/* Top badging over media */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      {/* University Pill */}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/95 backdrop-blur-xs text-slate-800 shadow-xs border border-white/20">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                        {project.authorSchoolName.replace('The ', '')}
                      </span>

                      {/* Code Access Badge */}
                      {project.codeAvailability === 'public' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-600 text-white shadow-xs">
                          <Code2 className="w-3 h-3" />
                          Code public
                        </span>
                      )}
                      {project.codeAvailability === 'on_request' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500 text-white shadow-xs">
                          <Lock className="w-3 h-3" />
                          Code on request
                        </span>
                      )}
                      {project.codeAvailability === 'none' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-700 text-white shadow-xs">
                          <Eye className="w-3 h-3" />
                          No code
                        </span>
                      )}
                    </div>

                    {/* Class project indicator if applicable */}
                    {project.isClassProject && (
                      <div className="absolute bottom-2 left-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-900/90 text-indigo-200 border border-indigo-700/50">
                          Coursework Project
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col space-y-3">
                  {/* If no media, show school & code badge here */}
                  {!project.mediaUrl && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                        {project.authorSchoolName}
                      </span>
                      {project.codeAvailability === 'public' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Code2 className="w-3 h-3" />
                          Code public
                        </span>
                      )}
                      {project.codeAvailability === 'on_request' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Lock className="w-3 h-3" />
                          Code on request
                        </span>
                      )}
                      {project.codeAvailability === 'none' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          <Eye className="w-3 h-3" />
                          No code
                        </span>
                      )}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {project.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 flex-1">
                    {project.summary}
                  </p>

                  {/* Collaborators Banner / Open Roles */}
                  {isCollaborating && project.openRoles.length > 0 && (
                    <div className="rounded-lg bg-indigo-50/70 border border-indigo-100 p-2.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-indigo-900">
                        <Users className="w-3 h-3 text-indigo-600" />
                        Looking for collaborators:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {project.openRoles.slice(0, 2).map((role, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium bg-white px-2 py-0.5 rounded text-indigo-800 border border-indigo-200/80"
                          >
                            {role}
                          </span>
                        ))}
                        {project.openRoles.length > 2 && (
                          <span className="text-[10px] font-medium text-indigo-600 self-center">
                            +{project.openRoles.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-[11px] text-slate-400 self-center">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Footer: Author & Metrics */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                        {project.authorAvatarInitial}
                      </div>
                      <span className="font-medium text-slate-700">{project.authorName}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className="flex items-center gap-1 text-slate-500 font-mono text-[11px]"
                        title={`${project.viewsCount} total views`}
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        {project.viewsCount}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleShowcaseInterest(project.id);
                        }}
                        className={`flex items-center gap-1 px-2 py-1 rounded transition-colors text-[11px] font-mono ${
                          project.userInterested
                            ? 'text-rose-600 bg-rose-50 font-bold'
                            : 'text-slate-600 hover:text-rose-500 hover:bg-slate-50'
                        }`}
                        title="Express interest"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            project.userInterested ? 'fill-rose-500 text-rose-500' : ''
                          }`}
                        />
                        {project.interestedCount}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
