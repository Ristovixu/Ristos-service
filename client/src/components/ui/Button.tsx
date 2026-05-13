import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
  withArrow?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', isLoading, withArrow, children, ...props }, ref) => {

    const base = 'relative inline-flex items-center justify-center font-body font-medium text-[15px] tracking-wide transition-all duration-300 focus:outline-none disabled:opacity-40 disabled:pointer-events-none';

    const variants: Record<string, string> = {
      primary: 'px-8 py-4 bg-[var(--c-accent)] text-white hover:bg-[var(--c-accent-hover)] hover:shadow-[0_0_24px_var(--c-accent-glow)]',
      secondary: 'px-8 py-4 border border-[var(--c-border-mid)] text-[var(--c-ink)] hover:border-[var(--c-accent)] hover:text-[var(--c-accent)]',
      ghost: 'px-0 py-0 text-[var(--c-ink-soft)] hover:text-[var(--c-accent)]',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={`${base} ${variants[variant]} ${withArrow ? 'gap-3 hover:gap-5' : ''} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2 opacity-60">
            <span className="w-4 h-4 border-2 border-current border-t-transparent animate-spin" style={{ borderRadius: '50%' }} />
            Отправка...
          </span>
        ) : (
          <>
            {children}
            {withArrow && <ArrowRight className="w-4 h-4 transition-transform duration-300" />}
          </>
        )}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
