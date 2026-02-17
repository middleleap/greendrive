import { PAYMENT_MODES } from '../../utils/tesla-configurator-data.js';

export default function PaymentModeSelect({ paymentMode, onPaymentModeChange }) {
  return (
    <div className="tc-section" style={{ borderBottom: 'none', paddingBottom: 0 }}>
      <select
        value={paymentMode}
        onChange={(e) => onPaymentModeChange(e.target.value)}
        className={`tc-payment-select ${paymentMode === 'green-loan' ? 'tc-payment-select-green' : ''}`}
      >
        {PAYMENT_MODES.map((mode) => (
          <option key={mode.id} value={mode.id}>
            {mode.id === 'green-loan' ? '🟢 ' : ''}
            {mode.label}
          </option>
        ))}
      </select>
    </div>
  );
}
