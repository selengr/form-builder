import { Element } from '../types';
import { insertMissingOperators } from './insertMissingOperators';

export function htmlToFormula(elements: Element[], selectFieldRef: React.MutableRefObject<{ [key: string]: string }>, selectAvgRef: React.MutableRefObject<{ [key: string]: string }>): string {
  let formula = '';

  const elementHandlers = {
    NUMBER: (content: string) => {
      return '{#v_' + content + '}';
    },
    OPERATOR: (content: string) => content,
    PARENTHESIS: (content: string) => content,
    AVG_PARENTHESIS: (content: string) => {
      return content === '(' ? `${content}{` : `}${content}`;
    },
    NEW_FIELD: (content: string, id: string) => {
      return `${selectFieldRef.current[id]}`;
    },
    NEW_FnFx: (content: string, id: string) => {
      return selectAvgRef.current[id] || '';
    },
  };

  const isAvgOperand = (type?: string) => type === 'NEW_FIELD' || type === 'NUMBER';
  let avgDepth = 0;
  let previousType: string | undefined;

  for (const element of elements) {
    if (!element) continue;

    const { type, content, id } = element;
    const handler = elementHandlers[type as keyof typeof elementHandlers];

    if (avgDepth > 0 && isAvgOperand(type) && isAvgOperand(previousType)) {
      formula += ',';
    }

    if (handler) {
      formula += handler(content, id || '');
    }

    if (type === 'AVG_PARENTHESIS') {
      avgDepth += content === '(' ? 1 : -1;
    }
    previousType = type;
  }

  return insertMissingOperators(formula);
}