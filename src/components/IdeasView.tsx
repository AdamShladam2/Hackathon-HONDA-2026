import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Plus,
  MessageSquare,
  ThumbsUp,
  ArrowRight,
  Send,
  User,
  CheckCircle2,
  Check,
  GraduationCap,
} from 'lucide-react';

export const IdeasView: React.FC = () => {
  const {
    ideas,
    currentUser,
    currentSchool,
    expressInterestInIdea,
    addIdeaComment,
    convertIdeaToProject,
    setIsPostIdeaOpen,
    setSelectedStudentId,
    setActiveTab,
  } = useApp();

  const schoolIdeas = ideas.filter((i) => i.schoolId === currentUser?.schoolId);

  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [interestNote, setInterestNote] = useState<Record<string, string>>({});
  const [activeInterestIdeaId, setActiveInterestIdeaId] = useState<string | null>(null);

  const handleSendComment = (ideaId: string) => {
    const text = commentInputs[ideaId];
    if (!text?.trim()) return;
    addIdeaComment(ideaId, text.trim());
    setCommentInputs((prev) => ({ ...prev, [ideaId]: '' }));
  };

  const handleSendInterest = (ideaId: string) => {
    const note = interestNote[ideaId] || 'I would like to help build this!';
    expressInterestInIdea(ideaId, note);
    setActiveInterestIdeaId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-200/90">
        <div>
          <div className="flex items-center gap-2 text-[10px] tracking-wider uppercase font-bold text-indigo-700 mb-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Campus Idea Incubator · {currentSchool?.name}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Student Idea Sparks & Concepts
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
            Early ideas, unsolved campus challenges, and collaborative brainstorms. Say "I'm interested", discuss solutions, or convert your spark into a formal project team.
          </p>
        </div>

        <button
          onClick={() => setIsPostIdeaOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Post an Idea Spark</span>
        </button>
      </div>

      {/* Ideas Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {schoolIdeas.map((idea) => {
          const isAuthor = idea.authorId === currentUser?.id;
          const userAlreadyInterested = idea.interestedUsers.some(
            (u) => u.userId === currentUser?.id
          );

          return (
            <article
              key={idea.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Top Author Bar */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedStudentId(idea.authorId);
                        setActiveTab('profile');
                      }}
                      className="font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                      <span>{idea.authorName}</span>
                    </button>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 font-mono text-[11px]">{idea.authorMajor}</span>
                  </div>

                  <span className="text-slate-400 text-[10px] font-mono">{idea.createdAt}</span>
                </div>

                {/* Title & Problem */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {idea.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {idea.problem}
                  </p>
                </div>

                {/* Skills Needed */}
                <div className="space-y-1.5">
                  <div className="text-[10px] tracking-wider uppercase font-bold text-slate-400">
                    Target Skills Needed
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {idea.skillsNeeded.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/50 font-semibold text-[11px]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interested Teammates Pledges */}
                {idea.interestedUsers.length > 0 && (
                  <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200/70 space-y-2 text-xs">
                    <div className="font-bold text-emerald-950 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pledged Collaborators ({idea.interestedUsers.length})</span>
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {idea.interestedUsers.map((interest, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-slate-700">
                          <strong className="text-slate-900 shrink-0">{interest.userName}:</strong>
                          <span className="italic">"{interest.note}"</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  {/* Say "I'm Interested" */}
                  {userAlreadyInterested ? (
                    <div className="flex items-center gap-1.5 text-emerald-900 font-bold bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 font-mono text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Interest Pledged</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveInterestIdeaId(idea.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>I'm Interested</span>
                    </button>
                  )}

                  {/* Owner Action: Convert into Full Project */}
                  {isAuthor && (
                    <button
                      onClick={() => convertIdeaToProject(idea.id)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                      title="Convert this concept into a launchable project team"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Convert into Project</span>
                    </button>
                  )}
                </div>

                {/* Interest Popover / Form */}
                {activeInterestIdeaId === idea.id && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs animate-in fade-in">
                    <label className="block font-bold text-slate-700 text-[11px]">
                      Share how you can help or what you bring to this idea:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. I am an ECE junior with circuit design experience and can help prototype..."
                      value={interestNote[idea.id] || ''}
                      onChange={(e) =>
                        setInterestNote((prev) => ({ ...prev, [idea.id]: e.target.value }))
                      }
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setActiveInterestIdeaId(null)}
                        className="px-2.5 py-1 text-slate-600 hover:text-slate-800 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSendInterest(idea.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-xs hover:bg-emerald-700 shadow-2xs active:scale-95"
                      >
                        Confirm Interest
                      </button>
                    </div>
                  </div>
                )}

                {/* Comments Section */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] tracking-wider uppercase font-bold">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>Discussion ({idea.comments.length})</span>
                  </div>

                  {idea.comments.length > 0 && (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {idea.comments.map((c) => (
                        <div key={c.id} className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="font-bold text-slate-800">{c.userName}</span>
                            <span className="font-mono">{c.createdAt}</span>
                          </div>
                          <p className="text-slate-600 mt-0.5">{c.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={commentInputs[idea.id] || ''}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({ ...prev, [idea.id]: e.target.value }))
                      }
                      placeholder="Add a thought or recommendation..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendComment(idea.id);
                      }}
                      className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => handleSendComment(idea.id)}
                      className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer active:scale-95"
                      title="Post Comment"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
