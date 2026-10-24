import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  GraduationCap,
  Sparkles,
  Compass,
  ArrowRightLeft,
  Plus,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Flame,
  FileCode,
  Globe,
  Inbox as InboxIcon,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentSchool,
    activeTab,
    setActiveTab,
    toggleRole,
    logout,
    setIsCreateProjectOpen,
    setIsPostIdeaOpen,
    users,
    projects,
    ideas,
    showcaseProjects,
    unreadInboxCount,
    switchUser,
  } = useApp();

  const [showPersonaMenu, setShowPersonaMenu] = React.useState(false);

  if (!currentUser) {
    return null;
  }

  // School students & teachers for quick persona switcher
  const schoolUsers = users.filter((u) => u.schoolId === currentUser.schoolId);
  const schoolProjects = projects.filter((p) => p.schoolId === currentUser.schoolId);
  const schoolClassProjects = schoolProjects.filter((p) => p.type === 'class');
  const schoolIdeas = ideas.filter((i) => i.schoolId === currentUser.schoolId);

  const isTeacher = currentUser.role === 'teacher';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        {/* Subtle school branding bar */}
        <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-3 sm:px-8 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-tight truncate max-w-[150px] sm:max-w-none">
              {currentSchool?.name || 'The Ohio State University'}
            </span>
            <span className="text-slate-500 hidden sm:inline">·</span>
            <span className="text-slate-300 hidden sm:inline">{currentSchool?.mascot} Network</span>
            <span className="text-[10px] tracking-wider uppercase font-mono font-bold bg-slate-800 text-indigo-300 border border-slate-700 px-1.5 py-0.5 rounded">
              {currentUser.schoolId.toUpperCase()}
            </span>
          </div>

          {/* Quick Persona Switcher for Judges / Reviewers */}
          <div className="relative flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400 hidden md:inline">
                Viewing as:
              </span>
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  isTeacher
                    ? 'bg-indigo-950/80 text-indigo-200 border-indigo-700/60 hover:border-indigo-500'
                    : 'bg-amber-950/70 text-amber-200 border-amber-700/60 hover:border-amber-500'
                }`}
                title="Click to switch demo persona"
              >
                {isTeacher ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                ) : (
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>{currentUser.name}</span>
                <span className="text-[10px] opacity-75 font-mono">
                  ({isTeacher ? 'Faculty' : currentUser.major?.split(' ')[0] || 'Student'})
                </span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>
            </div>

            {/* Persona Distinction Role Toggle Chip */}
            <button
              onClick={toggleRole}
              className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full transition-all border cursor-pointer active:scale-95 ${
                isTeacher
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-xs'
                  : 'bg-amber-600 hover:bg-amber-500 text-white border-amber-500 shadow-xs'
              }`}
              title="Toggle between Student and Teacher perspectives"
            >
              <ArrowRightLeft className="w-3 h-3" />
              <span className="font-bold text-[11px]">
                Switch to {isTeacher ? 'Student' : 'Teacher'}
              </span>
            </button>

            {/* Dropdown Menu */}
            {showPersonaMenu && (
              <div
                className="absolute right-0 top-full mt-2 w-76 bg-white rounded-xl shadow-2xl border border-slate-200/90 p-2 z-50 text-slate-800"
                onMouseLeave={() => setShowPersonaMenu(false)}
              >
                <div className="text-[10px] tracking-wider uppercase font-bold text-slate-400 px-2.5 py-1.5">
                  Select Demo Persona ({currentSchool?.shortName})
                </div>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {schoolUsers.map((u) => {
                    const isUInstructor = u.role === 'teacher';
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setShowPersonaMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          u.id === currentUser.id
                            ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                              isUInstructor
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {u.avatarInitial}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{u.name}</div>
                            <div className="text-[10px] text-slate-500">
                              {isUInstructor ? u.title || 'Teacher' : `${u.major} (${u.year})`}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                            isUInstructor
                              ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                              : 'bg-amber-50 text-amber-900 border border-amber-200'
                          }`}
                        >
                          {isUInstructor ? (
                            <>
                              <ShieldCheck className="w-2.5 h-2.5 text-indigo-600" />
                              <span>Faculty</span>
                            </>
                          ) : (
                            <>
                              <GraduationCap className="w-2.5 h-2.5 text-amber-600" />
                              <span>Student</span>
                            </>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setShowPersonaMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log out / Switch School Domain</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Desktop Top Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark with Deep Indigo */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#explore"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('explore');
              }}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:bg-indigo-700 transition-colors">
                C
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap">
                Campusr
              </span>
            </a>
          </div>

          {/* Zone 2: Navigation Links with real-time count badges */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-slate-100 text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Compass className={`w-4 h-4 ${activeTab === 'explore' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Explore Feed</span>
              <span className="text-[10px] font-mono tabular-nums bg-white border border-slate-200 px-1.5 py-0.2 rounded-full text-slate-600">
                {schoolProjects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('classes')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'classes'
                  ? 'bg-slate-100 text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileCode className={`w-4 h-4 ${activeTab === 'classes' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Class Projects</span>
              <span className="text-[10px] font-mono tabular-nums bg-white border border-slate-200 px-1.5 py-0.2 rounded-full text-slate-600">
                {schoolClassProjects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('ideas')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'ideas'
                  ? 'bg-slate-100 text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${activeTab === 'ideas' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Idea Sparks</span>
              <span className="text-[10px] font-mono tabular-nums bg-white border border-slate-200 px-1.5 py-0.2 rounded-full text-slate-600">
                {schoolIdeas.length}
              </span>
            </button>

            {/* Public Project Showcase Link */}
            <button
              onClick={() => setActiveTab('showcase')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'showcase'
                  ? 'bg-slate-100 text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Globe className={`w-4 h-4 ${activeTab === 'showcase' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Showcase</span>
              <span className="text-[10px] font-mono tabular-nums bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded-full text-indigo-700 font-bold">
                {showcaseProjects.length}
              </span>
            </button>

            {/* Collaboration Inbox Link with Unread Count Badge */}
            <button
              onClick={() => setActiveTab('inbox')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'inbox'
                  ? 'bg-slate-100 text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <InboxIcon className={`w-4 h-4 ${activeTab === 'inbox' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Inbox</span>
              {unreadInboxCount > 0 ? (
                <span className="text-[10px] font-mono tabular-nums bg-rose-600 text-white font-bold px-1.5 py-0.2 rounded-full shadow-xs animate-pulse">
                  {unreadInboxCount}
                </span>
              ) : (
                <span className="text-[10px] font-mono tabular-nums bg-white border border-slate-200 px-1.5 py-0.2 rounded-full text-slate-400">
                  0
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-slate-100 text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className={`w-4 h-4 ${activeTab === 'profile' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Profiles</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsCreateProjectOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar (44px+ touch targets) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex-1 h-12 flex flex-col items-center justify-center gap-0.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'explore' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="text-[9px]">Explore</span>
        </button>

        <button
          onClick={() => setActiveTab('classes')}
          className={`flex-1 h-12 flex flex-col items-center justify-center gap-0.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'classes' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span className="text-[9px]">Classes</span>
        </button>

        <button
          onClick={() => setActiveTab('showcase')}
          className={`flex-1 h-12 flex flex-col items-center justify-center gap-0.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'showcase' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span className="text-[9px]">Showcase</span>
        </button>

        <button
          onClick={() => setActiveTab('inbox')}
          className={`relative flex-1 h-12 flex flex-col items-center justify-center gap-0.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'inbox' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <InboxIcon className="w-4 h-4" />
          <span className="text-[9px]">Inbox</span>
          {unreadInboxCount > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
              {unreadInboxCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 h-12 flex flex-col items-center justify-center gap-0.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="text-[9px]">Profile</span>
        </button>
      </div>

    </>
  );
};
