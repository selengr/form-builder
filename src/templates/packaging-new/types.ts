import { PackagingListType, PackagingStatus } from './constants';

export interface PackagingListItem {
  id: number;
  name: string;
  formId: number;
  invalid: boolean;
  formCategorysModel: null;
  isCreatedSoloReport: boolean;
  packagingStausEnum: PackagingStatus;
  targetLabelEnum: 'DEFAULT' | string;
  type?: PackagingListType;
}
