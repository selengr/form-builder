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

export default function FormBuilderPage() {
  const [refreshGrid, setRefreshGrid] = useState(false);
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
          <div>
            <div>
              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">
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
            <div>
              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">
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
            <div className="flex gap-2 items-center justify-between">
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  setRefreshGrid((prev) => !prev);
                }}
              >
                اعمال فیلتر
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
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
