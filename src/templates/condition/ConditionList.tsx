"use client";

// import { ICondition } from "@/types/calculator";


interface IConditionListProps {
  conditions: any;
}

const ConditionList: React.FC<any> = ({ conditions }) => {
  return (
    <div className="w-full max-w-md flex flex-col">
      <div
        dir="rtl"
        className="bg-[#F7F7FF] rounded-lg p-[10px] w-full flex flex-col gap-3"
      >
        {conditions?.map((condition: any) => (
          // eslint-disable-next-line react/jsx-key
          // <ConditionCard condition={condition} />
          <></>
        ))}
      </div>
      {/* <CreateCondition /> */}
    </div>
  );
};

export default ConditionList;
