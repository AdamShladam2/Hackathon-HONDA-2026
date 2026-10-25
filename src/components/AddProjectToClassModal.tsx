import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle,
  Plus,
  Trash2,
  FileText,
  Sparkles,
  Layers,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RubricCriterion } from '../types';

export const AddProjectToClassModal: React.FC = () => {
  const {
    templateToAddToClass,
    isAddProjectModalOpen,
    closeAddProjectModal,
    teacherClasses,
    addProjectToClass,
  } = useApp();

  if (!isAddProjectModalOpen || !templateToAddToClass) return null;

  const template = templateToAddToClass;

  const [selectedClassId, setSelectedClassId] = useState<string>(
    teacherClasses[0]?.id || ''
  );
  const [title, setTitle] = useState(template.title);
  const [description, setDescription] = useState(template.summary);
  const [instructions, setInstructions] = useState(template.description);
  const [assignmentType, setAssignmentType] = useState<'Individual' | 'Group'>(
    template.suggestedTeamSize.max > 1 ? 'Group' : 'Individual'
  );
  const [teamSizeMin, setTeamSizeMin] = useState(template.suggestedTeamSize.min);
  const [teamSizeMax, setTeamSizeMax] = useState(template.suggestedTeamSize.max);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');
  const [collaborationRules, setCollaborationRules] = useState(
    'High-level architectural design and conceptual discussions are permitted across teams. All data structures, implementations, benchmarks, and written reports must be authored independently.'
  );
  const [academicIntegrityPolicy, setAcademicIntegrityPolicy] = useState(
    'Deterministic n-gram shingle similarity checking will be performed across peer submissions, previous course archives, and reference solutions.'
  );
  const [submissionRequirements, setSubmissionRequirements] = useState(
    'Comprehensive written synthesis report, system schema diagram, and private repository link.'
  );
  const [learningObjectives, setLearningObjectives] = useState<string[]>(
    template.learningObjectives || []
  );
  const [newObjective, setNewObjective] = useState('');

  const [expectedDeliverables, setExpectedDeliverables] = useState<string[]>(
    template.expectedDeliverables || []
  );
  const [newDeliverable, setNewDeliverable] = useState('');

  const [gradingRubric, setGradingRubric] = useState<RubricCriterion[]>(
    template.defaultGradingRubric || [
      {
        id: 'r-1',
        title: 'System Architecture & Concurrency',
        maxPoints: 30,
        description: 'Robustness, thread safety, and modularity.',
      },
      {
        id: 'r-2',
        title: 'Empirical Benchmarking & Performance',
        maxPoints: 40,
        description: 'Throughput metrics and stress-testing analysis.',
      },
      {
        id: 'r-3',
        title: 'Written Synthesis & Independent Contribution',
        maxPoints: 30,
        description: 'Quality of technical documentation and clarity of contribution.',
      },
    ]
  );

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setLearningObjectives([...learningObjectives, newObjective.trim()]);
      setNewObjective('');
    }
  };

  const handleRemoveObjective = (index: number) => {
    setLearningObjectives(learningObjectives.filter((_, i) => i !== index));
  };

  const handleAddDeliverable = () => {
    if (newDeliverable.trim()) {
      setExpectedDeliverables([...expectedDeliverables, newDeliverable.trim()]);
      setNewDeliverable('');
    }
  };

  const handleRemoveDeliverable = (index: number) => {
    setExpectedDeliverables(expectedDeliverables.filter((_, i) => i !== index));
  };

  const handleAddRubricItem = () => {
    const newItem: RubricCriterion = {
      id: `rubric-${Date.now()}`,
      title: 'New Rubric Criterion',
      maxPoints: 20,
      description: 'Criteria description and grading expectations.',
    };
    setGradingRubric([...gradingRubric, newItem]);
  };

  const handleUpdateRubricItem = (index: number, updates: Partial<RubricCriterion>) => {
    setGradingRubric(
      gradingRubric.map((r, i) => (i === index ? { ...r, ...updates } : r))
    );
  };

  const handleRemoveRubricItem = (index: number) => {
    setGradingRubric(gradingRubric.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProjectToClass(template, {
      classId: selectedClassId,
      title,
      description,
      instructions,
      assignmentType,
      teamSizeMin,
      teamSizeMax,
      dueDate,
      status,
      collaborationRules,
      academicIntegrityPolicy,
      submissionRequirements,
      learningObjectives,
      expectedDeliverables,
      gradingRubric,
    });
    closeAddProjectModal();
  };

  const totalPoints = gradingRubric.reduce((acc, r) => acc + (Number(r.maxPoints) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                Classroom Template Reuse
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Original by {template.creatorName} ({template.universityOrCourse || 'Public Library'})
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Add Project to Class: {template.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize course assignment details, due date, team sizing, and grading rubric before publishing.
            </p>
          </div>

          <button
            onClick={closeAddProjectModal}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Course & Assignment Identity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Course / Class *
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {teacherClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.code}: {cls.name} ({cls.semester})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Publication Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Published' | 'Draft')}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Published">Published (Active & Visible to Students)</option>
                <option value="Draft">Draft (Saved in Teacher View Only)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Custom Assignment Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Short Summary
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Section 2: Instructions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Assignment Instructions & Specifications *
            </label>
            <textarea
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              required
            />
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
              These instructions will also be indexed as course boilerplate so student quotes of instructions are not flagged in similarity checks.
            </span>
          </div>

          {/* Section 3: Teaming & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assignment Type
              </label>
              <select
                value={assignmentType}
                onChange={(e) => setAssignmentType(e.target.value as 'Individual' | 'Group')}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="Group">Group Assignment</option>
                <option value="Individual">Individual Assignment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Team Size (Min - Max)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={teamSizeMin}
                  onChange={(e) => setTeamSizeMin(parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center"
                />
                <span className="text-xs text-slate-400">to</span>
                <input
                  type="number"
                  min={teamSizeMin}
                  max={12}
                  value={teamSizeMax}
                  onChange={(e) => setTeamSizeMax(parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center"
                />
                <span className="text-xs text-slate-500">students</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Submission Due Date *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                required
              />
            </div>
          </div>

          {/* Section 4: Learning Objectives */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Learning Objectives ({learningObjectives.length})
            </label>
            <div className="space-y-1.5 mb-2">
              {learningObjectives.map((obj, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs border border-slate-200 dark:border-slate-700"
                >
                  <span className="text-slate-800 dark:text-slate-200">• {obj}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveObjective(i)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add learning objective (e.g., Master consensus protocols under node failure)..."
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddObjective();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              />
              <button
                type="button"
                onClick={handleAddObjective}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"
              >
                Add
              </button>
            </div>
          </div>

          {/* Section 5: Expected Deliverables */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Expected Deliverables ({expectedDeliverables.length})
            </label>
            <div className="space-y-1.5 mb-2">
              {expectedDeliverables.map((del, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs border border-slate-200 dark:border-slate-700"
                >
                  <span className="text-slate-800 dark:text-slate-200">✓ {del}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDeliverable(i)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add deliverable (e.g., Architecture document with benchmark results)..."
                value={newDeliverable}
                onChange={(e) => setNewDeliverable(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDeliverable();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              />
              <button
                type="button"
                onClick={handleAddDeliverable}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"
              >
                Add
              </button>
            </div>
          </div>

          {/* Section 6: Grading Rubric */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-500" />
                Grading Rubric ({totalPoints} Total Points)
              </label>
              <button
                type="button"
                onClick={handleAddRubricItem}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Criterion
              </button>
            </div>

            <div className="space-y-2">
              {gradingRubric.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                >
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateRubricItem(idx, { title: e.target.value })}
                      className="w-full px-2 py-1 text-xs font-medium rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      placeholder="Criterion title"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={item.maxPoints}
                        onChange={(e) =>
                          handleUpdateRubricItem(idx, { maxPoints: parseInt(e.target.value) || 0 })
                        }
                        className="w-16 px-2 py-1 text-xs text-center rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                      <span className="text-[11px] text-slate-400">pts</span>
                    </div>
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleUpdateRubricItem(idx, { description: e.target.value })
                      }
                      className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                      placeholder="Evaluation description"
                    />
                  </div>
                  <div className="sm:col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveRubricItem(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Collaboration & Academic Integrity Policies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Collaboration Rules
              </label>
              <textarea
                rows={2}
                value={collaborationRules}
                onChange={(e) => setCollaborationRules(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Integrity & Similarity Policy
              </label>
              <textarea
                rows={2}
                value={academicIntegrityPolicy}
                onChange={(e) => setAcademicIntegrityPolicy(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Section 8: Anti-Copying Protection Note */}
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">SkillSink Academic Anti-Copying Protection:</span> Student submissions to this academic project are restricted from public code repositories on the Showcase to protect academic integrity.
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={closeAddProjectModal}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {status === 'Published' ? 'Add & Publish to Class' : 'Save as Draft'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
