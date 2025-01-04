"use client";

import { ICalculator } from "@/types/calculator";
import { CalculatorCard } from "./CalculatorCard";
import CreateCalculator from "./CreateCalculator";

interface ICalculatorListProps {
  calculators: ICalculator[] | any;
}

const CalculatorList: React.FC<ICalculatorListProps> = ({ calculators }) => {
  return (
    <div className="w-full max-w-md flex flex-col">
      <div
        dir="rtl"
        className="bg-[#F7F7FF] rounded-lg p-[10px] w-full flex flex-col gap-3"
      >
        {calculators?.map((calculator: ICalculator) => (
          // eslint-disable-next-line react/jsx-key
          <CalculatorCard calculator={calculator} />
        ))}
      </div>
      <CreateCalculator />
    </div>
  );
};

export default CalculatorList;
