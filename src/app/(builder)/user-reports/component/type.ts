export type TResponseModel = {
    key: string;
    value: string;
};
export type TTypeOfReportModel = {
    key: string;
    value: string;
};
export type TReporterInformationItem = {
    questionId: number | null;
    description: string;
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