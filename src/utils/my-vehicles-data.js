// My Vehicles — Mock data for the mobile retail channel
// Aligns to v2.1 Motor Insurance Quote API fields and Insurance Data Sharing data clusters

export const MY_VEHICLES_FLEET = [
  {
    id: 'mv-1',
    vin: '5YJYGDEE5RF018734',
    year: 2024,
    make: 'Tesla',
    model: 'Model Y',
    trim: 'Long Range AWD',
    plateSource: 'DXB',
    plateCode: 'Z',
    plateNumber: '14729',
    engineType: 'Electric',
    bodyType: 'SUV',
    batteryCapacity: '75 kWh',
    carSpec: 'GCC',
    carUsage: 'Private',
    color: 'Pearl White',
    connected: true,
    // OEM live data (from Tesla Fleet API)
    oem: {
      batteryLevel: 84,
      batterySoH: 96,
      rangeKm: 440,
      odometerKm: 18200,
      chargingState: 'Complete',
      efficiencyWhKm: 152,
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
      outstandingBalance: 195000,
      currentRate: 3.99,
      monthlyPayment: 3620,
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
      annualPremium: 5200,
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
      powerHp: 456,
      torqueNm: 660,
      zeroToHundred: 5.0,
      topSpeed: 217,
    },
    // Alerts
    alerts: [{ type: 'rate', label: 'Better rate: 3.59%', color: '#16A34A' }],
  },
  {
    id: 'mv-2',
    vin: 'JTMCY7AJ5P4012847',
    year: 2023,
    make: 'Toyota',
    model: 'Land Cruiser',
    trim: 'GXR V6 Twin Turbo',
    plateSource: 'AUH',
    plateCode: 'B',
    plateNumber: '8347',
    engineType: 'Petrol',
    bodyType: 'SUV',
    batteryCapacity: null,
    carSpec: 'GCC',
    carUsage: 'Private',
    color: 'Pearl White',
    connected: false,
    oem: null,
    greenDriveScore: null,
    // Auto loan
    loan: {
      outstandingBalance: 280000,
      currentRate: 4.49,
      monthlyPayment: 5180,
      remainingMonths: 60,
      newRate: null,
      monthlySaving: 0,
      annualSaving: 0,
    },
    // Motor insurance (v2.1 Insurance Data Sharing)
    insurance: {
      policyId: 'ADCB-MI-2023-074612',
      provider: 'ADCB-Tokio Marine',
      policyType: 'Conventional',
      coverageType: 'Comprehensive',
      registrationType: 'Renewal',
      annualPremium: 7500,
      policyStartDate: '2025-07-10',
      policyEndDate: '2026-07-10',
      daysToRenewal: 144,
      claimsHistory: 'No claims',
      floodCover: false,
      addOns: {
        driverCover: true,
        passengerCover: true,
        roadsideAssistance: true,
        protectedNoClaims: true,
        agencyRepairs: true,
        lossOfKeys: false,
        hireCar: false,
        gcc: true,
        omanCover: true,
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
      expiryDate: '2027-01-20',
    },
    // Specs
    specs: {
      powerHp: 415,
      torqueNm: 650,
      zeroToHundred: 6.7,
      topSpeed: 210,
    },
    // Alerts
    alerts: [{ type: 'renewal', label: 'Renewal in 144 days', color: '#F26B43' }],
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
