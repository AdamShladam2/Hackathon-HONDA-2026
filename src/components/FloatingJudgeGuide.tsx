import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  Award,
  Layers,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

export const FloatingJudgeGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    currentUser,
    switchUser,
    setActiveTab,
    setSelectedProjectId,
    setSelectedStudentId,
    users,
    projects,
  } = useApp();

  const isTeacher = currentUser?.role === 'teacher';

  const demoSteps = [
    {
      id: 1,
      title: '1. School-Scoped Login (@osu.edu)',
      desc: 'Signed in with Ohio State domain. Try switching to UMich to see strict school isolation.',
      active: true,
      action: () => {
        const marcus = users.find((u) => u.email === 'vance.42@osu.edu');
        if (marcus) switchUser(marcus.id);
        setActiveTab('explore');
      },
      actionLabel: 'Set Student (Marcus Vance)',
    },
    {
      id: 2,
      title: '2. Explore Feed & Card Physics Deck',
      desc: 'Browse 4-axis comparison bars & skill possession chips. Toggle "Tactile Deck" to drag & swipe with dynamic stamps.',
      active: true,
      action: () => {
        setActiveTab('explore');
      },
      actionLabel: 'Go to Explore Feed',
    },
    {
      id: 3,
      title: '3. Class Contribution Audit & Locked Download',
      desc: 'Inspect CSE 2221 version history (Marcus Vance 71% workload disparity). Download is locked for students.',
      active: true,
      action: () => {
        const marcus = users.find((u) => u.email === 'vance.42@osu.edu');
        if (marcus) switchUser(marcus.id);
        setActiveTab('classes');
      },
      actionLabel: 'View Class Project (Student)',
    },
    {
      id: 4,
      title: '4. Teacher Grading Rubric & File Download',
      desc: 'Log in as Prof. Alan Miller, evaluate criteria (Contribution, Quality, Collab), save grade, and export .docx file.',
      active: true,
      action: () => {
        const teacher = users.find((u) => u.role === 'teacher');
        if (teacher) switchUser(teacher.id);
        setActiveTab('classes');
      },
      actionLabel: 'Switch to Teacher (Prof. Miller)',
    },
    {
      id: 5,
      title: '5. Teammate Endorsements & Matcher',
      desc: 'View shared project teammate profile (Elena), leave verified badge ("Reliable"), and vote "work with again".',
      active: true,
      action: () => {
        const marcus = users.find((u) => u.email === 'vance.42@osu.edu');
        if (marcus) switchUser(marcus.id);
        setSelectedStudentId('osu-student-3');
        setActiveTab('profile');
      },
      actionLabel: 'Open Teammate Profile (Elena)',
    },
    {
      id: 6,
      title: '6. Cross-Campus Public Showcase',
      desc: 'Discover 10 multi-university projects across OSU, UMich & Stanford. Filter by code access (Public / On Request / None) and anti-copying rule.',
      active: true,
      action: () => {
        setActiveTab('showcase');
      },
      actionLabel: 'Explore Public Showcase',
    },
    {
      id: 7,
      title: '7. Seeded Collaboration Inbox (3 Items)',
      desc: 'Review 3 seeded incoming items: 1 DM, 1 Collaboration Invite (Accept adds to team), and 1 Code Request (Accept reveals repo link).',
      active: true,
      action: () => {
        const marcus = users.find((u) => u.email === 'vance.42@osu.edu');
        if (marcus) switchUser(marcus.id);
        setActiveTab('inbox');
      },
      actionLabel: 'Open Seeded Inbox (3 items)',
    },
  ];


  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-40 max-w-sm select-none">
      {isOpen ? (
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-2xl rounded-2xl p-4 text-xs space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200 w-84 sm:w-96">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                ★
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Evaluation Quick Guide</div>
                <div className="text-[10px] text-slate-500 font-mono">5-Step Polished Flow</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Collapse guide"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {demoSteps.map((step) => (
              <div
                key={step.id}
                className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-white transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-[11px]">{step.title}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <p className="text-[10px] text-slate-600 leading-relaxed">{step.desc}</p>
                <button
                  onClick={step.action}
                  className="w-full py-1 px-2 rounded-md bg-white border border-slate-200 text-indigo-700 hover:bg-indigo-50 font-semibold text-[10px] flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  <span>{step.actionLabel}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Current: <strong className="text-slate-700">{currentUser?.name}</strong> ({currentUser?.role})</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
            >
              Minimize
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-xl backdrop-blur-md border border-slate-700/60 text-xs font-semibold transition-all hover:scale-102 active:scale-95 cursor-pointer ring-4 ring-indigo-500/10"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Demo Guide</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:translate-y-[-1px] transition-transform" />
        </button>
      )}
    </div>
  );
};
