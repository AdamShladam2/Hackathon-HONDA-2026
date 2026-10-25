import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserIdentity } from '../types';
import { getCampusForEmail, isBlockedEmail, BLOCKED_EMAIL_MESSAGE } from '../services/campusAccess';
import { GraduationCap, Compass, Users, ArrowRight } from 'lucide-react';

const ROLE_OPTIONS: UserIdentity[] = [
  'Student',
  'Teacher / Professor',
  'Working professional',
  'Independent creator / developer',
  'Recent graduate',
  'Industry mentor',
];

// Sign-in screen: personal or school email. A .edu address unlocks Campus mode for that school.
export const SignInView: React.FC = () => {
  const { signInWithEmail, openAccountSwitcher, allDemoAccounts } = useApp();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [identity, setIdentity] = useState<UserIdentity>('Student');
  const [error, setError] = useState('');

  const campus = getCampusForEmail(email);
  const looksComplete = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
  const isDemoEmail = allDemoAccounts.some((a) => (a.email || '').toLowerCase() === email.trim().toLowerCase());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = signInWithEmail({ email, name, identity });
    setError(res.success ? '' : res.message);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col items-center justify-center px-4 py-12">
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-base shadow-sm">
          co
        </div>
        <span className="text-2xl font-black tracking-tight text-slate-900 lowercase">collabr</span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4"
      >
        <div>
          <h1 className="text-xl font-black text-slate-900">Sign in</h1>
          <p className="text-xs text-slate-500 mt-1">
            Use your personal or school email. A .edu email also unlocks Campus mode for your school.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@school.edu or you@gmail.com"
            autoComplete="email"
            required
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {looksComplete && isBlockedEmail(email) && (
            <p className="mt-1.5 text-[11px] font-semibold text-rose-600">{BLOCKED_EMAIL_MESSAGE}</p>
          )}
          {looksComplete && !isBlockedEmail(email) && (
            <p
              className={`mt-1.5 text-[11px] font-semibold flex items-center gap-1.5 ${
                campus ? 'text-red-700' : 'text-blue-700'
              }`}
            >
              {campus ? <GraduationCap className="w-3.5 h-3.5" /> : <Compass className="w-3.5 h-3.5" />}
              {campus ? `Campus + Discover access · ${campus.name}` : 'Discover access (Campus needs a .edu email)'}
            </p>
          )}
        </div>

        {!isDemoEmail && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First and last name"
                autoComplete="name"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="mt-1 text-[11px] text-slate-400">Only needed the first time you sign in with this email.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">I am a</label>
              <select
                value={identity}
                onChange={(e) => setIdentity(e.target.value as UserIdentity)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Accounts are saved in this browser only. Email ownership is not verified yet.
        </p>
      </form>

      <button
        type="button"
        onClick={openAccountSwitcher}
        className="mt-6 flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
      >
        <Users className="w-3.5 h-3.5" />
        Or try a demo account
      </button>
    </div>
  );
};
