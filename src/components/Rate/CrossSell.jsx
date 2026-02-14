import Card from '../shared/Card.jsx';

const OFFERS = [
  {
    id: 'insurance',
    title: 'Green Auto Insurance',
    subtitle: 'Save up to 15% on comprehensive coverage',
    description:
      'Your high GreenDrive Score qualifies you for reduced premiums. Low-mileage EV drivers have fewer claims.',
    cta: 'Get Quote',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    gradient: 'from-[#253943] to-[#1a2c34]',
    minScore: 40,
  },
  {
    id: 'creditcard',
    title: 'Green Rewards Card',
    subtitle: '3x cashback on all EV charging',
    description:
      'Earn 3% cashback at charging stations, 2% on utilities, and 1% everywhere else. No annual fee for Green tier members.',
    cta: 'Learn More',
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    gradient: 'from-[#0A6847] to-[#16A34A]',
    minScore: 0,
  },
  {
    id: 'solar',
    title: 'Home Solar Financing',
    subtitle: 'From AED 299/month',
    description:
      'Install solar panels to boost your Renewable Energy score by up to 10 points and reduce home charging costs by 80%.',
    cta: 'Calculate Savings',
    icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
    gradient: 'from-[#F26B43] to-[#e85d35]',
    minScore: 0,
    badge: '+10 pts',
  },
];

export default function CrossSell({ score }) {
  if (!score) return null;

  const relevantOffers = OFFERS.filter((o) => score.totalScore >= o.minScore);

  return (
    <Card>
      <h3 className="section-title mb-1">Recommended for You</h3>
      <p className="text-xs text-bank-gray-mid mb-4">
        Personalised offers based on your GreenDrive profile
      </p>

      <div className="space-y-3">
        {relevantOffers.map((offer) => (
          <div
            key={offer.id}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${offer.gradient} p-4 text-white`}
          >
            {/* Decorative circles */}
            <div className="absolute right-[-20px] top-[-20px] w-24 h-24 border border-white/10 rounded-full" />
            <div className="absolute right-[0px] top-[0px] w-12 h-12 border border-white/5 rounded-full" />

            <div className="relative flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={offer.icon} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{offer.title}</p>
                  {offer.badge && (
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-medium">
                      {offer.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/80 font-medium mt-0.5">{offer.subtitle}</p>
                <p className="text-[11px] text-white/60 mt-1.5 leading-relaxed">
                  {offer.description}
                </p>
                <button className="mt-3 px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-colors">
                  {offer.cta}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
