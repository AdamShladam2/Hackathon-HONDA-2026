import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Users, Award, ArrowRight, ArrowLeft, Check, X, Sparkles } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingModalOpen, closeOnboardingModal, setActiveView } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOnboardingModalOpen) return null;

  const steps = [
    {
      icon: <Compass className="w-8 h-8 text-blue-600" />,
      tagline: 'Step 1 of 3 · Discovery',
      title: 'Discover projects that match your skills',
      description:
        'Browse cross-campus class projects and industry-partnered initiatives. Filter by discipline, difficulty level, and required tech stack to find the exact match for your goals.',
      highlight: 'Swipe through projects or filter by your specific academic discipline & tools.',
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      tagline: 'Step 2 of 3 · Teammates',
      title: 'Find teammates & inspect previous work',
      description:
        'Connect with reliable collaborators using our swipe-based matching deck. Inspect their verified past work records, faculty review confirmations, and genuine peer ratings before teaming up.',
      highlight: 'See authentic collaboration ratings (1–5) and reviewer-confirmed contributions.',
    },
    {
      icon: <Award className="w-8 h-8 text-emerald-600" />,
      tagline: 'Step 3 of 3 · Portfolio',
      title: 'Collaborate & build a verified portfolio',
      description:
        'Work together in project workspaces, log Google Docs and GitHub evidence, and generate objective contribution breakdowns that prove your actual impact to instructors and recruiters.',
      highlight: 'Evidence-backed attribution with transparent contribution share analysis.',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      closeOnboardingModal();
      setActiveView('discover');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = (targetView: 'discover' | 'find-teammates') => {
    closeOnboardingModal();
    setActiveView(targetView);
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col">
        {/* Top Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
              SK
            </div>
            <span className="font-bold text-slate-900 text-sm tracking-tight">Welcome to SkillSink</span>
          </div>
          <button
            onClick={closeOnboardingModal}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
            title="Skip onboarding"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
          {/* Step Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-5 shadow-sm">
            {step.icon}
          </div>

          <span className="inline-block text-xs font-semibold tracking-wider uppercase text-blue-600 mb-2">
            {step.tagline}
          </span>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-3">
            {step.title}
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed max-w-md mb-5">
            {step.description}
          </p>

          <div className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-700 flex items-center justify-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{step.highlight}</span>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2 mt-6">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStep ? 'w-6 bg-blue-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={closeOnboardingModal}
            className="text-xs font-medium text-slate-500 hover:text-slate-700 cursor-pointer px-2 py-1"
          >
            Skip for now
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                Next
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => handleFinish('discover')}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                Start Discovering
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
