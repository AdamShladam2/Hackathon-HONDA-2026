import React, { useEffect, useRef, useState } from 'react';
import {
  Upload,
  FileText,
  Trash2,
  GraduationCap,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Download,
  Plus,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CanvasAssignment, CanvasSubmissionFile, ProjectAttachedFile } from '../types';
import {
  MAX_UPLOAD_BYTES,
  storeUploadedFile,
  deleteFileBlob,
  openAttachedFile,
  formatBytes,
  describeFileType,
} from '../services/fileStore';

interface FileAttachmentInputProps {
  files: ProjectAttachedFile[];
  onChange: (files: ProjectAttachedFile[]) => void;
  // When provided, each new file can be attributed to a team member
  attributionOptions?: { id: string; name: string; label?: string }[];
  defaultAttributionId?: string;
  // Shows the "Import from Canvas" panel (Campus mode)
  allowCanvasImport?: boolean;
  // Preselects the Canvas course matching this course code
  canvasCourseCode?: string;
}

const STATUS_LABELS: Record<CanvasAssignment['submissionStatus'], string> = {
  graded: 'Graded',
  submitted: 'Submitted',
  pending_review: 'Pending review',
  unsubmitted: 'Not submitted',
};

export const FileAttachmentInput: React.FC<FileAttachmentInputProps> = ({
  files,
  onChange,
  attributionOptions,
  defaultAttributionId,
  allowCanvasImport = false,
  canvasCourseCode,
}) => {
  const { showToast, canvasConnection, loadCanvasAssignments, openCanvasModal } = useApp();

  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [attributionId, setAttributionId] = useState(defaultAttributionId || 'team');
  const [note, setNote] = useState('');

  // Canvas import state
  const [showCanvas, setShowCanvas] = useState(false);
  const [courseId, setCourseId] = useState('');
  const [assignments, setAssignments] = useState<CanvasAssignment[]>([]);
  const [assignmentSource, setAssignmentSource] = useState<'canvas_api' | 'directory'>('directory');
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [assignmentsError, setAssignmentsError] = useState('');

  const normalizeCode = (code = '') => code.replace(/\s+/g, '').toUpperCase();

  useEffect(() => {
    if (!showCanvas || courseId || !canvasConnection.isConnected) return;
    const match = canvasConnection.courses.find(
      (c) => canvasCourseCode && normalizeCode(c.courseCode) === normalizeCode(canvasCourseCode)
    );
    setCourseId(match?.id || canvasConnection.courses[0]?.id || '');
  }, [showCanvas, courseId, canvasConnection, canvasCourseCode]);

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    setLoadingAssignments(true);
    setAssignmentsError('');
    loadCanvasAssignments(courseId)
      .then((res) => {
        if (cancelled) return;
        setAssignments(res.assignments);
        setAssignmentSource(res.source);
      })
      .catch((err) => {
        if (cancelled) return;
        setAssignments([]);
        setAssignmentsError(err?.message || 'Could not load assignments from Canvas.');
      })
      .finally(() => {
        if (!cancelled) setLoadingAssignments(false);
      });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const attribution = () => {
    if (!attributionOptions) return {};
    if (attributionId === 'team') {
      return { labeledStudentId: 'team', labeledStudentName: 'Whole Team Deliverable' };
    }
    const person = attributionOptions.find((o) => o.id === attributionId);
    return { labeledStudentId: attributionId, labeledStudentName: person?.name };
  };

  const handleFiles = async (picked: FileList | null) => {
    if (!picked || picked.length === 0) return;
    const accepted = Array.from(picked).filter((f) => {
      if (f.size > MAX_UPLOAD_BYTES) {
        showToast(`"${f.name}" is larger than ${formatBytes(MAX_UPLOAD_BYTES)} and was skipped.`, 'warning');
        return false;
      }
      return true;
    });
    if (accepted.length === 0) return;

    setIsSaving(true);
    try {
      const added = await Promise.all(
        accepted.map((f) => storeUploadedFile(f, { ...attribution(), description: note.trim() || undefined }))
      );
      onChange([...files, ...added]);
      setNote('');
      showToast(`Attached ${added.length} file${added.length > 1 ? 's' : ''}`, 'success');
    } catch (err) {
      console.warn('Failed to store uploaded file:', err);
      showToast('Could not save the file in this browser. Please try again.', 'warning');
    } finally {
      setIsSaving(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const isCanvasFileAttached = (file: CanvasSubmissionFile) =>
    files.some((f) => f.id === `canvas-${file.id}`);

  const attachCanvasFiles = (assignment: CanvasAssignment, toAttach: CanvasSubmissionFile[]) => {
    const fresh = toAttach.filter((f) => !isCanvasFileAttached(f));
    if (fresh.length === 0) return;
    const added: ProjectAttachedFile[] = fresh.map((f) => ({
      id: `canvas-${f.id}`,
      name: f.displayName,
      size: formatBytes(f.sizeBytes),
      type: describeFileType(f.displayName, f.contentType),
      mimeType: f.contentType || undefined,
      url: f.url,
      source: 'canvas',
      canvasCourseCode: assignment.courseCode,
      canvasAssignmentName: assignment.name,
      description: note.trim() || `Submitted on Canvas for ${assignment.courseCode}: ${assignment.name}`,
      uploadedAt: new Date().toISOString(),
      ...attribution(),
    }));
    onChange([...files, ...added]);
    showToast(`Imported ${added.length} file${added.length > 1 ? 's' : ''} from Canvas`, 'success');
  };

  const removeFile = (file: ProjectAttachedFile) => {
    if (file.storageKey) deleteFileBlob(file.storageKey).catch(() => undefined);
    onChange(files.filter((f) => f.id !== file.id));
  };

  const openFile = async (file: ProjectAttachedFile) => {
    const opened = await openAttachedFile(file);
    if (!opened) showToast(`"${file.name}" is not available in this browser.`, 'warning');
  };

  return (
    <div className="space-y-3">
      {/* Attached files */}
      {files.length > 0 ? (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between gap-3 p-2.5 bg-white border border-slate-200 rounded-xl"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    file.source === 'canvas' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  {file.source === 'canvas' ? <GraduationCap className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900 truncate">{file.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-mono">
                      {file.type} · {file.size}
                    </span>
                    {file.source === 'canvas' && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-red-50 text-red-700 border border-red-200 rounded font-semibold">
                        Canvas · {file.canvasCourseCode}
                      </span>
                    )}
                  </div>
                  {file.description && <p className="text-[11px] text-slate-500 truncate mt-0.5">{file.description}</p>}
                  {file.labeledStudentName && (
                    <span className="mt-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-md inline-flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-emerald-600" />
                      {file.labeledStudentName}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {(file.storageKey || (file.url && file.url !== '#')) && (
                  <button
                    type="button"
                    onClick={() => openFile(file)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                    title={file.source === 'canvas' ? 'Open in Canvas' : 'Open file'}
                  >
                    {file.source === 'canvas' ? <ExternalLink className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(file)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500 italic">No files attached yet.</p>
      )}

      {/* Attribution + note applied to the next files added */}
      <div className={`grid grid-cols-1 ${attributionOptions ? 'sm:grid-cols-2' : ''} gap-2.5`}>
          {attributionOptions && (
            <div>
              <label className="block text-[11px] font-bold text-emerald-800 mb-0.5">Label Files to Student</label>
              <select
                value={attributionId}
                onChange={(e) => setAttributionId(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 bg-emerald-50/50 border border-emerald-300 rounded-lg text-emerald-950 font-medium"
              >
                <option value="team">Whole Team Deliverable</option>
                {attributionOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label || o.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">File Note (Optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Final report with benchmark results"
              className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
            />
          </div>
        </div>

      {/* Upload dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-1.5 p-5 rounded-xl border-2 border-dashed text-center cursor-pointer transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/40'
        }`}
      >
        {isSaving ? (
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        ) : (
          <Upload className="w-5 h-5 text-blue-600" />
        )}
        <span className="text-xs font-bold text-slate-800">
          {isSaving ? 'Saving files...' : 'Drop files here or click to upload'}
        </span>
        <span className="text-[11px] text-slate-500">
          Reports, code archives, datasets, slides, CAD and images · up to {formatBytes(MAX_UPLOAD_BYTES)} each
        </span>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Canvas import */}
      {allowCanvasImport && (
        <div className="border border-red-200 bg-red-50/40 rounded-xl">
          <button
            type="button"
            onClick={() => (canvasConnection.isConnected ? setShowCanvas(!showCanvas) : openCanvasModal())}
            className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-xs font-bold text-red-800 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-red-600" />
              Import files from your Canvas assignments
            </span>
            <span className="text-[11px] font-semibold text-red-700">
              {canvasConnection.isConnected ? (showCanvas ? 'Hide' : 'Browse') : 'Connect Canvas'}
            </span>
          </button>

          {showCanvas && canvasConnection.isConnected && (
            <div className="px-3.5 pb-3.5 space-y-3">
              <div className="flex items-center gap-2">
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="flex-1 text-xs px-2.5 py-1.5 bg-white border border-red-200 rounded-lg"
                >
                  {canvasConnection.courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.courseCode}: {c.name}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 shrink-0">
                  {assignmentSource === 'canvas_api' ? 'Live from Canvas' : `${canvasConnection.institutionName} directory`}
                </span>
              </div>

              {loadingAssignments ? (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading assignments...
                </div>
              ) : assignmentsError ? (
                <p className="text-xs text-rose-600 font-semibold">{assignmentsError}</p>
              ) : assignments.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No assignments found for this course.</p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {assignments.map((a) => {
                    const remaining = a.submittedFiles.filter((f) => !isCanvasFileAttached(f));
                    return (
                      <div key={a.id} className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <a
                              href={a.htmlUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-bold text-slate-900 hover:text-red-700 inline-flex items-center gap-1"
                            >
                              {a.name}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <div className="text-[10px] text-slate-500">
                              {STATUS_LABELS[a.submissionStatus]}
                              {a.dueAt ? ` · Due ${new Date(a.dueAt).toLocaleDateString()}` : ''}
                              {a.pointsPossible != null ? ` · ${a.pointsPossible} pts` : ''}
                            </div>
                          </div>
                          {remaining.length > 1 && (
                            <button
                              type="button"
                              onClick={() => attachCanvasFiles(a, remaining)}
                              className="text-[11px] font-semibold text-red-700 hover:text-red-900 shrink-0 cursor-pointer"
                            >
                              Attach all
                            </button>
                          )}
                        </div>
                        {a.submittedFiles.length === 0 ? (
                          <p className="text-[11px] text-slate-400 italic">No submitted files</p>
                        ) : (
                          a.submittedFiles.map((f) => {
                            const attached = isCanvasFileAttached(f);
                            return (
                              <div key={f.id} className="flex items-center justify-between gap-2 text-[11px]">
                                <span className="truncate text-slate-700">
                                  {f.displayName} <span className="text-slate-400">· {formatBytes(f.sizeBytes)}</span>
                                </span>
                                <button
                                  type="button"
                                  disabled={attached}
                                  onClick={() => attachCanvasFiles(a, [f])}
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold shrink-0 ${
                                    attached
                                      ? 'text-emerald-700 bg-emerald-50 cursor-default'
                                      : 'text-red-700 bg-red-50 hover:bg-red-100 cursor-pointer'
                                  }`}
                                >
                                  {attached ? <CheckCircle2 className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                  {attached ? 'Attached' : 'Attach'}
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
