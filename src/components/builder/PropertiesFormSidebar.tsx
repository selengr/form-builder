import { memo } from 'react';
import { ElementsType, FormElementInstance, FormElements } from '@/types/FormElements';
import useSelectedElement from '@/hooks/useSelectedElement';

const PropertiesFormSidebar = memo(function PropertiesFormSidebar() {
  const selectedElement = useSelectedElement();

  if (!selectedElement?.fieldElement?.questionType) return null;

  const PropertiesForm =
    FormElements[selectedElement.fieldElement.questionType as ElementsType].propertiesComponent;

  return (
    <div dir="rtl" className="flex flex-col w-full">
      <PropertiesForm elementInstance={selectedElement.fieldElement as FormElementInstance} />
    </div>
  );
});

export default PropertiesFormSidebar;
