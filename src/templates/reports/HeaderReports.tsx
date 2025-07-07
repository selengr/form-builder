import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { IconButton } from "@mui/material";

const Header = () => {
  return (
    <div className="relative flex w-full justify-center items-center h-[52px] rounded-lg bg-[#F7F7FF]">
      <Link href={`/reports`} className="absolute right-4">
        <IconButton
          sx={{
            borderRadius: "9999px",
          }}
        >
          <IoIosArrowForward fontSize="1.1rem" color="#000" />
        </IconButton>
      </Link>
      ساخت گزارش
    </div>
  );
};

export default Header;
