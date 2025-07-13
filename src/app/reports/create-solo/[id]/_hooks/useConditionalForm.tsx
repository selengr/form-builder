import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { ConditionFormSchema, TConditionData, TSubConditionData, type TConditionFormData } from "@/lib/CreateSoloReportSchema"
import { idGenerator } from "@/lib/idGenerator"
import { IGetCondition } from "@/types/conditionReportSolo"



export const createNewSubCondition = () => ({
    logicalOperator: "",
    questionType: "",
    operatorType: "",
    conditionType: "",
    value: "",
    id: idGenerator(),
  })
  
  export const createNewCondition = () => ({
    subConditions: [createNewSubCondition()],
    displayIf: true,
    returnText: "",
  })


  const transformOutputToInput = (conditionJson : IGetCondition ) : TConditionData => {
   
      const { frontConditionData } = conditionJson;
      const  conditions = JSON.parse(frontConditionData);
      const { subConditions, returnText, displayIf   } = conditions

      const SubConditionsData : TSubConditionData[] | boolean = Array.isArray(subConditions) && subConditions
        ?.map((subCondition : TSubConditionData) => {
          const id = subCondition.id
          const conditionType = subCondition.conditionType;
          const questionType = subCondition.questionType;
          const operatorType = subCondition.operatorType;
          const logicalOperator = subCondition.logicalOperator;
          let value : string | string[] = ""

          // if(questionType === "MULTIPLE_CHOICE_MULTI_SELECT_OPTION"){}
          
          if (operatorType === "OPTION" && questionType?.split("*")[0] === "MULTIPLE_CHOICE_MULTI_SELECT") {
              const op : string[] = []
              if(Array.isArray(subCondition.value)){
                    subCondition.value?.map((item:string)=>op.push(item?.toString()))
                    value = op
              }
          } else value = subCondition.value.toString();

          return {
            id : subCondition.id,
            conditionType,
            questionType,
            operatorType,
            value,
            logicalOperator
          }
        });

      return {
        id : conditionJson.id,
        returnText: returnText,
        displayIf: displayIf,
        subConditions : displayIf ? SubConditionsData : subConditions
      };
   
  };


export const useConditionalForm = (condition: IGetCondition  | undefined) => {

  const methods = useForm<TConditionFormData>({
    resolver: zodResolver(ConditionFormSchema),
    defaultValues: {
      conditions: [!!condition ? transformOutputToInput(condition):createNewCondition()],
    },
  })

  const {
    control,
    handleSubmit,
    // formState: { errors },
    getValues,
  } = methods

  const {
    fields: conditions,
    append: appendCondition,
    remove: removeCondition,
    update: updateCondition,
  } = useFieldArray({
    control,
    name: "conditions",
  })

  const handleAddCondition = () => {
    appendCondition(createNewCondition())
  }

  const handleRemoveCondition = (index: number) => {
    removeCondition(index)
  }

  const handleAddSubCondition = (index: number, subIndex: number) => {
    const currentCondition = getValues().conditions[index]
    const clonedCondition = structuredClone(currentCondition)

    const newSubConditions = [
      ...clonedCondition.subConditions.slice(0, subIndex + 1),
      {
        logicalOperator: clonedCondition.subConditions.length > 0 ? "&&" : "",
        questionType: "",
        operatorType: "",
        conditionType: "",
        value: "",
        id: idGenerator(),
      },
      ...clonedCondition.subConditions.slice(subIndex + 1),
    ]

    updateCondition(index, {
      ...clonedCondition,
      subConditions: newSubConditions as any,
    })
  }

  const handleRemoveSubCondition = (conditionIndex: number, subConditionIndex: number) => {
    const updatedCondition = { ...conditions[conditionIndex] }
    Array.isArray(updatedCondition.subConditions) && updatedCondition.subConditions?.splice(subConditionIndex, 1)
    updateCondition(conditionIndex, updatedCondition)
  }

  return {
    methods,
    conditions,
    handleAddCondition,
    handleRemoveCondition,
    handleAddSubCondition,
    handleRemoveSubCondition,
  }
}

