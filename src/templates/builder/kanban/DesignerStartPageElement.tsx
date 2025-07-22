"use client";
import {Fragment} from "react";
import DesignerElementNoDnD from "./DesignerElementNoDnd";
import {FormElementInstance, FormElements} from "../../../types/FormElements";
import useDesigner from "@/hooks/useDesigner";
import {FiPlus} from "react-icons/fi";
import useActionOpenDialog from "@/hooks/useActionOpenDialog";
import useActionSelectedElement from "@/hooks/useActionSelectedElement";
import {idGenerator} from "@/lib/idGenerator";

export default function DesignerStartPageElement() {
  const setOpenDialog = useActionOpenDialog();
  const setSelectedElement = useActionSelectedElement();
  const { startPage } = useDesigner();

  return (
    <Fragment>
      {!startPage ? (
        <div
          dir="rtl"
          className="flex px-3 flex-row w-full relative items-center justify-center rounded-xl bg-[#F7F7FF]"
        >
          <p className="text-base p-4 flex font-bold justify-center flex-grow">
            صفحه شروع
          </p>
          <button
            onClick={() => {
              const newElement: FormElementInstance = FormElements[
                "TitleFieldStart"
              ].construct({
                questionId: idGenerator(),
                startPageMsg: "",
              });
              setOpenDialog(true);
              setSelectedElement({ fieldElement: newElement, position: null });
            }}
            className="p-2 border-[1px] border-[#1758BA] rounded-xl"
          >
            <FiPlus color="#1758BA" size={25} height={25} />
          </button>
        </div>
      ) : (
        <div
          dir="rtl"
          className="flex flex-col w-full relative items-center justify-center p-2 rounded-xl bg-[#f7f7f7] mt-1"
        >
          <p className="text-base font-bold px-4 pb-4 pt-2 flex justify-center flex-grow">
            صفحه شروع
          </p>
          <DesignerElementNoDnD element={startPage} />
        </div>
      )}
    </Fragment>
  );
}
