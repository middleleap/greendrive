const TABS = [
  { id: 'score', label: 'Score' },
  { id: 'vehicle', label: 'Vehicle' },
  { id: 'charging', label: 'Charging' },
  { id: 'rate', label: 'Rate Impact' },
];

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="bg-bank-surface border-b border-bank-gray-alt">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-5 py-3 text-sm font-medium transition-colors relative
                ${
                  activeTab === tab.id
                    ? 'text-bank-red'
                    : 'text-bank-gray-mid hover:text-bank-gray-dark'
                }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-bank-red" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
