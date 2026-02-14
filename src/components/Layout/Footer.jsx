import { formatTimeAgo } from '../../utils/format.js';

export default function Footer({ isLive, lastUpdated }) {
  return (
    <footer className="bg-white border-t border-bank-gray-alt mt-8">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-bank-gray-mid">
        <p>
          {isLive ? 'Live data from Tesla Fleet API' : 'Demo data — connect Tesla account for live data'}
          {lastUpdated && ` · Last updated: ${formatTimeAgo(lastUpdated)}`}
        </p>
        <p>&copy; Bank GreenDrive Prototype</p>
      </div>
    </footer>
  );
}
