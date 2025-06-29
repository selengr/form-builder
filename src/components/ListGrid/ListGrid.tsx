"use client";

import React, {ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import Image from "next/image";
import {useInfiniteQuery} from "@tanstack/react-query";
import {useInView} from "react-intersection-observer";
import {useRouter, useSearchParams} from "next/navigation";
import SearchInput from "./SearchInput";
import {Box, Grid2 as Grid, IconButton, LinearProgress, Typography} from "@mui/material";
import TotalGrid from "@/../public/images/home-page/total-grid.svg";
import Filter from "@/../public/images/home-page/FilterAA.svg";
import {clientFetch} from "./clientFetch";
import BottomSheet from "../BottomSheet/BottomSheet";
import CreateFormBtn from "../CreateFormBtn/CreateFormBtn";
import {MdOutlineKeyboardArrowRight} from "react-icons/md";
import {toast} from "sonner";
import formListEmpty from '@/../public/images/home-page/formListEmpty.png'

interface SearchBoxItem {
  fieldName: string;
  fieldOperation: "MATCH" | "EQUAL" | "DSC" | "ASC" | "IN";
  fieldValue: string | string[];
  nextConditionOperator: "OR" | "AND";
}

interface Props {
  searchBoxList: SearchBoxItem[];
  filterBoxList: SearchBoxItem[];
  filterComponent: ReactNode;
  url: string;
  onCheck?: (id: any, checked: any) => void;
  onDelete?: () => void;
  CartComponent?: React.ComponentType<{
    data: any; onCheck?: (id: any, checked: any) => void; refreshGrid?: () => void;
  }>;
  refreshData?: () => void;
  refreshGrid?: boolean;
  disableFilter?: boolean;
  textTotal?: [string, string];
  searchQueryFilter?: { type: string; status: string };
  showCreateButton?: boolean;
  title: string;
}

const PAGE_SIZE = 10;
const DEFAULT_SEARCH_FILTER = {type: "ALL", status: "PUBLIC"};

async function fetchData({pageParam = 0}: {
  pageParam: number
}, searchBoxList: SearchBoxItem[], filterBoxList: SearchBoxItem[], url: string, searchQueryFilter = DEFAULT_SEARCH_FILTER) {
  const filterRestrictions: SearchBoxItem[] = [];
  if (searchQueryFilter.type && searchQueryFilter.type !== "ALL") {
    filterRestrictions.push({
      fieldName: "typeEnum", fieldOperation: "EQUAL", fieldValue: searchQueryFilter.type, nextConditionOperator: "AND"
    });
  }
  if (searchQueryFilter.status && searchQueryFilter.status !== "ALL") {
    filterRestrictions.push({
      fieldName: "status", fieldOperation: "EQUAL", fieldValue: searchQueryFilter.status, nextConditionOperator: "AND"
    });
  }

  const validCombinedRestrictionList = [...searchBoxList, ...filterBoxList, ...filterRestrictions].filter(item => {
    if (item === undefined || item === null) return false;
    if (typeof item.fieldValue === 'string') {
      return item.fieldValue !== '';
    }
    if (Array.isArray(item.fieldValue)) {
      return item.fieldValue.length > 0;
    }
    return true;
  });

  const searchFilterBoxListPayload = [{restrictionList: validCombinedRestrictionList}];

  const params = {
    searchFilterBoxList: searchFilterBoxListPayload, sortList: [{fieldName: "id", type: "DSC"}], page: pageParam, rows: PAGE_SIZE,
  };

  const endpoint = `${url}?searchFilterModel=`;
  const response = await clientFetch(endpoint, params);

  if (!response) {

  }

  return {
    data: response.data.content, total: response.data.totalElements,
  };
}

const ListGrid: React.FC<Props> = ({
                                     filterComponent,
                                     searchBoxList,
                                     filterBoxList,
                                     CartComponent,
                                     url,
                                     onCheck,
                                     refreshGrid,
                                     disableFilter,
                                     searchQueryFilter = DEFAULT_SEARCH_FILTER,
                                     showCreateButton = false,
                                     title,
                                     textTotal = ["", "عدد"],
                                   }) => {
  const [totalData, setTotalData] = useState<number | null>(null);
  const {ref, inView} = useInView();
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toString() || "";

  const memoizedFilterComponent = useMemo(() => filterComponent, [filterComponent]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();

  const {
    data: pages, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, refetch,
  } = useInfiniteQuery({
    queryKey: ["datas", query, searchQueryFilter, filterBoxList],
    queryFn: ({pageParam}) => fetchData({pageParam}, searchBoxList, filterBoxList, url, searchQueryFilter),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
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

  if (isFetching && !isFetchingNextPage) {
    return (<Box sx={{width: "100%"}}>
      <LinearProgress/>
    </Box>);
  }

  if (error) {
    toast.error(error.message);
  }

  const renderHeader = () => (
    <div className="w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4 relative shrink-0">
      <IconButton sx={{position: "absolute", left: "8px"}} onClick={() => router.push("/")}>
        <MdOutlineKeyboardArrowRight color="#292D32"/>
      </IconButton>
      <p className="text-[16px] text-center font-bold text-[#161616]">
        {title}
      </p>
    </div>);

  const renderTotalCount = () => (<Grid
    display="flex"
    sx={{
      width: "100%",
      maxWidth: "400px",
      justifyContent: "space-between",
      gap: 2,
      bgcolor: "#ECFAFF",
      borderRadius: "16px",
      paddingX: "10px",
      paddingY: "16px",
    }}
  >
    <Box display="flex" alignItems="center" gap="10px">
      <Image src={TotalGrid} width={20} height={20} alt="filter" draggable={false}/>
      <Typography color="#393939" fontSize="14px">
        تعداد کل فرم‌ها {textTotal[0]}:
      </Typography>
    </Box>
    <p className="flex items-center text-[14px] text-[#393939] font-bold">
      {totalData} {textTotal[1]}
    </p>
  </Grid>);

  const renderSearchAndFilter = () => (<Grid
    display="flex"
    sx={{
      width: "100%", maxWidth: "550px", justifyContent: "center", mt: 1, gap: 2,
    }}
  >
    <Grid
      size={{xs: 12, sm: 10}}
      sx={{display: "flex", alignItems: "center", gap: "12px", mx: "auto"}}
    >
      <SearchInput/>
      {!disableFilter && (<IconButton
          onClick={openFilter}
          sx={{
            display: {xs: "flex", lg: "none"},
            flexShrink: 0,
            border: "1px solid #c9c9c9",
            borderRadius: "15px",
            padding: "8px",
            width: 51,
            height: 51,
          }}
        >
          <Image
            src={Filter}
            width={35}
            height={35}
            alt="Filter"
            draggable={false}
          />
        </IconButton>)}
    </Grid>
  </Grid>);

  const renderContent = () => {
    const allItems = pages?.pages.flatMap(page => page.data) || [];

    if (isFetching && !isFetchingNextPage) {
      return (<Box sx={{width: "100%", mt: 2}}>
        <LinearProgress/>
      </Box>);
    }

    if (allItems.length === 0) {
      return (<Box
        sx={{
          display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", height: "60vh", width: "100%",
        }}
      >
        <Image src={formListEmpty} alt="No forms found" height={256} priority draggable={false}/>
        <Typography sx={{fontSize: "18px", color: "#999"}}>
          موردی یافت نشد
        </Typography>
      </Box>);
    }

    // @ts-ignore
    return pages.pages.map((page, pageIndex) => page.data.map((data: any, index: number) => {
      const key = `${pageIndex}-${index}`;
      // @ts-ignore
      const isLastItem = (pageIndex === pages.pages.length - 1) && (index === page.data.length - 1);

      return (<Grid sx={{width: 1, mx: "auto"}} key={key} size={{xs: 12, md: 10, lg: 8, xl: 6}}>
        {CartComponent && (<CartComponent onCheck={onCheck} data={data} refreshGrid={handleRefreshGrid}/>)}
        {isLastItem && (<>
          <Typography component="h1" ref={ref} sx={{height: 0}}/>
          <Box sx={{width: "100%"}}>
            {isFetchingNextPage && <LinearProgress/>}
          </Box>
        </>)}
      </Grid>);
    }));
  };

  const renderDesktopFilter = () => filterComponent && (<Grid
    width="100%"
    display={{xs: "none", lg: "flex"}}
    flexDirection="column"
    justifyContent="flex-start"
    alignItems="center"
    sx={{
      backgroundColor: "white", borderRadius: "16px", gap: 1, m: 1, ml: 0, p: 2, maxWidth: "300px",
    }}
  >
    <Grid sx={{width: "100%", minWidth: "200px", maxWidth: "300px"}}>
      {filterComponent}
    </Grid>
  </Grid>);

  return (<Grid
      width="100%"
      display="flex"
      sx={{
        overflowY: "hidden", userSelect: "none", height: {xs: "calc(100vh - 60px)", md: "100vh"}, flexDirection: {xs: "column", lg: "row"},
      }}
    >
      <Grid
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
        container
        sx={{
          bgcolor: "white", borderRadius: "16px", p: 2, mx: 1, width: 1, overflowY: "hidden", height: "100%",
        }}
      >
        <Grid container sx={{width: "100%", justifyContent: "center", mx: "auto"}}>
          {renderHeader()}
          <Box
            sx={{
              display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", width: "100%", flexWrap: {xs: "wrap", sm: "nowrap"},
            }}
          >
            {renderTotalCount()}
            {showCreateButton && (<div className="min-w-[50px] w-[50px] h-full">
                <CreateFormBtn/>
              </div>)}
          </Box>
          {renderSearchAndFilter()}
          <Grid
            id="content"
            container
            flexWrap="nowrap"
            sx={{
              width: 1, mx: "auto", mt: 1, mb: 5, flexDirection: "column", gap: 2, overflowY: "auto", height: {
                xs: "calc(100vh - 290px)", md: "calc(100vh - 210px)",
              },
            }}
          >
            {renderContent()}
          </Grid>
        </Grid>
        <BottomSheet open={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
          <Grid>{memoizedFilterComponent}</Grid>
        </BottomSheet>
      </Grid>
      {renderDesktopFilter()}
    </Grid>);
};

export default ListGrid;
