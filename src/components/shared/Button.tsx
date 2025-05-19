import { ReactNode } from 'react';
import './Button.css';

interface ButtonProps {
  variant: 'primary' | 'danger' | 'outline';
  size: 'small' | 'medium';
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ variant, size, children, onClick, disabled = false }) => {
  const className = `button button--${variant} button--${size}${disabled ? ' button--disabled' : ''}`;
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
