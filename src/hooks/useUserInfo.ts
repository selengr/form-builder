import { useEffect, useState } from 'react';
// actions
import { fetchUserInfoServer } from '../../actions/auth';
import { fetchUserInfo } from '@/lib/auth';

export function useUserInfo() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      setLoading(true);
      setError(null);
      const { userInfo, isAuthenticated, error } = await fetchUserInfoServer();
      if (isMounted) {
        if (isAuthenticated) {
          setUserInfo(userInfo);
        } else {
          setUserInfo(null);
        }
        if (error) {
          setError(error);
        }
        setLoading(false);
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return { userInfo, loading, error };
}
