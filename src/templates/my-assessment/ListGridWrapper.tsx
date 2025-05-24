"use client";

import { useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import ListGrid from "@/components/ListGrid/ListGrid";
import ListCard from "./ListCard";
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

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    push(`${pathname}?${params.toString()}`);
    setRefreshGrid(prev => !prev);
  };

  const resetFilters = () => {
    setFormType({ type: "ALL", status: "ALL" });
    applyFilters();
  };

  return (
    <ListGrid
      title="ارزیابی‌های من"
      url="/user/form/main-list/"
      // @ts-ignore
      searchBoxList={searchBoxList}
      filterBoxList={[]}
      searchQueryFilter={formType}
      refreshGrid={refreshGrid}
      disableFilter={false}
      CartComponent={(item) => <ListCard {...item} />}
      filterComponent={
        <FormFilter
          formType={formType}
          setFormType={setFormType}
          onApply={applyFilters}
          onReset={resetFilters}
        />
      }
    />
  );
}
