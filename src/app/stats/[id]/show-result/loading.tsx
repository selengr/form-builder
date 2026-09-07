'use client';

import { Skeleton } from '@mui/material';
import PageContainer from '@/templates/layout/PageContainer';

export default function ShowResultLoading() {
  return (
    <PageContainer>
      <div className="flex flex-col bg-white rounded-xl overflow-hidden min-h-fit">
        <div className="shrink-0 m-2 p-4 z-10 w-[calc(100%-16px)] h-[52px] flex items-center justify-center rounded-lg bg-[#F7F7FF] mb-4 relative">
          <Skeleton variant="text" width={180} height={28} animation="wave" />
        </div>
      </div>
      <div className="overflow-y-auto w-full flex flex-col items-center gap-3 p-8">
        <Skeleton variant="rounded" width="100%" height={28} animation="wave" />
        <Skeleton variant="rounded" width="92%" height={28} animation="wave" />
        <Skeleton variant="rounded" width="88%" height={28} animation="wave" />
        <Skeleton variant="rounded" width="95%" height={120} animation="wave" />
        <Skeleton variant="rounded" width="90%" height={28} animation="wave" />
        <Skeleton variant="rounded" width="85%" height={28} animation="wave" />
      </div>
    </PageContainer>
  );
}
