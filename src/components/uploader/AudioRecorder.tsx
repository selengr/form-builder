'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Box, Button, Typography } from '@mui/material';

interface AudioRecorderProps {
  uploading?: boolean;
  onSubmit: (file: File) => void;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
};

const pickMimeType = () => {
  if (typeof MediaRecorder === 'undefined') return '';
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? '';
};

const extensionFor = (mimeType: string) => {
  if (mimeType.includes('mp4')) return 'm4a';
  if (mimeType.includes('ogg')) return 'ogg';
  return 'webm';
};

export default function AudioRecorder({ uploading = false, onSubmit }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [recordedFile, setRecordedFile] = useState<File | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    return () => {
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
      stopStream();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, [recordedUrl]);

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      toast.error('مرورگر شما از ضبط صدا پشتیبانی نمی‌کند');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const type = (recorder.mimeType || mimeType || 'audio/webm').split(';')[0];
        const blob = new Blob(chunksRef.current, { type });
        const file = new File([blob], `voice_${Date.now()}.${extensionFor(type)}`, { type });
        setRecordedFile(file);
        setRecordedUrl(URL.createObjectURL(blob));
        stopStream();
      };

      setRecordedFile(null);
      setRecordedUrl(null);
      setSeconds(0);
      recorder.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => setSeconds((value) => value + 1), 1000);
    } catch {
      stopStream();
      toast.error('دسترسی به میکروفون داده نشد');
    }
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    setIsRecording(false);
  };

  const resetRecording = () => {
    setRecordedFile(null);
    setRecordedUrl(null);
    setSeconds(0);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
        padding: 2,
        borderRadius: '12px',
        border: '1px dashed #DDE1E6',
      }}>
      {isRecording ? (
        <>
          <Box display="flex" alignItems="center" gap={1}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#FA4D56' }} />
            <Typography sx={{ fontSize: '14px', fontWeight: 600, direction: 'ltr' }}>{formatTime(seconds)}</Typography>
          </Box>
          <Button
            variant="contained"
            onClick={stopRecording}
            sx={{ borderRadius: '10px', backgroundColor: '#FA4D56', '&:hover': { backgroundColor: '#e0434b' } }}>
            توقف ضبط
          </Button>
        </>
      ) : recordedUrl ? (
        <>
          <audio controls src={recordedUrl} style={{ width: '100%' }} />
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              disabled={uploading || !recordedFile}
              onClick={() => recordedFile && onSubmit(recordedFile)}
              sx={{ borderRadius: '10px', backgroundColor: '#1758BA' }}>
              {uploading ? 'در حال بارگذاری...' : 'بارگذاری ضبط'}
            </Button>
            <Button
              variant="outlined"
              disabled={uploading}
              onClick={resetRecording}
              sx={{ borderRadius: '10px', borderColor: '#1758BA', color: '#1758BA' }}>
              ضبط دوباره
            </Button>
          </Box>
        </>
      ) : (
        <Button
          variant="outlined"
          onClick={startRecording}
          sx={{ borderRadius: '10px', borderColor: '#1758BA', color: '#1758BA' }}>
          شروع ضبط صدا
        </Button>
      )}
    </Box>
  );
}
