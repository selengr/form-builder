"use client"
import { useState } from "react"
import { FormProvider } from "react-hook-form"
import { useParams, useRouter } from "next/navigation"
import { Box, Typography, Button } from "@mui/material"

import { SubCondition } from "./SubCondition"
// components
import { CircleDivider } from "@/components/condition/CircleDivider"
import { SubmitButtons } from "@/components/condition/form/SubmitButtons"
import { TextFieldController } from "@/components/condition/form/TextFieldController"
// lib
import { formatContainText } from "@/lib/formatContainText"
import { type TConditionFormData , TConditionData, TSubConditionData } from "@/lib/CreateSoloReportSchema"
// hooks
import { IConditionalSystemProps, IPostCondition } from "@/types/conditionReportSolo"
import { useConditionalForm } from "@/app/reports/create-solo/[id]/_hooks/useConditionalForm"
import { useGetQacWithOutFilter } from "@/app/reports/create-solo/[id]/_hooks/useGetQacWithOutFilter"
import { useGetOnlyAllQuestions } from "@/app/reports/create-solo/[id]/_hooks/useGetOnlyAllQuestions"
import { useGetOnlyAllCalculation } from "@/app/reports/create-solo/[id]/_hooks/useGetOnlyAllCalculation"
import { usePostCondition } from "@/app/reports/create-solo/[id]/_hooks/usePostCondition"
import AdvancedTextareaEditor from "@/components/AdvancedTextareaEditor/AdvancedTextareaEditor"


export const ConditionalSystem: React.FC<IConditionalSystemProps> = ({
  handleClose,
  condition,
  isEdit = false
}) => {
  const { id } = useParams();
  const {refresh} = useRouter()
   const [currentData, setCurrentData] = useState<any>(null)

  const {
    methods,
    conditions,
    handleAddCondition,
    handleRemoveCondition,
    handleAddSubCondition,
    handleRemoveSubCondition,
  } = useConditionalForm(condition)

  const { qacWithOutFilterOptions, isFetchingQacWithOutFilter, qacWithOutFilter } = useGetQacWithOutFilter()
  const {
     onlyAllQuestions,
     onlyAllDateOptions, 
     onlyAllQuestionsOptions,
      onlySomeQuestionsOptions,
       isFetchingOnlyAllQuestions
       } = useGetOnlyAllQuestions()
  const { onlyAllCalculationOptions, isFetchingOnlyAllCalculation } = useGetOnlyAllCalculation()

  const postCondition = usePostCondition(isEdit);

  const handleDataChange = (data: any) => {
    console.log("test");
    console.log("test2",data);
    setCurrentData(data)
  }


  const onSubmit = (input: TConditionFormData) => {

    const transformInputToOutput = (input : TConditionFormData) : any => {
      return input.conditions.map((condition : TConditionData,index) => {
        const { subConditions, returnText, elseReturnText } = condition;

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
          formBuilderId: Number(id),
          conditionFormula: conditionFormula,
          elseReturnText,
          returnText,
          frontConditionData: JSON.stringify(input.conditions[index]),
          ...(isEdit && { id: Number(condition.id) }) 
        };
      });
    };

    const output : IPostCondition[] = transformInputToOutput(input);
    postCondition.mutate(
      { data: output },
      {
        onSuccess: () => {
          refresh()
          handleClose()
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
        افزودن خرده‌گزارش 
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
                  onlyAllDateOptions={onlyAllDateOptions}
                />
              ))}
              <Box
                sx={{
                  ml: { xs: 0, md: 2 },
                  display: "flex",
                  alignItems: "start",
                  gap: 1,
                  flexDirection: { xs: "column"},
                }}
              >
                {/* <Typography sx={{ color: "#393939", fontSize: "14px",ml:-1.3 }}>نمایش بده:</Typography>
                <TextFieldController  sx={{ minWidth: 240, ml: 0 }} name={`conditions.${index}.returnText`} type="string" /> */}
    
                 <AdvancedTextareaEditor 
                 onDataChange={handleDataChange}
                 initialData={ undefined} 
                 methods={methods.setValue} 
                 qacWithOutFilter={qacWithOutFilter}
                 />

                 
                    <div className="mt-6 p-4 bg-gray-100 rounded w-full">
                      <h3 className="font-bold mb-2">Current Data:</h3>
                      <pre className="text-xs overflow-auto">{JSON.stringify(currentData, null, 2)}</pre>
                    </div>
              

                <Typography sx={{color: "#393939", fontSize: "14px", mr: 0 }}>در غیر اینصورت نمایش بده:</Typography>
                
                <TextFieldController sx={{ minWidth: 300, width: 380 }} name={`conditions.${index}.elseReturnText`} type="string" />
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
                  <Typography sx={{ color: "#FA4D56", fontSize: "14px" }}>حذف این خرده‌گزارش</Typography>
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
          <SubmitButtons isLoading={postCondition.isPending} handleClose={handleClose}/>
        </form>
      </FormProvider>
    </Box>
  )
}
