const TABS = [
  {
    id: 'score',
    label: 'Score',
    icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
  },
  {
    id: 'vehicle',
    label: 'Vehicle',
    icon: 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.3 3.3 0 001 14v2c0 .6.4 1 1 1h2',
  },
  {
    id: 'charging',
    label: 'Charging',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    id: 'rate',
    label: 'Rate Impact',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
];

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="bg-bank-surface border-b border-bank-gray-alt">
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="tab-scroll-fade pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-bank-surface to-transparent sm:hidden" />
        <nav
          className="flex gap-0.5 overflow-x-auto scrollbar-none"
          role="tablist"
          aria-label="Dashboard sections"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            >
              <svg
                className="tab-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
