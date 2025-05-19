import { ReactNode } from 'react';
import './Button.css';

interface ButtonProps {
  variant?:
    | 'secondary'
    | 'contrast'
    | 'outline'
    | 'outline secondary'
    | 'outline contrast'
    | string; // variants based on pico.css
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ variant, children, onClick, disabled = false }) => (
  <button
    type="button"
    className={variant ? `button ${variant}` : 'button'}
    onClick={onClick}
    disabled={disabled}
    aria-disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
