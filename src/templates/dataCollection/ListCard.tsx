'use client';

import Link from 'next/link';
import Image from 'next/image';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
// components
import { InfoRow } from '@/components/common/infoRow';
import { SwitchButton } from '@/components/Switch/SwitchButton';
// types
import { ISurveyItem } from '@/types/survey';
// images
import CopyIcon from '@/../public/images/home-page/copy.svg';
import EditIcon from '@/../public/images/home-page/edit-2.svg';
import TrashIcon from '@/../public/images/home-page/trash.svg';
import { CodiconEye } from '../../../public/images/home-page/EyeIcon';

interface IListCardProps {
  data: ISurveyItem;
  buttonText: string;
  showStatus?: boolean;
  buttonDisabled?: boolean;
  buttonLink?: string | ((id: string) => string);
}

interface IExpireDate {
  day: string;
  year: string;
  month: string;
}

export interface ITakeParts {
  formName: string;
  takePartId: number;
  expireDate: IExpireDate;
}


const ListCard: React.FC<IListCardProps> = ({
  data,
  buttonText,
  buttonLink,
  showStatus = true,
  buttonDisabled = false,
}) => {
  const router = useRouter();

  const handleNavigation = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("stats", "/data-collection");
      } catch { }
    }
    router.push(`/data-collection/${data.id}?name=${data.name}`);
  };

  const handlePreview = () => {
    router.push(`/preview/${data.id}?rep=list`);
  };

  const statusMap: Record<string, string> = {
    CREATE: "فعال",
    FINAL: "نهایی",
  };

  return (
    <div className="border p-4 rounded-2xl border-[#DDE1E6] flex flex-col gap-3 w-full max-w-full relative">

      {/* اطلاعات فرم */}
      <InfoRow label="نام" value={data.name} bold />
      {/* <SwitchButton
        sx={{ position: "absolute", top: 15, right: 15 }}
        checked={!data.showReportForResponder}
        onChange={() => console.log("object")}
      /> */}
      <InfoRow
        label="سرویس‌گیرنده"
        value={data?.surveyTargetPlatformEnum}
        bold
      />
      {showStatus && (
        <InfoRow
          label="وضعیت"
          value={statusMap[data?.status]}
          bold
        />
      )}

      <div className='flex flex-wrap gap-2 w-full justify-between'>
        <button
          className="bg-[#1758BA] hover:bg-[#216ee1] transition-all duration-200 px-12 h-[42px] text-sm rounded-lg text-white"
          onClick={handlePreview}
        >
          مشاهده
        </button>
        <ActionButtons
          id={data.id}
          onViewList={handleNavigation}
        />
      </div>
    </div>
  );
};

export default ListCard;

// -----------------------------------------------------------------
type TActionButtonsProps = {
  id: number;
  onViewList: () => void
};

const ActionButtons: React.FC<TActionButtonsProps> = ({
  id,
  onViewList
}) => {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-end">

      {/* <IconButton color="error">
        <Image src={TrashIcon} alt="delete" width={24} height={24} />
      </IconButton> */}

      {/* <IconButton>
        <Image src={CopyIcon} alt="copy" width={24} height={24} />
      </IconButton> */}

      <Link href={`/builder/${id}?admin=data-collection`}>
        <IconButton color="primary">
          <Image src={EditIcon} alt="edit" width={24} height={24} />
        </IconButton>
      </Link>

      <IconButton color="primary" onClick={onViewList}>
        <CodiconEye />
      </IconButton>
    </div>
  );
};