import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { ConditionFormSchema, TConditionData, TSubConditionData, type TConditionFormData } from "@/lib/conditionFormSchema"
import { idGenerator } from "@/lib/idGenerator"



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
    elseQuestionId: "",
    returnQuestionId: "",
  })


  const transformOutputToInput = (condition : TConditionData) : TConditionData => {debugger
   
      const { subConditions, returnQuestionId, elseQuestionId } = condition;

      const SubConditionsData : TSubConditionData[] = subConditions
        .map((subCondition : TSubConditionData) => {
          const conditionType = subCondition.conditionType?.split("@")[0];
          const questionType = subCondition.questionType?.split("@")[0];
          const operatorType = subCondition.operatorType?.split("@")[0];
          const logicalOperator = subCondition.logicalOperator?.split("@")[0];
          // const id = subCondition.id
          let value : string | string[] = ""
  

          // if(questionType === "MULTIPLE_CHOICE_MULTI_SELECT_OPTION"){}
          
          if (operatorType === "OPTION" && questionType?.split("*")[0] === "MULTIPLE_CHOICE_MULTI_SELECT") {
              const op : string[] = []
              if(Array.isArray(subCondition.value)){
                    subCondition.value?.map((item:string)=>op.push(item?.toString()?.split("@")[0]))
                    value = op
              }
          } else value = subCondition.value.toString()?.split("@")[0];

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
        returnQuestionId: returnQuestionId?.split("@")[0],
        elseQuestionId: elseQuestionId?.split("@")[0],
        subConditions : SubConditionsData
      };
   
  };


export const useConditionalForm = (condition: TConditionData) => {

  const methods = useForm<TConditionFormData>({
    resolver: zodResolver(ConditionFormSchema),
    defaultValues: {
      conditions: [!!condition ? transformOutputToInput(condition):createNewCondition()],
    },
  })

  // console.log("=====================",transformOutputToInput(condition))

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
      subConditions: newSubConditions,
    })
  }

  const handleRemoveSubCondition = (conditionIndex: number, subConditionIndex: number) => {
    const updatedCondition = { ...conditions[conditionIndex] }
    updatedCondition.subConditions.splice(subConditionIndex, 1)
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

