'use client';

import { cn } from '@/lib/utils';
import { FiCheck } from 'react-icons/fi';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}: CheckboxProps) {
  return (
    <label
      className={cn(
        'flex items-center gap-2 cursor-pointer',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <div
        className={cn(
          'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
          checked
            ? 'bg-slate-800 border-slate-800'
            : 'bg-white border-slate-300 hover:border-slate-400',
          disabled && 'cursor-not-allowed'
        )}
        onClick={() => !disabled && onChange(!checked)}
      >
        {checked && <FiCheck className="w-3 h-3 text-white" />}
      </div>
      {label && (
        <span
          className={cn(
            'text-sm text-slate-700',
            checked && 'line-through text-slate-400'
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
}
