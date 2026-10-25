import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  X,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building,
  KeyRound,
  Mail,
  Sparkles,
  HelpCircle,
  Unlink,
  AlertCircle,
  ChevronRight,
  CalendarDays,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { resolveInstitutionFromEmail, KNOWN_INSTITUTIONS } from '../data/canvasData';
import { isEduEmail } from '../services/campusAccess';

interface CanvasConnectModalProps {
  onClose: () => void;
}

export const CanvasConnectModal: React.FC<CanvasConnectModalProps> = ({ onClose }) => {
  const {
    canvasConnection,
    connectCanvas,
    disconnectCanvas,
    isCanvasConnecting,
    currentUser,
    setActiveView,
    isDemoAccount,
  } = useApp();

  const [email, setEmail] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [calendarFeedUrl, setCalendarFeedUrl] = useState('');
  const [authMode, setAuthMode] = useState<'sso' | 'feed' | 'token'>(isDemoAccount ? 'sso' : 'feed');
  const [connectError, setConnectError] = useState('');
  const [showTokenHelp, setShowTokenHelp] = useState(false);

  // Initialize with current user email or connection email
  useEffect(() => {
    if (canvasConnection.isConnected && canvasConnection.schoolEmail) {
      setEmail(canvasConnection.schoolEmail);
    } else if (isEduEmail(currentUser.email)) {
      // Canvas can only be linked for the account's own campus
      setEmail(currentUser.email || '');
    } else {
      setEmail('');
    }
  }, [canvasConnection, currentUser]);

  const detectedInstitution = resolveInstitutionFromEmail(email || 'student@osu.edu');
  const detectedCanvasHost = detectedInstitution.canvasUrl.replace('https://', '');

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      return;
    }
    if (authMode === 'feed' && !calendarFeedUrl.trim()) {
      setConnectError('Paste your Canvas calendar feed link to load your classes.');
      return;
    }
    if (authMode === 'token' && !apiToken.trim()) {
      setConnectError('Paste your Canvas access token to load your classes.');
      return;
    }
    setConnectError('');

    const res = await connectCanvas(
      email.trim(),
      authMode === 'token' ? apiToken.trim() : undefined,
      customDomain.trim() || undefined,
      authMode === 'feed' ? calendarFeedUrl.trim() : undefined
    );

    if (res.success) {
      onClose();
      setActiveView('canvas-classes');
    } else {
      setConnectError(res.message);
    }
  };

  const handleQuickPreset = (presetEmail: string) => {
    setEmail(presetEmail);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-left relative my-8">
        {/* Header with Canvas Red Accent */}
        <div className="p-6 bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center shadow-lg font-black text-xl">
              <GraduationCap className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md mb-1">
                <span>Instructure Canvas LMS</span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">Connect School Canvas</h2>
            </div>
          </div>
          <p className="text-xs text-red-100 mt-2">
            Use your university email to access classmates from your enrolled courses, find team partners, and coordinate coursework deliverables.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* If already connected, show active status banner */}
          {canvasConnection.isConnected && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Connected to Canvas</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 font-mono text-[10px] text-emerald-800 font-semibold uppercase">
                  {canvasConnection.source === 'canvas_api_token'
                    ? 'Live API Token'
                    : canvasConnection.source === 'canvas_calendar_feed'
                    ? 'Calendar Feed'
                    : 'Campus SSO'}
                </span>
              </div>
              <p className="text-slate-600">
                School Email: <strong className="text-slate-900">{canvasConnection.schoolEmail}</strong>
              </p>
              <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-emerald-200/60">
                <span>
                  {canvasConnection.institutionName} • {canvasConnection.courses.length} courses loaded
                </span>
                <button
                  type="button"
                  onClick={() => {
                    disconnectCanvas();
                  }}
                  className="text-rose-600 hover:text-rose-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleConnect} className="space-y-4">
            {/* School Email Input */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                University / School Email (.edu)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alexchen@buckeyemail.osu.edu or yourname@university.edu"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium"
                />
              </div>

              {/* Detected School Pill */}
              {email && (
                <div className="mt-2 flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-red-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800">{detectedInstitution.name}</span>
                      <span className="text-slate-500 ml-1.5 font-mono text-[11px]">
                        ({detectedInstitution.canvasUrl.replace('https://', '')})
                      </span>
                    </div>
                  </div>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold text-[10px] border border-emerald-200">
                    Auto-Detected
                  </span>
                </div>
              )}
            </div>

            {/* Quick-Pick Demo School Accounts */}
            {isDemoAccount && (
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Quick Select Sample University Email:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickPreset('alexchen@buckeyemail.osu.edu')}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer font-medium ${
                    email === 'alexchen@buckeyemail.osu.edu'
                      ? 'bg-red-50 text-red-700 border-red-300 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  🔴 Ohio State (OSU)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset('jordanlee@purdue.edu')}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer font-medium ${
                    email === 'jordanlee@purdue.edu'
                      ? 'bg-amber-50 text-amber-800 border-amber-300 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  🟡 Purdue Univ
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset('priyapatel@umich.edu')}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer font-medium ${
                    email === 'priyapatel@umich.edu'
                      ? 'bg-blue-50 text-blue-800 border-blue-300 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  🔵 Univ of Michigan
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset('student@berkeley.edu')}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer font-medium ${
                    email === 'student@berkeley.edu'
                      ? 'bg-indigo-50 text-indigo-800 border-indigo-300 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  🐻 UC Berkeley
                </button>
              </div>
            </div>
            )}

            {/* Connection Mode Options */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Authentication Mode
                </span>
                <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
                  {isDemoAccount && (
                  <button
                    type="button"
                    onClick={() => setAuthMode('sso')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                      authMode === 'sso'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Sample classes (demo)
                  </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setAuthMode('feed')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                      authMode === 'feed'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Calendar feed
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('token')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                      authMode === 'token'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Access token
                  </button>
                </div>
              </div>

              {authMode === 'feed' ? (
                <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
                    <span>Canvas calendar feed link</span>
                  </label>
                  <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-slate-600">
                    <li>Open Canvas ({detectedCanvasHost}) and click <strong>Calendar</strong> in the left sidebar</li>
                    <li>Click <strong>Calendar Feed</strong> at the bottom right</li>
                    <li>Copy the link and paste it here</li>
                  </ol>
                  <input
                    type="url"
                    value={calendarFeedUrl}
                    onChange={(e) => setCalendarFeedUrl(e.target.value)}
                    placeholder={`https://${detectedCanvasHost}/feeds/calendars/user_....ics`}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <p className="text-[11px] text-slate-500">
                    No token needed. Loads your classes and assignment due dates. Keep this link private, since anyone with it can see your calendar.
                  </p>
                </div>
              ) : authMode === 'token' ? (
                <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                      <span>Canvas Personal Access Token</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowTokenHelp(!showTokenHelp)}
                      className="text-blue-600 hover:underline flex items-center gap-0.5 text-[11px]"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>How to get a token?</span>
                    </button>
                  </div>

                  {showTokenHelp && (
                    <div className="p-2.5 rounded-lg bg-blue-50 text-blue-900 text-[11px] space-y-1">
                      <p className="font-bold">Generating a Canvas Token:</p>
                      <ol className="list-decimal list-inside space-y-0.5 text-blue-800">
                        <li>Log into your university Canvas instance</li>
                        <li>Click <strong>Account</strong> in left sidebar → <strong>Settings</strong></li>
                        <li>Scroll down to <strong>Approved Integrations</strong></li>
                        <li>Click <strong>+ New Access Token</strong>, give it a purpose, and copy the token string</li>
                      </ol>
                    </div>
                  )}

                  <label className="block font-semibold text-slate-700 pt-1">Canvas address</label>
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder={detectedCanvasHost}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <p className="text-[11px] text-slate-500">
                    Leave blank to use {detectedCanvasHost}. Use the address you see in your browser when you open Canvas (e.g. canvas.instructure.com for a personal Canvas account).
                  </p>
                  <label className="block font-semibold text-slate-700 pt-1">Access token</label>
                  <input
                    type="password"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    placeholder="e.g. 7~abcd1234efgh5678..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Validates your university affiliation via school email SSO domain verification. No third-party passwords required.
                  </span>
                </div>
              )}
            </div>

            {/* Scope / Permissions Note */}
            <div className="text-[11px] text-slate-500 space-y-1 pt-1">
              <span className="font-semibold text-slate-700 block">Permissions requested:</span>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Read active course enrollments and course codes (Spring 2026)</span>
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>View peers in your course sections who are looking for project teammates</span>
              </p>
            </div>

            {connectError && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                {connectError}
              </p>
            )}

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-800 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCanvasConnecting || !email}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isCanvasConnecting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting Canvas...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Connect & Load Classmates</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
