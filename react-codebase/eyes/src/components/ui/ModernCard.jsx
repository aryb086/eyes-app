import React from 'react';

const ModernCard = ({ 
  children, 
  className = '', 
  padding = 'md',
  shadow = 'sm',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200';
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };
  
  const classes = `${baseClasses} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default ModernCard;
