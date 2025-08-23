import React from 'react';

const Card = ({ children, style, ...rest }) => {
  const baseStyle = {
    background: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '12px',
    padding: '1rem',
    color: '#e5e7eb',
  };

  return (
    <div style={{ ...baseStyle, ...(style || {}) }} {...rest}>
      {children}
    </div>
  );
};

export default Card;
