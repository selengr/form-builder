
import AxiosApi from '@/services/axios/AxiosApi';
import dynamic from 'next/dynamic'
 

const AdvancedFormulaEditor = dynamic(() => import('@/components/calculator/AdvancedFormulaEditor'), { ssr: false })
 
export default async function Calculator({params}:{params : {id:string} }) {
  const res = await AxiosApi.get(`/question/q-and-c-custom-combo?customComboFilterModel=%7B%22type%22%3A%22COMBO%22%2C%22entity%22%3A%22QUESTIONS%22%2C%22mode%22%3A%22QUESTIONS_IN_FORM_BUILDER__ALL%22%2C%22input%22%3A%22%22%2C%22page%22%3A0%2C%22rows%22%3A10000%2C%22extMap%22%3A%7B%22formId%22%3A81%2C%22typeRequest%22%3A%22QAC_BY_FILTER%22%7D%7D`);
 
  console.log('data====== :>> ',params);
  
  
  return (
    <div  className="flex min-h-screen flex-col items-center justify-between p-24">
        <AdvancedFormulaEditor questionList={res.data} />
    </div>
  )
}