"use client";
import { memo } from "react";
import {
  ElementsType,
  FormElementInstance,
  FormElements,
} from "../../../types/FormElements";
import NoDndPopUpMenu from "./NoDndPopUpMenu";

const DesignerElementNoDnD = memo(function DesignerElementNoDnD({
  element,
}: {
  element: FormElementInstance;
}) {
  const DesignerElement =
    FormElements[element?.questionType as ElementsType].designerComponent;

  return (
    <div
      dir="rtl"
      className="flex items-center h-[65px] w-full relative border-[1px] border-[#1758BA] rounded-xl justify-start flex-row p-2 bg-white"
    >
      <DesignerElement elementInstance={element} />
      <div className="flex flex-row gap-2 absolute left-2">
        <div
          className="h-full w-[35px] flex justify-center items-center rounded-md"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <NoDndPopUpMenu element={element} />
        </div>
      </div>
    </div>
  );
});

export default DesignerElementNoDnD;
