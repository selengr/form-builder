const EMPTY_MARKERS = new Set([
  '',
  'null',
  'undefined',
  'download',
  '##none##',
  '#none###',
  'none',
]);

export function resolveMediaAnswerRaw(answer: unknown, link?: string | null): string {
  if (link && !isEmptyMediaAnswer(link)) return link.trim();
  return normalizeSheetAnswer(answer);
}

export function normalizeSheetAnswer(answer: unknown): string {
  if (Array.isArray(answer)) {
    const parts = answer.map((part) => String(part ?? '').trim()).filter(Boolean);
    if (parts.length === 0) return '';
    return parts.join(' - ');
  }
  return String(answer ?? '').trim();
}

export function isEmptyMediaAnswer(raw: string): boolean {
  const value = raw.trim().toLowerCase();
  if (!value) return true;
  if (value.includes('none###') || value.includes('##none##')) return true;
  const last = value.split('?')[0].split('/').filter(Boolean).pop() ?? '';
  return EMPTY_MARKERS.has(last);
}

export function fileManagerDownloadUrl(raw: string): string {
  if (!raw || isEmptyMediaAnswer(raw)) return '';
  if (/^https?:\/\//i.test(raw)) return raw;

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const trimmed = raw.trim();
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  if (/^\/download\//i.test(path)) {
    return `${base}/filemanager${path}`;
  }
  if (trimmed.includes('/')) {
    return `${base}/filemanager${path}`;
  }
  if (/^[0-9a-f-]{24,36}$/i.test(trimmed)) {
    return `${base}/filemanager/download/${trimmed}`;
  }
  return `${base}/filemanager/download/${trimmed.replace(/^\//, '')}`;
}

export function fileNameFromDownloadPath(raw: string): string {
  if (!raw || isEmptyMediaAnswer(raw)) return '';
  const last = raw.split('?')[0].split('/').filter(Boolean).pop() ?? '';
  let name = last;
  try {
    name = decodeURIComponent(last);
  } catch {
    // ignore
  }
  if (/^[0-9a-f-]{24,36}$/i.test(name)) return 'تصویر_پاسخ';
  const match = name.match(/^[0-9a-f-]{36}_[^_]+_(.+)$/i);
  return match?.[1] ?? name;
}

export function formatBytesFa(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '—';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1).replace(/\.0$/, '')} مگابایت`;
  const kb = bytes / 1024;
  return `${Math.max(1, Math.round(kb))} کیلوبایت`;
}

export function buildQuestionTypeMap(formData: {
  questionGroups?: { questions?: { questionId?: number; questionType?: string }[] }[];
} | null | undefined): Record<string, string> {
  const map: Record<string, string> = {};
  const groups = formData?.questionGroups ?? [];
  for (const group of groups) {
    for (const question of group.questions ?? []) {
      if (question.questionId != null && question.questionType) {
        map[String(question.questionId)] = question.questionType;
      }
    }
  }
  return map;
}