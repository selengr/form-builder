import { clientFetch } from "@/components/ListGrid/clientFetch";

interface SearchBoxItem {
  fieldName: "typeOfReport" | "responseForDestroyerReport";
  fieldOperation: "MATCH" | "EQUAL" | "DSC" | "ASC" | "IN";
  fieldValue: string | string[];
  nextConditionOperator: "OR" | "AND";
}

const PAGE_SIZE = 10;
const DEFAULT_SEARCH_FILTER = {responseForDestroyerReport: "ALL", typeOfReport: "ALL"};

export async function fetchData({
                                  pageParam = 0
                                }: {
  pageParam: number
}, searchBoxList: SearchBoxItem[], filterBoxList: SearchBoxItem[], url: string, searchQueryFilter = DEFAULT_SEARCH_FILTER) {
  const filterRestrictions: SearchBoxItem[] = [];
  if (searchQueryFilter.responseForDestroyerReport && searchQueryFilter.responseForDestroyerReport !== "ALL") {
    filterRestrictions.push({
      fieldName: "responseForDestroyerReport",
      fieldOperation: "EQUAL",
      fieldValue: searchQueryFilter.responseForDestroyerReport,
      nextConditionOperator: "AND"
    });
  }
  if (searchQueryFilter.typeOfReport && searchQueryFilter.typeOfReport !== "ALL") {
    filterRestrictions.push({
      fieldName: "typeOfReport",
      fieldOperation: "EQUAL",
      fieldValue: searchQueryFilter.typeOfReport,
      nextConditionOperator: "AND"
    });
  }

  const validCombinedRestrictionList = [...searchBoxList, ...filterBoxList, ...filterRestrictions].filter(item => {
    if (item === undefined || item === null) return false;
    if (typeof item.fieldValue === 'string') {
      return item.fieldValue !== '';
    }
    if (Array.isArray(item.fieldValue)) {
      return item.fieldValue.length > 0;
    }
    return true;
  });

  const searchFilterBoxListPayload = [{restrictionList: validCombinedRestrictionList}];

  const params = {
    searchFilterBoxList: searchFilterBoxListPayload,
    sortList: [{fieldName: "id", type: "DSC"}],
    page: pageParam,
    rows: PAGE_SIZE,
  };

  const endpoint = `${url}?searchFilterModel=`;
  const response = await clientFetch(endpoint, params);

  if (!response) {
    // Handle error or throw a specific error if needed
    throw new Error("Failed to fetch data");
  }
// debugger
  return {
    data: response.data,
    // data: response.data.reporterInformation,
    // total: response.data.totalElements,
  };
}