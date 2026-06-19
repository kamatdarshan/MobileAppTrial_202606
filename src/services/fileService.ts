import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { FileOpener } from '@capacitor-community/file-opener';
import { LocalFile } from '../types';
import * as storage from './storage';
import {
  base64ToBlob,
  blobToBase64,
  categoryFromFile,
  genId,
} from '../utils';

/**
 * Platform-aware file operations.
 *
 * The same code path runs on web, Android and iOS. Capacitor plugins
 * transparently use the browser File API on the web and native APIs on
 * device, so we only branch where the user experience genuinely differs
 * (e.g. saving a download to disk vs. triggering a browser download).
 */

export const isNative = Capacitor.isNativePlatform();

interface PickedFile {
  name: string;
  mimeType: string;
  blob: Blob;
}

async function pickFile(): Promise<PickedFile | null> {
  const result = await FilePicker.pickFiles({ readData: true });
  const file = result.files?.[0];
  if (!file) return null;

  const mimeType = file.mimeType || 'application/octet-stream';
  let blob: Blob | null = null;

  if (file.blob) {
    blob = file.blob;
  } else if (file.data) {
    blob = base64ToBlob(file.data, mimeType);
  }

  if (!blob) return null;
  return { name: file.name, mimeType, blob };
}

/**
 * Open the native/web file picker, persist the chosen file locally and
 * return its metadata. Returns null if the user cancels the picker.
 */
export async function uploadFile(uploadedBy: string): Promise<LocalFile | null> {
  const picked = await pickFile();
  if (!picked) return null;

  const now = new Date().toISOString();
  const meta: LocalFile = {
    id: genId(),
    name: picked.name,
    category: categoryFromFile(picked.name, picked.mimeType),
    sizeBytes: picked.blob.size,
    createdDate: now,
    modifiedDate: now,
    uploadedBy,
    mimeType: picked.mimeType,
    hasContent: true,
  };

  await storage.putFile(meta, picked.blob);
  return meta;
}

/**
 * Persist a brand new version for an existing file by letting the user pick
 * replacement content, keeping the original id/name in the list.
 */
export async function replaceFile(meta: LocalFile): Promise<LocalFile | null> {
  const picked = await pickFile();
  if (!picked) return null;

  const updated: LocalFile = {
    ...meta,
    sizeBytes: picked.blob.size,
    mimeType: picked.mimeType,
    category: categoryFromFile(picked.name, picked.mimeType),
    modifiedDate: new Date().toISOString(),
    hasContent: true,
  };

  await storage.putFile(updated, picked.blob);
  return updated;
}

/** Save the file to the device (native) or trigger a browser download (web). */
export async function downloadFile(meta: LocalFile): Promise<string> {
  const blob = await storage.getBlob(meta.id);
  if (!blob) {
    throw new Error(
      'No stored content for this file. Upload a real file first to enable download.',
    );
  }

  if (isNative) {
    const base64 = await blobToBase64(blob);
    await Filesystem.writeFile({
      path: meta.name,
      data: base64,
      directory: Directory.Documents,
      recursive: true,
    });
    return `Saved to Documents/${meta.name}`;
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = meta.name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return `Downloaded ${meta.name}`;
}

/** Open the file in the device's default viewer (native) or a new tab (web). */
export async function openFile(meta: LocalFile): Promise<void> {
  const blob = await storage.getBlob(meta.id);
  if (!blob) {
    throw new Error(
      'No stored content for this file. Upload a real file first to open it.',
    );
  }

  if (isNative) {
    const base64 = await blobToBase64(blob);
    const path = `opened/${meta.id}-${meta.name}`;
    await Filesystem.writeFile({
      path,
      data: base64,
      directory: Directory.Cache,
      recursive: true,
    });
    const { uri } = await Filesystem.getUri({ path, directory: Directory.Cache });
    await FileOpener.open({ filePath: uri, contentType: meta.mimeType });
    return;
  }

  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener,noreferrer');
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export async function removeFile(id: string): Promise<void> {
  await storage.deleteFile(id);
}

/** Load all persisted metadata, seeding sample documents on first launch. */
export async function loadFiles(seed: LocalFile[]): Promise<LocalFile[]> {
  const existing = await storage.getAllMeta();
  if (existing.length > 0) return existing;

  for (const file of seed) {
    await storage.putMeta(file);
  }
  return seed;
}
