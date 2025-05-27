"use client";
import ClientView from "./ClientView";
import { useGetList } from "./_hooks/useGetList";

export default function CalculatorPage() {
  const { data, isPending, error } = useGetList();
  console.log('data error :>> ', error);
  return <ClientView calculators={data} isPending={isPending} error={error} />;
}
