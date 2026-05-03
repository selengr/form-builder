import { memo } from 'react';
import { ElementsType, FormElementInstance, FormElements } from '@/types/FormElements';
import useSelectedElement from '@/hooks/useSelectedElement';

const PropertiesFormSidebar = memo(function PropertiesFormSidebar() {
  const selectedElement = useSelectedElement();

  const PropertiesForm = FormElements[selectedElement!.fieldElement!.questionType as ElementsType].propertiesComponent;

  const fieldLabel = FormElements[selectedElement!.fieldElement!.questionType as ElementsType].designerBtnElement.label;

  const questionType = selectedElement!.fieldElement!.questionType;

  const finalLable = questionType === "PACKAGE_INJECTION_FIELD" ? fieldLabel : `سوال ${fieldLabel}`

  return (
    <div dir='rtl' className='flex flex-col pb-4 p-2'>
      <div className='flex justify-center items-baseline mb-6'>
        <p className='font-bold text-center text-[20px]'>{questionType === 'INFO_FIELD' ? `${fieldLabel}` : finalLable}</p>
      </div>
      <PropertiesForm elementInstance={selectedElement!.fieldElement as FormElementInstance} />
    </div>
  );
});

export default PropertiesFormSidebar;
