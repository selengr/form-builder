export default function Layout({ children }: { children: React.ReactNode }) {
    return <div className='w-full h-screen px-4 py-4'>
        <div className='md:container mx-auto flex pb-3 flex-col  min-w-screen h-full justify-start items-center bg-white rounded-xl w-full'>
            {children}
        </div>
    </div>
}
