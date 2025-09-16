import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../constants/typography';
import { Currency } from '../types';
import { CurrencyIcon } from './CurrencyIcon';

interface CurrencyCardProps {
  currency: Currency;
  rate: number;
  onPress: () => void;
  isSelected?: boolean;
  conversionValue?: number;
}

const { width } = Dimensions.get('window');

export const CurrencyCard: React.FC<CurrencyCardProps> = ({
  currency,
  rate,
  onPress,
  isSelected = false,
  conversionValue,
}) => {
  const theme = useTheme();
  
  const formatRate = (value: number): string => {
    if (value >= 1000) {
      return value.toFixed(2);
    } else if (value >= 1) {
      return value.toFixed(4);
    } else {
      return value.toFixed(6);
    }
  };

  const displayValue = conversionValue !== undefined ? conversionValue : rate;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: theme.colors.CARD_BACKGROUND,
          marginHorizontal: 0, // Remove margin as parent has padding
        },
        isSelected && {
          backgroundColor: theme.colors.SELECTED_CARD_BG,
          borderWidth: 2,
          borderColor: theme.colors.SELECTED_CARD_BORDER,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <CurrencyIcon currency={currency} size={70} backgroundColor={theme.dark ? "black" : "white"} />
      </View>
      
      <View style={styles.centerContent}>
        <Text style={[styles.rate, { color: theme.colors.TEXT_PRIMARY }]}>
          {formatRate(displayValue)}
        </Text>
        <Text style={[styles.currencyInfo, { color: theme.colors.TEXT_BODY }]}>
          {currency.code} ({currency.name}) {currency.symbol}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 77,
  },
  leftContent: {
    marginRight: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  rate: {
    fontSize: 26,
    fontFamily: 'SpaceMono-Regular',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  currencyInfo: {
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '400',
    letterSpacing: 0.2,
  },
});