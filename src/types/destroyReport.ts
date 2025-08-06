export type DestroyReportPayload = {
  formId: number;
  description: string;
  username: string;
  responseForDestroyerReport: 'PRIVACY_VIOLATION' | 'INTELLECTUAL_PROPERTY_INFRINGMENT' | 'INAPPROPRIATE_CONTENT' | 'OTHER';
};
