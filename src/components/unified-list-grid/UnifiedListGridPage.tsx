'use client';

import { Suspense } from 'react';
import UnifiedListGrid from './UnifiedListGrid';
import UnifiedListGridLayoutSkeleton from './UnifiedListGridLayoutSkeleton';
import { UnifiedListGridPageProps } from './types';

export default function UnifiedListGridPage<TItem>(props: UnifiedListGridPageProps<TItem>) {
  const {
    config,
    slots,
    skeletonHeaderName,
    loadingHasCreateBtn,
  } = props;

  return (
    <Suspense
      fallback={
        <UnifiedListGridLayoutSkeleton
          title={config.title}
          totalLabel={skeletonHeaderName ?? config.textTotal?.[0] ?? 'تعداد کل'}
          SkeletonComponent={slots.SkeletonComponent}
          hasSidebarFilter={config.hasSidebarFilter ?? Boolean(slots.FilterComponent)}
          hasCreateBtn={loadingHasCreateBtn ?? config.showCreateButton}
        />
      }>
      <UnifiedListGrid {...props} />
    </Suspense>
  );
}
