/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Suspense, useState } from "react";
import ListGrid from "@/components/ListGrid/ListGrid";
import ListCard from "@/components/ListGrid/ListCard";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FilterIcon from "@/../public/images/home-page/filter-icon.svg";

export default function FormBuilderPage() {
  const [refreshGrid, setRefreshGrid] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const [formType, setFormType] = useState<any>({
    type: "ALL",
    status: "ALL",
  });
  const filterBoxList: any = [];
  const searchBoxList: any = [
    {
      fieldName: "name",
      fieldOperation: "MATCH",
      fieldValue: "",
      nextConditionOperator: "OR",
    },
  ];

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormType((prev: any) => {
      return { ...prev, type: (event.target as HTMLInputElement).value };
    });
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormType((prev: any) => {
      return { ...prev, status: (event.target as HTMLInputElement).value };
    });
  };

  return (
    <Suspense fallback="">
      <ListGrid
        searchBoxList={searchBoxList}
        filterBoxList={filterBoxList}
        url="/form/main-list/"
        filterComponent={
          <div className="flex h-full w-full flex-col items-center justify-between">
            <div className="w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4">
              <div className="flex items-center w-full justify-center gap-2">
                <Image src={FilterIcon} width={30} height={30} alt="filter" />
                <p className="text-[16px] text-center font-bold text-[#161616]">
                  فیلتر
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-4">
                <div className="w-full flex flex-col justify-center gap-4 rounded-[20px] bg-[#F7F7FF] px-4 pt-4 pb-3">
                  <FormControl
                    sx={{
                      "& .MuiTypography-root": {
                        fontSize: "14px",
                        color: "#393939",
                        fontWeight: 400,
                      },
                    }}
                  >
                    <FormLabel
                      sx={{
                        fontSize: "15px",
                        color: "#161616",
                        fontWeight: 700,
                        mb: "8px",
                        "&.Mui-focused": {
                          color: "#161616",
                        },
                      }}
                      id="demo-controlled-radio-buttons-group"
                    >
                      بر اساس نوع
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={formType.type}
                      onChange={handleTypeChange}
                    >
                      <FormControlLabel
                        value="ALL"
                        control={<Radio />}
                        label="همه"
                      />
                      <FormControlLabel
                        value="COMPETITION"
                        control={<Radio />}
                        label="مسابقه"
                      />
                      <FormControlLabel
                        value="QUESTION"
                        control={<Radio />}
                        label="پرسشنامه"
                      />
                      <FormControlLabel
                        value="SURVEY"
                        control={<Radio />}
                        label="نظرسنجی"
                      />
                      <FormControlLabel
                        value="TEST"
                        control={<Radio />}
                        label="آزمون"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
                <div className="w-full flex flex-col justify-center gap-4 rounded-[20px] bg-[#F7F7FF] px-4 pt-4 pb-3">
                  <FormControl
                    sx={{
                      "& .MuiTypography-root": {
                        fontSize: "14px",
                        color: "#393939",
                        fontWeight: 400,
                      },
                    }}
                  >
                    <FormLabel
                      sx={{
                        fontSize: "15px",
                        color: "#161616",
                        fontWeight: 700,
                        mb: "8px",
                        "&.Mui-focused": {
                          color: "#161616",
                        },
                      }}
                      id="demo-controlled-radio-buttons-group"
                    >
                      بر اساس دسترسی
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={formType.status}
                      onChange={handleStatusChange}
                    >
                      <FormControlLabel
                        value="ALL"
                        control={<Radio />}
                        label="همه"
                      />
                      <FormControlLabel
                        value="PUBLIC"
                        control={<Radio />}
                        label="عمومی"
                      />
                      <FormControlLabel
                        value="PRIVATE"
                        control={<Radio />}
                        label="خصوصی"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
            </div>
            <div className="flex gap-4 items-center justify-between w-full mt-8">
              <Button
                sx={{
                  height: "52px",
                  bgcolor: "#1758BA",
                  boxShadow: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 700,
                  "&.MuiButtonBase-root:hover, &.MuiButtonBase-root:active": {
                    bgcolor: "#1758BA",
                    boxShadow: "none",
                  },
                }}
                fullWidth
                variant="contained"
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  if (params.size) {
                    params.delete("query");
                  }
                  push(`${pathname}?${params.toString()}`);
                  setRefreshGrid((prev) => !prev);
                }}
              >
                اعمال فیلتر
              </Button>
              <Button
                sx={{
                  height: "52px",
                  bgcolor: "white",
                  border: "1px solid #1758BA",
                  boxShadow: "none",
                  borderRadius: "8px",
                  color: "#1758BA",
                  fontSize: "14px",
                  fontWeight: 700,
                  "&.MuiButtonBase-root:hover, &.MuiButtonBase-root:active": {
                    bgcolor: "transparent",
                    boxShadow: "none",
                  },
                }}
                fullWidth
                variant="outlined"
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  if (params.size) {
                    params.delete("query");
                  }
                  push(`${pathname}?${params.toString()}`);
                  setFormType({ type: "ALL", status: "ALL" });
                  setRefreshGrid((prev) => !prev);
                }}
              >
                حذف فیلتر
              </Button>
            </div>
          </div>
        }
        CartComponent={(item: any) => (
          <ListCard setRefreshGrid={setRefreshGrid} {...item} />
        )}
        disableFilter={false}
        refreshGrid={refreshGrid}
        searchQueryFilter={formType}
      />
    </Suspense>
  );
}
