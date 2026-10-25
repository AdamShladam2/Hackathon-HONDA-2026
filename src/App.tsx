import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ShowcaseGrid } from './components/ShowcaseGrid';
import { WorkHubView } from './components/WorkHubView';
import { ProjectWorkspaceView } from './components/ProjectWorkspaceView';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ShareProjectModal } from './components/ShareProjectModal';
import { CreateWorkProjectModal } from './components/CreateWorkProjectModal';
import { AccountSwitcherModal } from './components/AccountSwitcherModal';
import { ApplyCollaborateModal } from './components/ApplyCollaborateModal';
import { GitHubConnectModal } from './components/GitHubConnectModal';
import { CollaborateModal } from './components/CollaborateModal';
import { MessageModal } from './components/MessageModal';
import { InboxView } from './components/InboxView';
import { SchoolSectionView } from './components/SchoolSectionView';
import { ProfileView } from './components/ProfileView';
import { DemoFlowBar } from './components/DemoFlowBar';
import { TeacherDashboardView } from './components/TeacherDashboardView';
import { TeammateMatchingView } from './components/TeammateMatchingView';
import { DiscoverView } from './components/DiscoverView';
import { MyProjectsView } from './components/MyProjectsView';
import { ContributionPortfolioModal } from './components/ContributionPortfolioModal';
import { DocumentRevisionViewerModal } from './components/DocumentRevisionViewerModal';
import { SimilarityReportModal } from './components/SimilarityReportModal';
import { AddProjectToClassModal } from './components/AddProjectToClassModal';
import { StudentSubmitModal } from './components/StudentSubmitModal';
import { ContributionAnalysisModal } from './components/ContributionAnalysisModal';
import { RateTeammateModal } from './components/RateTeammateModal';
import { OnboardingModal } from './components/OnboardingModal';
import { CanvasClassmatesView } from './components/CanvasClassmatesView';
import { CanvasConnectModal } from './components/CanvasConnectModal';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

const MainApp: React.FC = () => {
  const {
    activeView,
    selectedProject,
    setSelectedProject,
    activeWorkspaceProject,
    closeWorkspace,
    isShareModalOpen,
    closeShareModal,
    shareModalInitialData,
    isCreateWorkModalOpen,
    closeCreateWorkModal,
    isAccountSwitcherOpen,
    closeAccountSwitcher,
    isApplyModalOpen,
    applyTargetProject,
    closeApplyModal,
    isGitHubModalOpen,
    closeGitHubModal,
    isCollaborateModalOpen,
    collaborateTargetProject,
    closeCollaborateModal,
    isMessageModalOpen,
    messageTargetAuthor,
    messageTargetProject,
    closeMessageModal,
    isCanvasModalOpen,
    closeCanvasModal,
    toasts,
    removeToast,
  } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
      {/* 14-Step Priority Demo Flow Bar */}
      <DemoFlowBar />

      {/* Top Navbar */}
      <Navbar />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Workspace View */}
        {activeView === 'workspace' && activeWorkspaceProject && (
          <ProjectWorkspaceView
            project={activeWorkspaceProject}
            onBack={closeWorkspace}
          />
        )}

        {/* Primary Simplified Student Views */}
        {activeView === 'discover' && <DiscoverView />}

        {(activeView === 'find-teammates' || activeView === 'teammate-match') && (
          <TeammateMatchingView />
        )}

        {/* Canvas LMS Classmates & Course Roster View */}
        {activeView === 'canvas-classes' && <CanvasClassmatesView />}

        {activeView === 'my-projects' && <MyProjectsView />}

        {/* Work Hub View */}
        {activeView === 'work-hub' && (
          <WorkHubView onSelectProject={(project) => setSelectedProject(project)} />
        )}

        {/* Dedicated Teacher Dashboard */}
        {activeView === 'teacher-dashboard' && <TeacherDashboardView />}

        {/* Showcase View */}
        {activeView === 'showcase' && (
          <ShowcaseGrid onSelectProject={(project) => setSelectedProject(project)} />
        )}

        {/* Campus Hub View */}
        {activeView === 'campus-hub' && <SchoolSectionView />}

        {/* Inbox View */}
        {activeView === 'inbox' && <InboxView />}

        {/* Profile View */}
        {activeView === 'profile' && <ProfileView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SkillSink</span>
            <span>·</span>
            <span>Unifying Campus Hub, Work Hub, and Universal Project Showcase</span>
          </div>
          <div>
            <span>Cross-hub collaboration for university students & working professionals</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {isShareModalOpen && (
        <ShareProjectModal
          onClose={closeShareModal}
          initialData={shareModalInitialData}
        />
      )}

      {isCreateWorkModalOpen && (
        <CreateWorkProjectModal
          onClose={closeCreateWorkModal}
          initialData={shareModalInitialData}
        />
      )}

      {isAccountSwitcherOpen && (
        <AccountSwitcherModal onClose={closeAccountSwitcher} />
      )}

      {isApplyModalOpen && applyTargetProject && (
        <ApplyCollaborateModal
          project={applyTargetProject}
          onClose={closeApplyModal}
        />
      )}

      {isGitHubModalOpen && (
        <GitHubConnectModal onClose={closeGitHubModal} />
      )}

      {isCanvasModalOpen && (
        <CanvasConnectModal onClose={closeCanvasModal} />
      )}

      {isCollaborateModalOpen && collaborateTargetProject && (
        <CollaborateModal
          targetProject={collaborateTargetProject}
          onClose={closeCollaborateModal}
        />
      )}

      {isMessageModalOpen && messageTargetAuthor && (
        <MessageModal
          author={messageTargetAuthor}
          project={messageTargetProject}
          onClose={closeMessageModal}
        />
      )}

      {/* Contribution Portfolio & Document Revision History Modals */}
      <ContributionPortfolioModal />
      <DocumentRevisionViewerModal />

      {/* AI Similarity Report, Add Project To Class & Student Submit Modals */}
      <SimilarityReportModal />
      <AddProjectToClassModal />
      <StudentSubmitModal />

      {/* Onboarding, Rate Teammate, and Contribution Analysis Modals */}
      <OnboardingModal />
      <RateTeammateModal />
      <ContributionAnalysisModal />

      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`p-3.5 rounded-xl shadow-lg border text-xs font-medium flex items-center justify-between gap-3 pointer-events-auto transition-all ${
                toast.type === 'success'
                  ? 'bg-slate-900 text-white border-slate-800'
                  : toast.type === 'warning'
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-blue-600 text-white border-blue-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {toast.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : toast.type === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-white shrink-0" />
                ) : (
                  <Info className="w-4 h-4 text-white shrink-0" />
                )}
                <span className="leading-snug">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/70 hover:text-white shrink-0 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
