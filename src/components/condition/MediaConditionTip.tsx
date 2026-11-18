'use client';

import { IoInformationCircle } from 'react-icons/io5';

const MEDIA_CONDITION_TIP =
  'برای سوال صوتی و تصویری، گویه و عملگر غیرفعال است و فقط مسیر «برو به / در غیر اینصورت» قابل تعریف است.';

export const MediaConditionTip = () => (
  <div className="flex w-full items-center gap-2 rounded-xl bg-[#E8F4FF] px-3 py-2.5 text-[13px] leading-6 text-[#1758BA]">
    <IoInformationCircle className="shrink-0" size={18} />
    <p className="text-right">{MEDIA_CONDITION_TIP}</p>
  </div>
);
