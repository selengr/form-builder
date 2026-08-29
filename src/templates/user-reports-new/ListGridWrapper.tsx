'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
  UnifiedListGridPage,
  createDefaultSearchBoxList,
  SearchQueryFilter,
  UnifiedListGridFilterSlotProps,
} from '@/components/unified-list-grid';
import ListCard from './ListCard';
import ListCardSkeleton from './ListCardSkeleton';
import UserReportsFilter from './UserReportsFilter';
import { RenderAction } from './ActionButton';
import { createReportersListFetcher } from './reportersListFetcher';
import { TReporterInformationItem } from './type';

const DEFAULT_FILTER: SearchQueryFilter = {
  responseForDestroyerReport: 'ALL',
  typeOfReport: 'ALL',
  fieldOperation: 'DSC',
};

export const USER_REPORTS_REPORTERS_QUERY_KEY = 'user_reports_new_reporters';

export default function ListGridWrapper() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const formName = searchParams.get('formName') || 'گزارشات';
  const formId = String(id ?? '');

  const [draftFilter, setDraftFilter] = useState<SearchQueryFilter>(DEFAULT_FILTER);
  const [appliedFilter, setAppliedFilter] = useState<SearchQueryFilter>(DEFAULT_FILTER);
  const [publicationApprovalByAdmin, setPublicationApprovalByAdmin] = useState<boolean>(false);

  const fetcher = useMemo(() => createReportersListFetcher(formId), [formId]);

  useEffect(() => {
    const stored = localStorage.getItem('publicationApprovalByAdmin');
    if (stored !== null) {
      try {
        setPublicationApprovalByAdmin(JSON.parse(stored));
      } catch {
        // ignore invalid stored value
      }
    }

    return () => {
      localStorage.removeItem('publicationApprovalByAdmin');
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'publicationApprovalByAdmin',
      JSON.stringify(publicationApprovalByAdmin),
    );
  }, [publicationApprovalByAdmin]);

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
        <UserReportsFilter
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
    <UnifiedListGridPage<TReporterInformationItem>
      config={{
        title: formName,
        queryKey: USER_REPORTS_REPORTERS_QUERY_KEY,
        textTotal: ['تعداد کل گزارش‌ها', 'عدد'],
        searchField: 'formSetting.name',
        hasSidebarFilter: true,
        backHref: '/user-reports-new',
        onMobileFilterOpen: syncDraftFromApplied,
      }}
      slots={{
        CardComponent: ListCard,
        SkeletonComponent: ListCardSkeleton,
        FilterComponent: FilterSlot,
        FooterComponent: (
          <RenderAction
            name={formName}
            publicationApprovalByAdmin={publicationApprovalByAdmin}
            setPublicationApprovalByAdmin={setPublicationApprovalByAdmin}
          />
        ),
      }}
      fetcher={fetcher}
      searchBoxList={createDefaultSearchBoxList('formSetting.name')}
      searchQueryFilter={appliedFilter}
      skeletonHeaderName="تعداد کل گزارش‌ها"
    />
  );
}
