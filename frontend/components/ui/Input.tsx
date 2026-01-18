'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      type = 'text',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    const baseInputStyles = clsx(
      'w-full rounded-lg border bg-white',
      'text-surface-900 placeholder:text-surface-400',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2',
      leftIcon && 'pl-11',
      rightIcon && 'pr-11',
      !leftIcon && 'pl-4',
      !rightIcon && 'pr-4',
      'py-3'
    );

    const stateStyles = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
      : 'border-surface-300 focus:border-primary-400 focus:ring-primary-100';

    const disabledStyles = disabled
      ? 'bg-surface-100 cursor-not-allowed opacity-60'
      : '';

    return (
      <div className={clsx('w-full', className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-surface-700 mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            className={clsx(baseInputStyles, stateStyles, disabledStyles)}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400">
              {rightIcon}
            </div>
          )}
        </div>

        {(helperText || error) && (
          <p
            className={clsx(
              'mt-2 text-sm',
              error ? 'text-red-500' : 'text-surface-500'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea Component
export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, label, helperText, error, id, disabled, rows = 4, ...props },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s/g, '-');

    const baseStyles = clsx(
      'w-full px-4 py-3 rounded-lg border bg-white',
      'text-surface-900 placeholder:text-surface-400',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2',
      'resize-none'
    );

    const stateStyles = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
      : 'border-surface-300 focus:border-primary-400 focus:ring-primary-100';

    const disabledStyles = disabled
      ? 'bg-surface-100 cursor-not-allowed opacity-60'
      : '';

    return (
      <div className={clsx('w-full', className)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-surface-700 mb-2"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          rows={rows}
          className={clsx(baseStyles, stateStyles, disabledStyles)}
          {...props}
        />

        {(helperText || error) && (
          <p
            className={clsx(
              'mt-2 text-sm',
              error ? 'text-red-500' : 'text-surface-500'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Select Component
export interface SelectProps
  extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, helperText, error, id, disabled, options, ...props },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s/g, '-');

    const baseStyles = clsx(
      'w-full px-4 py-3 rounded-lg border bg-white',
      'text-surface-900',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2',
      'appearance-none cursor-pointer'
    );

    const stateStyles = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
      : 'border-surface-300 focus:border-primary-400 focus:ring-primary-100';

    const disabledStyles = disabled
      ? 'bg-surface-100 cursor-not-allowed opacity-60'
      : '';

    return (
      <div className={clsx('w-full', className)}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-surface-700 mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={clsx(baseStyles, stateStyles, disabledStyles)}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-surface-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {(helperText || error) && (
          <p
            className={clsx(
              'mt-2 text-sm',
              error ? 'text-red-500' : 'text-surface-500'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Input, Textarea, Select };

