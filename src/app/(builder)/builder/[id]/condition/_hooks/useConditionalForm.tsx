import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { ConditionFormSchema, TConditionData, type TConditionFormData } from "@/lib/conditionFormSchema"
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



export const useConditionalForm = (condition:{condition:TConditionData}) => {

  const methods = useForm<TConditionFormData>({
    resolver: zodResolver(ConditionFormSchema),
    defaultValues: {
      conditions: [condition??createNewCondition()],
    },
  })

  const {
    control,
    // handleSubmit,
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

