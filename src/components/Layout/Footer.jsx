import { formatTimeAgo } from '../../utils/format.js';
import { API_BASE } from '../../utils/constants.js';

export default function Footer({ isLive, lastUpdated, authenticated }) {
  return (
    <footer className="bg-bank-surface border-t border-bank-gray-alt mt-10">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-bank-gray-mid">
          <p>
            {isLive ? (
              'Live data from Tesla Fleet API'
            ) : (
              <>
                Demo data &mdash;{' '}
                {!authenticated ? (
                  <a
                    href={`${API_BASE}/auth`}
                    className="text-bank-red hover:text-bank-maroon underline transition-colors"
                  >
                    connect your Tesla
                  </a>
                ) : (
                  'connect Tesla account'
                )}{' '}
                for live data
              </>
            )}
            {lastUpdated && <> &middot; Last updated: {formatTimeAgo(lastUpdated)}</>}
          </p>
          <p className="text-bank-gray">&copy; {new Date().getFullYear()} Bank GreenDrive</p>
        </div>
        <div className="mt-3 pt-3 border-t border-bank-gray-alt/60 text-[10px] text-bank-gray leading-relaxed">
          <p>
            All rates displayed are indicative and subject to credit approval, final documentation,
            and prevailing terms and conditions. GreenDrive Score is generated from vehicle
            telematics data and does not constitute a credit score or credit assessment. Loan
            eligibility is subject to the Bank&apos;s standard underwriting criteria. This product
            is a prototype demonstration and does not represent a binding offer of financing. Bank
            is regulated by the Central Bank of the UAE.
          </p>
        </div>
      </div>
    </footer>
  );
}
