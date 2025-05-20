import Button from './Button';
import './../../styles/TablePage.css';

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
        <Button variant="outline" onClick={onRetry}>
          Retry
        </Button>
        <Button variant="outline danger" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  );
};

export default ErrorAlert;
