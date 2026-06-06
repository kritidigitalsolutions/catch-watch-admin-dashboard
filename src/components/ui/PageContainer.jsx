import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

export default function PageContainer({ children, className = '' }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`flex-1 overflow-x-hidden overflow-y-auto p-6 sm:p-8 lg:p-10 space-y-6 w-full max-w-full min-w-0 ${className}`}
    >
      {children}
    </motion.div>
  );
}

