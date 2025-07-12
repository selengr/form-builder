import * as z from "zod"

const SubConditionSchema = z.object({
  logicalOperator: z.string().optional(),
  questionType: z.string(),
  operatorType: z.string(),
  conditionType: z.string(),
  value: z.union([
    z.string(),
    z.array(z.string()),
  ]),
  id: z.number(),
})

const ConditionSchema = z.object({
  subConditions: z.union([
    z.array(SubConditionSchema), 
    z.literal("false"),
  ]),
  returnText: z.string().min(1, { message: "اين فيلد الزامي است" }),
  displayIf: z.boolean().default(false),
  id: z.number().optional(),
})

export const ConditionFormSchema = z.object({
  conditions: z.array(ConditionSchema),
})

export type TConditionFormData = z.infer<typeof ConditionFormSchema>
export type TConditionData = z.infer<typeof ConditionSchema>;
export type TSubConditionData = z.infer<typeof SubConditionSchema>;

