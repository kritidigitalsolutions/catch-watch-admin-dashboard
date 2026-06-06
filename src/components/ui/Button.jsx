import { motion } from 'framer-motion';

const variants = {
  primary: `bg-brand-orange hover:bg-brand-orange-dark text-white shadow-lg shadow-orange-500/25`,
  secondary: `bg-brand-navy hover:bg-brand-slate text-white dark:bg-brand-slate dark:hover:bg-brand-navy border border-slate-600`,
  danger: `bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25`,
  ghost: `bg-transparent hover:bg-slate-100 dark:hover:bg-brand-slate text-slate-700 dark:text-slate-300`,
  outline: `bg-transparent border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white`,
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      ) : null}
      {children}
    </motion.button>
  );
}
