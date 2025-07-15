import { Tooltip } from "@mui/material";

interface TableCellProps {
    content: string | number;
    isFirst: boolean;
    isLast: boolean;
    rowIndex: number;
}

export const TableCell: React.FC<TableCellProps> = ({ content, isFirst, isLast, rowIndex }) => {
    return (
        <td
            className={`
                text-center px-3 py-2 font-semibold text-sm w-[200px]
                ${rowIndex === 0 ? 'border-l-0 border-r-0' : 'border-x-[0.5px]'}
                ${isLast ? 'border-r-0' : ''}
                border-slate-300
            `}
        >
            <Tooltip
                title={tooltipTitle}
                followCursor
                arrow
                enterDelay={600}
                leaveDelay={100}
                placement="top"
            >
                <div
                    className="overflow-hidden text-ellipsis line-clamp-3"
                    style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 3 }}
                >
                    {content}
                </div>
            </Tooltip>
        </td>
    );
};