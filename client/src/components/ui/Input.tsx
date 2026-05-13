import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, type = 'text', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value !== undefined ? props.value !== '' : false;
    const isFloating = isFocused || hasValue;

    return (
      <div className="relative w-full">
        <div className="relative">
          <input
            type={type}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={`
              peer w-full bg-transparent border-0 border-b
              px-0 pt-6 pb-2 text-[var(--c-ink)] font-body font-light
              outline-none transition-all placeholder-transparent
              ${error
                ? 'border-[var(--c-accent)] focus:border-[var(--c-accent)]'
                : 'border-[var(--c-border-mid)] focus:border-[var(--c-accent)]'
              }
              ${isFocused ? 'border-b-2' : 'border-b'}
              ${className}
            `}
            placeholder={label}
            {...props}
          />
          <label
            className={`
              absolute left-0 transition-all duration-200 pointer-events-none font-body
              ${isFloating
                ? 'top-0 text-[11px] font-medium tracking-wider uppercase'
                : 'top-5 text-[var(--t-body)]'
              }
              ${error ? 'text-[var(--c-accent)]' : isFloating ? 'text-[var(--c-accent)]' : 'text-[var(--c-ink-ghost)]'}
            `}
          >
            {label}
          </label>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-[var(--t-small)] text-[var(--c-accent)]"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
