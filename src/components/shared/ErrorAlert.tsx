import './../DataTable/DataTable.css';

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
        <button className="outline small primary" onClick={onRetry}>
          Retry
        </button>
        <button className="outline small danger" onClick={onDismiss}>
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default ErrorAlert;
