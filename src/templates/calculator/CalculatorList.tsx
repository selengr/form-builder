"use client";

import { ICalculator } from "@/types/calculator";
import { CalculatorCard } from "./CalculatorCard";

interface ICalculatorListProps {
  calculators: ICalculator[] | any;
}

const CalculatorList: React.FC<ICalculatorListProps> = ({ calculators} ) => {
  console.log("calculators reza :>> ", calculators);
  return (
    <div
      dir="rtl"
      className="bg-[#F7F7FF] rounded-lg p-[10px] flex flex-col justify-center items-center w-full gap-3"
    >
      {calculators?.map((calculator:any) => (
        <CalculatorCard calculator={calculator} />
      ))}
    </div>
  );
};

export default CalculatorList;
