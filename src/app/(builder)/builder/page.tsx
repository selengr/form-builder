import ListGridWrapper from "@/templates/builder/ListGridWrapper";
import {Suspense} from "react";

export default function FormBuilderPage() {
  return (
    <Suspense>
      <ListGridWrapper/>
    </Suspense>
  );
}
