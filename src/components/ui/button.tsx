import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed select-none tracking-tight';

    const variants = {
      primary:
        'text-white bg-gradient-to-b from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.15),0_4px_12px_rgba(124,58,237,0.25),0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.15),0_8px_24px_rgba(124,58,237,0.35),0_1px_2px_rgba(0,0,0,0.05)] hover:-translate-y-px',
      secondary:
        'bg-gray-900 hover:bg-gray-800 text-white shadow-md hover:shadow-lg hover:-translate-y-px',
      outline:
        'border border-gray-300 bg-white text-gray-700 hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50 shadow-sm',
      ghost:
        'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-sm md:text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
