"use client"
import { FormProvider } from "react-hook-form"
import { Box, Typography, Button } from "@mui/material"

import { SubCondition } from "./SubCondition"
// components
import { CircleDivider } from "@/components/condition/CircleDivider"
import { SubmitButtons } from "@/components/condition/form/SubmitButtons"
import { SelectController } from "@/components/condition/form/SelectController"
// lib
import { formatContainText } from "@/lib/formatContainText"
import { type TConditionFormData , TConditionData, TSubConditionData } from "@/lib/conditionFormSchema"
// hooks
import { IConditionalSystemProps, IPostCondition } from "@/types/condition"
import { useConditionalForm } from "@/app/(builder)/builder/[id]/condition/_hooks/useConditionalForm"
import { usePostCalculation } from "@/app/(builder)/builder/[id]/condition/_hooks/usePostCalculation"
import { useGetQacWithOutFilter } from "@/app/(builder)/builder/[id]/condition/_hooks/useGetQacWithOutFilter"
import { useGetOnlyAllQuestions } from "@/app/(builder)/builder/[id]/condition/_hooks/useGetOnlyAllQuestions"
import { useGetOnlyAllCalculation } from "@/app/(builder)/builder/[id]/condition/_hooks/useGetOnlyAllCalculation"
import { useParams, useRouter } from "next/navigation"




export const ConditionalSystem: React.FC<IConditionalSystemProps> = ({
  handleClose,
  condition,
  isEdit = false
}) => {
  const { id } = useParams();
  const {refresh} = useRouter()
  const {
    methods,
    conditions,
    handleAddCondition,
    handleRemoveCondition,
    handleAddSubCondition,
    handleRemoveSubCondition,
  } = useConditionalForm(condition)
  console.log("condition======",condition)

  const { qacWithOutFilter, qacWithOutFilterOptions, isFetchingQacWithOutFilter } = useGetQacWithOutFilter()
  const { onlyAllQuestions, onlyAllQuestionsOptions, onlySomeQuestionsOptions, isFetchingOnlyAllQuestions } =
    useGetOnlyAllQuestions()
  const { onlyAllCalculationOptions, isFetchingOnlyAllCalculation } = useGetOnlyAllCalculation()

  const postCalculation = usePostCalculation();

  const onSubmit = (input: TConditionFormData) => {
    console.log("Submitted data:", input);

    const transformInputToOutput = (input : TConditionFormData) : any => {
      return input.conditions.map((condition : TConditionData) => {
        const { subConditions, returnQuestionId, elseQuestionId } = condition;

        const conditionFormula = subConditions
          .map((subCondition : TSubConditionData) => {
            const conditionType = subCondition.conditionType?.split("@")[0];
            const questionType = subCondition.questionType?.split("@")[0];
            const operatorType = subCondition.operatorType?.split("@")[0];
            const value = typeof subCondition.value !== 'object' ? subCondition.value?.split("@")[0] : subCondition.value;
            const logicalOperator = subCondition.logicalOperator?.split("@")[0];
    
            let formattedValue: string;

            if (operatorType === "OPTION") {
              if(typeof subCondition.value === 'object'){
                formattedValue = `{${Array.isArray(value) && value?.map((item:string)=>item?.split("@")[0])}}`
              } else formattedValue = `{${value}}`;
            } else if (operatorType === "VALUE") {
              formattedValue = `{#v_${value}}`;
            } else if (operatorType === "TEXT") {
              if (
                conditionType === "#startWithText" ||
                conditionType === "#endWithText"
              ) {
                formattedValue = `{"${value}"}`;
              } else if (
                conditionType === "!#containAnyText" ||
                conditionType === "#containAnyText"
              ) {
                formattedValue = `{${formatContainText(value as string)}}`;
              } else if (
                conditionType === "#lenEqualText" ||
                conditionType === "#lenGraterThanText" ||
                conditionType === "!#lenGraterThanText"
              ) {
                formattedValue = `{#v_${value}}`;
              } else {
                formattedValue = value as string;
              }
            } else if (operatorType === "DATE") {
              formattedValue = `{#v_"${value}"}`;
            } else {
              formattedValue = value as string;
            }

            const baseCondition = `${conditionType}(${
              questionType.split("*")[1]
            },${formattedValue})`;

            return logicalOperator
              ? ` ${logicalOperator} ${baseCondition}`
              : baseCondition;
          })
          .join("");

        return {
          conditionFormula: conditionFormula,
          formBuilderId: id,
          returnQuestionId: parseInt(returnQuestionId.replace(/\D/g, ''), 10),
          elseQuestionId: parseInt(elseQuestionId.replace(/\D/g, ''), 10),
          frontConditionData: JSON.stringify(input)
        };
      });
    };

    const output : IPostCondition[] = transformInputToOutput(input);
  
    console.log("output",output);    
    
    postCalculation.mutate(
      { data: output },
      {
        onSuccess: () => {
          handleClose()
          refresh()
        },
        onError: (error: any) => {
          // ...
        },
      }
    );
  };

  return (
    <Box
      sx={{ width: "100%",  display: "flex", flexDirection: "column", justifyContent: "center", direction: "ltr" }}
    >
      <Typography
        variant="subtitle1"
        sx={{ display: "flex", justifyContent: "center", color: "#404040", fontWeight: 700, mb: 1 }}
      >
        شرط
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {conditions.map((condition, index) => (
            <Box key={condition.id} sx={{ width: "100%" }}>
              {condition.subConditions.map((subCondition, subIndex) => (
                <SubCondition
                  key={subCondition.id}
                  index={index}
                  subIndex={subIndex}
                  onAddSubCondition={() => handleAddSubCondition(index, subIndex)}
                  onRemoveSubCondition={() => handleRemoveSubCondition(index, subIndex)}
                  qacWithOutFilterOptions={qacWithOutFilterOptions}
                  isFetchingQacWithOutFilter={isFetchingQacWithOutFilter}
                  onlySomeQuestionsOptions={onlySomeQuestionsOptions}
                  isFetchingOnlyAllQuestions={isFetchingOnlyAllQuestions}
                  onlyAllCalculationOptions={onlyAllCalculationOptions}
                  isFetchingOnlyAllCalculation={isFetchingOnlyAllCalculation}
                  onlyAllQuestions={onlyAllQuestions}
                />
              ))}
              <Box
                sx={{
                  ml: { xs: 0, md: 2 },
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                  flexDirection: { xs: "column", md: "row" },
                }}
              >
                <Typography sx={{ color: "#393939", fontSize: "14px" }}>برو به:</Typography>
                <SelectController
                  name={`conditions.${index}.returnQuestionId`}
                  options={onlyAllQuestionsOptions}
                  isLoading={isFetchingOnlyAllQuestions}
                  sx={{ minWidth: 240, ml: 2.5 }}
                />
                <Typography sx={{ color: "#393939", fontSize: "14px", mr: 3.5 }}>در غیر اینصورت برو به:</Typography>
                <SelectController
                  name={`conditions.${index}.elseQuestionId`}
                  options={onlyAllQuestionsOptions}
                  isLoading={isFetchingOnlyAllQuestions}
                  sx={{ minWidth: 300, width: 380 }}
                />
                {index !== 0 && (
                <Button
                  onClick={() => handleRemoveCondition(index)}
                  sx={{
                    width: 113,
                    height: "50px",
                    bgcolor: "#FA4D560D",
                    borderRadius: "8px",
                    border: "1px solid #FA4D56",
                    "&:hover": { bgcolor: "#FA4D560D" },
                  }}
                >
                  <Typography sx={{ color: "#FA4D56", fontSize: "14px" }}>حذف این شرط</Typography>
                </Button>
            )}
              </Box>
              <CircleDivider />
            </Box>
          ))}
          {!isEdit && (
            <Button
            variant="outlined"
            onClick={handleAddCondition}
            sx={{
              ml: 2,
              height: 50,
              maxWidth: 155,
              color: "white",
              bgcolor: "#1758BA",
              borderRadius: "8px",
            }}
          >
            افزودن شرط جدید
          </Button>
          )}
          <SubmitButtons isLoading={postCalculation.isPending} handleClose={handleClose}/>
        </form>
      </FormProvider>
    </Box>
  )
}

