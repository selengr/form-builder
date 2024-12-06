"use client";

import { memo } from "react";
import CreateFieldDialog from "@/components/builder/CreateFieldDialog";
import DesignerSidebar from "@/components/builder/DesignerSidebar";
import KanbanBoard from "./kanban/KanbanBoard";
import DesignerStartPageElement from "./kanban/DesignerStartPageElement";
import DesignerFinishPageElement from "./kanban/DesignerFinishPageElement";
import DesignerTabs from "./TabComponent";

const Designer = memo(function Designer() {
  return (
    <div className="w-full min-h-full flex flex-col-reverse lg:flex-row px-4 py-4 justify-center gap-4 bg-[#f7f7f7]">
      <CreateFieldDialog />
      <div
        className="p-4 w-full min-h-full flex-grow max-w-[920px] rounded-lg flex overflow-y-auto flex-col items-center bg-white shadow-[0_0_2px_0_rgba(187,187,187,0.2),0_12px_24px_-4px_rgba(187,187,187,0.12)] gap-4"
        style={{ scrollbarWidth: "none", userSelect: "none" }}
      >
        <div className="w-full flex items-center justify-start">
          <DesignerTabs />
        </div>
        <DesignerStartPageElement />
        <div className="w-full h-full flex flex-grow flex-1 items-center flex-col justify-start rounded-md gap-4">
          <KanbanBoard />
        </div>
        <DesignerFinishPageElement />
      </div>
      <DesignerSidebar />
    </div>
  );
});

export default Designer;
