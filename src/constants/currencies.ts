export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CNY', name: 'Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'INR', name: 'Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'AED', name: 'Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'AUD', name: 'Dollar', symbol: '$', flag: '🇦🇺' },
  { code: 'CAD', name: 'Dollar', symbol: '$', flag: '🇨🇦' },
  { code: 'CHF', name: 'Franc', symbol: 'Fr', flag: '🇨🇭' },
  { code: 'SEK', name: 'Krona', symbol: 'kr', flag: '🇸🇪' },
  { code: 'NZD', name: 'Dollar', symbol: '$', flag: '🇳🇿' },
  { code: 'SGD', name: 'Dollar', symbol: '$', flag: '🇸🇬' },
  { code: 'HKD', name: 'Dollar', symbol: '$', flag: '🇭🇰' },
  { code: 'NOK', name: 'Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'MXN', name: 'Peso', symbol: '$', flag: '🇲🇽' },
  { code: 'ZAR', name: 'Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'BRL', name: 'Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'RUB', name: 'Ruble', symbol: '₽', flag: '🇷🇺' },
  { code: 'KRW', name: 'Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'THB', name: 'Baht', symbol: '฿', flag: '🇹🇭' },
  { code: 'IDR', name: 'Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  { code: 'MYR', name: 'Ringgit', symbol: 'RM', flag: '🇲🇾' },
  { code: 'PHP', name: 'Peso', symbol: '₱', flag: '🇵🇭' },
  { code: 'PKR', name: 'Rupee', symbol: '₨', flag: '🇵🇰' },
  { code: 'EGP', name: 'Pound', symbol: '£', flag: '🇪🇬' },
  { code: 'VND', name: 'Dong', symbol: '₫', flag: '🇻🇳' },
  { code: 'BDT', name: 'Taka', symbol: '৳', flag: '🇧🇩' },
  { code: 'PLN', name: 'Zloty', symbol: 'zł', flag: '🇵🇱' },
  { code: 'QAR', name: 'Riyal', symbol: 'ر.ق', flag: '🇶🇦' },
  { code: 'SAR', name: 'Riyal', symbol: 'ر.س', flag: '🇸🇦' },
  { code: 'KWD', name: 'Dinar', symbol: 'د.ك', flag: '🇰🇼' },
  { code: 'BHD', name: 'Dinar', symbol: 'د.ب', flag: '🇧🇭' },
  { code: 'OMR', name: 'Rial', symbol: 'ر.ع', flag: '🇴🇲' },
];

// Default currencies to show initially
export const DEFAULT_CURRENCY_CODES = ['USD', 'INR', 'AED'];