import React, { useState } from 'react';
import UploaderPage from './uploader';
import { getAuthToken } from '@/utils/getAuthToken';
import { z } from 'zod';
import { toast } from 'sonner';

interface CreateGroupDialogProps {
  onClose: () => void;
  onSubmit: (groupName: string) => void;
}

const groupSchema = z.object({
  groupName: z.string().min(2, { message: 'نام گروه باید حداقل ۲ کاراکتر باشد.' }).trim(),
});

export function CreateGroupDialog({ onClose, onSubmit }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState<string>('');
  const [receivedFileId, setReceivedFileId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
        <h2 className='text-xl font-bold text-[#2a2a2a] text-center'>ایجاد گروه جدید</h2>

        <div className='flex flex-col gap-2'>
          <label htmlFor='group-name' className='text-sm font-medium text-gray-700'>
            نام گروه:
          </label>
          <input
            id='group-name'
            type='text'
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-[#1758BA]'}`}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder='مثال: گروه کارکنان'
          />
        </div>

        <div className='bg-gray-100 p-4 rounded-lg min-h-[150px] flex items-center justify-center text-gray-500 border border-dashed border-gray-300'>
          <UploaderPage onFileUploadSuccess={handleReceivedFileId} />
        </div>

        {error && <p className='text-red-600 text-sm text-center mt-2'>{error}</p>}

        <div className='flex justify-center gap-3 mt-1 w-2/3 mx-auto'>
          <button onClick={handleSubmit} disabled={loading} className='px-5 py-3 w-full bg-[#1758BA] text-white rounded-lg hover:bg-[#216ee1] transition disabled:opacity-50'>
            {loading ? 'در حال ارسال...' : 'ثبت'}
          </button>
          <button onClick={onClose} className='px-5 py-3 border w-full border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition'>
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}
