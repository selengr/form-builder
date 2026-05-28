import { Fragment } from 'react';

export default function ResponsiveSkeleton() {

  return (
    <div className="w-full flex flex-col">
      <div className="bg-white w-full h-full lg:flex-row rounded-xl flex flex-col">
        <div className="rounded-xl h-full w-full flex flex-col-reverse lg:flex-row py-4 lg:justify-center justify-between lg:pr-4 pb-0 flex-grow px-4">
          <div className="py-4 px-0 pt-4 lg:pt-0 w-full max-w-[920px] flex overflow-y-auto lg:pr-4 lg:pl-0 flex-col items-center bg-white gap-4 select-none">
            <div className="w-full h-full flex items-center flex-col justify-start rounded-md gap-4">
              <KanbanBoardSkeleton />
            </div>
          </div>
          <DesignerSidebarSkeleton />
        </div>
      </div>
    </div>
  );
}

function KanbanBoardSkeleton() {
  return (
    <Fragment>
      <div dir='rtl' className='flex flex-col w-full gap-4 box-border animate-pulse'>
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="relative w-full"
          >
            <div className="flex items-center h-[65px] w-full relative justify-start flex-row p-2 border-[1px] rounded-xl bg-white border-gray-200">
   
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}

      </div>
    </Fragment>
  );
}


 function DesignerSidebarSkeleton() {
  const DesktopSkeleton = () => (
    <div
      dir="rtl"
      className="hidden md:flex bg-white rounded-2xl sticky top-4 right-0 w-[400px] max-w-[400px] border-[1.5px] border-gray-200 overflow-y-scroll select-none flex-col py-4 px-2 gap-2 animate-pulse"
      style={{ scrollbarWidth: 'none', height: 'calc(100vh - 100px)' }}
    >
      <div className="flex justify-between items-center gap-1 bg-gray-50 px-4 py-2 rounded-lg">
            <div className="h-5 bg-gray-200 rounded w-32"></div>
        <div className="flex gap-2">
          <div className="w-10 h-10"></div>
          <div className="w-10 h-10"></div>
        </div>
      </div>

      <div className="p-1 rounded-lg h-full flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div
              key={index}
              dir="rtl"
              className="text-gray-400 w-full flex justify-start rounded-xl h-[52px] items-center pr-2 bg-gray-50 border border-gray-200"
            >
              <div className="bg-gray-200 rounded-xl h-[36px] w-[36px] flex justify-center items-center">
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
              </div>
              <div className="p-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[58px] bg-gray-200 rounded-xl mt-1"></div>
    </div>
  );

  const MobileSkeleton = () => (
    <Fragment>
      <div dir="rtl" className="right-0 w-full flex flex-col rounded-[10px] gap-2 p-4 bg-white border-[1.5px] border-gray-200 animate-pulse">
        <div className="flex justify-between items-center gap-1 bg-gray-50 px-4 py-2 rounded-lg">
          <div className="h-5 bg-gray-200 rounded w-28"></div>
          <div className="flex gap-2">
            <div className="w-10 h-10 bg-gray-200 rounded"></div>
            <div className="w-10 h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
        
        <div className="h-[58px] bg-gray-200 rounded-xl"></div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg p-4 animate-pulse">
        <div className="flex flex-col w-full gap-3">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="w-full flex justify-start rounded-xl h-[52px] items-center pr-2 bg-gray-50 border border-gray-200"
            >
              <div className="bg-gray-200 rounded-xl h-[36px] w-[36px]"></div>
              <div className="p-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );

  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;

  return isDesktop ? <DesktopSkeleton /> : <MobileSkeleton />;
}