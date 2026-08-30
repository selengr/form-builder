'use client';

import { createPortal } from 'react-dom';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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

/**
 * Find the UnifiedListGrid white list column (the pane that contains #content),
 * without modifying UnifiedListGrid itself.
 */
function findListPane(root: HTMLElement): HTMLElement | null {
  const content = root.querySelector('#content');
  if (!content) return null;

  let node: HTMLElement | null = content as HTMLElement;
  while (node && node !== root) {
    const parent = node.parentElement;
    if (!parent) break;

    const style = getComputedStyle(parent);
    const isFlex = style.display.includes('flex');

    // Desktop: row (list + filter). Mobile: column (list, filter hidden).
    // In both cases the child that contains #content is the list pane.
    if (isFlex && parent.children.length >= 1) {
      return node;
    }

    node = parent;
  }

  // Mobile: no row flex — climb to the white list card that wraps header + content
  const contentEl = content as HTMLElement;
  let candidate: HTMLElement | null = contentEl.parentElement;
  while (candidate && candidate !== root) {
    if (candidate.clientHeight > 200 && candidate.clientWidth > 200) {
      return candidate;
    }
    candidate = candidate.parentElement;
  }

  return contentEl.parentElement;
}

export default function ListGridWrapper() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const formName = searchParams.get('formName') || 'گزارشات';
  const formId = String(id ?? '');

  const containerRef = useRef<HTMLDivElement>(null);
  const [listPane, setListPane] = useState<HTMLElement | null>(null);

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

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const sync = () => {
      const pane = findListPane(root);
      if (!pane) return;

      // Needed so absolute action bar is relative to the list column only
      if (getComputedStyle(pane).position === 'static') {
        pane.style.position = 'relative';
      }
      setListPane((prev) => (prev === pane ? prev : pane));
    };

    sync();

    const mutationObserver = new MutationObserver(sync);
    mutationObserver.observe(root, { childList: true, subtree: true });

    const resizeObserver = new ResizeObserver(sync);
    resizeObserver.observe(root);

    window.addEventListener('resize', sync);

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, []);

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

  const actionBar = (
    <div className="absolute inset-x-2 bottom-2 z-30 sm:inset-x-3 sm:bottom-3">
      <RenderAction
        name={formName}
        publicationApprovalByAdmin={publicationApprovalByAdmin}
        setPublicationApprovalByAdmin={setPublicationApprovalByAdmin}
      />
    </div>
  );

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
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
        }}
        fetcher={fetcher}
        searchBoxList={createDefaultSearchBoxList('formSetting.name')}
        searchQueryFilter={appliedFilter}
        skeletonHeaderName="تعداد کل گزارش‌ها"
      />

      {/* Portal into the list column only — never covers the filter sidebar */}
      {listPane ? createPortal(actionBar, listPane) : null}
    </div>
  );
}
