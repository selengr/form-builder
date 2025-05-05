import AxiosApi from "@/services/axios/AxiosApi";
 import ClientView from "./ClientView";

export default async function Calculator({params}: {
  params: { id: string };
}) {
  return  <ClientView calculators={[]} />;

}
