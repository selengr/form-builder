'use client';

function MemberRowSkeleton() {
  return (
    <li className="flex items-center justify-between p-4 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 w-[80%] justify-between">
        <div className="h-4 w-36 bg-gray-200 rounded" />
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-6">
          <div className="h-3 w-28 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="h-6 w-10 bg-gray-200 rounded-full" />
    </li>
  );
}

export default function MemberListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul className="divide-y divide-gray-200" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <MemberRowSkeleton key={i} />
      ))}
    </ul>
  );
}
