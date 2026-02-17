import {
  getPurchasePrice,
  calculateMonthly,
  MODEL_3_VARIANTS,
} from '../../utils/tesla-configurator-data.js';

export default function StickyBottomBar({
  config,
  paymentMode,
  greenRate,
  tierName,
  onOrderClick,
  onEditTerms,
}) {
  const variant = MODEL_3_VARIANTS.find((v) => v.id === config.variant);
  if (!variant) return null;

  const purchasePrice = getPurchasePrice(config);
  const isGreen = paymentMode === 'green-loan';

  function getDisplayPrice() {
    switch (paymentMode) {
      case 'cash':
        return { main: `AED ${purchasePrice.toLocaleString()}`, sub: 'Purchase Price' };
      case 'lease':
        return {
          main: `AED ${variant.monthlyPayments.lease.toLocaleString()} /mo*`,
          sub: `AED ${purchasePrice.toLocaleString()} Purchase Price`,
        };
      case 'loan':
        return {
          main: `AED ${variant.monthlyPayments.loan.toLocaleString()} /mo*`,
          sub: `AED ${purchasePrice.toLocaleString()} Purchase Price`,
        };
      case 'islamic':
        return {
          main: `AED ${variant.monthlyPayments.islamic.toLocaleString()} /mo*`,
          sub: `AED ${purchasePrice.toLocaleString()} Purchase Price`,
        };
      case 'green-loan': {
        const down = purchasePrice * 0.1;
        const emi = Math.round(calculateMonthly(purchasePrice - down, greenRate, 5));
        return {
          main: `AED ${emi.toLocaleString()} /mo*`,
          sub: tierName
            ? `${tierName} • ${greenRate.toFixed(2)}%`
            : `${greenRate.toFixed(2)}% Green Rate`,
        };
      }
      default:
        return { main: `AED ${purchasePrice.toLocaleString()}`, sub: '' };
    }
  }

  const price = getDisplayPrice();

  return (
    <div className={`tc-bottom-bar ${isGreen ? 'tc-bottom-bar-green' : ''}`}>
      <button onClick={onEditTerms} className="text-left">
        <p className="text-lg font-bold text-bank-gray-dark">{price.main}</p>
        <p className="text-xs text-bank-gray-mid">{price.sub}</p>
      </button>
      <button
        onClick={onOrderClick}
        className={`tc-order-btn ${isGreen ? 'tc-order-btn-green' : 'tc-order-btn-dark'}`}
      >
        {isGreen ? 'Apply for Green Loan' : 'Order Now'}
      </button>
    </div>
  );
}
