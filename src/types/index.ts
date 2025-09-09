export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export interface ExchangeRates {
  base: string;
  date: string;
  rates: {
    [key: string]: number;
  };
}

export interface CachedRates {
  rates: ExchangeRates;
  timestamp: number;
}

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Calculate: { currencyCode: string };
  EditList: undefined;
};