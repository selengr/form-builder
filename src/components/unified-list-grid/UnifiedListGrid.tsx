'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Grid2 as Grid, IconButton, LinearProgress, Typography } from '@mui/material';
import BottomSheet from '../BottomSheet/BottomSheet';
import CreateFormBtn from '../CreateFormBtn/CreateFormBtn';
import EmptyList from '../ListGrid/EmptyList';
import ImmediateSearchInput from '../ListGrid/ImmediateSearchInput';
import SearchInput from '../ListGrid/SearchInput';
import Filter from '@/../public/images/home-page/FilterAA.svg';
import PlusIcon from '@/../public/images/home-page/Add-fill.svg';
import TotalGrid from '@/../public/images/home-page/total-grid.svg';
import { useDebounce } from '@/hooks/useDebounce';
import { applySearchValue } from './utils/searchBoxList';
import { UnifiedListGridProps } from './types';

const DEFAULT_SEARCH_FILTER = {
  type: 'ALL',
  status: 'ALL',
  isCreatedSoloReport: 'ALL',
  fieldOperation: 'DSC',
};

const UnifiedListGrid = <TItem,>({
  config,
  slots,
  fetcher,
  searchBoxList,
  filterBoxList = [],
  searchQueryFilter = DEFAULT_SEARCH_FILTER,
  refreshGrid,
  onCheck,
}: UnifiedListGridProps<TItem>) => {
  const {
    title,
    queryKey,
    textTotal = ['تعداد کل', 'عدد'],
    pageSize = 10,
    backHref = '/',
    disableFilter = false,
    showCreateButton = false,
    searchField: configSearchField,
    searchMode = 'debounced',
    searchDebounceMs = 500,
    onMobileFilterOpen,
    refetchInterval = false,
    refetchOnWindowFocus = false,
    refetchOnReconnect = false,
  } = config;

  const { CardComponent, SkeletonComponent, FilterComponent, CreateButton, EmptyComponent } =
    slots;

  const [totalData, setTotalData] = useState<number | null>(null);
  const { ref, inView } = useInView();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState('');
  const debouncedSearch = useDebounce(localQuery, searchDebounceMs);
  const urlSearchQuery = searchParams.get('query')?.toString() || '';
  const searchValue = searchMode === 'url' ? urlSearchQuery : debouncedSearch;

  const resolvedSearchField = useMemo(() => {
    if (configSearchField) return configSearchField;
    return (
      searchBoxList.find((item) => item.fieldOperation === 'MATCH')?.fieldName ??
      'formSetting.name'
    );
  }, [configSearchField, searchBoxList]);

  useEffect(() => {
    if (searchParams.get('new') !== null) {
      setIsDialogOpen(true);
    } else {
      setIsDialogOpen(false);
    }
  }, [searchParams]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('new');
    router.replace(`?${newSearchParams.toString()}`);
  };

  const handleOpenDialog = () => {
    router.push('?new');
  };

  const {
    data: pages,
    error,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetching,
    isFetchingNextPage,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: [queryKey, searchValue, searchQueryFilter, filterBoxList],
    queryFn: async ({ pageParam }) => {
      const updatedSearchBoxList = applySearchValue(
        searchBoxList,
        resolvedSearchField,
        searchValue,
      );

      const result = await fetcher({
        pageParam,
        searchValue,
        searchBoxList: updatedSearchBoxList,
        filterBoxList,
        searchQueryFilter,
        pageSize,
      });

      if (!result.success) {
        throw new Error(result.message ?? 'خطا در دریافت اطلاعات');
      }

      return result;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data && lastPage.data.length === pageSize
        ? allPages.length
        : undefined;
    },
    refetchInterval,
    refetchOnWindowFocus,
    refetchOnReconnect,
  });

  const handleRefreshGrid = useCallback(() => {
    if (isFilterOpen) {
      setIsFilterOpen(false);
    }
    refetch();
  }, [isFilterOpen, refetch]);

  const closeMobileFilter = useCallback(() => {
    setIsFilterOpen(false);
  }, []);

  const openFilter = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (!disableFilter && FilterComponent) {
        onMobileFilterOpen?.();
        setIsFilterOpen(true);
      }
    },
    [disableFilter, FilterComponent, onMobileFilterOpen],
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (refreshGrid) {
      handleRefreshGrid();
    }
  }, [refreshGrid, handleRefreshGrid]);

  useEffect(() => {
    if (pages?.pages?.[0]?.total !== undefined) {
      setTotalData(pages.pages[0].total);
    } else {
      setTotalData(0);
    }
  }, [pages]);

  useEffect(() => {
    if (isError && error) {
      toast.error((error as Error).message);
    }
  }, [isError, error]);

  const renderHeader = useCallback(
    () => (
      <div className="w-full h-[52px] flex items-center justify-center rounded-lg bg-[#F7F7FF] px-2 mb-4 relative shrink-0 overflow-hidden">
        <IconButton
          sx={{ position: 'absolute', left: '8px', zIndex: 1, flexShrink: 0 }}
          onClick={() => router.push(backHref)}>
          <MdOutlineKeyboardArrowRight color="#292D32" />
        </IconButton>
        <p
          title={title}
          className="text-[16px] text-center font-bold text-[#161616] truncate w-full max-w-full px-10">
          {title}
        </p>
      </div>
    ),
    [title, router, backHref],
  );

  const renderTotalCount = useCallback(
    () => (
      <div className="flex justify-between gap-2 bg-[#ECFAFF] rounded-2xl px-[10px] py-4 w-full">
        <div className="flex items-center gap-[10px]">
          <Image src={TotalGrid} width={20} height={20} alt="filter" draggable={false} />
          <p className="text-sm text-[#393939]">{textTotal[0]}:</p>
        </div>

        {isFetching ? (
          <div className="w-11 h-5 bg-gray-200 rounded animate-pulse" />
        ) : (
          <p className="flex items-center text-sm text-[#393939] font-bold">
            {totalData} {textTotal[1]}
          </p>
        )}
      </div>
    ),
    [totalData, textTotal, isFetching],
  );

  const renderSearchAndFilter = useCallback(
    () => (
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          gap: 2,
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
          {searchMode === 'url' ? (
            <SearchInput />
          ) : (
            <ImmediateSearchInput onSearch={setLocalQuery} />
          )}
          {!disableFilter && FilterComponent && (
            <IconButton
              type="button"
              onClick={openFilter}
              sx={{
                display: { xs: 'flex', lg: 'none' },
                flexShrink: 0,
                border: '1px solid #c9c9c9',
                borderRadius: '15px',
                padding: '8px',
                width: 51,
                height: 51,
              }}>
              <Image src={Filter} width={35} height={35} alt="Filter" draggable={false} />
            </IconButton>
          )}
        </Box>
      </Box>
    ),
    [disableFilter, openFilter, searchMode, FilterComponent],
  );

  const renderContent = useCallback(() => {
    const allItems = pages?.pages.flatMap((page) => page.data ?? []) ?? [];
    const errorMessage = isError ? (error as Error)?.message : undefined;

    if (isPending) {
      return <SkeletonComponent />;
    }

    if (isError && allItems.length === 0) {
      if (EmptyComponent) {
        return <EmptyComponent error={errorMessage} />;
      }
      return <EmptyList error={errorMessage} />;
    }

    if (allItems.length === 0) {
      if (EmptyComponent) {
        return <EmptyComponent />;
      }
      return <EmptyList />;
    }

    return pages?.pages.map((page, pageIndex) =>
      (page.data ?? []).map((data, index) => {
        const key = `${pageIndex}-${index}`;
        const isLastItem =
          pageIndex === (pages.pages.length ?? 0) - 1 &&
          index === (page.data?.length ?? 0) - 1;

        return (
          <Grid sx={{ width: '100%', mx: 'auto' }} key={key} size={12}>
            <CardComponent data={data as TItem} onCheck={onCheck} refreshGrid={handleRefreshGrid} />
            {isLastItem && (
              <>
                <Typography component="h1" ref={ref} sx={{ height: 0 }} />
                <Box sx={{ width: '100%' }}>{isFetchingNextPage && <LinearProgress />}</Box>
              </>
            )}
          </Grid>
        );
      }),
    );
  }, [
    pages,
    isPending,
    isError,
    isFetchingNextPage,
    CardComponent,
    SkeletonComponent,
    EmptyComponent,
    onCheck,
    handleRefreshGrid,
    ref,
    error,
  ]);

  const renderDesktopFilter = useCallback(
    () =>
      FilterComponent ? (
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
            <FilterComponent mode="desktop" closeMobileFilter={closeMobileFilter} refreshList={handleRefreshGrid} />
          </Grid>
        </Grid>
      ) : null,
    [FilterComponent, closeMobileFilter],
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
            {renderHeader()}
            <Grid
              container
              size={{ xs: 12, md: 10, xl: 9 }}
              sx={{
                width: '100%',
                mx: 'auto',
                maxWidth: '470px',
                flexDirection: 'column',
                gap: 1,
              }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '6px',
                  width: '100%',
                  flexWrap: { xs: 'nowrap', sm: 'nowrap' },
                }}>
                {renderTotalCount()}
                {showCreateButton && (
                  <div className="min-w-[50px] w-[50px] h-full">
                    <IconButton
                      onClick={handleOpenDialog}
                      sx={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '16px',
                        border: '1px solid #1758BA',
                      }}>
                      <Image src={PlusIcon} alt="" width={22} height={22} />
                    </IconButton>
                    <CreateFormBtn open={isDialogOpen} onClose={handleCloseDialog} />
                  </div>
                )}
                {CreateButton}
              </Box>
              {renderSearchAndFilter()}
              <Grid
                id="content"
                container
                flexWrap="nowrap"
                sx={{
                  width: '100%',
                  mt: 1,
                  mb: 5,
                  pb: 4,
                  flexDirection: 'column',
                  gap: 1,
                  overflowY: 'auto',
                  px: 0,
                  height: {
                    xs: 'calc(100vh - 310px)',
                    sm: 'calc(100vh - 290px)',
                    md: 'calc(100vh - 230px)',
                  },
                  scrollbarWidth: 'none',
                }}>
                {renderContent()}
              </Grid>
            </Grid>
          </Grid>
          {FilterComponent && (
            <BottomSheet open={isFilterOpen} onClose={closeMobileFilter}>
              <Grid>
                <FilterComponent mode="mobile" closeMobileFilter={closeMobileFilter} refreshList={handleRefreshGrid} />
              </Grid>
            </BottomSheet>
          )}
        </Grid>
        {renderDesktopFilter()}
      </Grid>
    </div>
  );
};

export default UnifiedListGrid;
