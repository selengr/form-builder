export type StartFromContinueModalMode =
  /** Guest, continue ON, no phone limit */
  | 'guest_optional_phone'
  /** Guest, phone required */
  | 'guest_required_phone'
  /** Logged in, continue ON, no phone limit */
  | 'logged_in_choose_continue'
  /** Logged in, phone required */
  | 'logged_in_limitation_confirm';

export const START_FROM_CONTINUE_COPY = {
  optionalPhoneInfo: `می‌توانید فرم را نیمه‌کاره رها کنید و دوباره به آن برگردید!
این فرم به شما امکان می‌دهد در صورت وقفه، بعداً از همانجایی که آن را رها کرده‌اید ادامه دهید.
• اگر اولین بار است که این فرم را تکمیل می‌کنید، با شروع فرم جدید ادامه دهید.
• اگر قبلاً این فرم را آغاز کرده‌اید، پاسخ‌های قبلی شما بازیابی خواهد شد.`,

  requiredPhoneInfo: `برای پاسخ دادن به این فرم لازم است که شماره همراه خود را وارد کنید!
برای جلوگیری از ثبت پاسخ تکراری لازم است شماره همراه شما ثبت شود. اگر قبلاً این فرم را تکمیل کرده باشید، امکان دسترسی مجدد نخواهید داشت.`,

  loggedInLimitationInfo: `این فرم محدودیت پاسخ‌دهی دارد!
امکان پاسخ‌دهی مجدد توسط سازنده فرم محدود شده است.
پس از تکمیل نهایی، امکان شرکت مجدد وجود ندارد.
• اگر اولین بار است، فرم را شروع کنید.
• اگر قبلاً آغاز کرده‌اید، از همان‌جا ادامه دهید.`,

  welcomeResumeToast:
    'به ادامه نشست قبلی خوش آمدید! پاسخ‌های قبلی شما بازیابی شد و می‌توانید از همان جایی که متوقف شده بودید ادامه دهید.',

  phoneRegisteredToast: 'شماره تماس شما با موفقیت ثبت شد.',

  accessDenied:
    'شما قبلاً به این فرم پاسخ داده‌اید. امکان پاسخ‌دهی مجدد توسط سازنده فرم محدود شده است. از مشارکت شما سپاسگزاریم.',

  attentionTitle: 'توجه',
  dialogTitle: 'شروع از ادامه',

  questionOptional: 'می‌توانید شماره همراه را وارد کنید یا مستقیم وارد فرم شوید.',
  questionRequired: 'آیا مایل به ادامه با ثبت شماره همراه هستید؟',
  questionLoggedInLimitation: 'آیا مایل به ادامه هستید؟',
  questionChoose: 'چگونه می‌خواهید ادامه دهید؟',

  btnSkipEnterForm: 'رد کردن و ورود به فرم',
  btnEnterPhone: 'ورود شماره همراه',
  btnCancel: 'انصراف',
  btnYesContinue: 'بله، ادامه',
  btnStartNew: 'شروع فرم جدید',
  btnContinuePrevious: 'ادامه فرم قبلی',
} as const;

export interface StartFromContinueScenarioInput {
  loggedInStatus: boolean | null | undefined;
  responseLimitation: string | null | undefined;
  startFromContinue: boolean | null | undefined;
}

export function resolveStartFromContinueModalMode(
  input: StartFromContinueScenarioInput,
): StartFromContinueModalMode {
  const isGuest = input.loggedInStatus === false;
  const hasLimitation = Boolean(input.responseLimitation);

  if (isGuest) {
    return hasLimitation ? 'guest_required_phone' : 'guest_optional_phone';
  }

  return hasLimitation ? 'logged_in_limitation_confirm' : 'logged_in_choose_continue';
}

export interface StartFromContinueModalContent {
  mode: StartFromContinueModalMode;
  body: string;
  question: string;
  secondary: {
    label: string;
    action: 'start_new' | 'cancel' | 'skip_enter';
  };
  primary: {
    label: string;
    action: 'continue_previous' | 'enter_phone' | 'confirm_limitation';
  };
}

export function getStartFromContinueModalContent(
  input: StartFromContinueScenarioInput,
): StartFromContinueModalContent {
  const mode = resolveStartFromContinueModalMode(input);
  const c = START_FROM_CONTINUE_COPY;

  switch (mode) {
    case 'guest_optional_phone':
      return {
        mode,
        body: c.optionalPhoneInfo,
        question: c.questionOptional,
        secondary: { label: c.btnSkipEnterForm, action: 'skip_enter' },
        primary: { label: c.btnEnterPhone, action: 'enter_phone' },
      };
    case 'guest_required_phone':
      return {
        mode,
        body: c.requiredPhoneInfo,
        question: c.questionRequired,
        secondary: { label: c.btnCancel, action: 'cancel' },
        primary: { label: c.btnYesContinue, action: 'confirm_limitation' },
      };
    case 'logged_in_limitation_confirm':
      return {
        mode,
        body: c.loggedInLimitationInfo,
        question: c.questionLoggedInLimitation,
        secondary: { label: c.btnCancel, action: 'cancel' },
        primary: { label: c.btnYesContinue, action: 'confirm_limitation' },
      };
    case 'logged_in_choose_continue':
    default:
      return {
        mode,
        body: c.optionalPhoneInfo,
        question: c.questionChoose,
        secondary: { label: c.btnStartNew, action: 'start_new' },
        primary: { label: c.btnContinuePrevious, action: 'continue_previous' },
      };
  }
}
