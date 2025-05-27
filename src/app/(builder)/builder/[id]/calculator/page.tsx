"use client";
import ClientView from "./ClientView";
// _hooks
import { useGetList } from "./_hooks";

export default function CalculatorPage() {
  const { data, isPending, error, refetch } = useGetList()
  return <ClientView calculators={data} isPending={isPending} error={error} refetch={refetch}/>
}
