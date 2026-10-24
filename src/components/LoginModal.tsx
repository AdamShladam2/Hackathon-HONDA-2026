import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { loginWithEmail, currentUser } = useApp();

  const [emailInput, setEmailInput] = useState('vance.42@osu.edu');
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
  const [errorMessage, setErrorMessage] = useState('');

  if (currentUser) {
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = loginWithEmail(emailInput, selectedRole);
    if (!res.success) {
      setErrorMessage(res.message || 'Login failed. Please check your email.');
    }
  };

  const handleQuickPersona = (email: string, role: 'student' | 'teacher') => {
    setEmailInput(email);
    setSelectedRole(role);
    setErrorMessage('');
    loginWithEmail(email, role);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-lg w-full p-6 sm:p-8 space-y-6">
        {/* Brand Lockup */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-md">
            C
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome to Campusr
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
            School-scoped project collaboration and verified track records for universities.
          </p>
        </div>

        {/* Persona Distinction: Student (Amber) vs Faculty (Indigo) */}
        <div className="space-y-1.5">
          <span className="block text-[10px] tracking-wider uppercase font-bold text-slate-400 text-center">
            Select Your Role for the Demo:
          </span>
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedRole === 'student'
                  ? 'bg-amber-50 text-amber-900 border border-amber-300 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-amber-700" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('teacher')}
              className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedRole === 'teacher'
                  ? 'bg-indigo-50 text-indigo-900 border border-indigo-300 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-700" />
              <span>Faculty / Teacher</span>
            </button>
          </div>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] tracking-wider uppercase font-bold text-slate-500 mb-1">
              Enter your accredited .edu school email:
            </label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                setErrorMessage('');
              }}
              placeholder="e.g. name@osu.edu, student@umich.edu"
              required
              className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Domain decides the school network (e.g. @osu.edu = The Ohio State University).
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Sign In to School Network</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Persona Shortcuts */}
        <div className="space-y-2.5 pt-4 border-t border-slate-200">
          <div className="text-[10px] tracking-wider uppercase font-bold text-slate-400 text-center">
            Instant 1-Click Persona Sign-In:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickPersona('vance.42@osu.edu', 'student')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 text-left transition-colors cursor-pointer"
            >
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                <span>Marcus Vance</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Student · CSE @ OSU</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPersona('sharma.89@osu.edu', 'student')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 text-left transition-colors cursor-pointer"
            >
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                <span>Priya Sharma</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Student · Design @ OSU</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPersona('miller.14@osu.edu', 'teacher')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-colors cursor-pointer"
            >
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Prof. Alan Miller</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Teacher · CSE 2221 @ OSU</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPersona('hchen@umich.edu', 'student')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-colors cursor-pointer"
            >
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                <span>Hannah Chen</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Student @ UMich Scope</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
