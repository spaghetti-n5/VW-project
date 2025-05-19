import Button from './Button';
import '../DataTable/DataTable.css';

interface ErrorAlertProps {
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onRetry, onDismiss }) => {
  return (
    <div className="error-alert">
      <span>{message}</span>
      <div className="error-actions">
        <Button variant="primary" size="small" onClick={onRetry}>
          Retry
        </Button>
        <Button variant="danger" size="small" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  );
};

export default ErrorAlert;
