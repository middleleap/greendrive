import { useState, useEffect, useRef } from 'react';
import Badge from '../shared/Badge.jsx';
import { API_BASE } from '../../utils/constants.js';

const CHANNELS = [
  { id: 'greendrive', label: 'GreenDrive', subtitle: 'Score Dashboard' },
  { id: 'my-vehicles', label: 'My Vehicles', subtitle: 'Mobile Retail' },
  { id: 'tesla-buying', label: 'Buy Tesla', subtitle: 'Configure & Finance' },
];

export default function Header({
  isLive,
  onRefresh,
  loading,
  authenticated,
  darkMode,
  onToggleDarkMode,
  onToggleAdmin,
  showAdmin,
  activeChannel,
  onChannelChange,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleKey(e) {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [mobileMenuOpen]);

  return (
    <header className="header-sticky">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <img
            src={darkMode ? '/assets/logos/default-2.svg' : '/assets/logos/default.svg'}
            alt="Bank"
            className="h-7 sm:h-8 shrink-0"
          />
          <div className="h-5 w-px bg-bank-gray-alt hidden sm:block" />
          <div className="flex flex-col hidden sm:flex">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-medium text-bank-gray-dark tracking-tight">Bank</span>
              <span className="text-base font-medium text-green-deep tracking-tight">
                GreenDrive
              </span>
            </div>
            <span className="text-[10px] text-bank-gray-mid tracking-wide leading-none">
              Green Car Finance
            </span>
          </div>
          {/* Channel Switcher — desktop inline */}
          {onChannelChange && (
            <>
              <div className="h-5 w-px bg-bank-gray-alt hidden md:block" />
              <nav className="channel-switcher hidden md:flex" aria-label="Application channels">
                {CHANNELS.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => onChannelChange(ch.id)}
                    className={`channel-btn ${activeChannel === ch.id ? 'channel-btn-active' : ''}`}
                    title={ch.subtitle}
                    aria-label={`${ch.label} \u2014 ${ch.subtitle}`}
                    aria-current={activeChannel === ch.id ? 'page' : undefined}
                  >
                    {ch.label}
                  </button>
                ))}
              </nav>
            </>
          )}
        </div>

        {/* Desktop action buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Badge variant={isLive ? 'live' : 'mock'}>{isLive ? 'LIVE DATA' : 'MOCK DATA'}</Badge>
          {!isLive && !authenticated && (
            <a
              href={`${API_BASE}/auth`}
              className="text-xs font-medium text-bank-red hover:text-bank-maroon transition-colors"
            >
              Connect Tesla
            </a>
          )}
          <div className="h-4 w-px bg-bank-gray-alt mx-0.5" />
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-bank-gray-bg transition-all disabled:opacity-40"
            title="Refresh data"
            aria-label="Refresh dashboard data"
          >
            <svg
              className={`w-4 h-4 text-bank-gray-mid ${loading ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          <button
            onClick={onToggleAdmin}
            className={`p-2 rounded-lg transition-all ${showAdmin ? 'bg-bank-gray-bg text-green-deep' : 'hover:bg-bank-gray-bg'}`}
            title="Portfolio Analytics"
            aria-label="Toggle Portfolio Analytics"
            aria-pressed={showAdmin}
          >
            <svg
              className={`w-4 h-4 ${showAdmin ? 'text-green-deep' : 'text-bank-gray-mid'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </button>
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg hover:bg-bank-gray-bg transition-all"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <svg
                className="w-4 h-4 text-bank-gray-mid"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-bank-gray-mid"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile: badge + hamburger */}
        <div className="flex sm:hidden items-center gap-2 relative" ref={menuRef}>
          <Badge variant={isLive ? 'live' : 'mock'}>{isLive ? 'LIVE DATA' : 'MOCK DATA'}</Badge>
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-lg hover:bg-bank-gray-bg transition-all"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="w-5 h-5 text-bank-gray-mid"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="mobile-menu-dropdown">
              {!isLive && !authenticated && (
                <a href={`${API_BASE}/auth`} className="mobile-menu-item text-bank-red">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  Connect Tesla
                </a>
              )}
              <button
                onClick={() => {
                  onRefresh();
                  setMobileMenuOpen(false);
                }}
                disabled={loading}
                className="mobile-menu-item disabled:opacity-40"
              >
                <svg
                  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh Data
              </button>
              <button
                onClick={() => {
                  onToggleAdmin();
                  setMobileMenuOpen(false);
                }}
                className={`mobile-menu-item ${showAdmin ? 'text-green-deep' : ''}`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Portfolio Analytics
              </button>
              <button
                onClick={() => {
                  onToggleDarkMode();
                  setMobileMenuOpen(false);
                }}
                className="mobile-menu-item"
              >
                {darkMode ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Channel Switcher — mobile second row */}
      {onChannelChange && (
        <div className="md:hidden border-t border-bank-gray-alt">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex">
            <nav className="channel-switcher flex w-full" aria-label="Application channels">
              {CHANNELS.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => onChannelChange(ch.id)}
                  className={`channel-btn channel-btn-mobile ${activeChannel === ch.id ? 'channel-btn-active' : ''}`}
                  title={ch.subtitle}
                  aria-label={`${ch.label} \u2014 ${ch.subtitle}`}
                  aria-current={activeChannel === ch.id ? 'page' : undefined}
                >
                  {ch.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
