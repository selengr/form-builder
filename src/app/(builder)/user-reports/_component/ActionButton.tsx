import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
// components
import ChangeStatusDialog from "./ChangeStatusDialog";
import DestroyTicketDialog from "./DestroyTicketDialog";
// icons
import { SlashIcon, AdditemIcon, ChartSquareIcon, ReceiptTextIcon, TicketCircleIcon } from "../../../../../public/images/icons";

interface IProps {
    label: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    onClick: () => void;
}

const   ActionButton = ({ label, Icon, onClick }: IProps) => (
    <button
        onClick={onClick}
        className="flex justify-center items-center h-8 rounded-lg bg-white text-[13px] font-medium px-2 cursor-pointer hover:bg-gray-100 transition-colors"
    >
        <span className="ml-2">{label}</span>
        <Icon />
    </button>
);


export const RenderAction = ({ publicationApprovalByAdmin }: {  publicationApprovalByAdmin: boolean }) => {
    const { push } = useRouter()
    const { id } = useParams();
    const [openDestroy, setOpenDestroy] = useState<boolean>(false);
    const [openChangeStatus, setOpenChangeStatus] = useState<boolean>(false);

    const handleFormClick = () => {
        push(`/preview/${id}`);
    };

    const handleReportResultsClick = () => {
        push(`/reports/create-solo/${id}?rep=list`);
    };

    const handleViewEventsClick = () => {
        setOpenDestroy(true);
    };

    const handleSuspendClick = () => {
        setOpenChangeStatus(true)
    };

    return (
        <div className="w-[calc(100%-22px)]  h-14 absolute bottom-2 px-4 py-4 bg-[#F7F7FF] rounded-lg flex justify-between items-center">
            <div className="flex w-full gap-3">
                <ActionButton
                    label="فرم"
                    Icon={ChartSquareIcon}
                    onClick={handleFormClick}
                />
                <ActionButton
                    label="گزارش نتایج"
                    Icon={AdditemIcon}
                    onClick={handleReportResultsClick}
                />
            </div>
            <div className="flex w-full gap-3 justify-end">
                <ActionButton
                    label="مشاهده وقایع"
                    Icon={ReceiptTextIcon}
                    onClick={handleViewEventsClick}
                />
                {!publicationApprovalByAdmin &&
                    <ActionButton
                        label="معلق کردن"
                        Icon={SlashIcon}
                        onClick={handleSuspendClick}
                    />
                }
                {publicationApprovalByAdmin &&
                    <ActionButton
                        label="عدم تعلیق"
                        Icon={TicketCircleIcon}
                        onClick={handleSuspendClick}
                    />
                }
            </div>

            {openDestroy && <DestroyTicketDialog open={openDestroy} setOpen={setOpenDestroy} />}
            <ChangeStatusDialog open={openChangeStatus} setOpen={setOpenChangeStatus} publicationApprovalByAdmin={publicationApprovalByAdmin} />
        </div>
    );
}

