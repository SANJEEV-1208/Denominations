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
        <Text style={styles.flag}>{currency.flag}</Text>
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
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 15,
  },
  flag: {
    fontSize: 40,
  },
  centerContent: {
    flex: 1,
  },
  rate: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 4,
  },
  currencyInfo: {
    fontSize: 14,
    color: Colors.TEXT_BODY,
  },
});