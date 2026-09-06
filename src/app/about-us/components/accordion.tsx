'use client';

import React, { useRef, useState } from 'react';

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

interface AccordionItemInternalProps {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItemInternal: React.FC<AccordionItemInternalProps> = ({ item, isOpen, onToggle }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div key={item.id} className='rounded-xl overflow-hidden shadow-xl shadow-gray-400/10 bg-white '>
      <button onClick={onToggle} className='w-full flex justify-between items-center px-4 py-6 transition text-right'>
        <span className='font-semibold text-gray-800 md:text-md xs:text-sm'>{item.title}</span>
        <svg className={`w-4 h-4 transform transition-transform duration-500 ${isOpen ? 'rotate-90' : ''}`} fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
        </svg>
      </button>

      <div
        ref={contentRef}
        style={{
          height: isOpen ? `${contentRef.current?.scrollHeight ?? 0}px` : '0px',
        }}
        className='transition-all duration-700 ease-in-out overflow-hidden bg-white px-4'>
        <div className='py-3 text-gray-800 xs:text-sm md:text-md'>{item.content}</div>
      </div>
    </div>
  );
};
// ----------------------------------------

export interface CustomAccordionGroupProps {
  items: AccordionItem[];
  defaultExpandedId?: string;
}

const CustomAccordionGroup: React.FC<CustomAccordionGroupProps> = ({ items, defaultExpandedId }) => {
  const [openId, setOpenId] = useState<string | null>(defaultExpandedId || null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className='w-full xs:min-w-[80vw] xs:max-w-[90vw] md:min-w-[40vw] md:max-w-[50vw] lg:min-w-[30vw] lg:max-w-[40vw] mx-auto space-y-4'>
      {items.map((item) => (
        <AccordionItemInternal
          key={item.id}
          item={item}
          isOpen={openId === item.id}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </div>
  );
};

export default CustomAccordionGroup;