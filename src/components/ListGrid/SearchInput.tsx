'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import SearchIcon from '@/../public/images/home-page/search.svg';

export default function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const searchQuery = searchParams.get('query') || '';
  const [value, setValue] = useState(searchQuery);

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set('query', value);
    } else {
      params.delete('query');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div className='flex items-center w-full border border-[#DDE1E6] rounded-2xl px-3 py-1 gap-2 bg-white'>
      <input
        type='text'
        className='flex-1 bg-transparent focus:outline-none text-right placeholder:text-gray-400 text-sm'
        placeholder='کاوش'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleClick} type='button' className='p-2.5 hover:bg-neutral-100 rounded-full transition' aria-label='کاوش'>
        <Image src={SearchIcon} alt='search' draggable={false} priority />
      </button>
    </div>
  );
}
