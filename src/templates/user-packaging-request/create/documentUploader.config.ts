import { IFileRestriction } from '@/components/uploader/types';

export const packagingRequestDocumentRestrictions: IFileRestriction = {
  minNumberOfFiles: 1,
  maxNumberOfFiles: 1,
  maxFileSize: 10 * 1024 * 1024,
  allowedFileTypes: [
    '.jpeg',
    '.jpg',
    '.png',
    '.pdf',
    '.xls',
    '.xlsx',
    '.doc',
    '.docx',
  ] as IFileRestriction['allowedFileTypes'],
};
