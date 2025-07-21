import {Suspense} from "react";
import ListGridWrapper from "../component/ListGridWrapper";

export default function DisplayUserReportPage() {
  return (
    <Suspense>
      <ListGridWrapper/>
    </Suspense>
  );
}
