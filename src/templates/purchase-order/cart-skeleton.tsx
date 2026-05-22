export const ShoppingCartSkeleton = () => {
  return (
    <div className="w-full px-2 py-4 lg:p-4 flex flex-col lg:flex-row gap-4 h-[calc(100vh-60px)] lg:h-screen animate-pulse">
      <div className="w-full flex-grow bg-white rounded-2xl p-4 shadow-sm h-2/3 lg:h-full">
        <div className="bg-gray-100 rounded-lg h-12 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 rounded-2xl bg-gray-100" />
              <div className="flex-grow flex flex-col gap-2">
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gray-100" />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-[450px] bg-white rounded-2xl p-4 shadow-sm h-auto lg:h-full">
        <div className="bg-gray-100 rounded-lg h-12 mb-4" />
        <div className="bg-gray-50 rounded-2xl h-40 p-4" />
        <div className="mt-4 h-12 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
};
