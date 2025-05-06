"use client";
import {useListFetcher} from "@/hooks/useListFetcher";
import ClientView from "./ClientView";

export default function CalculatorPage({params}: { params: { id: string } }) {
  const {data: calculators, loading} = useListFetcher({path: "calculation", id: params.id});
  return <ClientView calculators={calculators}/>;
}
