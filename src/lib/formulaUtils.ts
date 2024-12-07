import { Element } from '../types/formulaEditor';

export function htmlToFormula(elements: Element[], selectFieldRef: React.MutableRefObject<{ [key: string]: string }>, selectAvgRef: React.MutableRefObject<{ [key: string]: string }>): string {
  let formula = '';

  const elementHandlers = {
    NUMBER: (content: string) => {
      return "{#v_" + content + "}";
    },
    OPERATOR: (content: string) => content,
    PARENTHESIS: (content: string) => content,
    AVG_PARENTHESIS: (content: string) => {
      return content === "(" ? `${content}{` : `}${content}`;
    },
    NEW_FIELD: (content: string, id: string) => {
      return `${selectFieldRef.current[id]}`;
    },
    NEW_FnFx: (content: string, id: string) => {
      return selectAvgRef.current[id] || '';
    }
  };

  for (const element of elements) {
    if (!element) continue;

    const { type, content, id } = element;
    const handler = elementHandlers[type as keyof typeof elementHandlers];

    if (handler) {
      formula += handler(content, id || '');
    }
  }

  console.clear();
  console.log("html-to-formula ===>", formula);
  return formula;
}

