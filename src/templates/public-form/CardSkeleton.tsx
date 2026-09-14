'use client';

import { Grid2, Skeleton } from '@mui/material';

/** Mirrors FormCardBase layout with showStatus={false} (public-form card). */
function PublicFormCardSkeletonItem() {
  return (
    <div className="border p-4 rounded-2xl border-[#DDE1E6] flex flex-col gap-3 w-full max-w-full relative">
      {/* گزارش button */}
      <div className="absolute top-2 left-2 z-10">
        <Skeleton
          variant="rounded"
          width={70}
          height={36}
          animation="wave"
          sx={{ borderRadius: '9999px' }}
        />
      </div>

      {/* InfoRow: نام + نوع (no وضعیت) */}
      <div className="space-y-2">
        <div className="flex items-start gap-1 text-sm">
          <Skeleton variant="text" width={36} height={20} animation="wave" />
          <Skeleton variant="text" width="58%" height={20} animation="wave" />
        </div>
        <div className="flex items-start gap-1 text-sm">
          <Skeleton variant="text" width={32} height={20} animation="wave" />
          <Skeleton variant="text" width="42%" height={20} animation="wave" />
        </div>
      </div>

      {/* Primary CTA */}
      <div className="flex w-full gap-2 flex-row mt-2">
        <Skeleton
          variant="rounded"
          height={42}
          animation="wave"
          sx={{ borderRadius: '8px', width: '100%' }}
        />
      </div>
    </div>
  );
}

export default function CardSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <Grid2 key={i} sx={{ width: '100%', mx: 'auto' }} size={12}>
          <PublicFormCardSkeletonItem />
        </Grid2>
      ))}
    </>
  );
}
