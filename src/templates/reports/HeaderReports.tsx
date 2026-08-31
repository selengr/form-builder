import { IconButton } from '@mui/material';
import { IoIosArrowForward } from 'react-icons/io';
import { useRouter, useSearchParams } from 'next/navigation';
import { REPORT_BACK_KEY } from '../packaging/ListCard';

const Header = () => {
  const { back, push } = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get('rep');
  const admin = search === 'list';
  const name = searchParams.get('name');
  const title = admin ? `گزارش فرم ${name ?? ''}` : ' ساخت گزارش';

  const handleNavigation = () => {
    const returnPath = localStorage.getItem(REPORT_BACK_KEY);

    if (returnPath) {
      localStorage.removeItem(REPORT_BACK_KEY);
      push(returnPath);
    } else {
      back();
    }
  };

  return (
    <div
      className={`relative flex w-full justify-center items-center h-[52px] min-h-[52px] rounded-lg bg-[#F7F7FF] overflow-hidden ${
        admin ? 'mb-8' : ''
      }`}>
      <div onClick={handleNavigation} className="absolute right-2 sm:right-4 z-10 shrink-0">
        <IconButton
          sx={{
            borderRadius: '9999px',
          }}>
          <IoIosArrowForward fontSize="1.1rem" color="#000" />
        </IconButton>
      </div>
      <p
        title={title}
        className="w-full max-w-full px-12 sm:px-14 text-center font-medium truncate text-[14px] sm:text-[16px]">
        {title}
      </p>
    </div>
  );
};

export default Header;
