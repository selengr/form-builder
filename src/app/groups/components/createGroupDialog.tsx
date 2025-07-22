import React, {useState} from "react";
import UploaderPage from "./uploader";

interface CreateGroupDialogProps {
  onClose: () => void;
  onSubmit: (groupName: string) => void;
}

export function CreateGroupDialog({ onClose, onSubmit }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState<string>('');
  const [receivedFileId, setReceivedFileId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleReceivedFileId = (fileId: string) => {
    setReceivedFileId(fileId);
  };

  const handleSubmit = async () => {
    if (!groupName.trim()) {
      return;
    }

    if (!receivedFileId) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/group/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          uuid: receivedFileId,
          groupName,
          groupId: '',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'خطا در ثبت گروه.');
      }

      onSubmit(groupName);
      onClose();
    } catch (error: any) {
      // alert(error.message || 'خطایی رخ داده است.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md flex flex-col gap-4">
        <h2 className="text-xl font-bold text-[#2a2a2a] text-center">ایجاد گروه جدید</h2>

        <div className="flex flex-col gap-2">
          <label htmlFor="group-name" className="text-sm font-medium text-gray-700">نام گروه:</label>
          <input
            id="group-name"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1758BA]"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="مثال: گروه کارکنان"
          />
        </div>

        <div className="bg-gray-100 p-4 rounded-lg min-h-[150px] flex items-center justify-center text-gray-500 border border-dashed border-gray-300">
          <UploaderPage onFileUploadSuccess={handleReceivedFileId} />
        </div>

        <div className="flex justify-center gap-3 mt-1 w-2/3 mx-auto">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-3 w-full bg-[#1758BA] text-white rounded-lg hover:bg-[#216ee1] transition disabled:opacity-50"
          >
            {loading ? 'در حال ارسال...' : 'ثبت'}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 border w-full border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}