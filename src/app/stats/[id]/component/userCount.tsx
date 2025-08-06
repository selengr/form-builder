'use client';

import { useEffect } from 'react';

interface Props {
  formId: number;
  userCount: number;
  setUserCount: (count: number) => void;
}

export function UserCount({ formId, userCount, setUserCount }: Props) {
  useEffect(() => {
    const raw = localStorage.getItem('selectedUsersByForm');
    if (raw) {
      const data = JSON.parse(raw);
      const users = data[formId] || [];
      setUserCount(users.length);
    } else {
      setUserCount(0);
    }
  }, [formId, setUserCount]);

  if (userCount === null) return null;

  return <span className='text-sm'>{userCount > 0 ? `${userCount} نفر در لیست` : 'کسی در لیست نیست'}</span>;
}

export default UserCount;
