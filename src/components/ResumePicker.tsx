import React, { useRef, useState } from 'react';
import { FileText, Loader2, Upload, X } from 'lucide-react';
import { ProjectAttachedFile } from '../types';
import { useApp } from '../context/AppContext';
import { openAttachedFile, storeUploadedFile } from '../services/fileStore';

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const RESUME_TYPES = /\.(pdf|docx?)$/i;

interface ResumePickerProps {
  value?: ProjectAttachedFile;
  onChange: (resume: ProjectAttachedFile | undefined) => void;
  compact?: boolean;
}

// Picks a PDF or Word resume, stores it in the browser like other uploads, and shows view/replace/remove
export const ResumePicker: React.FC<ResumePickerProps> = ({ value, onChange, compact }) => {
  const { showToast } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!RESUME_TYPES.test(file.name)) {
      showToast('Resumes must be a PDF or Word file (.pdf, .doc, .docx).', 'warning');
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      showToast('Resumes must be 5 MB or smaller.', 'warning');
      return;
    }
    setBusy(true);
    try {
      onChange(await storeUploadedFile(file, { description: 'Resume' }));
    } catch {
      showToast('Could not save that file. Try again.', 'warning');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const view = async () => {
    if (value && !(await openAttachedFile(value))) {
      showToast('This resume is no longer stored in this browser. Upload it again.', 'warning');
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value ? (
        <div className="flex items-center gap-2.5 p-2.5 bg-white border border-slate-200 rounded-lg">
          <FileText className="w-4 h-4 text-red-500 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 truncate">{value.name}</p>
            <p className="text-[11px] text-slate-500">
              {value.size} · added {new Date(value.uploadedAt).toLocaleDateString()}
            </p>
          </div>
          <button type="button" onClick={view} className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer">
            View
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-[11px] font-semibold text-slate-600 hover:underline cursor-pointer"
          >
            Replace
          </button>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            title="Remove resume"
            className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`w-full flex items-center justify-center gap-2 border border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/40 rounded-lg text-xs font-semibold text-slate-600 cursor-pointer ${
            compact ? 'px-3 py-2' : 'px-3 py-4'
          }`}
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {busy ? 'Saving…' : 'Add resume (PDF or Word, up to 5 MB)'}
        </button>
      )}
    </div>
  );
};
