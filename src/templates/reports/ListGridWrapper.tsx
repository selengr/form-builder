"use client";

import { useState } from "react";
import ListCard from "./ListCard";
import ListGrid from "@/components/ListGrid/ListGrid";

export default function ListGridWrapper() {
  const [refreshGrid, setRefreshGrid] = useState(false);
  // const searchParams = useSearchParams();
  // const pathname = usePathname();
  // const { push } = useRouter();
  const formType={type: "ALL", status: "ALL",}
  const filterBoxList: any = [];
  const searchBoxList: any = [
    {
      fieldName: "formSetting.statusEnum",
      fieldOperation: "NOT_EQUAL",
      fieldValue: "CREATE",
      nextConditionOperator: "AND",
    },
  ];
  // const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormType((prev: any) => {
  //     return { ...prev, type: (event.target as HTMLInputElement).value };
  //   });
  // };

  // const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormType((prev: any) => {
  //     return { ...prev, status: (event.target as HTMLInputElement).value };
  //   });
  // };

  return (
    <ListGrid
      title="گزارش‌ها"
      searchBoxList={searchBoxList}
      filterBoxList={filterBoxList}
      url="/form/main-list"
      filterComponent={null}
      CartComponent={(item: any) => <ListCard setRefreshGrid={setRefreshGrid} {...item} />}
      disableFilter
      refreshGrid={refreshGrid}
      searchQueryFilter={formType}
    />
  );
}
