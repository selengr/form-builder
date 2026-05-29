import { Button } from "@mui/material";
import ConfirmDialog from "../confirm-dialog";

interface ConfirmationPublishDialogProps {
    open: boolean;
    loading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

// ----------------------------------------------------------
export const ConfirmationPublishDialog = ({
    open,
    loading,
    onClose,
    onConfirm,
}: ConfirmationPublishDialogProps) => {
    return (
        <ConfirmDialog
            open={open}

            onClose={onClose}
            title={`تأیید انتشار فرم`}
            content='پس از نهایی کردن فرم، امکان ویرایش یا تغییر آن وجود نخواهد داشت. آیا ادامه می‌دهید؟'
            cancelText='انصراف'
            loading={loading}
            action={
                <Button
                    fullWidth
                    disabled={loading}
                    variant='contained'
                    onClick={onConfirm}
                    sx={{
                        fontWeight: '400',
                        fontSize: '15px',
                        height: '50px',
                        borderRadius: '8px',
                        '&:hover': {
                            bgcolor: (theme) => theme.palette.primary.main,
                        },
                    }}>
                    انتشار فرم
                </Button>
            }
        />
    );
};