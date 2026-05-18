'use client';

import { Skeleton } from '@mui/material';

interface ReportListCardSkeletonProps {
  isPackaging?: boolean;
  showSecondButton?: boolean;
}

export default function ReportListCardSkeleton({
  isPackaging = false,
  showSecondButton = true,
}: ReportListCardSkeletonProps) {
  return (
    <div
      className={`
        flex flex-col gap-3 rounded-2xl border p-5 shadow-sm
        ${isPackaging ? 'border-amber-300' : 'border-[#DDE1E6]'}
      `}
    >
      {/* Info rows */}
      <Skeleton variant="text" width="70%" height={28} animation="wave" />
      <Skeleton variant="text" width="55%" height={26} animation="wave" />
      <Skeleton variant="text" width="50%" height={26} animation="wave" />

      {/* Buttons */}
      <div className="flex flex-row gap-3">
        <Skeleton
          variant="rectangular"
          height={42}
          width="100%"
          animation="wave"
          sx={{ borderRadius: '8px' }}
        />

        {showSecondButton && (
          <Skeleton
            variant="rectangular"
            height={42}
            width="100%"
            animation="wave"
            sx={{ borderRadius: '8px' }}
          />
        )}
      </div>
    </div>
  );
}
