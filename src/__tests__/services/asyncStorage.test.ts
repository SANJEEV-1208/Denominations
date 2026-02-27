import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService } from '../../services/storage/asyncStorage';

describe('StorageService', () => {
  beforeEach(() => {
    AsyncStorage.clear();
    jest.clearAllMocks();
  });

  describe('getSavedCurrencies', () => {
    it('should retrieve saved currencies from AsyncStorage', async () => {
      const mockCurrencies = ['USD', 'EUR', 'GBP'];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockCurrencies)
      );

      const result = await StorageService.getSavedCurrencies();

      expect(result).toEqual(mockCurrencies);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@denominations_saved_currencies');
    });

    it('should return default currencies when no data exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await StorageService.getSavedCurrencies();

      expect(result).toEqual(['USD', 'INR', 'AED']);
    });

    it('should return default currencies on error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      const result = await StorageService.getSavedCurrencies();

      expect(result).toEqual(['USD', 'INR', 'AED']);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('saveCurrencies', () => {
    it('should save currencies to AsyncStorage', async () => {
      const currencies = ['USD', 'EUR', 'GBP'];

      await StorageService.saveCurrencies(currencies);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@denominations_saved_currencies',
        JSON.stringify(currencies)
      );
    });

    it('should handle empty array', async () => {
      const currencies: string[] = [];

      await StorageService.saveCurrencies(currencies);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@denominations_saved_currencies',
        JSON.stringify(currencies)
      );
    });

    it('should handle errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      await StorageService.saveCurrencies(['USD']);

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('saveLastConversion', () => {
    it('should save last conversion data with correct keys', async () => {
      const conversions = { EUR: 85, GBP: 73 };
      const baseCurrency = 'USD';
      const amount = 100;

      await StorageService.saveLastConversion(conversions, baseCurrency, amount);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@denominations_last_conversion_data',
        JSON.stringify(conversions)
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@denominations_last_conversion_base',
        JSON.stringify({ currency: baseCurrency, amount })
      );
    });
  });

  describe('getLastConversion', () => {
    it('should retrieve last conversion data', async () => {
      const mockConversions = { EUR: 85, GBP: 73 };
      const mockBase = { currency: 'USD', amount: 100 };

      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(mockConversions))
        .mockResolvedValueOnce(JSON.stringify(mockBase));

      const result = await StorageService.getLastConversion();

      expect(result).toEqual({
        conversions: mockConversions,
        base: mockBase,
      });
    });

    it('should return null when no last conversion exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await StorageService.getLastConversion();

      expect(result).toEqual({
        conversions: null,
        base: null,
      });
    });
  });
});
