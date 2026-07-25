'use client'
import { ConditionalTopAppBar } from './ConditionalHeader';
import MainSidebar from '@/components/MainSidebar/MainSidebar';
import ConditionalFooterTab from '@/components/FooterTab/Footer';

export default function MainPanel({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className='flex w-full h-screen'>
      <div className='hidden md:flex'>
        <MainSidebar />
      </div>

      <div className='flex flex-col w-full overflow-y-auto'>

        <ConditionalTopAppBar />

        <div className='w-full flex flex-col lg:h-auto h-full lg:flex-row overflow-y-auto'>{children}</div>

        <ConditionalFooterTab />

      </div>
    </div>
  );
}
