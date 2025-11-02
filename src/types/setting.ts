import { SearchBoxItem } from '@/components/ListGrid/ListGrid';
export interface IUserGroupMemmerInfo {
  activationLink: boolean;
  invalid?: boolean;
  formBuilderId: number;
  groupId: number;
  introducedUserJTGroupId: number;
  introducedUserPublishId: number | null;
  showReportForResponder: boolean;
  userFamily: string;
  userGender: string;
  userName: string;
  userUsername: string;
}


export interface MemberSettingsProps {
  handleOpen?: () => void;
  handleClose: () => void;
  formId: string | number;
  formData: {
    isCreatedSoloReport: boolean | null
    showReportForResponder: boolean | null
  };
  groupId: number | null;
}

export interface IUseFetchMembersParams {
  formId: number | string;
  groupId: number | null;
  searchBoxList: SearchBoxItem[];
}