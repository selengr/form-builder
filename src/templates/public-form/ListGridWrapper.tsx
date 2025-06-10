"use client";

import { useState } from "react";
import ListCard from "./ListCard";
import ListGrid from "@/components/ListGrid/ListGrid";

export default function ListGridWrapper() {
  const [formType] = useState<any>({
    type: "ALL",
    status: "ALL",
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

  return (
    <ListGrid
      searchBoxList={searchBoxList}
      filterBoxList={filterBoxList}
      url="/public-page/form/main-list"
      filterComponent={null}
      CartComponent={(item: any) => <ListCard {...item} />}
      disableFilter
      searchQueryFilter={formType}
      title="فرم‌های عمومی"
    />
  );
}
