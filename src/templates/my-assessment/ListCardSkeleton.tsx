import { Skeleton, Box } from '@mui/material';

const ListCardSkeleton: React.FC = () => {
  return (
    <div className="border border-[#DDE1E6] p-4 rounded-2xl flex flex-col gap-3 w-full max-w-full">
      {/* Report Button Skeleton */}
      <div className="flex justify-start">
        <Skeleton variant="rounded" width={80} height={32} />
      </div>

      {/* Info Rows Skeleton */}
      <div className="space-y-2 mt-2">
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="50%" />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width="25%" />
          <Skeleton variant="text" width="40%" />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width="35%" />
          <Skeleton variant="text" width="45%" />
        </Box>
      </div>

      {/* Buttons Skeleton */}
      <div className="flex w-full gap-2 flex-col sm:flex-row mt-2">
        <Skeleton variant="rounded" height={42} sx={{ flex: 1 }} />
        <Skeleton variant="rounded" height={42} sx={{ flex: 1 }} />
      </div>
    </div>
  );
};

export default ListCardSkeleton;
