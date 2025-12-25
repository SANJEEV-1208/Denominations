import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { CustomBlurView } from '../components/CustomBlurView';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { CurrencyAPI } from '../services/api/currencyAPI';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { RootStackParamList } from '../types';
import { CloseIcon } from '../components/Icons';
import { CurrencyIcon } from '../components/CurrencyIcon';
// @ts-ignore
import ClearIcon from '../assets/Clear-Text-Feild.svg';
// @ts-ignore
import CalculateIcon from '../assets/Calculate.svg';
// @ts-ignore
import DeleteIcon from '../assets/delete.svg';
// @ts-ignore
import PlusIcon from '../assets/plus.svg';
// @ts-ignore
import MinusIcon from '../assets/minus.svg';
// @ts-ignore
import DivideIcon from '../assets/divide.svg';
// @ts-ignore
import MultiplyIcon from '../assets/multiply.svg';

type CalculateScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Calculate'>;
type CalculateScreenRouteProp = RouteProp<RootStackParamList, 'Calculate'>;

const { width } = Dimensions.get('window');

export const CalculateScreen: React.FC = () => {
  const navigation = useNavigation<CalculateScreenNavigationProp>();
  const route = useRoute<CalculateScreenRouteProp>();
  const theme = useTheme();
  const { currencyCode } = route.params;
  
  const { 
    savedCurrencyCodes, 
    exchangeRates, 
    getCurrencyByCode,
    setLastConversions 
  } = useCurrency();
  
  const [inputValue, setInputValue] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNewNumber, setWaitingForNewNumber] = useState(false);

  const selectedCurrency = getCurrencyByCode(currencyCode);

  // Compute display value showing the full expression (e.g., "1+1", "3-1")
  const getOperatorSymbol = (op: string): string => {
    switch (op) {
      case '+': return '+';
      case '-': return '-';
      case '*': return '×';
      case '/': return '÷';
      default: return op;
    }
  };

  const displayExpression = useMemo(() => {
    if (previousValue !== null && operator !== null) {
      return `${previousValue}${getOperatorSymbol(operator)}${waitingForNewNumber ? '' : inputValue}`;
    }
    return inputValue;
  }, [previousValue, operator, inputValue, waitingForNewNumber]);

  // Compute the effective value for conversions (handles pending math operations)
  const effectiveValue = useMemo(() => {
    console.log('Computing effectiveValue:', { inputValue, previousValue, operator, waitingForNewNumber });
    if (previousValue !== null && operator !== null) {
      if (waitingForNewNumber) {
        // User just pressed operator, show previousValue for now
        console.log('Waiting for new number, returning previousValue:', previousValue);
        return previousValue;
      } else {
        // Calculate the result of the pending operation
        const prev = parseFloat(previousValue);
        const current = parseFloat(inputValue) || 0;
        let result: number;
        switch (operator) {
          case '+':
            result = prev + current;
            break;
          case '-':
            result = prev - current;
            break;
          case '*':
            result = prev * current;
            break;
          case '/':
            result = current !== 0 ? prev / current : 0;
            break;
          default:
            result = current;
        }
        const resultStr = String(parseFloat(result.toFixed(8)));
        console.log('Calculated result:', resultStr);
        return resultStr;
      }
    }
    console.log('No operator, returning inputValue:', inputValue);
    return inputValue;
  }, [inputValue, previousValue, operator, waitingForNewNumber]);

  // Compute conversions based on effective value
  const computedConversions = useMemo(() => {
    const amount = parseFloat(effectiveValue) || 0;
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

  // Save conversions to context (for button press - saves to context for home screen)
  const saveConversionsToContext = (value: string) => {
    const amount = parseFloat(value) || 0;
    if (amount === 0 || !exchangeRates) {
      setLastConversions({}, currencyCode, 0);
      return;
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

    // Store in context for display on home screen
    setLastConversions(newConversions, currencyCode, amount);
  };

  const handleNumberPress = (num: string) => {
    if (waitingForNewNumber) {
      setInputValue(num);
      setWaitingForNewNumber(false);
    } else if (inputValue === '0') {
      setInputValue(num);
    } else {
      setInputValue(inputValue + num);
    }
  };

  const handleDecimalPress = () => {
    if (waitingForNewNumber) {
      setInputValue('0.');
      setWaitingForNewNumber(false);
    } else if (!inputValue.includes('.')) {
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
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewNumber(false);
  };

  const performCalculation = (prev: number, current: number, op: string): number => {
    switch (op) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '*':
        return prev * current;
      case '/':
        return current !== 0 ? prev / current : 0;
      default:
        return current;
    }
  };

  const handleOperatorPress = (op: string) => {
    const currentValue = parseFloat(inputValue) || 0;

    if (previousValue !== null && operator && !waitingForNewNumber) {
      // Chain calculation
      const result = performCalculation(parseFloat(previousValue), currentValue, operator);
      const resultStr = String(parseFloat(result.toFixed(8)));
      setInputValue(resultStr);
      setPreviousValue(resultStr);
    } else {
      setPreviousValue(inputValue);
    }

    setOperator(op);
    setWaitingForNewNumber(true);
  };

  const handleEqualsPress = () => {
    if (previousValue === null || operator === null) {
      return;
    }

    const prev = parseFloat(previousValue);
    const current = parseFloat(inputValue) || 0;
    const result = performCalculation(prev, current, operator);
    const resultStr = String(parseFloat(result.toFixed(8)));

    setInputValue(resultStr);
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewNumber(true);
  };

  const handleCalculatePress = () => {
    // First complete any pending math operation
    let finalValue = inputValue;
    if (previousValue !== null && operator !== null) {
      const prev = parseFloat(previousValue);
      const current = parseFloat(inputValue) || 0;
      const result = performCalculation(prev, current, operator);
      finalValue = String(parseFloat(result.toFixed(8)));
      setInputValue(finalValue);
      setPreviousValue(null);
      setOperator(null);
      setWaitingForNewNumber(true);
    }

    // Save conversions to context for home screen display
    saveConversionsToContext(finalValue);
    // Navigate back to home screen
    navigation.goBack();
  };

  const formatValue = (value: number): string => {
    return CurrencyAPI.formatCurrency(value);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.BACKGROUND }]}>
      <View style={styles.header}>
        <View style={styles.spacer} />
        <View style={styles.headerRight}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.TEXT_PRIMARY }]}>Denominations</Text>
            <Text style={[styles.subtitle, { color: theme.colors.TEXT_BODY }]}>Calculate</Text>
          </View>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.closeButton}
          >
            <View style={[styles.closeIconContainer, { backgroundColor: theme.colors.PRIMARY }]}>
              <CloseIcon width={18} height={18} fill={theme.colors.TEXT_WHITE} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Conversion Results */}
        <ScrollView style={styles.conversionsScrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.conversionsContainer}>
            {/* Selected Currency Card */}
            <LinearGradient
              colors={['#E300FF', '#880099']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.selectedCardBorder}
            >
              <LinearGradient
                colors={['rgba(217, 118, 202, 0.5)', 'rgba(227, 0, 255, 0.5)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.selectedCard}
              >
                <View style={styles.selectedCardContent}>
                  <View style={styles.selectedIconWrapper}>
                    {selectedCurrency && (
                      <CurrencyIcon 
                        currency={selectedCurrency} 
                        size={70} 
                        backgroundColor={theme.dark ? "black" : "white"}
                      />
                    )}
                  </View>
                  <View style={styles.selectedInfo}>
                    <Text style={styles.selectedAmount}>{inputValue}</Text>
                    <Text style={styles.selectedCurrency}>
                      {selectedCurrency?.code} ({selectedCurrency?.name}) {selectedCurrency?.symbol}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </LinearGradient>

            {/* Other Currency Cards */}
            {savedCurrencyCodes
              .filter(code => code !== currencyCode)
              .map(code => {
                const currency = getCurrencyByCode(code);
                const value = computedConversions[code] || 0;
                
                return (
                  <View key={code} style={[styles.conversionCard, { backgroundColor: theme.colors.CARD_BACKGROUND }]}>
                    <View style={styles.conversionIconWrapper}>
                      {currency && (
                        <CurrencyIcon 
                          currency={currency} 
                          size={70} 
                          backgroundColor={theme.dark ? "black" : "white"}
                        />
                      )}
                    </View>
                    <View style={styles.conversionInfo}>
                      <Text style={[styles.conversionValue, { color: theme.colors.TEXT_PRIMARY }]}>
                        {value > 0 ? formatValue(value) : '—'}
                      </Text>
                      <Text style={[styles.conversionCurrency, { color: theme.colors.TEXT_BODY }]}>
                        {currency?.code} ({currency?.name}) {currency?.symbol}
                      </Text>
                    </View>
                  </View>
                );
              })}
          </View>
        </ScrollView>

        {/* Number Pad with Input Field */}
        <View style={styles.numPadWrapper}>
          <BlurView
            intensity={40}
            tint={theme.dark ? "dark" : "light"}
            style={[styles.numPadBlurContainer]}
          >
            <View style={[styles.numPadInnerContainer, { backgroundColor: theme.dark ? 'rgba(117, 117, 117, 0.25)' : 'rgba(217, 217, 217, 0.25)' }]}>
              {/* Input Row */}
              <View style={styles.inputRow}>
                <View style={styles.inputFieldWrapper}>
                  <TouchableOpacity onPress={handleClearPress} style={styles.clearButton}>
                    <Text style={[styles.clearText, { color: theme.dark ? '#FFFFFF' : '#000000' }]}>×</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.input, { color: theme.dark ? '#FFFFFF' : '#000000', backgroundColor: theme.dark ? '#000000' : '#FFFFFF' }]}
                    value={displayExpression}
                    onChangeText={setInputValue}
                    keyboardType="numeric"
                    editable={false}
                    placeholder="0"
                    placeholderTextColor={theme.dark ? '#666666' : '#999999'}
                  />
                </View>
                <TouchableOpacity
                  style={styles.calculateButton}
                  onPress={handleCalculatePress}
                >
                  <CalculateIcon width={24} height={24} />
                </TouchableOpacity>
              </View>

              {/* Row 1: 1, 2, 3, + */}
              <View style={styles.numPadRow}>
                <TouchableOpacity style={[styles.numPadButton, { backgroundColor: theme.dark ? '#000000' : '#FFFFFF' }]} onPress={() => handleNumberPress('1')}>
                  <Text style={[styles.numPadText, { color: theme.dark ? '#FFFFFF' : '#000000' }]}>1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numPadButton, { backgroundColor: theme.dark ? '#000000' : '#FFFFFF' }]} onPress={() => handleNumberPress('2')}>
                  <Text style={[styles.numPadText, { color: theme.dark ? '#FFFFFF' : '#000000' }]}>2</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numPadButton, { backgroundColor: theme.dark ? '#000000' : '#FFFFFF' }]} onPress={() => handleNumberPress('3')}>
                  <Text style={[styles.numPadText, { color: theme.dark ? '#FFFFFF' : '#000000' }]}>3</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numPadButton, { backgroundColor: theme.dark ? '#000000' : '#FFFFFF' }]} onPress={() => handleOperatorPress('+')}>
                  <PlusIcon width={20} height={20} color={theme.dark ? '#FFFFFF' : '#000000'} />
                </TouchableOpacity>
              </View>

              {/* Row 2: 4, 5, 6, - */}
              <View style={styles.numPadRow}>
                <TouchableOpacity style={[styles.numPadButton, { backgroundColor: theme.dark ? '#000000' : '#FFFFFF' }]} onPress={() => handleNumberPress('4')}>
                  <Text style={[styles.numPadText, { color: theme.dark ? '#FFFFFF' : '#000000' }]}>4</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numPadButton, { backgroundColor: theme.dark ? '#000000' : '#FFFFFF' }]} onPress={() => handleNumberPress('5')}>
                  <Text style={[styles.numPadText, { color: theme.dark ? '#FFFFFF' : '#000000' }]}>5</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numPadButton, { backgroundColor: theme.dark ? '#000000' : '#FFFFFF' }]} onPress={() => handleNumberPress('6')}>
                  <Text style={[styles.numPadText, { color: theme.dark ? '#FFFFFF' : '#000000' }]}>6</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numPadButton, { backgroundColor: theme.dark ? '#000000' : '#FFFFFF' }]} onPress={() => handleOperatorPress('-')}>
                  <MinusIcon width={20} height={20} color={theme.dark ? '#FFFFFF' : '#000000'} />
                </TouchableOpacity>
              </View>

              {/* Row 3: 7, 8, 9, × */}
              <View style={styles.numPadRow}>
                <TouchableOpacity style={[styles.numPadButton, { backgroundColor: theme.dark ? '#000000' : '#FFFFFF' }]} onPress={() => handleNumberPress('7')}>
                  <Text style={[styles.numPadText, { color: theme.dark ? '#FFFFFF' : '#000000' }]}>7</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numPadButton, { backgroundColor: theme.dark ? '#000000' : '#FFFFFF' }]} onPress={() => handleNumberPress('8')}>
                  <Text style={[styles.numPadText, { color: theme.dark ? '#FFFFFF' : '#000000' }]}>8</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numPadButton, { backgroundColor: theme.dark ? '#000000' : '#FFFFFF' }]} onPress={() => handleNumberPress('9')}>
                  <Text style={[styles.numPadText, { color: theme.dark ? '#FFFFFF' : '#000000' }]}>9</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numPadButton, { backgroundColor: theme.dark ? '#000000' : '#FFFFFF' }]} onPress={() => handleOperatorPress('*')}>
                  <MultiplyIcon width={20} height={20} color={theme.dark ? '#FFFFFF' : '#000000'} />
                </TouchableOpacity>
              </View>

              {/* Row 4: ., 0, ⌫, ÷ */}
              <View style={[styles.numPadRow, { marginBottom: 0 }]}>
                <TouchableOpacity style={[styles.numPadButton, { backgroundColor: theme.dark ? '#000000' : '#FFFFFF' }]} onPress={handleDecimalPress}>
                  <Text style={[styles.numPadText, { color: theme.dark ? '#FFFFFF' : '#000000' }]}>.</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numPadButton, { backgroundColor: theme.dark ? '#000000' : '#FFFFFF' }]} onPress={() => handleNumberPress('0')}>
                  <Text style={[styles.numPadText, { color: theme.dark ? '#FFFFFF' : '#000000' }]}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numPadButton, { backgroundColor: theme.dark ? '#000000' : '#FFFFFF' }]} onPress={handleBackspacePress}>
                  <DeleteIcon width={20} height={20} color={theme.dark ? '#FFFFFF' : '#000000'} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.numPadButton, { backgroundColor: theme.dark ? '#000000' : '#FFFFFF' }]} onPress={() => handleOperatorPress('/')}>
                  <DivideIcon width={20} height={20} color={theme.dark ? '#FFFFFF' : '#000000'} />
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  spacer: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'flex-end',
    marginRight: 15,
  },
  title: {
    ...Typography.HEADER,
    fontSize: 20,
    textAlign: 'right',
  },
  subtitle: {
    ...Typography.SUBTITLE,
    marginTop: 2,
    textAlign: 'right',
  },
  closeButton: {
    padding: 8,
  },
  closeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor set dynamically
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  conversionsScrollView: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: ((width - 24) / 4) * 0.7 * 5 + 20, // 5 rows of buttons (70% height) + padding
  },
  scrollContent: {
    flexGrow: 1,
  },
  selectedCardBorder: {
    borderRadius: 16,
    padding: 2,
    marginBottom: 12,
  },
  selectedCard: {
    borderRadius: 14,
  },
  selectedCardContent: {
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    minHeight: 77,
  },
  selectedIconWrapper: {
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#E300FF',
    borderRadius: 37,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedAmount: {
    ...Typography.NUMBER_LARGE,
    fontFamily: 'SpaceMono-Regular',
    color: Colors.TEXT_WHITE,
  },
  selectedCurrency: {
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '400',
    color: Colors.TEXT_WHITE,
    marginTop: 4,
  },
  conversionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  conversionCard: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 77,
  },
  conversionIconWrapper: {
    marginRight: 16,
  },
  conversionInfo: {
    flex: 1,
  },
  conversionValue: {
    fontSize: 20,
    fontFamily: 'SpaceMono-Regular',
  },
  conversionCurrency: {
    fontSize: 12,
    fontFamily: 'System',
    fontWeight: '400',
    marginTop: 2,
  },
  numPadWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  numPadBlurContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 4,
    marginBottom: 4,
  },
  numPadInnerContainer: {
    padding: 4,
    borderRadius: 16,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 2,
    gap: 2,
  },
  inputFieldWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: ((width - 24) / 4) * 0.35,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    height: ((width - 24) / 4) * 0.7,
    fontSize: 24,
    fontFamily: 'SpaceMono-Regular',
    textAlign: 'center',
    borderRadius: ((width - 24) / 4) * 0.35,
  },
  clearButton: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    fontSize: 20,
    fontWeight: '400',
  },
  calculateButton: {
    width: (width - 24) / 4,
    height: ((width - 24) / 4) * 0.7,
    backgroundColor: '#E300FF',
    borderRadius: ((width - 24) / 4) * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#E300FF',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  numPadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    gap: 2,
  },
  numPadButton: {
    width: (width - 24) / 4,
    height: ((width - 24) / 4) * 0.7,
    borderRadius: ((width - 24) / 4) * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numPadText: {
    fontSize: 28,
    fontFamily: 'SpaceMono-Regular',
    fontWeight: '400',
  },
});