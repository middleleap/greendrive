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
      <h3 className="text-sm font-medium text-bank-gray-dark mb-4">Data Sources</h3>
      <div className="space-y-3">
        {SOURCES.map((s) => (
          <div key={s.name} className="flex items-start gap-3 p-3 rounded-lg bg-bank-gray-bg">
            <span
              className={`mt-0.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                s.status === 'connected'
                  ? isLive
                    ? 'bg-green-main'
                    : 'bg-bank-orange'
                  : 'bg-bank-gray'
              }`}
            />
            <div>
              <p className="text-sm font-medium text-bank-gray-dark">{s.name}</p>
              <p className="text-xs text-bank-gray-mid">{s.description}</p>
              {s.status === 'pending' && (
                <span className="text-xs text-bank-orange mt-1 inline-block">Pending consent</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
