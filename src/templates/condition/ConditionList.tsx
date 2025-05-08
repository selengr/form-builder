"use client";

import {IGetCondition} from "@/types/condition";
import {ConditionCard} from "./ConditionCard";
import CreateCondition from "./CreateCondition";
import {idGenerator} from "@/lib/idGenerator";
import useFormData from "@/hooks/useFormData";

interface IConditionListProps {
    conditions: IGetCondition[];
}

const ConditionList: React.FC<IConditionListProps> = ({conditions}) => {
    const {formData, isLoading} = useFormData();

    return (
        <div className="w-full h-[calc(100vh-6rem)] max-w-md flex flex-col p-[13px] overflow-hidden">
            {!isLoading && formData?.formSettingModel?.formStatus === "CREATE" && (
                <CreateCondition/>
            )}
            {Array.isArray(conditions) && conditions.length > 0 && (
                <div
                    dir="rtl"
                    className="bg-[#F7F7FF] rounded-lg p-6 w-full flex flex-col gap-3  mb-10 overflow-scroll"
                >
                    {conditions?.map((condition: IGetCondition, index: number) => (
                        // eslint-disable-next-line react/jsx-key
                        <div key={idGenerator()}>
                            <ConditionCard condition={condition} index={index}
                                           disabled={isLoading || formData?.formSettingModel?.formStatus !== "CREATE"}/>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ConditionList;
