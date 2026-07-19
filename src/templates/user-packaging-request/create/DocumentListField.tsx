'use client';

import { useCallback } from 'react';
import Image from 'next/image';
import { FiPlusCircle } from 'react-icons/fi';
import { HiOutlineTrash } from 'react-icons/hi';
import { Box, Button, IconButton, Typography } from '@mui/material';
import {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
  useFieldArray,
  useWatch,
} from 'react-hook-form';
import { UppyUploader } from '@/components/uploader/UppyUploader';
import { RHFTextField } from '@/components/hook-form';
import { packagingRequestDocumentRestrictions } from './documentUploader.config';

type DocumentFormItem = {
  id?: number;
  title: string;
  uuid: string;
  link?: string;
};

type DocumentFormValues = {
  documentList: DocumentFormItem[];
};

interface DocumentListFieldProps {
  mode?: 'create' | 'edit';
  control: Control<DocumentFormValues>;
  register: UseFormRegister<DocumentFormValues>;
  setValue: UseFormSetValue<DocumentFormValues>;
  clearErrors: UseFormClearErrors<DocumentFormValues>;
  errors: FieldErrors<DocumentFormValues>;
}

function getDownloadUrl(link?: string) {
  if (!link) return '';
  const fullPath = link.startsWith('/') ? link : `/${link}`;
  return `${process.env.NEXT_PUBLIC_BASE_URL}/filemanager${fullPath}`;
}

function isImageLink(link?: string) {
  if (!link) return false;
  return /\.(jpeg|jpg|png|gif|webp)$/i.test(link);
}

export default function DocumentListField({
  mode = 'create',
  control,
  register,
  setValue,
  clearErrors,
  errors,
}: DocumentListFieldProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'documentList',
  });

  const documentList = useWatch({
    control,
    name: 'documentList',
  });

  const handleUpload = useCallback(
    (index: number, data: string[]) => {
      setValue(`documentList.${index}.uuid`, data[0] ?? '', { shouldValidate: true });
      setValue(`documentList.${index}.link`, '');
      clearErrors(`documentList.${index}.uuid`);
    },
    [setValue, clearErrors],
  );

  const handleReplaceFile = (index: number) => {
    setValue(`documentList.${index}.uuid`, '');
    setValue(`documentList.${index}.link`, '');
  };

  const handleDownload = (link?: string) => {
    const url = getDownloadUrl(link);
    if (!url) return;
    window.open(url, '_blank');
  };

  const handleAddDocument = () => {
    if (fields.length >= 10) return;
    append({ title: '', uuid: '' });
    if (fields.length === 0) {
      clearErrors('documentList');
    }
  };

  const handleRemoveDocument = (index: number) => {
    if (fields.length <= 1) return;
    remove(index);
  };

  return (
    <Box width="100%">
      <Typography variant="subtitle2" fontWeight={700} mb={1}>
        مدارک:
      </Typography>

      <Box display="flex" flexDirection="column" gap={1.5}>
        {fields.map((field, index) => {
          const uuidError = errors.documentList?.[index]?.uuid?.message;
          const currentDocument = documentList?.[index];
          const hasExistingFile =
            mode === 'edit' &&
            Boolean(currentDocument?.link?.includes('/download/') && currentDocument?.uuid);

          return (
            <Box
              key={field.id}
              display="flex"
              flexDirection="column"
              gap={1.5}
              border="1px dashed #1758BA"
              borderRadius="10px"
              p={1.5}>
              <Box>
                <RHFTextField
                  name={`documentList.${index}.title`}
                  placeholder="عنوان مدرک را وارد کنید"
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '10px',
                      height: 40,
                    },
                  }}
                />
              </Box>

              <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={2}>
                <Box flex={1}>
                  {hasExistingFile ? (
                    <Box display="flex" flexDirection="column" gap={1.5}>
                      {isImageLink(currentDocument?.link) ? (
                        <Image
                          width={100}
                          height={100}
                          draggable={false}
                          alt=""
                          style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '12px',
                            objectFit: 'cover',
                          }}
                          src={getDownloadUrl(currentDocument?.link)}
                        />
                      ) : (
                        <Typography fontSize={13} color="#393939">
                          فایل بارگذاری شده
                        </Typography>
                      )}

                      <Box display="flex" flexWrap="wrap" gap={1}>
                        <Button
                          type="button"
                          variant="outlined"
                          onClick={() => handleDownload(currentDocument?.link)}
                          sx={{
                            borderRadius: '8px',
                            borderColor: '#1758BA',
                            color: '#1758BA',
                          }}>
                          دانلود
                        </Button>
                        <Button
                          type="button"
                          variant="outlined"
                          onClick={() => handleReplaceFile(index)}
                          sx={{
                            borderRadius: '8px',
                            borderColor: '#1758BA',
                            color: '#1758BA',
                          }}>
                          تغییر فایل
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <>
                      <UppyUploader
                        sx={{}}
                        register={register(`documentList.${index}.uuid`)}
                        getData={(data: string[]) => handleUpload(index, data)}
                        fileRestriction={packagingRequestDocumentRestrictions}
                      />
                      {uuidError && (
                        <Typography color="error" fontSize={12} mt={0.5}>
                          {uuidError}
                        </Typography>
                      )}
                    </>
                  )}
                </Box>

                {fields.length > 1 && (
                  <IconButton
                    aria-label="حذف مدرک"
                    onClick={() => handleRemoveDocument(index)}
                    sx={{
                      borderRadius: '10px',
                      border: '1px solid #FA4D56',
                      color: '#FA4D56',
                    }}>
                    <HiOutlineTrash size="1.5rem" color="#FA4D56" />
                  </IconButton>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      {(errors.documentList?.message || errors.documentList?.root?.message) && (
        <Typography color="error" fontSize={12} mt={1}>
          {errors.documentList?.message || errors.documentList?.root?.message}
        </Typography>
      )}

      <Box display="flex" justifyContent="flex-end" mt={1.5}>
        <IconButton
          disabled={fields.length >= 10}
          onClick={handleAddDocument}
          sx={{
            borderRadius: '10px',
            border: '1px solid #1758BA',
            color: '#1758BA',
          }}>
          <FiPlusCircle size="1.5rem" color="#1758BA" />
        </IconButton>
      </Box>
    </Box>
  );
}
