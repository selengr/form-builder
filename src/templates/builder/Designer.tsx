'use client';

import { memo } from 'react';
import KanbanBoard from './kanban/KanbanBoard';
import CreateFieldDialog from '@/components/builder/CreateFieldDialog';
import DesignerSidebar from '@/components/builder/DesignerSidebar';

interface DesignerProps {
  data: any;
}

const Designer = memo(function Designer({ data }: DesignerProps) {
  return (
    <div className="w-full h-full flex flex-col">
      <CreateFieldDialog />
      <div className="bg-white w-full h-full lg:flex-row rounded-xl flex flex-col">
        {/* <DesignerTabs /> */}
        <div className="rounded-xl h-full w-full flex flex-col-reverse lg:flex-row py-4 lg:justify-center justify-between lg:pr-4 pb-0 flex-grow px-4">
          <div className="xs:pb-48 md:pb-4 py-4 px-0 pt-4 lg:pt-0 w-full max-w-[920px] flex overflow-y-auto lg:pr-4 lg:pl-0 flex-col items-center bg-white gap-4 select-none">
            <div className="w-full h-full flex items-center flex-col justify-start rounded-md gap-4">
              <KanbanBoard />
            </div>
          </div>
          <DesignerSidebar data={data} />
        </div>
      </div>
    </div>
  );
});

export default Designer;