'use client';

import { useEffect, useMemo, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { Element } from '../types';
import styles from '../formulaCalculator.module.css';
import { elementsToDocument, formulaExtensions } from './formulaExtensions';
import { FormulaEditorContext, FormulaEditorContextValue } from './FormulaEditorContext';

const NAVIGATION_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Tab'];
const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export type FormulaKeyAction =
  | { kind: 'number'; value: string }
  | { kind: 'operator'; value: string }
  | { kind: 'parenthesis'; value: string }
  | { kind: 'delete' };

const toKeyAction = (key: string): FormulaKeyAction | null => {
  const persianIndex = PERSIAN_DIGITS.indexOf(key);
  const arabicIndex = ARABIC_DIGITS.indexOf(key);
  const digit = persianIndex >= 0 ? String(persianIndex) : arabicIndex >= 0 ? String(arabicIndex) : key;

  if (/^[0-9.]$/.test(digit)) return { kind: 'number', value: digit };
  if (['+', '-', '*', '/', '^'].includes(key)) return { kind: 'operator', value: key };
  if (key === '(' || key === ')') return { kind: 'parenthesis', value: key };
  if (key === 'Backspace' || key === 'Delete') return { kind: 'delete' };
  return null;
};

interface FormulaEditorProps extends Omit<FormulaEditorContextValue, 'onTokenPress'> {
  elements: Element[];
  cursorIndex: number;
  focusRequest: number;
  onCursorChange: (index: number) => void;
  onKeyActions: (actions: FormulaKeyAction[]) => void;
}

export default function FormulaEditor({
  elements,
  cursorIndex,
  focusRequest,
  onCursorChange,
  onKeyActions,
  ...contextHandlers
}: FormulaEditorProps) {
  const isSyncingRef = useRef(false);
  const syncedElementsRef = useRef<Element[] | null>(null);
  const handledFocusRequestRef = useRef(0);
  const onCursorChangeRef = useRef(onCursorChange);
  const onKeyActionsRef = useRef(onKeyActions);
  onCursorChangeRef.current = onCursorChange;
  onKeyActionsRef.current = onKeyActions;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: formulaExtensions,
    content: elementsToDocument(elements),
    editorProps: {
      attributes: {
        class: styles.formulaEditor,
        inputmode: 'none',
        spellcheck: 'false',
        autocorrect: 'off',
        autocapitalize: 'off',
      },
      handleKeyDown: (_view, event) => {
        if (NAVIGATION_KEYS.includes(event.key)) return false;
        if (event.key === 'Unidentified' || event.key === 'Process' || event.isComposing) return false;
        if (event.ctrlKey || event.metaKey || event.altKey) {
          return !['c', 'a'].includes(event.key.toLowerCase());
        }

        event.preventDefault();
        const action = toKeyAction(event.key);
        if (action) onKeyActionsRef.current([action]);
        return true;
      },
      handleTextInput: () => true,
      handlePaste: () => true,
      handleDrop: () => true,
      handleDOMEvents: {
        cut: (_view, event) => {
          event.preventDefault();
          return true;
        },
        beforeinput: (_view, event) => {
          const inputEvent = event as InputEvent;
          inputEvent.preventDefault();

          if (inputEvent.inputType.startsWith('delete')) {
            onKeyActionsRef.current([{ kind: 'delete' }]);
            return true;
          }

          const actions = Array.from(inputEvent.data ?? '')
            .map(toKeyAction)
            .filter((action): action is FormulaKeyAction => action !== null);
          if (actions.length) onKeyActionsRef.current(actions);
          return true;
        },
      },
    },
    onSelectionUpdate: ({ editor: currentEditor }) => {
      if (isSyncingRef.current) return;
      const index = currentEditor.state.selection.from - 1;
      onCursorChangeRef.current(Math.max(0, index));
    },
  });

  useEffect(() => {
    if (!editor) return;
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled || editor.isDestroyed) return;
      isSyncingRef.current = true;

      if (syncedElementsRef.current !== elements) {
        editor.commands.setContent(elementsToDocument(elements), { emitUpdate: false });
        syncedElementsRef.current = elements;
      }

      const shouldFocus = focusRequest > 0 && focusRequest !== handledFocusRequestRef.current;
      handledFocusRequestRef.current = focusRequest;
      if (shouldFocus) editor.view.focus();

      const position = Math.min(Math.max(cursorIndex, 0), elements.length) + 1;
      const { from, to } = editor.state.selection;
      if (from !== position || to !== position) {
        editor.commands.setTextSelection(position);
      }
      if (shouldFocus) editor.commands.scrollIntoView();

      isSyncingRef.current = false;
    });

    return () => {
      cancelled = true;
    };
  }, [editor, elements, cursorIndex, focusRequest]);

  const contextValue = useMemo<FormulaEditorContextValue>(
    () => ({
      ...contextHandlers,
      onTokenPress: (index, side) => {
        if (!editor || editor.isDestroyed) return;
        const target = side === 'before' ? index : index + 1;
        editor.chain().focus().setTextSelection(target + 1).run();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      editor,
      contextHandlers.fields,
      contextHandlers.onFieldSelect,
      contextHandlers.onFieldClick,
      contextHandlers.onFnSelect,
      contextHandlers.onFnClick,
    ],
  );

  return (
    <FormulaEditorContext.Provider value={contextValue}>
      <EditorContent editor={editor} className={styles.formulaEditorRoot} />
    </FormulaEditorContext.Provider>
  );
}
