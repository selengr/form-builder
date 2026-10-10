'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { CgClose } from 'react-icons/cg';
import { styled } from '@mui/material/styles';
import { Autocomplete, Button, Dialog, DialogContent, IconButton, TextField } from '@mui/material';
import ConditionSection, { ConditionSectionHandle } from './condition/ConditionSection';
import CalculatorSection, { CalculatorSectionHandle } from './calculator/CalculatorSection';
import styles from './minorFormulaDialog.module.css';
import { FormulaFormOption, useGetFormulaForms } from './hooks/useGetFormulaForms';

const StyledDialog = styled(Dialog)({
  overflow: 'hidden',
  scrollbarWidth: 'none',
  '& .MuiPaper-root': {
    borderRadius: '24px',
    margin: '10px',
    width: '100%',
    maxWidth: '900px',
  },
  '& .MuiDialog-container': {
    backdropFilter: 'blur(4px)',
    backgroundColor: 'hsl(0deg 0% 100% / 50%)',
  },
});

const StyledDialogContent = styled(DialogContent)({
  maxHeight: '90vh',
  scrollbarWidth: 'thin',
  maxWidth: '100%',
  padding: '36px 24px 21px',
  overflowX: 'hidden',
});

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    height: '52px',
    backgroundColor: '#fff',
    transition: 'all 180ms ease',
    '& fieldset': { borderColor: '#DDE1E6' },
    '&:hover': {
      backgroundColor: '#FCFDFF',
      '& fieldset': { borderColor: '#8CB5E8' },
    },
    '&.Mui-focused': {
      backgroundColor: '#FCFDFF',
      '& fieldset': { borderColor: '#8CB5E8', borderWidth: '1px' },
    },
  },
  '& input': {
    px: 1.5,
    height: '52px',
    fontSize: '14px',
  },
};

const labelClass = 'block text-[14px] font-medium text-[#161616]';

interface MinorFormulaDialogProps {
  open: boolean;
  onClose: () => void;
  majorId: string;
}

interface MinorFormulaDialogContentProps {
  onClose: () => void;
  majorId: string;
}

function MinorFormulaDialogContent({ onClose, majorId }: MinorFormulaDialogContentProps) {
  const conditionRef = useRef<ConditionSectionHandle>(null);
  const calculatorRef = useRef<CalculatorSectionHandle>(null);
  const [calculatorFormula, setCalculatorFormula] = useState('');

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<FormulaFormOption | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { formOptions, isFetchingForms } = useGetFormulaForms();
  const formId = selectedForm?.value ?? '';

  const handleSubmit = async () => {
    let hasError = false;

    if (!name.trim()) {
      setNameError('نام فرمول الزامی است');
      hasError = true;
    }

    if (!formId) {
      setFormError('انتخاب فرم الزامی است');
      hasError = true;
    }

    const conditions = await conditionRef.current?.validate();
    const calculator = calculatorRef.current?.getResult();

    if (hasError || !conditions || !calculator) return;

    const payload = {
      majorId: Number(majorId),
      name: name.trim(),
      formId: Number(formId),
      conditions,
      formula: calculator.formula,
      frontCalcData: calculator.frontCalcData,
    };

    console.log('[MinorFormulaDialog] payload:', JSON.stringify(payload, null, 2));
    toast.info('ثبت فرمول جزئی پس از دریافت API آن متصل می‌شود');
  };

  return (
    <div dir="rtl">
      <IconButton
        onClick={onClose}
        aria-label="بستن"
        sx={{ position: 'absolute', top: '21px', right: '21px', p: 0.5 }}>
        <CgClose color="#404040" size="1.4rem" />
      </IconButton>

      <h2 className="text-[16px] font-bold text-[#404040] text-center">فرمول ساز</h2>

      <div className="flex flex-col" style={{ marginTop: 6 }}>
        <label className={labelClass} style={{ marginBottom: 4 }}>
          نام:
        </label>
        <TextField
          fullWidth
          placeholder="نام فرمول"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (nameError) setNameError(null);
          }}
          error={Boolean(nameError)}
          helperText={nameError}
          sx={inputSx}
          slotProps={{ htmlInput: { className: styles.input } }}
        />
      </div>

      <div className="flex flex-col" style={{ marginTop: 8 }}>
        <label className={labelClass} style={{ marginBottom: 4 }}>
          انتخاب فرم:
        </label>
        <Autocomplete
          options={formOptions}
          value={selectedForm}
          onChange={(_, option) => {
            setSelectedForm(option);
            if (formError) setFormError(null);
          }}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          noOptionsText="فرمی یافت نشد"
          loading={isFetchingForms}
          loadingText="در حال بارگذاری..."
          popupIcon={null}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="انتخاب فرم"
              error={Boolean(formError)}
              helperText={formError}
              sx={inputSx}
              inputProps={{ ...params.inputProps, className: `${params.inputProps.className ?? ''} ${styles.input}` }}
            />
          )}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <ConditionSection key={formId} ref={conditionRef} formId={formId} calculatorFormula={calculatorFormula} />
      </div>

      <div style={{ marginTop: 12 }}>
        <CalculatorSection key={formId} ref={calculatorRef} formId={formId} onFormulaChange={setCalculatorFormula} />
      </div>

      <div className="flex justify-center w-full" style={{ marginTop: 100, gap: 16 }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: '#1758BA',
            fontWeight: 600,
            fontSize: 14,
            borderRadius: '10px',
            height: '52px',
            minWidth: 116,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#134a9e', boxShadow: 'none' },
          }}>
          تایید
        </Button>

        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            height: '52px',
            minWidth: 116,
            fontWeight: 600,
            fontSize: 14,
            borderRadius: '10px',
            color: '#1758BA',
            borderColor: '#1758BA',
            background: '#fff',
            '&:hover': { background: '#F7F7FF', borderColor: '#1758BA' },
          }}>
          انصراف
        </Button>
      </div>
    </div>
  );
}

export default function MinorFormulaDialog({ open, onClose, majorId }: MinorFormulaDialogProps) {
  return (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <StyledDialogContent>
        <MinorFormulaDialogContent onClose={onClose} majorId={majorId} />
      </StyledDialogContent>
    </StyledDialog>
  );
}
