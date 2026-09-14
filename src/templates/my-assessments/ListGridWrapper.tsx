'use client';

import { useCallback, useState } from 'react';
import {
  UnifiedListGridPage,
  createDefaultSearchBoxList,
  SearchQueryFilter,
  UnifiedListGridFilterSlotProps,
} from '@/components/unified-list-grid';
import ListCard from './ListCard';
import CardSkeleton from './CardSkeleton';
import MyAssessmentsFilter from './MyAssessmentsFilter';
import { myAssessmentsListFetcher } from './myAssessmentsListFetcher';
import {
  DEFAULT_MY_ASSESSMENTS_FILTER,
  MY_ASSESSMENTS_LIST_QUERY_KEY,
  MyAssessmentsListItem,
} from './types';

export default function ListGridWrapper() {
  const [draftFilter, setDraftFilter] = useState<SearchQueryFilter>(
    DEFAULT_MY_ASSESSMENTS_FILTER,
  );
  const [appliedFilter, setAppliedFilter] = useState<SearchQueryFilter>(
    DEFAULT_MY_ASSESSMENTS_FILTER,
  );

  const syncDraftFromApplied = useCallback(() => {
    setDraftFilter(appliedFilter);
  }, [appliedFilter]);

  const FilterSlot = useCallback(
    ({ mode, closeMobileFilter, refreshList }: UnifiedListGridFilterSlotProps) => {
      const isMobile = mode === 'mobile';
      const filter = isMobile ? draftFilter : appliedFilter;

      const handleChange: React.Dispatch<React.SetStateAction<SearchQueryFilter>> = (
        updater,
      ) => {
        if (isMobile) {
          setDraftFilter(updater);
          return;
        }

        setAppliedFilter((prev) =>
          typeof updater === 'function' ? updater(prev) : updater,
        );
      };

      const handleApply = () => {
        if (isMobile) {
          setAppliedFilter(draftFilter);
          closeMobileFilter();
          return;
        }

        setAppliedFilter(filter);
        refreshList();
      };

      const handleReset = () => {
        setDraftFilter(DEFAULT_MY_ASSESSMENTS_FILTER);
        setAppliedFilter(DEFAULT_MY_ASSESSMENTS_FILTER);
        if (isMobile) {
          closeMobileFilter();
          return;
        }
        refreshList();
      };

      return (
        <MyAssessmentsFilter
          mode={mode}
          filter={filter}
          onChange={handleChange}
          onApply={handleApply}
          onReset={handleReset}
        />
      );
    },
    [appliedFilter, draftFilter],
  );

  return (
    <UnifiedListGridPage<MyAssessmentsListItem>
      config={{
        title: 'ارزیابی‌های من',
        queryKey: MY_ASSESSMENTS_LIST_QUERY_KEY,
        textTotal: ['تعداد کل فرم‌ها', 'عدد'],
        searchField: 'formSetting.name',
        pageSize: 1000,
        hasSidebarFilter: true,
        backHref: '/',
        onMobileFilterOpen: syncDraftFromApplied,
      }}
      slots={{
        CardComponent: ListCard,
        SkeletonComponent: CardSkeleton,
        FilterComponent: FilterSlot,
      }}
      fetcher={myAssessmentsListFetcher}
      searchBoxList={createDefaultSearchBoxList('formSetting.name')}
      searchQueryFilter={appliedFilter}
      skeletonHeaderName="تعداد کل فرم‌ها"
      loadingHasCreateBtn={false}
    />
  );
}
