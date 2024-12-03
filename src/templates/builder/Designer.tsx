import { memo } from "react";
import CreateFieldDialog from "@/components/builder/CreateFieldDialog";
import DesignerSidebar from "@/components/builder/DesignerSidebar";
// import DesignerStartPageElement from "./DesignerStartPageElement";
// import DesignerFinishPageElement from "./DesignerFinishPageElement";
// import KanbanBoard from "../components/kanban/KanbanBoard";

const Designer = memo(function Designer() {
  return (
    <div className="w-full min-h-full flex flex-col-reverse xl:flex-row px-4 py-4 justify-center gap-4">
      <CreateFieldDialog />
      <div
        className="p-4 w-full min-h-full flex-grow max-w-[920px] rounded-lg flex overflow-y-auto flex-col items-center bg-white shadow-[0_0_2px_0_rgba(187,187,187,0.2),0_12px_24px_-4px_rgba(187,187,187,0.12)] gap-4"
        style={{ scrollbarWidth: "none", userSelect: "none" }}
      >
        {/* <DesignerStartPageElement /> */}
        <div className="w-full h-full flex flex-grow flex-1 items-center flex-col justify-start rounded-md gap-4">
          {/* <KanbanBoard /> */}
        </div>
        {/* <DesignerFinishPageElement /> */}
      </div>
      <DesignerSidebar />
    </div>
  );
});

export default Designer;
