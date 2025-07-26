"use client";
// React & Libs
import Image from "next/image";
import React, {useState} from "react";
import {useParams, usePathname, useRouter, useSearchParams} from "next/navigation";
import {Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup,} from "@mui/material";
// componenst
import ListCard from "./ListCard";
import ListGrid from "./ListGrid";
// icons
import FilterIcon from "@/../public/images/home-page/filter-icon.svg";

export default function ListGridWrapper() {
  const [refreshGrid, setRefreshGrid] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const {push} = useRouter();
  const {id} = useParams();

  const [formType, setFormType] = useState<any>({
    responseForDestroyerReport: "ALL",
    typeOfReport: "ALL",
  });
  const filterBoxList: any = [];
  const searchBoxList: any = [
    {
      fieldName: "formSetting.name",
      fieldOperation: "MATCH",
      fieldValue: "",
      nextConditionOperator: "OR",
    },
  ];

  const FilterSidebar = () => {
    return (
      <div className="flex h-[calc(100vh-50px)] w-full flex-col">
        {/* هدر فیلتر */}
        <div className="w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4">
          <div className="flex items-center w-full justify-center gap-2">
            <Image src={FilterIcon} width={30} height={30} alt="filter" draggable={false} />
            <p className="text-[16px] text-center font-bold text-[#161616]">
              فیلتر
            </p>
          </div>
        </div>

        {/* محتوای فیلترها */}
        <div className="flex-1 overflow-y-auto pb-4">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-4">
              {/* بخش نوع فیلتر */}
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
                    value={formType.responseForDestroyerReport}
                    onChange={handleResponseForeDestroyerChange}
                  >
                    <FormControlLabel
                      value="ALL"
                      control={<Radio/>}
                      label="همه"
                    />
                    <FormControlLabel
                      value="INAPPROPRIATE_CONTENT"
                      control={<Radio/>}
                      label="محتوا نامناسب"
                    />
                    <FormControlLabel
                      value="PRIVACY_VIOLATION"
                      control={<Radio/>}
                      label="نقض حریم خصوصی"
                    />
                    <FormControlLabel
                      value="INTELLECTUAL_PROPERTY_INFRINGMENT"
                      control={<Radio/>}
                      label="مالکیت معنوی"
                    />
                    <FormControlLabel
                      value="OTHER"
                      control={<Radio/>}
                      label="سایر"
                    />
                  </RadioGroup>
                </FormControl>
              </div>

              {/* بخش دسترسی فیلتر */}
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
                      مورد گزارش
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={formType.typeOfReport}
                    onChange={handleTypeOfReportChange}
                  >
                    <FormControlLabel
                      value="ALL"
                      control={<Radio/>}
                      label="همه"
                    />
                    <FormControlLabel
                      value="FORM"
                      control={<Radio/>}
                      label="فرم"
                    />
                    <FormControlLabel
                      value="REPORT"
                      control={<Radio/>}
                      label="گزارش نتایج"
                    />
                  </RadioGroup>
                </FormControl>
              </div>

              {/* بخش دسترسی فیلتر */}
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
                      بر اساس زمان
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={formType.typeOfReport}
                    onChange={handleTypeOfReportChange}
                  >
                    <FormControlLabel
                      value="ALL"
                      control={<Radio/>}
                      label="جدیدترین"
                    />
                    <FormControlLabel
                      value="PUBLIC"
                      control={<Radio/>}
                      label="قدیمیترین"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          </div>
        </div>

        {/* دکمه‌های ثابت در پایین */}
        <div className="sticky bottom-0 bg-white pt-4 pb-2">
          <div className="flex gap-4 items-center justify-between w-full">
            <Button
              sx={{
                height: "52px",
                bgcolor: "#1758BA",
                boxShadow: "none",
                borderRadius: "8px",
                color: "white",
                fontSize: "14px",
                fontWeight: 700,
                "&.MuiButtonBase-root:hover": {
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
                "&.MuiButtonBase-root:hover": {
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
                setFormType({responseForDestroyerReport: "ALL", typeOfReport: "ALL"});
                setRefreshGrid((prev) => !prev);
              }}
            >
              حذف فیلتر
            </Button>
          </div>
        </div>
      </div>
    )
  }
  const handleResponseForeDestroyerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormType((prev: any) => {
      return {...prev, responseForDestroyerReport: (event.target as HTMLInputElement).value};
    });
  };

  const handleTypeOfReportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormType((prev: any) => {
      return {...prev, typeOfReport: (event.target as HTMLInputElement).value};
    });
  };


  return (
    <ListGrid
      searchBoxList={searchBoxList}
      filterBoxList={filterBoxList}
      url={`/admin/destroy-form/${id}`}
      filterComponent={<FilterSidebar/>}
      CartComponent={(item: any) => (
        <ListCard data={item.data}/>
      )}
      disableFilter={false}
      refreshGrid={refreshGrid}
      searchQueryFilter={formType}
    />
  );
}
