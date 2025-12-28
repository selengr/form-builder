'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useResponsive } from '@/hooks/useResponsive';
import { useIframeDetector } from '@/hooks/useIframeDetector';

interface AnimatedBoxProps {
  children: ReactNode;
  direction?: 'forward' | 'backward'; 
}

export default function AnimatedBox({ children, direction = 'forward' }: AnimatedBoxProps) {
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
      : 'my-8';

  const xOffset = isMobile ? 30 : 50;
  const xInitial = direction === 'forward' ? xOffset : -xOffset;
  const xExit = direction === 'forward' ? -xOffset : xOffset;

  return (
    <motion.div
      initial={{ opacity: 0, x: xInitial, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: xExit, scale: 0.98 }}
      transition={{
        x: { type: 'spring', stiffness: 300, damping: 25, mass: 0.5 },
        opacity: { duration: 0.15, ease: 'easeInOut' }
      }}
      className={`
        w-full h-full
        flex 
        rounded-xl
        ${marginClass}
        ${paddingClass}
      `}
    >
      {children}
    </motion.div>
  );
}

// 'use client';

// import { ReactNode } from 'react';
// import { motion } from 'framer-motion';
// import { useResponsive } from '@/hooks/useResponsive';
// import { useIframeDetector } from '@/hooks/useIframeDetector';

// export default function AnimatedBox({ children }: { children: ReactNode }) {
//   const isMobile = useResponsive('down', 'md');
//   const { isInIframe, modalSize } = useIframeDetector();


//   const paddingClass = isInIframe
//     ? modalSize === 'small'
//       ? 'p-4 py-1'
//       : modalSize === 'medium'
//         ? 'p-8'
//         : 'p-12'
//     : isMobile
//       ? 'p-6'
//       : 'p-12';

//   const marginClass = isInIframe
//     ? modalSize === 'small'
//       ? 'my-0'
//       : modalSize === 'medium'
//         ? 'my-4'
//         : 'my-8'
//     : isMobile
//       ? 'my-4'
//       : 'my-8'


//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ ease: 'easeInOut', duration: 1 }}
//       className={`
//         w-full h-full 
//         flex align-middle 
//         rounded-xl 
//         ${marginClass}
//         ${paddingClass} 
//       `}>
//       {children}
//     </motion.div>
//   );
// }
