"use client";
import { useEffect, useState } from "react";
import { fetchUserInfo } from "@/lib/auth";

export function useUserInfo() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { userInfo, isAuthenticated, error } = await fetchUserInfo();
      if (isAuthenticated) setUserInfo(userInfo);
      if (error) setError(error);
      setLoading(false);
    };

    loadUser();
  }, []);

  return { userInfo, loading, error };
}
