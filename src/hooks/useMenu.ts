import { useEffect, useState } from "react";
import AxiosApi from "@/services/axios/AxiosApi";
import { IMenuResponseData } from "@/components/MiddleSidebar/type";

const useMenu = (userInfo:any)  : { menu: IMenuResponseData | null; loading: boolean } => {
    const [menu, setMenu] = useState<IMenuResponseData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadMenu = async () => {
      if (userInfo) {
        setLoading(true);
        try {
          const { data } = await AxiosApi.get(
            "/authorization-psya/front-panel/non-org-user-role/find-user-loggedin-info",
            { baseURL: process.env.NEXT_PUBLIC_BASE_URL_PSYA }
          );
          setMenu(data);
        } catch (err) {
          console.error("Fetch error:", err);
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
