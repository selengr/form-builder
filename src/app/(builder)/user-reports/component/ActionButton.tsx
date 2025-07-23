
interface IProps {
    label: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    onClick: () => void;
}

const ActionButton = ({ label, Icon, onClick }: IProps) => (
    <button
        onClick={onClick}
        className="flex justify-center items-center h-8 rounded-lg bg-white text-[13px] font-medium px-2 cursor-pointer hover:bg-gray-100 transition-colors"
    >
        <span className="ml-2">{label}</span>
        <Icon />
    </button>
);
