import Card from '../shared/Card.jsx';

const SOURCES = [
  {
    name: 'Tesla Fleet API',
    status: 'connected',
    description: 'Vehicle data, battery, odometer, charging state',
  },
  {
    name: 'DEWA (via Open Finance)',
    status: 'pending',
    description: 'Home energy data, solar panel detection, green tariff',
  },
  {
    name: 'Bank Transaction Data',
    status: 'pending',
    description: 'Charging spend categorization via Open Finance consent',
  },
];

export default function DataSources({ isLive }) {
  return (
    <Card>
      <h3 className="section-title mb-4">Data Sources</h3>
      <div className="space-y-2.5">
        {SOURCES.map(s => (
          <div key={s.name} className="flex items-start gap-3 p-3.5 rounded-xl bg-bank-gray-bg/70 transition-colors hover:bg-bank-gray-bg">
            <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
              s.status === 'connected'
                ? (isLive ? 'bg-green-main pulse-dot' : 'bg-bank-orange pulse-dot')
                : 'bg-bank-gray'
            }`} />
            <div>
              <p className="text-sm font-medium text-bank-gray-dark">{s.name}</p>
              <p className="text-xs text-bank-gray-mid mt-0.5">{s.description}</p>
              {s.status === 'pending' && (
                <span className="text-[10px] text-bank-orange mt-1.5 inline-block uppercase tracking-wider font-medium">Pending consent</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
