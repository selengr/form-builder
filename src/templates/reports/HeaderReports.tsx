import {IconButton} from "@mui/material";
import {IoIosArrowForward} from "react-icons/io";
import { useRouter, useSearchParams } from "next/navigation";

const Header = () => {
  const { back } = useRouter()
    const searchParams = useSearchParams()
  const search = searchParams.get('rep')
  const admin = search === "list"
  const name = searchParams.get('name')
  
  return (
    <div className="relative flex w-full justify-center items-center h-[52px] rounded-lg bg-[#F7F7FF]">
      <div onClick={()=> back()} className="absolute right-4">
        <IconButton
          sx={{
            borderRadius: "9999px",
          }}
        >
          <IoIosArrowForward fontSize="1.1rem" color="#000" />
        </IconButton>
      </div>
        {admin ? `گزارش فرم ${name}` : " ساخت گزارش"}
    </div>
  );
};

export default Header;
