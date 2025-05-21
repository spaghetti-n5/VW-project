import styles from './../../styles/SearchBar.module.css';
import globalStyles from './../../styles/PostsPage.module.css';

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
  label = 'Search',
  name,
  hideLabel = false,
}) => {
  return (
    <div>
      {label ? (
        <label
          htmlFor={name}
          className={`${styles.searchLabel} ${hideLabel ? globalStyles.visuallyHidden : ''}`}
        >
          {label}
        </label>
      ) : null}
      <input
        data-testid="search-input"
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.searchInput}
        name={name}
        id={name}
        aria-label={label}
      />
    </div>
  );
};

export default SearchBar;
