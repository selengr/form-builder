"use client";
// types
import { ICalculator } from "@/types/calculator";
/// hook
import useFormData from "@/hooks/useFormData";
// view
import { CalculatorCard } from "./CalculatorCard";
import CreateCalculator from "./CreateCalculator";

interface ICalculatorListProps {
  calculators: ICalculator[] | any;
}

const CalculatorList: React.FC<ICalculatorListProps> = ({ calculators }) => {
  const { formData, isLoading } = useFormData();

  return (
    <div className="w-full h-[calc(100vh-6rem)] max-w-[520px] flex flex-col p-[13px] overflow-hidden">
      {formData?.formSettingModel?.formStatus === "CREATE" && (
        <CreateCalculator />
      )}
      {calculators?.length > 0 && (
        <div
          dir="rtl"
          className="bg-[#F7F7FF] rounded-lg p-[10px] w-full flex flex-col gap-3  mb-10 overflow-y-auto"
        >
          {calculators?.map((calculator: ICalculator, index: number) => (
            <CalculatorCard
              index={index}
              calculator={calculator}
              key={index}
              disabled={
                isLoading || formData?.formSettingModel?.formStatus !== "CREATE"
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CalculatorList;
