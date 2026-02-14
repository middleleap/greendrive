import { useState } from 'react';
import { BASE_RATE } from '../../utils/constants.js';

export default function ApplyModal({ score, vehicle, onClose }) {
  const [step, setStep] = useState(0); // 0 = review, 1 = submitting, 2 = submitted
  const greenRate = BASE_RATE - score.rateReduction;

  const handleSubmit = () => {
    setStep(1);
    setTimeout(() => setStep(2), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-bank-surface rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-bank-gray-alt">
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img src="/assets/logos/plectrum.svg" alt="Bank" className="h-5" />
              <span className="text-xs text-bank-gray-mid font-medium">Green Car Finance</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-bank-gray-bg transition-colors text-bank-gray-mid"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {step === 2 ? (
          /* Success State */
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-pastel flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-deep"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-bank-gray-dark mb-2">
              Application Submitted
            </h2>
            <p className="text-sm text-bank-gray-mid mb-4">
              Your Green Car Loan application has been received. A relationship manager will contact
              you within 24 hours to finalise the process.
            </p>
            <div className="p-3 rounded-lg bg-green-pastel mb-4">
              <p className="text-xs text-green-deep">
                Reference: GCL-
                {new Date().getFullYear()}
                {String(new Date().getMonth() + 1).padStart(2, '0')}
                {String(new Date().getDate()).padStart(2, '0')}-
                {Math.random().toString(36).slice(2, 6).toUpperCase()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 rounded-lg bg-green-deep text-white text-sm font-medium hover:bg-green-deep/90 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          /* Application Form */
          <div className="p-6">
            <h2 className="text-lg font-semibold text-bank-gray-dark mb-1">
              Green Car Loan Application
            </h2>
            <p className="text-xs text-bank-gray-mid mb-5">
              Pre-filled from your GreenDrive profile. Review and submit.
            </p>

            {/* Pre-filled fields */}
            <div className="space-y-3 mb-5">
              <FormField label="Vehicle" value={vehicle?.model || score.model} />
              <FormField label="VIN" value={vehicle?.vin || score.vin} />
              <FormField
                label="Odometer"
                value={
                  vehicle?.odometer
                    ? `${vehicle.odometer.km?.toLocaleString()} km`
                    : 'From Tesla data'
                }
              />
              <FormField
                label="GreenDrive Score"
                value={`${score.totalScore}/100`}
                highlight
                color={score.tierColor}
              />
              <FormField label="Tier" value={score.tier} highlight color={score.tierColor} />
              <FormField
                label="Pre-Qualified Rate"
                value={`${greenRate.toFixed(2)}% (${score.rateReduction.toFixed(2)}% reduction)`}
                highlight
              />

              <div className="pt-3 border-t border-bank-gray-alt/60">
                <p className="text-[10px] text-bank-gray-mid uppercase tracking-widest font-medium mb-2">
                  Loan Details
                </p>
                <FormField label="Base Rate" value={`${BASE_RATE.toFixed(2)}%`} />
                <div className="mt-2">
                  <FormField label="Your Green Rate" value={`${greenRate.toFixed(2)}%`} highlight />
                </div>
              </div>
            </div>

            {/* Consent */}
            <div className="p-3 rounded-lg bg-bank-gray-bg mb-4">
              <p className="text-[10px] text-bank-gray-mid leading-relaxed">
                By submitting, I authorise the Bank to use my vehicle telematics data for the
                purpose of this loan application. I confirm that the information provided is
                accurate. This application is subject to the Bank&apos;s standard credit assessment
                criteria and T&amp;Cs.
              </p>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={step === 1}
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-green-deep to-[#0f8a5f] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {step === 1 ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FormField({ label, value, highlight, color }) {
  return (
    <div className="flex justify-between items-baseline py-1.5">
      <span className="text-xs text-bank-gray-mid">{label}</span>
      <span
        className={`text-sm font-medium tabular-nums ${highlight ? 'text-green-deep' : 'text-bank-gray-dark'}`}
        style={color ? { color } : undefined}
      >
        {value}
      </span>
    </div>
  );
}
