import './SearchInput.css'

export default function SearchInput({ id, value, onChange, placeholder, label }) {
  return (
    <div className="search-input">
      <span className="search-icon" aria-hidden="true">⌕</span>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
      />
    </div>
  )
}
