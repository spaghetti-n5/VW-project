import './LoadingSpinner.css';

const LoadingSpinner: React.FC = () => (
  <div className="spinner" role="status" aria-label="Loading">
    <span>Loading...</span>
  </div>
);
export default LoadingSpinner;