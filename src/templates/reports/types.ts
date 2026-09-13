import { formTypePersian } from '@/constants/formDictionaries';

export interface ReportsListItem {
  id: string;
  name: string;
  type: keyof typeof formTypePersian;
  accessType?: string;
  status?: string;
  isCreatedSoloReport: boolean;
}
