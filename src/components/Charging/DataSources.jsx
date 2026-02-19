import { useState } from 'react';
import Card from '../shared/Card.jsx';

const INITIAL_SOURCES = [
  {
    id: 'tesla',
    name: 'Tesla Fleet API',
    status: 'connected',
    description: 'Vehicle data, battery, odometer, charging state',
    canConnect: false,
  },
  {
    id: 'dewa',
    name: 'DEWA (Bilateral API)',
    status: 'pending',
    description: 'Home energy data, solar panel detection, green tariff',
    canConnect: true,
    consentSteps: [
      'Authorise Bank to access your DEWA account',
      'Verify home address matches vehicle registration',
      'Enable monthly energy consumption data sharing',
    ],
    pointsUnlock: 10,
    category: 'Renewable Energy',
  },
  {
    id: 'bank',
    name: 'Bank Transaction Data',
    status: 'pending',
    description: 'Charging spend categorization via Open Finance consent',
    canConnect: true,
    consentSteps: [
      'Authorise Open Finance data access',
      'Categorise EV charging transactions',
      'Share monthly charging spend summary',
    ],
    pointsUnlock: 3,
    category: 'Charging Behavior',
  },
];

export default function DataSources({ isLive, onDewaConnect }) {
  const [sources, setSources] = useState(INITIAL_SOURCES);
  const [consentFlow, setConsentFlow] = useState(null);
  const [consentStep, setConsentStep] = useState(0);
  const [connecting, setConnecting] = useState(false);

  const startConsent = (sourceId) => {
    setConsentFlow(sourceId);
    setConsentStep(0);
  };

  const cancelConsent = () => {
    setConsentFlow(null);
    setConsentStep(0);
    setConnecting(false);
  };

  const advanceConsent = () => {
    const source = sources.find((s) => s.id === consentFlow);
    if (!source) return;

    if (consentStep < source.consentSteps.length - 1) {
      setConsentStep((s) => s + 1);
    } else {
      setConnecting(true);
      setTimeout(() => {
        setSources((prev) =>
          prev.map((s) => (s.id === consentFlow ? { ...s, status: 'connected' } : s)),
        );
        setConnecting(false);
        setConsentFlow(null);
        setConsentStep(0);
        if (consentFlow === 'dewa' && onDewaConnect) {
          onDewaConnect();
        }
      }, 1500);
    }
  };

  const activeSource = sources.find((s) => s.id === consentFlow);

  return (
    <Card>
      <h3 className="section-title mb-4">Data Sources</h3>

      {/* Consent Flow */}
      {consentFlow && activeSource && (
        <div className="mb-4 p-4 rounded-xl border-2 border-green-deep/20 bg-green-pastel">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-green-deep">Connect {activeSource.name}</p>
            <button
              onClick={cancelConsent}
              className="text-bank-gray-mid hover:text-bank-gray-dark transition-colors"
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

          <div className="space-y-2 mb-4">
            {activeSource.consentSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium ${
                    i < consentStep
                      ? 'bg-green-deep text-white'
                      : i === consentStep
                        ? 'bg-green-deep text-white'
                        : 'bg-white text-bank-gray-mid border border-bank-gray-alt'
                  }`}
                >
                  {i < consentStep ? (
                    <svg
                      className="w-3 h-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <p
                  className={`text-xs ${i <= consentStep ? 'text-green-deep font-medium' : 'text-bank-gray-mid'}`}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-lg bg-white/60 mb-3">
            <p className="text-[11px] text-green-deep">
              Connecting unlocks <strong>+{activeSource.pointsUnlock} points</strong> in{' '}
              {activeSource.category} category
            </p>
          </div>

          <button
            onClick={advanceConsent}
            disabled={connecting}
            className="w-full px-4 py-2 rounded-lg bg-green-deep text-white text-xs font-medium hover:bg-green-deep/90 transition-colors disabled:opacity-60"
          >
            {connecting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting...
              </span>
            ) : consentStep < activeSource.consentSteps.length - 1 ? (
              'Continue'
            ) : (
              'Authorise & Connect'
            )}
          </button>
        </div>
      )}

      <div className="space-y-2.5">
        {sources.map((s) => (
          <div
            key={s.id}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-bank-gray-bg/70 transition-colors hover:bg-bank-gray-bg"
          >
            <span
              className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                s.status === 'connected'
                  ? isLive
                    ? 'bg-green-main pulse-dot'
                    : 'bg-bank-orange pulse-dot'
                  : 'bg-green-light/50'
              }`}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-bank-gray-dark">{s.name}</p>
              <p className="text-xs text-bank-gray-mid mt-0.5">{s.description}</p>
              {s.status === 'pending' && (
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-green-deep uppercase tracking-wider font-medium flex items-center gap-1">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Unlock +{s.pointsUnlock} pts
                  </span>
                  {s.canConnect && !consentFlow && (
                    <button
                      onClick={() => startConsent(s.id)}
                      className="text-[10px] text-green-deep font-medium hover:text-green-main transition-colors underline decoration-dotted"
                    >
                      Connect now
                    </button>
                  )}
                </div>
              )}
              {s.status === 'connected' && s.canConnect && (
                <span className="text-[10px] text-green-deep mt-1.5 inline-block uppercase tracking-wider font-medium">
                  Connected
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
