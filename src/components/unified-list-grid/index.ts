export { default as UnifiedListGrid } from './UnifiedListGrid';
export { default as UnifiedListGridPage } from './UnifiedListGridPage';
export { default as UnifiedListGridLayoutSkeleton } from './UnifiedListGridLayoutSkeleton';

export * from './types';
export { createDefaultSearchBoxList, applySearchValue } from './utils/searchBoxList';
export { buildFilterRestrictions, isValidRestriction } from './utils/filterRestrictions';
export { createServerActionFetcher } from './fetchers/createServerActionFetcher';
export { createApiRouteFetcher } from './fetchers/createApiRouteFetcher';

/**
 * Migration guide — each page only differs in these slots/config:
 *
 * | Page            | Card              | Skeleton              | Filter           | Fetcher                              | searchField          | searchMode  |
 * |-----------------|-------------------|-----------------------|------------------|--------------------------------------|----------------------|-------------|
 * | builder         | ListCard          | ListCardSkeleton      | FilterSidebar    | createServerActionFetcher('/form/…') | formSetting.name     | debounced   |
 * | reports         | ListCard          | ReportListCardSkeleton| null             | createServerActionFetcher('/form/…') | formSetting.name     | debounced   |
 * | public-form     | ListCard          | CardSkeleton          | FilterSidebar    | createServerActionFetcher            | formSetting.name     | debounced   |
 * | standard-forms  | ListCard          | ListCardSkeleton      | FilterSidebar    | createServerActionFetcher            | formSetting.name     | debounced   |
 * | my-assessments  | ListCard          | ListCardSkeleton      | FilterSidebar    | createServerActionFetcher (custom)   | name                 | debounced   |
 * | data-collection | ListCard          | inline LinearProgress | FilterSidebar    | createServerActionFetcher (custom)   | formSetting.name     | url         |
 * | packaging       | ListCard          | inline LinearProgress | FilterSidebar    | createServerActionFetcher (custom)   | formSetting.name     | url         |
 * | survey          | ListCard          | inline LinearProgress | FilterSidebar    | createServerActionFetcher (custom)   | formSetting.name     | url         |
 * | user-reports    | custom card       | custom skeleton       | custom filter    | custom fetcher                       | varies               | debounced   |
 *
 * Example wrapper:
 *
 * ```tsx
 * <UnifiedListGridPage
 *   config={{
 *     title: 'گزارش‌ها',
 *     queryKey: 'reports_list',
 *     disableFilter: true,
 *     textTotal: ['تعداد کل گزارش‌ها', 'عدد'],
 *   }}
 *   slots={{
 *     CardComponent: ListCard,
 *     SkeletonComponent: ReportListCardSkeleton,
 *   }}
 *   fetcher={createServerActionFetcher('/form/main-list/reports')}
 *   searchBoxList={createDefaultSearchBoxList()}
 *   searchQueryFilter={{ type: 'ALL', status: 'PUBLIC', isCreatedSoloReport: 'ALL', fieldOperation: 'DSC' }}
 * />
 * ```
 */
