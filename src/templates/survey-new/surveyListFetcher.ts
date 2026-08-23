import { getSurveyListAction } from '@actions/survey-new/getSurveyListAction';
import {
  UnifiedListGridFetcher,
  UnifiedListGridFetchParams,
} from '@/components/unified-list-grid';
import { applySearchValue } from '@/components/unified-list-grid/utils/searchBoxList';
import { SurveyListItem } from './types';

export const surveyListFetcher: UnifiedListGridFetcher<SurveyListItem> = async ({
  pageParam,
  searchValue,
  searchBoxList,
  filterBoxList,
  searchQueryFilter,
}: UnifiedListGridFetchParams) => {
  const searchField =
    searchBoxList.find((item) => item.fieldOperation === 'MATCH')?.fieldName ??
    'formSetting.name';

  const updatedSearchBoxList = applySearchValue(searchBoxList, searchField, searchValue);

  const result = await getSurveyListAction({
    pageParam,
    searchBoxList: updatedSearchBoxList,
    filterBoxList,
    searchQueryFilter: {
      isCreatedSoloReport: searchQueryFilter.isCreatedSoloReport ?? 'ALL',
      surveyTargetPlatformEnum: searchQueryFilter.surveyTargetPlatformEnum ?? 'ALL',
      fieldOperation: searchQueryFilter.fieldOperation ?? 'DSC',
    },
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return {
    success: true,
    data: result.data as SurveyListItem[],
    total: result.total,
  };
};
