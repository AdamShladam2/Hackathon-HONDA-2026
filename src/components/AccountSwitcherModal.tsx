import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Users,
  Briefcase,
  GraduationCap,
  Sparkles,
  Check,
  RotateCcw,
  LogOut,
  ShieldCheck,
  Lightbulb,
} from 'lucide-react';

interface AccountSwitcherModalProps {
  onClose: () => void;
}

export const AccountSwitcherModal: React.FC<AccountSwitcherModalProps> = ({ onClose }) => {
  const { currentUser, allDemoAccounts, switchUser, resetAllDemoData, loginAsTeacher, isSignedIn, signOut } = useApp();

  const handleSelect = (userId: string) => {
    switchUser(userId);
    onClose();
  };

  const handleTeacherLogin = () => {
    loginAsTeacher();
    onClose();
  };

  const teachers = allDemoAccounts.filter((u) => u.identities.includes('Teacher / Professor'));
  const professionals = allDemoAccounts.filter((u) => u.identities.includes('Working professional'));
  const independents = allDemoAccounts.filter(
    (u) => u.identities.includes('Independent creator / developer') || u.identities.includes('Recent graduate')
  );
  const mentors = allDemoAccounts.filter((u) => u.identities.includes('Industry mentor'));
  const students = allDemoAccounts.filter((u) => u.identities.includes('Student'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col text-left">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Switch Demo Persona & Role Login</h3>
              <p className="text-[11px] text-slate-500">
                Experience SkillSink as a Teacher, Student, Working Professional, Mentor, or Indie Creator
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* DEDICATED TEACHER LOGIN CALLOUT (Core Requirement) */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-indigo-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-[10px] font-bold uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                Dedicated Teacher / Professor Role
              </div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Sign In as Professor Robert Hayes
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                Ohio State University CSE Faculty. Access the dedicated <strong>Teacher Dashboard</strong>: create class assignments with anti-plagiarism rules, inspect Google Docs revision timelines, and stamp reviewer confirmations.
              </p>
            </div>

            <button
              onClick={handleTeacherLogin}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Teacher Login
            </button>
          </div>

          {/* Mock Auth Distinction Notice */}
          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Hackathon Note:</strong> Persona switching runs in-memory mock authentication for instant testing without requiring external credentials.
            </span>
          </div>

          {/* Section: Working Professionals */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>Working Professionals ({professionals.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {professionals.map((user) => {
                const isCurrent = currentUser.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelect(user.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {user.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.2 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-blue-700 font-medium truncate">
                        {user.jobTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {user.organization} · {user.yearsOfExperience}y exp
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Students & Early Career */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>University Students & Early Career ({students.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {students.map((user) => {
                const isCurrent = currentUser.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelect(user.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      isCurrent
                        ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {user.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-medium truncate">
                        {user.school}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {user.major} ({user.graduationYear})
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Independent Creators & Recent Grads */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>Independent Developers & Recent Grads ({independents.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {independents.map((user) => {
                const isCurrent = currentUser.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelect(user.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      isCurrent
                        ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {user.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-amber-800 font-medium truncate">
                        {user.jobTitle || user.identities.join(', ')}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {user.industry}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Industry Mentors */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Industry Mentors ({mentors.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {mentors.map((user) => {
                const isCurrent = currentUser.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelect(user.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      isCurrent
                        ? 'border-purple-500 bg-purple-50/50 ring-1 ring-purple-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {user.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-purple-800 font-medium truncate">
                        {user.jobTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {user.organization || user.industry}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            onClick={resetAllDemoData}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="Reset localStorage demo data to initial state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>
          <div className="flex items-center gap-2">
            {isSignedIn && (
              <button
                onClick={() => {
                  signOut();
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out / use my email
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
