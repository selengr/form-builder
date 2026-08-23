'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import { IconButton } from '@mui/material';
import PlusIcon from '@/../public/images/home-page/Add-fill.svg';
import {
  UnifiedListGridPage,
  createDefaultSearchBoxList,
  SearchQueryFilter,
  UnifiedListGridFilterSlotProps,
} from '@/components/unified-list-grid';
import CreateSurveyModal from './CreateSurveyModal';
import SurveyListCard from './ListCard';
import SurveyListCardSkeleton from './ListCardSkeleton';
import SurveyFilter from './SurveyFilter';
import { surveyListFetcher } from './surveyListFetcher';
import { SurveyListItem } from './types';

const DEFAULT_FILTER: SearchQueryFilter = {
  isCreatedSoloReport: 'ALL',
  surveyTargetPlatformEnum: 'ALL',
  fieldOperation: 'DSC',
};

export default function SurveyNewListGridWrapper() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
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
        <SurveyFilter
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
    <>
      <UnifiedListGridPage<SurveyListItem>
        config={{
          title: 'نظرسنجی‌های من',
          queryKey: 'survey_new_list',
          textTotal: ['تعداد کل نظرسنجی‌ها', 'عدد'],
          searchField: 'formSetting.name',
          hasSidebarFilter: true,
          backHref: '/',
          onMobileFilterOpen: syncDraftFromApplied,
        }}
        slots={{
          CardComponent: SurveyListCard,
          SkeletonComponent: SurveyListCardSkeleton,
          FilterComponent: FilterSlot,
          CreateButton: (
            <div className="min-w-[50px] w-[50px] h-full">
              <IconButton
                onClick={() => setOpenCreateModal(true)}
                sx={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '16px',
                  border: '1px solid #1758BA',
                }}>
                <Image src={PlusIcon} alt="" width={22} height={22} />
              </IconButton>
            </div>
          ),
        }}
        fetcher={surveyListFetcher}
        searchBoxList={createDefaultSearchBoxList('formSetting.name')}
        searchQueryFilter={appliedFilter}
        skeletonHeaderName="تعداد کل نظرسنجی‌ها"
        loadingHasCreateBtn
      />

      <CreateSurveyModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
      />
    </>
  );
}
