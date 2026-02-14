export default function KVRow({ label, value, mono = false }) {
  return (
    <div className="flex justify-between py-2 border-b border-adcb-gray-alt last:border-0">
      <span className="text-sm text-adcb-gray-mid">{label}</span>
      <span className={`text-sm text-adcb-gray-dark font-medium ${mono ? 'font-mono' : ''}`}>{value ?? '—'}</span>
    </div>
  );
}
