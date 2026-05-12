import { cn } from '@/lib/utils';
import { CSSProperties, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  style?: CSSProperties;
}

export function Card({ children, className, hover = true, style }: CardProps) {
  return (
    <div
      className={cn(
        'relative bg-white rounded-2xl border border-gray-200/80 overflow-hidden',
        'shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]',
        hover && 'transition-all duration-300 hover:shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.06),0_24px_60px_rgba(0,0,0,0.05)] hover:border-gray-300/80',
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function CardHeader({ children, className, style }: CardHeaderProps) {
  return (
    <div className={cn('p-6 pb-4', className)} style={style}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function CardContent({ children, className, style }: CardContentProps) {
  return (
    <div className={cn('px-6 pb-6', className)} style={style}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function CardFooter({ children, className, style }: CardFooterProps) {
  return (
    <div className={cn('px-6 py-4 bg-gray-50/50 border-t border-gray-200/60', className)} style={style}>
      {children}
    </div>
  );
}
