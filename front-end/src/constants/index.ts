export const options = [
    // Forex
    "GBP/USD",
    "USD/JPY",
    "USD/CHF",
    "AUD/USD",
    "NZD/USD",
    "USD/CAD",
    // Commodities
    "XAU/USD",
    "XAG/USD",
    "USOIL",
    "WTI/USD",
    "UKOIL",
    "BRENT/USD",
    "NATGAS",
    "NG/USD",
    "COPPER",
    "WHEAT",
    "CORN",
    // Crypto
    "BTC/USD",
    "ETH/USD",
    // Indices
    "US30",
    "NAS100",
    "SPX500",
    "GER30",
    "FRA40",
  ];

 export const ranges = {
    // Forex Pairs
    'EUR/USD': { min: 0.95, max: 1.25 },
    'GBP/USD': { min: 1.15, max: 1.45 },
    'USD/JPY': { min: 100, max: 160 },
    'USD/CHF': { min: 0.85, max: 1.10 },
    'AUD/USD': { min: 0.60, max: 0.85 },
    'NZD/USD': { min: 0.55, max: 0.75 },
    'USD/CAD': { min: 1.20, max: 1.45 },
    
    // Commodities (USD prices)
    'XAU/USD': { min: 1800, max: 2700 },    // Gold per ounce
    'XAG/USD': { min: 18, max: 35 },        // Silver per ounce
    'USOIL': { min: 40, max: 120 },         // WTI Crude per barrel
    'UKOIL': { min: 45, max: 125 },         // Brent Crude per barrel
    'NATGAS': { min: 1.5, max: 10.0 },      // Natural Gas per MMBtu
    'COPPER': { min: 3.0, max: 5.0 },       // Copper per pound
    'WHEAT': { min: 4.0, max: 12.0 },       // Wheat per bushel
    'CORN': { min: 3.0, max: 8.0 },         // Corn per bushel
    
    // Cryptocurrencies
    'BTC/USD': { min: 15000, max: 100000 },
    'ETH/USD': { min: 1000, max: 5000 },
    
    // Stock Indices (index points)
    'US30': { min: 25000, max: 45000 },     // Dow Jones
    'NAS100': { min: 10000, max: 20000 },   // Nasdaq-100
    'SPX500': { min: 3000, max: 6000 },     // S&P 500
    'GER30': { min: 10000, max: 20000 },    // DAX
    'FRA40': { min: 4000, max: 8000 }       // CAC 40
  };