'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useResponsive } from '@/hooks/useResponsive';
import { useIframeDetector } from '@/hooks/useIframeDetector';

export default function AnimatedBox({ children }: { children: ReactNode }) {
  const isMobile = useResponsive('down', 'md');
  const { isInIframe, modalSize } = useIframeDetector();


  const paddingClass = isInIframe
    ? modalSize === 'small'
      ? 'p-4 py-1'
      : modalSize === 'medium'
        ? 'p-8'
        : 'p-12'
    : isMobile
      ? 'p-6'
      : 'p-12';

  const marginClass = isInIframe
    ? modalSize === 'small'
      ? 'my-0'
      : modalSize === 'medium'
        ? 'my-4'
        : 'my-8'
    : isMobile
      ? 'my-4'
      : 'my-8'


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: 'easeInOut', duration: 1 }}
      className={`
        w-full h-full 
        flex align-middle 
        rounded-xl 
        ${marginClass}
        ${paddingClass} 
      `}>
      {children}
    </motion.div>
  );
}
