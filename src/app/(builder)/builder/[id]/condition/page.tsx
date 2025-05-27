"use client";
import ClientView from "./ClientView";
// _hooks
import { useGetList } from "./_hooks";

export default function ConditionPage() {
  const { data, isPending, error } = useGetList()
  return <ClientView conditions={data} isPending={isPending} error={error}/>
}
