'use client';

import { ReactNode } from 'react';
import { Box, Grid2, IconButton, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import { IoClose } from 'react-icons/io5';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface BottomSheetProps {
  open: boolean;
  onClose: (event: unknown, reason: string) => void;
  icon?: ReactNode;
  title?: ReactNode | string;
  children: ReactNode;
}

const sheetSpring = { type: 'spring' as const, stiffness: 420, damping: 38, mass: 0.9 };
const backdropEase = { duration: 0.22, ease: [0.32, 0.72, 0, 1] as const };

const BottomSheet: React.FC<BottomSheetProps> = ({ open, onClose, icon, title, children }) => {
  const reduceMotion = useReducedMotion();

  const handleClose = (reason = 'backdropClick') => {
    onClose({}, reason);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1400] flex items-end justify-center">
          <motion.button
            type="button"
            aria-label="بستن"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : backdropEase}
            onClick={() => handleClose('backdropClick')}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bottom-sheet-title"
            className="relative z-[1] w-full outline-none md:w-1/2"
            initial={reduceMotion ? false : { y: '110%' }}
            animate={{ y: 0 }}
            exit={reduceMotion ? undefined : { y: '110%' }}
            transition={reduceMotion ? { duration: 0 } : sheetSpring}
            drag={reduceMotion ? false : 'y'}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.04, bottom: 0.55 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 500) {
                handleClose('swipe');
              }
            }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: 'white',
                borderTopLeftRadius: '1.5rem',
                borderTopRightRadius: '1.5rem',
                boxShadow:
                  '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                pb: 'env(safe-area-inset-bottom)',
              }}>
              <Grid2 container>
                <Grid2 size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center', pt: 1.25 }}>
                  <Divider
                    sx={{
                      width: '3.5rem',
                      height: '0.28rem',
                      borderRadius: 999,
                      backgroundColor: '#C7C7CC',
                    }}
                  />
                </Grid2>
                <Grid2
                  size={{ xs: 12 }}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '4px',
                  }}>
                  <IconButton
                    edge="end"
                    color="inherit"
                    onClick={() => handleClose('closeButton')}
                    aria-label="close"
                    sx={{ marginRight: '1rem' }}
                    className="active:scale-90">
                    <IoClose />
                  </IconButton>
                  <Grid2
                    size={{ xs: 12 }}
                    sx={{
                      display: 'flex',
                      justifyContent: 'start',
                      alignItems: 'center',
                      marginLeft: '1rem',
                    }}>
                    {icon && <Box sx={{ marginLeft: '2px' }}>{icon}</Box>}
                    {title && (
                      <Typography
                        id="bottom-sheet-title"
                        variant="h2"
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: '400',
                        }}>
                        {title}
                      </Typography>
                    )}
                  </Grid2>
                </Grid2>
                <Grid2
                  size={{ xs: 12 }}
                  sx={{
                    overflowY: 'auto',
                    maxHeight: 'calc(100dvh - 100px)',
                    padding: '16px',
                  }}>
                  {children}
                </Grid2>
              </Grid2>
            </Box>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
