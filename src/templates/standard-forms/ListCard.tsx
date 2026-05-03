'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// components
import { InfoRow } from '@/components/common/infoRow';
// actions
import { clonePackageAction } from '../../../actions/standard-forms/clone';

export interface IPackagingItem {
  id: number;
  name: string;
  formId: number;
}
interface ListCardProps {
  data: IPackagingItem;
}
// ---------------------------------------------------------------------
const ListCard: React.FC<ListCardProps> = ({
  data: { name, id }
}) => {
  const { push } = useRouter()
  const [loading, setLoading] = useState<boolean>(false);

  const handleClone = async () => {
    setLoading(true);
    try {
      await clonePackageAction(id);

      toast.success(
        <div className="flex flex-col">
          <span>یک نسخه از این فرم با موفقیت به فرم‌های من اضافه شد</span>

          <div className='flex justify-end'>
            <button
              onClick={() => push('/builder')}
              className="px-3 max-w-[150px] py-1 rounded bg-zinc-950 text-white transition"
            >
              مشاهده فرم‌های من
            </button>
          </div>

        </div>,
        {
          className: 'max-w-[300px]',
          duration: 70000,
        }
      );


    } catch (error: any) {
      toast.error(error?.message || 'خطا در انجام عملیات');
    } finally {
      setLoading(false);
    }
  };

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
        <InfoRow label="نام بسته" value={name} bold />

        <button
          className="
            bg-[#1758BA] text-white 
            h-9 px-4 text-sm rounded-lg 
            transition-all duration-200 
            hover:bg-[#216ee1] hover:shadow 
            active:scale-[0.97]
            whitespace-nowrap
          "
          onClick={handleClone}
          disabled={loading}
        >
          {loading ? 'درحال کپی...' : 'رونوشت'}
        </button>
      </div>
    </div>
  );
};

export default ListCard;