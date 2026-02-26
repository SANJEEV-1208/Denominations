import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { CurrencyIcon } from './CurrencyIcon';
import { Currency } from '../types';

interface CurrencyListItemProps {
  currency: Currency;
  iconSize?: number;
  showSymbol?: boolean;
}

export const CurrencyListItem: React.FC<CurrencyListItemProps> = ({
  currency,
  iconSize = 70,
  showSymbol = true
}) => {
  const theme = useTheme();

  return (
    <>
      <CurrencyIcon
        currency={currency}
        size={iconSize}
        backgroundColor={theme.dark ? "black" : "white"}
      />
      <View style={styles.currencyInfo}>
        <Text style={[styles.currencyCode, { color: theme.colors.TEXT_PRIMARY }]}>
          {currency.code}
        </Text>
        <Text style={[styles.currencyName, { color: theme.colors.TEXT_BODY }]}>
          {currency.name} {showSymbol && currency.symbol}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  currencyInfo: {
    flex: 1,
    marginLeft: 16,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
  },
  currencyName: {
    fontSize: 12,
    marginTop: 2,
  },
});
