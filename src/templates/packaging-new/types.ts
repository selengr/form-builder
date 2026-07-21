export interface PackagingListItem {
  id: number;
  name: string;
  formId: number;
  invalid: boolean;
  formCategorysModel: null;
  isCreatedSoloReport: boolean;
  packagingStausEnum: 'CREATE' | string;
  targetLabelEnum: 'DEFAULT' | string;
}
