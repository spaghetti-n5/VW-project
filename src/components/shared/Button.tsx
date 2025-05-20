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
}

const Button: React.FC<ButtonProps> = ({ variant, children, onClick, disabled = false }) => (
  <button
    type="button"
    className={`${styles.button} ${variant ? variant : ''}`}
    onClick={onClick}
    disabled={disabled}
    aria-disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
