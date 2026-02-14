import { formatTimeAgo } from '../../utils/format.js';

export default function Footer({ isLive, lastUpdated, authenticated }) {
  return (
    <footer className="bg-bank-surface border-t border-bank-gray-alt mt-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-bank-gray-mid">
        <p>
          {isLive
            ? 'Live data from Tesla Fleet API'
            : <>Demo data &mdash; {!authenticated
                ? <a href="/auth" className="text-bank-red hover:text-bank-maroon underline transition-colors">connect your Tesla</a>
                : 'connect Tesla account'} for live data</>
          }
          {lastUpdated && <> &middot; Last updated: {formatTimeAgo(lastUpdated)}</>}
        </p>
        <p className="text-bank-gray">&copy; Bank GreenDrive Prototype</p>
      </div>
    </footer>
  );
}
