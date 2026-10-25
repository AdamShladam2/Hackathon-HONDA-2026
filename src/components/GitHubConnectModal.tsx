import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Github,
  Star,
  GitBranch,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface GitHubConnectModalProps {
  onClose: () => void;
}

export const GitHubConnectModal: React.FC<GitHubConnectModalProps> = ({ onClose }) => {
  const { connectGitHub, currentUser } = useApp();
  const [username, setUsername] = useState(currentUser.githubUsername || 'alexchen');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setStatusMessage('Connecting to GitHub API...');

    const res = await connectGitHub(username.trim());
    setLoading(false);

    if (res.success) {
      setStatusMessage(
        res.source === 'api'
          ? `Fetched ${res.count} public repos directly from GitHub API!`
          : `Loaded ${res.count} student repositories (mock fallback active).`
      );
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setStatusMessage('Failed to fetch repositories. Please try again.');
    }
  };

  const sampleUsernames = ['alexchen', 'gaearon', 'sindresorhus', 'torvalds'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Connect GitHub Profile</h3>
              <p className="text-[11px] text-slate-500">No personal access token or password required</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Enter your GitHub username to link public repositories directly to your CampusForge profile and attach them to Showcase projects in one click.
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              GitHub Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                @
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full text-sm font-mono pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Quick try options */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-500 block">Try with sample student/dev usernames:</span>
            <div className="flex flex-wrap gap-1.5">
              {sampleUsernames.map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUsername(u)}
                  className="px-2 py-0.5 text-[11px] font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
                >
                  @{u}
                </button>
              ))}
            </div>
          </div>

          {statusMessage && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-black rounded-lg transition-colors cursor-pointer"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? 'Fetching Repos...' : 'Connect & Fetch Repos'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
