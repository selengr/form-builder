'use client';

import { Skeleton } from '@mui/material';

const FormCardSkeleton = () => {
  return (
    <div className="border p-4 rounded-2xl border-[#DDE1E6] flex flex-col gap-3 w-full max-w-full relative">

      <div className="absolute top-7 left-4">
        <Skeleton variant="rounded" width={70} height={25} className='rounded-full'/>
      </div>

      <div className="space-y-3 mt-2">
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="text" width="40%" height={24} />
        <Skeleton variant="text" width="50%" height={24} />
      </div>


      <div className="flex w-full gap-2 flex-col sm:flex-row mt-2">
        <Skeleton
          variant="rounded"
          height={25}
          className="w-full sm:flex-1 rounded-full"
        />

      </div>
    </div>
  );
};

export default FormCardSkeleton;
