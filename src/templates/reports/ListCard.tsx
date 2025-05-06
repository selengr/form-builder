'use client';

import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';

const formTypePersian: Record<string, string> = {
  TEST: 'آزمون',
  QUESTION: 'پرسشنامه',
  SURVEY: 'نظرسنجی',
  COMPETITION: 'مسابقه',
};

export default function ListCard(props: any) {
  const router = useRouter();

  const handleViewResults = () => {
    router.push(`/stats/${props.data.id}`);
  };

  const handleCreateReport = () => {
    router.push(`/reports/create-solo/${props.data.id}`);
  };

  return (
    <div className="flex flex-col gap-3 rounded-[20px] border border-[#DDE1E6] p-4">
      <div className="flex gap-1 text-[#393939]">
        <span className="text-sm">نام:</span>
        <p className="text-sm font-bold break-words whitespace-pre-wrap">
          {props.data.name}
        </p>
      </div>

      <div className="flex gap-1 text-[#393939]">
        <span className="text-sm">نوع:</span>
        <p className="text-sm font-bold">
          {formTypePersian[props.data.type]}
        </p>
      </div>

      <div className="flex gap-1 text-[#393939]">
        <span className="text-sm">دسترسی:</span>
        <p className="text-sm font-bold">
          {props.data.accessType || 'عمومی'}
        </p>
      </div>

      <div className="flex gap-1 text-[#393939]">
        <span className="text-sm">وضعیت:</span>
        <p className="text-sm font-bold">انجام نشده</p>
      </div>

      <div className="flex w-full flex-row gap-2">
        <Button
          variant="contained"
          size={"large"}
          disableElevation
          fullWidth
          onClick={handleViewResults}
          sx={{
            backgroundColor: '#1758BA',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#216ee1',
            },
          }}
        >
          مشاهده نتایج
        </Button>

        <Button
          variant="contained"
          size={"large"}
          disableElevation
          fullWidth
          onClick={handleCreateReport}
          sx={{
            backgroundColor: '#2CDFC9',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#2CDFC9',
              opacity: 0.9,
            },
          }}
        >
          ساخت گزارش
        </Button>
      </div>
    </div>
  );
}
