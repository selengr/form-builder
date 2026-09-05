import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
// components
import ChangeStatusDialog from './ChangeStatusDialog';
import DestroyTicketDialog from './DestroyTicketDialog';
// icons
import { AdditemIcon, ChartSquareIcon, ReceiptTextIcon, SlashIcon, TicketCircleIcon } from '@/../public/images/icons';

interface IProps {
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick: () => void;
}

const ActionButton = ({ label, Icon, onClick }: IProps) => (
  <button
    onClick={onClick}
    className="flex justify-center items-center h-8 rounded-lg bg-white text-[10px] md:text-[13px] md:font-medium px-1.5 md:px-2 cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap shrink-0">
    <span className="ml-1 md:ml-2">{label}</span>
    <Icon />
  </button>
);

export const RenderAction = ({
  publicationApprovalByAdmin,
  name,
  setPublicationApprovalByAdmin,
}: {
  publicationApprovalByAdmin: boolean;
  name: string;
  setPublicationApprovalByAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { push } = useRouter();
  const { id } = useParams();
  const [openDestroy, setOpenDestroy] = useState(false);
  const [openChangeStatus, setOpenChangeStatus] = useState(false);

  const handleFormClick = () => {
    push(`/preview/${id}?rep=list`);
  };

  const handleReportResultsClick = () => {
    push(`/reports/create-solo/${id}?rep=list&name=${name}`);
  };

  const handleViewEventsClick = () => {
    setOpenDestroy(true);
  };

  const handleSuspendClick = () => {
    setOpenChangeStatus(true);
  };

  return (
    <div className="flex w-full min-h-14 items-center justify-between gap-1 rounded-lg border border-[#E8E8F5] bg-[#F7F7FF] px-2 py-2 shadow-sm sm:gap-2 sm:px-3 md:px-4">
      <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden">
        <ActionButton label="فرم" Icon={ChartSquareIcon} onClick={handleFormClick} />
        <ActionButton label="گزارش نتایج" Icon={AdditemIcon} onClick={handleReportResultsClick} />
      </div>
      <div className="flex min-w-0 flex-1 justify-end gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden">
        <ActionButton label="مشاهده وقایع" Icon={ReceiptTextIcon} onClick={handleViewEventsClick} />
        {!publicationApprovalByAdmin && (
          <ActionButton label="غیرفعال" Icon={SlashIcon} onClick={handleSuspendClick} />
        )}
        {publicationApprovalByAdmin && (
          <ActionButton label="فعال" Icon={TicketCircleIcon} onClick={handleSuspendClick} />
        )}
      </div>

      <DestroyTicketDialog open={openDestroy} setOpen={setOpenDestroy} />
      <ChangeStatusDialog
        setPublicationApprovalByAdmin={setPublicationApprovalByAdmin}
        open={openChangeStatus}
        setOpen={setOpenChangeStatus}
        publicationApprovalByAdmin={publicationApprovalByAdmin}
      />
    </div>
  );
};
