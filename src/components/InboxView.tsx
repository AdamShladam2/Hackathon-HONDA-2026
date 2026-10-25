import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { openAttachedFile } from '../services/fileStore';
import {
  MessageSquare,
  UserPlus,
  KeyRound,
  Check,
  X,
  ExternalLink,
  Send,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FolderKanban,
  FileCheck2,
  GraduationCap,
  Briefcase,
  FileText,
} from 'lucide-react';

export const InboxView: React.FC = () => {
  const {
    currentUser,
    showToast,
    messages,
    invitations,
    codeRequests,
    applications,
    inboxTab,
    setInboxTab,
    acceptInvitation,
    declineInvitation,
    acceptCodeRequest,
    declineCodeRequest,
    acceptApplication,
    declineApplication,
    sendReply,
    markMessageRead,
    setSelectedProject,
    openWorkspace,
    projects,
    classProjects,
  } = useApp();

  const [activeMessageId, setActiveMessageId] = useState<string | null>(
    messages.length > 0 ? messages[0].id : null
  );
  const [replyText, setReplyText] = useState('');

  const activeMessage = messages.find((m) => m.id === activeMessageId) || messages[0] || null;

  const handleSelectMessage = (msgId: string) => {
    setActiveMessageId(msgId);
    markMessageRead(msgId);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMessage || !replyText.trim()) return;
    sendReply(activeMessage.id, replyText.trim());
    setReplyText('');
  };

  // Incoming items for currentUser
  const myIncomingApplications = applications.filter(
    (a) => a.projectOwnerId === currentUser.id
  );
  const mySentApplications = applications.filter(
    (a) => a.applicant.id === currentUser.id
  );

  const pendingIncomingApps = myIncomingApplications.filter((a) => a.status === 'pending').length;
  const unreadMessages = messages.filter((m) => m.toUserId === currentUser.id && !m.read).length;
  const pendingInvitations = invitations.filter((i) => i.toUserId === currentUser.id && i.status === 'pending').length;
  const pendingCodeRequests = codeRequests.filter((r) => r.toUserId === currentUser.id && r.status === 'pending').length;

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Inbox & Collaboration Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.jobTitle || currentUser.identities.join(', ')})
          </p>
        </div>

        {/* 4 Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setInboxTab('applications')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              inboxTab === 'applications'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Applications</span>
            {pendingIncomingApps > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-blue-600 text-white rounded-full tabular-nums">
                {pendingIncomingApps}
              </span>
            )}
          </button>

          <button
            onClick={() => setInboxTab('invitations')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              inboxTab === 'invitations'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-purple-600" />
            <span>Invitations</span>
            {pendingInvitations > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-purple-600 text-white rounded-full tabular-nums">
                {pendingInvitations}
              </span>
            )}
          </button>

          <button
            onClick={() => setInboxTab('messages')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              inboxTab === 'messages'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Messages</span>
            {unreadMessages > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-blue-600 text-white rounded-full tabular-nums">
                {unreadMessages}
              </span>
            )}
          </button>

          <button
            onClick={() => setInboxTab('codeRequests')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              inboxTab === 'codeRequests'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Code Requests</span>
            {pendingCodeRequests > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-amber-600 text-white rounded-full tabular-nums">
                {pendingCodeRequests}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab: Project Applications (Incoming & Sent) */}
      {inboxTab === 'applications' && (
        <div className="space-y-6">
          {/* Incoming Applications to My Projects */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Incoming Applications for Your Projects ({myIncomingApplications.length})
              </h2>
              <span className="text-[11px] text-slate-500">
                Review applicant qualifications and accept into team workspace
              </span>
            </div>

            {myIncomingApplications.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-400">
                No incoming applications right now. (Switch to <strong>Sarah Lin</strong> to review Alex Chen&apos;s application!)
              </div>
            ) : (
              <div className="space-y-3">
                {myIncomingApplications.map((app) => {
                  const targetProject = projects.find((p) => p.id === app.projectId);

                  return (
                    <div
                      key={app.id}
                      className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={app.applicant.avatar}
                            alt={app.applicant.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border border-slate-300 shrink-0"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-slate-900">
                                {app.applicant.name}
                              </span>
                              <span className="text-xs text-slate-500">
                                ({app.applicant.school || app.applicant.organization || app.applicant.identities.join(', ')})
                              </span>
                              {app.isStudentApplication && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                                  <GraduationCap className="w-3 h-3 text-emerald-600" />
                                  Student Applicant
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-blue-700 font-semibold">
                              Applying for role: <span className="text-slate-900">{app.roleApplied}</span> on{' '}
                              <strong className="text-blue-800">{app.projectTitle}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Status / Accept buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          {app.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => declineApplication(app.id)}
                                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() => acceptApplication(app.id)}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Accept Application</span>
                              </button>
                            </>
                          ) : app.status === 'accepted' ? (
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>Accepted · On Team</span>
                              </span>
                              {targetProject && (
                                <button
                                  onClick={() => openWorkspace(targetProject)}
                                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-1"
                                >
                                  <span>Open Workspace</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium bg-slate-100 px-3 py-1.5 rounded-lg">
                              Declined
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Application note & availability */}
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1.5">
                        <p className="text-slate-700 leading-relaxed italic">
                          &quot;{app.introduction}&quot;
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                          <span>
                            <strong>Availability:</strong> {app.availability}
                          </span>
                          {app.learningGoals && (
                            <span>
                              <strong>Learning Goals:</strong> {app.learningGoals}
                            </span>
                          )}
                          <span>
                            <strong>Skills:</strong> {app.applicant.skills?.slice(0, 4).join(', ') || 'Software Dev'}
                          </span>
                          {app.resume && (
                            <button
                              onClick={async () => {
                                if (!(await openAttachedFile(app.resume!))) showToast('This resume is not stored in this browser.', 'warning');
                              }}
                              className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline cursor-pointer"
                            >
                              <FileText className="w-3 h-3" />
                              View resume
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Applications Sent by currentUser */}
          {mySentApplications.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Applications You Submitted ({mySentApplications.length})
              </h2>
              <div className="space-y-2">
                {mySentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{app.projectTitle}</span>
                      <span className="text-[11px] text-slate-500">
                        Role: {app.roleApplied} · Submitted {new Date(app.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                        app.status === 'accepted'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : app.status === 'declined'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {app.status === 'accepted' ? 'Accepted ✓' : app.status === 'declined' ? 'Declined' : 'Under Review'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Invitations */}
      {inboxTab === 'invitations' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Accepting an invitation immediately adds you to that project&apos;s team roster visible on the Showcase.
          </p>

          {invitations.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-400">
              No collaboration invitations right now.
            </div>
          ) : (
            <div className="space-y-3">
              {invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={inv.fromUser.avatar}
                      alt={inv.fromUser.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">
                          {inv.fromUser.name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          ({inv.fromUser.school || inv.fromUser.jobTitle || 'Lead'})
                        </span>
                        <span className="text-xs text-slate-400">invited you to join:</span>
                      </div>

                      <h3 className="text-sm font-bold text-blue-600">
                        {inv.projectTitle}
                      </h3>

                      {inv.assignmentName ? (
                        inv.roleOffered && inv.roleOffered !== 'Teammate' && (
                          <div className="inline-block text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded">
                            Could work on: <span className="font-semibold text-slate-900">{inv.roleOffered}</span>
                          </div>
                        )
                      ) : (
                        <div className="inline-block text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded">
                          Offered Role: <span className="font-semibold text-slate-900">{inv.roleOffered}</span>
                        </div>
                      )}

                      <p className="text-xs text-slate-600 pt-1 leading-relaxed max-w-2xl bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        &quot;{inv.note}&quot;
                      </p>
                    </div>
                  </div>

                  {/* Actions / Status */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {inv.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => declineInvitation(inv.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => acceptInvitation(inv.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept & Join Team</span>
                        </button>
                      </>
                    ) : inv.status === 'accepted' ? (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Accepted · You are on this team</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium bg-slate-100 px-3 py-1.5 rounded-lg">
                        Declined
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Messages */}
      {inboxTab === 'messages' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs min-h-[460px]">
          {/* Thread list */}
          <div className="border-r border-slate-200 divide-y divide-slate-100 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No messages yet.</div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    activeMessageId === msg.id
                      ? 'bg-blue-50/70 border-l-2 border-blue-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {msg.fromUser.name}
                    </span>
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mb-1">
                    {msg.fromUser.school || msg.fromUser.jobTitle || 'Colleague'}
                  </div>
                  {msg.projectTitle && (
                    <div className="text-[11px] font-semibold text-blue-700 truncate mb-1">
                      Re: {msg.projectTitle}
                    </div>
                  )}
                  <p className="text-xs text-slate-600 line-clamp-2">{msg.content}</p>
                </div>
              ))
            )}
          </div>

          {/* Active Conversation View */}
          <div className="md:col-span-2 flex flex-col justify-between p-6">
            {activeMessage ? (
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  {/* Sender Header */}
                  <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={activeMessage.fromUser.avatar}
                        alt={activeMessage.fromUser.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {activeMessage.fromUser.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {activeMessage.fromUser.school || activeMessage.fromUser.jobTitle}
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-xs text-slate-400">
                      {new Date(activeMessage.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>

                  {/* Project Reference banner */}
                  {activeMessage.projectTitle && (
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center justify-between">
                      <span className="text-slate-600">
                        Discussing project:{' '}
                        <strong className="text-slate-900">{activeMessage.projectTitle}</strong>
                      </span>
                      {activeMessage.projectId && (
                        <button
                          onClick={() => {
                            const p = [...projects, ...classProjects].find(
                              (item) => item.id === activeMessage.projectId
                            );
                            if (p) setSelectedProject(p);
                          }}
                          className="text-blue-600 hover:underline font-semibold"
                        >
                          View project
                        </button>
                      )}
                    </div>
                  )}

                  {/* Original message content */}
                  <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                    {activeMessage.content}
                  </div>

                  {/* Replies thread */}
                  {activeMessage.replies && activeMessage.replies.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Thread replies
                      </div>
                      {activeMessage.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1 ml-4"
                        >
                          <div className="flex items-center justify-between font-semibold text-[11px] text-blue-900">
                            <span>{reply.fromUserName} (You)</span>
                            <span className="text-slate-400 font-normal">
                              {new Date(reply.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p>{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reply composer */}
                <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to ${activeMessage.fromUser.name}...`}
                      className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-slate-400">
                Select a message from the left to read.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Code Requests */}
      {inboxTab === 'codeRequests' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Accepting a code request reveals the source repository link to that requester only.
          </p>

          {codeRequests.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-400">
              No code access requests right now.
            </div>
          ) : (
            <div className="space-y-3">
              {codeRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={req.fromUser.avatar}
                      alt={req.fromUser.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">
                          {req.fromUser.name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          ({req.fromUser.school || req.fromUser.jobTitle || 'Developer'})
                        </span>
                        <span className="text-xs text-slate-400">requested code access for:</span>
                      </div>

                      <h3 className="text-sm font-bold text-amber-800">
                        {req.projectTitle}
                      </h3>

                      <p className="text-xs text-slate-600 pt-1 leading-relaxed max-w-2xl bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/60">
                        &quot;{req.note}&quot;
                      </p>

                      {req.revealedRepoUrl && (
                        <div className="pt-2 text-xs text-slate-600 flex items-center gap-2">
                          <span className="font-semibold text-emerald-700">Revealed repository link:</span>
                          <a
                            href={req.revealedRepoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 font-mono underline inline-flex items-center gap-1"
                          >
                            <span>{req.revealedRepoUrl}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions / Status */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {req.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => declineCodeRequest(req.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => acceptCodeRequest(req.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-2xs cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Approve & Reveal Repo</span>
                        </button>
                      </>
                    ) : req.status === 'accepted' ? (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Access Approved</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium bg-slate-100 px-3 py-1.5 rounded-lg">
                        Declined
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
