export interface SearchFilterModel {
  searchFilterBoxList: {
    restrictionList: string[];
  }[];
  sortList: {
    fieldName: string;
    type: 'ASC' | 'DSC';
  }[];
  page: number;
  rows: number;
}
