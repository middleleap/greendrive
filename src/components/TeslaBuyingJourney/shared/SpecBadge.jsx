export default function SpecBadge({ icon, label, value }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-bank-gray-mid">
      {icon && (
        <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      )}
      <span>{label && <span className="opacity-60">{label} </span>}<strong className="text-bank-gray-dark font-medium">{value}</strong></span>
    </div>
  );
}
