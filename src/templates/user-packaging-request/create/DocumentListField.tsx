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

const documentCardSx = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: 0.75,
  border: '1px dashed #1758BA',
  borderRadius: '10px',
  p: 1,
  minHeight: 118,
};

const compactUploaderSx = {
  '& .uppy-Root': {
    height: '72px',
    maxHeight: '72px !important',
  },
  '& .uppy-Dashboard-inner': {
    minHeight: '72px !important',
  },
  '& .uppy-Dashboard-AddFiles': {
    height: '44px',
  },
  '& .uppy-Dashboard-AddFiles-title': {
    fontSize: '11px',
    lineHeight: 1.3,
  },
};

function DocumentUploadTips() {
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: '#F7F7FF',
        borderRadius: '10px',
        px: 1.5,
        py: 1,
        mb: 1,
      }}>
      <Typography
        component="p"
        fontSize="12px"
        fontWeight={600}
        color="#393939"
        lineHeight={1.7}
        sx={{ display: 'flex', gap: 0.5 }}>
        <Box component="span" flexShrink={0}>
          •
        </Box>
        <span>آپلود اسناد زیر ضروری است:</span>
      </Typography>
      <Typography
        component="p"
        fontSize="12px"
        fontWeight={500}
        color="#393939"
        lineHeight={1.7}
        mt={0.5}
        sx={{ display: 'flex', gap: 0.5 }}>
        <Box component="span" flexShrink={0}>
          •
        </Box>
        <span>
          فایل سند انتشار قطعی ابزار (برای مثال مقاله علمی معتبر)؛ سند پرسشنامه با فرمت .docx؛
          سند شیوه نمره‌گذاری، شروط و محاسبات
        </span>
      </Typography>
    </Box>
  );
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

  const canAddMore = fields.length < 10;

  return (
    <Box width="100%">
      <Typography variant="subtitle2" fontWeight={700} mb={0.75}>
        مدارک:
      </Typography>

      <DocumentUploadTips />

      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }}
        gap={1.5}>
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
          const showRemoveButton = fields.length > 1 && !isLockedDocument;

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

              <Box display="flex" alignItems="flex-start" gap={0.5}>
                <Box flex={1} minWidth={0}>
                  <RHFTextField
                    name={`documentList.${index}.title`}
                    placeholder="عنوان مدرک"
                    disabled={isLockedDocument}
                    sx={{
                      '& .MuiInputBase-root': {
                        borderRadius: '8px',
                        height: 36,
                        fontSize: '13px',
                      },
                    }}
                  />
                </Box>

                {showRemoveButton && (
                  <IconButton
                    type="button"
                    aria-label="حذف مدرک"
                    onClick={() => handleRemoveDocument(index)}
                    sx={{
                      flexShrink: 0,
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      border: '1px solid #FA4D56',
                      color: '#FA4D56',
                    }}>
                    <HiOutlineTrash size="1.1rem" color="#FA4D56" />
                  </IconButton>
                )}
              </Box>

              <Box flex={1} minHeight={0}>
                {hasExistingFile ? (
                  <Box display="flex" flexDirection="column" gap={0.75}>
                    {isImageLink(currentDocument.link) ? (
                      <Image
                        width={72}
                        height={72}
                        draggable={false}
                        alt=""
                        style={{
                          width: '72px',
                          height: '72px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                        }}
                        src={getDownloadUrl(currentDocument.link)}
                      />
                    ) : (
                      <Typography fontSize={12} color="#393939">
                        فایل بارگذاری شده
                      </Typography>
                    )}

                    <Box display="flex" flexWrap="wrap" gap={0.75}>
                      <Button
                        type="button"
                        size="small"
                        variant="outlined"
                        onClick={() => handleDownload(currentDocument.link)}
                        sx={{
                          minHeight: 28,
                          fontSize: '12px',
                          borderRadius: '8px',
                          borderColor: '#1758BA',
                          color: '#1758BA',
                          px: 1.25,
                        }}>
                        دانلود
                      </Button>
                      {!isLockedDocument && (
                        <Button
                          type="button"
                          size="small"
                          variant="outlined"
                          onClick={() => handleReplaceFile(index)}
                          sx={{
                            minHeight: 28,
                            fontSize: '12px',
                            borderRadius: '8px',
                            borderColor: '#1758BA',
                            color: '#1758BA',
                            px: 1.25,
                          }}>
                          تغییر فایل
                        </Button>
                      )}
                    </Box>
                  </Box>
                ) : isLockedDocument ? (
                  <Typography fontSize={12} color="#393939">
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
                      <Typography color="error" fontSize={11} mt={0.25}>
                        {uuidError}
                      </Typography>
                    )}
                  </>
                )}
              </Box>
            </Box>
          );
        })}

        {canAddMore && (
          <Box
            component="button"
            type="button"
            aria-label="افزودن مدرک"
            onClick={handleAddDocument}
            sx={{
              ...documentCardSx,
              cursor: 'pointer',
              bgcolor: 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 118,
              transition: 'background-color 0.2s',
              '&:hover': {
                bgcolor: '#F7F7FF',
              },
            }}>
            <FiPlusCircle size="1.75rem" color="#1758BA" />
          </Box>
        )}
      </Box>

      {(errors.documentList?.message || errors.documentList?.root?.message) && (
        <Typography color="error" fontSize={12} mt={1}>
          {errors.documentList?.message || errors.documentList?.root?.message}
        </Typography>
      )}
    </Box>
  );
};
