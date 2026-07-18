'use client';

import { useCallback } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { HiOutlineTrash } from 'react-icons/hi';
import { Box, IconButton, Typography } from '@mui/material';
import {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
  useFieldArray,
} from 'react-hook-form';
import { UppyUploader } from '@/components/uploader/UppyUploader';
import { RHFTextField } from '@/components/hook-form';
import { packagingRequestDocumentRestrictions } from './documentUploader.config';
import { CreatePackagingRequestFormValues } from './schema';

interface DocumentListFieldProps {
  control: Control<CreatePackagingRequestFormValues>;
  register: UseFormRegister<CreatePackagingRequestFormValues>;
  setValue: UseFormSetValue<CreatePackagingRequestFormValues>;
  clearErrors: UseFormClearErrors<CreatePackagingRequestFormValues>;
  errors: FieldErrors<CreatePackagingRequestFormValues>;
}

export default function DocumentListField({
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

  const handleUpload = useCallback(
    (index: number, data: string[]) => {
      setValue(`documentList.${index}.uuid`, data[0] ?? '', { shouldValidate: true });
      clearErrors(`documentList.${index}.uuid`);
    },
    [setValue, clearErrors],
  );

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
          const titleError = errors.documentList?.[index]?.title?.message;

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
                      height: 40
                    },
                  }}
                />
                {/* {titleError && (
                  <Typography color="error" fontSize={12} mt={0.5}>
                    {titleError}
                  </Typography>
                )} */}
              </Box>
              <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={2}>
                <Box flex={1}>
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
                </Box>

                  {fields.length > 1 &&
                <IconButton
                  aria-label="حذف مدرک"
                  disabled={fields.length <= 1}
                  onClick={() => handleRemoveDocument(index)}
                  sx={{
                    borderRadius: '10px',
                    border: '1px solid #FA4D56',
                    color: '#FA4D56' 
                  }}>
                  <HiOutlineTrash size="1.5rem" color="#FA4D56" />
                </IconButton>
                }
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
