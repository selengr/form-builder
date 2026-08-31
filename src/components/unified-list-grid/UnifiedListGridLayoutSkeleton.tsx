import Image from 'next/image';
import React, { ElementType } from 'react';
import { Button, Skeleton, Stack } from '@mui/material';
import { Grid2 as Grid, IconButton, Box } from '@mui/material';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import SearchIcon from '@/../public/images/home-page/search.svg';
import TotalGrid from '@/../public/images/home-page/total-grid.svg';
import FilterIcon from '@/../public/images/home-page/filter-icon.svg';

interface UnifiedListGridLayoutSkeletonProps {
  title: string;
  totalLabel: string;
  SkeletonComponent: ElementType;
  hasSidebarFilter?: boolean;
  hasCreateBtn?: boolean;
}

export default function UnifiedListGridLayoutSkeleton({
  title,
  totalLabel,
  SkeletonComponent,
  hasSidebarFilter = true,
  hasCreateBtn = false,
}: UnifiedListGridLayoutSkeletonProps) {
  function FilterSkeleton() {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="w-full flex flex-col justify-center gap-4 rounded-[20px] bg-[#F7F7FF] px-4 pt-4 pb-3">
            <Skeleton
              variant="text"
              width="40%"
              height={24}
              sx={{ mb: '8px', borderRadius: '4px' }}
            />
            <Stack gap={1.5}>
              {[1, 2, 3].map((option) => (
                <Box key={option} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton
                    variant="text"
                    width={item === 1 ? '70px' : '90px'}
                    height={20}
                    sx={{ borderRadius: '4px' }}
                  />
                </Box>
              ))}
            </Stack>
          </div>
        ))}
      </div>
    );
  }

  const FilterSidebarSkeleton = () => (
    <div className="flex h-[calc(100vh-50px)] w-full flex-col overflow-y-hidden">
      <div className="w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4">
        <div className="flex items-center w-full justify-center gap-2">
          <Image src={FilterIcon} width={30} height={30} alt="filter" draggable={false} />
          <p className="text-[16px] text-center font-bold text-[#161616]">فیلتر</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pb-4" style={{ scrollbarWidth: 'thin' }}>
        <FilterSkeleton />
      </div>
      <div className="sticky bottom-0 bg-white pt-4 pb-2">
        <div className="flex gap-4 items-center justify-between w-full">
          <Button
            sx={{
              height: '52px',
              bgcolor: '#1758BA',
              boxShadow: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: 700,
              '&.MuiButtonBase-root:hover': { bgcolor: '#1758BA', boxShadow: 'none' },
            }}
            fullWidth
            variant="contained">
            اعمال فیلتر
          </Button>
          <Button
            sx={{
              height: '52px',
              bgcolor: 'white',
              border: '1px solid #1758BA',
              boxShadow: 'none',
              borderRadius: '8px',
              color: '#1758BA',
              fontSize: '14px',
              fontWeight: 700,
              '&.MuiButtonBase-root:hover': { bgcolor: 'transparent', boxShadow: 'none' },
            }}
            fullWidth
            variant="outlined">
            حذف فیلتر
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-1 sm:py-2 h-full w-full flex flex-col overflow-hidden">
      <Grid
        width="100%"
        display="flex"
        sx={{
          overflowY: 'hidden',
          height: { xs: 'calc(100vh - 60px)', md: '100vh' },
          flexDirection: { xs: 'column', lg: 'row' },
        }}>
        <Grid
          container
          flexDirection="column"
          alignItems="center"
          sx={{
            bgcolor: 'white',
            borderRadius: '16px',
            p: { xs: 1, sm: 2 },
            mx: { xs: 0, sm: 1 },
            width: 1,
            overflow: 'hidden',
          }}>
          <Grid container sx={{ width: '100%', justifyContent: 'center', mx: 'auto' }}>
            <div className="w-full h-[52px] flex items-center justify-center rounded-lg bg-[#F7F7FF] px-2 mb-4 relative shrink-0 min-w-0 overflow-hidden">
              <IconButton sx={{ position: 'absolute', left: '8px', zIndex: 1, flexShrink: 0 }}>
                <MdOutlineKeyboardArrowRight color="#292D32" />
              </IconButton>
              <p
                title={title}
                className="text-[16px] text-center font-bold text-[#161616] truncate min-w-0 w-full px-10">
                {title}
              </p>
            </div>
            <Grid
              container
              size={{ xs: 12, md: 10, xl: 9 }}
              sx={{
                width: '100%',
                mx: 'auto',
                maxWidth: '470px',
                flexDirection: 'column',
                gap: 2,
              }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                }}>
                <div className="flex justify-between gap-2 bg-[#ECFAFF] rounded-2xl px-[10px] py-4 w-full">
                  <div className="flex items-center gap-[10px]">
                    <Image src={TotalGrid} width={20} height={20} alt="filter" draggable={false} />
                    <p className="text-sm text-[#393939]">{totalLabel}:</p>
                  </div>
                  <div className="w-11 h-5 bg-gray-200 rounded animate-pulse" />
                </div>
                {hasCreateBtn && (
                  <div className="min-w-[50px] w-[50px] h-full">
                    <div className="w-[50px] h-[50px] rounded-[16px] border border-gray-300 bg-gray-200 animate-pulse" />
                  </div>
                )}
              </Box>
              <div className="flex items-center w-full border border-[#DDE1E6] rounded-2xl px-3 py-1 gap-2 bg-white">
                <input
                  type="text"
                  className="flex-1 bg-transparent focus:outline-none text-right placeholder:text-gray-400 text-sm"
                  placeholder="کاوش"
                  readOnly
                />
                <div className="p-2.5 rounded-full" aria-label="کاوش">
                  <Image src={SearchIcon} alt="search" draggable={false} priority />
                </div>
              </div>
              <Grid
                container
                flexWrap="nowrap"
                sx={{
                  width: '100%',
                  mt: 1,
                  mb: 5,
                  pb: 4,
                  flexDirection: 'column',
                  gap: 2,
                  overflowY: 'auto',
                  px: 0,
                  height: {
                    xs: 'calc(100vh - 310px)',
                    sm: 'calc(100vh - 290px)',
                    md: 'calc(100vh - 230px)',
                  },
                  scrollbarWidth: 'none',
                }}>
                <SkeletonComponent />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {hasSidebarFilter && (
          <Grid
            width="100%"
            display={{ xs: 'none', lg: 'flex' }}
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
            sx={{
              backgroundColor: 'white',
              borderRadius: '16px',
              gap: 1,
              ml: 0,
              mr: 0,
              p: 2,
              maxWidth: '300px',
            }}>
            <Grid sx={{ width: '100%', minWidth: '200px', maxWidth: '300px' }}>
              <FilterSidebarSkeleton />
            </Grid>
          </Grid>
        )}
      </Grid>
    </div>
  );
}
