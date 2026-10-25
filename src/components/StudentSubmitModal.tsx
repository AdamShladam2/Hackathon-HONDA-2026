import React, { useState } from 'react';
import {
  X,
  Upload,
  FileText,
  Code2,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Paperclip,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProjectAttachedFile } from '../types';
import { FileAttachmentInput } from './FileAttachmentInput';

export const StudentSubmitModal: React.FC = () => {
  const {
    isStudentSubmitModalOpen,
    targetAssignmentForSubmission,
    closeStudentSubmitModal,
    currentUser,
    submitStudentWork,
    showToast,
    campusClassAssignments: classAssignments,
  } = useApp();

  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(
    targetAssignmentForSubmission?.id || classAssignments[0]?.id || ''
  );

  const assignment = classAssignments.find((a) => a.id === selectedAssignmentId) || targetAssignmentForSubmission;

  const [textContent, setTextContent] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [individualContributionDesc, setIndividualContributionDesc] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<ProjectAttachedFile[]>([]);

  React.useEffect(() => {
    if (assignment) {
      setSelectedAssignmentId(assignment.id);
    }
  }, [assignment, currentUser]);

  if (!isStudentSubmitModalOpen) return null;

  const isGroup = assignment?.assignmentType?.toLowerCase() === 'group';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment) return;
    if (attachedFiles.length === 0) {
      showToast('Upload your project files or folder before submitting.', 'warning');
      return;
    }
    if (githubUrl.trim() && !/^https:\/\/(www\.)?github\.com\/[^/\s]+\/[^/\s]+/i.test(githubUrl.trim())) {
      showToast('The GitHub link should look like https://github.com/user/repo.', 'warning');
      return;
    }

    submitStudentWork({
      assignmentId: assignment.id,
      assignmentTitle: assignment.title,
      classCode: assignment.classCode,
      className: assignment.className,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160',
      isGroupSubmission: isGroup,
      revisionStatus: 'Original',
      textContent,
      githubUrl: githubUrl.trim() || undefined,
      individualContributionDesc: individualContributionDesc.trim(),
      attachedFiles: attachedFiles.length > 0 ? attachedFiles : undefined,
    });
    setAttachedFiles([]);

    closeStudentSubmitModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                Course Assignment Submission
              </span>
              <span className="text-xs text-slate-500">
                Submitting as: <strong className="text-slate-700 dark:text-slate-300">{currentUser.name}</strong>
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {assignment ? `${assignment.classCode}: ${assignment.title}` : 'Submit Class Project'}
            </h2>
          </div>

          <button
            onClick={closeStudentSubmitModal}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assignment *
            </label>
            <select
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              required
            >
              {classAssignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.classCode}: {a.title} (Due: {a.dueDate})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <Paperclip className="w-3.5 h-3.5" />
              Project Files or Folder *
            </label>
            <FileAttachmentInput
              files={attachedFiles}
              onChange={setAttachedFiles}
              allowCanvasImport
              canvasCourseCode={assignment?.classCode}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              GitHub Repository (Optional)
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>

          {isGroup && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Part of the Group Work *
              </label>
              <input
                type="text"
                value={individualContributionDesc}
                onChange={(e) => setIndividualContributionDesc(e.target.value)}
                placeholder="Which components, tests, or documents did you write?"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Note for Your Instructor (Optional)
            </label>
            <textarea
              rows={2}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Anything your instructor should know about this submission"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Academic Integrity Notice:</span> Submissions are compared against registered course references and peer works using deterministic n-gram shingle matching. Quotes from assignment instructions are recognized as boilerplate.
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={closeStudentSubmitModal}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Submit Work
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
