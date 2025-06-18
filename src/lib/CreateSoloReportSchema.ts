import * as z from "zod"

const dropdownSchema = z.object({
  id: z.string(),
  value: z.string(),
  unique_name: z.string(),
  position: z.number(),
});

const returnTextSchema = z.object({
  content: z.string(),
  contentWithIds: z.string(),
  dropdowns: z.array(dropdownSchema),
});
const elseTextSchema = z.object({
  content: z.string(),
  contentWithIds: z.string(),
  dropdowns: z.array(dropdownSchema),
}).optional();

const SubConditionSchema = z.object({
  logicalOperator: z.string().optional(),
  questionType: z.string().min(1, { message: "اين فيلد الزامي است" }),
  operatorType: z.string().min(1, { message: "اين فيلد الزامي است" }),
  conditionType: z.string().min(1, { message: "اين فيلد الزامي است" }),
  value: z.union([
    z.string().min(1, { message: "اين فيلد الزامي است" }),
    z.array(z.string().min(1, { message: "اين فيلد الزامي است" })),
  ]),
  id: z.number(),
})

const ConditionSchema = z.object({
  subConditions: z.array(SubConditionSchema),
  returnText: z.string().min(1, { message: "اين فيلد الزامي است" }),
  elseReturnText: z.string().optional().default(""),
  returnTextModel: returnTextSchema,
  elseReturnTextModel: elseTextSchema,
  id: z.number().optional(),
})

export const ConditionFormSchema = z.object({
  conditions: z.array(ConditionSchema),
})

export type IElseTextModel = z.infer<typeof elseTextSchema>;
export type IReturnTextModel = z.infer<typeof returnTextSchema>;
export type TConditionFormData = z.infer<typeof ConditionFormSchema>
export type TConditionData = z.infer<typeof ConditionSchema>;
export type TSubConditionData = z.infer<typeof SubConditionSchema>;

