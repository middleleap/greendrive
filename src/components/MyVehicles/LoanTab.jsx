export default function LoanTab({ vehicle }) {
  const loan = vehicle.loan;

  if (!loan) {
    return (
      <div className="mv-section-card text-center py-8">
        <p className="text-sm text-bank-gray-mid">No auto loan on record for this vehicle.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Loan Details */}
      <div className="mv-section-card">
        <h4 className="text-[10px] uppercase tracking-widest text-bank-gray-mid mb-3">Auto Loan</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-bank-gray-mid">Outstanding Balance</span>
            <span className="text-base font-semibold text-bank-gray-dark">
              AED {loan.outstandingBalance.toLocaleString()}
            </span>
          </div>
          <div className="h-px bg-bank-gray-alt" />
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-bank-gray-mid">Interest Rate</span>
            <span className="text-sm font-medium text-bank-gray-dark">{loan.currentRate}%</span>
          </div>
          <div className="h-px bg-bank-gray-alt" />
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-bank-gray-mid">Monthly Payment</span>
            <span className="text-sm font-medium text-bank-gray-dark">
              AED {loan.monthlyPayment.toLocaleString()}
            </span>
          </div>
          <div className="h-px bg-bank-gray-alt" />
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-bank-gray-mid">Remaining Term</span>
            <span className="text-sm font-medium text-bank-gray-dark">
              {loan.remainingMonths} months
            </span>
          </div>
        </div>
      </div>

      {/* Refinancing Callout */}
      {loan.newRate && (
        <div className="mv-refinance-callout">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-4 h-4 text-green-deep"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-xs font-semibold text-green-deep">Better Rate Available</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="text-center">
              <p className="text-sm line-through text-bank-gray-mid">{loan.currentRate}%</p>
              <p className="text-[9px] text-bank-gray-mid">Current</p>
            </div>
            <svg
              className="w-4 h-4 text-green-main"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-center">
              <p className="text-sm font-semibold text-green-deep">{loan.newRate}%</p>
              <p className="text-[9px] text-green-deep">GreenDrive</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="text-center p-2 rounded-lg bg-white/60">
              <p className="text-sm font-semibold text-green-deep">
                AED {loan.monthlySaving.toLocaleString()}
              </p>
              <p className="text-[8px] text-bank-gray-mid uppercase tracking-wider">
                Monthly Saving
              </p>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/60">
              <p className="text-sm font-semibold text-green-deep">
                AED {loan.annualSaving.toLocaleString()}
              </p>
              <p className="text-[8px] text-bank-gray-mid uppercase tracking-wider">
                Annual Saving
              </p>
            </div>
          </div>
          <button className="w-full py-2.5 rounded-lg bg-green-deep text-white text-xs font-medium hover:bg-green-main transition-colors">
            Refinance Now
          </button>
        </div>
      )}
    </div>
  );
}
