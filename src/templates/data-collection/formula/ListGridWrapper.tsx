'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { IconButton } from '@mui/material';
import PlusIcon from '@/../public/images/home-page/Add-fill.svg';
import {
  UnifiedListGridPage,
  createDefaultSearchBoxList,
  SearchQueryFilter,
  UnifiedListGridFilterSlotProps,
} from '@/components/unified-list-grid';
import FormulaListCard from './ListCard';
import FormulaListCardSkeleton from './ListCardSkeleton';
import FormulaFilter from './FormulaFilter';
import CreateFormulaBtn from './CreateFormulaBtn';
import { majorFormulaListFetcher } from './majorFormulaListFetcher';
import { MajorFormulaListItem } from './types';

const DEFAULT_FILTER: SearchQueryFilter = {
  targetPlatformEnum: 'ALL',
  fieldOperation: 'DSC',
};

export default function FormulaListGridWrapper() {
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
        <FormulaFilter
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
      <UnifiedListGridPage<MajorFormulaListItem>
        config={{
          title: 'فرمول‌ها',
          queryKey: 'major_formula_list',
          textTotal: ['تعداد کل فرمول‌ها', 'عدد'],
          searchField: 'majorName',
          hasSidebarFilter: true,
          backHref: '/data-collection',
          onMobileFilterOpen: syncDraftFromApplied,
        }}
        slots={{
          CardComponent: FormulaListCard,
          SkeletonComponent: FormulaListCardSkeleton,
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
        fetcher={majorFormulaListFetcher}
        searchBoxList={createDefaultSearchBoxList('majorName')}
        searchQueryFilter={appliedFilter}
        skeletonHeaderName="تعداد کل فرمول‌ها"
        loadingHasCreateBtn
      />

      <CreateFormulaBtn open={openCreateModal} onClose={() => setOpenCreateModal(false)} />
    </>
  );
}
