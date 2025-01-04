import Image from "next/image";
import { useState } from "react";
import { ICalculatorCardProps } from "@/types/calculator";
import EditCalculatorDialog from "./EditCalculatorDialog";

export function CalculatorCard({ calculator }: ICalculatorCardProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div
        key={calculator.id}
        className="bg-white rounded-lg p-[10px] h-14
flex justify-between w-full cursor-pointer border-[1px]
border-[#1758BA]"
        onClick={() => setOpen(true)}
      >
        <div className="flex justify-center items-center gap-[10px]">
          <div
            className="bg-[#F7F7FF] h-8 w-8 rounded-[10px] flex
justify-center items-center"
          >
            {calculator.id}
          </div>
          <div className="flex flex-col">
            <h3 className="text-[#161616] text-sm">
              {calculator.name ?? "--"}
            </h3>
            <span className="text-[#393939] text-xs">
              {calculator.theFormula ?? "--"}
            </span>
          </div>
        </div>
        <div className="flex justify-center items-center gap-[10px]">
          <button className="bg-[#F7F7FF] h-8 w-8 rounded-[10px] flex justify-center items-center">
            <Image
              src={"/images/calc/math.svg"}
              width={25}
              height={25}
              alt="math"
            />
          </button>
          <div
            className="bg-[#F7F7FF] h-8 w-8 rounded-[10px] flex
justify-center items-center"
          >
            1
          </div>
        </div>
      </div>
      {open && (
        <EditCalculatorDialog open={open} setOpen={setOpen} />
      )}
    </>
  );
}
