'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'yellow' | 'gray' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant = 'gray', size = 'md', dot = false, children, ...props },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full';

    const variants = {
      yellow: 'bg-primary-100 text-primary-700',
      gray: 'bg-surface-100 text-surface-700',
      success: 'bg-green-100 text-green-700',
      error: 'bg-red-100 text-red-700',
      warning: 'bg-amber-100 text-amber-700',
      info: 'bg-blue-100 text-blue-700',
    };

    const dotColors = {
      yellow: 'bg-primary-500',
      gray: 'bg-surface-500',
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-amber-500',
      info: 'bg-blue-500',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-base',
    };

    const dotSizes = {
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-2.5 h-2.5',
    };

    return (
      <span
        ref={ref}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {dot && (
          <span
            className={clsx(
              'rounded-full mr-1.5',
              dotColors[variant],
              dotSizes[size]
            )}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Status Badge - specialized for displaying status
export interface StatusBadgeProps {
  status: 'requested' | 'confirmed' | 'completed' | 'cancelled' | 'pending' | 'active';
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export function StatusBadge({
  status,
  size = 'md',
  showDot = true,
}: StatusBadgeProps) {
  const statusConfig: Record<
    string,
    { variant: BadgeProps['variant']; label: string }
  > = {
    requested: { variant: 'warning', label: 'Requested' },
    confirmed: { variant: 'info', label: 'Confirmed' },
    completed: { variant: 'success', label: 'Completed' },
    cancelled: { variant: 'error', label: 'Cancelled' },
    pending: { variant: 'gray', label: 'Pending' },
    active: { variant: 'success', label: 'Active' },
  };

  const config = statusConfig[status] || { variant: 'gray', label: status };

  return (
    <Badge variant={config.variant} size={size} dot={showDot}>
      {config.label}
    </Badge>
  );
}

export { Badge };

