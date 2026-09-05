'use client';

import { useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { IconButton } from '@mui/material';
import { UnifiedListGridCardProps } from '@/components/unified-list-grid';
import HtmlPreview from '@/components/HtmlPreview/HtmlPreview';
import { StyledDialog, StyledDialogContent } from './userReports.style';
import { TReporterInformationItem } from './type';

export default function ListCard({
  data,
}: UnifiedListGridCardProps<TReporterInformationItem>) {
  const {
    username,
    responseModel,
    typeOfReportModel,
    description,
    createDate,
    resultReportText,
  } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="rounded-lg flex flex-col transition-all bg-[#F7F7FF] p-4 pb-8 relative max-w-[450px] w-full">
      <div className="rounded-lg p-2 flex justify-between w-full border border-[#1758BA] bg-white">
        <div className="flex flex-col gap-2 p-1 max-w-[350px]">
          <div className="flex gap-2">
            <span className="text-[#161616] text-sm">گزارش دهنده:</span>
            <span className="text-[#1758BA] text-sm">{username}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[#161616] text-sm">مورد گزارش:</span>
            <span className="text-[#1758BA] text-sm break-all">{responseModel?.key}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[#161616] text-sm">نوع گزارش:</span>
            <span className="text-[#1758BA] text-sm break-all">{typeOfReportModel?.key}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[#161616] whitespace-nowrap text-sm">دلیل گزارش:</span>
            <span className="text-[#1758BA] text-sm break-all">{description}</span>
          </div>
          {typeOfReportModel.value === 'RESULT_REPORT' && (
            <div
              className="flex gap-2 cursor-pointer relative w-full"
              onClick={() => setIsModalOpen(true)}>
              <span className="text-[#161616] whitespace-nowrap text-sm">متن گزارش:</span>
              <span className="text-[#1758BA] text-sm break-all line-clamp-1 w-[67%]">
                <HtmlPreview html={resultReportText as any} />
              </span>
              <div className="absolute bottom-0 left-0 bg-[#1758BA] text-white flex justify-center items-center h-[25px] w-[30px] rounded-md">
                ...
              </div>
            </div>
          )}
        </div>
      </div>
      <span className="text-[#1758BA] text-sm absolute left-4 bottom-1">
        {createDate?.split(' ')[0]}
      </span>
      {isModalOpen && (
        <StyledDialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="sm">
          <StyledDialogContent>
            <div className="relative mb-4 flex min-h-8 items-center justify-center">
              <IconButton
                onClick={() => setIsModalOpen(false)}
                aria-label="بستن"
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  p: 0.5,
                }}>
                <CgClose color="#404040" size="1.4rem" />
              </IconButton>
            </div>
            <div className="flex w-full flex-col rounded-lg bg-[#F7F7FF] p-3 pb-6 transition-all sm:p-4 sm:pb-8">
              <div className="flex w-full justify-between rounded-lg border border-[#1758BA] bg-white p-2">
                <div className="flex w-full flex-col items-center overflow-y-auto p-4 sm:p-8">
                  <HtmlPreview html={resultReportText as any} />
                </div>
              </div>
            </div>
          </StyledDialogContent>
        </StyledDialog>
      )}
    </div>
  );
}
