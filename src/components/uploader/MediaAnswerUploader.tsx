'use client';

import { DragEvent, useEffect, useRef, useState } from 'react';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';
import { toast } from 'sonner';
import { v7 as uuidv7 } from 'uuid';
import {
  IoAdd,
  IoClose,
  IoLockClosedOutline,
  IoPause,
  IoPlay,
  IoWarningOutline,
} from 'react-icons/io5';
import { GalleryIcon, MusicIcon, ReplaceIcon, TrashIcon } from './MediaIcons';

export type MediaKind = 'audio' | 'image';

interface MediaAnswerUploaderProps {
  kind: MediaKind;
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  locked?: boolean;
  showRequiredError?: boolean;
  maxFileSize?: number;
  maxRecordSeconds?: number;
}

type UploadError = 'type' | 'size' | 'upload' | null;

interface FileInfo {
  name: string;
  size?: number;
  duration?: number;
  width?: number;
  height?: number;
  url?: string;
}

const PRIMARY = '#303CFB';
const TRASH_COLOR = '#F25055';
const DANGER = '#F04438';

const KIND_CONFIG: Record<MediaKind, { accept: string; extensions: string[]; formats: string; dropTitle: string; requiredText: string }> = {
  audio: {
    accept: '.mp3,.wav,.m4a,.aac,.webm,.ogg',
    extensions: ['mp3', 'wav', 'm4a', 'aac', 'webm', 'ogg'],
    formats: 'MP3، WAV، M4A، AAC، WEBM، OGG',
    dropTitle: 'فایل صوتی را اینجا رها کنید',
    requiredText: 'لطفاً فایل صوتی را آپلود کنید.',
  },
  image: {
    accept: '.jpg,.jpeg,.png',
    extensions: ['jpg', 'jpeg', 'png'],
    formats: 'JPG، PNG',
    dropTitle: 'فایل تصویری را اینجا رها کنید',
    requiredText: 'لطفاً تصویر را آپلود کنید.',
  },
};

const ERROR_TEXT: Record<Exclude<UploadError, null>, string> = {
  type: 'فرمت فایل مجاز نیست.',
  size: 'حجم فایل از حد مجاز بیشتر است.',
  upload: 'آپلود کامل نشده است، لطفاً دوباره تلاش کنید.',
};

const toMegabytes = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, '');

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const whole = Math.floor(seconds);
  return `${String(Math.floor(whole / 60)).padStart(2, '0')}:${String(whole % 60).padStart(2, '0')}`;
};

const getExtension = (name: string) => name.split('.').pop()?.toLowerCase() ?? '';

const pickRecordMimeType = () => {
  if (typeof MediaRecorder === 'undefined') return '';
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? '';
};

const recordExtension = (mimeType: string) => {
  if (mimeType.includes('mp4')) return 'm4a';
  if (mimeType.includes('ogg')) return 'ogg';
  return 'webm';
};

const microphoneErrorText = (err: unknown) => {
  const name = err instanceof DOMException || err instanceof Error ? err.name : '';
  if (name === 'NotFoundError' || name === 'OverconstrainedError') {
    return 'میکروفونی روی این دستگاه پیدا نشد؛ لطفاً میکروفون را وصل کنید';
  }
  if (name === 'NotReadableError' || name === 'AbortError') {
    return 'میکروفون در دسترس نیست؛ ممکن است برنامه‌ی دیگری از آن استفاده کند';
  }
  if (name === 'NotAllowedError' || name === 'SecurityError') {
    const policy = (document as any).permissionsPolicy ?? (document as any).featurePolicy;
    if (policy?.allowsFeature && !policy.allowsFeature('microphone')) {
      return 'دسترسی به میکروفون توسط تنظیمات امنیتی سایت (Permissions-Policy) مسدود شده است';
    }
    return 'دسترسی به میکروفون داده نشد؛ لطفاً از تنظیمات مرورگر اجازه دهید';
  }
  return `شروع ضبط ممکن نشد${name ? ` (${name})` : ''}`;
};

const remoteFileUrl = (id: string) => `${process.env.NEXT_PUBLIC_BASE_URL}/filemanager/${id}`;

const pillButton = (variant: 'contained' | 'outlined', disabled?: boolean): React.CSSProperties => ({
  height: 42,
  minWidth: 132,
  padding: '0 20px',
  borderRadius: 999,
  fontSize: 15,
  fontWeight: 600,
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
  border: `1px solid ${PRIMARY}`,
  backgroundColor: variant === 'contained' ? PRIMARY : '#fff',
  color: variant === 'contained' ? '#fff' : PRIMARY,
});

function AudioPlayer({ src, knownDuration, onDuration }: { src: string; knownDuration?: number; onDuration?: (seconds: number) => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(knownDuration ?? 0);
  const [failed, setFailed] = useState(false);

  const total = Number.isFinite(duration) && duration > 0 ? duration : (knownDuration ?? 0);
  const progress = total > 0 ? Math.min(100, (current / total) * 100) : 0;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => setFailed(true));
    else audio.pause();
  };

  const seek = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !total) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (rect.right - event.clientX) / rect.width;
    audio.currentTime = Math.max(0, Math.min(total, ratio * total));
  };

  if (failed) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#F8F9FB] px-2.5 py-2">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(event) => {
          const seconds = event.currentTarget.duration;
          setDuration(seconds);
          if (Number.isFinite(seconds) && seconds > 0) onDuration?.(seconds);
        }}
        onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setFailed(true)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'توقف' : 'پخش'}
        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: PRIMARY }}>
        {playing ? <IoPause size={16} /> : <IoPlay size={16} />}
      </button>
      <div className="relative h-1 flex-1 cursor-pointer rounded-full bg-[#ECEEF2]" onClick={seek}>
        <div className="absolute right-0 top-0 h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: PRIMARY }} />
      </div>
      <span className="shrink-0 text-[12px] text-[#667085]" dir="ltr">
        {formatTime(current)} / {formatTime(total)}
      </span>
    </div>
  );
}

const WAVE_BAR_COUNT = 24;
const WAVE_MIN_HEIGHT = 4;
const WAVE_MAX_HEIGHT = 30;

function RecordingWave({ stream }: { stream: MediaStream | null }) {
  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!stream) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const context: AudioContext = new AudioContextClass();
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.7;
    analyser.minDecibels = -90;
    analyser.maxDecibels = -15;
    source.connect(analyser);
    context.resume().catch(() => {});

    const data = new Uint8Array(analyser.frequencyBinCount);
    const half = WAVE_BAR_COUNT / 2;
    let frame = 0;

    const draw = () => {
      analyser.getByteFrequencyData(data);
      for (let index = 0; index < WAVE_BAR_COUNT; index += 1) {
        const band = Math.floor(Math.abs(index + 0.5 - half));
        const value = (data[1 + band * 2] + data[2 + band * 2]) / 2;
        const level = Math.min(1, value / 255);
        const bar = barsRef.current[index];
        if (bar) bar.style.height = `${WAVE_MIN_HEIGHT + level * (WAVE_MAX_HEIGHT - WAVE_MIN_HEIGHT)}px`;
      }
      frame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frame);
      source.disconnect();
      context.close().catch(() => {});
    };
  }, [stream]);

  return (
    <div className="flex h-8 items-center gap-[3px]" dir="ltr">
      {Array.from({ length: WAVE_BAR_COUNT }, (_, index) => (
        <span
          key={index}
          ref={(element) => {
            barsRef.current[index] = element;
          }}
          className="w-[3px] rounded-full transition-[height] duration-75"
          style={{ height: WAVE_MIN_HEIGHT, backgroundColor: DANGER }}
        />
      ))}
    </div>
  );
}

export default function MediaAnswerUploader({
  kind,
  value,
  onChange,
  required = false,
  locked = false,
  showRequiredError = false,
  maxFileSize = 20 * 1024 * 1024,
  maxRecordSeconds = 180,
}: MediaAnswerUploaderProps) {
  const config = KIND_CONFIG[kind];
  const inputRef = useRef<HTMLInputElement>(null);
  const uppyRef = useRef<Uppy | null>(null);
  const lastFileRef = useRef<File | null>(null);
  const localUrlRef = useRef<string | null>(null);

  const [error, setError] = useState<UploadError>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState<{ name: string; loaded: number; total: number } | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(() =>
    value ? { name: kind === 'audio' ? 'فایل صوتی' : 'تصویر', url: remoteFileUrl(value) } : null,
  );

  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordStream, setRecordStream] = useState<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const discardRecordingRef = useRef(false);
  const recordSecondsRef = useRef(0);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} کیلوبایت` : `${toMegabytes(bytes)} مگابایت`;
  const maxSizeText = `حداکثر ${toMegabytes(maxFileSize)} مگابایت`;

  useEffect(() => {
    const uppy = new Uppy({
      autoProceed: false,
      restrictions: { maxNumberOfFiles: 1, maxFileSize },
    }).use(Tus, {
      endpoint: `${process.env.NEXT_PUBLIC_BASE_URL}/filemanager/upload`,
      removeFingerprintOnSuccess: true,
    });

    uppy.on('upload-progress', (file, progress) => {
      setUploading({ name: file?.name ?? '', loaded: progress.bytesUploaded, total: progress.bytesTotal ?? 0 });
    });
    uppy.on('upload-success', (_file, response) => {
      const id = response?.uploadURL?.split('/').pop() ?? '';
      setUploading(null);
      setError(null);
      if (id) onChangeRef.current(id);
    });
    uppy.on('upload-error', () => {
      setUploading(null);
      setError('upload');
    });

    uppyRef.current = uppy;
    return () => {
      uppy.cancelAll();
      uppy.destroy();
      uppyRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (localUrlRef.current) URL.revokeObjectURL(localUrlRef.current);
      if (recorderRef.current?.state === 'recording') {
        discardRecordingRef.current = true;
        recorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const setLocalUrl = (file: File) => {
    if (localUrlRef.current) URL.revokeObjectURL(localUrlRef.current);
    localUrlRef.current = URL.createObjectURL(file);
    return localUrlRef.current;
  };

  const validateFile = (file: File): UploadError => {
    const extension = getExtension(file.name);
    if (!config.extensions.includes(extension)) return 'type';
    if (file.size > maxFileSize) return 'size';
    return null;
  };

  const startUpload = (file: File, duration?: number) => {
    const uppy = uppyRef.current;
    if (!uppy) return;

    const problem = validateFile(file);
    if (problem) {
      setError(problem);
      return;
    }

    lastFileRef.current = file;
    setError(null);
    setFileInfo({ name: file.name, size: file.size, duration, url: setLocalUrl(file) });
    onChange('');

    try {
      uppy.cancelAll();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      uppy.addFile({
        name: file.name,
        type: file.type,
        data: file,
        meta: { name: `${uuidv7()}_${timestamp}_${file.name}`, date: Date.now(), uploadedAt: new Date().toISOString(), uuid: uuidv7() },
      });
      setUploading({ name: file.name, loaded: 0, total: file.size });
      uppy.upload();
    } catch {
      setUploading(null);
      setError('upload');
    }
  };

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) startUpload(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  const openPicker = () => {
    if (!locked) inputRef.current?.click();
  };

  const cancelUpload = () => {
    uppyRef.current?.cancelAll();
    setUploading(null);
    setFileInfo(null);
    onChange('');
  };

  const retryUpload = () => {
    if (lastFileRef.current) startUpload(lastFileRef.current, fileInfo?.duration);
  };

  const removeFile = () => {
    if (locked) return;
    uppyRef.current?.cancelAll();
    setFileInfo(null);
    setError(null);
    onChange('');
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const startRecording = async () => {
    if (locked) return;
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      toast.error('ضبط صدا فقط در اتصال امن (HTTPS) امکان‌پذیر است');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      toast.error('مرورگر شما از ضبط صدا پشتیبانی نمی‌کند');
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      console.error('[MediaAnswerUploader] getUserMedia failed:', err);
      toast.error(microphoneErrorText(err));
      return;
    }

    let recorder: MediaRecorder;
    const mimeType = pickRecordMimeType();
    try {
      recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    } catch {
      try {
        recorder = new MediaRecorder(stream);
      } catch (err) {
        console.error('[MediaAnswerUploader] MediaRecorder failed:', err);
        stream.getTracks().forEach((track) => track.stop());
        toast.error('مرورگر شما از ضبط صدا پشتیبانی نمی‌کند');
        return;
      }
    }

    streamRef.current = stream;
    recorderRef.current = recorder;
    chunksRef.current = [];
    discardRecordingRef.current = false;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      stopTimer();
      if (discardRecordingRef.current) return;
      const type = (recorder.mimeType || mimeType || 'audio/webm').split(';')[0];
      const file = new File([new Blob(chunksRef.current, { type })], `voice_record.${recordExtension(type)}`, { type });
      startUpload(file, recordSecondsRef.current);
    };

    try {
      recorder.start();
    } catch (err) {
      console.error('[MediaAnswerUploader] recorder.start failed:', err);
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      toast.error('شروع ضبط ممکن نشد، لطفاً دوباره تلاش کنید');
      return;
    }

    setError(null);
    setRecordSeconds(0);
    recordSecondsRef.current = 0;
    setRecordStream(stream);
    setIsRecording(true);
    timerRef.current = setInterval(() => {
      recordSecondsRef.current += 1;
      setRecordSeconds(recordSecondsRef.current);
    }, 1000);
  };

  const finishRecording = (discard: boolean) => {
    discardRecordingRef.current = discard;
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    stopTimer();
    setRecordStream(null);
    setIsRecording(false);
  };

  useEffect(() => {
    if (isRecording && recordSeconds >= maxRecordSeconds) {
      finishRecording(false);
      toast.info(`ضبط متوقف شد؛ حداکثر زمان ضبط ${Math.round(maxRecordSeconds / 60)} دقیقه است`);
    }
  }, [isRecording, recordSeconds, maxRecordSeconds]);

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (!locked && !uploading && !isRecording) handleFiles(event.dataTransfer.files);
  };

  const showRequired = showRequiredError && required && !value && !uploading && !isRecording && !error;
  const actionsRow = (children: React.ReactNode) => <div className="mt-3 flex flex-wrap gap-3">{children}</div>;

  const dropzone = (
    <div
      onClick={openPicker}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl px-4 py-8 text-center transition-colors"
      style={{
        border: `1.5px dashed ${error || showRequired ? DANGER : isDragging ? PRIMARY : '#D0D5DD'}`,
        backgroundColor: error ? '#FEF3F2' : isDragging ? '#F3F4FF' : '#F8F9FB',
      }}>
      {error ? <IoClose size={26} color="#344054" /> : <IoAdd size={28} color="#344054" />}
      <p className="text-[16px] font-semibold" style={{ color: error ? DANGER : '#161616' }}>
        {error ? ERROR_TEXT[error] : config.dropTitle}
      </p>
      <p className="text-[12px] text-[#98A2B3]">
        {maxSizeText} | {config.formats}
      </p>
    </div>
  );

  const pickAndRecordButtons = actionsRow(
    <>
      <button type="button" onClick={openPicker} style={pillButton('contained', locked)} disabled={locked}>
        انتخاب فایل
      </button>
      {kind === 'audio' && (
        <button type="button" onClick={startRecording} style={pillButton('outlined', locked)} disabled={locked}>
          ضبط صدا
        </button>
      )}
    </>,
  );

  const renderBody = () => {
    if (isRecording) {
      return (
        <>
          <div className="flex flex-col items-center gap-3 rounded-2xl px-4 py-5" style={{ border: `1px solid ${DANGER}`, backgroundColor: '#FEF3F2' }}>
            <div className="flex items-center gap-2 text-[14px]" style={{ color: DANGER }}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: DANGER }} />
              <span>در حال ضبط...</span>
              <span dir="ltr">{formatTime(recordSeconds)}</span>
            </div>
            <RecordingWave stream={recordStream} />
            <p className="text-[12px] text-[#667085]">حداکثر زمان ضبط {Math.round(maxRecordSeconds / 60)} دقیقه است</p>
          </div>
          {actionsRow(
            <>
              <button type="button" onClick={() => finishRecording(false)} style={pillButton('contained')}>
                پایان ضبط
              </button>
              <button type="button" onClick={() => finishRecording(true)} style={pillButton('outlined')}>
                انصراف
              </button>
            </>,
          )}
        </>
      );
    }

    if (uploading) {
      const percent = uploading.total ? Math.round((uploading.loaded / uploading.total) * 100) : 0;
      return (
        <>
          <div className="flex flex-col items-center gap-2 rounded-2xl px-4 py-6 text-center" style={{ border: '1.5px dashed #D0D5DD', backgroundColor: '#F8F9FB' }}>
            <IoAdd size={28} color="#344054" />
            <p className="text-[16px] font-semibold text-[#161616]">در حال بارگذاری... {percent}٪</p>
            <p className="max-w-full truncate text-[12px] text-[#98A2B3]">
              {formatSize(uploading.loaded)} از {formatSize(uploading.total)} | <span dir="ltr">{uploading.name}</span>
            </p>
            <div className="h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-[#ECEEF2]">
              <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, backgroundColor: PRIMARY }} />
            </div>
          </div>
          {actionsRow(
            <button type="button" onClick={cancelUpload} style={pillButton('outlined')}>
              لغو بارگذاری
            </button>,
          )}
        </>
      );
    }

    if (value && fileInfo) {
      const detail =
        kind === 'audio'
          ? fileInfo.duration
            ? formatTime(fileInfo.duration)
            : null
          : fileInfo.width && fileInfo.height
            ? `${fileInfo.width}×${fileInfo.height}`
            : null;
      const meta = [fileInfo.size ? formatSize(fileInfo.size) : null, detail]
        .filter(Boolean)
        .join(' | ');
      return (
        <div className="flex flex-col gap-3 rounded-2xl border border-[#E4E7EC] bg-white p-[18px]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF]" style={{ color: PRIMARY }}>
              {kind === 'audio' ? <MusicIcon /> : <GalleryIcon />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-medium text-[#161616]" dir="auto">
                {fileInfo.name}
              </p>
              {meta && <p className="mt-0.5 text-[12px] text-[#98A2B3]">{meta}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                aria-label="جایگزینی فایل"
                onClick={openPicker}
                disabled={locked}
                className="flex h-9 w-9 items-center justify-center rounded-[10px]"
                style={{ backgroundColor: locked ? '#F2F4F7' : '#EEF4FF', color: locked ? '#D0D5DD' : PRIMARY }}>
                <ReplaceIcon />
              </button>
              <button
                type="button"
                aria-label="حذف فایل"
                onClick={removeFile}
                disabled={locked}
                className="flex h-9 w-9 items-center justify-center rounded-[10px]"
                style={{ backgroundColor: locked ? '#F2F4F7' : '#FEF3F2', color: locked ? '#D0D5DD' : TRASH_COLOR }}>
                <TrashIcon />
              </button>
            </div>
          </div>

          {fileInfo.url && kind === 'audio' && (
            <AudioPlayer
              key={fileInfo.url}
              src={fileInfo.url}
              knownDuration={fileInfo.duration}
              onDuration={(seconds) => setFileInfo((info) => (info && !info.duration ? { ...info, duration: seconds } : info))}
            />
          )}
          {fileInfo.url && kind === 'image' && (
            <img
              src={fileInfo.url}
              alt=""
              className="max-h-[320px] w-full rounded-xl bg-[#F8F9FB] object-cover"
              onLoad={(event) => {
                const { naturalWidth, naturalHeight } = event.currentTarget;
                setFileInfo((info) => (info && !info.width ? { ...info, width: naturalWidth, height: naturalHeight } : info));
              }}
              onError={() => setFileInfo((info) => (info ? { ...info, url: undefined } : info))}
            />
          )}

          {locked && (
            <div className="flex items-center gap-2 rounded-lg bg-[#F2F4F7] px-3 py-2 text-[13px] text-[#667085]">
              <IoLockClosedOutline size={16} />
              <span>پاسخ ثبت نهایی شده و امکان حذف یا جایگزینی وجود ندارد.</span>
            </div>
          )}
        </div>
      );
    }

    if (error === 'upload') {
      return (
        <>
          {dropzone}
          {actionsRow(
            <>
              <button type="button" onClick={retryUpload} style={pillButton('contained')}>
                تلاش مجدد
              </button>
              <button type="button" onClick={openPicker} style={pillButton('outlined')}>
                انتخاب فایل دیگر
              </button>
            </>,
          )}
        </>
      );
    }

    return (
      <>
        {dropzone}
        {pickAndRecordButtons}
      </>
    );
  };

  return (
    <div className="w-full" dir="rtl">
      <input ref={inputRef} type="file" accept={config.accept} className="hidden" onChange={(event) => handleFiles(event.target.files)} />
      {renderBody()}
      {showRequired && (
        <div className="mt-3 flex items-center gap-2 text-[13px]" style={{ color: DANGER }}>
          <IoWarningOutline size={18} />
          <span>{config.requiredText}</span>
        </div>
      )}
    </div>
  );
}
