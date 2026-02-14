export default function KVRow({ label, value, mono = false }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-bank-gray-alt/60 last:border-0 group">
      <span className="text-sm text-bank-gray-mid">{label}</span>
      <span className={`text-sm text-bank-gray-dark font-medium ${mono ? 'font-mono text-xs' : ''}`}>{value ?? '\u2014'}</span>
    </div>
  );
}
