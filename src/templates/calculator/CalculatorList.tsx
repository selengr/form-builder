'use client';

import { ICalculator } from '@/types/calculator';

import { CalculatorCard } from './CalculatorCard';
import CreateCalculator from './CreateCalculator';

interface IProps {
  formData: {
    formSettingModel: {
      formStatus: string
    };
  }
  calculators: ICalculator[];
}

const CalculatorList: React.FC<IProps> = ({ calculators, formData }) => {

  const isCreateMode = formData?.formSettingModel?.formStatus === 'CREATE';

  return (
    <>
        <div className="w-full max-w-[530px] -mr-3">
          <CreateCalculator isCreateMode={isCreateMode} />
        </div>

      <div className="w-full overflow-y-auto h-full flex justify-center" dir="rtl">
        <div className="w-full max-w-[520px] flex flex-col p-0 md:p-[13px]">
          {calculators?.length > 0 && (
            <div className="bg-[#F7F7FF] rounded-lg p-0 md:p-[10px] w-full flex flex-col gap-3 mb-10">
              {calculators.map((calculator, index) => (
                <CalculatorCard
                  key={calculator.id}
                  index={index}
                  calculator={calculator}
                  disabled={!isCreateMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CalculatorList;
