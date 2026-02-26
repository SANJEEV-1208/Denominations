import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  SAVED_CURRENCIES: '@denominations_saved_currencies',
  CACHED_RATES: '@denominations_cached_rates',
  LAST_UPDATE: '@denominations_last_update',
  LAST_CONVERSION_DATA: '@denominations_last_conversion_data',
  LAST_CONVERSION_BASE: '@denominations_last_conversion_base',
};

interface CachedRates {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export const StorageService = {
  // Currency list management
  async getSavedCurrencies(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_CURRENCIES);
      return data ? JSON.parse(data) : ['USD', 'INR', 'AED']; // Default currencies
    } catch (error) {
      console.error('Error loading saved currencies:', error);
      return ['USD', 'INR', 'AED'];
    }
  },

  async saveCurrencies(currencies: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SAVED_CURRENCIES,
        JSON.stringify(currencies)
      );
    } catch (error) {
      console.error('Error saving currencies:', error);
    }
  },

  // Exchange rates caching
  async getCachedRates(): Promise<CachedRates | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_RATES);
      const lastUpdate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_UPDATE);
      
      if (data && lastUpdate) {
        const updateTime = Number.parseInt(lastUpdate, 10);
        const now = Date.now();
        const thirtyMinutes = 30 * 60 * 1000;
        
        // Check if cache is still valid (less than 30 minutes old)
        if (now - updateTime < thirtyMinutes) {
          return JSON.parse(data);
        }
      }
      return null;
    } catch (error) {
      console.error('Error loading cached rates:', error);
      return null;
    }
  },

  async cacheRates(rates: any): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.CACHED_RATES,
        JSON.stringify(rates)
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_UPDATE,
        Date.now().toString()
      );
    } catch (error) {
      console.error('Error caching rates:', error);
    }
  },

  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CACHED_RATES);
      await AsyncStorage.removeItem(STORAGE_KEYS.LAST_UPDATE);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  },

  // Last conversion management
  async saveLastConversion(conversions: { [key: string]: number }, baseCurrency: string, amount: number): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_CONVERSION_DATA,
        JSON.stringify(conversions)
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_CONVERSION_BASE,
        JSON.stringify({ currency: baseCurrency, amount })
      );
    } catch (error) {
      console.error('Error saving last conversion:', error);
    }
  },

  async getLastConversion(): Promise<{ conversions: { [key: string]: number } | null, base: { currency: string; amount: number } | null }> {
    try {
      const conversionsData = await AsyncStorage.getItem(STORAGE_KEYS.LAST_CONVERSION_DATA);
      const baseData = await AsyncStorage.getItem(STORAGE_KEYS.LAST_CONVERSION_BASE);
      
      const conversions = conversionsData ? JSON.parse(conversionsData) : null;
      const base = baseData ? JSON.parse(baseData) : null;
      
      return { conversions, base };
    } catch (error) {
      console.error('Error loading last conversion:', error);
      return { conversions: null, base: null };
    }
  },
};