const ConditionSkeleton = () => {
  return (
    <div className='animate-pulse mt-[4rem] w-full max-w-[520px] flex flex-col p-0 md:p-[13px] overflow-hidden'>
      <div dir='rtl' className='bg-[#F7F7FF] rounded-lg p-0 md:p-[10px] w-full flex flex-col gap-1 mb-10 overflow-y-auto'>
        {[...Array(3)].map((_, index) => (
          <div key={index} className={`bg-[#F7F7FF] rounded-lg flex mb-2`}>
            <div className='flex flex-col justify-start items-center gap-[10px] pl-[10px]'>
              <div className='bg-white h-8 w-8 rounded-[10px] flex justify-center items-center'>
                <div className='bg-gray-300 h-4 w-4 rounded-full'></div>
              </div>
              <div className='bg-white h-8 w-8 rounded-[10px] flex justify-center items-center'>
                <div className='bg-gray-300 h-4 w-4 rounded-full'></div>
              </div>
            </div>
            <div className='rounded-lg p-[10px] flex justify-between w-full cursor-pointer border-[1px] border-[#1758BA] bg-[#fff]'>
              <div className='flex flex-col justify-center items-center gap-[10px]'>
                <div className='bg-gray-300 h-4 w-32 md:w-44 rounded'></div>
                <div className='bg-gray-300 h-4 w-32 md:w-44 rounded'></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConditionSkeleton;
