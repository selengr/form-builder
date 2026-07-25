'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import SearchIcon from '@/../public/images/home-page/search.svg';

interface ImmediateSearchInputProps {
  onSearch: (query: string) => void;
}

export default function ImmediateSearchInput({ onSearch }: ImmediateSearchInputProps) {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 500); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className='flex items-center w-full border border-[#DDE1E6] rounded-2xl px-3 py-1 gap-2 bg-white'>
      <input
        type='text'
        className='flex-1 bg-transparent focus:outline-none text-right placeholder:text-gray-400 text-sm'
        placeholder='کاوش'
        value={value}
        onChange={handleChange}
      />
      <div className='p-2.5 hover:bg-neutral-100 rounded-full transition' aria-label='کاوش'>
        <Image src={SearchIcon} alt='search' draggable={false} priority />
      </div>
    </div>
  );
}
