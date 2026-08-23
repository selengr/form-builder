'use client';

import Image from 'next/image';
import { Box, Button, Typography } from '@mui/material';
import DocumentUploadTips from '../DocumentUploadTips';
import { PackagingRequestDocument } from '../types';

const documentCardSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.75,
  border: '1px dashed #1758BA',
  borderRadius: '10px',
  p: 1,
  minHeight: 118,
};

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

  return (
    <Box width="100%">
      <Typography variant="subtitle2" fontWeight={700} mb={0.75}>
        مدارک:
      </Typography>

      <DocumentUploadTips />

      {!documents.length ? (
        <Box
          sx={{
            borderRadius: '10px',
            bgcolor: '#F7F7FF',
            px: 1.5,
            py: 1.5,
            textAlign: 'center',
          }}>
          <Typography fontSize={12} color="#666">
            مدرکی ثبت نشده است
          </Typography>
        </Box>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }}
          gap={1.5}>
          {documents.map((document) => (
            <Box key={document.id ?? document.uuid} sx={documentCardSx}>
              <Box
                sx={{
                  width: '100%',
                  minHeight: 36,
                  display: 'flex',
                  alignItems: 'center',
                  px: 1.25,
                  borderRadius: '8px',
                  bgcolor: '#F7F7FF',
                }}>
                <Typography fontSize={13} fontWeight={600} color="#393939" noWrap>
                  {document.title?.trim() ? document.title : '—'}
                </Typography>
              </Box>

              <Box display="flex" flexDirection="column" gap={0.75} flex={1}>
                {isImageLink(document.link) ? (
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
                    src={getDownloadUrl(document.link)}
                    unoptimized
                  />
                ) : (
                  <Typography fontSize={12} color="#393939">
                    فایل بارگذاری شده
                  </Typography>
                )}

                <Button
                  type="button"
                  size="small"
                  variant="outlined"
                  onClick={() => handleDownload(document.link)}
                  sx={{
                    alignSelf: 'flex-start',
                    minHeight: 28,
                    fontSize: '12px',
                    borderRadius: '8px',
                    borderColor: '#1758BA',
                    color: '#1758BA',
                    px: 1.25,
                  }}>
                  دانلود
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
