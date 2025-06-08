const MenuItemSkeleton = () => {
  return (
    <>
      {[...Array(2)].map((_, index) => (
        <div key={index} className="flex items-center gap-3 animate-pulse w-full">
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          <div className="h-4 w-[80%] bg-gray-300 rounded"></div>
        </div>
      ))}
      <div className="h-2"></div>
    </>
  );
};

export default MenuItemSkeleton;
