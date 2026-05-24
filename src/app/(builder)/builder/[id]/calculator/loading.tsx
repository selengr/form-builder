// app/calculator/[id]/loading.tsx

import { CalculatorSkeleton } from "@/templates/calculator";

export default function Loading() {
  return (
    <div style={{ padding: 16 }}>
      <p>در حال بارگذاری...</p>
       <CalculatorSkeleton />
    </div>
  );
}
