import React, { forwardRef } from 'react';

const ModernInput = forwardRef(({ 
  label, 
  error, 
  helperText, 
  className = '', 
  ...props 
}, ref) => {
  const baseClasses = 'block w-full px-4 py-3 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 shadow-sm';
  const errorClasses = error ? 'border-red-400 focus:ring-red-500' : '';
  const classes = `${baseClasses} ${errorClasses} ${className}`;
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-semibold text-foreground mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={classes}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500 mt-2 font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500 mt-2">{helperText}</p>
      )}
    </div>
  );
});

ModernInput.displayName = 'ModernInput';

export default ModernInput;
