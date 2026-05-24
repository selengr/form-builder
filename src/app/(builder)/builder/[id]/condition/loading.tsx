// app/calculator/[id]/loading.tsx

import { ConditionSkeleton } from "@/templates/condition";

export default function Loading() {
  return (
    <div style={{ padding: 16 }}>
      <h1>در حال بارگذاری...</h1>
       <ConditionSkeleton />
    </div>
  );
}
