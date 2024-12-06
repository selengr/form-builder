"use client";

import { memo } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DragOverlayWrapper from "../../components/builder/DragOverlayWrapper";
import Designer from "./Designer";

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
    <DndContext sensors={sensors}>
      <div dir="ltr" className="flex w-full flex-grow mx-auto h-full">
        <main className="flex flex-col w-full">
          <div className="flex w-full items-start justify-center relative h-full bg-[#f7f7f7]">
            <Designer />
          </div>
        </main>
        {createPortal(<DragOverlayWrapper />, document.body)}
      </div>
    </DndContext>
  );
});

export default FormBuilder;
