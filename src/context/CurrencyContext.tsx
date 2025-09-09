import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StorageService } from '../services/storage/asyncStorage';
import { CurrencyAPI } from '../services/api/currencyAPI';
import { Currency, ExchangeRates } from '../types';
import { CURRENCIES } from '../constants/currencies';

interface CurrencyContextType {
  savedCurrencyCodes: string[];
  allCurrencies: Currency[];
  exchangeRates: ExchangeRates | null;
  isLoading: boolean;
  addCurrency: (code: string) => Promise<void>;
  removeCurrency: (code: string) => Promise<void>;
  reorderCurrencies: (codes: string[]) => Promise<void>;
  refreshRates: () => Promise<void>;
  getCurrencyByCode: (code: string) => Currency | undefined;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [savedCurrencyCodes, setSavedCurrencyCodes] = useState<string[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      // Load saved currencies
      const savedCodes = await StorageService.getSavedCurrencies();
      setSavedCurrencyCodes(savedCodes);
      
      // Load exchange rates
      const rates = await CurrencyAPI.getExchangeRates('USD');
      setExchangeRates(rates);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addCurrency = async (code: string) => {
    if (!savedCurrencyCodes.includes(code)) {
      const newCodes = [...savedCurrencyCodes, code];
      setSavedCurrencyCodes(newCodes);
      await StorageService.saveCurrencies(newCodes);
    }
  };

  const removeCurrency = async (code: string) => {
    const newCodes = savedCurrencyCodes.filter(c => c !== code);
    setSavedCurrencyCodes(newCodes);
    await StorageService.saveCurrencies(newCodes);
  };

  const reorderCurrencies = async (codes: string[]) => {
    setSavedCurrencyCodes(codes);
    await StorageService.saveCurrencies(codes);
  };

  const refreshRates = async () => {
    try {
      setIsLoading(true);
      await StorageService.clearCache();
      const rates = await CurrencyAPI.getExchangeRates('USD');
      setExchangeRates(rates);
    } catch (error) {
      console.error('Error refreshing rates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrencyByCode = (code: string): Currency | undefined => {
    return CURRENCIES.find(c => c.code === code);
  };

  const value: CurrencyContextType = {
    savedCurrencyCodes,
    allCurrencies: CURRENCIES,
    exchangeRates,
    isLoading,
    addCurrency,
    removeCurrency,
    reorderCurrencies,
    refreshRates,
    getCurrencyByCode,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};