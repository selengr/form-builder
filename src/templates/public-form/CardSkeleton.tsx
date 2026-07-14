'use client';

import { Grid2, Skeleton } from '@mui/material';

function PublicFormCardSkeletonItem() {
  return (
    <div className="border p-4 rounded-2xl border-[#DDE1E6] flex flex-col gap-3 w-full max-w-full relative">
      <div className="absolute top-2 left-2 z-10">
        <Skeleton
          variant="rounded"
          width={70}
          height={36}
          sx={{ borderRadius: '9999px' }}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-1">
          <Skeleton variant="text" width={32} height={20} />
          <Skeleton variant="text" width="58%" height={20} />
        </div>
        <div className="flex items-start gap-1">
          <Skeleton variant="text" width={28} height={20} />
          <Skeleton variant="text" width="42%" height={20} />
        </div>
      </div>

      <div className="flex w-full gap-2 flex-row mt-2">
        <Skeleton
          variant="rounded"
          height={42}
          sx={{ borderRadius: '8px', width: '100%' }}
          className="sm:flex-1"
        />
      </div>
    </div>
  );
}

const FormCardSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <Grid2 sx={{ width: '100%', mx: 'auto' }} key={i} size={12}>
          <PublicFormCardSkeletonItem />
        </Grid2>
      ))}
    </>
  );
};

export default FormCardSkeleton;
