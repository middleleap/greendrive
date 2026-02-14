import Card from '../shared/Card.jsx';
import AnimatedNumber from '../shared/AnimatedNumber.jsx';
import KVRow from '../shared/KVRow.jsx';

const RATES = {
  home:         0.38, // AED/kWh — DEWA residential
  supercharger: 1.36, // AED/kWh — Tesla Supercharger UAE
  publicL2:     1.00, // AED/kWh — Public L2
};

const GAS_COST_PER_LITER = 3.25;
const GAS_KM_PER_LITER   = 6;
const EV_KM_PER_KWH      = 6.5;

function classifySession(type) {
  const t = (type || '').toLowerCase();
  if (t.includes('wall') || t === 'home' || t === '' || t === '<invalid>') return 'home';
  if (t.includes('supercharger') || t.includes('super')) return 'supercharger';
  return 'publicL2';
}

function computeCosts(charging) {
  const byType = { home: 0, supercharger: 0, publicL2: 0 };

  // Distribute totalEnergy_kWh using pattern percentages
  if (charging.patterns && charging.totalEnergy_kWh) {
    const total = charging.totalEnergy_kWh;
    byType.home         = total * (charging.patterns.home || 0) / 100;
    byType.supercharger = total * (charging.patterns.supercharger || 0) / 100;
    byType.publicL2     = total * ((charging.patterns.publicL2 || 0) + (charging.patterns.other || 0)) / 100;
  } else if (charging.sessions?.length) {
    for (const s of charging.sessions) {
      const key = classifySession(s.type);
      byType[key] += s.energy_kWh || 0;
    }
  }

  const totalKwh = byType.home + byType.supercharger + byType.publicL2;
  const costHome   = byType.home * RATES.home;
  const costSuper  = byType.supercharger * RATES.supercharger;
  const costPublic = byType.publicL2 * RATES.publicL2;
  const totalCost  = costHome + costSuper + costPublic;
  const avgPerKwh  = totalKwh > 0 ? totalCost / totalKwh : 0;

  // Gasoline equivalent: same km driven by EV, what would it cost on gas?
  const kmDriven    = totalKwh * EV_KM_PER_KWH;
  const gasLiters   = kmDriven / GAS_KM_PER_LITER;
  const gasCost     = gasLiters * GAS_COST_PER_LITER;

  // Rough monthly average (assume data covers ~12 months)
  const monthlyCost = totalCost / 12;

  return {
    byType,
    costHome,
    costSuper,
    costPublic,
    totalCost,
    avgPerKwh,
    gasCost,
    monthlyCost,
  };
}

export default function ChargingCost({ charging }) {
  if (!charging) return null;

  const c = computeCosts(charging);

  const topCards = [
    { label: 'Monthly Cost', value: c.monthlyCost, prefix: 'AED ', decimals: 0, bg: 'bg-green-pastel' },
    { label: 'Cost / kWh', value: c.avgPerKwh, prefix: 'AED ', decimals: 2, bg: 'bg-green-pastel' },
    { label: 'vs Gasoline', value: c.gasCost, prefix: 'AED ', decimals: 0, bg: 'bg-green-pale' },
  ];

  return (
    <Card>
      <h3 className="section-title mb-1">Charging Costs</h3>
      <p className="text-xs text-bank-gray-mid mb-5">Estimated from charging patterns &amp; UAE electricity rates</p>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {topCards.map(t => (
          <div key={t.label} className={`savings-card ${t.bg}`}>
            <p className="text-[10px] text-green-deep uppercase tracking-widest mb-1.5">{t.label}</p>
            <p className="text-lg font-semibold text-green-deep">
              <AnimatedNumber value={t.value} decimals={t.decimals} prefix={t.prefix} />
            </p>
          </div>
        ))}
      </div>

      <KVRow
        label="Home (DEWA)"
        value={`${Math.round(c.byType.home).toLocaleString()} kWh — AED ${Math.round(c.costHome).toLocaleString()}`}
      />
      <KVRow
        label="Supercharger"
        value={`${Math.round(c.byType.supercharger).toLocaleString()} kWh — AED ${Math.round(c.costSuper).toLocaleString()}`}
      />
      <KVRow
        label="Public L2"
        value={`${Math.round(c.byType.publicL2).toLocaleString()} kWh — AED ${Math.round(c.costPublic).toLocaleString()}`}
      />
      <KVRow
        label="Total EV Cost"
        value={`AED ${Math.round(c.totalCost).toLocaleString()}`}
        mono
      />
    </Card>
  );
}
