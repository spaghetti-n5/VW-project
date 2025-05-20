import './../../styles/TablePage.css';

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
        <label htmlFor={name} className={`search-label ${hideLabel ? 'visually-hidden' : ''}`}>
          {label}
        </label>
      ) : null}
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
        name={name}
        id={name}
        aria-label={label || placeholder}
      />
    </div>
  );
};

export default SearchBar;
