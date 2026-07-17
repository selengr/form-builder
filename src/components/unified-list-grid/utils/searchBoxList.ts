import { SearchBoxItem } from '../types';

export function applySearchValue(
  searchBoxList: SearchBoxItem[],
  searchField: string,
  searchValue: string,
): SearchBoxItem[] {
  return searchBoxList.map((item) =>
    item.fieldName === searchField ? { ...item, fieldValue: searchValue } : item,
  );
}

export function createDefaultSearchBoxList(
  searchField = 'formSetting.name',
): SearchBoxItem[] {
  return [
    {
      fieldName: searchField,
      fieldOperation: 'MATCH',
      fieldValue: '',
      nextConditionOperator: 'AND',
    },
  ];
}
