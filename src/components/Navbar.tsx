import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Users,
  FolderKanban,
  User,
  GraduationCap,
  Briefcase,
  Inbox,
  ChevronDown,
  Plus,
  Lock,
  LayoutGrid,
  BookOpen,
  ScanSearch,
} from 'lucide-react';
import { ViewType } from '../context/AppContext';

interface NavItem {
  label: string;
  views: ViewType[];
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  activeClass: string;
  badge?: number;
  badgeClass?: string;
}

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    unreadCount,
    openShareModal,
    openCreateWorkModal,
    openAccountSwitcher,
    currentUser,
    canvasConnection,
    appMode,
    setAppMode,
    canAccessCampus,
    userCampus,
    campusClassAssignments,
    openStudentSubmitModal,
    openCanvasModal,
  } = useApp();

  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);

  const isTeacher = currentUser.identities.includes('Teacher / Professor');

  // Teacher mode: their students, posts in their classes, integrity checks, and opportunities they offer
  const teacherItems: NavItem[] = [
    {
      label: 'My Students',
      views: ['teacher-students'],
      icon: Users,
      iconClass: 'text-indigo-600',
      activeClass: 'bg-indigo-50 text-indigo-800 font-bold border border-indigo-200',
    },
    {
      label: 'Class Posts',
      views: ['course-posts'],
      icon: BookOpen,
      iconClass: 'text-indigo-600',
      activeClass: 'bg-indigo-50 text-indigo-800 font-bold border border-indigo-200',
    },
    {
      label: 'Integrity Check',
      views: ['teacher-integrity'],
      icon: ScanSearch,
      iconClass: 'text-indigo-600',
      activeClass: 'bg-indigo-50 text-indigo-800 font-bold border border-indigo-200',
    },
    {
      label: 'Opportunities',
      views: ['teacher-opportunities'],
      icon: Briefcase,
      iconClass: 'text-indigo-600',
      activeClass: 'bg-indigo-50 text-indigo-800 font-bold border border-indigo-200',
    },
  ];

  const teammatesItem: NavItem = {
    label: 'Find Teammates',
    views: ['find-teammates', 'teammate-match'],
    icon: Users,
    iconClass: 'text-purple-600',
    activeClass: 'bg-purple-50 text-purple-700 font-bold border border-purple-200',
  };
  const sharedItems: NavItem[] = [
    {
      label: 'My Projects',
      views: ['my-projects', 'workspace'],
      icon: FolderKanban,
      iconClass: 'text-emerald-600',
      activeClass: 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200',
    },
    {
      label: 'Inbox',
      views: ['inbox'],
      icon: Inbox,
      iconClass: 'text-slate-500',
      activeClass: 'bg-slate-100 text-slate-900 font-bold',
      badge: unreadCount,
      badgeClass: 'bg-blue-600 text-white',
    },
    {
      label: 'Profile',
      views: ['profile'],
      icon: User,
      iconClass: 'text-slate-500',
      activeClass: 'bg-slate-100 text-slate-900 font-bold',
    },
  ];

  // Each mode is its own section of the app with its own tabs
  const navItems: NavItem[] = isTeacher
    ? teacherItems
    : appMode === 'campus'
      ? [
          {
            label: 'Campus Hub',
            views: ['campus-hub'],
            icon: GraduationCap,
            iconClass: 'text-emerald-600',
            activeClass: 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200',
          },
          {
            label: 'My Classes',
            views: ['my-classes'],
            icon: BookOpen,
            iconClass: 'text-indigo-600',
            activeClass: 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200',
          },
          {
            label: 'Canvas Classes',
            views: ['canvas-classes'],
            icon: GraduationCap,
            iconClass: 'text-red-600',
            activeClass: 'bg-red-50 text-red-700 font-bold border border-red-200',
            badge: canvasConnection.isConnected ? canvasConnection.courses.length : undefined,
            badgeClass: 'bg-red-100 text-red-800',
          },
          { ...teammatesItem, label: 'Classmates' },
          {
            label: 'Opportunities',
            views: ['opportunities'],
            icon: Briefcase,
            iconClass: 'text-emerald-600',
            activeClass: 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200',
          },
          ...sharedItems,
        ]
      : [
          {
            label: 'Discover',
            views: ['discover'],
            icon: Compass,
            iconClass: 'text-blue-600',
            activeClass: 'bg-blue-50 text-blue-700 font-bold border border-blue-200',
          },
          teammatesItem,
          {
            label: 'Work Hub',
            views: ['work-hub'],
            icon: Briefcase,
            iconClass: 'text-blue-600',
            activeClass: 'bg-blue-50 text-blue-700 font-bold border border-blue-200',
          },
          {
            label: 'Showcase',
            views: ['showcase'],
            icon: LayoutGrid,
            iconClass: 'text-slate-600',
            activeClass: 'bg-slate-100 text-slate-900 font-bold',
          },
          ...sharedItems,
        ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Logo / Brand Mark */}
          <button
            onClick={() => setActiveView(isTeacher ? 'course-posts' : appMode === 'campus' ? 'campus-hub' : 'discover')}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-sm transition-transform group-hover:scale-105">
              co
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 whitespace-nowrap shrink-0 lowercase">
                collabr
              </span>
            </div>
          </button>

          {/* Mode Switch: Campus (.edu, own school) vs Discover (everyone); teachers stay in Campus */}
          {!isTeacher && (
          <div className="hidden md:flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold shrink-0">
            <button
              onClick={() => setAppMode('campus')}
              title={
                canAccessCampus
                  ? `Campus mode for ${userCampus?.name}`
                  : 'Campus mode requires a .edu school email'
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                appMode === 'campus'
                  ? 'bg-white text-red-700 shadow-sm'
                  : canAccessCampus
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 cursor-not-allowed'
              }`}
            >
              {canAccessCampus ? <GraduationCap className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>Campus</span>
            </button>
            <button
              onClick={() => setAppMode('discover')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                appMode === 'discover' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Discover</span>
            </button>
          </div>
          )}

          {/* Mode-specific Primary Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.views.includes(activeView);
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveView(item.views[0])}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive ? item.activeClass : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.iconClass}`} />
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${item.badgeClass}`}>
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Persona Switcher & New CTA */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Teachers connect Carmen here (they have no Canvas Classes tab) */}
            {isTeacher && (
              <button
                onClick={openCanvasModal}
                title={canvasConnection.isConnected ? 'Manage your Carmen connection' : 'Connect Carmen to load your courses'}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                  canvasConnection.isConnected
                    ? 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
                    : 'bg-red-600 text-white border-red-600 hover:bg-red-700'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>{canvasConnection.isConnected ? 'Carmen connected' : 'Connect Carmen'}</span>
              </button>
            )}
            {/* Account Switcher Button */}
            <button
              onClick={openAccountSwitcher}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs transition-colors cursor-pointer"
              title="Switch demo persona (Student, Professional, Mentor)"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full object-cover border border-slate-300"
              />
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="font-bold text-slate-900 text-xs truncate max-w-[100px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-500 truncate max-w-[100px]">
                  {currentUser.identities[0]}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Create Project CTA Button with Dropdown (not shown to teachers) */}
            {!isTeacher && (
            <div className="relative">
              <button
                onClick={() => setCreateDropdownOpen(!createDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create / Share</span>
                <span className="sm:hidden">New</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {createDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setCreateDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-left">
                    {appMode === 'campus' ? (
                      <>
                    <button
                      onClick={() => {
                        setCreateDropdownOpen(false);
                        openShareModal({ isClassProject: true });
                      }}
                      className="w-full px-3.5 py-2 text-xs hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 flex items-start gap-2.5 transition-colors cursor-pointer"
                    >
                      <FolderKanban className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">Add Class Project</div>
                        <div className="text-[10px] text-slate-500">
                          Upload files or import from Canvas
                        </div>
                      </div>
                    </button>

                    {campusClassAssignments.length > 0 && (
                      <button
                        onClick={() => {
                          setCreateDropdownOpen(false);
                          openStudentSubmitModal(campusClassAssignments[0]);
                        }}
                        className="w-full px-3.5 py-2 text-xs hover:bg-red-50 text-slate-800 hover:text-red-800 flex items-start gap-2.5 transition-colors cursor-pointer border-t border-slate-100"
                      >
                        <GraduationCap className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold">Submit Assignment Work</div>
                          <div className="text-[10px] text-slate-500">
                            Attach your files or Canvas submissions
                          </div>
                        </div>
                      </button>
                    )}

                      </>
                    ) : (
                      <>
                    <button
                      onClick={() => {
                        setCreateDropdownOpen(false);
                        openCreateWorkModal();
                      }}
                      className="w-full px-3.5 py-2 text-xs hover:bg-blue-50 text-slate-800 hover:text-blue-700 flex items-start gap-2.5 transition-colors cursor-pointer"
                    >
                      <Briefcase className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">Create Work Project</div>
                        <div className="text-[10px] text-slate-500">
                          For professionals & student mentees
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setCreateDropdownOpen(false);
                        openShareModal();
                      }}
                      className="w-full px-3.5 py-2 text-xs hover:bg-slate-50 text-slate-800 hover:text-slate-900 flex items-start gap-2.5 transition-colors cursor-pointer border-t border-slate-100"
                    >
                      <FolderKanban className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">Share to Showcase</div>
                        <div className="text-[10px] text-slate-500">
                          Publish any demo or portfolio
                        </div>
                      </div>
                    </button>

                      </>
                    )}

                    {isTeacher && canAccessCampus && (
                      <button
                        onClick={() => {
                          setCreateDropdownOpen(false);
                          setActiveView('teacher-dashboard');
                        }}
                        className="w-full px-3.5 py-2 text-xs hover:bg-indigo-50 text-indigo-900 flex items-start gap-2.5 transition-colors cursor-pointer border-t border-slate-100"
                      >
                        <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold">Create Class Assignment</div>
                          <div className="text-[10px] text-slate-500">
                            Faculty assignment with integrity rules
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar (mode switch + mode-specific items) */}
        <div className="lg:hidden flex items-center justify-around gap-1 py-2 border-t border-slate-100 text-xs font-semibold overflow-x-auto">
          {!isTeacher && (
          <button
            onClick={() => setAppMode(appMode === 'campus' ? 'discover' : 'campus')}
            className="py-1 px-2 shrink-0 rounded-md bg-slate-100 text-slate-700 font-bold flex items-center gap-1"
          >
            {appMode === 'campus' ? <Compass className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
            {appMode === 'campus' ? 'Discover' : 'Campus'}
          </button>
          )}
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveView(item.views[0])}
              className={`py-1 px-2 shrink-0 ${
                item.views.includes(activeView) ? 'text-blue-600 font-bold' : 'text-slate-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
