'use client';

import type React from 'react';
import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react';
import FormulaElement from '../FormulaElement';
import { Element } from '../types';
import { useFormulaEditorContext } from './FormulaEditorContext';

const INTERACTIVE_TYPES: Element['type'][] = ['NEW_FIELD', 'NEW_FnFx'];

export default function FormulaTokenView({ node, getPos }: ReactNodeViewProps) {
  const { fields, onFieldSelect, onFieldClick, onFnSelect, onFnClick, onTokenPress } = useFormulaEditorContext();
  const element = node.attrs.element as Element;

  const handleMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    if (INTERACTIVE_TYPES.includes(element.type)) return;
    const position = typeof getPos === 'function' ? getPos() : undefined;
    if (typeof position !== 'number') return;

    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const isRightHalf = event.clientX > rect.left + rect.width / 2;
    const isRtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const side = isRightHalf === isRtl ? 'before' : 'after';
    onTokenPress(position - 1, side);
  };

  return (
    <NodeViewWrapper as="span" style={{ display: 'inline-block' }} onMouseDown={handleMouseDown}>
      <FormulaElement
        element={element}
        index={0}
        questionList={fields}
        onFieldSelect={onFieldSelect}
        onFieldClick={onFieldClick}
        onFnSelect={onFnSelect}
        onFnClick={onFnClick}
      />
    </NodeViewWrapper>
  );
}
