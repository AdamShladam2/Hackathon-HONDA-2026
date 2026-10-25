import React, { useState } from 'react';
import { Project, TaskStatus, TaskPriority, ProjectTask } from '../types';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Plus,
  Send,
  Users,
  Briefcase,
  GraduationCap,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Check,
  ListTodo,
  Flag,
  ShieldCheck,
  FolderKanban,
  Edit3,
} from 'lucide-react';

interface ProjectWorkspaceViewProps {
  project: Project;
  onBack: () => void;
}

export const ProjectWorkspaceView: React.FC<ProjectWorkspaceViewProps> = ({ project, onBack }) => {
  const {
    currentUser,
    updateTaskStatus,
    addTask,
    addMilestone,
    toggleMilestone,
    addWorkspaceDiscussion,
    showToast,
  } = useApp();

  // Task filter state
  const [taskFilter, setTaskFilter] = useState<'All' | TaskStatus>('All');

  // New task form state
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(
    project.teamMembers.length > 0 ? project.teamMembers[0].id : currentUser.id
  );
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-11-15');

  // New milestone state
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('2026-11-20');

  // Discussion state
  const [newComment, setNewComment] = useState('');

  // Deliverable submission state for task
  const [activeTaskForDeliverable, setActiveTaskForDeliverable] = useState<string | null>(null);
  const [deliverableInput, setDeliverableInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');

  const tasks = project.tasks || [];
  const milestones = project.milestones || [];
  const discussions = project.discussions || [];

  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const filteredTasks = tasks.filter((t) => (taskFilter === 'All' ? true : t.status === taskFilter));

  const isOwner = project.author.id === currentUser.id;
  const isMember = project.teamMembers.some((m) => m.id === currentUser.id);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const assignedMember = project.teamMembers.find((m) => m.id === newTaskAssignee);

    addTask(project.id, {
      projectId: project.id,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      assignedToId: newTaskAssignee,
      assignedToName: assignedMember ? assignedMember.name : currentUser.name,
      assignedToAvatar: assignedMember ? assignedMember.avatar : currentUser.avatar,
      status: 'To Do',
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
    });

    setNewTaskTitle('');
    setNewTaskDesc('');
    setIsAddingTask(false);
  };

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;

    addMilestone(project.id, {
      projectId: project.id,
      title: newMilestoneTitle.trim(),
      targetDate: newMilestoneDate,
      completed: false,
    });

    setNewMilestoneTitle('');
    setIsAddingMilestone(false);
  };

  const handleSendDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addWorkspaceDiscussion(project.id, newComment.trim());
    setNewComment('');
  };

  const handleSaveDeliverable = (taskId: string) => {
    updateTaskStatus(
      project.id,
      taskId,
      'In Review',
      deliverableInput.trim() || undefined,
      feedbackInput.trim() || undefined
    );
    setActiveTaskForDeliverable(null);
    setDeliverableInput('');
    setFeedbackInput('');
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Top Bar with Navigation and Project Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Work Hub</span>
            </button>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Project Workspace
              </span>
              {project.openToStudents && (
                <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  Student Mentee Collaboration
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {project.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              {project.summary}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            {project.githubRepo && (
              <a
                href={project.githubRepo.html_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <span>Repo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <span>Live Staging</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Workspace KPI Progress Bar */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Task Completion</span>
            <div className="text-lg font-extrabold text-slate-900 tabular-nums">
              {progressPercent}%
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Active Tasks</span>
            <div className="text-lg font-extrabold text-slate-900 tabular-nums">
              {tasks.length} total · {completedTasks} done
            </div>
            <span className="text-[11px] text-slate-400">
              {tasks.length - completedTasks} remaining
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Team Members</span>
            <div className="text-lg font-extrabold text-slate-900 tabular-nums">
              {project.teamMembers.length} contributors
            </div>
            <span className="text-[11px] text-slate-400">
              Target size: {project.targetTeamSize || 4}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Milestones</span>
            <div className="text-lg font-extrabold text-slate-900 tabular-nums">
              {milestones.filter((m) => m.completed).length} / {milestones.length}
            </div>
            <span className="text-[11px] text-slate-400">Roadmap targets</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Tasks & Milestones */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Project Tasks */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">Assigned Tasks ({tasks.length})</h2>
              </div>

              <div className="flex items-center gap-2">
                {/* Status Filter */}
                <select
                  value={taskFilter}
                  onChange={(e) => setTaskFilter(e.target.value as any)}
                  className="text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                >
                  <option value="All">All Statuses</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Completed">Completed</option>
                </select>

                <button
                  onClick={() => setIsAddingTask(!isAddingTask)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Assign Task</span>
                </button>
              </div>
            </div>

            {/* Inline Add Task Form */}
            {isAddingTask && (
              <form onSubmit={handleCreateTask} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  New Task Assignment
                </h3>
                <div>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Task Title (e.g., Implement WebSocket streaming handler)"
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <textarea
                    rows={2}
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    placeholder="Task details and expected deliverable criteria..."
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Assign To:</label>
                    <select
                      value={newTaskAssignee}
                      onChange={(e) => setNewTaskAssignee(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    >
                      {project.teamMembers.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Priority:</label>
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as any)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Due Date:</label>
                    <input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save & Assign
                  </button>
                </div>
              </form>
            )}

            {/* Task List */}
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
                No tasks in this view. Click &quot;Assign Task&quot; to add one.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => {
                  const isAssignedToMe = task.assignedToId === currentUser.id;
                  const isDeliverableOpen = activeTaskForDeliverable === task.id;

                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-xl border transition-all ${
                        task.status === 'Completed'
                          ? 'bg-slate-50/70 border-slate-200'
                          : isAssignedToMe
                          ? 'bg-white border-blue-300 ring-1 ring-blue-100 shadow-2xs'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3
                              className={`text-sm font-bold ${
                                task.status === 'Completed'
                                  ? 'text-slate-500 line-through'
                                  : 'text-slate-900'
                              }`}
                            >
                              {task.title}
                            </h3>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                task.priority === 'High'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : task.priority === 'Medium'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {task.priority} Priority
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {task.description}
                          </p>
                        </div>

                        {/* Status selector / Toggle */}
                        <div className="flex items-center gap-2 shrink-0">
                          <select
                            value={task.status}
                            onChange={(e) => updateTaskStatus(project.id, task.id, e.target.value as TaskStatus)}
                            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                              task.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : task.status === 'In Progress'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : task.status === 'In Review'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="In Review">In Review</option>
                            <option value="Completed">Completed</option>
                          </select>

                          {/* Quick complete button for student/assignee */}
                          {task.status !== 'Completed' && (
                            <button
                              onClick={() => updateTaskStatus(project.id, task.id, 'Completed')}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Mark Task Completed"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Footer metadata: Assignee & Deliverable */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400">Assigned:</span>
                          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                            {task.assignedToAvatar && (
                              <img
                                src={task.assignedToAvatar}
                                alt={task.assignedToName || 'Member'}
                                referrerPolicy="no-referrer"
                                className="w-4 h-4 rounded-full object-cover"
                              />
                            )}
                            <span>{task.assignedToName || 'Unassigned'}</span>
                            {isAssignedToMe && (
                              <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.2 rounded">
                                (You)
                              </span>
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {task.dueDate && (
                            <span className="text-[11px] text-slate-500 font-mono">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}

                          <button
                            onClick={() =>
                              setActiveTaskForDeliverable(isDeliverableOpen ? null : task.id)
                            }
                            className="text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
                          >
                            {task.deliverableUrl ? 'View Deliverable' : '+ Add Deliverable'}
                          </button>
                        </div>
                      </div>

                      {/* Deliverable info or submission input */}
                      {task.deliverableUrl && !isDeliverableOpen && (
                        <div className="mt-2 p-2 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-emerald-900">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Deliverable:</span>
                            <a
                              href={task.deliverableUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-blue-700 underline truncate max-w-xs"
                            >
                              {task.deliverableUrl}
                            </a>
                          </div>
                          {task.feedbackNote && (
                            <span className="text-slate-600 italic text-[11px]">
                              Feedback: &quot;{task.feedbackNote}&quot;
                            </span>
                          )}
                        </div>
                      )}

                      {isDeliverableOpen && (
                        <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Deliverable Link (PR, Figma, Document, or Deployment):
                            </label>
                            <input
                              type="url"
                              value={deliverableInput}
                              onChange={(e) => setDeliverableInput(e.target.value)}
                              placeholder="https://github.com/.../pull/12"
                              className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Peer Feedback or Review Note:
                            </label>
                            <input
                              type="text"
                              value={feedbackInput}
                              onChange={(e) => setFeedbackInput(e.target.value)}
                              placeholder="e.g., Code reviewed; great test coverage!"
                              className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
                            />
                          </div>
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setActiveTaskForDeliverable(null)}
                              className="px-2.5 py-1 text-slate-500 hover:text-slate-800"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveDeliverable(task.id)}
                              className="px-3 py-1 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
                            >
                              Save Deliverable & Review
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Project Milestones */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">Project Milestones</h2>
              </div>
              <button
                onClick={() => setIsAddingMilestone(!isAddingMilestone)}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Milestone</span>
              </button>
            </div>

            {isAddingMilestone && (
              <form onSubmit={handleCreateMilestone} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                <input
                  type="text"
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  placeholder="Milestone Title (e.g. v1.0 Production Release)"
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  required
                />
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={newMilestoneDate}
                    onChange={(e) => setNewMilestoneDate(e.target.value)}
                    className="p-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 ml-auto"
                  >
                    Save Milestone
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2.5">
              {milestones.length === 0 ? (
                <div className="text-xs text-slate-400 p-4 text-center">No milestones declared yet.</div>
              ) : (
                milestones.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => toggleMilestone(project.id, m.id)}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          m.completed
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {m.completed && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span
                          className={`text-xs font-bold block ${
                            m.completed ? 'text-slate-500 line-through' : 'text-slate-900'
                          }`}
                        >
                          {m.title}
                        </span>
                        {m.deliverableNote && (
                          <span className="text-[11px] text-slate-500 block">{m.deliverableNote}</span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      Target: {new Date(m.targetDate).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Team, Discussion & Feedback */}
        <div className="space-y-6">
          {/* Team Members Roster */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Team Roster ({project.teamMembers.length})
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Collaborators</span>
            </div>

            <div className="space-y-2.5">
              {project.teamMembers.map((member) => (
                <div key={member.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-slate-300 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {member.name}
                        </span>
                        {member.id === currentUser.id && (
                          <span className="text-[9px] font-bold text-blue-600 bg-blue-100 px-1 rounded">
                            You
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 truncate block">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 shrink-0">
                    {member.identity || 'Member'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Discussion & Team Updates */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between min-h-[380px]">
            <div className="space-y-3 flex-1 overflow-y-auto">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Team Workspace Discussion
                </h3>
              </div>

              {discussions.length === 0 ? (
                <div className="text-xs text-slate-400 text-center py-6">
                  No discussion messages yet. Leave a note below for the team!
                </div>
              ) : (
                discussions.map((d) => (
                  <div key={d.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center justify-between gap-1 text-[11px]">
                      <span className="font-bold text-slate-900">{d.authorName}</span>
                      <span className="text-slate-400">
                        {new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{d.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Discussion Composer */}
            <form onSubmit={handleSendDiscussion} className="pt-2 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Post an update to the team..."
                className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                title="Send update"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
