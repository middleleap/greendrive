export default function OptionCard({ selected, onClick, children, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`cfg-option-card ${selected ? 'cfg-option-card-selected' : ''} ${className}`}
      aria-pressed={selected}
    >
      {children}
    </button>
  );
}
