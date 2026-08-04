'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  'data-testid'?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || props.name;
    const testId = (props as Record<string, unknown>)['data-testid'] as string | undefined;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink dark:text-white/80">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          data-testid={testId ?? `input-${props.name}`}
          className={cn(
            'w-full h-11 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-ink-soft px-4 text-sm text-ink dark:text-white placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition',
            error && 'border-red-500 focus:ring-red-500/30',
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';
