'use client';

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function GroupDialogTrigger({setShowCreateGroupDialog,}: {
  setShowCreateGroupDialog: (value: boolean) => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const isNewGroupQuery = searchParams.get('new');
    if (pathname === '/groups' && isNewGroupQuery !== null) {
      setShowCreateGroupDialog(true);
    } else {
      setShowCreateGroupDialog(false);
    }
  }, [pathname, searchParams]);

  return null;
}