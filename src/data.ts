import { LocalFile } from './types';

/**
 * Sample documents seeded on first launch so the list isn't empty.
 * They are metadata-only (hasContent: false) until the user uploads real
 * files; open/download surfaces a helpful hint for these placeholders.
 */
export const initialFiles: LocalFile[] = [
  {
    id: '1',
    name: 'Q3_Financial_Model_Extended.xlsx',
    category: 'spreadsheet',
    sizeBytes: 1048576 * 2.4, // 2.4 MB
    createdDate: '2025-10-01T09:00:00Z',
    modifiedDate: '2025-10-15T14:30:00Z',
    uploadedBy: 'Jane Doe',
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    hasContent: false,
  },
  {
    id: '2',
    name: 'Employee_Handbook_Draft_v2.pdf',
    category: 'pdf',
    sizeBytes: 1048576 * 6.1, // 6.1 MB
    createdDate: '2025-11-12T10:20:00Z',
    modifiedDate: '2026-01-05T09:12:00Z',
    uploadedBy: 'HR Department',
    mimeType: 'application/pdf',
    hasContent: false,
  },
  {
    id: '3',
    name: 'Quarterly_AllHands_Presentation.pdf',
    category: 'pdf',
    sizeBytes: 1048576 * 14.5, // 14.5 MB
    createdDate: '2026-03-22T08:15:00Z',
    modifiedDate: '2026-03-24T16:45:00Z',
    uploadedBy: 'Leadership Team',
    mimeType: 'application/pdf',
    hasContent: false,
  },
  {
    id: '4',
    name: 'Product_Roadmap_2026.docx',
    category: 'document',
    sizeBytes: 1024 * 850, // 850 KB
    createdDate: '2026-04-10T11:00:00Z',
    modifiedDate: '2026-05-18T13:30:00Z',
    uploadedBy: 'Alex Chen',
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    hasContent: false,
  },
  {
    id: '5',
    name: 'Offsite_Team_Photo_Raw.jpg',
    category: 'image',
    sizeBytes: 1048576 * 8.2, // 8.2 MB
    createdDate: '2026-05-20T17:00:00Z',
    modifiedDate: '2026-05-20T17:00:00Z',
    uploadedBy: 'Maria Gomez',
    mimeType: 'image/jpeg',
    hasContent: false,
  },
  {
    id: '6',
    name: 'Release_Notes.docx',
    category: 'document',
    sizeBytes: 1024 * 12, // 12 KB
    createdDate: '2026-06-01T09:40:00Z',
    modifiedDate: '2026-06-02T10:15:00Z',
    uploadedBy: 'DevOps SysApp',
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    hasContent: false,
  },
];
