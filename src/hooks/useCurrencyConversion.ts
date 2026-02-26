import { useMemo } from 'react';
import { CurrencyAPI } from '../services/api/currencyAPI';
import { ExchangeRates } from '../types';

export const useCurrencyConversion = (
  effectiveValue: string,
  currencyCode: string,
  savedCurrencyCodes: string[],
  exchangeRates: ExchangeRates | null
) => {
  const computedConversions = useMemo(() => {
    const amount = Number.parseFloat(effectiveValue) || 0;
    if (amount === 0 || !exchangeRates) {
      return {};
    }

    const newConversions: { [key: string]: number } = {};
    newConversions[currencyCode] = amount;

    for (const code of savedCurrencyCodes) {
      if (code !== currencyCode) {
        const converted = CurrencyAPI.convertCurrency(
          amount,
          currencyCode,
          code,
          exchangeRates
        );
        newConversions[code] = converted;
      }
    }

    return newConversions;
  }, [effectiveValue, exchangeRates, savedCurrencyCodes, currencyCode]);

  const createConversions = (value: string): { [key: string]: number } => {
    const amount = parseFloat(value) || 0;
    if (amount === 0 || !exchangeRates) {
      return {};
    }

    const newConversions: { [key: string]: number } = {};
    newConversions[currencyCode] = amount;

    for (const code of savedCurrencyCodes) {
      if (code !== currencyCode) {
        const converted = CurrencyAPI.convertCurrency(
          amount,
          currencyCode,
          code,
          exchangeRates
        );
        newConversions[code] = converted;
      }
    }

    return newConversions;
  };

  return {
    computedConversions,
    createConversions,
  };
};
