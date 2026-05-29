'use client';

import { createPortal } from 'react-dom';
import { memo, useEffect, useState } from 'react';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
// components
import Designer from './Designer';
import DragOverlayWrapper from '../../components/builder/DragOverlayWrapper';

interface FormBuilderProps {
  data: any;
}

const FormBuilder = memo(function FormBuilder({ data }: FormBuilderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 100,
      distance: 15,
      tolerance: 0,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 15,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <DndContext sensors={sensors}>
      <Designer data={data} />
      {mounted && createPortal(<DragOverlayWrapper />, document.body)}
    </DndContext>
  );
});

export default FormBuilder;