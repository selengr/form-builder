import {Suspense} from "react";
import ListGridWrapper from "@/templates/my-assessment/ListGridWrapper";

export default function MyAssessmentPage() {
  return (
    <Suspense>
      <ListGridWrapper />
    </Suspense>
  );
}
