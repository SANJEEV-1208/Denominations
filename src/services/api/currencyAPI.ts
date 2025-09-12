import axios from 'axios';
import { StorageService } from '../storage/asyncStorage';
import { ExchangeRates } from '../../types';

const API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest';
const FALLBACK_API_URL = 'https://api.fixer.io/latest'; // Fallback API
const METALS_API_URL = 'https://api.metals.live/v1/spot';
const CRYPTO_API_URL = 'https://api.coinbase.com/v2/exchange-rates';

export const CurrencyAPI = {
  async getExchangeRates(baseCurrency: string = 'USD'): Promise<ExchangeRates> {
    try {
      // First, check for cached rates
      const cachedRates = await StorageService.getCachedRates();
      if (cachedRates) {
        return cachedRates;
      }

      // If no cache or expired, fetch new rates
      try {
        const response = await axios.get(`${API_BASE_URL}/${baseCurrency}`, {
          timeout: 10000, // 10 second timeout
        });

        let rates = response.data;
        
        // Fetch commodity and crypto rates
        try {
          // Fetch Bitcoin rate from Coinbase
          const cryptoResponse = await axios.get(`${CRYPTO_API_URL}?currency=BTC`, {
            timeout: 5000,
          });
          if (cryptoResponse.data?.data?.rates?.USD) {
            const btcToUsd = parseFloat(cryptoResponse.data.data.rates.USD);
            rates.rates.BTC = 1 / btcToUsd; // Invert to get USD to BTC rate
          }
        } catch (cryptoError) {
          console.log('Failed to fetch crypto rates, using fallback');
          rates.rates.BTC = 0.000025; // Fallback rate (1 BTC ≈ 40,000 USD)
        }
        
        // Add fallback rates for Gold and Silver (these would normally come from a metals API)
        // Using approximate rates: 1 oz Gold ≈ 2000 USD, 1 oz Silver ≈ 25 USD
        rates.rates.XAU = 1 / 2000; // USD to Gold oz
        rates.rates.XAG = 1 / 25;   // USD to Silver oz
        
        // Cache the new rates
        await StorageService.cacheRates(rates);
        
        return rates;
      } catch (primaryError) {
        console.error('Primary API failed, trying fallback:', primaryError);
        
        // Try fallback API
        try {
          const fallbackResponse = await axios.get(FALLBACK_API_URL, {
            params: { base: baseCurrency },
            timeout: 10000,
          });
          
          const rates = fallbackResponse.data;
          await StorageService.cacheRates(rates);
          return rates;
        } catch (fallbackError) {
          console.error('Fallback API also failed:', fallbackError);
          throw fallbackError;
        }
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      
      // If all APIs fail, try to return cached rates even if expired
      const expiredCache = await StorageService.getCachedRates();
      if (expiredCache) {
        console.log('Using expired cache as fallback');
        return expiredCache;
      }
      
      // If no cache at all, return mock data for development
      return {
        base: baseCurrency,
        date: new Date().toISOString().split('T')[0],
        rates: {
          USD: 1,
          EUR: 0.85,
          GBP: 0.73,
          JPY: 110.0,
          CNY: 6.45,
          INR: 74.5,
          AED: 3.67,
          AUD: 1.35,
          CAD: 1.25,
          CHF: 0.92,
          XAU: 0.0005,  // 1 oz Gold ≈ 2000 USD
          XAG: 0.04,    // 1 oz Silver ≈ 25 USD
          BTC: 0.000025, // 1 BTC ≈ 40,000 USD
        },
      };
    }
  },

  convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    rates: ExchangeRates
  ): number {
    if (fromCurrency === toCurrency) return amount;
    
    // If rates are in USD base
    if (rates.base === 'USD') {
      if (fromCurrency === 'USD') {
        return amount * (rates.rates[toCurrency] || 1);
      } else if (toCurrency === 'USD') {
        return amount / (rates.rates[fromCurrency] || 1);
      } else {
        // Convert through USD
        const usdAmount = amount / (rates.rates[fromCurrency] || 1);
        return usdAmount * (rates.rates[toCurrency] || 1);
      }
    }
    
    // Generic conversion formula
    const fromRate = rates.rates[fromCurrency] || 1;
    const toRate = rates.rates[toCurrency] || 1;
    return (amount * toRate) / fromRate;
  },

  formatCurrency(amount: number, decimals: number = 4): string {
    if (amount >= 1000) {
      return amount.toFixed(2);
    } else if (amount >= 1) {
      return amount.toFixed(4);
    } else {
      return amount.toFixed(6);
    }
  },
};