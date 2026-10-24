import { Element } from '../types';

const ELEMENT_TYPES: Element['type'][] = ['NEW_FIELD', 'NUMBER', 'OPERATOR', 'PARENTHESIS', 'NEW_FnFx', 'AVG_PARENTHESIS'];

export const parseFrontFormulaData = (frontFormulaData?: string | null): Element[] => {
  if (!frontFormulaData) return [];

  try {
    const parsed = JSON.parse(frontFormulaData);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is Element =>
        Boolean(item) && ELEMENT_TYPES.includes(item.type) && typeof item.content === 'string',
    );
  } catch {
    return [];
  }
};

export const restoreCalculatorRefs = (elements: Element[]) => {
  const fieldRefs: Record<string, string> = {};
  const avgRefs: Record<string, string> = {};
  let lastMainIndex = -2;

  elements.forEach((element) => {
    if (element.type === 'NEW_FIELD' && element.id) {
      fieldRefs[element.id] = element.id;
    }
    if (element.type === 'NEW_FnFx' && element.id) {
      avgRefs[element.id] = '#avgNumberListMulti';
    }
    if (typeof element.mainIndex === 'number') {
      lastMainIndex = Math.max(lastMainIndex, element.mainIndex);
    }
  });

  return { fieldRefs, avgRefs, lastMainIndex };
};
