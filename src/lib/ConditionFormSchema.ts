import * as z from "zod"

const SubConditionSchema = z.object({
  logicalOperator: z.string().optional(),
  questionType: z.string().min(1, { message: "اين فيلد الزامي است" }),
  operatorType: z.string().min(1, { message: "اين فيلد الزامي است" }),
  conditionType: z.string().min(1, { message: "اين فيلد الزامي است" }),
  value: z.union([
    z.string().min(1, { message: "اين فيلد الزامي است" }),
    z.array(z.string().min(1, { message: "اين فيلد الزامي است" })),
  ]),
  id: z.string().optional(),
})

const ConditionSchema = z.object({
  subConditions: z.array(SubConditionSchema),
  returnQuestionId: z.string().min(1, { message: "اين فيلد الزامي است" }),
  elseQuestionId: z.string(),
})

export const ConditionFormSchema = z.object({
  conditions: z.array(ConditionSchema),
})

export type TConditionFormData = z.infer<typeof ConditionFormSchema>
export type TConditionData = z.infer<typeof ConditionSchema>;
export type TSubConditionData = z.infer<typeof SubConditionSchema>;

