import React from 'react';
import { cn } from '../../utils/cn';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tactical-400 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantStyles = {
    primary: 'bg-tactical-800 text-white hover:bg-tactical-700 active:bg-tactical-900',
    secondary: 'bg-tactical-200 text-tactical-800 hover:bg-tactical-300 active:bg-tactical-400',
    outline: 'border border-tactical-300 bg-transparent hover:bg-tactical-100 text-tactical-800',
    ghost: 'bg-transparent hover:bg-tactical-100 text-tactical-800',
    accent: 'bg-accent-600 text-white hover:bg-accent-500 active:bg-accent-700',
  };
  
  const sizeStyles = {
    sm: 'text-sm h-9 px-3 rounded',
    md: 'text-sm h-10 px-4 py-2 rounded-md',
    lg: 'text-base h-12 px-6 rounded-md',
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        widthStyle,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
};