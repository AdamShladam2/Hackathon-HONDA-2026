import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { canEndorseStudent, rankTeammateSuggestions } from '../utils/teammateSuggestions';
import { Endorsement } from '../types';
import {
  Award,
  Heart,
  Briefcase,
  Users,
  Search,
  CheckCircle2,
  Lock,
  Plus,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Star,
  GraduationCap,
  ShieldCheck,
  Github,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    currentSchool,
    users,
    projects,
    endorsements,
    selectedStudentId,
    setSelectedStudentId,
    setSelectedProjectId,
    addEndorsement,
    voteWorkWithAgain,
    setIsFindTeammatesOpen,
    connectGitHub,
    disconnectGitHub,
  } = useApp();

  const schoolStudents = useMemo(() => {
    if (!currentUser) return [];
    return users.filter(
      (u) => u.schoolId === currentUser.schoolId && u.role === 'student'
    );
  }, [users, currentUser]);

  const targetStudentId = selectedStudentId || (currentUser?.role === 'student' ? currentUser.id : schoolStudents[0]?.id);
  const targetStudent = schoolStudents.find((s) => s.id === targetStudentId) || schoolStudents[0];

  const studentProjects = useMemo(() => {
    if (!targetStudent) return [];
    return projects.filter(
      (p) =>
        p.schoolId === targetStudent.schoolId &&
        p.members.some((m) => m.userId === targetStudent.id)
    );
  }, [projects, targetStudent]);

  const studentEndorsements = useMemo(() => {
    if (!targetStudent) return [];
    return endorsements.filter((e) => e.studentId === targetStudent.id);
  }, [endorsements, targetStudent]);

  const sharedProjects = useMemo(() => {
    if (!currentUser || !targetStudent) return [];
    return projects.filter(
      (p) =>
        p.members.some((m) => m.userId === currentUser.id) &&
        p.members.some((m) => m.userId === targetStudent.id)
    );
  }, [projects, currentUser, targetStudent]);

  const endorsementEligibility = useMemo(() => {
    if (!currentUser || !targetStudent) return { eligible: false };
    return canEndorseStudent(currentUser.id, targetStudent.id, projects);
  }, [currentUser, targetStudent, projects]);

  const [isEndorsing, setIsEndorsing] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Endorsement['badge']>('Reliable');
  const [selectedProjectForEndorse, setSelectedProjectForEndorse] = useState<string>(
    sharedProjects[0]?.id || ''
  );
  const [endorseNote, setEndorseNote] = useState('');
  const [endorseSuccess, setEndorseSuccess] = useState(false);
  const [workWithAgainVoted, setWorkWithAgainVoted] = useState(false);
  const [ghUsernameInput, setGhUsernameInput] = useState('');
  const [isConnectingGH, setIsConnectingGH] = useState(false);
  const [ghMessage, setGhMessage] = useState<string | null>(null);

  const handleConnectGHSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ghUsernameInput.trim()) return;
    setIsConnectingGH(true);
    setGhMessage(null);
    const res = await connectGitHub(ghUsernameInput.trim());
    setIsConnectingGH(false);
    if (res.success) {
      setGhMessage(`Connected! Fetched ${res.reposCount} public repos.`);
      setGhUsernameInput('');
    } else {
      setGhMessage(res.message || 'Failed to connect.');
    }
  };

  React.useEffect(() => {
    if (sharedProjects.length > 0 && !selectedProjectForEndorse) {
      setSelectedProjectForEndorse(sharedProjects[0].id);
    }
  }, [sharedProjects]);

  const handleEndorseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStudent || !selectedProjectForEndorse || !endorseNote.trim()) return;

    addEndorsement(
      targetStudent.id,
      selectedProjectForEndorse,
      selectedBadge,
      endorseNote.trim()
    );

    setIsEndorsing(false);
    setEndorseNote('');
    setEndorseSuccess(true);
    setTimeout(() => setEndorseSuccess(false), 4000);
  };

  const handleWorkWithAgainVote = () => {
    if (!targetStudent) return;
    voteWorkWithAgain(targetStudent.id);
    setWorkWithAgainVoted(true);
  };

  const isSelf = currentUser?.id === targetStudent?.id;

  if (!targetStudent) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 text-center">
        <p className="text-sm text-slate-500">No student profile selected.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Header & Student Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200/90">
        <div>
          <div className="text-[10px] tracking-wider uppercase font-bold text-indigo-700 mb-1">
            Student Profiles & Endorsement Ledger · {currentSchool?.name}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {isSelf ? 'My Track Record & Endorsements' : `${targetStudent.name}'s Track Record`}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400">Select Peer:</span>
            <select
              value={targetStudent.id}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 shadow-2xs focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {schoolStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.major?.split(' ')[0] || 'Student'})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsFindTeammatesOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>AI Teammate Matcher</span>
          </button>
        </div>
      </div>

      {endorseSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Teammate endorsement published to {targetStudent.name}'s verified profile!</span>
        </div>
      )}

      {/* Profile Card & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Student Bio & Skills */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-950 font-bold text-2xl flex items-center justify-center border-2 border-amber-300 shadow-2xs">
                {targetStudent.avatarInitial}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{targetStudent.name}</h2>
                  <span className="text-[10px] tracking-wider uppercase font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                    <GraduationCap className="w-3 h-3 text-amber-700" />
                    <span>Student</span>
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  {targetStudent.major} · {targetStudent.year}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {targetStudent.email}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
              {targetStudent.bio}
            </p>

            {/* Skills */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-[10px] tracking-wider uppercase font-bold text-slate-400">
                Demonstrated Competencies
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {targetStudent.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-semibold text-[11px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* "Want to work with again" counter & button */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-amber-600 fill-amber-600" />
                  <span>Teammate Collaboration Signal</span>
                </span>
                <span className="font-mono font-bold text-sm text-amber-800">
                  {targetStudent.workWithAgainCount} votes
                </span>
              </div>
              <p className="text-[11px] text-amber-900 leading-tight">
                {targetStudent.workWithAgainCount} past teammates indicated they would eagerly work with {targetStudent.name} on future projects.
              </p>

              {!isSelf && (
                <div className="pt-1">
                  {endorsementEligibility.eligible ? (
                    <button
                      onClick={handleWorkWithAgainVote}
                      disabled={workWithAgainVoted}
                      className={`w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 ${
                        workWithAgainVoted
                          ? 'bg-amber-200 text-amber-900 cursor-default'
                          : 'bg-amber-600 hover:bg-amber-700 text-white'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>{workWithAgainVoted ? 'Voted: Want to work with again!' : 'Want to work with again (+1)'}</span>
                    </button>
                  ) : (
                    <div
                      className="text-[10px] text-slate-400 italic text-center py-1 font-mono"
                      title="Only past teammates who shared a project can vote"
                    >
                      (Restricted to teammates on completed projects)
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* GitHub Connection Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Github className="w-4 h-4 text-slate-800" />
                <span>GitHub Integration</span>
              </span>
              {targetStudent.githubConnected ? (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Connected
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  Not Linked
                </span>
              )}
            </div>

            {targetStudent.githubConnected ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-800">
                    @{targetStudent.githubUsername || 'marcusvance-dev'}
                  </span>
                  {isSelf && (
                    <button
                      onClick={disconnectGitHub}
                      className="text-[11px] text-slate-400 hover:text-rose-600 font-semibold"
                    >
                      Disconnect
                    </button>
                  )}
                </div>

                {/* Top Public Repos */}
                {targetStudent.githubRepos && targetStudent.githubRepos.length > 0 ? (
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                      Top Public Repositories:
                    </span>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {targetStudent.githubRepos.map((repo) => (
                        <a
                          key={repo.id}
                          href={repo.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="block p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400/80 bg-slate-50/50 hover:bg-white transition-all space-y-1 group"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-xs font-bold text-slate-800 group-hover:text-indigo-600 truncate">
                              {repo.name}
                            </span>
                            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                          </div>
                          {repo.description && (
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {repo.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 pt-0.5">
                            {repo.language && (
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                {repo.language}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              {repo.stargazers_count}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No public repositories found.</p>
                )}
              </div>
            ) : isSelf ? (
              <form onSubmit={handleConnectGHSubmit} className="space-y-3 pt-1">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Connect your GitHub username to show your public repositories, verify code contributions, and link repositories in one click.
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. marcusvance-dev"
                      value={ghUsernameInput}
                      onChange={(e) => setGhUsernameInput(e.target.value)}
                      className="flex-1 text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={isConnectingGH}
                      className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shrink-0 shadow-xs"
                    >
                      {isConnectingGH ? 'Connecting...' : 'Connect'}
                    </button>
                  </div>
                  {ghMessage && (
                    <p className="text-[11px] text-emerald-700 font-semibold">{ghMessage}</p>
                  )}
                </div>
              </form>
            ) : (
              <p className="text-xs text-slate-400 italic">
                {targetStudent.name} hasn't linked a public GitHub account yet.
              </p>
            )}
          </div>
        </div>


        {/* Right Column: Past Projects & Teammate Endorsements */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: Teammate Endorsements */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <span>Teammate Endorsements ({studentEndorsements.length})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Peer testimonials based on real contributions and project milestones.
                </p>
              </div>

              {!isSelf && (
                <div>
                  {endorsementEligibility.eligible ? (
                    <button
                      onClick={() => setIsEndorsing(!isEndorsing)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Leave Endorsement</span>
                    </button>
                  ) : (
                    <div
                      className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1.5 rounded-lg select-none cursor-help font-mono"
                      title={endorsementEligibility.reason}
                    >
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>Shared Project Required</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Endorsement Form if active */}
            {isEndorsing && (
              <form
                onSubmit={handleEndorseSubmit}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3 text-xs animate-in fade-in"
              >
                <div className="font-bold text-slate-900 text-xs">
                  Endorse {targetStudent.name} as a Teammate
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] tracking-wider uppercase font-bold text-slate-500 mb-1">
                      Project where you collaborated:
                    </label>
                    <select
                      value={selectedProjectForEndorse}
                      onChange={(e) => setSelectedProjectForEndorse(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-medium"
                      required
                    >
                      {sharedProjects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-wider uppercase font-bold text-slate-500 mb-1">
                      Select Badge / Superpower:
                    </label>
                    <select
                      value={selectedBadge}
                      onChange={(e) => setSelectedBadge(e.target.value as any)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-medium"
                    >
                      <option value="Reliable">Reliable</option>
                      <option value="Great at debugging">Great at debugging</option>
                      <option value="Fast prototyper">Fast prototyper</option>
                      <option value="Clear communicator">Clear communicator</option>
                      <option value="Creative designer">Creative designer</option>
                      <option value="Strong leadership">Strong leadership</option>
                      <option value="Algorithmic rigor">Algorithmic rigor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-wider uppercase font-bold text-slate-500 mb-1">
                    Specific note on their work and conduct:
                  </label>
                  <textarea
                    rows={2}
                    value={endorseNote}
                    onChange={(e) => setEndorseNote(e.target.value)}
                    placeholder="e.g. Fixed our race condition under pressure and kept the team organized throughout sprint checks."
                    required
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEndorsing(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-2xs active:scale-95"
                  >
                    Publish Endorsement
                  </button>
                </div>
              </form>
            )}

            {/* List of Endorsements */}
            {studentEndorsements.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center italic">
                No teammate endorsements recorded yet.
              </p>
            ) : (
              <div className="space-y-3">
                {studentEndorsements.map((end) => (
                  <div
                    key={end.id}
                    className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-indigo-900 bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded text-[11px] flex items-center gap-1 font-mono">
                          <Star className="w-3 h-3 fill-indigo-600 text-indigo-600" />
                          <span>{end.badge}</span>
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="font-bold text-slate-800">{end.projectName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{end.createdAt}</span>
                    </div>

                    <p className="text-slate-700 italic text-[11px] leading-relaxed">"{end.note}"</p>

                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/50 flex items-center justify-between">
                      <span>Endorsed by: <strong className="text-slate-800">{end.authorName}</strong> ({end.authorRole})</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Project Track Record */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-slate-700" />
              <span>Project Track Record ({studentProjects.length})</span>
            </h3>

            <div className="space-y-3">
              {studentProjects.map((p) => {
                const memberRecord = p.members.find((m) => m.userId === targetStudent.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProjectId(p.id)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        {p.type === 'class' ? (
                          <span className="text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-mono">
                            {p.courseCode} · Class Project
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded font-mono">
                            Personal Venture
                          </span>
                        )}
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-600 font-semibold">{memberRecord?.role}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {p.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{p.tagline}</p>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 shrink-0">
                      <span>View Project</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
