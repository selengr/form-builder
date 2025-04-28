"use client";

import { ICalculator } from "@/types/calculator";
import { CalculatorCard } from "./CalculatorCard";
import CreateCalculator from "./CreateCalculator";

interface ICalculatorListProps {
  calculators: ICalculator[] | any;
}

const CalculatorList: React.FC<ICalculatorListProps> = ({ calculators }) => {
  return (
    <div className="w-full max-w-md flex flex-col p-[13px]">
      <CreateCalculator />
      {calculators.length > 0 && (
        <div
          dir="rtl"
          className="bg-[#F7F7FF] rounded-lg p-[10px] w-full flex flex-col gap-3 pb-10 mb-10"
        >
          {calculators?.map((calculator: ICalculator,index:number) => (
            <CalculatorCard index={index} calculator={calculator} key={index}/>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalculatorList;
