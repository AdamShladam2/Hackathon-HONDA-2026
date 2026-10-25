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
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
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

// Folders that are generated or huge and never part of a submission
const SKIPPED_FOLDERS = new Set(['node_modules', '.git', '__pycache__', '.venv', 'venv', '.next', '.idea', '.vscode']);
const SKIPPED_FILES = new Set(['.DS_Store', 'Thumbs.db', 'desktop.ini']);
const MAX_FOLDER_FILES = 500;

interface PickedFile {
  file: File;
  path: string; // "report.pdf" or "my-project/src/app.ts" for files inside a folder
}

const isSkippedPath = (path: string) => {
  const parts = path.split('/');
  return SKIPPED_FILES.has(parts[parts.length - 1]) || parts.slice(0, -1).some((p) => SKIPPED_FOLDERS.has(p));
};

// Walks a dropped folder (File System Entry API) and collects its files with their paths
async function readDroppedEntry(entry: any, parentPath: string, out: PickedFile[]): Promise<void> {
  if (out.length > MAX_FOLDER_FILES) return;
  if (entry.isFile) {
    const file: File = await new Promise((resolve, reject) => entry.file(resolve, reject));
    out.push({ file, path: parentPath + file.name });
  } else if (entry.isDirectory && !SKIPPED_FOLDERS.has(entry.name)) {
    const reader = entry.createReader();
    let batch: any[];
    do {
      batch = await new Promise((resolve, reject) => reader.readEntries(resolve, reject));
      for (const child of batch) await readDroppedEntry(child, `${parentPath}${entry.name}/`, out);
    } while (batch.length > 0);
  }
}

const topFolder = (file: ProjectAttachedFile) =>
  file.source !== 'canvas' && file.name.includes('/') ? file.name.split('/')[0] : null;

const STATUS_LABELS: Record<CanvasAssignment['submissionStatus'], string> = {
  graded: 'Graded',
  submitted: 'Submitted',
  pending_review: 'Pending review',
  unsubmitted: 'Not submitted',
  unknown: 'From your Canvas calendar',
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
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [openFolders, setOpenFolders] = useState<string[]>([]);

  // React doesn't type the folder-picker attribute, so set it directly
  useEffect(() => {
    folderInputRef.current?.setAttribute('webkitdirectory', '');
  }, []);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [attributionId, setAttributionId] = useState(defaultAttributionId || 'team');
  const [note, setNote] = useState('');

  // Canvas import state
  const [showCanvas, setShowCanvas] = useState(false);
  const [courseId, setCourseId] = useState('');
  const [assignments, setAssignments] = useState<CanvasAssignment[]>([]);
  const [assignmentSource, setAssignmentSource] = useState<'canvas_api' | 'calendar_feed' | 'directory'>('directory');
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

  const handleUploads = async (picked: PickedFile[]) => {
    if (picked.length === 0) return;
    const usable = picked.filter((p) => !isSkippedPath(p.path));
    if (usable.length > MAX_FOLDER_FILES) {
      showToast(`That folder has more than ${MAX_FOLDER_FILES} files. Zip it or upload a smaller folder.`, 'warning');
      return;
    }
    const tooBig = usable.filter((p) => p.file.size > MAX_UPLOAD_BYTES);
    if (tooBig.length > 0) {
      showToast(
        `${tooBig.length === 1 ? `"${tooBig[0].path}" is` : `${tooBig.length} files are`} larger than ${formatBytes(
          MAX_UPLOAD_BYTES
        )} and ${tooBig.length === 1 ? 'was' : 'were'} skipped.`,
        'warning'
      );
    }
    const accepted = usable.filter((p) => p.file.size <= MAX_UPLOAD_BYTES);
    if (accepted.length === 0) return;

    setIsSaving(true);
    try {
      const added = await Promise.all(
        accepted.map((p) =>
          storeUploadedFile(p.file, { ...attribution(), description: note.trim() || undefined }, p.path)
        )
      );
      onChange([...files, ...added]);
      setNote('');
      const folders = new Set(added.map(topFolder).filter(Boolean));
      showToast(
        folders.size > 0
          ? `Attached folder ${[...folders].join(', ')} (${added.length} file${added.length > 1 ? 's' : ''})`
          : `Attached ${added.length} file${added.length > 1 ? 's' : ''}`,
        'success'
      );
    } catch (err) {
      console.warn('Failed to store uploaded file:', err);
      showToast('Could not save the files in this browser. Please try again.', 'warning');
    } finally {
      setIsSaving(false);
      if (inputRef.current) inputRef.current.value = '';
      if (folderInputRef.current) folderInputRef.current.value = '';
    }
  };

  const handlePickedList = (list: FileList | null) =>
    handleUploads(Array.from(list || []).map((file) => ({ file, path: file.webkitRelativePath || file.name })));

  const handleDrop = async (dt: DataTransfer) => {
    // Entries must be read synchronously, before the first await
    const entries = Array.from(dt.items || [])
      .map((item) => (item as any).webkitGetAsEntry?.())
      .filter(Boolean);
    if (entries.length === 0 || !entries.some((e: any) => e.isDirectory)) {
      handlePickedList(dt.files);
      return;
    }
    setIsSaving(true);
    const collected: PickedFile[] = [];
    try {
      for (const entry of entries) await readDroppedEntry(entry, '', collected);
    } catch (err) {
      console.warn('Failed to read dropped folder:', err);
    }
    setIsSaving(false);
    handleUploads(collected);
  };

  const removeFolder = (folder: string) => {
    const inFolder = files.filter((f) => topFolder(f) === folder);
    inFolder.forEach((f) => f.storageKey && deleteFileBlob(f.storageKey).catch(() => undefined));
    onChange(files.filter((f) => topFolder(f) !== folder));
  };

  // Folder uploads show as one collapsible row instead of hundreds of file rows
  const folderGroups = Array.from(
    files.reduce((map, f) => {
      const folder = topFolder(f);
      if (folder) map.set(folder, [...(map.get(folder) || []), f]);
      return map;
    }, new Map<string, ProjectAttachedFile[]>())
  );
  const looseFiles = files.filter((f) => !topFolder(f));

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
          {folderGroups.map(([folder, folderFiles]) => {
            const isOpen = openFolders.includes(folder);
            const totalBytes = folderFiles.reduce((n, f) => n + (f.sizeBytes || 0), 0);
            return (
              <div key={folder} className="bg-white border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between gap-3 p-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFolders(isOpen ? openFolders.filter((f) => f !== folder) : [...openFolders, folder])
                    }
                    className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer"
                  >
                    <div className="p-2 rounded-lg shrink-0 bg-amber-50 text-amber-600">
                      {isOpen ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-900 truncate">
                        {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        {folder}/
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {folderFiles.length} file{folderFiles.length > 1 ? 's' : ''} · {formatBytes(totalBytes)}
                      </span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFolder(folder)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                    title="Remove folder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {isOpen && (
                  <ul className="border-t border-slate-100 px-3 py-2 space-y-1 max-h-56 overflow-y-auto">
                    {folderFiles.map((file) => (
                      <li key={file.id} className="flex items-center justify-between gap-2 text-[11px]">
                        <button
                          type="button"
                          onClick={() => openFile(file)}
                          className="truncate font-mono text-slate-700 hover:text-blue-700 text-left cursor-pointer"
                          title="Open file"
                        >
                          {file.name.slice(folder.length + 1)}
                        </button>
                        <span className="flex items-center gap-1 shrink-0 text-slate-400">
                          {file.size}
                          <button
                            type="button"
                            onClick={() => removeFile(file)}
                            className="p-0.5 hover:text-rose-600 cursor-pointer"
                            title="Remove file"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
          {looseFiles.map((file) => (
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
          handleDrop(e.dataTransfer);
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
          {isSaving ? 'Saving files...' : 'Drop files or a project folder here'}
        </span>
        <span className="text-[11px] text-slate-500">
          Any file type · up to {formatBytes(MAX_UPLOAD_BYTES)} each · node_modules and .git are skipped
        </span>
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            Choose files
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              folderInputRef.current?.click();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 cursor-pointer"
          >
            <Folder className="w-3.5 h-3.5" />
            Choose folder
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handlePickedList(e.target.files)}
        />
        <input
          ref={folderInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handlePickedList(e.target.files)}
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
                      {c.courseCode}
                      {c.name !== c.courseCode ? `: ${c.name}` : ''}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 shrink-0">
                  {assignmentSource === 'canvas_api'
                    ? 'Live from Canvas'
                    : assignmentSource === 'calendar_feed'
                    ? 'Canvas calendar'
                    : `${canvasConnection.institutionName} directory`}
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
                          <p className="text-[11px] text-slate-400 italic">
                            {assignmentSource === 'calendar_feed'
                              ? 'Open it in Canvas to download your files, then upload them above'
                              : 'No submitted files'}
                          </p>
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
