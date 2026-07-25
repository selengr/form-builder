import { FilterFieldMapping, SearchBoxItem, SearchQueryFilter } from '../types';

const DEFAULT_FILTER_MAPPINGS: FilterFieldMapping[] = [
  { stateKey: 'type', fieldName: 'typeEnum' },
  { stateKey: 'status', fieldName: 'status' },
  { stateKey: 'isCreatedSoloReport', fieldName: 'isCreatedSoloReport.filter' },
];

export function buildFilterRestrictions(
  filter: SearchQueryFilter,
  mappings: FilterFieldMapping[] = DEFAULT_FILTER_MAPPINGS,
): SearchBoxItem[] {
  return mappings
    .filter(({ stateKey, skipValue = 'ALL' }) => {
      const value = filter[stateKey];
      return value && value !== skipValue;
    })
    .map(({ stateKey, fieldName, operation = 'EQUAL' }) => ({
      fieldName,
      fieldOperation: operation,
      fieldValue: filter[stateKey],
      nextConditionOperator: 'AND' as const,
    }));
}

export function isValidRestriction(item?: SearchBoxItem) {
  if (!item) return false;

  if (typeof item.fieldValue === 'string') {
    return item.fieldValue.trim() !== '';
  }

  if (Array.isArray(item.fieldValue)) {
    return item.fieldValue.length > 0;
  }

  return true;
}
