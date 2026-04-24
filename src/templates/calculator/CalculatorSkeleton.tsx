interface Props {
  count?: number;
}

const CalculatorSkeleton: React.FC<Props> = ({ count = 3 }) => {
  return (
    <div className="animate-pulse mt-[4rem] w-full max-w-[520px] flex flex-col p-[13px] overflow-hidden">
      <div dir="rtl" className="bg-[#F7F7FF] rounded-lg p-[10px] w-full flex flex-col gap-2 mb-10 overflow-y-auto">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 h-14 flex justify-between items-center w-full border border-[#1758BA]"
          >
            <div className="flex items-center gap-2.5">
              <div className="bg-[#F7F7FF] h-8 w-8 rounded-[10px] flex items-center justify-center">
                <div className="bg-gray-300 h-4 w-4 rounded-full" />
              </div>

              <div className="flex flex-col gap-2">
                <div className="bg-gray-300 h-3 w-20 md:w-32 rounded" />
                <div className="bg-gray-300 h-2 w-12 md:w-20 rounded" />
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="bg-[#F7F7FF] h-8 w-8 rounded-[10px] flex items-center justify-center"
                >
                  <div className="bg-gray-300 h-4 w-4 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalculatorSkeleton;
