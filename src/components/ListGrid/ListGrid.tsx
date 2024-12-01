/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "next/navigation";
import SearchInput from "./SearchInput";
import { Box, Grid2, LinearProgress, Typography } from "@mui/material";
import TotalGrid from "@/../public/images/home-page/total-grid.svg";
import FilterIcon from "@/../public/images/home-page/filter-icon.svg";
import { clientFetch } from "./clientFetch";
import BottomSheet from "../BottomSheet/BottomSheet";
import CreateFormBtn from "../CreateFormBtn/CreateFormBtn";
// import { useSession } from "next-auth/react";

interface SearchBoxItem {
  fieldName: string;
  fieldOperation: "MATCH" | "EQUAL" | "DSC" | "ASC";
  fieldValue: string;
  nextConditionOperator: "OR" | "AND";
}

interface Props {
  searchBoxList: SearchBoxItem[];
  filterBoxList: SearchBoxItem[];
  filterComponent: ReactNode;
  url: string;
  onCheck?: any;
  onDelete?: any;
  CartComponent?: any;
  refreshData?: () => void;
  refreshGrid?: boolean;
  disableFilter: boolean | undefined;
  textTotal?: any;
}

let totalData: any = null;
async function getdatas(
  { pageParam = 0 }: { pageParam: number },
  searchFilterBoxList: any,
  url: string
) {
  console.log(searchFilterBoxList);
  // if (session) {
  const params = {
    searchFilterBoxList: [{ restrictionList: [] }],
    sortList: [
      {
        fieldName: "id", // ^ name
        type: "DSC",
      },
    ],
    page: pageParam,
    rows: 10,
  };

  const res = await clientFetch(
    "GET",
    `${url}${"ALL"}/${"PUBLIC"}?searchFilterModel=`,
    params
  );

  if (!res) {
    throw new Error("خطا در ارتباط با سرور");
  }

  totalData = res.data.totalElements;

  return res.data.content;
  // } else return [];
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
  textTotal = ["", "عدد"],
}) => {
  console.log("refreshGrid Filter List", refreshGrid, filterBoxList);
  const { ref, inView } = useInView();
  const searchParams = useSearchParams();
  // const { data: session, status: sessionStatus } = useSession();
  const query = searchParams.get("query")?.toString() || "";
  const [queryState, setQueryState] = useState(query);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    if (!disableFilter) {
      setOpen(true);
    }
  };
  const handleClose = () => setOpen(false);
  const deleteItem = (filterBoxList: any) => {
    const arrayTemp: any = [];
    filterBoxList.forEach((item: any) => {
      if (item.fieldValue != null) arrayTemp.push(item);
    });
    return arrayTemp;
  };
  const deleteEmpty = (searchBoxList: any) => {
    const arrayTemp: any = [];
    if (query != "") return searchBoxList;
    return arrayTemp;
  };
  const searchFilterBoxList = [
    {
      restrictionList: deleteItem(filterBoxList),
    },
    {
      restrictionList: deleteEmpty(searchBoxList),
    },
  ];
  const {
    data: datas,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["datas", queryState],
    queryFn: ({ pageParam }) =>
      getdatas({ pageParam }, searchFilterBoxList, url),
    // enabled: sessionStatus === "authenticated",
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length : undefined;
    },
  });

  const handleRefreshGrid = () => {
    if (open) {
      setOpen(false);
    }
    refetch();
  };

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  useEffect(() => {
    searchBoxList.forEach((item) => (item.fieldValue = query));
    setQueryState(query);
  }, [query]);

  useEffect(() => {
    handleRefreshGrid();
  }, [refreshGrid]);

  if (isFetching && !isFetchingNextPage) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  // ^ Later
  // if (sessionStatus === "unauthenticated") {
  //   return <div>لطفا لاگین کنید</div>;
  // }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Grid2 width="100%" display="flex">
      <Grid2
        width="100%"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
        container
        sx={{
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "flex-end",
          p: 2,
          maxWidth: "100vw",
        }}
      >
        <>
          <Grid2
            container
            sx={{ width: "100%", justifyContent: "center", mx: "auto" }}
          >
            {totalData && totalData != 0 ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                }}
              >
                <Grid2
                  id="testthis"
                  display="flex"
                  sx={{
                    width: "100%",
                    maxWidth: "480px",
                    justifyContent: "space-between",
                    gap: 2,
                    bgcolor: "#ECFAFF",
                    borderRadius: "16px",
                    paddingX: "10px",
                    paddingY: "16px",
                  }}
                >
                  <Box display="flex" justifyItems="center" gap="10px">
                    <Image
                      src={TotalGrid}
                      width={20}
                      height={20}
                      alt="filter"
                    />
                    <Typography color="#393939" fontSize="14px">
                      تعداد کل فرم‌ها {textTotal[0]}:
                    </Typography>
                  </Box>
                  <p className="flex items-center text-[14px] text-[#393939] font-bold">
                    {totalData} {textTotal[1]}
                  </p>
                </Grid2>
                <div className="w-[50px] h-full">
                  <CreateFormBtn />
                </div>
              </Box>
            ) : null}

            <Grid2
              id="testthis"
              display="flex"
              sx={{
                width: "100%",
                maxWidth: "550px",
                justifyContent: "center",
                mt: 1,
                gap: 2,
              }}
            >
              <Grid2
                size={{ xs: 12, sm: 12, md: 8, lg: 10 }}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <SearchInput />
                {!disableFilter && (
                  <Grid2
                    sx={{ ml: 2, display: { xs: "flex", lg: "none" } }}
                    onClick={handleOpen}
                  >
                    <Image
                      src="./images/home-page/FilterAA.svg"
                      width={51}
                      height={51}
                      alt="Add"
                      style={{
                        cursor: "pointer",
                        marginLeft: "10px",
                        border: "1px solid #C9C9C9",
                        margin: "5px",
                        padding: "7px",
                        borderRadius: "15px",
                      }}
                    />
                  </Grid2>
                )}
              </Grid2>
            </Grid2>

            <Grid2
              container
              size={{ xs: 12, sm: 12, xl: 8, md: 8, lg: 8 }}
              sx={{
                width: "100%",
                mx: "auto",
                mt: 1,
                mb: 5,
                flexDirection: "column",
                gap: 2,
              }}
            >
              {datas?.pages ? (
                datas?.pages[0]?.length === 0 ? (
                  <Typography>موردی یافت نشد</Typography>
                ) : (
                  datas.pages.map((page, pageIndex) =>
                    page.map((data: any, index: number) => {
                      const key = `${pageIndex}-${index}`;
                      return (
                        <Grid2 sx={{ width: 1 }} key={key}>
                          <CartComponent
                            onCheck={(id: any, checked: any) =>
                              onCheck(id, checked)
                            }
                            data={data}
                            refreshGrid={handleRefreshGrid}
                          />
                          {index === 8 && (
                            <>
                              <Typography
                                component="h1"
                                ref={ref}
                                sx={{ height: 0 }}
                              />{" "}
                              <Box sx={{ width: "100%" }}>
                                {isFetchingNextPage ? <LinearProgress /> : null}
                              </Box>
                            </>
                          )}
                        </Grid2>
                      );
                    })
                  )
                )
              ) : (
                <Grid2></Grid2>
              )}
            </Grid2>
          </Grid2>
        </>
        <BottomSheet open={open} onClose={handleClose}>
          <Grid2>{filterComponent}</Grid2>
        </BottomSheet>
      </Grid2>
      {filterComponent && (
        <Grid2
          width="100%"
          display={{
            xs: "none",
            md: "none",
            sm: "none",
            lg: "flex",
            xl: "flex",
          }}
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="center"
          sx={{
            backgroundColor: "#F7F7FF",
            borderRadius: "16px",
            gap: 1,
            m: 1,
            maxWidth: "300px",
          }}
        >
          <Grid2
            sx={{
              width: "100%",
              minWidth: "200px",
              maxWidth: "300px",
            }}
          >
            <Box mt={2} mb={5} display="flex">
              <Image
                src={FilterIcon}
                width={30}
                height={30}
                alt="filter"
                style={{ marginLeft: "10px" }}
              />
              <Typography
                sx={{
                  width: "100%",
                  minWidth: "200px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                فیلتر{" "}
              </Typography>
            </Box>
            {filterComponent}
          </Grid2>
        </Grid2>
      )}
    </Grid2>
  );
};

export default ListGrid;
