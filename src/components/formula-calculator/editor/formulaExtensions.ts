import { Node, ReactNodeViewRenderer, type JSONContent } from '@tiptap/react';
import { Element } from '../types';
import FormulaTokenView from './FormulaTokenView';

const FormulaDocument = Node.create({
  name: 'doc',
  topNode: true,
  content: 'paragraph',
});

const FormulaLine = Node.create({
  name: 'paragraph',
  group: 'block',
  content: 'inline*',
  parseHTML: () => [{ tag: 'p' }],
  renderHTML: () => ['p', 0],
});

const FormulaText = Node.create({
  name: 'text',
  group: 'inline',
});

export const FormulaToken = Node.create({
  name: 'formulaToken',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: false,
  draggable: false,

  addAttributes() {
    return {
      element: { default: null, rendered: false },
    };
  },

  parseHTML: () => [],
  renderHTML: () => ['span'],

  addNodeView() {
    return ReactNodeViewRenderer(FormulaTokenView, { as: 'span' });
  },
});

export const formulaExtensions = [FormulaDocument, FormulaLine, FormulaText, FormulaToken];

export const elementsToDocument = (elements: Element[]): JSONContent => ({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: elements.map((element) => ({ type: 'formulaToken', attrs: { element } })),
    },
  ],
});
