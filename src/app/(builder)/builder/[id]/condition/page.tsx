

import dynamic from 'next/dynamic'
import { AxiosResponse } from 'axios';
import AxiosApi from '@/services/axios/AxiosApi';


const ConditionList = dynamic(() => import('@/templates/condition/ConditionList'), { ssr: false })
 
export default async function Calculator({params}:{params : {id:string} }) {
 const url = `/condition/main-list/${params.id}?searchFilterModel=%7B%22searchFilterBoxList%22%3A%5B%7B%22restrictionList%22%3A%5B%5D%7D%5D%2C%22sortList%22%3A%5B%7B%22fieldName%22%3A%22id%22%2C%22type%22%3A%22DSC%22%7D%5D%2C%22page%22%3A0%2C%22rows%22%3A1000%7D`;
 const conditions : AxiosResponse<any> = await AxiosApi.get(url);
 const {data : {content}} = conditions


 let dataList =  {
  condition : [
      {
        elseQuestionId : "{#q_1403}@تاریخ.........سیبیس",
          returnQuestionId : "{#q_1403}@تاریخ.........سیبیس",
          subConditions : [
            {
              conditionType : "!#equalMultiChoiceSingle@نابرابر با",
              id : 8325,
              logicalOperator : "",
              operatorType : "OPTION@گزینه",
              questionType : "MULTIPLE_CHOICE*{#q_30}@چند گزینه تک",
              value : "#op_5@گزینه 1"        
            }
          ]
      },
      {
          elseQuestionId : "{#q_1403}@تاریخ.........سیبیس",
          returnQuestionId : "{#q_1403}@تاریخ.........سیبیس",
          subConditions : [
              {
                  conditionType: "#lenGraterThanText@طول متن بیشتر از",
                  id : "b1f5e17a-d1bc-41ba-8601-1b75239f322b",
                  logicalOperator : "",
                  operatorType : "VALUE@ارزش",
                  questionType : "TEXT_FIELD*{#q_101}@متی",
                  value : "33"
              },
              {
                  conditionType: "#lenGraterThanText@طول متن بیشتر از",
                  id : "b1f5e17a-d1bc-41ba-8601-1b75239f322b",
                  logicalOperator : "&&@&&",
                  operatorType : "VALUE@ارزش",
                  questionType : "TEXT_FIELD*{#q_101}@متی",
                  value : "33"
              },
              {
                  conditionType: "#lenGraterThanText@طول متن بیشتر از",
                  id : "b1f5e17a-d1bc-41ba-8601-1b75239f322b",
                  logicalOperator : "&&@&&",
                  operatorType : "VALUE@ارزش",
                  questionType : "TEXT_FIELD*{#q_101}@متی",
                  value : "33"
              },
          
          ]
      },

  ]
}

 
  return (
    <div className="container mx-auto py-8 flex justify-center items-start h-screen bg-white">
        <ConditionList conditions={dataList.condition}/>
    </div>
  )
}