import { PackagingRequestStatus } from './constants';

export interface PackagingRequestListItem {
  id: number;
  name: string;
  status: PackagingRequestStatus | string;
}
