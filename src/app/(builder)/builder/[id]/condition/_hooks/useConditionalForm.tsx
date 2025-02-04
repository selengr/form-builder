import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { ConditionFormSchema, type TConditionFormData } from "@/lib/ConditionFormSchema"

export const useDependentSelectForm = () => {
  const methods = useForm<TConditionFormData>({
    resolver: zodResolver(ConditionFormSchema),
    defaultValues: {
      conditions: [
        {
          subConditions: [
            { logicalOperator: undefined, questionType: "", operatorType: "", conditionType: "", value: "" },
          ],
          elseQuestionId: "",
          returnQuestionId: "",
        },
      ],
    },
  })

  const {
    fields: conditions,
    append: appendCondition,
    remove: removeCondition,
  } = useFieldArray({
    control: methods.control,
    name: "conditions",
  })

  const addCondition = () => {
    appendCondition({
      subConditions: [{ logicalOperator: undefined, questionType: "", operatorType: "", conditionType: "", value: "" }],
      elseQuestionId: "",
      returnQuestionId: "",
    })
  }

  const handleSubmit = methods.handleSubmit((data: TConditionFormData) => {
    console.log("Submitted data:", data)
  })

  return {
    methods,
    conditions,
    addCondition,
    removeCondition,
    handleSubmit,
  }
}

