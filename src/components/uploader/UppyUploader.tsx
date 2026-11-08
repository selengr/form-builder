'use client';

import { useRef } from 'react';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';
import CustomUppy from './CustomeUppy';
import { fileUploaderRestrictions } from './fileUploader.config';
import { toast } from 'sonner';
import { type IUploader } from './types';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/image-editor/dist/style.min.css';
import Persian from '@uppy/locales/lib/fa_IR';
import { v7 as uuidv7 } from "uuid";

export function UppyUploader({ fileRestriction = fileUploaderRestrictions, sx = {}, getData, register }: IUploader) {
  const generateFileName = (file: any) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    return `${uuidv7()}_${timestamp}_${file.name}`;
  };
  const uppy = useRef(
    new Uppy({
      debug: true,
      locale: Persian,
    }).use(Tus, {
      endpoint: `${process.env.NEXT_PUBLIC_BASE_URL}/filemanager/upload`,
      removeFingerprintOnSuccess: true,
    }),
  );

  uppy.current.on('file-added', (file) => {
    uppy.current.setFileMeta(file.id, {
      name: generateFileName(file),
      date: Date.now(),
      uploadedAt: new Date().toISOString(),
      uuid: uuidv7(),
    });
  });

  uppy.current.setOptions({ restrictions: fileRestriction });
  uppy.current.on('complete', ({ successful, failed }) => {
    if (failed!.length > 0) {
      toast.error('خطا! بارگذاری انجام نشد');
      return;
    }
    if (successful!.length > 0) {
      getData(
        successful!.map((item: any) => {
          return item.uploadURL.split('/').pop();
        }),
      );
    }
  });

  return <CustomUppy uppy={uppy.current} {...register} sx={sx} />;
}
