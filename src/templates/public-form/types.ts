export interface PublicFormListItem {
  id: string | number;
  name?: string;
  type?: string;
  takeParts?: unknown[];
  showReportForResponder?: boolean;
  [key: string]: unknown;
}

export const PUBLIC_FORM_LIST_QUERY_KEY = 'public_form_list';

export const DEFAULT_PUBLIC_FORM_FILTER = {
  type: 'ALL',
  status: 'ALL',
  isCreatedSoloReport: 'ALL',
  fieldOperation: 'DSC',
};
