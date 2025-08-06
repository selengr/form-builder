const MenuItemSkeleton = () => {
  return (
    <>
      {[...Array(1)].map((_, index) => (
        <div key={index} className='flex items-center gap-3 animate-pulse w-full my-3'>
          <div className='h-6 w-6 bg-gray-200 rounded-full'></div>
          <div className='h-5 w-[80%] bg-gray-200 rounded'></div>
        </div>
      ))}
      <div className='h-2'></div>
    </>
  );
};

export default MenuItemSkeleton;
