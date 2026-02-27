import axios from 'axios';
import { CurrencyAPI } from '../../services/api/currencyAPI';
import { StorageService } from '../../services/storage/asyncStorage';

jest.mock('axios');
jest.mock('../../services/storage/asyncStorage');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedStorage = StorageService as jest.Mocked<typeof StorageService>;

describe('CurrencyAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock StorageService to return null (no cache)
    mockedStorage.getCachedRates = jest.fn().mockResolvedValue(null);
    mockedStorage.cacheRates = jest.fn().mockResolvedValue(undefined);
  });

  describe('getExchangeRates', () => {
    it('should fetch exchange rates successfully including crypto and metals', async () => {
      const mockMainResponse = {
        data: {
          base: 'USD',
          rates: {
            EUR: 0.85,
            GBP: 0.73,
            JPY: 110.5,
          },
        },
      };

      const mockCryptoResponse = {
        data: {
          data: {
            rates: {
              USD: 40000, // 1 BTC = 40000 USD
            },
          },
        },
      };

      mockedAxios.get.mockImplementation((url: string) => {
        if (url.includes('exchangerate-api.com')) {
          return Promise.resolve(mockMainResponse);
        }
        if (url.includes('coinbase.com')) {
          return Promise.resolve(mockCryptoResponse);
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      const result = await CurrencyAPI.getExchangeRates();

      expect(result.base).toBe('USD');
      expect(result.rates).toHaveProperty('EUR');
      expect(result.rates).toHaveProperty('BTC');
      expect(result.rates.BTC).toBeCloseTo(0.000025, 6); // 1/40000
      expect(result.rates).toHaveProperty('XAU'); // Gold
      expect(result.rates).toHaveProperty('XAG'); // Silver

      // Verify cacheRates was called
      expect(mockedStorage.cacheRates).toHaveBeenCalled();
    });

    it('should use fallback crypto rates on error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockMainResponse = {
        data: {
          base: 'USD',
          rates: {
            EUR: 0.85,
          },
        },
      };

      mockedAxios.get.mockImplementation((url: string) => {
        if (url.includes('exchangerate-api.com')) {
          return Promise.resolve(mockMainResponse);
        }
        if (url.includes('coinbase.com')) {
          return Promise.reject(new Error('Crypto API error'));
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      const result = await CurrencyAPI.getExchangeRates();

      expect(result.rates.BTC).toBe(0.000025); // Fallback rate
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('convertCurrency', () => {
    const mockRates = {
      base: 'USD',
      rates: {
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
      },
    };

    it('should convert currency correctly', () => {
      const result = CurrencyAPI.convertCurrency(100, 'USD', 'EUR', mockRates);
      expect(result).toBeCloseTo(85, 1);
    });

    it('should handle same currency conversion', () => {
      const result = CurrencyAPI.convertCurrency(100, 'USD', 'USD', mockRates);
      expect(result).toBe(100);
    });

    it('should handle zero amount', () => {
      const result = CurrencyAPI.convertCurrency(0, 'USD', 'EUR', mockRates);
      expect(result).toBe(0);
    });

    it('should handle negative amounts', () => {
      const result = CurrencyAPI.convertCurrency(-100, 'USD', 'EUR', mockRates);
      expect(result).toBeCloseTo(-85, 1);
    });

    it('should convert from non-USD currency', () => {
      const result = CurrencyAPI.convertCurrency(100, 'EUR', 'GBP', mockRates);
      // 100 EUR -> USD: 100 / 0.85 = 117.65 USD
      // 117.65 USD -> GBP: 117.65 * 0.73 = 85.88 GBP
      expect(result).toBeCloseTo(85.88, 1);
    });

    it('should convert to USD from other currency', () => {
      const result = CurrencyAPI.convertCurrency(85, 'EUR', 'USD', mockRates);
      expect(result).toBeCloseTo(100, 1);
    });
  });
});
