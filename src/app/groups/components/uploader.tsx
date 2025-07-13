"use client";

import {UppyUploader} from "@/components/uploader/UppyUploader";

interface UploaderPageProps {
  onFileUploadSuccess?: (fileId: string) => void;
}

export default function UploaderPage({onFileUploadSuccess}: UploaderPageProps) {

  const handleUppyData = (data:any) => {
    if (onFileUploadSuccess) {
      onFileUploadSuccess(data[0]);
    }
  };

  return (<div className="p-6">
      <UppyUploader
        sx={{}}
        getData={handleUppyData}
        fileRestriction={{
          minFileSize: undefined,
          maxFileSize: undefined,
          minNumberOfFiles: 1,
          maxNumberOfFiles: 1,
          maxTotalFileSize: undefined,
          allowedFileTypes: [".xls", ".xlsx"],
        }}
      />
    </div>);
}