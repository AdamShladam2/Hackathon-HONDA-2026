import React, { useState } from 'react';
import { ClipboardCheck, ExternalLink, Github, Lock, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import { PeerAssessmentEditor, PeerRatingDraft, RATING_LABELS, draftToAssessments } from './PeerAssessmentEditor';

// Class project extras on the project page: the private GitHub link and per-assignment
// peer assessments. Only the team and instructors can see either.
export const ProjectPeerAssessments: React.FC<{ project: Project }> = ({ project }) => {
  const { currentUser, addPeerAssessments } = useApp();

  const isTeam = project.author.id === currentUser.id || project.teamMembers.some((m) => m.id === currentUser.id);
  const isInstructor = currentUser.identities.includes('Teacher / Professor');
  const assessments = project.peerAssessments || [];
  const assignmentNames = Array.from(
    new Set([...(project.projectAssignments || []), ...assessments.map((a) => a.assignmentName)])
  );
  const teammates = project.teamMembers.filter((m) => m.id !== currentUser.id);

  const [isAssessing, setIsAssessing] = useState(false);
  const [assignment, setAssignment] = useState(assignmentNames[0] || '');
  const [newAssignment, setNewAssignment] = useState('');
  const [draft, setDraft] = useState<Record<string, PeerRatingDraft>>({});

  if (!project.isClassProject || (!project.repositoryUrl && assignmentNames.length === 0 && project.teamMembers.length < 2)) {
    return null;
  }

  if (!isTeam && !isInstructor) {
    return assignmentNames.length > 0 || project.repositoryUrl ? (
      <p className="flex items-center gap-1.5 text-xs text-slate-500">
        <Lock className="w-3.5 h-3.5" />
        Peer assessments{project.repositoryUrl ? ' and the GitHub repository' : ''} are visible to the team and instructors.
      </p>
    ) : null;
  }

  // Loads this user's earlier ratings for the chosen assignment so they can revise them
  const startAssessing = (name: string) => {
    setAssignment(name);
    const mine = assessments.filter(
      (a) => a.reviewerId === currentUser.id && a.assignmentName.toLowerCase() === name.toLowerCase()
    );
    setDraft(Object.fromEntries(mine.map((a) => [a.revieweeId, { rating: a.rating, comment: a.comment || '' }])));
    setIsAssessing(true);
  };

  const save = () => {
    const name = (assignment === '__new' ? newAssignment : assignment).trim();
    if (!name) return;
    const saved = draftToAssessments(draft, teammates, name, currentUser);
    if (saved.length === 0) return;
    addPeerAssessments(project.id, saved);
    setIsAssessing(false);
    setNewAssignment('');
    setDraft({});
  };

  return (
    <div className="space-y-4">
      {project.repositoryUrl && (
        <a
          href={project.repositoryUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
        >
          <span className="flex items-center gap-2 min-w-0">
            <Github className="w-4 h-4 shrink-0" />
            <span className="text-sm font-mono truncate">{project.repositoryUrl.replace(/^https:\/\/(www\.)?/, '')}</span>
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold shrink-0">
            View on GitHub <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </a>
      )}

      {(assignmentNames.length > 0 || (isTeam && teammates.length > 0)) && (
        <div className="border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <ClipboardCheck className="w-4 h-4 text-indigo-600" />
              Peer assessments
            </h4>
            {isTeam && teammates.length > 0 && !isAssessing && (
              <button
                type="button"
                onClick={() => startAssessing(assignmentNames[0] || '__new')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
              >
                Assess teammates
              </button>
            )}
          </div>

          {isAssessing && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <div className="flex flex-wrap gap-2">
                <select
                  value={assignment}
                  onChange={(e) => startAssessing(e.target.value)}
                  className="flex-1 min-w-40 text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                >
                  {assignmentNames.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                  <option value="__new">New assignment...</option>
                </select>
                {assignment === '__new' && (
                  <input
                    value={newAssignment}
                    onChange={(e) => setNewAssignment(e.target.value)}
                    placeholder="Assignment name"
                    className="flex-1 min-w-40 text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                )}
              </div>
              <PeerAssessmentEditor people={teammates} value={draft} onChange={setDraft} />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssessing(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={save}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                >
                  Save ratings
                </button>
              </div>
            </div>
          )}

          {assignmentNames.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No assessments yet.</p>
          ) : (
            assignmentNames.map((name) => {
              const forAssignment = assessments.filter((a) => a.assignmentName.toLowerCase() === name.toLowerCase());
              return (
                <div key={name} className="space-y-1.5">
                  <p className="text-xs font-bold text-slate-700">{name}</p>
                  {forAssignment.length === 0 ? (
                    <p className="text-[11px] text-slate-500 italic">Not assessed yet.</p>
                  ) : (
                    project.teamMembers
                      .map((m) => ({ member: m, received: forAssignment.filter((a) => a.revieweeId === m.id) }))
                      .filter((r) => r.received.length > 0)
                      .map(({ member, received }) => {
                        const avg = received.reduce((n, a) => n + a.rating, 0) / received.length;
                        return (
                          <div key={member.id} className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-semibold text-slate-800">{member.name}</span>
                              <span className="flex items-center gap-1 text-slate-600">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                                <span className="font-bold tabular-nums">{avg.toFixed(1)}</span>
                                <span className="text-slate-400">
                                  · {RATING_LABELS[Math.round(avg)]} · {received.length} rating{received.length > 1 ? 's' : ''}
                                </span>
                              </span>
                            </div>
                            {received
                              .filter((a) => a.comment)
                              .map((a) => (
                                <p key={a.id} className="text-[11px] text-slate-600">
                                  <span className="font-semibold text-slate-700">{a.reviewerName}:</span> {a.comment}
                                </p>
                              ))}
                          </div>
                        );
                      })
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
