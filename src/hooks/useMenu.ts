import { useEffect, useState } from 'react';
// actions
import { fetchMenuServer } from '../../actions/menu';
import { IMenuResponseData } from '@/components/MiddleSidebar/type';
import { AxiosApi } from '@/services/axios/AxiosApi';

let cachedMenu: IMenuResponseData | null = null;

const useMenu = (userInfo: any): { menu: IMenuResponseData | null; loading: boolean } => {
  const [menu, setMenu] = useState<IMenuResponseData | null>(cachedMenu);
  const [loading, setLoading] = useState<boolean>(!cachedMenu);

  useEffect(() => {
    const loadMenu = async () => {
      if (userInfo && !cachedMenu) {
        setLoading(true);
        try {
            // const { data } = await AxiosApi.get('/authorization-psya/front-panel/non-org-user-role/find-user-loggedin-info', { baseURL: process.env.NEXT_PUBLIC_BASE_URL_PSYA });
          const data = await fetchMenuServer();
          cachedMenu = data;
          setMenu(data);
        } catch (err) {
          console.error('Fetch error:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    loadMenu();
  }, [userInfo]);

  return { menu, loading };
};

export default useMenu;
