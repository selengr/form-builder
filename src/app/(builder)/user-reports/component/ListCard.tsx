import { TReporterInformationItem } from "./type";

interface IProps {
    data: TReporterInformationItem;
}

const ListCard = ({ data }: IProps) => {
    const { username, responseModel, typeOfReportModel, description } = data;

    return (
        <div className="rounded-lg flex flex-col transition-all bg-[#F7F7FF] p-4 pb-8 relative max-w-[450px]">
            <div className="rounded-lg p-2 flex justify-between w-full border border-[#1758BA] bg-white">
                <div className="flex flex-col gap-2 p-1">
                    <div className="flex gap-2">
                        <span className="text-[#161616] text-sm">گزارش دهنده:</span>
                        <span className="text-[#1758BA] text-sm">{username}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-[#161616] text-sm">مورد گزارش:</span>
                        <span className="text-[#1758BA] text-sm">{responseModel?.value}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-[#161616] text-sm">نوع گزارش:</span>
                        <span className="text-[#1758BA] text-sm">{typeOfReportModel?.value}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-[#161616] whitespace-nowrap text-sm">دلیل گزارش:</span>
                        <span className="text-[#1758BA] text-sm">{description}</span>
                    </div>
                </div>
            </div>
            <span className="text-[#1758BA] text-sm absolute left-4 bottom-1">۱۴۰۳/۱۲/۲۳</span>
        </div>
    );
};

export default ListCard;
