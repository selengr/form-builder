import { Suspense } from 'react';
import CalculatorCompare from './CalculatorCompare';

export default function CalculatorCompareTestPage() {
  return (
    <Suspense>
      <CalculatorCompare />
    </Suspense>
  );
}
