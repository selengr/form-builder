import Image from 'next/image';
import clsx from 'clsx';

interface SidebarBtnLogicProps {
  title: string;
  icon: string;
  onClick?: () => void;
  active?: boolean;
}

export default function SidebarBtnLogic({
  title,
  icon,
  onClick,
  active = false,
}: SidebarBtnLogicProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-3 h-[52px] rounded-xl px-2 flex-row-reverse',
        'bg-[#F7F7FF] border shadow-sm transition-colors',
        active
          ? 'border-[#1758BA]'
          : 'border-[#F7F7FF] hover:border-[#2CDFC9]'
      )}
    >
      <span className="bg-white rounded-[10px] h-9 w-9 flex justify-center items-center shrink-0">
        <Image src={icon} width={22} height={22} alt="" />
      </span>

      <p className="flex-1 text-right pr-1 text-[#161616] text-sm">
        {title}
      </p>
    </button>
  );
}