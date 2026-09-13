'use client';

import { useCallback, useState } from 'react';
import {
  UnifiedListGridPage,
  createDefaultSearchBoxList,
  SearchQueryFilter,
  UnifiedListGridFilterSlotProps,
} from '@/components/unified-list-grid';
import ListCard from './ListCard';
import ListCardSkeleton from './ListCardSkeleton';
import PackagingFilter from './PackagingFilter';
import { standardFormsListFetcher } from './standardFormsListFetcher';
import { StandardFormsListItem } from './types';

const DEFAULT_FILTER: SearchQueryFilter = {
  isCreatedSoloReport: 'ALL',
  fieldOperation: 'DSC',
};

export default function ListGridWrapper() {
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
        setDraftFilter(DEFAULT_FILTER);
        setAppliedFilter(DEFAULT_FILTER);
        if (isMobile) {
          closeMobileFilter();
          return;
        }
        refreshList();
      };

      return (
        <PackagingFilter
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
    <UnifiedListGridPage<StandardFormsListItem>
      config={{
        title: 'فرم های پرکاربرد',
        queryKey: 'standard_forms_list',
        textTotal: ['تعداد کل فرم ها', 'عدد'],
        searchField: 'name',
        hasSidebarFilter: true,
        backHref: '/',
        onMobileFilterOpen: syncDraftFromApplied,
      }}
      slots={{
        CardComponent: ListCard,
        SkeletonComponent: ListCardSkeleton,
        FilterComponent: FilterSlot,
      }}
      fetcher={standardFormsListFetcher}
      searchBoxList={createDefaultSearchBoxList('name')}
      searchQueryFilter={appliedFilter}
      skeletonHeaderName="تعداد کل فرم ها"
      loadingHasCreateBtn={false}
    />
  );
}
