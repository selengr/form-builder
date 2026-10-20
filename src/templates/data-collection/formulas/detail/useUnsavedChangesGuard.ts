import { useCallback, useEffect, useRef, useState } from 'react';

type LeaveAction = () => void;

export function useUnsavedChangesGuard(isDirty: boolean, navigate: (href: string) => void) {
  const [pendingLeave, setPendingLeave] = useState<LeaveAction | null>(null);
  const allowLeaveRef = useRef(false);
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  const requestLeave = useCallback(
    (leave: LeaveAction) => {
      if (!isDirty || allowLeaveRef.current) {
        leave();
        return;
      }
      setPendingLeave(() => leave);
    },
    [isDirty],
  );

  const leaveWithoutGuard = useCallback((leave: LeaveAction) => {
    allowLeaveRef.current = true;
    setPendingLeave(null);
    leave();
  }, []);

  const cancelLeave = useCallback(() => setPendingLeave(null), []);

  useEffect(() => {
    if (!isDirty) return;

    const handleLinkClick = (event: MouseEvent) => {
      if (allowLeaveRef.current) return;
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      event.preventDefault();
      event.stopPropagation();
      setPendingLeave(() => () => navigateRef.current(`${url.pathname}${url.search}${url.hash}`));
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (allowLeaveRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    };

    document.addEventListener('click', handleLinkClick, true);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('click', handleLinkClick, true);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  return {
    isLeaveDialogOpen: pendingLeave !== null,
    pendingLeave,
    requestLeave,
    leaveWithoutGuard,
    cancelLeave,
  };
}
