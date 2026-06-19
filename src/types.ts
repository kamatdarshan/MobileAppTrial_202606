export type FileCategory =
  | 'pdf'
  | 'document'
  | 'spreadsheet'
  | 'image'
  | 'code'
  | 'other';

export interface LocalFile {
  id: string;
  name: string;
  category: FileCategory;
  sizeBytes: number;
  createdDate: string;
  modifiedDate: string;
  uploadedBy: string;
  /** MIME type used when opening / downloading the file. */
  mimeType: string;
  /**
   * Whether the actual binary content for this file is stored locally
   * (in IndexedDB on web, or able to be materialised on device on native).
   * Seeded sample files are metadata-only until a real file is uploaded.
   */
  hasContent: boolean;
}

export type SortOption = 'name' | 'date' | 'size';
export type SortOrder = 'asc' | 'desc';
