'use client';

import { memo } from 'react';
import { createPortal } from 'react-dom';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import DragOverlayWrapper from '../../components/builder/DragOverlayWrapper';
import Designer from './Designer';

interface FormBuilderProps {
  data: any;
}

const FormBuilder = memo(function FormBuilder({ data }: FormBuilderProps) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 50,
      distance: 100,
      tolerance: 0,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 50,
      tolerance: 10,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <DndContext sensors={sensors}>
      <div dir="ltr" className="flex w-full mx-auto h-[calc(100vh-1rem)]">
        <main className="flex flex-col w-full">
          <div className="flex w-full items-start justify-center relative h-full">
            {/* پاس دادن دیتا به Designer */}
            <Designer data={data} />
          </div>
        </main>
        {createPortal(<DragOverlayWrapper />, document.body)}
      </div>
    </DndContext>
  );
});

export default FormBuilder;