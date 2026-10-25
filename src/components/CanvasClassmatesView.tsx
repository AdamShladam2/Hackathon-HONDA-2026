import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Mail,
  Copy,
  MessageSquare,
  UserPlus,
  Eye,
  Star,
  ExternalLink,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Building,
  RefreshCw,
  FolderKanban,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CanvasClassmate, CanvasCourse } from '../types';

export const CanvasClassmatesView: React.FC = () => {
  const {
    canvasConnection,
    openCanvasModal,
    openMessageModal,
    openClassInvite,
    openPortfolio,
    allDemoAccounts,
    projects,
    showToast,
  } = useApp();

  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'looking' | 'students' | 'instructors'>('looking');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const courses: CanvasCourse[] = canvasConnection.courses || [];

  // Filter classmates based on course, search query, and filter tab
  const activeCourse = courses.find((c) => c.id === selectedCourseId);

  const rawClassmates: CanvasClassmate[] = selectedCourseId === 'all'
    ? courses.flatMap((c) => c.classmates)
    : activeCourse?.classmates || [];

  // Deduplicate if showing all courses
  const uniqueClassmatesMap = new Map<string, CanvasClassmate>();
  rawClassmates.forEach((cm) => {
    if (!uniqueClassmatesMap.has(cm.email)) {
      uniqueClassmatesMap.set(cm.email, cm);
    }
  });
  const uniqueClassmates = Array.from(uniqueClassmatesMap.values());

  const filteredClassmates = uniqueClassmates.filter((cm) => {
    // Tab filter
    if (filterType === 'looking' && !cm.lookingForTeam) return false;
    if (filterType === 'students' && cm.role !== 'Student') return false;
    if (filterType === 'instructors' && cm.role === 'Student') return false;

    // Search query filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchName = cm.name.toLowerCase().includes(q);
    const matchEmail = cm.email.toLowerCase().includes(q);
    const matchSkill = cm.skills.some((s) => s.toLowerCase().includes(q));
    const matchPitch = cm.teammatePitch?.toLowerCase().includes(q) || false;
    const matchCourse = cm.courseCode.toLowerCase().includes(q) || cm.courseName.toLowerCase().includes(q);
    const matchMajor = cm.major.toLowerCase().includes(q);

    return matchName || matchEmail || matchSkill || matchPitch || matchCourse || matchMajor;
  });

  const totalLookingCount = uniqueClassmates.filter((c) => c.lookingForTeam).length;

  const handleCopyEmail = (email: string) => {
    navigator.clipboard?.writeText(email);
    setCopiedEmail(email);
    showToast(`Copied ${email} to clipboard!`, 'info');
    setTimeout(() => setCopiedEmail(null), 2500);
  };

  const handleInviteToProject = (classmate: CanvasClassmate) => {
    // Find matching demo account or create temporary author object for collaboration modal
    const matchedAccount = allDemoAccounts.find(
      (a) => a.id === classmate.associatedDemoAccountId || a.name.toLowerCase() === classmate.name.toLowerCase()
    );

    const authorTarget = matchedAccount || {
      id: classmate.id,
      name: classmate.name,
      avatar: classmate.avatar,
      bio: classmate.teammatePitch || `${classmate.major} student in ${classmate.courseCode}.`,
      identities: ['Student' as const],
      school: canvasConnection.institutionName,
      major: classmate.major,
      graduationYear: classmate.graduationYear,
      skills: classmate.skills,
      githubConnected: classmate.githubConnected || false,
      githubUsername: classmate.githubUsername,
    };

    openClassInvite(authorTarget, classmate.courseCode);
  };

  const handleMessageClassmate = (classmate: CanvasClassmate) => {
    const matchedAccount = allDemoAccounts.find(
      (a) => a.id === classmate.associatedDemoAccountId || a.name.toLowerCase() === classmate.name.toLowerCase()
    );

    const authorTarget = matchedAccount || {
      id: classmate.id,
      name: classmate.name,
      avatar: classmate.avatar,
      bio: classmate.teammatePitch || `${classmate.major} student in ${classmate.courseCode}.`,
      identities: [classmate.role === 'Instructor' ? 'Teacher / Professor' as const : 'Student' as const],
      school: canvasConnection.institutionName,
      major: classmate.major,
      graduationYear: classmate.graduationYear,
      skills: classmate.skills,
      githubConnected: classmate.githubConnected || false,
    };

    openMessageModal(authorTarget);
  };

  const handleViewPortfolio = (classmate: CanvasClassmate) => {
    const matchedAccount = allDemoAccounts.find(
      (a) => a.id === classmate.associatedDemoAccountId || a.name.toLowerCase() === classmate.name.toLowerCase()
    );

    if (matchedAccount) {
      openPortfolio(matchedAccount);
    } else {
      // Build lightweight preview author
      openPortfolio({
        id: classmate.id,
        name: classmate.name,
        avatar: classmate.avatar,
        bio: `${classmate.major} student enrolled in ${classmate.courseCode}.`,
        identities: ['Student'],
        school: canvasConnection.institutionName,
        major: classmate.major,
        graduationYear: classmate.graduationYear,
        skills: classmate.skills,
        githubConnected: classmate.githubConnected || false,
      });
    }
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-red-500/10 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-300 text-xs font-semibold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5 text-red-400" />
              <span>Canvas LMS Class Roster & Team Matching</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Connect With People In Your Classes
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Find partners for term projects, form homework study groups, and connect with peers from your enrolled course sections using your verified school email.
            </p>
          </div>

          {/* Connection Status & Action */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-xs uppercase tracking-wider text-emerald-300">
                  {canvasConnection.isConnected ? 'Canvas Active' : 'Not Connected'}
                </span>
              </div>
              <p className="text-sm font-extrabold text-white mt-0.5">
                {canvasConnection.isConnected ? canvasConnection.institutionName : 'Connect University Email'}
              </p>
              <p className="text-[11px] text-slate-300">
                {canvasConnection.isConnected ? canvasConnection.schoolEmail : 'Requires student .edu account'}
              </p>
            </div>

            <button
              onClick={openCanvasModal}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition-all hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{canvasConnection.isConnected ? 'Manage Canvas' : 'Connect School Email'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        {canvasConnection.isConnected && (
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] uppercase font-semibold">Enrolled Classes</span>
              <p className="text-lg font-black text-white mt-0.5">{courses.length} Courses</p>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] uppercase font-semibold">Classmates Roster</span>
              <p className="text-lg font-black text-white mt-0.5">{uniqueClassmates.length} Peers</p>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] uppercase font-semibold">Looking for Teammates</span>
              <p className="text-lg font-black text-amber-300 mt-0.5">{totalLookingCount} Students</p>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] uppercase font-semibold">Verified School Email</span>
              <p className="text-lg font-black text-emerald-300 mt-0.5">@{canvasConnection.schoolEmail.split('@')[1] || 'edu'}</p>
            </div>
          </div>
        )}
      </div>

      {/* If Not Connected Notice */}
      {!canvasConnection.isConnected && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 text-center space-y-4">
          <GraduationCap className="w-12 h-12 text-red-600 mx-auto" />
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-extrabold text-slate-900">
              Connect your School Email to access your classes
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Link your university Canvas portal with your school email (.edu) to automatically load your class roster, see which classmates need team partners, and invite them to collaborate on projects.
            </p>
          </div>
          <button
            onClick={openCanvasModal}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all hover:scale-[1.02] inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Connect Canvas via School Email</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {canvasConnection.isConnected && (
        <div className="space-y-6">
          {/* Course Selector Tabs */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Enrolled Courses ({canvasConnection.institutionName} • Spring 2026)
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setSelectedCourseId('all')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 ${
                  selectedCourseId === 'all'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>All Enrolled Classes</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  selectedCourseId === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {uniqueClassmates.length}
                </span>
              </button>

              {courses.map((course) => {
                const isSelected = selectedCourseId === course.id;
                return (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourseId(course.id)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{course.courseCode}</span>
                    <span className="font-normal opacity-90 hidden sm:inline">· {course.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {course.classmates.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Course Header Card if single course selected */}
          {activeCourse && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-red-100 text-red-800 font-extrabold text-xs">
                    {activeCourse.courseCode}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base">{activeCourse.name}</h3>
                  <span className="text-xs text-slate-500 font-medium">({activeCourse.section})</span>
                </div>
                <p className="text-xs text-slate-600 flex items-center gap-3 flex-wrap">
                  <span>Instructor: <strong className="text-slate-800">{activeCourse.instructor.name}</strong></span>
                  <span>•</span>
                  <span>{activeCourse.department}</span>
                  <span>•</span>
                  <span>{activeCourse.term}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={activeCourse.canvasUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>Open in Canvas LMS</span>
                </a>
              </div>
            </div>
          )}

          {/* Search & Filter Toolbar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search classmates by name, skills (e.g. React, Python), pitch, or major..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 text-xs font-semibold">
              <button
                onClick={() => setFilterType('looking')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  filterType === 'looking'
                    ? 'bg-white text-red-600 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🔥 Looking for Teammates</span>
                <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-red-800 text-[10px]">
                  {totalLookingCount}
                </span>
              </button>

              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Classmates
              </button>

              <button
                onClick={() => setFilterType('students')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterType === 'students'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Students Only
              </button>

              <button
                onClick={() => setFilterType('instructors')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterType === 'instructors'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                TAs & Instructors
              </button>
            </div>
          </div>

          {/* Classmates Grid */}
          {filteredClassmates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredClassmates.map((classmate) => {
                const isLooking = classmate.lookingForTeam;
                const isStudent = classmate.role === 'Student';
                const isCopied = copiedEmail === classmate.email;

                return (
                  <div
                    key={classmate.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 relative group"
                  >
                    {/* Top Identity Row */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={classmate.avatar}
                            alt={classmate.name}
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 shadow-xs"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-extrabold text-slate-900 text-sm">
                                {classmate.name}
                              </h4>
                              {classmate.role !== 'Student' && (
                                <span className="px-2 py-0.2 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                                  {classmate.role}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                              {classmate.major} {classmate.graduationYear ? `• ${classmate.graduationYear}` : ''}
                            </p>
                          </div>
                        </div>

                        {/* Peer Rating or Instructor Badge */}
                        {classmate.peerRating ? (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <span>{classmate.peerRating}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">New Peer</span>
                        )}
                      </div>

                      {/* Course & Section Badge */}
                      <div className="flex items-center gap-2 flex-wrap text-[11px]">
                        <span className="font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                          {classmate.courseCode}
                        </span>
                        <span className="text-slate-500">
                          {classmate.section}
                        </span>
                      </div>

                      {/* School Email Row with Quick Copy Button */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-mono text-[11px] text-slate-700 truncate">
                            {classmate.email}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopyEmail(classmate.email)}
                          className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0 ml-1"
                          title="Copy school email address"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Looking For Team Pitch Callout */}
                      {isLooking && classmate.teammatePitch && (
                        <div className="p-3 rounded-xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-200/80 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-red-800 font-bold text-[11px] uppercase tracking-wider">
                            <Sparkles className="w-3 h-3 text-red-600" />
                            <span>Looking for Teammates</span>
                            {classmate.preferredRole && (
                              <span className="text-slate-600 font-normal">({classmate.preferredRole})</span>
                            )}
                          </div>
                          <p className="text-slate-700 text-[11px] leading-relaxed italic">
                            "{classmate.teammatePitch}"
                          </p>
                        </div>
                      )}

                      {/* Skills Chips */}
                      {classmate.skills && classmate.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {classmate.skills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleViewPortfolio(classmate)}
                          className="px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="View verified coursework deliverables"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>Work</span>
                        </button>

                        <button
                          onClick={() => handleMessageClassmate(classmate)}
                          className="px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Send direct message"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                          <span>Message</span>
                        </button>
                      </div>

                      {isStudent && (
                        <button
                          onClick={() => handleInviteToProject(classmate)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Invite</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <Users className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="font-extrabold text-slate-800 text-base">No classmates match your criteria</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your search query or switching the filter tab to "All Classmates".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
