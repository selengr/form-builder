import {LuUserRoundPlus} from "react-icons/lu";
import {MdKeyboardArrowLeft, MdKeyboardArrowRight} from "react-icons/md";

interface StatsPaginationProps {
  totalItems: number;
}

export function ReportPagination({totalItems}: StatsPaginationProps) {
  return (
    <div className="bg-[#F7F7FF] w-full flex flex-wrap justify-between items-center px-4 py-2 mt-4 gap-2 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-sm">سطر قابل نمایش در هر صفحه:</span>
        <select className="bg-white rounded-md h-9 px-2 text-sm border border-gray-300 font-iran-sans">
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value="all">همه</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <button className="bg-white border border-blue-700 rounded-full p-1">
          <MdKeyboardArrowRight className="text-blue-700 text-xl"/>
        </button>
        <span className="text-sm">صفحه 1 از 1</span>
        <button className="bg-white border border-blue-700 rounded-full p-1">
          <MdKeyboardArrowLeft className="text-blue-700 text-xl"/>
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">{totalItems} نفر در لیست</span>
        <div className="bg-blue-700 p-2 rounded-lg">
          <LuUserRoundPlus className="text-white text-xl"/>
        </div>
      </div>
    </div>
  );
}

export default ReportPagination;
