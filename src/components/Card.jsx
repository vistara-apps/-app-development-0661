import React from 'react';

const Card = ({ children, className = '', onClick, variant = 'default' }) => {
  const baseClasses = 'bg-surface rounded-lg p-4 shadow-card transition-all duration-200';
  
  const variantClasses = {
    default: '',
    interactive: 'hover:shadow-lg cursor-pointer hover:-translate-y-1'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;