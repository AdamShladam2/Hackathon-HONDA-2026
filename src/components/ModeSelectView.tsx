import React from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, Compass, Lock, ArrowRight, Users } from 'lucide-react';

// Entry screen: users pick which section of the app to enter.
// Campus is limited to .edu accounts and scoped to their own school; Discover is open to everyone.
export const ModeSelectView: React.FC = () => {
  const { setAppMode, canAccessCampus, userCampus, currentUser, allDemoAccounts, openAccountSwitcher, signOut } = useApp();
  const email = currentUser.email || allDemoAccounts.find((a) => a.id === currentUser.id)?.email;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col items-center justify-center px-4 py-12">
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-base shadow-sm">
          co
        </div>
        <span className="text-2xl font-black tracking-tight text-slate-900 lowercase">collabr</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-center text-slate-900">Where do you want to go?</h1>
      <p className="text-sm text-slate-500 text-center mt-2 max-w-md">
        You can switch between the two sections at any time from the top bar.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full max-w-3xl">
        <button
          type="button"
          onClick={() => setAppMode('campus')}
          disabled={!canAccessCampus}
          className={`text-left p-6 rounded-2xl border bg-white transition-all group ${
            canAccessCampus
              ? 'border-slate-200 hover:border-red-300 hover:shadow-md cursor-pointer'
              : 'border-slate-200 opacity-70 cursor-not-allowed'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
            {canAccessCampus ? <GraduationCap className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </div>
          <h2 className="text-lg font-black text-slate-900">Campus</h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Your courses, Canvas classes, classmates, assignments and class teams. Only for students and
            faculty with a .edu email, and only for their own school.
          </p>
          <div className="mt-4 text-xs font-bold flex items-center gap-1.5">
            {canAccessCampus ? (
              <span className="text-red-700 flex items-center gap-1.5">
                Enter {userCampus?.name}
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            ) : (
              <span className="text-slate-500">Requires a .edu school email</span>
            )}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setAppMode('discover')}
          className="text-left p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-black text-slate-900">Discover</h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Public projects, the Work Hub, the showcase and teammates from anywhere. Open to everyone:
            professionals, independent builders, graduates and students.
          </p>
          <div className="mt-4 text-xs font-bold text-blue-700 flex items-center gap-1.5">
            Enter Discover
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </button>
      </div>

      <button
        type="button"
        onClick={openAccountSwitcher}
        className="mt-8 flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
      >
        <Users className="w-3.5 h-3.5" />
        <span>
          Signed in as <strong className="text-slate-700">{currentUser.name}</strong>
          {email ? ` (${email})` : ''} · Switch account
        </span>
      </button>
      <button
        type="button"
        onClick={signOut}
        className="mt-2 text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
      >
        Sign out
      </button>
    </div>
  );
};
