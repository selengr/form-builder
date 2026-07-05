'use client';

import { memo } from 'react';
import { FormElements } from '@/types/FormElements';
import SidebarBtnElement from './SidebarBtnElement';
import SidebarBtnLogic from './SidebarBtnLogic';

const ELEMENTS = [
  FormElements.TEXT_FIELD,
  FormElements.MULTIPLE_CHOICE,
  FormElements.MULTIPLE_CHOICE_IMAGE,
  FormElements.SPECTRAL,
  FormElements.RATING,
  FormElements.PACKAGE_INJECTION_FIELD,
  FormElements.INFO_FIELD,
];

export interface FormSettingModel {
  responseLimitation: string | null;
  label?: string | null;
  startFromContinue?: boolean | null;
}

export type FormTypeEnum = 'SURVEY' | 'PACKAGING' | 'DATA_COLLECTION';

export interface DesignerSidebarData {
  typeEnum: FormTypeEnum;
  formSettingModel?: FormSettingModel | null;
}

interface DesignerSidebarProps {
  data: DesignerSidebarData;
  disabled?: boolean;
  selectedTab: number;
  onCreateCalculator: () => void;
  onCreateCondition: () => void;
}

const DesignerSidebar = memo(function DesignerSidebar({
  disabled = false,
  selectedTab,
  onCreateCalculator,
  onCreateCondition,
}: DesignerSidebarProps) {
  const renderElements = ELEMENTS.map((el, index) => (
    <SidebarBtnElement key={index} formElement={el} disabled={disabled} />
  ));

  return (
    <div
      dir="rtl"
      className="hidden lg:flex bg-white rounded-[20px] sticky top-4 w-[340px] max-w-[340px] shrink-0 border border-[#DDE1E6] flex-col overflow-hidden select-none"
    >
      <div
        className="flex flex-col gap-2 p-2 overflow-y-auto flex-1"
        style={{ scrollbarWidth: 'thin' }}
      >
        {selectedTab === 1 ? (
          renderElements
        ) : (
          <>
            <SidebarBtnLogic
              title="محاسبه‌گر جدید"
              icon="/images/calc/ic_calculator.svg"
              onClick={onCreateCalculator}
            />
            <SidebarBtnLogic
              title="شرط جدید"
              icon="/images/calc/ic_condition.svg"
              onClick={onCreateCondition}
            />
          </>
        )}
      </div>
    </div>
  );
});

export default DesignerSidebar;
