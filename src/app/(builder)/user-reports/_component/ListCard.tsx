import { useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { IconButton } from '@mui/material';
import { TReporterInformationItem } from './type';
// style
import { StyledDialog, StyledDialogContent } from './userReports.style';
interface IProps {
  data: TReporterInformationItem;
}

const ListCard = ({ data }: IProps) => {
  const { username, responseModel, typeOfReportModel, description, createDate, resultReportText } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);

 return (
    <div className='rounded-lg flex flex-col transition-all bg-[#F7F7FF] p-4 pb-8 relative max-w-[450px]'>
      <div className='rounded-lg p-2 flex justify-between w-full border border-[#1758BA] bg-white'>
        <div className='flex flex-col gap-2 p-1 max-w-[350px]'>
          <div className='flex gap-2'>
            <span className='text-[#161616] text-sm'>گزارش دهنده:</span>
            <span className='text-[#1758BA] text-sm'>{username}</span>
          </div>
          <div className='flex gap-2'>
            <span className='text-[#161616] text-sm'>مورد گزارش:</span>
            <span className='text-[#1758BA] text-sm break-all'>{responseModel?.key}</span>
          </div>
          <div className='flex gap-2'>
            <span className='text-[#161616] text-sm'>نوع گزارش:</span>
            <span className='text-[#1758BA] text-sm break-all'>{typeOfReportModel?.key}</span>
          </div>
          <div className='flex gap-2'>
            <span className='text-[#161616] whitespace-nowrap text-sm'>دلیل گزارش:</span>
            <span className='text-[#1758BA] text-sm break-all'>{description}</span>
          </div>
          {typeOfReportModel.value === "RESULT_REPORT" && (
            <div className='flex gap-2 cursor-pointer relative w-full' onClick={() => setIsModalOpen(true)}>
              <span className='text-[#161616] whitespace-nowrap text-sm'>متن گزارش:</span>
              <span className='text-[#1758BA] text-sm break-all line-clamp-1 w-[67%]'>{resultReportText}</span>
              <div className='absolute bottom-0 left-0 bg-[#1758BA] text-white flex justify-center items-center h-[25px] w-[30px] rounded-md'>...</div>
            </div>
          )}
        </div>
      </div>
      <span className='text-[#1758BA] text-sm absolute left-4 bottom-1'>{createDate.split(' ')[0]}</span>
      {isModalOpen && (
             <StyledDialog open={isModalOpen} maxWidth='sm'>
               <StyledDialogContent>
                 <div className='flex items-center justify-end h-6 -ml-2'>
                          <IconButton edge='end'>
                            <CgClose color='#404040' width={25} height={20} size='1.5rem' onClick={() =>  setIsModalOpen(false)} />
                          </IconButton>
                        </div>
                         <div className='rounded-lg flex flex-col transition-all bg-[#F7F7FF] p-4 pb-8 w-full'>
      <div className='rounded-lg p-2 flex justify-between w-full border border-[#1758BA] bg-white'>
       
              {resultReportText}
              </div></div>
               </StyledDialogContent>
             </StyledDialog>
      )}
    </div>
  );
};

export default ListCard;
