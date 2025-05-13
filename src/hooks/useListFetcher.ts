"use client";

import {useEffect, useState} from "react";
import AxiosApi from "@/services/axios/AxiosApi";

interface FetchOptions {
    path: string;
    id: string;
}

interface ApiResponse<T> {
    content: T[];

    [key: string]: any;
}

export function useListFetcher<T>({path, id}: FetchOptions) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const res = await AxiosApi.get<ApiResponse<T>>(generateUrl(path, id));
                if (isMounted) {
                    setData(res.data.content);
                }
            } catch (err: unknown) {
                handleError(err, path);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [path, id]);

    return {data, loading};
}

function generateUrl(path: string, id: string): string {
    const filterModel = {
        searchFilterBoxList: [{restrictionList: []}], sortList: [{fieldName: "id", type: "DSC"}], page: 0, rows: 1000,
    };

    return `/${path}/main-list/${id}?searchFilterModel=${encodeURIComponent(JSON.stringify(filterModel))}`;
}

function handleError(err: unknown, context: string) {
    if (err instanceof Error) {
        console.error(`[${context.toUpperCase()}] Error:`, err.message);
    } else {
        console.error(`[${context.toUpperCase()}] Unknown error:`, err);
    }
}
