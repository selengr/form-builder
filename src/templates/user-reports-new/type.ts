export type TResponseModel = {
  key: string;
  value: string;
};
export type TTypeOfReportModel = {
  key: string;
  value: string | "RESULT_REPORT" | "FORM";
};
export type TReporterInformationItem = {
  createDate: string;
  questionId: number | null;
  description: string;
  resultReportText: string;
  username: string | null;
  responseModel: TResponseModel;
  typeOfReportModel: TTypeOfReportModel;
};
export type TFormData = {
  formId: number;
  formName: string;
  userFullName: string;
  numberOfReportingPoints: number;
  publicationApprovalByAdmin: boolean;
  reporterInformation: TReporterInformationItem[];
};
