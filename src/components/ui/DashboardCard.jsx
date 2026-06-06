import { motion } from 'framer-motion';

export default function DashboardCard({ children, className = '', hoverable = false, onClick, ...props }) {
  const CardComponent = hoverable || onClick ? motion.div : 'div';
  const interactionProps = hoverable || onClick
    ? {
        whileHover: { y: -2, transition: { duration: 0.2, ease: 'easeOut' } },
        whileTap: { scale: 0.99 },
        onClick,
        ...props
      }
    : { onClick, ...props };

  return (
    <CardComponent
      {...interactionProps}
      className={`
        bg-white dark:bg-[#1E293B]
        border border-slate-200 dark:border-brand-slate
        rounded-2xl p-6 min-w-0
        shadow-sm hover:shadow-lg dark:shadow-none
        transition-all duration-300
        ${hoverable || onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </CardComponent>
  );
}

