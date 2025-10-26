export const forexPairs = [
  // Majors
  "EUR/USD", "USD/JPY", "GBP/USD", "USD/CHF", "AUD/USD", "USD/CAD", "NZD/USD",
  // EUR Crosses
  "EUR/GBP", "EUR/JPY", "EUR/CHF", "EUR/AUD", "EUR/CAD", "EUR/NZD", "EUR/SEK", "EUR/NOK",
  // GBP Crosses
  "GBP/JPY", "GBP/CHF", "GBP/AUD", "GBP/CAD", "GBP/NZD",
  // AUD Crosses
  "AUD/JPY", "AUD/CHF", "AUD/CAD", "AUD/NZD",
  // Other Crosses
  "CHF/JPY", "CAD/JPY", "NZD/JPY", "CAD/CHF", "NZD/CHF",
  // Exotics
  "USD/ZAR", "USD/TRY", "USD/SGD", "USD/SEK", "USD/RUB", "USD/PLN", "USD/NOK",
  "USD/MXN", "USD/HUF", "USD/HKD", "EUR/TRY", "EUR/ZAR", "USD/CNH", "USD/DKK"
];

export const cryptoPairs = [
  "BTC/USD", "ETH/USD", "XRP/USD", "LTC/USD", "BCH/USD", "ADA/USD", "DOT/USD",
  "LINK/USD", "XLM/USD", "DOGE/USD", "SOL/USD", "BNB/USD", "UNI/USD", "AAVE/USD",
  "MATIC/USD", "TRX/USD", "ATOM/USD", "AVAX/USD",
];

export const indices = [
  // US
  "US30", "SPX500", "NAS100", "US2000", "VIX",
  // Europe
  "UK100", "GER40", "FRA40", "EUSTX50", "ESP35", "ITA40", "SMI20",
  // Asia/Pacific
  "JPN225", "AUS200", "HKG50", "CN50", "IN50"
];

export const commodities = [
  // Metals
  "XAU/USD", // Gold
  "XAG/USD", // Silver
  "XPT/USD", // Platinum
  "XPD/USD", // Palladium
  "COPPER",
  // Energies
  "USOIL", // WTI Crude Oil
  "UKOIL", // Brent Crude Oil
  "NATGAS", // Natural Gas
  // Agricultural
  "CORN", "WHEAT", "SOYBEANS", "SUGAR"
];

export const allTradableAssets = [
  ...forexPairs,
  ...cryptoPairs,
  ...indices,
  ...commodities
].sort();
