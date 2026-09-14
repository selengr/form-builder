'use client';

import Image from 'next/image';
import { MenuData } from '@/constants/Sidebar.constant';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const barSpring = { type: 'spring' as const, stiffness: 380, damping: 32, mass: 0.85 };

export default function FooterTab() {
  const pathname = usePathname();
  const current = pathname.split('/')[2];
  const reduceMotion = useReducedMotion();
  const show = pathname === '/';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="md:hidden block mt-[60px]"
          initial={reduceMotion ? false : { y: 88, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduceMotion ? undefined : { y: 88, opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : barSpring}>
          <div className="fixed bottom-10 left-1/2 z-50 w-[90%] h-[77px] -translate-x-1/2 rounded-[28px] bg-[#070433] py-2 shadow-lg flex items-center justify-center">
            <div className="flex w-full justify-around px-[17px]">
              {MenuData.map(({ id, title, active, notActive, link }) => {
                const isActive = current === link;
                return (
                  <motion.div
                    key={id}
                    role="button"
                    tabIndex={0}
                    className="flex flex-col items-center gap-[5px] cursor-pointer"
                    whileTap={reduceMotion ? undefined : { scale: 0.9 }}
                    onClick={() => {
                      window.location.href = link;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        window.location.href = link;
                      }
                    }}>
                    <motion.div
                      animate={
                        reduceMotion
                          ? undefined
                          : { scale: isActive ? 1.08 : 1, y: isActive ? -1 : 0 }
                      }
                      transition={barSpring}>
                      <Image
                        src={isActive ? active : notActive}
                        width={24}
                        height={24}
                        alt="footer-img"
                        priority
                        draggable={false}
                      />
                    </motion.div>
                    <p className="text-[11px] text-center text-[#2CDFC9]">{title}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
