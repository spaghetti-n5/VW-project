import Button from './Button';
import styles from './../../styles/ErrorAlert.module.css';

interface ErrorAlertProps {
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onRetry, onDismiss }) => (
  <div className={styles.errorAlert}>
    <span>{message}</span>
    <div className={styles.errorActions}>
      <Button variant="outline" onClick={onRetry}>
        Retry
      </Button>
      <Button variant="outline secondary" onClick={onDismiss}>
        Dismiss
      </Button>
    </div>
  </div>
);

export default ErrorAlert;
