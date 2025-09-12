import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GoldIcon from '../../assets/Gold.svg';
import SilverIcon from '../../assets/Silver.svg';
import BitcoinIcon from '../../assets/bitcoin.svg';
import { Currency } from '../types';

interface CurrencyIconProps {
  currency: Currency;
  size?: number;
  backgroundColor?: string;
}

export const CurrencyIcon: React.FC<CurrencyIconProps> = ({ 
  currency, 
  size = 70,
  backgroundColor = 'black' 
}) => {
  const iconSize = size * 0.5;
  
  const renderIcon = () => {
    if (currency.icon) {
      switch (currency.icon) {
        case 'Gold':
          return <GoldIcon width={iconSize} height={iconSize} />;
        case 'Silver':
          return <SilverIcon width={iconSize} height={iconSize} />;
        case 'bitcoin':
          return <BitcoinIcon width={iconSize} height={iconSize} />;
        default:
          return null;
      }
    } else if (currency.flag) {
      return <Text style={[styles.flag, { fontSize: size * 0.5 }]}>{currency.flag}</Text>;
    }
    return null;
  };

  return (
    <View 
      style={[
        styles.iconCircle, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          backgroundColor: backgroundColor 
        }
      ]}
    >
      {renderIcon()}
    </View>
  );
};

const styles = StyleSheet.create({
  iconCircle: {
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
    textAlign: 'center',
  },
});