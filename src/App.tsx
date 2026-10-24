import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ExploreFeed } from './components/ExploreFeed';
import { ClassProjectsView } from './components/ClassProjectsView';
import { IdeasView } from './components/IdeasView';
import { ProfileView } from './components/ProfileView';
import { ShowcaseView } from './components/ShowcaseView';
import { InboxView } from './components/InboxView';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { CreateProjectModal } from './components/CreateProjectModal';
import { PostIdeaModal } from './components/PostIdeaModal';
import { FindTeammatesModal } from './components/FindTeammatesModal';
import { ShowcaseDetailModal } from './components/ShowcaseDetailModal';
import { ShareProjectModal } from './components/ShareProjectModal';
import { LoginModal } from './components/LoginModal';
import { FloatingJudgeGuide } from './components/FloatingJudgeGuide';

const AppContent: React.FC = () => {
  const { activeTab, currentUser, currentSchool } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pb-16">
        {activeTab === 'explore' && <ExploreFeed />}
        {activeTab === 'classes' && <ClassProjectsView />}
        {activeTab === 'ideas' && <IdeasView />}
        {activeTab === 'showcase' && <ShowcaseView />}
        {activeTab === 'inbox' && <InboxView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Campusr</span>
            <span>·</span>
            <span>{currentSchool?.name || 'College Project & Teammate Platform'}</span>
            <span>·</span>
            <span>Demo Mode (Local State)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Verified .edu student network</span>
            <span>·</span>
            <span>Public Cross-University Showcase & Inbox</span>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <LoginModal />
      <ProjectDetailModal />
      <CreateProjectModal />
      <PostIdeaModal />
      <FindTeammatesModal />
      <ShowcaseDetailModal />
      <ShareProjectModal />
      <FloatingJudgeGuide />
    </div>
  );
};


export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
