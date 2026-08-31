'use client';

import { CSSProperties, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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

type ActionBarBox = {
  left: number;
  width: number;
  bottom: number;
};

function findListPane(root: HTMLElement): HTMLElement | null {
  const content = root.querySelector('#content');
  if (!content) return null;

  const rootWidth = root.getBoundingClientRect().width;
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

  const candidates: HTMLElement[] = [];
  let node: HTMLElement | null = content.parentElement;

  while (node && node !== root) {
    const rect = node.getBoundingClientRect();
    if (rect.height > 180 && rect.width > 180) {
      candidates.push(node);
    }
    node = node.parentElement;
  }

  if (!candidates.length) return null;

  if (isDesktop) {
    const listSized = candidates.filter((el) => {
      const w = el.getBoundingClientRect().width;
      return w <= rootWidth - 180 && w >= Math.min(280, rootWidth * 0.4);
    });
    const pool = listSized.length ? listSized : candidates;
    return pool.reduce((a, b) =>
      a.getBoundingClientRect().width >= b.getBoundingClientRect().width ? a : b,
    );
  }

  return candidates.reduce((a, b) =>
    a.getBoundingClientRect().width >= b.getBoundingClientRect().width ? a : b,
  );
}

function ellipsizeToWidth(text: string, maxPx: number, font = 'bold 16px Tahoma, sans-serif') {
  if (typeof document === 'undefined' || maxPx <= 0) return text;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return text;

  ctx.font = font;
  if (ctx.measureText(text).width <= maxPx) return text;

  const ellipsis = '…';
  let low = 0;
  let high = text.length;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    const sample = text.slice(0, mid) + ellipsis;
    if (ctx.measureText(sample).width <= maxPx) low = mid;
    else high = mid - 1;
  }

  return low > 0 ? `${text.slice(0, low)}${ellipsis}` : ellipsis;
}

export default function ListGridWrapper() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const formName = searchParams.get('formName') || 'گزارشات';
  const formId = String(id ?? '');

  const containerRef = useRef<HTMLDivElement>(null);
  const [actionBox, setActionBox] = useState<ActionBarBox | null>(null);
  const [displayTitle, setDisplayTitle] = useState(formName);

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

  const syncLayout = useCallback(() => {
    const root = containerRef.current;
    if (!root) return;

    const pane = findListPane(root);
    if (!pane) return;

    const rect = pane.getBoundingClientRect();
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    const padX = isMobile ? 8 : 12;
    const padBottom = isMobile ? 8 : 12;

    setActionBox({
      left: rect.left + padX,
      width: Math.max(0, rect.width - padX * 2),
      bottom: Math.max(0, window.innerHeight - rect.bottom + padBottom),
    });

    const titleMax = Math.max(64, rect.width - 96);
    setDisplayTitle(ellipsizeToWidth(formName, titleMax));
  }, [formName]);

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    syncLayout();

    const mutationObserver = new MutationObserver(syncLayout);
    mutationObserver.observe(root, { childList: true, subtree: true });

    const resizeObserver = new ResizeObserver(syncLayout);
    resizeObserver.observe(root);

    window.addEventListener('resize', syncLayout);
    window.addEventListener('scroll', syncLayout, true);

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('resize', syncLayout);
      window.removeEventListener('scroll', syncLayout, true);
    };
  }, [syncLayout]);

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

  const actionStyle: CSSProperties | undefined = actionBox
    ? {
        position: 'fixed',
        left: actionBox.left,
        width: actionBox.width,
        bottom: actionBox.bottom,
        zIndex: 40,
      }
    : undefined;

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <UnifiedListGridPage<TReporterInformationItem>
        config={{
          title: displayTitle,
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

      {actionStyle ? (
        <div style={actionStyle}>
          <RenderAction
            name={formName}
            publicationApprovalByAdmin={publicationApprovalByAdmin}
            setPublicationApprovalByAdmin={setPublicationApprovalByAdmin}
          />
        </div>
      ) : null}
    </div>
  );
}
