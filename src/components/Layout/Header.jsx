import Badge from '../shared/Badge.jsx';

export default function Header({ isLive, onRefresh, loading, authenticated }) {
  return (
    <header className="bg-white border-b border-bank-gray-alt">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/assets/logos/default.svg" alt="Bank" className="h-8" />
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-medium text-bank-gray-dark">Bank</span>
            <span className="text-lg font-medium text-green-deep">GreenDrive</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={isLive ? 'live' : 'mock'}>
            {isLive ? 'LIVE DATA' : 'MOCK DATA'}
          </Badge>
          {!isLive && !authenticated && (
            <a
              href="/auth"
              className="text-xs font-medium text-bank-red hover:text-bank-maroon transition-colors"
            >
              Connect Tesla
            </a>
          )}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-bank-gray-bg transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <svg className={`w-4 h-4 text-bank-gray-mid ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
