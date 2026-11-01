'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { CgClose } from 'react-icons/cg';
import { IoAdd, IoCheckmarkCircle } from 'react-icons/io5';
import { Box, Button, CircularProgress, Dialog, DialogContent, LinearProgress, TextField, Typography } from '@mui/material';
import { WeuiDeleteOutlined } from '@/../public/images/icons/DeleteIcon';
import { useRunMajorFormula } from './hooks/useRunMajorFormula';

const MAX_ROWS = 5;
const REF_ID_KEY = '{#REF_ID}';
const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

interface ParamRow {
  id: number;
  key: string;
  value: string;
}

interface FormulaValidateDialogProps {
  open: boolean;
  onClose: () => void;
  label: string;
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    height: '46px',
    backgroundColor: '#fff',
    '& fieldset': { borderColor: '#DDE1E6' },
    '&:hover fieldset': { borderColor: '#8CB5E8' },
    '&.Mui-focused fieldset': { borderColor: '#8CB5E8', borderWidth: '1px' },
    '&.Mui-disabled': { backgroundColor: '#F7F8FA' },
  },
  '& input': { fontSize: '14px', fontWeight: 600 },
};

const latinInputSx = {
  ...inputSx,
  '& input': {
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif !important",
  },
};

const BUTTON_SIZE = { xs: 42, sm: 46 };
const VALUE_WIDTH = { xs: 76, sm: 110 };
const ROW_GAP = { xs: 1, sm: 1.5 };

const squareButtonSx = {
  minWidth: BUTTON_SIZE,
  width: BUTTON_SIZE,
  height: BUTTON_SIZE,
  padding: 0,
  borderRadius: '10px',
  flexShrink: 0,
};

const toLatinNumber = (value: string) => {
  const latin = value.replace(/[۰-۹٠-٩]/g, (digit) => {
    const persian = PERSIAN_DIGITS.indexOf(digit);
    return String(persian !== -1 ? persian : ARABIC_DIGITS.indexOf(digit));
  });
  const cleaned = latin.replace(/[^\d.-]/g, '');
  const [whole, ...rest] = cleaned.replace(/(?!^)-/g, '').split('.');
  return rest.length ? `${whole}.${rest.join('')}` : whole;
};

const formatResult = (result: unknown) => {
  if (result === undefined || result === null) return '—';
  if (typeof result === 'string') return result;
  return JSON.stringify(result);
};

const createRow = (rows: ParamRow[], key = ''): ParamRow => ({
  id: rows.reduce((max, row) => Math.max(max, row.id), 0) + 1,
  key,
  value: '',
});

export default function FormulaValidateDialog({ open, onClose, label }: FormulaValidateDialogProps) {
  const { mutate: runFormula, isPending } = useRunMajorFormula();
  const [accessKey, setAccessKey] = useState('');
  const [rows, setRows] = useState<ParamRow[]>(() => [createRow([], REF_ID_KEY)]);
  const [showErrors, setShowErrors] = useState(false);
  const [result, setResult] = useState<{ value: unknown } | null>(null);

  const keyCounts = rows.reduce<Record<string, number>>((counts, row) => {
    const key = row.key.trim();
    if (key) counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});

  const isRowKeyInvalid = (row: ParamRow) => !row.key.trim() || keyCounts[row.key.trim()] > 1;
  const isRowValueInvalid = (row: ParamRow) => row.value === '' || !Number.isFinite(Number(row.value));
  const hasDuplicateKey = Object.values(keyCounts).some((count) => count > 1);
  const isAccessKeyInvalid = !accessKey.trim();
  const hasRowError = rows.some((row) => isRowKeyInvalid(row) || isRowValueInvalid(row));

  const updateRow = (id: number, patch: Partial<ParamRow>) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const removeRow = (id: number) => {
    setRows((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current));
  };

  const addRow = () => {
    setRows((current) => (current.length < MAX_ROWS ? [...current, createRow(current)] : current));
  };

  const handleRun = () => {
    setShowErrors(true);
    if (isAccessKeyInvalid || hasRowError) return;

    const metaParameters = Object.fromEntries(rows.map((row) => [row.key.trim(), Number(row.value)]));

    setResult(null);
    runFormula(
      { accessKey: accessKey.trim(), label, metaParameters },
      {
        onSuccess: (value) => setResult({ value }),
        onError: (error) => toast.error(error.message),
      },
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      dir="ltr"
      sx={{
        overflow: 'hidden',
        scrollbarWidth: 'none',
        '& .MuiPaper-root': {
          borderRadius: '24px',
          margin: '10px',
          width: '100%',
          maxWidth: '500px',
        },
        '& .MuiDialog-container': {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'hsl(0deg 0% 100% / 50%)',
        },
      }}>
      <div className="flex items-center justify-start">
        <button type="button" className="mx-4 mt-4 mb-0" onClick={onClose} aria-label="بستن">
          <CgClose size="1.5rem" color="#404040" />
        </button>
      </div>

      <DialogContent dir="rtl" sx={{ maxHeight: '80vh', scrollbarWidth: 'thin', paddingX: 3, paddingTop: 0 }}>
        <p className="font-bold text-center text-[20px]" style={{ marginBottom: 24 }}>
          صحت‌سنجی فرمول
        </p>

        <Box display="flex" flexDirection="column" gap="18px">
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography fontWeight="600" fontSize="15px">
              کلید دسترسی:
            </Typography>
            <TextField
              fullWidth
              value={accessKey}
              onChange={(event) => setAccessKey(event.target.value)}
              disabled={isPending}
              error={showErrors && isAccessKeyInvalid}
              helperText={showErrors && isAccessKeyInvalid ? 'کلید دسترسی الزامی است' : undefined}
              sx={latinInputSx}
              slotProps={{ htmlInput: { dir: 'ltr', autoComplete: 'off', spellCheck: false } }}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <Typography fontWeight="600" fontSize="15px">
              شناسه فرمول:
            </Typography>
            <TextField fullWidth value={label} disabled sx={latinInputSx} slotProps={{ htmlInput: { dir: 'ltr' } }} />
          </Box>

          <Box display="flex" flexDirection="column" gap={1} mt={1} mb={2}>
            <Box display="flex" alignItems="center" gap={ROW_GAP}>
              <Typography fontWeight="600" fontSize="15px" sx={{ width: VALUE_WIDTH, flexShrink: 0 }}>
                مقدار:
              </Typography>
              <Typography fontWeight="600" fontSize="15px" sx={{ flex: 1 }}>
                کلید:
              </Typography>
              <Box
                sx={{
                  width: rows.length < MAX_ROWS ? { xs: 92, sm: 104 } : BUTTON_SIZE,
                  flexShrink: 0,
                }}
              />
            </Box>

            {rows.map((row, index) => {
              const isLast = index === rows.length - 1;
              return (
                <Box key={row.id} display="flex" alignItems="center" gap={ROW_GAP}>
                  <TextField
                    value={row.value}
                    onChange={(event) => updateRow(row.id, { value: toLatinNumber(event.target.value) })}
                    placeholder="مقدار"
                    disabled={isPending}
                    error={showErrors && isRowValueInvalid(row)}
                    sx={{ ...latinInputSx, width: VALUE_WIDTH, flexShrink: 0 }}
                    slotProps={{ htmlInput: { dir: 'ltr', inputMode: 'decimal', style: { textAlign: 'center' } } }}
                  />
                  <TextField
                    value={row.key}
                    onChange={(event) => updateRow(row.id, { key: event.target.value })}
                    placeholder="کلید"
                    disabled={isPending}
                    error={showErrors && isRowKeyInvalid(row)}
                    sx={{ ...latinInputSx, flex: 1, minWidth: 0 }}
                    slotProps={{ htmlInput: { dir: 'ltr', autoComplete: 'off', spellCheck: false } }}
                  />
                  <Button
                    variant="outlined"
                    aria-label="حذف ردیف"
                    onClick={() => removeRow(row.id)}
                    disabled={isPending || rows.length === 1}
                    sx={{
                      ...squareButtonSx,
                      color: '#FA4D56',
                      borderColor: '#FA4D56',
                      '&:hover': { borderColor: '#FA4D56', backgroundColor: '#FFF5F5' },
                      '&.Mui-disabled': { borderColor: '#F3C5C8', opacity: 0.5 },
                    }}>
                    <WeuiDeleteOutlined width={22} height={22} />
                  </Button>
                  {rows.length < MAX_ROWS && (
                    <Button
                      variant="outlined"
                      aria-label="افزودن ردیف"
                      onClick={addRow}
                      disabled={isPending}
                      sx={{
                        ...squareButtonSx,
                        visibility: isLast ? 'visible' : 'hidden',
                        color: '#1758BA',
                        borderColor: '#1758BA',
                        '&:hover': { borderColor: '#1758BA', backgroundColor: '#F1F6FD' },
                      }}>
                      <IoAdd size={24} />
                    </Button>
                  )}
                </Box>
              );
            })}

            <Typography fontSize="12px" color={showErrors && hasRowError ? '#FA4D56' : '#9EA3AC'}>
              {showErrors && hasDuplicateKey
                ? 'کلید تکراری است'
                : showErrors && hasRowError
                  ? 'کلید و مقدار همه‌ی ردیف‌ها را کامل کنید'
                  : ``}
            </Typography>
          </Box>

          {isPending && (
            <Box
              sx={{
                borderRadius: '14px',
                border: '1px solid #DDE1E6',
                backgroundColor: '#F8FAFC',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}>
              <Typography fontSize="13px" color="#6F7782" textAlign="center">
                در حال محاسبه‌ی فرمول، لطفاً صبر کنید...
              </Typography>
              <LinearProgress sx={{ borderRadius: 4, height: 6, backgroundColor: '#E6EEFB', '& .MuiLinearProgress-bar': { backgroundColor: '#1758BA' } }} />
            </Box>
          )}

          {result && !isPending && (
            <Box
              sx={{
                borderRadius: '14px',
                border: '1px solid #BBEBD5',
                backgroundColor: '#ECFDF5',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
              }}>
              <IoCheckmarkCircle size={44} color="#2F855A" />
              <Typography fontSize="14px" fontWeight="700" color="#2F855A">
                نتیجه
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  borderRadius: '10px',
                  backgroundColor: '#fff',
                  border: '1px solid #D7F0E3',
                  padding: '10px 12px',
                }}>
                <Box
                  dir="ltr"
                  title={formatResult(result.value)}
                  style={{ textAlign: Array.isArray(result.value) ? 'left' : 'center' }}
                  sx={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace !important',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    color: '#161616',
                    wordBreak: 'break-all',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                  {formatResult(result.value)}
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: '16px', width: '100%', marginTop: '28px', marginBottom: 1 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleRun}
            disabled={isPending}
            sx={{
              bgcolor: '#1758BA',
              height: '50px',
              fontSize: '16px',
              fontWeight: '700',
              borderRadius: '10px',
              boxShadow: 'none',
              whiteSpace: 'nowrap',
              '&:hover': { bgcolor: '#134a9e', boxShadow: 'none' },
            }}>
            {isPending ? (
              <>
                <CircularProgress size={18} color="inherit" style={{ marginLeft: 8 }} />
                در حال محاسبه
              </>
            ) : (
              'نتیجه'
            )}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={onClose}
            sx={{
              height: '50px',
              fontWeight: '700',
              borderRadius: '10px',
              fontSize: '16px',
              color: '#1758BA',
              borderColor: '#1758BA',
            }}>
            بستن
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
