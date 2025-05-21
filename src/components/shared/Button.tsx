import { ReactNode } from 'react';
import styles from './../../styles/Button.module.css';

interface ButtonProps {
  variant?:
    | 'secondary'
    | 'contrast'
    | 'outline'
    | 'outline secondary'
    | 'outline primary'
    | 'outline contrast';
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  ariaPressed?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  variant,
  children,
  onClick,
  disabled = false,
  ariaLabel,
  ariaPressed,
  type = 'button',
}) => (
  <button
    type={type}
    className={`${styles.button} ${variant ? variant : ''}`}
    onClick={onClick}
    disabled={disabled}
    aria-disabled={disabled}
    aria-label={ariaLabel}
    aria-pressed={ariaPressed}
  >
    {children}
  </button>
);

export default Button;
