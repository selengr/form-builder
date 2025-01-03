

import AxiosApi from '@/services/axios/AxiosApi';
import CalculatorList from '@/templates/calculator/CalculatorList';
import { AxiosResponse } from 'axios';
import dynamic from 'next/dynamic'
 

const AdvancedFormulaEditor = dynamic(() => import('@/components/calculator/AdvancedFormulaEditor'), { ssr: false })
 
export default async function Calculator({params}:{params : {id:string} }) {
  const customComboFilterModel = {
    type: "COMBO",
    entity: "QUESTIONS",
    mode: "QUESTIONS_IN_FORM_BUILDER__ALL",
    input: "",
    page: 0,
    rows: 10000,
    extMap: {
        formId: params.id,
        typeRequest: "QAC_BY_FILTER"
    }
};
//  const res = await AxiosApi.get(`/question/q-and-c-custom-combo?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}`);
 const url = "/calculation/main-list/81?searchFilterModel=%7B%22searchFilterBoxList%22%3A%5B%7B%22restrictionList%22%3A%5B%5D%7D%5D%2C%22sortList%22%3A%5B%7B%22fieldName%22%3A%22id%22%2C%22type%22%3A%22DSC%22%7D%5D%2C%22page%22%3A0%2C%22rows%22%3A1000%7D";

 const calculators : AxiosResponse<any> = await AxiosApi.get(url);
 const {data : {content}} = calculators

 
  return (
    <div className="container mx-auto py-8 flex justify-center items-start h-screen bg-white">

        {/* <AdvancedFormulaEditor questionList={res.data} /> */}
        <CalculatorList calculators={content}/>
    </div>
  )
}