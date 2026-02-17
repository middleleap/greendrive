// My Vehicles — Mock data for the mobile retail channel
// Aligns to v2.1 Motor Insurance Quote API fields and Insurance Data Sharing data clusters

export const MY_VEHICLES_FLEET = [
  {
    id: 'mv-1',
    vin: '5YJ3E7EC5RF142891',
    year: 2024,
    make: 'Tesla',
    model: 'Model 3',
    trim: 'Performance AWD',
    plateSource: 'DXB',
    plateCode: 'Z',
    plateNumber: '14729',
    engineType: 'Electric',
    bodyType: 'Saloon',
    batteryCapacity: '82 kWh',
    carSpec: 'GCC',
    carUsage: 'Private',
    color: 'Solid Black',
    connected: true,
    // OEM live data (from Tesla Fleet API)
    oem: {
      batteryLevel: 78,
      batterySoH: 97,
      rangeKm: 385,
      odometerKm: 12840,
      chargingState: 'Complete',
      efficiencyWhKm: 148,
      softwareVersion: '2025.2.6',
    },
    // GreenDrive Score
    greenDriveScore: {
      totalScore: 78,
      tier: 'Gold Green',
      tierColor: '#16A34A',
      rateReduction: 0.4,
      breakdown: {
        batteryHealth: { score: 18, max: 20 },
        chargingBehavior: { score: 22, max: 25 },
        efficiency: { score: 15, max: 20 },
        evOwnership: { score: 15, max: 15 },
        vehicleCondition: { score: 8, max: 10 },
        renewableEnergy: { score: 0, max: 10 },
      },
    },
    // Auto loan
    loan: {
      outstandingBalance: 185000,
      currentRate: 3.99,
      monthlyPayment: 3420,
      remainingMonths: 48,
      newRate: 3.59,
      monthlySaving: 185,
      annualSaving: 2220,
    },
    // Motor insurance (v2.1 Insurance Data Sharing)
    insurance: {
      policyId: 'ADCB-MI-2024-078431',
      provider: 'ADCB-Tokio Marine',
      policyType: 'Conventional',
      coverageType: 'Comprehensive',
      registrationType: 'Renewal',
      annualPremium: 4800,
      policyStartDate: '2025-06-15',
      policyEndDate: '2026-06-15',
      daysToRenewal: 120,
      claimsHistory: 'No claims',
      floodCover: true,
      addOns: {
        driverCover: true,
        passengerCover: true,
        roadsideAssistance: true,
        protectedNoClaims: true,
        agencyRepairs: true,
        lossOfKeys: false,
        hireCar: true,
        gcc: false,
        omanCover: false,
      },
    },
    // Data sharing consent
    consent: {
      status: 'Authorised',
      permissions: [
        'ReadInsurancePolicies',
        'ReadInsuranceProduct',
        'ReadInsurancePremium',
        'ReadCustomerClaims',
      ],
      expiryDate: '2027-02-15',
    },
    // Specs
    specs: {
      powerHp: 510,
      torqueNm: 660,
      zeroToHundred: 3.1,
      topSpeed: 262,
    },
    // Alerts
    alerts: [{ type: 'rate', label: 'Better rate: 3.59%', color: '#16A34A' }],
  },
  {
    id: 'mv-2',
    vin: 'WBA83EG01RCW12345',
    year: 2023,
    make: 'BMW',
    model: 'iX',
    trim: 'xDrive40',
    plateSource: 'AUH',
    plateCode: 'A',
    plateNumber: '52180',
    engineType: 'Electric',
    bodyType: 'SUV',
    batteryCapacity: '76.6 kWh',
    carSpec: 'GCC',
    carUsage: 'Private',
    color: 'Mineral White',
    connected: false,
    oem: null,
    greenDriveScore: null,
    loan: {
      outstandingBalance: 220000,
      currentRate: 4.25,
      monthlyPayment: 4580,
      remainingMonths: 54,
      newRate: null,
      monthlySaving: 0,
      annualSaving: 0,
    },
    insurance: {
      policyId: 'ADCB-MI-2023-062198',
      provider: 'Oman Insurance',
      policyType: 'Conventional',
      coverageType: 'Comprehensive',
      registrationType: 'Renewal',
      annualPremium: 6200,
      policyStartDate: '2025-09-01',
      policyEndDate: '2026-09-01',
      daysToRenewal: 198,
      claimsHistory: '1 claim',
      floodCover: false,
      addOns: {
        driverCover: true,
        passengerCover: false,
        roadsideAssistance: true,
        protectedNoClaims: false,
        agencyRepairs: true,
        lossOfKeys: false,
        hireCar: false,
        gcc: true,
        omanCover: true,
      },
    },
    consent: {
      status: null,
      permissions: [],
      expiryDate: null,
    },
    specs: {
      powerHp: 326,
      torqueNm: 630,
      zeroToHundred: 6.1,
      topSpeed: 200,
    },
    alerts: [
      { type: 'connect', label: 'Connect BMW', color: '#8E000B' },
      { type: 'renewal', label: 'Renewal in 198 days', color: '#F26B43' },
    ],
  },
];

// Add-on labels mapping (v2.1 §5.2.1 fields 1.08.01–1.08.09)
export const ADD_ON_LABELS = {
  driverCover: 'Driver Cover',
  passengerCover: 'Passenger Cover',
  roadsideAssistance: 'Roadside Assist',
  protectedNoClaims: 'Protected NCD',
  agencyRepairs: 'Agency Repairs',
  lossOfKeys: 'Loss of Keys',
  hireCar: 'Hire Car',
  gcc: 'GCC Cover',
  omanCover: 'Oman Cover',
};

// Portfolio summary (derived from fleet data)
export function getPortfolioSummary(fleet) {
  const totalValue = fleet.reduce((sum, v) => sum + (v.loan?.outstandingBalance || 0), 0);
  const totalInsurance = fleet.reduce((sum, v) => sum + (v.insurance?.annualPremium || 0), 0);
  const connectedCount = fleet.filter((v) => v.connected).length;
  return {
    totalValue,
    vehicleCount: fleet.length,
    annualInsurance: totalInsurance,
    connectedRatio: `${connectedCount}/${fleet.length}`,
  };
}
