'use client';

import { Box, Skeleton } from '@mui/material';

/** Row skeleton matching publish member/group list rows. */
export function PublishListRowsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Box display="flex" flexDirection="column" gap="6px" width="100%" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <Box
          key={i}
          display="flex"
          alignItems="center"
          gap={1}
          px={1}
          py={1}
          borderRadius="12px"
          bgcolor="#F7F7FF">
          <Skeleton variant="rounded" width={20} height={20} animation="wave" />
          <Skeleton variant="text" width="35%" height={22} animation="wave" />
          <Box flex={1} />
          <Skeleton variant="text" width="28%" height={18} animation="wave" />
          <Skeleton variant="text" width={40} height={18} animation="wave" />
        </Box>
      ))}
    </Box>
  );
}

export function PublishDialogTabSkeleton() {
  return (
    <Box px={2} py={3} display="flex" flexDirection="column" gap={2} aria-hidden>
      <Skeleton variant="rounded" height={48} animation="wave" sx={{ borderRadius: '10px' }} />
      <Skeleton variant="rounded" height={42} animation="wave" sx={{ borderRadius: '10px' }} />
      <Skeleton variant="rounded" height={42} animation="wave" sx={{ borderRadius: '10px' }} />
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
        <Skeleton variant="text" width="45%" height={24} animation="wave" />
        <Skeleton variant="rounded" width={46} height={24} animation="wave" sx={{ borderRadius: 12 }} />
      </Box>
      <PublishListRowsSkeleton count={5} />
    </Box>
  );
}
