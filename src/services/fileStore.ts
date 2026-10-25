import { ProjectAttachedFile } from '../types';

// Uploaded files are stored in IndexedDB (localStorage is far too small for file contents).
// Project/submission records only keep metadata plus the storageKey that points here.

const DB_NAME = 'collabr_files_v1';
const STORE = 'files';
export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveFileBlob(key: string, blob: Blob): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(blob, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function getFileBlob(key: string): Promise<Blob | undefined> {
  const db = await openDb();
  const blob = await new Promise<Blob | undefined>((resolve, reject) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result as Blob | undefined);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return blob;
}

export async function deleteFileBlob(key: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function describeFileType(name: string, mimeType = ''): string {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (ext === 'pdf' || mimeType === 'application/pdf') return 'PDF Document';
  if (['zip', 'tar', 'gz', '7z', 'rar'].includes(ext)) return 'Source Code Archive';
  if (['csv', 'tsv', 'xlsx', 'xls', 'json'].includes(ext)) return 'Dataset / CSV';
  if (['ppt', 'pptx', 'key'].includes(ext)) return 'Slide Deck / Presentation';
  if (['stl', 'step', 'stp', 'obj', 'dwg', 'sldprt'].includes(ext)) return 'CAD / 3D Model';
  if (['fig', 'sketch', 'xd'].includes(ext)) return 'Design Wireframes';
  if (['doc', 'docx', 'txt', 'md', 'rtf'].includes(ext)) return 'Written Document';
  if (mimeType.startsWith('image/')) return 'Image';
  if (mimeType.startsWith('video/')) return 'Video';
  if (['ts', 'tsx', 'js', 'py', 'java', 'c', 'cpp', 'go', 'rs', 'ipynb', 'm'].includes(ext)) return 'Source Code';
  return 'File';
}

// Stores a picked file and returns its attachment record
export async function storeUploadedFile(
  file: File,
  attribution: { labeledStudentId?: string; labeledStudentName?: string; description?: string },
  // Path inside an uploaded folder, e.g. "my-project/src/app.ts"
  displayName?: string
): Promise<ProjectAttachedFile> {
  const id = `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await saveFileBlob(id, file);
  return {
    id,
    name: displayName || file.name,
    size: formatBytes(file.size),
    sizeBytes: file.size,
    type: describeFileType(file.name, file.type),
    mimeType: file.type || undefined,
    url: '',
    storageKey: id,
    source: 'upload',
    uploadedAt: new Date().toISOString(),
    ...attribution,
  };
}

// Opens an attachment: stored uploads open from IndexedDB, Canvas/linked files open their URL
export async function openAttachedFile(file: ProjectAttachedFile): Promise<boolean> {
  if (file.storageKey) {
    const blob = await getFileBlob(file.storageKey);
    if (!blob) return false;
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    // Let the browser preview types it can render; download everything else
    const previewable = /^(application\/pdf|image\/|text\/|video\/)/.test(blob.type);
    if (previewable) a.target = '_blank';
    else a.download = file.name;
    a.rel = 'noopener';
    a.click();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    return true;
  }
  if (file.url && file.url !== '#') {
    window.open(file.url, '_blank', 'noopener');
    return true;
  }
  return false;
}
