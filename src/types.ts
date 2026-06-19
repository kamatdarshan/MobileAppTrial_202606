export type FileCategory = 'pdf' | 'document' | 'spreadsheet' | 'image' | 'code' | 'other';

export interface LocalFile {
  id: string;
  name: string;
  category: FileCategory;
  sizeBytes: number;
  createdDate: string;
  modifiedDate: string;
  uploadedBy: string;
}

export type SortOption = 'name' | 'date' | 'size';
export type SortOrder = 'asc' | 'desc';
