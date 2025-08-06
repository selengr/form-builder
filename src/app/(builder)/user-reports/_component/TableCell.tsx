interface TableCellProps {
  content: string | number;
  rowIndex: number;
}

export const TableCell: React.FC<TableCellProps> = ({ content, rowIndex }) => {
  return (
    <td
      className={`
                text-center px-3 py-2 font-semibold text-sm w-[200px]
                ${rowIndex + 1 === 0 ? 'border-l-0 border-r-0' : 'border-x-[0.5px]'}
                border-slate-300
            `}>
      <div className='overflow-hidden text-ellipsis line-clamp-3' style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 }}>
        {content}
      </div>
    </td>
  );
};
