import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const baseClasses = 
      'flex h-10 w-full rounded-md border border-tactical-300 bg-white px-3 py-2 text-sm '
      + 'text-tactical-900 placeholder:text-tactical-500 '
      + 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-1 '
      + 'disabled:cursor-not-allowed disabled:opacity-50';
    
    return (
      <input
        type={type}
        className={`${baseClasses} ${className || ''}`.trim()}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input }; 