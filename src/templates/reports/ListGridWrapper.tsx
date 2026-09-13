'use client';

import {
  UnifiedListGridPage,
  createDefaultSearchBoxList,
} from '@/components/unified-list-grid';
import ListCard from './ListCard';
import ReportListCardSkeleton from './ReportListCardSkeleton';
import { reportsListFetcher } from './reportsListFetcher';
import { ReportsListItem } from './types';

const SEARCH_QUERY_FILTER = {
  type: 'ALL',
  status: 'PUBLIC',
  isCreatedSoloReport: 'ALL',
  fieldOperation: 'DSC',
};

export default function ListGridWrapper() {
  return (
    <UnifiedListGridPage<ReportsListItem>
      config={{
        title: 'گزارش‌ها',
        queryKey: 'reports_list',
        textTotal: ['تعداد کل فرم‌ها', 'عدد'],
        searchField: 'formSetting.name',
        disableFilter: true,
        hasSidebarFilter: false,
        backHref: '/',
      }}
      slots={{
        CardComponent: ListCard,
        SkeletonComponent: ReportListCardSkeleton,
      }}
      fetcher={reportsListFetcher}
      searchBoxList={createDefaultSearchBoxList('formSetting.name')}
      searchQueryFilter={SEARCH_QUERY_FILTER}
      skeletonHeaderName="تعداد کل فرم‌ها"
      loadingHasCreateBtn={false}
    />
  );
}
