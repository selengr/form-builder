import * as z from 'zod';

const SubConditionSchema = z.object({
  logicalOperator: z.string().optional(),
  questionType: z.string().min(1, { message: 'اين فيلد الزامي است' }),
  operatorType: z.string().min(1, { message: 'اين فيلد الزامي است' }),
  conditionType: z.string().min(1, { message: 'اين فيلد الزامي است' }),
  value: z.union([z.string().min(1, { message: 'اين فيلد الزامي است' }), z.array(z.string().min(1, { message: 'اين فيلد الزامي است' }))]),
  id: z.number(),
});

const ConditionalSubConditionSchema = z.union([z.array(SubConditionSchema), z.literal('false'), z.array(z.any())]);

const ConditionSchema = z
  .object({
    subConditions: ConditionalSubConditionSchema,
    // returnText: z.string().min(1, { message: 'اين فيلد الزامي است' }),
    returnText: z.string(),
    displayIf: z.boolean().default(false),
    id: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.displayIf && Array.isArray(data.subConditions)) {
      data.subConditions.forEach((subCondition, index) => {
        const result = SubConditionSchema.safeParse(subCondition);
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: issue.message,
              path: ['subConditions', index, ...issue.path],
            });
          });
        }
      });
    }
  });

export const ConditionFormSchema = z.object({
  conditions: z.array(ConditionSchema),
});

export type TConditionFormData = z.infer<typeof ConditionFormSchema>;
export type TConditionData = z.infer<typeof ConditionSchema>;
export type TSubConditionData = z.infer<typeof SubConditionSchema>;
