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
  Layers,
  Sparkles,
} from 'lucide-react';

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
    openCanvasModal,
  } = useApp();

  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [hubsDropdownOpen, setHubsDropdownOpen] = useState(false);

  const isTeacher = currentUser.identities.includes('Teacher / Professor');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Logo / Brand Mark */}
          <button
            onClick={() => setActiveView('discover')}
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

          {/* 4 Primary Navigation Sections for Students */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {/* 1. Discover */}
            <button
              onClick={() => setActiveView('discover')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'discover'
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Discover</span>
            </button>

            {/* 2. Find Teammates */}
            <button
              onClick={() => setActiveView('find-teammates')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'find-teammates' || activeView === 'teammate-match'
                  ? 'bg-purple-50 text-purple-700 font-bold border border-purple-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4 text-purple-600" />
              <span>Find Teammates</span>
            </button>

            {/* Canvas Classes & People */}
            <button
              onClick={() => setActiveView('canvas-classes')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'canvas-classes'
                  ? 'bg-red-50 text-red-700 font-bold border border-red-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-red-600" />
              <span>Canvas Classes</span>
              {canvasConnection.isConnected && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-red-100 text-red-800 rounded-full">
                  {canvasConnection.courses.length}
                </span>
              )}
            </button>

            {/* 3. My Projects */}
            <button
              onClick={() => setActiveView('my-projects')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'my-projects' || activeView === 'workspace'
                  ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FolderKanban className="w-4 h-4 text-emerald-600" />
              <span>My Projects</span>
            </button>

            {/* 4. Profile */}
            <button
              onClick={() => setActiveView('profile')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'profile'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>Profile</span>
            </button>

            {/* Dedicated Faculty Badge if logged in as teacher */}
            {isTeacher && (
              <button
                onClick={() => setActiveView('teacher-dashboard')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ml-1 cursor-pointer ${
                  activeView === 'teacher-dashboard'
                    ? 'bg-indigo-900 text-white font-bold shadow-sm'
                    : 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>Teacher Dashboard</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-200 text-indigo-900">
                  FACULTY
                </span>
              </button>
            )}

            {/* Secondary Menu Dropdown: "More Hubs & Tools" */}
            <div className="relative ml-1">
              <button
                onClick={() => setHubsDropdownOpen(!hubsDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  ['campus-hub', 'work-hub', 'showcase', 'inbox'].includes(activeView)
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-4 h-4 text-slate-500" />
                <span>More Hubs</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                    {unreadCount}
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {hubsDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setHubsDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-left">
                    <button
                      onClick={() => {
                        setHubsDropdownOpen(false);
                        setActiveView('campus-hub');
                      }}
                      className="w-full px-3.5 py-2.5 text-xs hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 flex items-start gap-2.5 transition-colors cursor-pointer"
                    >
                      <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">Campus Hub</div>
                        <div className="text-[10px] text-slate-500">University courses, teams & assignments</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setHubsDropdownOpen(false);
                        setActiveView('canvas-classes');
                      }}
                      className="w-full px-3.5 py-2.5 text-xs hover:bg-red-50 text-slate-800 hover:text-red-900 flex items-start gap-2.5 transition-colors cursor-pointer"
                    >
                      <GraduationCap className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <span>Canvas Classes & Roster</span>
                          {canvasConnection.isConnected && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-red-100 text-red-800 font-bold">
                              {canvasConnection.courses.length}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">Access classmates via school email</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setHubsDropdownOpen(false);
                        setActiveView('work-hub');
                      }}
                      className="w-full px-3.5 py-2.5 text-xs hover:bg-blue-50 text-slate-800 hover:text-blue-900 flex items-start gap-2.5 transition-colors cursor-pointer"
                    >
                      <Briefcase className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">Work Hub</div>
                        <div className="text-[10px] text-slate-500">Professional projects & independent sprints</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setHubsDropdownOpen(false);
                        setActiveView('showcase');
                      }}
                      className="w-full px-3.5 py-2.5 text-xs hover:bg-slate-50 text-slate-800 flex items-start gap-2.5 transition-colors cursor-pointer border-t border-slate-100"
                    >
                      <FolderKanban className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">Universal Showcase</div>
                        <div className="text-[10px] text-slate-500">All cross-hub published demos</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setHubsDropdownOpen(false);
                        setActiveView('teacher-dashboard');
                      }}
                      className="w-full px-3.5 py-2.5 text-xs hover:bg-indigo-50 text-indigo-900 flex items-start gap-2.5 transition-colors cursor-pointer border-t border-slate-100"
                    >
                      <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">Teacher Dashboard</div>
                        <div className="text-[10px] text-slate-500">Class management & similarity audits</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setHubsDropdownOpen(false);
                        setActiveView('inbox');
                      }}
                      className="w-full px-3.5 py-2.5 text-xs hover:bg-slate-50 text-slate-800 flex items-start gap-2.5 transition-colors cursor-pointer border-t border-slate-100"
                    >
                      <Inbox className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-bold flex items-center justify-between">
                          <span>Inbox & Applications</span>
                          {unreadCount > 0 && (
                            <span className="px-1.5 py-0.2 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">Messages, invitations, & code access</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Persona Switcher & New CTA */}
          <div className="flex items-center gap-2.5 shrink-0">
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

            {/* Create Project CTA Button with Dropdown */}
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

                    {isTeacher && (
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
          </div>
        </div>

        {/* Mobile Navigation bar (Consolidated 4 items + Hubs) */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-100 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveView('discover')}
            className={`py-1 px-2 shrink-0 ${
              activeView === 'discover' ? 'text-blue-600 font-bold' : 'text-slate-600'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveView('find-teammates')}
            className={`py-1 px-2 shrink-0 ${
              activeView === 'find-teammates' || activeView === 'teammate-match'
                ? 'text-purple-600 font-bold'
                : 'text-slate-600'
            }`}
          >
            Teammates
          </button>
          <button
            onClick={() => setActiveView('canvas-classes')}
            className={`py-1 px-2 shrink-0 ${
              activeView === 'canvas-classes' ? 'text-red-600 font-bold' : 'text-slate-600'
            }`}
          >
            Canvas
          </button>
          <button
            onClick={() => setActiveView('my-projects')}
            className={`py-1 px-2 shrink-0 ${
              activeView === 'my-projects' || activeView === 'workspace'
                ? 'text-emerald-600 font-bold'
                : 'text-slate-600'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveView('profile')}
            className={`py-1 px-2 shrink-0 ${
              activeView === 'profile' ? 'text-blue-600 font-bold' : 'text-slate-600'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveView('campus-hub')}
            className={`py-1 px-2 shrink-0 ${
              activeView === 'campus-hub' ? 'text-blue-600 font-bold' : 'text-slate-500'
            }`}
          >
            Campus
          </button>
        </div>
      </div>
    </header>
  );
};
