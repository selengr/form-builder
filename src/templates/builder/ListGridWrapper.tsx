"use client";

import React, { useState, useCallback } from "react";
import ListGrid from "@/components/ListGrid/ListGrid";
import ListCard from "@/components/ListGrid/ListCard";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FormFilter from "./FormFilter";

export default function ListGridWrapper() {
  const [refreshGrid, setRefreshGrid] = useState(false);
  const [formType, setFormType] = useState({ type: "ALL", status: "ALL" });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  const searchBoxList = [
    {
      fieldName: "formSetting.name",
      fieldOperation: "MATCH",
      fieldValue: "",
      nextConditionOperator: "OR",
    },
  ];

  const handleTypeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormType((prev) => ({ ...prev, type: event.target.value }));
    },
    []
  );

  const handleStatusChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormType((prev) => ({ ...prev, status: event.target.value }));
    },
    []
  );

  const applyFilter = () => {
    const params = new URLSearchParams(searchParams);
    if (params.size) params.delete("query");
    push(`${pathname}?${params.toString()}`);
    setRefreshGrid((prev) => !prev);
  };

  const clearFilter = () => {
    const params = new URLSearchParams(searchParams);
    if (params.size) params.delete("query");
    push(`${pathname}?${params.toString()}`);
    setFormType({ type: "ALL", status: "ALL" });
    setRefreshGrid((prev) => !prev);
  };

  return (
    <ListGrid
      title="فرم‌های من"
      showCreateButton
      // @ts-ignore
      searchBoxList={searchBoxList}
      filterBoxList={[]}
      url="/form/main-list/"
      filterComponent={
        <FormFilter
          formType={formType}
          // @ts-ignore
          onTypeChange={handleTypeChange}
          onStatusChange={handleStatusChange}
          onApply={applyFilter}
          onClear={clearFilter}
        />
      }
      CartComponent={(item: any) => (
        <ListCard setRefreshGrid={setRefreshGrid} {...item} />
      )}
      disableFilter={false}
      refreshGrid={refreshGrid}
      searchQueryFilter={formType}
    />
  );
}
