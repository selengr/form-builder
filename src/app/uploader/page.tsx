'use client';

import { useState } from 'react';
import { UppyUploader } from '@/components/uploader/UppyUploader';

export default function UploaderPage() {
  const [data, setData] = useState<any>(null);

  return (
    <div className='min-h-screen w-full bg-gray-100 flex items-center justify-center p-4 sm:p-6 font-sans'>
      <div className='bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md border border-gray-200'>
        <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6 text-center'>بارگذاری فایل</h1>

        <div className='mb-6'>
          <UppyUploader
            sx={{}}
            getData={(uploadedData: any) => {
              setData(uploadedData);
            }}
            fileRestriction={{
              minFileSize: undefined,
              maxFileSize: undefined,
              minNumberOfFiles: 1,
              maxNumberOfFiles: 1,
              maxTotalFileSize: undefined,
              allowedFileTypes: ['.xls', '.xlsx'],
            }}
          />
        </div>

        {!!data && (
          <div className='mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex flex-col gap-3'>
            <p className='text-green-700 font-semibold text-lg'>فایل با موفقیت بارگذاری شد!</p>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2'>
              <p className='text-gray-700 font-medium text-base'>لینک فایل:</p>
              <div className='flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-md p-2 overflow-hidden'>
                <p
                  style={{
                    wordBreak: 'break-all',
                    whiteSpace: 'pre-wrap',
                  }}
                  className='text-blue-600 font-bold text-sm flex-1 break-all'>
                  {`${process.env.NEXT_PUBLIC_BASE_URL}/filemanager/${data}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
