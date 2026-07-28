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
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { UppyUploader } from '@/components/uploader/UppyUploader';
import { RHFTextField } from '@/components/hook-form';
import { packagingRequestDocumentRestrictions } from './documentUploader.config';

const compactUploaderSx = {
  '& .uppy-Root': {
    height: '84px',
    maxHeight: '84px !important',
  },
  '& .uppy-Dashboard-inner': {
    minHeight: '84px !important',
  },
  '& .uppy-Dashboard-AddFiles': {
    height: '44px',
  },
  '& .uppy-Dashboard-AddFiles-title': {
    fontSize: '13px',
    lineHeight: 1.35,
    margin: 0,
  },
};

const documentCardSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  border: '1px dashed #1758BA',
  borderRadius: '10px',
  p: 1,
};

const documentTitleFieldSx = {
  '& .MuiInputBase-root': {
    borderRadius: '10px',
    height: 36,
  },
  '& .MuiInputBase-input': {
    py: 0.75,
    fontSize: '14px',
  },
};

const removeDocumentButtonSx = {
  borderRadius: '8px',
  border: '1px solid #FA4D56',
  color: '#FA4D56',
  width: 36,
  height: 36,
  flexShrink: 0,
};

type DocumentFormItem = {
  id?: number;
  title: string;
  uuid: string;
  link?: string;
  isNew?: boolean;
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

function hasExistingDocumentFile(document?: DocumentFormItem, isEditMode?: boolean) {
  if (!isEditMode || !document) return false;

  return Boolean(document.uuid?.trim() && document.link?.trim());
}

function sanitizeDocumentListItem(doc: DocumentFormItem): DocumentFormItem {
  if (doc.isNew) {
    return { title: doc.title, uuid: doc.uuid, isNew: true };
  }

  return {
    id: doc.id,
    title: doc.title,
    uuid: doc.uuid,
    link: doc.link,
    isNew: false,
  };
}

export default function DocumentListField({
  mode = 'create',
  control,
  register,
  setValue,
  clearErrors,
  errors,
}: DocumentListFieldProps) {
  const { getValues } = useFormContext<DocumentFormValues>();
  const { fields, append, replace } = useFieldArray({
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
    append(
      mode === 'edit'
        ? { title: '', uuid: '', isNew: true }
        : { title: '', uuid: '' },
    );
    if (fields.length === 0) {
      clearErrors('documentList');
    }
  };

  const handleRemoveDocument = (index: number) => {
    if (fields.length <= 1) return;

    const currentList = getValues('documentList') ?? [];
    if (mode === 'edit' && !currentList[index]?.isNew) return;
    const updatedList = currentList
      .filter((_, itemIndex) => itemIndex !== index)
      .map((document) => sanitizeDocumentListItem(document));

    replace(updatedList);
    clearErrors('documentList');
  };

  return (
    <Box width="100%">
      <Typography variant="subtitle2" fontWeight={700} mb={1}>
        مدارک:
      </Typography>

      <Box display="flex" flexDirection="column" gap={1}>
        {fields.map((field, index) => {
          const uuidError = errors.documentList?.[index]?.uuid?.message;
          const watchedDocument = documentList?.[index];
          const isNewDocument = Boolean(watchedDocument?.isNew);
          const documentId = isNewDocument ? undefined : watchedDocument?.id;
          const fieldDocument = field as unknown as DocumentFormItem;
          const currentDocument: DocumentFormItem = {
            ...fieldDocument,
            ...(watchedDocument ?? {}),
          };
          const hasExistingFile =
            !isNewDocument && hasExistingDocumentFile(currentDocument, mode === 'edit');
          const isLockedDocument = mode === 'edit' && !isNewDocument;

          return (
            <Box key={field.id} sx={documentCardSx}>
              {mode === 'edit' && typeof documentId === 'number' && (
                <input
                  type="hidden"
                  {...register(`documentList.${index}.id`, { valueAsNumber: true })}
                />
              )}
              {mode === 'edit' && Boolean(currentDocument.link?.trim()) && (
                <input type="hidden" {...register(`documentList.${index}.link`)} />
              )}
              <Box>
                <RHFTextField
                  name={`documentList.${index}.title`}
                  placeholder="عنوان مدرک را وارد کنید"
                  disabled={isLockedDocument}
                  sx={documentTitleFieldSx}
                />
              </Box>

              <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
                <Box flex={1}>
                  {hasExistingFile ? (
                    <Box display="flex" flexDirection="column" gap={1}>
                      {isImageLink(currentDocument.link) ? (
                        <Image
                          width={72}
                          height={72}
                          draggable={false}
                          alt=""
                          style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: '10px',
                            objectFit: 'cover',
                          }}
                          src={getDownloadUrl(currentDocument.link)}
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
                          size="small"
                          onClick={() => handleDownload(currentDocument.link)}
                          sx={{
                            borderRadius: '8px',
                            borderColor: '#1758BA',
                            color: '#1758BA',
                            minHeight: 32,
                            fontSize: '13px',
                          }}>
                          دانلود
                        </Button>
                        {!isLockedDocument && (
                          <Button
                            type="button"
                            variant="outlined"
                            size="small"
                            onClick={() => handleReplaceFile(index)}
                            sx={{
                              borderRadius: '8px',
                              borderColor: '#1758BA',
                              color: '#1758BA',
                              minHeight: 32,
                              fontSize: '13px',
                            }}>
                            تغییر فایل
                          </Button>
                        )}
                      </Box>
                    </Box>
                  ) : isLockedDocument ? (
                    <Typography fontSize={13} color="#393939">
                      فایل بارگذاری شده
                    </Typography>
                  ) : (
                    <>
                      <UppyUploader
                        sx={compactUploaderSx}
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

                {fields.length > 1 && !isLockedDocument && (
                  <IconButton
                    type="button"
                    aria-label="حذف مدرک"
                    onClick={() => handleRemoveDocument(index)}
                    sx={removeDocumentButtonSx}>
                    <HiOutlineTrash size="1.25rem" color="#FA4D56" />
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

      <Box display="flex" justifyContent="flex-end" mt={1}>
        <IconButton
          type="button"
          disabled={fields.length >= 10}
          onClick={handleAddDocument}
          sx={{
            borderRadius: '8px',
            border: '1px solid #1758BA',
            color: '#1758BA',
            width: 36,
            height: 36,
          }}>
          <FiPlusCircle size="1.25rem" color="#1758BA" />
        </IconButton>
      </Box>
    </Box>
  );
}
