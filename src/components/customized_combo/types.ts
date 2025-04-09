export type IUIAccordionProps = {
  label: string;
  details: string;
  tabIndex?: number;
  name: string;
  checked: boolean;
  handle_payWith: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export type TAccount = {
  accountId: number;
  creditType: string;
  creditTypeEnum: string | 'MHESAM_DONATION' | 'MHESAM_NORMAL';
  totalAmount: number;
  availableAmount: number;
  order: number;
  expireDate: null | object | any;
};

export type TUICustomizedCombo = {
  placeholder: string;
  label?: string;
  account: TAccount[] | [];
  selectedCredits: (value: TAccount[]) => void;
};
