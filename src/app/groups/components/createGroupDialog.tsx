import { z } from 'zod';
import { toast } from 'sonner';
import React, { useState } from 'react';
// uploader
import UploaderPage from './uploader';
// utils
import { getAuthToken } from '@/utils/getAuthToken';

interface CreateGroupDialogProps {
  onClose: () => void;
  onSubmit: (groupName: string) => void;
}

const groupSchema = z.object({
  groupName: z.string().min(2, { message: 'نام گروه باید حداقل ۲ کاراکتر باشد.' }).trim(),
});

export function CreateGroupDialog({ onClose, onSubmit }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [receivedFileId, setReceivedFileId] = useState<string | null>(null);

  const handleReceivedFileId = (fileId: string) => {
    setReceivedFileId(fileId);
  };

  const handleSubmit = async () => {
    setError(null);

    const result = groupSchema.safeParse({ groupName });
    if (!result.success) {
      setError(result.error.errors[0]?.message || 'خطا در نام گروه');
      return;
    }

    if (!receivedFileId) {
      setError('لطفاً یک فایل بارگذاری کنید.');
      return;
    }

    setLoading(true);
    const token = await getAuthToken();

    try {
      const res = await fetch('/api/group/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uuid: receivedFileId,
          groupName,
          groupId: '',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        let errorMessage = 'خطا در ثبت گروه.';

        if (Array.isArray(data?.error) && data.error[0]?.title) {
          errorMessage = data.error[0].title;
        } else if (typeof data?.error === 'string') {
          errorMessage = data.error;
        }
        throw new Error(errorMessage);
      }

      onSubmit(groupName);
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'خطایی رخ داده است.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl p-6 w-full max-w-md flex flex-col gap-4'>
        <h2 className='text-sm md:text-lg font-bold text-[#2a2a2a] text-center'>ایجاد گروه جدید</h2>

        <div className='flex flex-col gap-2'>
          <label htmlFor='group-name' className='text-sm font-medium text-gray-700'>
            نام گروه:
          </label>
          <input
            id='group-name'
            type='text'
            className={`text-xs md:text-sm w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-[#1758BA]'}`}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder='مثال: گروه کارکنان'
          />
        </div>

        <div className='text-xs md:text-sm bg-gray-100 rounded-lg max-h-[150px] flex items-center justify-center text-gray-500 border border-dashed border-gray-300'>
          <UploaderPage onFileUploadSuccess={handleReceivedFileId} />
        </div>

        <DownloadSampleButton />

        {error && <p className='text-red-600 text-sm text-center mt-2'>{error}</p>}

        <div className='flex justify-center gap-3 mt-1 w-2/3 mx-auto'>
          <button onClick={handleSubmit} disabled={loading} className='px-5 py-1 md:py-3 w-full bg-[#1758BA] text-white rounded-lg hover:bg-[#216ee1] transition disabled:opacity-50'>
            {loading ? 'در حال ارسال...' : 'ثبت'}
          </button>
          <button onClick={onClose} className='px-5 py-1 md:py-3 border w-full border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition'>
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
export function DownloadSampleButton() {

  const downloadSampleFile = () => {
    const link = document.createElement("a");
    link.href = "/sample.xlsx";
    link.download = "نمونه-فایل.xlsx";
    link.click();
  };

  return (
    <div className='bg rounded-lg max-h-[150px] flex flex-col items-center justify-center text-gray-600 border border-dashed border-gray-300 p-4'>

      <p className="text-xs md:text-sm text-gray-500 mb-2">
        این یک فایل نمونه ایجاد گروه است. لطفاً آن را دانلود کرده و مطابق فرمت آن فایل خود را تکمیل و بارگذاری کنید.
      </p>
      <button
        onClick={downloadSampleFile}
        className="text-xs md:text-sm py-1 px-4 sm:py-2 bg-[#1758BA] text-white rounded-lg flex items-center gap-2 hover:bg-[#216ee1] transition shadow-sm hover:shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
          />
        </svg>
        دانلود فایل نمونه
      </button>
    </div>
  );
}
