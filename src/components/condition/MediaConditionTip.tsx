'use client';

import { IoInformationCircle } from 'react-icons/io5';

const TIPS = {
  media:
    'برای سوال صوتی و تصویری، گویه و عملگر غیرفعال است و فقط مسیر «برو به / در غیر اینصورت» قابل تعریف است.',
  info: 'برای سوال راهنما، گویه و عملگر غیرفعال است و فقط مسیر «برو به / در غیر اینصورت» قابل تعریف است.',
} as const;

export const MediaConditionTip = ({ variant = 'media' }: { variant?: keyof typeof TIPS }) => (
  <div className="flex w-full items-center gap-2 rounded-xl bg-[#E8F4FF] px-3 py-2.5 text-[13px] leading-6 text-[#1758BA]">
    <IoInformationCircle className="shrink-0" size={18} />
    <p className="text-right">{TIPS[variant]}</p>
  </div>
);
