'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = clsx(
      'inline-flex items-center justify-center font-semibold',
      'rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-[0.98]',
      'btn-ripple'
    );

    const variants = {
      primary: clsx(
        'bg-primary-400 text-navy-900',
        'hover:bg-primary-500',
        'focus:ring-primary-400',
        'active:bg-primary-600',
        'shadow-sm hover:shadow-md'
      ),
      secondary: clsx(
        'bg-navy-800 text-white',
        'hover:bg-navy-700',
        'focus:ring-navy-800',
        'active:bg-navy-900'
      ),
      outline: clsx(
        'border-2 border-primary-400 text-primary-600',
        'hover:bg-primary-50',
        'focus:ring-primary-400',
        'active:bg-primary-100'
      ),
      ghost: clsx(
        'text-surface-600',
        'hover:text-surface-900 hover:bg-surface-100',
        'focus:ring-surface-300'
      ),
      danger: clsx(
        'bg-red-500 text-white',
        'hover:bg-red-600',
        'focus:ring-red-500',
        'active:bg-red-700'
      ),
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm gap-1.5',
      md: 'px-6 py-3 text-base gap-2',
      lg: 'px-8 py-4 text-lg gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };

