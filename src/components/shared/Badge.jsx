export default function Badge({ children, variant = 'default', className = '' }) {
  const styles = {
    live: 'bg-green-pale text-green-deep',
    mock: 'bg-orange-50 text-adcb-orange',
    default: 'bg-adcb-gray-bg text-adcb-gray-mid',
    green: 'bg-green-pale text-green-deep',
    tier: '',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${styles[variant] || styles.default} ${className}`}>
      {(variant === 'live' || variant === 'mock') && (
        <span className={`w-2 h-2 rounded-full ${variant === 'live' ? 'bg-green-main' : 'bg-adcb-orange'}`} />
      )}
      {children}
    </span>
  );
}
