import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { rankTeammateSuggestions } from '../utils/teammateSuggestions';
import {
  X,
  Sparkles,
  Users,
  Award,
  Heart,
  Check,
  Plus,
  ArrowRight,
  UserCheck,
  ShieldCheck,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';

interface FindTeammatesModalProps {
  onInvite?: (studentId: string) => void;
}

export const FindTeammatesModal: React.FC<FindTeammatesModalProps> = ({ onInvite }) => {
  const {
    isFindTeammatesOpen,
    setIsFindTeammatesOpen,
    users,
    endorsements,
    currentUser,
    currentSchool,
    setSelectedStudentId,
    setActiveTab,
  } = useApp();

  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'TypeScript', 'Circuit Design']);
  const [invitedStudents, setInvitedStudents] = useState<Record<string, boolean>>({});
  const [activeCandidateId, setActiveCandidateId] = useState<string | null>(null);

  const schoolStudents = useMemo(() => {
    if (!currentUser) return [];
    return users.filter(
      (u) => u.schoolId === currentUser.schoolId && u.role === 'student'
    );
  }, [users, currentUser]);

  const commonSkills = [
    'React',
    'TypeScript',
    'Python',
    'Figma',
    'UI/UX Design',
    'Circuit Design',
    'Microcontrollers',
    'Financial Modeling',
    'Bio-informatics',
    'Product Marketing',
    'CAD',
    'Algorithms',
  ];

  const suggestions = useMemo(() => {
    return rankTeammateSuggestions(
      schoolStudents,
      selectedSkills,
      currentUser?.id || '',
      endorsements
    );
  }, [schoolStudents, selectedSkills, currentUser, endorsements]);

  // Set default selected candidate for 2-column view
  const currentCandidate = useMemo(() => {
    if (activeCandidateId) {
      return suggestions.find((s) => s.student.id === activeCandidateId) || suggestions[0];
    }
    return suggestions[0];
  }, [suggestions, activeCandidateId]);

  if (!isFindTeammatesOpen) return null;

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleInvite = (studentId: string) => {
    setInvitedStudents((prev) => ({ ...prev, [studentId]: true }));
    if (onInvite) onInvite(studentId);
  };

  // Complementary skill cross-match (highlight skills candidate possesses that currentUser lacks)
  const currentUserSkillsSet = new Set((currentUser?.skills || []).map((s) => s.toLowerCase()));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="find-teammates-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Soft Violet AI Intelligence styling */}
        <div className="px-6 py-4 border-b border-slate-200/90 flex items-center justify-between bg-gradient-to-r from-violet-50 via-indigo-50/50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="find-teammates-title" className="text-base font-bold text-slate-900">
                  AI Teammate Cross-Matcher
                </h2>
                <span className="text-[10px] tracking-wider uppercase font-bold font-mono px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200">
                  Assistive Engine
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {currentSchool?.name} · {suggestions.length} candidates evaluated
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsFindTeammatesOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Skill Filter Chips Bar */}
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 space-y-2 text-xs">
          <div className="text-[10px] tracking-wider uppercase font-bold text-slate-500">
            Target Team Competencies:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {commonSkills.map((skill) => {
              const active = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    active
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {active && <Check className="w-3 h-3" />}
                  <span>{skill}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Two-Column Discovery Layout: Candidates List on Left, Complementary Skill Cross-Match & Bio on Right */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-0">
          {/* Left Column: Ranked Candidates List */}
          <div className="md:col-span-5 border-r border-slate-200 overflow-y-auto p-4 space-y-2.5 bg-slate-50/40">
            <div className="text-[10px] tracking-wider uppercase font-bold text-slate-400 px-1 mb-1">
              Ranked Teammate Pool
            </div>

            {suggestions.map((item) => {
              const { student, score, matchedSkills, workWithAgainCount } = item;
              const isSelected = currentCandidate?.student.id === student.id;
              const isInvited = invitedStudents[student.id];

              return (
                <div
                  key={student.id}
                  onClick={() => setActiveCandidateId(student.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-white border-indigo-400 shadow-md ring-2 ring-indigo-500/10'
                      : 'bg-white border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-950 font-bold text-xs flex items-center justify-center border border-amber-300">
                        {student.avatarInitial}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{student.name}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                          {student.major?.split(' ')[0]} · {student.year}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200">
                        {Math.min(99, 65 + score)}% MATCH
                      </span>
                    </div>
                  </div>

                  {/* Skills Mini-Tags */}
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {student.skills.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className={`px-1.5 py-0.2 rounded ${
                          matchedSkills.includes(s)
                            ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {s}
                      </span>
                    ))}
                    {student.skills.length > 3 && (
                      <span className="text-[9px] text-slate-400 font-mono">+{student.skills.length - 3}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Deep Complementary Skill Cross-Match & Direct Action Card */}
          <div className="md:col-span-7 overflow-y-auto p-6 space-y-6 bg-white">
            {currentCandidate && (
              <>
                {/* Candidate Overview Header */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-bold text-xl flex items-center justify-center shadow-xs">
                      {currentCandidate.student.avatarInitial}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">
                          {currentCandidate.student.name}
                        </h3>
                        <span className="text-[10px] tracking-wider uppercase font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                          <GraduationCap className="w-3 h-3 text-amber-700" />
                          <span>Student</span>
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        {currentCandidate.student.major} · {currentCandidate.student.year}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {currentCandidate.student.email}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-violet-800 bg-violet-50 px-2.5 py-1 rounded-lg border border-violet-200">
                      Score: {currentCandidate.score} pts
                    </span>
                  </div>
                </div>

                {/* Complementary Skill Cross-Matching Panel */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 via-emerald-50/20 to-indigo-50/20 border border-slate-200/90 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-wider uppercase font-bold text-slate-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Complementary Skill Cross-Match</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold">
                      Gaps Covered by {currentCandidate.student.name}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Green highlighted competencies represent capabilities {currentCandidate.student.name} brings that cover complementary gaps in your current skillset:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {currentCandidate.student.skills.map((skill) => {
                      const userAlreadyHas = currentUserSkillsSet.has(skill.toLowerCase());
                      const isComplementary = !userAlreadyHas;

                      return (
                        <div
                          key={skill}
                          className={`p-2 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                            isComplementary
                              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 font-bold'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            {isComplementary ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            )}
                            <span>{skill}</span>
                          </div>
                          <span className="text-[9px] font-mono opacity-75">
                            {isComplementary ? '+ COVERS GAP' : 'SHARED'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Transparent Suggestion Rationale */}
                <div className="space-y-2">
                  <div className="text-[10px] tracking-wider uppercase font-bold text-slate-400">
                    Why the algorithm suggested this student:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    {currentCandidate.reasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Teammate Endorsements Preview */}
                {currentCandidate.endorsements.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] tracking-wider uppercase font-bold text-slate-400">
                      Verified Peer Endorsements ({currentCandidate.endorsements.length})
                    </div>
                    <div className="space-y-2">
                      {currentCandidate.endorsements.map((end) => (
                        <div
                          key={end.id}
                          className="p-3 rounded-xl border border-slate-200 bg-white text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-[10px]">
                              ★ {end.badge}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{end.projectName}</span>
                          </div>
                          <p className="text-slate-600 italic text-[11px]">"{end.note}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Action Card Toolbar */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setIsFindTeammatesOpen(false);
                      setSelectedStudentId(currentCandidate.student.id);
                      setActiveTab('profile');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>View Full Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleInvite(currentCandidate.student.id)}
                    disabled={invitedStudents[currentCandidate.student.id]}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 ${
                      invitedStudents[currentCandidate.student.id]
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {invitedStudents[currentCandidate.student.id] ? (
                      <>
                        <UserCheck className="w-4 h-4 text-emerald-700" />
                        <span>Invitation Dispatched!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Invite to Active Project</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
