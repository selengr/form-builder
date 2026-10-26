'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { CgClose } from 'react-icons/cg';
import { styled } from '@mui/material/styles';
import { Autocomplete, Button, Dialog, DialogContent, IconButton, TextField } from '@mui/material';
import ConditionSection, { ConditionSectionHandle } from './condition/ConditionSection';
// import CalculatorSection, { CalculatorSectionHandle } from './calculator/CalculatorSection';
import { FormulaCalculator, type FormulaCalculatorHandle, parseFrontFormulaData } from '@/components/formula-calculator';
import { useGetCalculatorFields } from './calculator/hooks/useGetCalculatorFields';
import styles from './minorFormulaDialog.module.css';
import { FormulaFormOption, useGetFormulaForms } from './hooks/useGetFormulaForms';
import { useCreateMinorFormula } from './hooks/useCreateMinorFormula';
import { useUpdateMinorFormula } from './hooks/useUpdateMinorFormula';
import { useGetMinorFormula } from './hooks/useGetMinorFormula';
import MinorFormulaDialogSkeleton from './MinorFormulaDialogSkeleton';

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
  maxWidth: '100%',
  padding: 0,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
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
  minorId?: number | string;
}

interface MinorFormulaDialogContentProps {
  onClose: () => void;
  majorId: string;
  minorId?: number | string;
}

function MinorFormulaDialogContent({ onClose, majorId, minorId }: MinorFormulaDialogContentProps) {
  const {
    minorFormula,
    isFetching: isFetchingMinorFormula,
    error: minorFormulaError,
  } = useGetMinorFormula(minorId);
  const conditionRef = useRef<ConditionSectionHandle>(null);
  // const calculatorRef = useRef<CalculatorSectionHandle>(null);
  const calculatorRef = useRef<FormulaCalculatorHandle>(null);
  const [calculatorFormula, setCalculatorFormula] = useState('');
  const [calculatorFrontData, setCalculatorFrontData] = useState('');
  const [demoContainer, setDemoContainer] = useState<HTMLDivElement | null>(null);
  const handleCalculatorChange = useCallback((formula: string, frontCalcData: string) => {
    setCalculatorFormula(formula);
    setCalculatorFrontData(frontCalcData);
  }, []);

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<FormulaFormOption | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { formOptions, isFetchingForms } = useGetFormulaForms();
  const formId = selectedForm?.value ?? '';

  const savedFormId = minorFormula?.formulaModel?.formId ? String(minorFormula.formulaModel.formId) : '';
  const savedCalculatorElements = useMemo(
    () => parseFrontFormulaData(minorFormula?.formulaModel?.frontFormulaData),
    [minorFormula?.formulaModel?.frontFormulaData],
  );
  const [isPrefilled, setIsPrefilled] = useState(false);
  const [isConditionPrefilled, setIsConditionPrefilled] = useState(false);
  const handleConditionPrefilled = useCallback(() => setIsConditionPrefilled(true), []);

  useEffect(() => {
    if (!minorFormula || isFetchingMinorFormula || isPrefilled) return;
    if (savedFormId && isFetchingForms && formOptions.length === 0) return;

    setName(minorFormula.minorName ?? '');
    if (savedFormId) {
      const option = formOptions.find((item) => item.value === savedFormId);
      setSelectedForm(option ?? { value: savedFormId, label: savedFormId });
    }
    setIsPrefilled(true);
  }, [minorFormula, isFetchingMinorFormula, isPrefilled, savedFormId, isFetchingForms, formOptions]);

  const { mutate: createMinorFormula, isPending: isCreating } = useCreateMinorFormula(majorId);
  const { mutate: updateMinorFormula, isPending: isUpdating } = useUpdateMinorFormula(majorId);
  const isPending = isCreating || isUpdating;
  const contentRef = useRef<HTMLDivElement>(null);
  const calculatorWrapperRef = useRef<HTMLDivElement>(null);
  const formFieldRef = useRef<HTMLDivElement>(null);
  const [isFormListOpen, setIsFormListOpen] = useState(false);

  const handleSelectFormRequest = () => {
    formFieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    formFieldRef.current?.querySelector('input')?.focus({ preventScroll: true });
    setIsFormListOpen(true);
  };

  const { questionList: calculatorFields, isFetchingCalculatorFields } = useGetCalculatorFields(formId);

  const isEditLoading =
    Boolean(minorId) &&
    !minorFormulaError &&
    (!isPrefilled || (Boolean(savedFormId) && (!isConditionPrefilled || isFetchingCalculatorFields)));

  const canAddCalculatorField = () => {
    if (formId) return true;
    toast.error('ابتدا فرم را انتخاب کنید');
    handleSelectFormRequest();
    return false;
  };

  const scrollToFirstError = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const firstError = contentRef.current?.querySelector<HTMLElement>('.Mui-error');
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  };

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

    const condition = await conditionRef.current?.getCondition();
    if (hasError || !condition) {
      scrollToFirstError();
      return;
    }

    const calculator = calculatorRef.current?.getResult();
    if (!calculator) {
      calculatorWrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const payload = {
      majorId: Number(majorId),
      minorName: name.trim(),
      formulaModel: {
        formId: Number(formId),
        formula: calculator.formula,
        frontFormulaData: calculator.frontCalcData,
        condition,
      },
    };

    const callbacks = {
      onSuccess: () => {
        toast.success(minorId ? 'فرمول جزئی با موفقیت ویرایش شد' : 'فرمول جزئی با موفقیت ثبت شد');
        onClose();
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    };

    if (minorId) {
      updateMinorFormula({ id: Number(minorId), ...payload }, callbacks);
    } else {
      createMinorFormula(payload, callbacks);
    }
  };

  return (
    <div dir="rtl" ref={contentRef} className="flex flex-col flex-1 min-h-0">
      <IconButton
        onClick={onClose}
        aria-label="بستن"
        sx={{ position: 'absolute', top: '21px', right: '21px', p: 0.5 }}>
        <CgClose color="#404040" size="1.4rem" />
      </IconButton>

      <div
        className="flex-1 min-h-0"
        style={{ overflowY: 'auto', overflowX: 'hidden', padding: '36px 24px 24px', scrollbarWidth: 'thin' }}>
        <h2 className="text-[16px] font-bold text-[#404040] text-center">فرمول ساز</h2>

        {minorId && minorFormulaError && (
          <p className="text-center text-[13px]" style={{ marginTop: 6, color: '#FA4D56' }}>
            {(minorFormulaError as Error).message}
          </p>
        )}

        {isEditLoading && <MinorFormulaDialogSkeleton />}

        <div style={isEditLoading ? { display: 'none' } : undefined}>
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

          <div ref={formFieldRef} className="flex flex-col" style={{ marginTop: 8 }}>
            <label className={labelClass} style={{ marginBottom: 4 }}>
              انتخاب فرم:
            </label>
            <Autocomplete
              open={isFormListOpen}
              onOpen={() => setIsFormListOpen(true)}
              onClose={() => setIsFormListOpen(false)}
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
            <ConditionSection
              key={formId}
              ref={conditionRef}
              formId={formId}
              minorId={minorId}
              majorId={majorId}
              minorName={name}
              calculatorFormula={calculatorFormula}
              calculatorFrontData={calculatorFrontData}
              initialCondition={
                formId && formId === savedFormId ? (minorFormula?.formulaModel?.condition ?? null) : undefined
              }
              demoContainer={demoContainer}
              onPrefilled={handleConditionPrefilled}
              onSelectFormRequest={handleSelectFormRequest}
            />
          </div>

          <div ref={calculatorWrapperRef} style={{ marginTop: 12 }}>
            {/* <CalculatorSection key={formId} ref={calculatorRef} formId={formId} onFormulaChange={setCalculatorFormula} onSelectFormRequest={handleSelectFormRequest} /> */}
            <FormulaCalculator
              key={formId}
              ref={calculatorRef}
              fields={calculatorFields}
              initialElements={formId && formId === savedFormId ? savedCalculatorElements : undefined}
              beforeAddField={canAddCalculatorField}
              onFormulaChange={handleCalculatorChange}
              showFormulaPreview
              scriptLayout="stretch"
            />
          </div>

          <div ref={setDemoContainer} />
        </div>
      </div>

      <div
        className="flex justify-center w-full shrink-0"
        style={{ gap: 16, padding: '16px 24px 21px', borderTop: '1px solid #EEF0F3', backgroundColor: '#fff' }}>
        <Button
          onClick={handleSubmit}
          disabled={isPending}
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
          {isPending ? 'در حال ثبت...' : 'تایید'}
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

export default function MinorFormulaDialog({ open, onClose, majorId, minorId }: MinorFormulaDialogProps) {
  return (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <StyledDialogContent>
        <MinorFormulaDialogContent key={minorId ?? 'new'} onClose={onClose} majorId={majorId} minorId={minorId} />
      </StyledDialogContent>
    </StyledDialog>
  );
}
