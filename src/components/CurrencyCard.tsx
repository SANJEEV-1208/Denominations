import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../constants/typography';
import { Currency } from '../types';

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
        <View style={[styles.flagCircle, { backgroundColor: theme.colors.BACKGROUND }]}>
          <Text style={styles.flag}>{currency.flag}</Text>
        </View>
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
  flagCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  flag: {
    fontSize: 35,
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