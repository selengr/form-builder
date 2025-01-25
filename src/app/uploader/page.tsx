"use client";

import { useState } from "react";
import { UppyUploader } from "@/components/uploader/UppyUploader";

export default function UploaderPage() {
  const [data, setData] = useState<any>(null);

  return (
    <div className="p-6">
      <UppyUploader
        sx={{}}
        getData={(data: any) => {
          setData(data);
        }}
        fileRestriction={{
          minFileSize: undefined,
          maxFileSize: undefined,
          minNumberOfFiles: 1,
          maxNumberOfFiles: 1,
          maxTotalFileSize: undefined,
          allowedFileTypes: [".xls", ".xlsx"],
        }}
      />
      {!!data && (
        <div className="flex justify-between gap-2">
          <p>لینک:</p>
          <p className="text-green-500 font-bold">{`${process.env.NEXT_PUBLIC_BASE_URL}/filemanager/${data}`}</p>
        </div>
      )}
    </div>
  );
}
