import AxiosApi from "@/services/axios/AxiosApi";
import ClientView from "./ClientView";

export default async function Calculator({
                                           params,
                                         }: {
  params: { id: string };
}) {
  const url = `/calculation/main-list/${params.id}?searchFilterModel=%7B%22searchFilterBoxList%22%3A%5B%7B%22restrictionList%22%3A%5B%5D%7D%5D%2C%22sortList%22%3A%5B%7B%22fieldName%22%3A%22id%22%2C%22type%22%3A%22DSC%22%7D%5D%2C%22page%22%3A0%2C%22rows%22%3A1000%7D`;
  const res = await AxiosApi.get(url);
  const {
    data: { content },
  } = res;

  return null ;
  // <ClientView calculators={content} />

}
