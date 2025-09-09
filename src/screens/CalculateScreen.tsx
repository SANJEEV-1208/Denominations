import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useCurrency } from '../context/CurrencyContext';
import { NumberPad } from '../components/NumberPad';
import { CurrencyAPI } from '../services/api/currencyAPI';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { RootStackParamList } from '../types';
import { debounce } from '../utils/debounce';
// @ts-ignore
import CloseIcon from '../assets/Close.svg';
// @ts-ignore
import ClearIcon from '../assets/Clear-Text-Feild.svg';

type CalculateScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Calculate'>;
type CalculateScreenRouteProp = RouteProp<RootStackParamList, 'Calculate'>;

const { width } = Dimensions.get('window');

export const CalculateScreen: React.FC = () => {
  const navigation = useNavigation<CalculateScreenNavigationProp>();
  const route = useRoute<CalculateScreenRouteProp>();
  const { currencyCode } = route.params;
  
  const { 
    savedCurrencyCodes, 
    exchangeRates, 
    getCurrencyByCode 
  } = useCurrency();
  
  const [inputValue, setInputValue] = useState('1');
  const [conversions, setConversions] = useState<{ [key: string]: number }>({});
  
  const selectedCurrency = getCurrencyByCode(currencyCode);

  // Debounced conversion calculation
  const calculateConversions = useMemo(
    () => debounce((value: string) => {
      const amount = parseFloat(value) || 0;
      if (amount === 0 || !exchangeRates) {
        setConversions({});
        return;
      }

      const newConversions: { [key: string]: number } = {};
      
      savedCurrencyCodes.forEach(code => {
        if (code !== currencyCode) {
          const converted = CurrencyAPI.convertCurrency(
            amount,
            currencyCode,
            code,
            exchangeRates
          );
          newConversions[code] = converted;
        }
      });
      
      setConversions(newConversions);
    }, 300),
    [currencyCode, savedCurrencyCodes, exchangeRates]
  );

  useEffect(() => {
    calculateConversions(inputValue);
  }, [inputValue, calculateConversions]);

  const handleNumberPress = (num: string) => {
    if (inputValue === '0') {
      setInputValue(num);
    } else {
      setInputValue(inputValue + num);
    }
  };

  const handleDecimalPress = () => {
    if (!inputValue.includes('.')) {
      setInputValue(inputValue + '.');
    }
  };

  const handleBackspacePress = () => {
    if (inputValue.length > 1) {
      setInputValue(inputValue.slice(0, -1));
    } else {
      setInputValue('0');
    }
  };

  const handleClearPress = () => {
    setInputValue('0');
  };

  const handleCalculatePress = () => {
    // Trigger recalculation
    calculateConversions(inputValue);
  };

  const formatValue = (value: number): string => {
    return CurrencyAPI.formatCurrency(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Denominations</Text>
          <Text style={styles.subtitle}>Calculate</Text>
        </View>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.closeButton}
        >
          <View style={styles.closeIconContainer}>
            <CloseIcon width={24} height={24} fill={Colors.BACKGROUND} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Selected Currency Card */}
        <LinearGradient
          colors={[Colors.GRADIENT_START, Colors.GRADIENT_END]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.selectedCard}
        >
          <View style={styles.selectedCardContent}>
            <View style={styles.flagContainer}>
              <Text style={styles.selectedFlag}>{selectedCurrency?.flag}</Text>
            </View>
            <View style={styles.selectedInfo}>
              <Text style={styles.selectedAmount}>{inputValue}</Text>
              <Text style={styles.selectedCurrency}>
                {selectedCurrency?.code} ({selectedCurrency?.name}) {selectedCurrency?.symbol}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Conversion Results */}
        <View style={styles.conversionsContainer}>
          {savedCurrencyCodes
            .filter(code => code !== currencyCode)
            .map(code => {
              const currency = getCurrencyByCode(code);
              const value = conversions[code] || 0;
              
              return (
                <View key={code} style={styles.conversionCard}>
                  <Text style={styles.conversionFlag}>{currency?.flag}</Text>
                  <View style={styles.conversionInfo}>
                    <Text style={styles.conversionValue}>
                      {value > 0 ? formatValue(value) : '—'}
                    </Text>
                    <Text style={styles.conversionCurrency}>
                      {currency?.code} ({currency?.name}) {currency?.symbol}
                    </Text>
                  </View>
                </View>
              );
            })}
        </View>

        {/* Input Field */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="numeric"
              editable={false}
              placeholder="0"
            />
            <TouchableOpacity onPress={handleClearPress} style={styles.clearButton}>
              <Text style={styles.clearText}>×</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.calculateButton}
            onPress={handleCalculatePress}
          >
            <Text style={styles.calculateText}>=</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Number Pad */}
      <NumberPad
        onNumberPress={handleNumberPress}
        onDecimalPress={handleDecimalPress}
        onBackspacePress={handleBackspacePress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    ...Typography.HEADER,
    fontSize: 20,
  },
  subtitle: {
    ...Typography.SUBTITLE,
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  closeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  selectedCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 2,
  },
  selectedCardContent: {
    backgroundColor: Colors.BACKGROUND,
    borderRadius: 14,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  flagContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  selectedFlag: {
    fontSize: 32,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedAmount: {
    ...Typography.NUMBER_LARGE,
    color: Colors.TEXT_WHITE,
  },
  selectedCurrency: {
    fontSize: 14,
    color: Colors.TEXT_WHITE,
    marginTop: 4,
  },
  conversionsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  conversionCard: {
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  conversionFlag: {
    fontSize: 32,
    marginRight: 15,
  },
  conversionInfo: {
    flex: 1,
  },
  conversionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.TEXT_PRIMARY,
  },
  conversionCurrency: {
    fontSize: 12,
    color: Colors.TEXT_BODY,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginVertical: 20,
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    alignItems: 'center',
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  clearButton: {
    padding: 5,
  },
  clearText: {
    fontSize: 24,
    color: Colors.TEXT_BODY,
  },
  calculateButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calculateText: {
    fontSize: 24,
    color: Colors.BACKGROUND,
    fontWeight: 'bold',
  },
});