'use client';

import { Grid, Skeleton } from '@mui/material';

const FormCardSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <Grid key={i} sx={{ width: 1, maxWidth: 470, mx: 'auto' }}>
          <div className="border p-4 rounded-2xl border-[#DDE1E6] flex flex-col gap-2 w-full max-w-full relative">

            <div className="space-y-2 mt-1">
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="40%" height={24} />
              {/* <Skeleton variant="text" width="50%" height={24} /> */}
            </div>


            <div className="flex w-full gap-1 flex-col sm:flex-row mt-1">
              <Skeleton
                variant="rounded"
                height={37}
                className="w-full sm:flex-1 rounded-xl"
              />

            </div>
          </div>
        </Grid >
      ))}
    </>
  );
};

export default FormCardSkeleton;
