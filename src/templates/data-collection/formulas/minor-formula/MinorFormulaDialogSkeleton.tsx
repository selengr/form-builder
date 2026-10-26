'use client';

import { Skeleton } from '@mui/material';

const fieldSx = { borderRadius: '12px' };

function FieldSkeleton({ labelWidth }: { labelWidth: number }) {
  return (
    <div className="flex flex-col" style={{ gap: 6 }}>
      <Skeleton variant="text" width={labelWidth} height={20} animation="wave" />
      <Skeleton variant="rounded" width="100%" height={52} animation="wave" sx={fieldSx} />
    </div>
  );
}

function ConditionRowSkeleton() {
  return (
    <div className="flex flex-col md:flex-row w-full" style={{ gap: 12, padding: '6px 14px' }}>
      <Skeleton variant="rounded" height={52} animation="wave" sx={{ ...fieldSx, width: { xs: '100%', md: 305 } }} />
      <Skeleton variant="rounded" height={52} animation="wave" sx={{ ...fieldSx, width: { xs: '100%', md: 122 } }} />
      <Skeleton variant="rounded" height={52} animation="wave" sx={{ ...fieldSx, width: { xs: '100%', md: 122 } }} />
      <Skeleton variant="rounded" height={52} animation="wave" sx={{ ...fieldSx, flex: 1, width: { xs: '100%', md: 'auto' } }} />
    </div>
  );
}

export default function MinorFormulaDialogSkeleton() {
  return (
    <div dir="rtl" className="flex flex-col" style={{ gap: 10, marginTop: 6 }} aria-busy="true" aria-label="در حال بارگذاری">
      <FieldSkeleton labelWidth={36} />
      <FieldSkeleton labelWidth={72} />

      <div
        className="flex flex-col w-full rounded-2xl border border-[#DDE1E6] bg-[#F8FAFC] overflow-hidden"
        style={{ marginTop: 6, paddingBottom: 14 }}>
        <div className="bg-white border-b border-b-[#DDE1E6]" style={{ padding: '10px 14px' }}>
          <Skeleton variant="text" width={28} height={20} animation="wave" />
        </div>
        <div style={{ marginTop: 8 }}>
          <ConditionRowSkeleton />
        </div>
        <div className="flex justify-center" style={{ padding: '6px 14px' }}>
          <Skeleton variant="rounded" width={120} height={28} animation="wave" sx={{ borderRadius: '20px' }} />
        </div>
        <ConditionRowSkeleton />
        <div style={{ padding: '3px 14px 0' }}>
          <Skeleton variant="rounded" width="100%" height={50} animation="wave" sx={fieldSx} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full" style={{ gap: 12, marginTop: 6 }}>
        <div className="flex flex-col flex-1" style={{ gap: 8 }}>
          <Skeleton variant="text" width={56} height={20} animation="wave" />
          <Skeleton variant="rounded" width="100%" height={211} animation="wave" sx={{ borderRadius: '20px' }} />
          <Skeleton variant="rounded" width="100%" height={34} animation="wave" sx={{ borderRadius: '10px' }} />
        </div>
        <Skeleton
          variant="rounded"
          height={260}
          animation="wave"
          sx={{ borderRadius: '16px', width: { xs: '100%', md: 220 }, alignSelf: { md: 'flex-end' } }}
        />
      </div>
    </div>
  );
}
