import React from 'react';

const ModernButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
  primary: 'bg-primary hover:bg-primary/90 text-primary-foreground focus:ring-primary shadow-md hover:shadow-lg transition-all duration-200 font-semibold',
  secondary: 'bg-secondary hover:bg-secondary/80 text-secondary-foreground focus:ring-secondary shadow-sm hover:shadow-md transition-all duration-200',
  outline: 'border border-primary bg-transparent hover:bg-primary/10 text-primary focus:ring-primary transition-all duration-200',
  ghost: 'text-muted-foreground hover:text-foreground hover:bg-muted focus:ring-primary transition-all duration-200',
  danger: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground focus:ring-destructive shadow-md hover:shadow-lg transition-all duration-200',
  success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500 shadow-md hover:shadow-lg transition-all duration-200'
};
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button 
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default ModernButton;
