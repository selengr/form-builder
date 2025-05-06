"use client";
import {useListFetcher} from "@/hooks/useListFetcher";
import ClientView from "./ClientView";

export default function ConditionPage({params}: { params: { id: string } }) {
  const {data: conditions, loading} = useListFetcher({path: "condition", id: params.id});
  return <ClientView conditions={conditions}/>;
}
