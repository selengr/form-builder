import { ICalculator } from '@/types/calculator';
import { IGetCondition } from '@/types/condition';

export type LogicItem =
  | { kind: 'calculator'; sortId: string; data: ICalculator }
  | { kind: 'condition'; sortId: string; data: IGetCondition };

export type LogicFormState =
  | { type: 'calculator'; mode: 'create' }
  | { type: 'calculator'; mode: 'edit'; id: number }
  | { type: 'condition'; mode: 'create' }
  | { type: 'condition'; mode: 'edit'; condition: IGetCondition }
  | null;

export function mergeLogicItems(
  calculators: ICalculator[] = [],
  conditions: IGetCondition[] = [],
): LogicItem[] {
  return [
    ...calculators.map((data) => ({
      kind: 'calculator' as const,
      sortId: `calculator-${data.id}`,
      data,
    })),
    ...conditions.map((data) => ({
      kind: 'condition' as const,
      sortId: `condition-${data.id}`,
      data,
    })),
  ];
}
