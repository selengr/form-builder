'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { Box, Button, Dialog, IconButton, Typography } from '@mui/material';
import {
  fileManagerDownloadUrl,
  fileNameFromDownloadPath,
  formatBytesFa,
} from '@/lib/reportMediaAnswer';

interface ReportImageAnswerDialogProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  rawAnswer: string;
  respondentName?: string;
}

export default function ReportImageAnswerDialog({
  open,
  onClose,
  imageUrl,
  rawAnswer,
  respondentName,
}: ReportImageAnswerDialogProps) {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const fileName = fileNameFromDownloadPath(rawAnswer) || 'تصویر_پاسخ';

  useEffect(() => {
    if (!open || !imageUrl) {
      setDimensions(null);
      setFileSize(null);
      return;
    }

    let cancelled = false;
    fetch(imageUrl, { method: 'HEAD' })
      .then((res) => {
        if (cancelled) return;
        const length = res.headers.get('content-length');
        if (length) setFileSize(Number(length));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [open, imageUrl]);

  const handleDownload = useCallback(() => {
    const url = fileManagerDownloadUrl(rawAnswer) || imageUrl;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [imageUrl, rawAnswer]);

  const titleName = respondentName?.trim() || 'کاربر';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      dir="rtl"
      PaperProps={{
        sx: {
          borderRadius: '24px',
          width: '100%',
          maxWidth: 520,
          mx: 1.5,
          overflow: 'hidden',
        },
      }}
      slotProps={{
        backdrop: {
          sx: { backdropFilter: 'blur(6px)', backgroundColor: 'rgba(15, 23, 42, 0.35)' },
        },
      }}
    >
      <Box sx={{ px: 2.5, pt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#161616' }}>
            {titleName}
        </Typography>
        <IconButton onClick={onClose} aria-label="بستن" size="small">
          <CgClose size={22} color="#404040" />
        </IconButton>
      </Box>

      <Box sx={{ px: 2.5, pt: 2, pb: 2.5 }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            borderRadius: '16px',
            overflow: 'hidden',
            bgcolor: '#F3F5F9',
            minHeight: 200,
            maxHeight: 'min(58vh, 420px)',
          }}
        >
          <Image
            src={imageUrl}
            alt={fileName}
            width={800}
            height={600}
            unoptimized
            onLoad={(e) => {
              const img = e.currentTarget;
              setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
            }}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: 'min(58vh, 420px)',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </Box>

        <Box
          sx={{
            mt: 2,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { sm: 'flex-end' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#161616' }}>{fileName}</Typography>
            <Typography sx={{ fontSize: 13, color: '#667085', mt: 0.5 }}>
              ابعاد:{' '}
              {dimensions
                ? `${dimensions.width.toLocaleString('fa-IR')} × ${dimensions.height.toLocaleString('fa-IR')} پیکسل`
                : '—'}{' '}
              | حجم: {fileSize != null ? formatBytesFa(fileSize) : '—'}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={handleDownload}
            sx={{
              minWidth: 120,
              height: 44,
              borderRadius: '999px',
              fontWeight: 700,
              color: '#1758BA',
              borderColor: '#1758BA',
              alignSelf: { xs: 'center', sm: 'flex-start' },
            }}
          >
            دانلود
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}