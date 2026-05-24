export default function CalculatorPageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
  // return (
  //   <div dir='ltr' className='flex w-full flex-grow mx-auto h-full'>
  //     <main className='flex flex-col w-full'>
  //       <div className='flex w-full items-start justify-center relative h-full '>{children}</div>
  //     </main>
  //   </div>
  // );
}
