// 'use client';

// import Image from 'next/image';
// import { toast } from 'sonner';
// import { useInfiniteQuery } from '@tanstack/react-query';
// import { useInView } from 'react-intersection-observer';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
// import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
// import { Box, Grid2 as Grid, IconButton, LinearProgress, Typography } from '@mui/material';
// // hook
// import { useDebounce } from '@/hooks/useDebounce';
// // componenst
// import BottomSheet from '../BottomSheet/BottomSheet';
// import ImmediateSearchInput from './ImmediateSearchInput';
// import CreateFormBtn from '../CreateFormBtn/CreateFormBtn';
// // image
// import Filter from '@/../public/images/home-page/FilterAA.svg';
// import PlusIcon from '@/../public/images/home-page/Add-fill.svg';
// import TotalGrid from '@/../public/images/home-page/total-grid.svg';
// import formListEmpty from '@/../public/images/home-page/formListEmpty.png';
// // action
// import { fetchListGridData, SearchQueryFilter } from '../../../actions/listGridActions';
// import EmptyList from './EmptyList';

// export interface SearchBoxItem {
//   fieldName: string;
//   fieldOperation: 'MATCH' | 'EQUAL' | 'DSC' | 'ASC' | 'IN';
//   fieldValue: string | string[];
//   nextConditionOperator: 'OR' | 'AND';
// }
// interface PageResponse {
//   data: any[];
//   total: number;
// }

// interface IProps {
//   searchBoxList: SearchBoxItem[];
//   filterBoxList: SearchBoxItem[];
//   filterComponent: ReactNode;
//   url: string;
//   onCheck?: (id: any, checked: any) => void;
//   onDelete?: () => void;
//   CartComponent?: React.ComponentType<{
//     data: any;
//     onCheck?: (id: any, checked: any) => void;
//     refreshGrid?: () => void;
//   }>;
//   refreshGrid?: boolean;
//   disableFilter?: boolean;
//   textTotal?: [string, string];
//   searchQueryFilter?: SearchQueryFilter;
//   showCreateButton?: boolean;
//   title: string;
//   CreateButton?: () => React.ReactNode;
//   SkeletonComponent: () => ReactNode

// }

// const DEFAULT_SEARCH_FILTER = {
//   type: 'ALL',
//   status: 'ALL',
//   isCreatedSoloReport: 'ALL',
//   fieldOperation: 'DSC',
// };

// const ListGrid: React.FC<IProps> = ({
//   url,
//   title,
//   onCheck,
//   refreshGrid,
//   CreateButton,
//   disableFilter,
//   searchBoxList,
//   filterBoxList,
//   CartComponent,
//   filterComponent,
//   searchQueryFilter = DEFAULT_SEARCH_FILTER,
//   showCreateButton = false,
//   textTotal = ['تعداد کل فرم‌ها', 'عدد'],
//   SkeletonComponent
// }) => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { ref, inView } = useInView();

//   const [query, setQuery] = useState('');
//   const debouncedSearch = useDebounce(query, 500);

//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [isDialogOpen, setIsDialogOpen] = useState(searchParams.get('new') !== null);

//   useEffect(() => {
//     setIsDialogOpen(searchParams.get('new') !== null);
//   }, [searchParams]);

//   const handleCloseDialog = () => {
//     setIsDialogOpen(false);
//     const params = new URLSearchParams(searchParams.toString());
//     params.delete('new');
//     router.replace(`?${params.toString()}`);
//   };

//   const handleOpenDialog = () => {
//     router.push('?new');
//   };

//   const updatedSearchBoxList = useMemo(() => {
//     return searchBoxList.map((item) =>
//       item.fieldName === 'formSetting.name'
//         ? { ...item, fieldValue: debouncedSearch }
//         : item
//     );
//   }, [searchBoxList, debouncedSearch]);

//   const {
//     data: pages,
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetching,
//     isFetchingNextPage,
//     refetch,
//   } = useInfiniteQuery<PageResponse>({
//     queryKey: [
//       'datas_builder_query',
//       debouncedSearch,
//       searchQueryFilter.type,
//       searchQueryFilter.status,
//       searchQueryFilter.isCreatedSoloReport,
//       searchQueryFilter.fieldOperation,
//       updatedSearchBoxList
//     ],
//     queryFn: ({ pageParam }) =>
//       fetchListGridData(
//         { pageParam } as any,
//         updatedSearchBoxList,
//         filterBoxList,
//         url,
//         searchQueryFilter
//       ),
//     initialPageParam: 0,
//     getNextPageParam: (lastPage, allPages) => {
//       const PAGE_SIZE = 10;
//       return lastPage.data?.length === PAGE_SIZE ? allPages.length : undefined;
//     },
//     refetchOnWindowFocus: false,
//   });

//   useEffect(() => {
//     if (error) toast.error((error as Error).message);
//   }, [error]);

//   const totalData = pages?.pages?.[0]?.total ?? 0;

//   const allItems = useMemo(
//     () => pages?.pages.flatMap((page) => page.data) ?? [],
//     [pages]
//   );

//   const handleRefreshGrid = useCallback(() => {
//     setIsFilterOpen(false);
//     refetch();
//   }, [refetch]);

//   useEffect(() => {
//     if (refreshGrid) handleRefreshGrid();
//   }, [refreshGrid, handleRefreshGrid]);

//   useEffect(() => {
//     if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
//   }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

//   const openFilter = () => {
//     if (!disableFilter) setIsFilterOpen(true);
//   };

//   return (
//     <div className="p-1 sm:py-2 h-full w-full flex flex-col overflow-hidden">

//       <Grid
//         width="100%"
//         display="flex"
//         sx={{
//           overflowY: 'hidden',
//           height: { xs: 'calc(100vh - 60px)', md: '100vh' },
//           flexDirection: { xs: 'column', lg: 'row' },
//         }}
//       >
//         <Grid
//           container
//           flexDirection="column"
//           alignItems="center"
//           sx={{
//             bgcolor: 'white',
//             borderRadius: '16px',
//             p: { xs: 1, sm: 2 },
//             mx: { xs: 0, sm: 1 },
//             width: 1,
//             overflow: 'hidden',
//           }}
//         >
//           <Grid container sx={{ width: '100%', justifyContent: 'center', mx: 'auto' }}>

//             {/* Header */}
//             <div className="w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4 relative shrink-0">
//               <IconButton sx={{ position: 'absolute', left: '8px' }} onClick={() => router.push('/')}>
//                 <MdOutlineKeyboardArrowRight color="#292D32" />
//               </IconButton>
//               <p className="text-[16px] text-center font-bold text-[#161616]">{title}</p>
//             </div>

//             {/* Total Count + Create */}
//             <Box
//               sx={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 gap: '12px',
//                 width: 1,
//               }}
//             >
//               <div className="flex justify-between gap-2 bg-[#ECFAFF] rounded-2xl px-[10px] py-4 w-full max-w-[400px]">
//                 <div className="flex items-center gap-[10px]">
//                   <Image src={TotalGrid} width={20} height={20} alt="filter" draggable={false} />
//                   <p className="text-sm text-[#393939]">{textTotal[0]}:</p>
//                 </div>
//                 <p className="flex items-center text-sm text-[#393939] font-bold">
//                   {totalData} {textTotal[1]}
//                 </p>
//               </div>

//               {showCreateButton && (
//                 <div className="min-w-[50px] w-[50px] h-full">
//                   <IconButton
//                     onClick={handleOpenDialog}
//                     sx={{
//                       width: '50px',
//                       height: '50px',
//                       borderRadius: '16px',
//                       border: '1px solid #1758BA',
//                     }}
//                   >
//                     <Image src={PlusIcon} alt="" width={22} height={22} />
//                   </IconButton>

//                   <CreateFormBtn open={isDialogOpen} onClose={handleCloseDialog} />
//                 </div>
//               )}

//               {CreateButton && CreateButton()}
//             </Box>

//             {/* Search + Filter */}
//             <Grid
//               display="flex"
//               sx={{ width: '100%', maxWidth: '560px', justifyContent: 'center', mt: 1, gap: 2 }}
//             >
//               <Grid size={{ xs: 12, sm: 10 }} sx={{ display: 'flex', alignItems: 'center', gap: '12px', mx: 'auto' }}>
//                 <ImmediateSearchInput onSearch={setQuery} />
//                 {!disableFilter && (
//                   <IconButton
//                     onClick={openFilter}
//                     sx={{
//                       display: { xs: 'flex', lg: 'none' },
//                       flexShrink: 0,
//                       border: '1px solid #c9c9c9',
//                       borderRadius: '15px',
//                       padding: '8px',
//                       width: 51,
//                       height: 51,
//                     }}
//                   >
//                     <Image src={Filter} width={35} height={35} alt="Filter" draggable={false} />
//                   </IconButton>
//                 )}
//               </Grid>
//             </Grid>

//             {/* Content */}
//             <Grid
//               id="content"
//               container
//               flexWrap="nowrap"
//               sx={{
//                 width: 1,
//                 mx: 'auto',
//                 mt: 1,
//                 mb: 5,
//                 pb: 4,
//                 mr: { xs: 0, md: isFetching || allItems.length > 3 ? -1.2 : 0 },
//                 flexDirection: 'column',
//                 gap: 2,
//                 overflowY: 'auto',
//                 height: {
//                   xs: 'calc(100vh - 290px)',
//                   md: 'calc(100vh - 210px)',
//                 },
//               }}
//             >
//               {isFetching && allItems.length === 0 ? (
//                    <SkeletonComponent />
//               ) : allItems.length === 0 ? (
//                    <EmptyList error={error?.message}/>
//               ) : (
//                 pages?.pages?.map((page, pageIndex) =>
//                   page.data.map((data, index) => {
//                     const key = `${pageIndex}-${index}`;
//                     const isLastItem =
//                       pageIndex === pages.pages.length - 1 &&
//                       index === page.data.length - 1;

//                     return (
//                       <Grid
//                         sx={{ width: 1, mx: 'auto', maxWidth: '470px' }}
//                         key={key}
//                         size={{ xs: 12, md: 10, xl: 9 }}
//                       >
//                         {CartComponent && (
//                           <CartComponent
//                             onCheck={onCheck}
//                             data={data}
//                             refreshGrid={handleRefreshGrid}
//                           />
//                         )}

//                         {isLastItem && (
//                           <>
//                             <Typography component="h1" ref={ref} sx={{ height: 0 }} />
//                             <Box sx={{ width: '100%' }}>
//                               {isFetchingNextPage && <LinearProgress />}
//                             </Box>
//                           </>
//                         )}
//                       </Grid>
//                     );
//                   })
//                 )
//               )}
//             </Grid>
//           </Grid>

//           <BottomSheet open={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
//             <Grid>{filterComponent}</Grid>
//           </BottomSheet>
//         </Grid>

//         {filterComponent && (
//           <Grid
//             width="100%"
//             display={{ xs: 'none', lg: 'flex' }}
//             flexDirection="column"
//             alignItems="center"
//             sx={{
//               backgroundColor: 'white',
//               borderRadius: '16px',
//               gap: 1,
//               ml: 0,
//               p: 2,
//               maxWidth: '300px',
//             }}
//           >
//             <Grid sx={{ width: '100%', minWidth: '200px', maxWidth: '300px' }}>
//               {filterComponent}
//             </Grid>
//           </Grid>
//         )}
//       </Grid>
//     </div>
//   );
// };

// export default ListGrid;


'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Grid2 as Grid, IconButton, LinearProgress, Typography } from '@mui/material';
// components
import BottomSheet from '../BottomSheet/BottomSheet';
import CreateFormBtn from '../CreateFormBtn/CreateFormBtn';
// image
import Filter from '@/../public/images/home-page/FilterAA.svg';
import PlusIcon from '@/../public/images/home-page/Add-fill.svg';
import TotalGrid from '@/../public/images/home-page/total-grid.svg';
// action
import { fetchListGridData } from '../../../actions/listGridActions';
import { useDebounce } from '@/hooks/useDebounce';
import ImmediateSearchInput from './ImmediateSearchInput';
import EmptyList from './EmptyList';
// import { fetchData } from './dataService';

export interface SearchBoxItem {
  fieldName: string;
  fieldOperation: 'MATCH' | 'EQUAL' | 'DSC' | 'ASC' | 'IN';
  fieldValue: string | string[];
  nextConditionOperator: 'OR' | 'AND';
}
interface Props {
  url: string;
  title: string;
  searchBoxList: SearchBoxItem[];
  filterBoxList: SearchBoxItem[];
  filterComponent: ReactNode;
  onCheck?: (id: any, checked: any) => void;
  onDelete?: () => void;
  CartComponent?: React.ComponentType<{
    data: any;
    onCheck?: (id: any, checked: any) => void;
    refreshGrid?: () => void;
  }>;
  refreshData?: () => void;
  refreshGrid?: boolean;
  disableFilter?: boolean;
  textTotal?: [string, string];
  searchQueryFilter?: { type: string; status: string, isCreatedSoloReport: string, fieldOperation: string };
  showCreateButton?: boolean;
  CreateButton?: () => React.ReactNode;
  SkeletonComponent: () => ReactNode
}

const DEFAULT_SEARCH_FILTER = { type: 'ALL', status: 'ALL', isCreatedSoloReport: 'ALL', fieldOperation: "DSC" };

const ListGrid: React.FC<Props> = ({
  title,
  url,
  onCheck,
  refreshGrid,
  searchBoxList,
  filterBoxList,
  CartComponent,
  disableFilter,
  filterComponent,
  searchQueryFilter = DEFAULT_SEARCH_FILTER,
  showCreateButton = false,
  textTotal = ['تعداد کل فرم‌ها', 'عدد'],
  CreateButton,
  SkeletonComponent
}) => {
  const [totalData, setTotalData] = useState<number | null>(null);
  const { ref, inView } = useInView();
  const searchParams = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [query, setQuery] = useState('');
  const debouncedSearch = useDebounce(query, 500);

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

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();

  const updatedSearchBoxList = useMemo(() => {
    return searchBoxList.map((item) =>
      item.fieldName === 'formSetting.name'
        ? { ...item, fieldValue: debouncedSearch }
        : item
    );
  }, [searchBoxList, debouncedSearch]);

  const {
    data: pages,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['datas_builder_query', debouncedSearch, searchQueryFilter, filterBoxList],
    queryFn: ({ pageParam }) => fetchListGridData({ pageParam }, updatedSearchBoxList, filterBoxList, url, searchQueryFilter),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const PAGE_SIZE = 10;
      return lastPage.data && lastPage.data.length === PAGE_SIZE ? allPages.length : undefined;
    },
    refetchOnWindowFocus: false,
  });

  const handleRefreshGrid = useCallback(() => {
    if (isFilterOpen) {
      setIsFilterOpen(false);
    }
    refetch();
  }, [isFilterOpen, refetch]);

  const openFilter = useCallback(() => {
    if (!disableFilter) {
      setIsFilterOpen(true);
    }
  }, [disableFilter]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  useEffect(() => {
    // if (refreshGrid) {
    handleRefreshGrid();
    // }
  }, [refreshGrid, handleRefreshGrid]);

  useEffect(() => {
    if (pages?.pages?.[0]?.total !== undefined) {
      setTotalData(pages.pages[0].total);
    } else {
      setTotalData(0);
    }
  }, [pages]);

  useEffect(() => {
    if (error) toast.error((error as Error).message);
  }, [error]);


  const renderHeader = useCallback(
    () => (
      <div className='w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4 relative shrink-0'>
        <IconButton sx={{ position: 'absolute', left: '8px' }} onClick={() => router.push('/')}>
          <MdOutlineKeyboardArrowRight color='#292D32' />
        </IconButton>
        <p className='text-[16px] text-center font-bold text-[#161616]'>{title}</p>
      </div>
    ),
    [title, router],
  );

  const renderTotalCount = useCallback(
    () => (
      <div className='flex justify-between gap-2 bg-[#ECFAFF] rounded-2xl px-[10px] py-4 w-full max-w-[400px]'>
        <div className='flex items-center gap-[10px]'>
          <Image src={TotalGrid} width={20} height={20} alt='filter' draggable={false} />
          <p className='text-sm text-[#393939]'>{textTotal[0]}:</p>
        </div>

        {isFetching ? (
          <div className="w-10 h-6 bg-gray-200 rounded animate-pulse" />
        ) : (
          <p className='flex items-center text-sm text-[#393939] font-bold'>
            {totalData} {textTotal[1]}
          </p>
        )}
      </div>
    ),
    [totalData, textTotal],
  );

  const renderSearchAndFilter = useCallback(
    () => (
      <Grid
        display='flex'
        sx={{
          width: '100%',
          maxWidth: '560px',
          justifyContent: 'center',
          mt: 1,
          gap: 2,
        }}>
        <Grid size={{ xs: 12, sm: 10 }} sx={{ display: 'flex', alignItems: 'center', gap: '12px', mx: 'auto' }}>
          <ImmediateSearchInput onSearch={setQuery} />
          {!disableFilter && (
            <IconButton
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
              <Image src={Filter} width={35} height={35} alt='Filter' draggable={false} />
            </IconButton>
          )}
        </Grid>
      </Grid>
    ),
    [disableFilter, openFilter],
  );

  const renderContent = useCallback(() => {
    const allItems = pages?.pages.flatMap((page) => page.data) || [];
    if (isFetching && !isFetchingNextPage) {
      return (
        <SkeletonComponent />
      );
    }

    if (allItems.length === 0) {
      return (
        <EmptyList error={error?.message} />
      );
    }

    // @ts-ignore
    return pages.pages.map((page, pageIndex) =>
      page.data.map((data: any, index: number) => {
        const key = `${pageIndex}-${index}`;
        // @ts-ignore
        const isLastItem = pageIndex === pages.pages.length - 1 && index === page.data.length - 1;

        return (
          <Grid sx={{ width: 1, mx: 'auto', maxWidth: '470px' }} key={key} size={{ xs: 12, md: 10, xl: 9 }}>
            {CartComponent && <CartComponent onCheck={onCheck} data={data} refreshGrid={handleRefreshGrid} />}
            {isLastItem && (
              <>
                <Typography component='h1' ref={ref} sx={{ height: 0 }} />
                <Box sx={{ width: '100%' }}>{isFetchingNextPage && <LinearProgress />}</Box>
              </>
            )}
          </Grid>
        );
      }),
    );
  }, [pages, isFetching, isFetchingNextPage, CartComponent, onCheck, handleRefreshGrid, ref]);

  const renderDesktopFilter = useCallback(
    () =>
      filterComponent && (
        <Grid
          width='100%'
          display={{ xs: 'none', lg: 'flex' }}
          flexDirection='column'
          justifyContent='flex-start'
          alignItems='center'
          sx={{
            backgroundColor: 'white',
            borderRadius: '16px',
            gap: 1,
            ml: 0,
            p: 2,
            maxWidth: '300px',
          }}>
          <Grid sx={{ width: '100%', minWidth: '200px', maxWidth: '300px' }}>{filterComponent}</Grid>
        </Grid>
      ),
    [filterComponent],
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
                }}
            >
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
                    }}
                >

            <Grid container sx={{ width: '100%', justifyContent: 'center', mx: 'auto' }}>
              {renderHeader()}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '12px',
                  width: 1,
                  flexWrap: { xs: 'nowrap', sm: 'nowrap' },
                }}>
                {renderTotalCount()}
                {showCreateButton && (
                  <div className='min-w-[50px] w-[50px] h-full'>
                    <IconButton
                      onClick={handleOpenDialog}
                      sx={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '16px',
                        border: '1px solid #1758BA',
                      }}>
                      <Image src={PlusIcon} alt='' width={22} height={22} />
                    </IconButton>

                    <CreateFormBtn open={isDialogOpen} onClose={handleCloseDialog} />
                  </div>
                )}
                {CreateButton && CreateButton()}
              </Box>
              {renderSearchAndFilter()}
                <Grid
                                         id='content'
                                         container
                                         flexWrap='nowrap'
                                         sx={{
                                             width: 1,
                                             mt: 1,
                                             mb: 5,
                                             pb: 4,
                                             flexDirection: 'column',
                                             gap: 2,
                                             overflowY: 'auto',
                                             px: { xs: 0, sm: 0 },
                                             mx: { xs: 0, sm: 'auto' },
                                             height: {
                                                 xs: 'calc(100vh - 310px)',
                                                 sm: 'calc(100vh - 290px)',
                                                 md: 'calc(100vh - 230px)',
                                             },
                                         }}>
                {renderContent()}
              </Grid>
            </Grid>
            <BottomSheet open={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
              <Grid>{filterComponent}</Grid>
            </BottomSheet>
          </Grid>
          {renderDesktopFilter()}
        </Grid>
    </div>
  );
};

export default ListGrid;
