'use client';

import { useCallback, useState } from 'react';
import {
  UnifiedListGridPage,
  createApiRouteFetcher,
  createDefaultSearchBoxList,
  SearchQueryFilter,
  UnifiedListGridFilterSlotProps,
} from '@/components/unified-list-grid';
import { TestListGridItem } from '@/app/api/test-list-grid/data';
import TestListGridCard from './TestListGridCard';
import TestListGridCardSkeleton from './TestListGridCardSkeleton';
import TestListGridFilter from './TestListGridFilter';

const DEFAULT_FILTER: SearchQueryFilter = {
  type: 'ALL',
  status: 'ALL',
  fieldOperation: 'DSC',
};

const testFetcher = createApiRouteFetcher('/api/test-list-grid', {
  filterFieldMappings: [
    { stateKey: 'type', fieldName: 'typeEnum' },
    { stateKey: 'status', fieldName: 'status' },
  ],
});

export default function TestListGridWrapper() {
  const [draftFilter, setDraftFilter] = useState<SearchQueryFilter>(DEFAULT_FILTER);
  const [appliedFilter, setAppliedFilter] = useState<SearchQueryFilter>(DEFAULT_FILTER);

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

        setAppliedFilter((prev) => {
          const next = typeof updater === 'function' ? updater(prev) : updater;
          return next;
        });
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
        setDraftFilter(DEFAULT_FILTER);
        setAppliedFilter(DEFAULT_FILTER);
        if (isMobile) {
          closeMobileFilter();
          return;
        }
        refreshList();
      };

      return (
        <TestListGridFilter
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
    <UnifiedListGridPage<TestListGridItem>
      config={{
        title: 'تست List Grid',
        queryKey: 'test_list_grid',
        textTotal: ['تعداد کل آیتم‌های تست', 'عدد'],
        searchField: 'name',
        hasSidebarFilter: true,
        backHref: '/',
        onMobileFilterOpen: syncDraftFromApplied,
      }}
      slots={{
        CardComponent: TestListGridCard,
        SkeletonComponent: TestListGridCardSkeleton,
        FilterComponent: FilterSlot,
      }}
      fetcher={testFetcher}
      searchBoxList={createDefaultSearchBoxList('name')}
      searchQueryFilter={appliedFilter}
      skeletonHeaderName="تعداد کل آیتم‌های تست"
    />
  );
}
