'use client';

import React from 'react';
import { CgClose } from 'react-icons/cg';
import { Box, Button, CircularProgress, Dialog, DialogContent, IconButton, Typography } from '@mui/material';

type TMemberToRemove =
    | { id: number; name: string }
    | { id: number; userName: string; userFamily: string };

interface IRemoveGroupConfirmModalProps {
    open: boolean;
    loading: boolean;
    title: string;
    onClose: () => void;
    groupsToRemove: TMemberToRemove[]
    onConfirm: () => void;
}

export const buttonStylesError = {
    bgcolor: '#FA4D56',
    borderColor: '#FA4D56',
    minWidth: "100px",
    '&:hover': {
        bgcolor: '#C6394D',
    },
    '&:active': {
        bgcolor: '#A32A3A',
    },
};

export const buttonStyles = {
    height: '50px',
    fontWeight: '400',
    fontSize: '15px',
    borderRadius: '10px',
    boxShadow: 'none',
    transition: 'background-color 0.3s, border-color 0.3s',
};

function getDisplayName(g: TMemberToRemove): string {
    return "name" in g ? g.name : `${g.userName} ${g.userFamily}`;
}

export const RemoveGroupConfirmModal: React.FC<IRemoveGroupConfirmModalProps> = ({
    open,
    title,
    loading,
    onClose,
    groupsToRemove,
    onConfirm,
}) => {

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
                    maxWidth: '600px',
                },
                '& .MuiDialog-container': {
                    backdropFilter: 'blur(4px)',
                    backgroundColor: 'hsl(0deg 0% 100% / 50%)',
                },
            }}
        >
            <Box className="flex items-center justify-start" sx={{ px: 2, pt: 2 }}>
                <IconButton onClick={onClose} aria-label="بستن">
                    <CgClose color="#404040" size="1.5rem" />
                </IconButton>
            </Box>

            <DialogContent
                dir="rtl"
                sx={{
                    maxHeight: '75vh',
                    paddingX: 1,
                    paddingTop: 0,
                    paddingBottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    شما در حال لغو تخصیص {title}ی زیر هستید:
                </Typography>

                {groupsToRemove.map((g: TMemberToRemove, index) => (
                    <Typography variant="subtitle1" key={g.id} sx={{ mb: 0.5 }}>
                        {getDisplayName(g)} - {index + 1}
                    </Typography>
                ))}

                <Typography color="error" mt={2}>
                    آیا از لغو تخصیص این {title} مطمئن هستید؟
                </Typography>

                <Box display="flex" justifyContent="center" alignItems="center" pb={2} gap="16px" px="16px" mt="14px">
                    <Button
                        onClick={() => onConfirm()}
                        variant="contained"
                        disabled={loading}
                        sx={{ ...buttonStyles, ...buttonStylesError }}
                    >
                        {loading ? <CircularProgress size={22} /> : "بله، لغو تخصیص"}
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => {
                            onClose()
                        }}
                        sx={{
                            height: "50px",
                            fontWeight: "700",
                            borderRadius: "10px",
                            fontSize: "16px",
                            color: "#1758BA",
                            borderColor: "#1758BA",
                            bgcolor: "white",
                            "&:hover": {
                                bgcolor: "transparent",
                                boxShadow: "none",
                            },
                            "&.Mui-disabled": {
                                borderColor: "#d9d9d9",
                                color: "#b0b0b0",
                            },
                        }}
                    >
                        انصراف
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};