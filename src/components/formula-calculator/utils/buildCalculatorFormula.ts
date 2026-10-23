import { replaceNestedParentheses } from './parenthesesReplacer';

export const buildCalculatorFormula = (rawFormula: string) => {
  let formula = '';
  rawFormula.split('#avg').forEach((item) => {
    if (item.length === 0) return;
    if (item.includes('MultiSelect') || item.includes('SpectralDouble')) {
      formula += `#avg${item}`;
    } else if (item.includes('Number')) {
      formula += `#avg${item.replaceAll('}{', '},{')}`;
    } else {
      formula += item;
    }
  });
  return replaceNestedParentheses(formula);
};
