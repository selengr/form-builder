import { PackagingRequestStatus } from './constants';

export interface PackagingRequestListItem {
  id: number;
  name: string;
  status: PackagingRequestStatus | string;
}

export interface PackagingRequestDocument {
  id?: number;
  title: string;
  uuid: string;
  link?: string;
}

export interface PackagingRequestComment {
  isAdmin: boolean;
  msg: string;
}

export interface PackagingRequestDetail {
  id: number;
  formId: number | null;
  name: string;
  targetLabelEnum: string;
  status: PackagingRequestStatus | string;
  documentList: PackagingRequestDocument[];
  formCategorysModel: { categoryId: number[] } | null;
  newComment: string | null;
  commentList: PackagingRequestComment[];
}
