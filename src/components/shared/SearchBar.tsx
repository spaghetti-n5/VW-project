import styles from './../../styles/SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  name?: string;
  hideLabel?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search by any field...',
  label,
  name,
  hideLabel = false,
}) => {
  return (
    <div>
      {label ? (
        <label
          htmlFor={name}
          className={`${styles.searchLabel} ${hideLabel ? styles.visuallyHidden : ''}`}
        >
          {label}
        </label>
      ) : null}
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.searchInput}
        name={name}
        id={name}
        aria-label={label || placeholder}
      />
    </div>
  );
};

export default SearchBar;
