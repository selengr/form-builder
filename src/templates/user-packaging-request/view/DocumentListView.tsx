'use client';

import Image from 'next/image';
import { Box, Button, Typography } from '@mui/material';
import { PackagingRequestDocument } from '../types';

function getDownloadUrl(link?: string) {
  if (!link) return '';
  const fullPath = link.startsWith('/') ? link : `/${link}`;
  return `${process.env.NEXT_PUBLIC_BASE_URL}/filemanager${fullPath}`;
}

function isImageLink(link?: string) {
  if (!link) return false;
  return /\.(jpeg|jpg|png|gif|webp)$/i.test(link);
}

interface DocumentListViewProps {
  documents: PackagingRequestDocument[];
}

export default function DocumentListView({ documents }: DocumentListViewProps) {
  const handleDownload = (link?: string) => {
    const url = getDownloadUrl(link);
    if (!url) return;
    window.open(url, '_blank');
  };

  if (!documents.length) {
    return (
      <Box width="100%">
        <Typography variant="subtitle2" fontWeight={700} mb={1}>
          مدارک:
        </Typography>
        <Box
          sx={{
            borderRadius: '10px',
            bgcolor: '#F7F7FF',
            px: 2,
            py: 2,
            textAlign: 'center',
          }}>
          <Typography fontSize={14} color="#666">
            مدرکی ثبت نشده است
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box width="100%">
      <Typography variant="subtitle2" fontWeight={700} mb={1}>
        مدارک:
      </Typography>

      <Box display="flex" flexDirection="column" gap={1.5}>
        {documents.map((document) => (
          <Box
            key={document.id ?? document.uuid}
            display="flex"
            flexDirection="column"
            gap={1.5}
            border="1px dashed #1758BA"
            borderRadius="10px"
            p={1.5}>
            <Box
              sx={{
                width: '100%',
                minHeight: 40,
                display: 'flex',
                alignItems: 'center',
                px: 2,
                borderRadius: '10px',
                bgcolor: '#F7F7FF',
              }}>
              <Typography fontSize={14} fontWeight={600} color="#393939">
                {document.title?.trim() ? document.title : '—'}
              </Typography>
            </Box>

            <Box display="flex" flexDirection="column" gap={1.5}>
              {isImageLink(document.link) ? (
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
                  src={getDownloadUrl(document.link)}
                />
              ) : (
                <Typography fontSize={13} color="#393939">
                  فایل بارگذاری شده
                </Typography>
              )}

              <Button
                type="button"
                variant="outlined"
                onClick={() => handleDownload(document.link)}
                sx={{
                  alignSelf: 'flex-start',
                  borderRadius: '8px',
                  borderColor: '#1758BA',
                  color: '#1758BA',
                }}>
                دانلود
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
