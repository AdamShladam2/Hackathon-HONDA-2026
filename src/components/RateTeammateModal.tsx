import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, AlertCircle, CheckCircle2, X, MessageSquare, ShieldCheck } from 'lucide-react';
import { Project } from '../types';

export const RateTeammateModal: React.FC = () => {
  const {
    isRateTeammateModalOpen,
    closeRateTeammateModal,
    ratingTargetUser,
    ratingTargetProject,
    currentUser,
    projects,
    classProjects,
    teammateRatings,
    addTeammateRating,
  } = useApp();

  const allProjects = [...projects, ...classProjects];

  // Selected project state
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    ratingTargetProject?.id || allProjects[0]?.id || 'proj-1'
  );

  // Criteria ratings (1-5)
  const [communication, setCommunication] = useState<number>(5);
  const [reliability, setReliability] = useState<number>(5);
  const [collaboration, setCollaboration] = useState<number>(5);
  const [qualityOfDeliverables, setQualityOfDeliverables] = useState<number>(5);
  const [writtenFeedback, setWrittenFeedback] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isRateTeammateModalOpen || !ratingTargetUser) return null;

  const currentProject = allProjects.find((p) => p.id === selectedProjectId) || ratingTargetProject || allProjects[0];

  // Self-rating check
  const isSelfRating = currentUser.id === ratingTargetUser.id;

  // Duplicate check
  const alreadyRated = teammateRatings.some(
    (r) =>
      r.reviewerId === currentUser.id &&
      r.targetUserId === ratingTargetUser.id &&
      r.projectId === selectedProjectId
  );

  const calculateOverall = () => {
    return Number(((communication + reliability + collaboration + qualityOfDeliverables) / 4).toFixed(1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isSelfRating) {
      setErrorMsg('You cannot rate your own contributions.');
      return;
    }

    if (alreadyRated) {
      setErrorMsg('You have already submitted a rating for this teammate on this project.');
      return;
    }

    if (!writtenFeedback.trim()) {
      setErrorMsg('Please include a brief written note regarding their contributions.');
      return;
    }

    const overallScore = calculateOverall();

    addTeammateRating({
      projectId: selectedProjectId,
      projectTitle: currentProject?.title || 'Shared Team Project',
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      reviewerAvatar: currentUser.avatar,
      reviewerRole: currentUser.identities.includes('Teacher / Professor') ? 'Teacher / Instructor' : 'Peer',
      targetUserId: ratingTargetUser.id,
      targetUserName: ratingTargetUser.name,
      ratings: {
        communication,
        reliability,
        collaboration,
        qualityOfDeliverables,
      },
      overallScore,
      writtenFeedback: writtenFeedback.trim(),
    });

    closeRateTeammateModal();
  };

  const criteriaList = [
    {
      key: 'communication',
      label: 'Communication',
      desc: 'Clarity, standup attendance, responsiveness, transparency on blockers',
      value: communication,
      setter: setCommunication,
    },
    {
      key: 'reliability',
      label: 'Reliability & Dependability',
      desc: 'Meeting project deadlines, fulfilling assigned tasks, commitment to sprint goals',
      value: reliability,
      setter: setReliability,
    },
    {
      key: 'collaboration',
      label: 'Collaboration & Team Spirit',
      desc: 'Receptiveness to feedback, active pair programming/brainstorming, supporting peers',
      value: collaboration,
      setter: setCollaboration,
    },
    {
      key: 'qualityOfDeliverables',
      label: 'Quality of Deliverables',
      desc: 'Code rigor, thorough documentation, attention to requirements & test cases',
      value: qualityOfDeliverables,
      setter: setQualityOfDeliverables,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <img
              src={ratingTargetUser.avatar}
              alt={ratingTargetUser.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                Rate Teammate: {ratingTargetUser.name}
              </h3>
              <p className="text-xs text-slate-500">
                {ratingTargetUser.school || ratingTargetUser.jobTitle || 'Collaborator'}
              </p>
            </div>
          </div>
          <button
            onClick={closeRateTeammateModal}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Project Association */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Associated Collaborative Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {allProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.discipline || p.school || p.author.school || p.courseName || 'Team Project'})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Ratings are permanently tied to verified projects to prevent fake or anonymous spam.
            </p>
          </div>

          {/* Validation Errors */}
          {isSelfRating && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Self-ratings are prohibited by academic integrity and peer review policies.</span>
            </div>
          )}

          {alreadyRated && (
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>You have already submitted peer feedback for this project. Only one review per project is permitted.</span>
            </div>
          )}

          {errorMsg && !isSelfRating && !alreadyRated && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 4 Criteria Sliders / Star Pickers */}
          <div className="space-y-4 pt-1">
            {criteriaList.map((crit) => (
              <div key={crit.key} className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800">{crit.label}</span>
                  <span className="text-xs font-black text-blue-600 tabular-nums">
                    {crit.value} / 5.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">{crit.desc}</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => crit.setter(star)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        star <= crit.value
                          ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          star <= crit.value ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                        }`}
                      />
                      <span>{star}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Overall score preview */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs">
            <span className="font-semibold text-blue-900">Computed Overall Score:</span>
            <div className="flex items-center gap-1.5 font-black text-blue-700 text-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{calculateOverall()} / 5.0</span>
            </div>
          </div>

          {/* Written Feedback */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Written Peer Review & Evidence Notes
            </label>
            <textarea
              value={writtenFeedback}
              onChange={(e) => setWrittenFeedback(e.target.value)}
              placeholder="Describe specific tasks completed, technical strengths, standup communication, or areas of contribution..."
              rows={3}
              className="w-full text-xs border border-slate-200 rounded-lg p-3 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Visible on profile & contribution reports with reviewer attribution.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={closeRateTeammateModal}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSelfRating || alreadyRated}
              className="px-5 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Submit Teammate Rating
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
