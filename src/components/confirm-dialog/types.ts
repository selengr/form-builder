export interface ConfirmDialogProps {
  title: React.ReactNode;
  content?: React.ReactNode;
  action: React.ReactNode;
  cancelStatus?: boolean;
  cancelText?: string;
  open: boolean;
  onClose: () => void;
  loading?: boolean;
}
