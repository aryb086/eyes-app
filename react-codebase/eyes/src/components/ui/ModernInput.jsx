import React, { forwardRef } from 'react';

const ModernInput = forwardRef(({ 
  label, 
  error, 
  helperText, 
  className = '', 
  ...props 
}, ref) => {
  const baseClasses = 'block w-full px-3 py-2.5 border border-gray-600 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-gray-700 text-white';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';
  const classes = `${baseClasses} ${errorClasses} ${className}`;
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-200">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={classes}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
});

ModernInput.displayName = 'ModernInput';

export default ModernInput;
