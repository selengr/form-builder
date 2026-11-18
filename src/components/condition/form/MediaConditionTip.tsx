'use client';

const TIPS = {
  media:
    'برای سوال صوتی و تصویری، گویه و عملگر غیرفعال است و فقط مسیر «برو به / در غیر اینصورت» قابل تعریف است.',
  info: 'برای سوال راهنما، گویه و عملگر غیرفعال است و فقط مسیر «برو به / در غیر اینصورت» قابل تعریف است.',
} as const;

export const ConditionInfoIcon = ({
  size = 18,
  color = '#2F80ED',
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
    aria-hidden
  >
    <circle cx="12" cy="12" r="8.25" stroke={color} strokeWidth="2" />
    <rect x="10.5" y="6.75" width="3" height="10.5" rx="1.5" fill={color} />
  </svg>
);

export const MediaConditionTip = ({ variant = 'media' }: { variant?: keyof typeof TIPS }) => (
  <div
    dir="rtl"
    className="flex w-full items-center gap-2 rounded-xl bg-[#E8F4FF] px-3 py-2.5 text-[13px] leading-6 text-[#1758BA]"
  >
    <ConditionInfoIcon />
    <p className="text-right">{TIPS[variant]}</p>
  </div>
);
