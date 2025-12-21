export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag?: string;
  icon?: string;
  country?: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'Dollar', symbol: '$', flag: '🇺🇸', country: 'United States' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', country: 'European Union' },
  { code: 'GBP', name: 'Pound', symbol: '£', flag: '🇬🇧', country: 'United Kingdom' },
  { code: 'JPY', name: 'Yen', symbol: '¥', flag: '🇯🇵', country: 'Japan' },
  { code: 'CNY', name: 'Yuan', symbol: '¥', flag: '🇨🇳', country: 'China' },
  { code: 'INR', name: 'Rupee', symbol: '₹', flag: '🇮🇳', country: 'India' },
  { code: 'AED', name: 'Dirham', symbol: 'د.إ', flag: '🇦🇪', country: 'UAE' },
  { code: 'AUD', name: 'Dollar', symbol: '$', flag: '🇦🇺', country: 'Australia' },
  { code: 'CAD', name: 'Dollar', symbol: '$', flag: '🇨🇦', country: 'Canada' },
  { code: 'CHF', name: 'Franc', symbol: 'Fr', flag: '🇨🇭', country: 'Switzerland' },
  { code: 'SEK', name: 'Krona', symbol: 'kr', flag: '🇸🇪', country: 'Sweden' },
  { code: 'NZD', name: 'Dollar', symbol: '$', flag: '🇳🇿', country: 'New Zealand' },
  { code: 'SGD', name: 'Dollar', symbol: '$', flag: '🇸🇬', country: 'Singapore' },
  { code: 'HKD', name: 'Dollar', symbol: '$', flag: '🇭🇰', country: 'Hong Kong' },
  { code: 'NOK', name: 'Krone', symbol: 'kr', flag: '🇳🇴', country: 'Norway' },
  { code: 'MXN', name: 'Peso', symbol: '$', flag: '🇲🇽', country: 'Mexico' },
  { code: 'ZAR', name: 'Rand', symbol: 'R', flag: '🇿🇦', country: 'South Africa' },
  { code: 'BRL', name: 'Real', symbol: 'R$', flag: '🇧🇷', country: 'Brazil' },
  { code: 'RUB', name: 'Ruble', symbol: '₽', flag: '🇷🇺', country: 'Russia' },
  { code: 'KRW', name: 'Won', symbol: '₩', flag: '🇰🇷', country: 'South Korea' },
  { code: 'TWD', name: 'Dollar', symbol: 'NT$', flag: '🇹🇼', country: 'Taiwan' },
  { code: 'THB', name: 'Baht', symbol: '฿', flag: '🇹🇭', country: 'Thailand' },
  { code: 'IDR', name: 'Rupiah', symbol: 'Rp', flag: '🇮🇩', country: 'Indonesia' },
  { code: 'MYR', name: 'Ringgit', symbol: 'RM', flag: '🇲🇾', country: 'Malaysia' },
  { code: 'PHP', name: 'Peso', symbol: '₱', flag: '🇵🇭', country: 'Philippines' },
  { code: 'PKR', name: 'Rupee', symbol: '₨', flag: '🇵🇰', country: 'Pakistan' },
  { code: 'EGP', name: 'Pound', symbol: '£', flag: '🇪🇬', country: 'Egypt' },
  { code: 'VND', name: 'Dong', symbol: '₫', flag: '🇻🇳', country: 'Vietnam' },
  { code: 'BDT', name: 'Taka', symbol: '৳', flag: '🇧🇩', country: 'Bangladesh' },
  { code: 'PLN', name: 'Zloty', symbol: 'zł', flag: '🇵🇱', country: 'Poland' },
  { code: 'QAR', name: 'Riyal', symbol: 'ر.ق', flag: '🇶🇦', country: 'Qatar' },
  { code: 'SAR', name: 'Riyal', symbol: 'ر.س', flag: '🇸🇦', country: 'Saudi Arabia' },
  { code: 'KWD', name: 'Dinar', symbol: 'د.ك', flag: '🇰🇼', country: 'Kuwait' },
  { code: 'BHD', name: 'Dinar', symbol: 'د.ب', flag: '🇧🇭', country: 'Bahrain' },
  { code: 'OMR', name: 'Rial', symbol: 'ر.ع', flag: '🇴🇲', country: 'Oman' },
  { code: 'XAU', name: 'Gold', symbol: 'oz', icon: 'Gold' },
  { code: 'XAG', name: 'Silver', symbol: 'oz', icon: 'Silver' },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', icon: 'bitcoin' },
];

// Default currencies to show initially
export const DEFAULT_CURRENCY_CODES = ['USD', 'INR', 'AED'];