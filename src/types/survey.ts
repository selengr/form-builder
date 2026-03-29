export interface ISurveyItem {
  id: number;
  name: string;
  type: string;           
  status: "CREATE" | "PUBLISH";    
  participants: number | null;
  questionListSize: number;
  invalid: boolean;
  expireDate: string | null;
  expireValue: boolean;
  publicLink: string | null;
  formPublishSetting: IFormPublishSetting;
  isCompleted: boolean | null;
  takeParts: any[];    
  showReportForResponder: boolean | null;
  isCreatedSoloReport: boolean | null;
  accessibility: any[];
  surveyTargetPlatformEnum: string;
  targetPlatformEnum?: string;
  label?: string;
  surveyPurposeEnum: string;
}

export interface IFormPublishSetting {
  publicationPublicMethod: boolean;
  publicLink: string | null;
  capacityPublicLink: number;
  publicationMainPageMethod: boolean;
  privateLink: string | null;
}
