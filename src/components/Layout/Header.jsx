import Badge from '../shared/Badge.jsx';

export default function Header({ isLive, onRefresh, loading, authenticated, darkMode, onToggleDarkMode }) {
  return (
    <header className="bg-bank-surface border-b border-bank-gray-alt">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={darkMode ? '/assets/logos/default-2.svg' : '/assets/logos/default.svg'} alt="Bank" className="h-8" />
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
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg hover:bg-bank-gray-bg transition-colors"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <svg className="w-4 h-4 text-bank-gray-mid" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-bank-gray-mid" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
