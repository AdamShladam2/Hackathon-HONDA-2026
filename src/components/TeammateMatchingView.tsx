import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  X,
  Heart,
  MessageSquare,
  Sparkles,
  ExternalLink,
  BookOpen,
  Eye,
  Award,
  Layers,
  GraduationCap,
  Clock,
  Briefcase,
  RotateCcw,
  Star,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Author } from '../types';

export const TeammateMatchingView: React.FC = () => {
  const {
    currentUser,
    allDemoAccounts,
    pastWorkRecords,
    openPortfolio,
    openMessageModal,
    openRateTeammateModal,
    getUserRatingSummaryData,
    showToast,
    canvasConnection,
    openCanvasModal,
    allCanvasClassmates,
    setActiveView,
  } = useApp();

  // Filter candidate profiles: exclude current user and teachers
  const candidates = allDemoAccounts.filter(
    (a) => a.id !== currentUser.id && !a.identities.includes('Teacher / Professor')
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedDirections, setSwipedDirections] = useState<Record<string, 'left' | 'right'>>({});
  const [filterRole, setFilterRole] = useState<'all' | 'students' | 'professionals' | 'canvas'>('all');

  const filteredCandidates = candidates.filter((c) => {
    if (filterRole === 'canvas') {
      const isClassmate = allCanvasClassmates.some(
        (cm) => cm.associatedDemoAccountId === c.id || cm.name.toLowerCase() === c.name.toLowerCase()
      );
      const isSameSchool = Boolean(c.school && canvasConnection.isConnected && c.school.toLowerCase() === canvasConnection.institutionName.toLowerCase());
      return isClassmate || isSameSchool;
    }
    if (filterRole === 'students') return c.identities.includes('Student');
    if (filterRole === 'professionals') return c.identities.includes('Working professional') || c.identities.includes('Independent creator / developer');
    return true;
  });

  const currentCandidate: Author | undefined = filteredCandidates[currentIndex];

  const getSharedCanvasCourses = (candidate?: Author): string[] => {
    if (!candidate || !canvasConnection.isConnected) return [];
    const matched = allCanvasClassmates.filter(
      (cm) => cm.associatedDemoAccountId === candidate.id || cm.name.toLowerCase() === candidate.name.toLowerCase()
    );
    return Array.from(new Set(matched.map((cm) => cm.courseCode)));
  };

  const sharedCourses = getSharedCanvasCourses(currentCandidate);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentCandidate) return;

    setSwipedDirections((prev) => ({ ...prev, [currentCandidate.id]: direction }));

    if (direction === 'right') {
      showToast(`Invited ${currentCandidate.name} to connect & collaborate!`, 'success');
    } else {
      showToast(`Passed on ${currentCandidate.name}`, 'info');
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSwipedDirections({});
  };

  // Helper for compatibility calculation
  const calculateMatch = (candidate: Author) => {
    const mySkills = currentUser.skills || [];
    const theirSkills = candidate.skills || [];
    const shared = mySkills.filter((s) => theirSkills.some((ts) => ts.toLowerCase() === s.toLowerCase()));
    const complementary = theirSkills.filter((s) => !mySkills.some((ms) => ms.toLowerCase() === s.toLowerCase())).slice(0, 3);

    // Beginner boost: give junior students high growth affinity
    const isJunior = candidate.graduationYear === "'28" || (candidate.yearsOfExperience !== undefined && candidate.yearsOfExperience <= 1);
    const score = Math.min(98, 60 + shared.length * 10 + (isJunior ? 15 : 10));

    return {
      score,
      shared,
      complementary,
      isJunior,
    };
  };

  const matchData = currentCandidate ? calculateMatch(currentCandidate) : null;
  const candidateRecords = currentCandidate ? pastWorkRecords[currentCandidate.id] || [] : [];
  const confirmedCount = candidateRecords.reduce((acc, r) => acc + (r.reviewerConfirmedCount || 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            Swipe-Based Teammate & Collaborator Discovery
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Find Teammates with Verified Evidence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Discover peers for coursework or independent builds. Review individual contribution statements and instructor-confirmed badges before teaming up.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => {
              setFilterRole('all');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filterRole === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            All Candidates
          </button>
          <button
            onClick={() => {
              setFilterRole('students');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filterRole === 'students'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Students
          </button>
          <button
            onClick={() => {
              setFilterRole('professionals');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filterRole === 'professionals'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Professionals
          </button>
          <button
            onClick={() => {
              if (!canvasConnection.isConnected) {
                openCanvasModal();
              } else {
                setFilterRole('canvas');
                setCurrentIndex(0);
              }
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              filterRole === 'canvas'
                ? 'bg-red-600 text-white shadow-sm font-bold'
                : 'text-red-700 hover:text-red-900 bg-red-50/70'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Canvas Classmates</span>
          </button>
        </div>
      </div>

      {/* Main Card Viewport */}
      {currentCandidate && matchData ? (
        <div className="bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden relative">
          {/* Top Banner with Match Score */}
          <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xl border border-white/30">
                {matchData.score}%
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-blue-100">
                  Compatibility Rating
                </span>
                <h3 className="font-bold text-sm">
                  {matchData.score > 85 ? 'High Synergy Match' : 'Complementary Strengths'}
                </h3>
              </div>
            </div>

            {matchData.isJunior && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-100 border border-emerald-300/40 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                High Growth Potential • Eager Teammate
              </span>
            )}
          </div>

          {/* Profile Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <img
                  src={currentCandidate.avatar}
                  alt={currentCandidate.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-100 dark:ring-slate-700 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                      {currentCandidate.name}
                    </h2>
                    {currentCandidate.school && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {currentCandidate.school}
                      </span>
                    )}
                    {currentCandidate.organization && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                        {currentCandidate.organization}
                      </span>
                    )}
                    {sharedCourses.length > 0 && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-red-600" />
                        <span>Canvas Classmate in {sharedCourses.join(', ')}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">
                    {currentCandidate.major || currentCandidate.jobTitle}
                    {currentCandidate.graduationYear && ` • Class of ${currentCandidate.graduationYear}`}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="text-slate-400">
                      Availability: <strong className="text-slate-700 dark:text-slate-200">{currentCandidate.availability || '10-15 hrs/wk'}</strong>
                    </span>
                    <span>•</span>
                    <span className="text-slate-400">
                      Mode: <strong className="text-slate-700 dark:text-slate-200">{currentCandidate.collaborationPreferences || 'Hybrid / Remote'}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Reviewer Confirmed Deliverables & Peer Ratings Badges */}
              <div className="flex items-center gap-2.5">
                {/* Peer Rating Badge */}
                {(() => {
                  const ratingSummary = getUserRatingSummaryData(currentCandidate.id);
                  return ratingSummary.reviewCount > 0 ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center flex flex-col items-center min-w-[110px]">
                      <div className="flex items-center gap-1 text-amber-800 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>Rating</span>
                      </div>
                      <span className="text-lg font-black text-amber-700 mt-0.5">
                        {ratingSummary.averageScore} / 5
                      </span>
                      <span className="text-[10px] text-amber-600 font-medium">
                        {ratingSummary.reviewCount} reviews
                      </span>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center flex flex-col items-center justify-center min-w-[110px]">
                      <span className="text-xs font-bold text-slate-600 italic">New contributor</span>
                      <span className="text-[10px] text-slate-400">0 peer reviews</span>
                    </div>
                  );
                })()}

                {/* Reviewer Confirmed Deliverables Badge */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center flex flex-col items-center min-w-[110px]">
                  <div className="flex items-center gap-1 text-emerald-800 font-bold text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified</span>
                  </div>
                  <span className="text-lg font-black text-emerald-700 mt-0.5">
                    {confirmedCount}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    Instructor Confirmed
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              "{currentCandidate.bio}"
            </p>

            {/* Canvas Course Quick Link Banner */}
            <div className="p-3.5 rounded-2xl bg-red-50/70 border border-red-200/80 flex items-center justify-between gap-3 text-xs flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-600 text-white shadow-xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-red-900 block">
                    {canvasConnection.isConnected
                      ? `${canvasConnection.institutionName} Canvas (${canvasConnection.courses.length} Enrolled Classes)`
                      : 'Connect Canvas LMS with your School Email'}
                  </span>
                  <span className="text-slate-600 text-[11px]">
                    Access people from your course sections looking for project teammates.
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (canvasConnection.isConnected) {
                    setActiveView('canvas-classes');
                  } else {
                    openCanvasModal();
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
              >
                <span>{canvasConnection.isConnected ? 'Browse Class Roster' : 'Connect School Email'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Past Work Preview & Open Portfolio Button (Key Requirement) */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Contribution Portfolio & Verified Coursework ({candidateRecords.length} Projects)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Inspect individual contributions, Google Docs specs, and instructor-stamped reviews.
                  </p>
                </div>
              </div>

              <button
                onClick={() => openPortfolio(currentCandidate)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02]"
              >
                <Eye className="w-4 h-4" />
                View Past Work & Deliverables
              </button>
            </div>

            {/* Compatibility Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] block mb-2">
                  Shared Skill Synergy ({matchData.shared.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matchData.shared.length > 0 ? (
                    matchData.shared.map((s, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold"
                      >
                        ✓ {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">Complementary skill sets</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] block mb-2">
                  Complementary Competencies Added
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matchData.complementary.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-semibold"
                    >
                      + {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar (Swipe Buttons) */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-6">
              <button
                onClick={() => handleSwipe('left')}
                className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/60 border-2 border-slate-200 dark:border-slate-600 hover:border-rose-300 text-slate-500 hover:text-rose-500 flex items-center justify-center transition-all hover:scale-110 shadow-md"
                title="Pass (Swipe Left)"
              >
                <X className="w-6 h-6" />
              </button>

              <button
                onClick={() => openMessageModal(currentCandidate)}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message</span>
              </button>

              <button
                onClick={() => openRateTeammateModal(currentCandidate)}
                className="px-4 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Submit peer rating for this collaborator"
              >
                <Star className="w-4 h-4 text-amber-600 fill-amber-400" />
                <span>Rate</span>
              </button>

              <button
                onClick={() => handleSwipe('right')}
                className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-emerald-500/30"
                title="Connect & Invite (Swipe Right)"
              >
                <Heart className="w-6 h-6 fill-white" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-12 text-center space-y-4 shadow-sm">
          <Sparkles className="w-12 h-12 text-blue-500 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            You've viewed all candidates in this category!
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            You can reset the deck to review candidates again, or browse the Campus Hub and Work Hub member directories.
          </p>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Matching Deck
          </button>
        </div>
      )}
    </div>
  );
};
