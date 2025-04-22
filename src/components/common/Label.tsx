import React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    // Basic styling for the label
    const baseClasses = 
      'block text-sm font-medium text-tactical-700 leading-none '
      + 'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'; // Style when associated input is disabled
      
    return (
      <label
        ref={ref}
        className={`${baseClasses} ${className || ''}`.trim()} 
        {...props}
      />
    );
  }
);
Label.displayName = 'Label';

export { Label }; 