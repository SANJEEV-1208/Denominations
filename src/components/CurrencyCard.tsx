import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Currency } from '../types';

interface CurrencyCardProps {
  currency: Currency;
  rate: number;
  onPress: () => void;
  isSelected?: boolean;
}

const { width } = Dimensions.get('window');

export const CurrencyCard: React.FC<CurrencyCardProps> = ({
  currency,
  rate,
  onPress,
  isSelected = false,
}) => {
  const formatRate = (value: number): string => {
    if (value >= 1000) {
      return value.toFixed(2);
    } else if (value >= 1) {
      return value.toFixed(4);
    } else {
      return value.toFixed(6);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <View style={styles.flagCircle}>
          <Text style={styles.flag}>{currency.flag}</Text>
        </View>
      </View>
      
      <View style={styles.centerContent}>
        <Text style={styles.rate}>{formatRate(rate)}</Text>
        <Text style={styles.currencyInfo}>
          {currency.code} ({currency.name}) {currency.symbol}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 90,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedContainer: {
    backgroundColor: Colors.SELECTED_CARD_BG,
    borderWidth: 2,
    borderColor: Colors.SELECTED_CARD_BORDER,
  },
  leftContent: {
    marginRight: 16,
  },
  flagCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.BACKGROUND,
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
    fontSize: 32,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  rate: {
    fontSize: 26,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  currencyInfo: {
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '400',
    color: Colors.TEXT_BODY,
    letterSpacing: 0.2,
  },
});