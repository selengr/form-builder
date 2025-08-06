'use client';

import { memo } from 'react';
import { createPortal } from 'react-dom';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import DragOverlayWrapper from '../../components/builder/DragOverlayWrapper';
import Designer from './Designer';

const FormBuilder = memo(function FormBuilder() {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 150,
      distance: 10,
      tolerance: 0,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 150,
      tolerance: 10,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <DndContext
      sensors={sensors}
      // autoScroll={{ layoutShiftCompensation: false }}
    >
      <div dir='ltr' className='flex w-full mx-auto h-[calc(100vh-1rem)]'>
        <main className='flex flex-col w-full'>
          <div className='flex w-full items-start justify-center relative h-full '>
            <Designer />
          </div>
        </main>
        {createPortal(<DragOverlayWrapper />, document.body)}
      </div>
    </DndContext>
  );
});

export default FormBuilder;
