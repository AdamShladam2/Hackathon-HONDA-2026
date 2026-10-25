import React, { useState } from 'react';
import {
  Search,
  Filter,
  BookOpen,
  Plus,
  Users,
  Clock,
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  X,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ReusableProjectTemplate } from '../types';

export const TeacherBrowseProjectsView: React.FC = () => {
  const { reusableProjectTemplates, openAddProjectModal } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState<ReusableProjectTemplate | null>(null);

  // Collect unique disciplines and project types
  const disciplines = ['All', ...Array.from(new Set(reusableProjectTemplates.map((t) => t.discipline)))];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Mixed'];
  const projectTypes = ['All', 'Coursework', 'Capstone', 'Lab', 'Open Source', 'Independent'];

  const filteredTemplates = reusableProjectTemplates.filter((template) => {
    const matchesSearch =
      searchQuery === '' ||
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (template.universityOrCourse && template.universityOrCourse.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDiscipline = selectedDiscipline === 'All' || template.discipline === selectedDiscipline;
    const matchesDifficulty = selectedDifficulty === 'All' || template.difficultyLevel === selectedDifficulty;
    const matchesType = selectedType === 'All' || template.projectType === selectedType;

    return matchesSearch && matchesDiscipline && matchesDifficulty && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Value Proposition */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Peer-Reviewed Curriculum Library
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {filteredTemplates.length} of {reusableProjectTemplates.length} projects available
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Teacher Project Search & Curriculum Templates
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Search rigorously designed academic assignments, lab modules, and capstones authored by university faculty and open curriculum contributors. Preview deliverables, learning objectives, and rubrics, then customize and adopt them for your class.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Main Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by keywords, algorithms, skills, course codes, or concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Discipline Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {disciplines.map((d) => (
                <option key={d} value={d}>
                  Discipline: {d}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  Difficulty: {diff}
                </option>
              ))}
            </select>
          </div>

          {/* Project Type Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {projectTypes.map((t) => (
                <option key={t} value={t}>
                  Type: {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Pills */}
        {(selectedDiscipline !== 'All' || selectedDifficulty !== 'All' || selectedType !== 'All' || searchQuery) && (
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs flex-wrap">
            <span className="text-slate-400 font-medium">Active Filters:</span>
            {selectedDiscipline !== 'All' && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                Discipline: {selectedDiscipline}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDiscipline('All')} />
              </span>
            )}
            {selectedDifficulty !== 'All' && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                Difficulty: {selectedDifficulty}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDifficulty('All')} />
              </span>
            )}
            {selectedType !== 'All' && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                Type: {selectedType}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedType('All')} />
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDiscipline('All');
                setSelectedDifficulty('All');
                setSelectedType('All');
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Projects Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No matching curriculum templates found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing your discipline filter, or exploring other project types.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                {/* Header Tag Row */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {template.discipline}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Permitted for Reuse
                  </span>
                </div>

                {/* Title and Summary */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {template.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                    {template.summary}
                  </p>
                </div>

                {/* Deliverables Preview */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                    Expected Deliverables:
                  </span>
                  {template.expectedDeliverables.slice(0, 2).map((del, i) => (
                    <div key={i} className="text-slate-600 dark:text-slate-400 truncate flex items-center gap-1.5">
                      <span className="text-emerald-500 text-[10px]">✓</span>
                      <span>{del}</span>
                    </div>
                  ))}
                  {template.expectedDeliverables.length > 2 && (
                    <span className="text-[10px] text-slate-400 italic block">
                      +{template.expectedDeliverables.length - 2} additional deliverables
                    </span>
                  )}
                </div>

                {/* Metadata Pills */}
                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-center">
                    <span className="block text-slate-400 text-[10px]">Difficulty</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {template.difficultyLevel}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-center">
                    <span className="block text-slate-400 text-[10px]">Team Size</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {template.suggestedTeamSize.min}-{template.suggestedTeamSize.max} students
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-center">
                    <span className="block text-slate-400 text-[10px]">Duration</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {template.estimatedDuration}
                    </span>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="flex flex-wrap gap-1">
                  {template.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Author attribution */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                  <img
                    src={template.creatorAvatar}
                    alt={template.creatorName}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="truncate">
                    Authored by <strong className="text-slate-700 dark:text-slate-300">{template.creatorName}</strong>
                    {template.universityOrCourse ? ` • ${template.universityOrCourse}` : ''}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(template)}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>

                <button
                  type="button"
                  onClick={() => openAddProjectModal(template)}
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add to My Class
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Curriculum Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in">
            <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                    {previewTemplate.discipline}
                  </span>
                  <span className="text-xs text-slate-500">
                    {previewTemplate.universityOrCourse || 'Public Library'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {previewTemplate.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-700 dark:text-slate-300">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
                  Full Project Description
                </h4>
                <p className="leading-relaxed whitespace-pre-wrap">{previewTemplate.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
                  Learning Objectives ({previewTemplate.learningObjectives.length})
                </h4>
                <ul className="space-y-1 pl-4 list-disc">
                  {previewTemplate.learningObjectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
                  Expected Deliverables
                </h4>
                <div className="space-y-1">
                  {previewTemplate.expectedDeliverables.map((del, i) => (
                    <div key={i} className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
                  Default Grading Rubric
                </h4>
                <div className="space-y-1.5">
                  {previewTemplate.defaultGradingRubric.map((r, i) => (
                    <div key={i} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-semibold block text-slate-900 dark:text-white">{r.title}</span>
                        <span className="text-slate-500 text-[11px]">{r.description}</span>
                      </div>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{r.maxPoints} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  const t = previewTemplate;
                  setPreviewTemplate(null);
                  openAddProjectModal(t);
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Customize & Add to My Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
