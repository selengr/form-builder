/**
 * PM scenarios for «شروع از ادامه» (from strart-from-continu.docx).
 *
 * Dimensions:
 * - user: logged-in | guest
 * - previous session: none | incomplete | complete  (resolved after OTP / check-answer; not always known at modal open)
 * - startFromContinue (form setting)
 * - responseLimitation (form setting)
 *
 * This module holds copy + modal modes we can decide with API flags available
 * when the dialog opens (`loggedInStatus`, `responseLimitation`, `startFromContinue`).
 * Toast / access-denied strings are exported for later hook wiring (post-OTP).
 */

export type StartFromContinueModalMode =
  /** Scenario 8 — guest, start-from-continue ON, no response limitation */
  | 'guest_optional_phone'
  /** Scenario 9/10 — guest, response limitation ON (phone required) */
  | 'guest_required_phone'
  /** Scenario 2-ish — logged-in, start-from-continue ON, no limitation: choose new vs continue */
  | 'logged_in_choose_continue'
  /** Logged-in + response limitation + start-from-continue: confirm before phone/continue flow */
  | 'logged_in_limitation_confirm';

export const START_FROM_CONTINUE_COPY = {
  /** Scenario 8 modal body */
  optionalPhoneInfo: `می‌توانید فرم را نیمه‌کاره رها کنید و دوباره به آن برگردید!
این فرم به شما امکان می‌دهد در صورت وقفه، بعداً از همانجایی که آن را رها کرده‌اید ادامه دهید.
• اگر اولین بار است که این فرم را تکمیل می‌کنید، با وارد کردن شماره همراه، پاسخ‌های شما ذخیره می‌شود تا بعداً بتوانید ادامه دهید.
• اگر قبلاً این فرم را آغاز کرده‌اید، پاسخ‌های قبلی شما بازیابی خواهد شد.
وارد کردن شماره همراه اختیاری است، اما اگر احتمال می‌دهید کارتان نیمه‌تمام بماند، توصیه می‌کنیم شماره همراه خود را وارد کنید.`,

  /** Scenario 9 / 10 modal body */
  requiredPhoneInfo: `برای پاسخ دادن به این فرم لازم است که شماره همراه خود را وارد کنید!
برای جلوگیری از ثبت پاسخ تکراری لازم است شماره همراه شما ثبت شود. اگر قبلاً این فرم را تکمیل کرده باشید، امکان دسترسی مجدد نخواهید داشت.`,

  /** Scenario 2 / 8 / 10 — toast after resuming incomplete session */
  welcomeResumeToast:
    'به ادامه نشست قبلی خوش آمدید! پاسخ‌های قبلی شما بازیابی شد و می‌توانید از همان جایی که متوقف شده بودید ادامه دهید.',

  /** Scenario 9 / 10 — toast after OTP when no previous session */
  phoneRegisteredToast: 'شماره تماس شما با موفقیت ثبت شد.',

  /** Scenario 3 / 5 / 9 / 10 — access denied page body */
  accessDenied:
    'شما قبلاً به این فرم پاسخ داده‌اید. امکان پاسخ‌دهی مجدد توسط سازنده فرم محدود شده است. از مشارکت شما سپاسگزاریم.',

  attentionTitle: 'توجه',
  dialogTitle: 'شروع از ادامه',

  questionOptional: 'می‌توانید شماره همراه را وارد کنید یا مستقیم وارد فرم شوید.',
  questionRequired: 'آیا مایل به ادامه با ثبت شماره همراه هستید؟',
  questionChoose: 'چگونه می‌خواهید ادامه دهید؟',

  btnSkipEnterForm: 'رد کردن و ورود به فرم',
  btnEnterPhone: 'ورود شماره همراه',
  btnCancel: 'انصراف',
  btnYesContinue: 'بله، ادامه',
  btnStartNew: 'شروع فرم جدید',
  btnContinuePrevious: 'ادامه فرم قبلی',
} as const;

export interface StartFromContinueScenarioInput {
  /** API: `loggedInStatus === false` means guest */
  loggedInStatus: boolean | null | undefined;
  /** API: form setting e.g. `PHONE_NUMBER` | `EMAIL` | null */
  responseLimitation: string | null | undefined;
  /** API: form setting — dialog only opens when true today */
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
  /** Left / secondary button */
  secondary: {
    label: string;
    action: 'start_new' | 'cancel' | 'skip_enter';
  };
  /** Right / primary button */
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
      // Scenario 8
      return {
        mode,
        body: c.optionalPhoneInfo,
        question: c.questionOptional,
        secondary: { label: c.btnSkipEnterForm, action: 'skip_enter' },
        primary: { label: c.btnEnterPhone, action: 'enter_phone' },
      };
    case 'guest_required_phone':
      // Scenario 9 / 10 (guest + limitation) — same modal copy
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
        body: c.requiredPhoneInfo,
        question: c.questionRequired,
        secondary: { label: c.btnCancel, action: 'cancel' },
        primary: { label: c.btnYesContinue, action: 'confirm_limitation' },
      };
    case 'logged_in_choose_continue':
    default:
      // Scenario 2 UI when user must pick; resume toast is shown by hooks later
      return {
        mode,
        body: c.optionalPhoneInfo,
        question: c.questionChoose,
        secondary: { label: c.btnStartNew, action: 'start_new' },
        primary: { label: c.btnContinuePrevious, action: 'continue_previous' },
      };
  }
}
