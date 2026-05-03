'use client';

import { useRouter } from 'next/navigation';
// components
import { InfoRow } from '@/components/common/infoRow';

export interface IPackagingItem {
  id: number;
  name: string;
}
interface ListCardProps {
  data: IPackagingItem;
}
// ---------------------------------------------------------------------
const ListCard: React.FC<ListCardProps> = ({
  data
}) => {
  const router = useRouter();

  return (
    <div
      className="
        border border-[#DDE1E6] 
        p-4 rounded-2xl 
        flex flex-col gap-4 
        w-full relative 
        transition-all 
        hover:shadow-md hover:border-[#c5cacf]
        bg-white
      "
    >
      <div className="flex flex-wrap gap-2 w-full items-center justify-between">
        <InfoRow label="نام بسته" value={data.name} bold />

        <button
          className="
            bg-[#1758BA] text-white 
            h-9 px-4 text-sm rounded-lg 
            transition-all duration-200 
            hover:bg-[#216ee1] hover:shadow 
            active:scale-[0.97]
            whitespace-nowrap
          "
          onClick={() => router.push(`/preview`)}
        >
          رو نوشت
        </button>
      </div>
    </div>
  );
};

export default ListCard;