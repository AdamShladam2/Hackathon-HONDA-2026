import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  FileText,
  Lock,
  Download,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';

export const ProjectDetailModal: React.FC = () => {
  const {
    selectedProjectId,
    setSelectedProjectId,
    projects,
    currentUser,
    currentSchool,
    submitJoinRequest,
    respondToJoinRequest,
    joinRequests,
    setActiveTab,
    setSelectedStudentId,
  } = useApp();

  const [activeTab, setModalTab] = useState<'overview' | 'document' | 'requests'>('overview');
  const [roleWanted, setRoleWanted] = useState('');
  const [joinMessage, setJoinMessage] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState('');

  const project = projects.find((p) => p.id === selectedProjectId);

  if (!project) return null;

  const isMember = project.members.some((m) => m.userId === currentUser?.id);
  const isOwner = project.ownerId === currentUser?.id;
  const isTeacher = currentUser?.role === 'teacher';

  const projectRequests = joinRequests.filter(
    (r) => r.projectId === project.id && r.status === 'pending'
  );

  const userExistingRequest = joinRequests.find(
    (r) => r.projectId === project.id && r.userId === currentUser?.id
  );

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleWanted && project.openRoles.length > 0) {
      setRoleWanted(project.openRoles[0]);
    }
    submitJoinRequest(
      project.id,
      roleWanted || (project.openRoles[0] || 'Contributor'),
      joinMessage || 'I would like to contribute my skills to this project team.'
    );
    setRequestSubmitted(true);
  };

  const handleDownloadDocument = () => {
    if (!isTeacher) return;
    setDownloadSuccessMessage(`Downloading "${project.document.fileName}"...`);
    setTimeout(() => {
      const blob = new Blob(
        [
          `PROJECT DOCUMENT: ${project.title}\nCourse: ${project.courseCode || 'N/A'}\nSchool: ${currentSchool?.name}\n\n${project.document.sections.map((s) => `== ${s.heading} ==\n${s.body}\n`).join('\n')}`,
        ],
        { type: 'text/plain;charset=utf-8' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = project.document.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadSuccessMessage(`Downloaded "${project.document.fileName}" successfully!`);
      setTimeout(() => setDownloadSuccessMessage(''), 4000);
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200/90 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            {project.type === 'class' ? (
              <span className="text-[10px] tracking-wider uppercase font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1 font-mono">
                <GraduationCap className="w-3 h-3 text-amber-700" />
                <span>{project.courseCode} · Class Project</span>
              </span>
            ) : (
              <span className="text-[10px] tracking-wider uppercase font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200 font-mono">
                Personal Venture
              </span>
            )}
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500 font-mono">{currentSchool?.name}</span>
          </div>

          <button
            onClick={() => setSelectedProjectId(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 pt-3 border-b border-slate-200 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalTab('overview')}
              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Overview & Team
            </button>
            <button
              onClick={() => setModalTab('document')}
              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'document'
                  ? 'border-indigo-600 text-indigo-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Project Document & Spec</span>
            </button>
            {(isOwner || isMember) && projectRequests.length > 0 && (
              <button
                onClick={() => setModalTab('requests')}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'requests'
                    ? 'border-indigo-600 text-indigo-900 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Join Requests</span>
                <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                  {projectRequests.length}
                </span>
              </button>
            )}
          </div>

          {project.type === 'class' && (
            <button
              onClick={() => {
                setSelectedProjectId(null);
                setActiveTab('classes');
              }}
              className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1 mb-2.5 cursor-pointer"
            >
              <span>View Full Version History & Grading</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Title and Tagline */}
              <div>
                <h2 id="project-modal-title" className="text-2xl font-bold text-slate-900">
                  {project.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  {project.tagline || project.description}
                </p>
              </div>

              {/* Tags & Skills needed */}
              <div className="space-y-2">
                <div className="text-[10px] tracking-wider uppercase font-bold text-slate-400">
                  Tags & Competencies
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.skillsNeeded.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-semibold"
                    >
                      Needed: {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Team Members List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] tracking-wider uppercase font-bold text-slate-400">
                    Project Team ({project.members.length})
                  </div>
                  {project.instructorName && (
                    <span className="text-xs text-slate-500">
                      Supervised by: <strong className="text-slate-800">{project.instructorName}</strong>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.members.map((member) => (
                    <div
                      key={member.userId}
                      onClick={() => {
                        setSelectedProjectId(null);
                        setSelectedStudentId(member.userId);
                        setActiveTab('profile');
                      }}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                          {member.avatarInitial}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {member.name}
                          </div>
                          <div className="text-[11px] text-slate-500">{member.role}</div>
                          <div className="text-[10px] text-slate-400">{member.major}</div>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Document Card Highlight */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>{project.document.fileName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200 font-mono">
                        {project.document.type === 'word' ? 'DOCX' : 'GDOC'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                      {project.document.wordCount.toLocaleString()} words · {project.document.pageCount} pages · Updated {project.document.lastModified}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setModalTab('document')}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Preview Document
                  </button>

                  {/* Teacher vs Student Download Permission */}
                  {isTeacher ? (
                    <button
                      onClick={handleDownloadDocument}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                      title="Teachers have authorized export permissions"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download File</span>
                    </button>
                  ) : (
                    <div
                      className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-200/70 px-2.5 py-1.5 rounded-lg select-none font-mono"
                      title="Document downloading is restricted to course instructors to preserve academic integrity. Students have view-only access."
                    >
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Download Locked (View Only)</span>
                    </div>
                  )}
                </div>
              </div>

              {downloadSuccessMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{downloadSuccessMessage}</span>
                </div>
              )}

              {/* Timeline of Updates */}
              {project.updates && project.updates.length > 0 && (
                <div className="space-y-3">
                  <div className="text-[10px] tracking-wider uppercase font-bold text-slate-400">
                    Milestones & Updates
                  </div>
                  <div className="space-y-2.5">
                    {project.updates.map((up) => (
                      <div key={up.id} className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs">
                        <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                          <span className="font-bold text-slate-800">{up.title}</span>
                          <span className="font-mono">{up.date} · by {up.authorName}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{up.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Request to Join Section */}
              {project.openToJoin && !isMember && (
                <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-3.5">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Interested in collaborating?
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      This project is actively recruiting teammates for: {project.openRoles.join(', ')}
                    </p>
                  </div>

                  {requestSubmitted || userExistingRequest ? (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <strong>Request Submitted!</strong> Your application is pending review by the project team.
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSendRequest} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] tracking-wider uppercase font-bold text-slate-600 mb-1">
                            Role you want to fill:
                          </label>
                          <select
                            value={roleWanted}
                            onChange={(e) => setRoleWanted(e.target.value)}
                            className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium"
                          >
                            {project.openRoles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                            <option value="General Contributor">General Contributor</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] tracking-wider uppercase font-bold text-slate-600 mb-1">
                            Short note to the team (skills, background, or goals):
                          </label>
                          <input
                            type="text"
                            value={joinMessage}
                            onChange={(e) => setJoinMessage(e.target.value)}
                            placeholder="e.g. I have experience in React and want to help build the transit routing algorithms..."
                            required
                            className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-800"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Join Request</span>
                      </button>
                    </form>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === 'document' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-slate-800">{project.document.fileName}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500 font-mono">{project.document.wordCount} words</span>
                </div>

                {isTeacher ? (
                  <button
                    onClick={handleDownloadDocument}
                    className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download (.docx)</span>
                  </button>
                ) : (
                  <div
                    className="flex items-center gap-1.5 text-slate-500 text-[11px] font-mono"
                    title="Student access is restricted to read-only preview mode to preserve document integrity."
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Download restricted to instructors</span>
                  </div>
                )}
              </div>

              <div className="border border-slate-200 rounded-2xl bg-white shadow-xs p-6 sm:p-10 space-y-6 font-serif">
                <div className="border-b border-slate-200 pb-4">
                  <div className="text-[10px] font-sans tracking-widest font-bold text-slate-400 uppercase">
                    {project.courseCode ? `${project.courseCode} Final Submission` : 'Project Working Draft'}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold font-sans text-slate-900 mt-1">
                    {project.title}
                  </h1>
                  <div className="text-xs font-sans text-slate-500 mt-2 flex flex-wrap gap-2 font-mono">
                    <span>Authors: {project.members.map((m) => m.name).join(', ')}</span>
                    <span>·</span>
                    <span>{currentSchool?.name}</span>
                  </div>
                </div>

                <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
                  {project.document.sections.map((sec, i) => (
                    <section key={i} className="space-y-2">
                      <h3 className="font-sans font-bold text-base text-slate-900">
                        {sec.heading}
                      </h3>
                      <p>{sec.body}</p>
                    </section>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-4 text-[11px] font-sans text-slate-400 flex items-center justify-between font-mono">
                  <span>Document ID: {project.document.id}</span>
                  <span>End of Preview · Read-Only Mode</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Pending Join Requests ({projectRequests.length})
              </h3>
              {projectRequests.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">
                  No pending join requests for this project.
                </p>
              ) : (
                <div className="space-y-3">
                  {projectRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 text-sm">{req.userName}</strong>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500">{req.userMajor}</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-indigo-600 font-bold font-mono">Wants: {req.roleWanted}</span>
                        </div>
                        <p className="text-slate-600 italic">"{req.message}"</p>
                        <div className="text-[10px] text-slate-400 font-mono">{req.createdAt}</div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => respondToJoinRequest(req.id, true)}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept to Team</span>
                        </button>
                        <button
                          onClick={() => respondToJoinRequest(req.id, false)}
                          className="px-3.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs hover:bg-rose-100 transition-all cursor-pointer active:scale-95"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
