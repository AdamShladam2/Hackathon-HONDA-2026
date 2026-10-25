import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Circle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Compass,
  Users,
  BarChart3,
  Star,
  GraduationCap,
  ShieldCheck,
  Scale,
  Award,
} from 'lucide-react';

export const DemoFlowBar: React.FC = () => {
  const {
    currentUser,
    loginAsTeacher,
    loginAsStudent,
    setActiveView,
    projects,
    classProjects,
    openContributionAnalysisModal,
    openRateTeammateModal,
    openOnboardingModal,
    studentSubmissions,
    runSimilarityCheck,
    openSimilarityReport,
    openPortfolio,
    allDemoAccounts,
    showToast,
    canvasConnection,
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(true);

  const allPs = [...projects, ...classProjects];
  const spotlightProject = allPs.find((p) => p.id === 'proj-1' || p.title.toLowerCase().includes('rover')) || allPs[0];
  const devonAuthor = allDemoAccounts.find((a) => a.id === 'user_devon_miller') || allDemoAccounts[2];
  const marcusAuthor = allDemoAccounts.find((a) => a.id === 'author_marcus_v') || allDemoAccounts[1];
  const danielSub = studentSubmissions.find((s) => s.id === 'sub-daniel-miller');

  const demoSteps = [
    {
      num: 1,
      title: '5-Sec Clarity',
      desc: 'Tagline & Purpose',
      done: true,
      action: () => {
        loginAsStudent('user_alex_chen');
        setActiveView('discover');
        showToast('Viewing 5-Second Clarity Home: Swipe. Match. Build. Prove.', 'info');
      },
    },
    {
      num: 2,
      title: '3-Step Tour',
      desc: 'Onboarding Modal',
      done: true,
      action: () => {
        openOnboardingModal();
      },
    },
    {
      num: 3,
      title: 'Swipe Matching',
      desc: '4.8★ Peer Ratings',
      done: true,
      action: () => {
        loginAsStudent('user_alex_chen');
        setActiveView('find-teammates');
        showToast('Viewing candidate swipe cards with verified ratings & past work', 'info');
      },
    },
    {
      num: 4,
      title: '4-Person Team',
      desc: 'BuckeyeRover Proj',
      done: true,
      action: () => {
        loginAsStudent('user_alex_chen');
        setActiveView('discover');
        const el = document.getElementById('project-discovery-section');
        el?.scrollIntoView({ behavior: 'smooth' });
        showToast('BuckeyeRover Navigator: 4 distinct contributors & roles', 'info');
      },
    },
    {
      num: 5,
      title: 'Analyze Work',
      desc: 'Contribution Modal',
      done: true,
      action: () => {
        if (spotlightProject) {
          openContributionAnalysisModal(spotlightProject);
        }
      },
    },
    {
      num: 6,
      title: 'Activity Share',
      desc: 'Transparent Metric',
      done: true,
      action: () => {
        if (spotlightProject) {
          openContributionAnalysisModal(spotlightProject);
          showToast('Estimated Documented Activity Share — Not total human effort', 'info');
        }
      },
    },
    {
      num: 7,
      title: 'Incomplete Evidence',
      desc: 'Devon Miller Flag',
      done: true,
      action: () => {
        if (spotlightProject) {
          openContributionAnalysisModal(spotlightProject);
          showToast('Devon Miller: Limited evidence flagged with 3 inquiry questions', 'warning');
        }
      },
    },
    {
      num: 8,
      title: 'Rate Teammate',
      desc: '1-5 Criteria Feedback',
      done: true,
      action: () => {
        if (marcusAuthor && spotlightProject) {
          openRateTeammateModal(marcusAuthor, spotlightProject);
        }
      },
    },
    {
      num: 9,
      title: 'Teacher Login',
      desc: 'Prof. Robert Hayes',
      done: currentUser.id === 'user_prof_robert_hayes',
      action: () => {
        loginAsTeacher();
      },
    },
    {
      num: 10,
      title: 'Faculty Audit',
      desc: 'Audit Student Teams',
      done: true,
      action: () => {
        loginAsTeacher();
        if (spotlightProject) {
          openContributionAnalysisModal(spotlightProject);
        }
      },
    },
    {
      num: 11,
      title: 'Check Similarity',
      desc: '54% Overlap Report',
      done: danielSub?.similarityChecked,
      action: async () => {
        loginAsTeacher();
        const rep = await runSimilarityCheck('sub-daniel-miller', 'text');
        openSimilarityReport(rep);
      },
    },
    {
      num: 12,
      title: 'Past Work Proof',
      desc: 'Verified Portfolio',
      done: true,
      action: () => {
        const alex = allDemoAccounts.find((a) => a.id === 'user_alex_chen') || allDemoAccounts[0];
        openPortfolio(alex);
      },
    },
    {
      num: 13,
      title: 'Canvas Roster',
      desc: 'School Email Peers',
      done: canvasConnection.isConnected,
      action: () => {
        loginAsStudent('user_alex_chen');
        setActiveView('canvas-classes');
        showToast('Viewing enrolled Canvas class rosters & peer team recruitment pitches!', 'success');
      },
    },
  ];

  return (
    <div className="bg-slate-950 border-b border-slate-800 text-white transition-all text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="font-bold text-xs text-blue-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Judge Demo Tour (13 Steps):</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
              Active: <strong className="text-white">{currentUser.name}</strong> ({currentUser.identities[0]})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <span>{isExpanded ? 'Hide Steps' : 'Show 13 Steps'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-13 gap-1.5 pt-2 pb-1">
            {demoSteps.map((st) => (
              <button
                key={st.num}
                onClick={st.action}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  st.done
                    ? 'bg-slate-900 border-slate-700/80 hover:border-blue-500 hover:bg-slate-800'
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800'
                }`}
                title={`Step ${st.num}: ${st.title} - ${st.desc}`}
              >
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-[10px] font-bold text-blue-400">
                    #{st.num}
                  </span>
                  {st.done ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-3 h-3 text-slate-500 shrink-0" />
                  )}
                </div>

                <div className="text-[11px] font-bold text-slate-200 truncate">
                  {st.title}
                </div>
                <div className="text-[9px] text-slate-400 truncate mt-0.5">
                  {st.desc}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
