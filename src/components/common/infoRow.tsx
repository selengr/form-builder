import React, { FC, ReactNode } from 'react';
import clsx from 'clsx';

interface InfoRowProps {
  label: string;
  value: ReactNode;
  bold?: boolean;
  className?: string;
}

export const InfoRow: FC<InfoRowProps> = ({ label, value, bold = false, className }) => {
  return (
    <div className={clsx('flex items-start gap-1 text-[#393939] text-sm rtl:flex-row', className)}>
      <span className='whitespace-nowrap'>{label}:</span>
      <span className={clsx(bold && 'font-bold max-w-[80%]')}>{value}</span>
    </div>
  );
};

export default InfoRow;
