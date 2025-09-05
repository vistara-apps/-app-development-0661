import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick, 
  type = 'button',
  disabled = false 
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 focus:ring-white',
    accent: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent'
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;