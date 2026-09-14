'use client';

const GroupCartSkeleton = () => {
  return (
    <div className="w-full max-w-lg bg-white rounded-xl border p-4 py-6 animate-pulse flex items-center justify-between">
      
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-4 w-40 bg-gray-200 rounded"></div>
        <div className="h-3 w-24 bg-gray-200 rounded"></div>
      </div>

      <div className="h-6 w-10 bg-gray-200 rounded-full"></div>
      
    </div>
  );
};

// ------------------------------------------------------------
const GroupsListSkeleton = () => {
  return (
    <div className="w-full max-w-lg flex flex-col gap-[10px]">
      {Array.from({ length: 6 }).map((_, i) => (
        <GroupCartSkeleton key={i} />
      ))}
    </div>
  );
};

export default GroupsListSkeleton;
