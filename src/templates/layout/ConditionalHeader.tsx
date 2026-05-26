'use client';
import { usePathname } from 'next/navigation';
import TopAppBar from '@/components/TopAppBar/TopAppBar';

export function ConditionalTopAppBar() {
    const path = usePathname();
    if (path !== '/') return null;
    return (
        <div className='md:hidden block mt-[60px]'>
            <TopAppBar />
        </div>
    );
}
