'use client';
import { CSSProperties, RefObject, useLayoutEffect, useState } from 'react';

const GAP = 2;
const EDGE_SPACE = 8;
const MIN_LIST_HEIGHT = 96;

export function useDropdownPlacement(
  anchorRef: RefObject<HTMLElement | null>,
  listRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  maxHeight: number,
  minHeight: number,
): CSSProperties | undefined {
  const [style, setStyle] = useState<CSSProperties>();

  useLayoutEffect(() => {
    if (!isOpen) {
      setStyle(undefined);
      return;
    }

    const anchor = anchorRef.current;
    const box = anchor?.closest('[data-formula-scroll]');
    if (!anchor || !box) return;

    const anchorRect = anchor.getBoundingClientRect();
    const boxRect = box.getBoundingClientRect();
    const listHeight = Math.min(Math.max(listRef.current?.scrollHeight ?? maxHeight, minHeight), maxHeight);
    const below = boxRect.bottom - anchorRect.bottom - GAP - EDGE_SPACE;
    const above = anchorRect.top - boxRect.top - GAP - EDGE_SPACE;
    const openUp = below < listHeight && above > below;
    const height = Math.max(Math.min(maxHeight, openUp ? above : below), MIN_LIST_HEIGHT);

    setStyle({
      maxHeight: height,
      minHeight: Math.min(minHeight, height),
      ...(openUp ? { top: 'auto', bottom: '100%', marginTop: 0, marginBottom: GAP } : {}),
    });
  }, [isOpen, anchorRef, listRef, maxHeight, minHeight]);

  return style;
}
