import { ReactNode } from 'react';

type PillVariant = 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'greenAction';

const pillStyles: Record<PillVariant, string> = {
  blue: 'bg-[#EFF4FE] text-[#245CD2]',
  green: 'bg-[#E6FAF9] text-[#1AA5A0]',
  purple: 'bg-[#F8E8F4] text-[#BA1797]',
  red: 'bg-[#FFEBEE] text-[#FA4D56]',
  orange: 'bg-[#FFFBEB] text-[#D98213]',
  greenAction: 'bg-[#E8F5E9] text-[#2E7D32]',
};

export function ConditionLogicPill({
  children,
  variant,
}: {
  children: ReactNode;
  variant: PillVariant;
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[13px] font-semibold leading-snug ${pillStyles[variant]}`}
    >
      {children}
    </span>
  );
}

