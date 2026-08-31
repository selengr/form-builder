import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ChangeStatusDialog from './ChangeStatusDialog';
import DestroyTicketDialog from './DestroyTicketDialog';
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

export const RenderAction = ({ publicationApprovalByAdmin, name, setPublicationApprovalByAdmin }: { publicationApprovalByAdmin: boolean; name: string, setPublicationApprovalByAdmin : any }) => {
  const { push } = useRouter();
  const { id } = useParams();
  const [openDestroy, setOpenDestroy] = useState<boolean>(false);
  const [openChangeStatus, setOpenChangeStatus] = useState<boolean>(false);

  const handleFormClick = () => {
    push(`/preview/${id}?rep=list-new`);
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
    <div className="w-full min-h-14 px-2 sm:px-3 md:px-4 py-2 bg-[#F7F7FF] rounded-lg flex justify-between items-center gap-1 sm:gap-2 shadow-sm border border-[#E8E8F5]">
      <div className="flex flex-1 min-w-0 gap-1 sm:gap-2 overflow-x-auto">
        <ActionButton label="فرم" Icon={ChartSquareIcon} onClick={handleFormClick} />
        <ActionButton label="گزارش نتایج" Icon={AdditemIcon} onClick={handleReportResultsClick} />
      </div>
      <div className="flex flex-1 min-w-0 gap-1 sm:gap-2 justify-end overflow-x-auto">
        <ActionButton label="مشاهده وقایع" Icon={ReceiptTextIcon} onClick={handleViewEventsClick} />
        {!publicationApprovalByAdmin && (
          <ActionButton label="غیرفعال" Icon={SlashIcon} onClick={handleSuspendClick} />
        )}
        {publicationApprovalByAdmin && (
          <ActionButton label="فعال" Icon={TicketCircleIcon} onClick={handleSuspendClick} />
        )}
      </div>

      {openDestroy && <DestroyTicketDialog open={openDestroy} setOpen={setOpenDestroy} />}
      <ChangeStatusDialog
        setPublicationApprovalByAdmin={setPublicationApprovalByAdmin}
        open={openChangeStatus}
        setOpen={setOpenChangeStatus}
        publicationApprovalByAdmin={publicationApprovalByAdmin}
      />
    </div>
  );
};
