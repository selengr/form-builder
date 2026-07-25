'use client';

import { useCallback, useState } from 'react';
import {
  UnifiedListGridPage,
  createServerActionFetcher,
  createDefaultSearchBoxList,
  SearchQueryFilter,
  UnifiedListGridFilterSlotProps,
} from '@/components/unified-list-grid';
import PackagingRequestFilter from '@/templates/user-packaging-request/PackagingRequestFilter';
import { PACKAGING_REQUEST_LIST_REFETCH_OPTIONS } from '@/templates/user-packaging-request/constants';
import { PackagingRequestListItem } from '@/templates/user-packaging-request/types';
import AdminPackagingRequestListCard from './ListCard';
import AdminPackagingRequestListCardSkeleton from './ListCardSkeleton';

const API_URL = '/admin/packaging-request/main-list';

const DEFAULT_FILTER: SearchQueryFilter = {
  status: 'WAITING_FOR_PROCESS',
  fieldOperation: 'DSC',
};

const adminPackagingRequestFetcher = createServerActionFetcher<PackagingRequestListItem>(
  API_URL,
  {
    filterFieldMappings: [{ stateKey: 'status', fieldName: 'status' }],
  },
);

export default function AdminPackagingRequestListGridWrapper() {
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
        <PackagingRequestFilter
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
    <UnifiedListGridPage<PackagingRequestListItem>
      config={{
        title: 'رسیدگی به درخواست‌های آنلاین سازی آزمون',
        queryKey: 'admin_packaging_request_list',
        textTotal: ['تعداد کل درخواست‌ها', 'عدد'],
        searchField: 'name',
        hasSidebarFilter: true,
        backHref: '/',
        onMobileFilterOpen: syncDraftFromApplied,
        ...PACKAGING_REQUEST_LIST_REFETCH_OPTIONS,
      }}
      slots={{
        CardComponent: AdminPackagingRequestListCard,
        SkeletonComponent: AdminPackagingRequestListCardSkeleton,
        FilterComponent: FilterSlot,
      }}
      fetcher={adminPackagingRequestFetcher}
      searchBoxList={createDefaultSearchBoxList('name')}
      searchQueryFilter={appliedFilter}
      skeletonHeaderName="تعداد کل درخواست‌ها"
    />
  );
}
