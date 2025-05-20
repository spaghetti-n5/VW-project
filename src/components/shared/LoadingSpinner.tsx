import styles from './../../styles/LoadingSpinner.module.css';

const LoadingSpinner: React.FC = () => (
  <div className={styles.spinner} role="status" aria-label="Loading">
    <span>Loading...</span>
  </div>
);
export default LoadingSpinner;
