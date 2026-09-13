import { TFormType } from '@/constants/formDictionaries';

export interface BuilderListItem {
  id: string;
  name: string;
  ratio: number;
  status: string;
  type: TFormType;
  accessType?: string;
  participants: number;
  accessibility: string[];
  formPublishSetting: {
    capacityPublicLink: number | null;
  };
  formSettingModel: {
    startFromContinue: boolean | null;
    responseLimitation: string | null;
  };
  questionListSize: number;
}

export const BUILDER_LIST_QUERY_KEY = 'builder_list';
