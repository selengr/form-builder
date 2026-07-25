export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-full p-4 flex justify-center flex-col items-center'>
      {children}
    </div>
  );
}