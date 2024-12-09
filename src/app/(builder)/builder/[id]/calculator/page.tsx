
import AxiosApi from '@/services/axios/AxiosApi';
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
 const res = await AxiosApi.get(`/question/q-and-c-custom-combo?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}`);

  
  
  return (
    <div  className="flex min-h-screen flex-col items-center justify-between p-24">
        <AdvancedFormulaEditor questionList={res.data} />
    </div>
  )
}