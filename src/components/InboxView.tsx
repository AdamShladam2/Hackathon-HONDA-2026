import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  UserPlus,
  KeyRound,
  CheckCircle2,
  XCircle,
  ExternalLink,
  GraduationCap,
  Send,
  Clock,
  Sparkles,
  Github,
  Check,
  X,
  Inbox,
  AlertCircle,
} from 'lucide-react';

export const InboxView: React.FC = () => {
  const {
    inboxMessages,
    inboxInvitations,
    inboxCodeRequests,
    respondToInvitation,
    respondToCodeRequest,
    sendDirectMessage,
    markInboxItemRead,
    markAllInboxRead,
    currentUser,
    projects,
    showcaseProjects,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'messages' | 'invitations' | 'codeRequests'>('messages');

  // Reply form state
  const [replyingToMessageId, setReplyingToMessageId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState<string | null>(null);

  // Filter items intended for current user
  const userMessages = inboxMessages.filter(
    (m) => currentUser && m.toUserId === currentUser.id
  );
  const userInvitations = inboxInvitations.filter(
    (i) => currentUser && i.toUserId === currentUser.id
  );
  const userCodeRequests = inboxCodeRequests.filter(
    (r) => currentUser && r.toUserId === currentUser.id
  );

  const unreadMessagesCount = userMessages.filter((m) => !m.read).length;
  const pendingInvitesCount = userInvitations.filter((i) => i.status === 'pending').length;
  const pendingCodeRequestsCount = userCodeRequests.filter((r) => r.status === 'pending').length;

  const handleSendReply = (msg: (typeof userMessages)[0]) => {
    if (!replyText.trim()) return;
    sendDirectMessage(
      msg.fromUserId,
      replyText.trim(),
      msg.showcaseProjectId,
      msg.showcaseProjectTitle
    );
    setReplySent(msg.id);
    setTimeout(() => {
      setReplySent(null);
      setReplyingToMessageId(null);
      setReplyText('');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Inbox className="w-7 h-7 text-indigo-600" />
            Collaboration Inbox
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Direct communications, project team invitations, and repository access requests.
          </p>
        </div>

        <button
          onClick={markAllInboxRead}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          Mark all as read
        </button>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'messages'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Messages
          {unreadMessagesCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-mono text-[10px] flex items-center justify-center">
              {unreadMessagesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('invitations')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'invitations'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          Invitations
          {pendingInvitesCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-mono text-[10px] flex items-center justify-center">
              {pendingInvitesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('codeRequests')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'codeRequests'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          Code Requests
          {pendingCodeRequestsCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-mono text-[10px] flex items-center justify-center">
              {pendingCodeRequestsCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: MESSAGES */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          {userMessages.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200 p-8 space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="font-bold text-sm text-slate-700">No messages yet</h3>
              <p className="text-xs text-slate-500">
                When other students reach out about your showcase projects, messages will arrive here.
              </p>
            </div>
          ) : (
            userMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => markInboxItemRead('message', msg.id)}
                className={`bg-white rounded-xl border p-5 space-y-3 transition-all ${
                  msg.read
                    ? 'border-slate-200 shadow-xs'
                    : 'border-indigo-300 bg-indigo-50/20 shadow-sm ring-1 ring-indigo-500/10'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {msg.fromUserName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{msg.fromUserName}</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          <GraduationCap className="w-3 h-3 text-indigo-600" />
                          {msg.fromSchoolName}
                        </span>
                      </div>
                      {msg.showcaseProjectTitle && (
                        <div className="text-[11px] font-medium text-indigo-600">
                          Re: {msg.showcaseProjectTitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{msg.createdAt}</span>
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600" title="Unread" />
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded-lg border border-slate-100 whitespace-pre-line">
                  {msg.text}
                </p>

                {/* Reply section */}
                {replyingToMessageId === msg.id ? (
                  <div className="pt-2 space-y-2 border-t border-slate-100">
                    {replySent === msg.id ? (
                      <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5 py-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Reply sent directly to {msg.fromUserName}!
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          placeholder={`Write a reply to ${msg.fromUserName}...`}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setReplyingToMessageId(null)}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSendReply(msg)}
                            className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg"
                          >
                            <Send className="w-3 h-3" />
                            Send Reply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => {
                        setReplyingToMessageId(msg.id);
                        setReplyText('');
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Reply
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: INVITATIONS */}
      {activeTab === 'invitations' && (
        <div className="space-y-4">
          {userInvitations.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200 p-8 space-y-2">
              <UserPlus className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="font-bold text-sm text-slate-700">No collaboration invites</h3>
              <p className="text-xs text-slate-500">
                When other teams invite you to build together, requests appear here.
              </p>
            </div>
          ) : (
            userInvitations.map((inv) => (
              <div
                key={inv.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        Collaboration Invite
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{inv.createdAt}</span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900">{inv.projectTitle}</h3>
                    <div className="text-xs font-semibold text-slate-700">
                      Role Offered:{' '}
                      <span className="text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded font-mono">
                        {inv.roleOffered}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {inv.status === 'accepted' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Accepted · Added to Team
                    </span>
                  )}
                  {inv.status === 'declined' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
                      <XCircle className="w-3.5 h-3.5" />
                      Declined
                    </span>
                  )}
                  {inv.status === 'pending' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      Pending Decision
                    </span>
                  )}
                </div>

                {/* Sender & Note */}
                <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {inv.fromUserName.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-slate-900">{inv.fromUserName}</span>
                    <span className="text-xs text-slate-500">· {inv.fromSchoolName}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{inv.note}"
                  </p>
                </div>

                {/* Action Buttons */}
                {inv.status === 'pending' ? (
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => respondToInvitation(inv.id, false)}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Decline
                    </button>
                    <button
                      onClick={() => respondToInvitation(inv.id, true)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Accept & Join Team
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 text-right">
                    {inv.status === 'accepted'
                      ? 'You are an official member of this project team.'
                      : 'You declined this collaboration invitation.'}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: CODE REQUESTS */}
      {activeTab === 'codeRequests' && (
        <div className="space-y-4">
          {userCodeRequests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200 p-8 space-y-2">
              <KeyRound className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="font-bold text-sm text-slate-700">No code access requests</h3>
              <p className="text-xs text-slate-500">
                When other students request access to your private or coursework repositories, they'll show up here.
              </p>
            </div>
          ) : (
            userCodeRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Code Access Request
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{req.createdAt}</span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900">
                      {req.showcaseProjectTitle}
                    </h3>
                  </div>

                  {/* Status Badge */}
                  {req.status === 'accepted' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Access Granted
                    </span>
                  )}
                  {req.status === 'declined' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
                      <XCircle className="w-3.5 h-3.5" />
                      Declined
                    </span>
                  )}
                  {req.status === 'pending' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      Pending Review
                    </span>
                  )}
                </div>

                {/* Requester Info & Reason */}
                <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {req.fromUserName.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-slate-900">{req.fromUserName}</span>
                    <span className="text-xs text-slate-500">· {req.fromSchoolName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                      Stated Purpose / Use Case:
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      "{req.reason}"
                    </p>
                  </div>
                </div>

                {/* If accepted, show the repo link that was granted */}
                {req.status === 'accepted' && req.grantedRepoUrl && (
                  <div className="rounded-lg bg-emerald-50/70 border border-emerald-200 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase text-emerald-800">
                        Granted Repository Link:
                      </span>
                      <p className="font-mono text-xs text-emerald-950 font-semibold break-all">
                        {req.grantedRepoUrl}
                      </p>
                    </div>
                    <a
                      href={req.grantedRepoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shrink-0 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      Open Repo
                    </a>
                  </div>
                )}

                {/* Decision Actions */}
                {req.status === 'pending' ? (
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => respondToCodeRequest(req.id, false)}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Decline
                    </button>
                    <button
                      onClick={() => respondToCodeRequest(req.id, true)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-xs"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      Accept & Grant Access
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 text-right">
                    {req.status === 'accepted'
                      ? 'Repository access has been approved and shared with the requester.'
                      : 'You declined this repository access request.'}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
