import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type LeaveAction = () => void;

export function useUnsavedChangesGuard(isDirty: boolean) {
  const router = useRouter();
  const [pendingLeave, setPendingLeave] = useState<LeaveAction | null>(null);
  const allowLeaveRef = useRef(false);
  const guardEntryRef = useRef(false);
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;

  const navigate = useCallback(
    (href: string) => {
      if (guardEntryRef.current) {
        router.replace(href);
      } else {
        router.push(href);
      }
    },
    [router],
  );

  const goBack = useCallback(() => {
    if (guardEntryRef.current) {
      window.history.go(-2);
    } else {
      router.back();
    }
  }, [router]);

  const requestLeave = useCallback((leave: LeaveAction) => {
    if (!isDirtyRef.current || allowLeaveRef.current) {
      leave();
      return;
    }
    setPendingLeave(() => leave);
  }, []);

  const leaveWithoutGuard = useCallback((leave: LeaveAction) => {
    allowLeaveRef.current = true;
    setPendingLeave(null);
    leave();
  }, []);

  const cancelLeave = useCallback(() => setPendingLeave(null), []);

  useEffect(() => {
    if (!isDirty || guardEntryRef.current) return;
    window.history.pushState(window.history.state, '', window.location.href);
    guardEntryRef.current = true;
  }, [isDirty]);

  useEffect(() => {
    const handlePopState = () => {
      if (allowLeaveRef.current || !guardEntryRef.current) return;

      if (!isDirtyRef.current) {
        guardEntryRef.current = false;
        window.history.back();
        return;
      }

      window.history.pushState(window.history.state, '', window.location.href);
      setPendingLeave(() => () => window.history.go(-2));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!isDirty) return;

    const handleLinkClick = (event: MouseEvent) => {
      if (allowLeaveRef.current) return;
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      const url = new URL(anchor.href, window.location.href);
      const isSamePage =
        url.origin === window.location.origin &&
        url.pathname === window.location.pathname &&
        url.search === window.location.search;
      if (isSamePage) return;

      event.preventDefault();
      event.stopPropagation();

      if (url.origin === window.location.origin) {
        setPendingLeave(() => () => navigate(`${url.pathname}${url.search}${url.hash}`));
      } else {
        setPendingLeave(() => () => window.location.assign(url.href));
      }
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
  }, [isDirty, navigate]);

  return {
    isLeaveDialogOpen: pendingLeave !== null,
    pendingLeave,
    navigate,
    goBack,
    requestLeave,
    leaveWithoutGuard,
    cancelLeave,
  };
}
