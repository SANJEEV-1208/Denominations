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
  Platform,
} from 'react-native';
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
// @ts-ignore
import ClearIcon from '../assets/Clear-Text-Feild.svg';
// @ts-ignore
import CalculateIcon from '../assets/Calculate.svg';

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
  
  const [inputValue, setInputValue] = useState('1');
  const [conversions, setConversions] = useState<{ [key: string]: number }>({});
  
  const selectedCurrency = getCurrencyByCode(currencyCode);

  // Immediate conversion calculation (for button press)
  const calculateConversionsImmediate = (value: string) => {
    const amount = parseFloat(value) || 0;
    if (amount === 0 || !exchangeRates) {
      setConversions({});
      setLastConversions({}, currencyCode, 0);
      return;
    }

    const newConversions: { [key: string]: number } = {};
    
    // Also include the base currency with its original amount
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
    
    setConversions(newConversions);
    // Store in context for display on home screen
    setLastConversions(newConversions, currencyCode, amount);
  };

  // Remove automatic conversion - only calculate on button press

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
    // Trigger immediate recalculation without debounce
    calculateConversionsImmediate(inputValue);
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
                colors={['#D976CA', '#E300FF']}
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
            </LinearGradient>

            {/* Other Currency Cards */}
            {savedCurrencyCodes
              .filter(code => code !== currencyCode)
              .map(code => {
                const currency = getCurrencyByCode(code);
                const value = conversions[code] || 0;
                
                return (
                  <View key={code} style={[styles.conversionCard, { backgroundColor: theme.colors.CARD_BACKGROUND }]}>
                    <View style={styles.conversionFlagContainer}>
                      <Text style={styles.conversionFlag}>{currency?.flag}</Text>
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

        {/* Input Field and Calculate Button */}
        <View style={styles.inputContainer}>
          {Platform.OS === 'android' ? (
            <View style={[styles.inputWrapper, styles.androidInputWrapper]}>
              <TextInput
                style={[styles.input, { color: theme.colors.TEXT_PRIMARY }]}
                value={inputValue}
                onChangeText={setInputValue}
                keyboardType="numeric"
                editable={false}
                placeholder="0"
              />
              <TouchableOpacity onPress={handleClearPress} style={styles.clearButton}>
                <Text style={[styles.clearText, { color: theme.colors.TEXT_BODY }]}>×</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <CustomBlurView intensity={80} tint="light" style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { color: theme.colors.TEXT_PRIMARY }]}
                value={inputValue}
                onChangeText={setInputValue}
                keyboardType="numeric"
                editable={false}
                placeholder="0"
              />
              <TouchableOpacity onPress={handleClearPress} style={styles.clearButton}>
                {Platform.OS === 'web' ? (
                  <ClearIcon width={20} height={20} fill={theme.colors.TEXT_BODY} />
                ) : (
                  <Text style={[styles.clearText, { color: theme.colors.TEXT_BODY }]}>×</Text>
                )}
              </TouchableOpacity>
            </CustomBlurView>
          )}
          <BlurView 
            intensity={20} 
            tint="light" 
            style={styles.calculateButtonWrapper}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.calculateButtonGradient}
            >
              <TouchableOpacity 
                style={styles.calculateButton}
                onPress={handleCalculatePress}
              >
                <CalculateIcon width={24} height={24} />
              </TouchableOpacity>
            </LinearGradient>
          </BlurView>
        </View>

        {/* Number Pad */}
        <View style={styles.numPadWrapper}>
          <CustomBlurView intensity={80} tint="light" style={styles.numPadContainer}>
              <View style={styles.numPadRow}>
                <View style={styles.numPadButtonWrapper}>
                  <TouchableOpacity style={styles.numPadButton} onPress={() => handleNumberPress('1')}>
                    <Text style={[styles.numPadText, { color: theme.colors.TEXT_PRIMARY }]}>1</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.numPadButtonWrapper}>
                  <TouchableOpacity style={styles.numPadButton} onPress={() => handleNumberPress('2')}>
                    <Text style={[styles.numPadText, { color: theme.colors.TEXT_PRIMARY }]}>2</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.numPadButtonWrapper}>
                  <TouchableOpacity style={styles.numPadButton} onPress={() => handleNumberPress('3')}>
                    <Text style={[styles.numPadText, { color: theme.colors.TEXT_PRIMARY }]}>3</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.numPadRow}>
                <View style={styles.numPadButtonWrapper}>
                  <TouchableOpacity style={styles.numPadButton} onPress={() => handleNumberPress('4')}>
                    <Text style={[styles.numPadText, { color: theme.colors.TEXT_PRIMARY }]}>4</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.numPadButtonWrapper}>
                  <TouchableOpacity style={styles.numPadButton} onPress={() => handleNumberPress('5')}>
                    <Text style={[styles.numPadText, { color: theme.colors.TEXT_PRIMARY }]}>5</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.numPadButtonWrapper}>
                  <TouchableOpacity style={styles.numPadButton} onPress={() => handleNumberPress('6')}>
                    <Text style={[styles.numPadText, { color: theme.colors.TEXT_PRIMARY }]}>6</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.numPadRow}>
                <View style={styles.numPadButtonWrapper}>
                  <TouchableOpacity style={styles.numPadButton} onPress={() => handleNumberPress('7')}>
                    <Text style={[styles.numPadText, { color: theme.colors.TEXT_PRIMARY }]}>7</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.numPadButtonWrapper}>
                  <TouchableOpacity style={styles.numPadButton} onPress={() => handleNumberPress('8')}>
                    <Text style={[styles.numPadText, { color: theme.colors.TEXT_PRIMARY }]}>8</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.numPadButtonWrapper}>
                  <TouchableOpacity style={styles.numPadButton} onPress={() => handleNumberPress('9')}>
                    <Text style={[styles.numPadText, { color: theme.colors.TEXT_PRIMARY }]}>9</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.numPadRow}>
                <View style={styles.numPadButtonWrapper}>
                  <TouchableOpacity style={styles.numPadButton} onPress={handleDecimalPress}>
                    <Text style={[styles.numPadText, { color: theme.colors.TEXT_PRIMARY }]}>.</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.numPadButtonWrapper}>
                  <TouchableOpacity style={styles.numPadButton} onPress={() => handleNumberPress('0')}>
                    <Text style={[styles.numPadText, { color: theme.colors.TEXT_PRIMARY }]}>0</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.numPadButtonWrapper}>
                  <TouchableOpacity style={styles.numPadButton} onPress={handleBackspacePress}>
                    <Text style={[styles.numPadText, { color: theme.colors.TEXT_PRIMARY }]}>{'<'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
          </CustomBlurView>
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
    bottom: Platform.OS === 'web' ? 460 : 430,
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
  flagContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#E300FF',
  },
  selectedFlag: {
    fontSize: 35,
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
  conversionFlagContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  conversionFlag: {
    fontSize: 35,
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
  inputContainer: {
    position: 'absolute',
    bottom: Platform.select({
      ios: 360,
      android: 390,
      web: 350,
      default: 390,
    }),
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    marginBottom: Platform.OS === 'web' ? 10 : 0,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: Platform.OS === 'web' ? 40 : 34,
    paddingHorizontal: Platform.OS === 'web' ? 30 : 20,
    height: Platform.OS === 'web' ? 80 : 67,
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        borderWidth: 1,
        borderColor: 'rgba(117, 117, 117, 0.8)',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        borderWidth: 1,
        borderColor: 'rgba(117, 117, 117, 0.8)',
        elevation: 4,
      },
      web: {
        borderWidth: 1,
        borderColor: 'rgba(117, 117, 117, 0.8)',
        height: 80,
        borderRadius: 40,
        paddingHorizontal: 30,
        position: 'relative',
      },
      default: {
        borderWidth: 1,
        borderColor: 'rgba(117, 117, 117, 0.8)',
      },
    }),
  },
  androidInputWrapper: {
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'SpaceMono-Regular',
    textAlign: 'center',
    minWidth: Platform.OS === 'web' ? 100 : undefined,
    paddingRight: Platform.OS === 'web' ? 40 : 0,
  },
  clearButton: {
    position: Platform.OS === 'web' ? 'absolute' : 'relative',
    right: Platform.OS === 'web' ? 20 : undefined,
    padding: Platform.OS === 'web' ? 8 : 5,
    paddingHorizontal: Platform.OS === 'web' ? 8 : 5,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    fontSize: Platform.OS === 'web' ? 28 : 24,
    fontWeight: Platform.OS === 'web' ? 'bold' : 'normal',
  },
  calculateButtonWrapper: {
    width: Platform.OS === 'web' ? 104 : 90,
    height: Platform.OS === 'web' ? 80 : 67,
    borderRadius: Platform.OS === 'web' ? 40 : 34,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#E300FF',
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.5,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: '#E300FF',
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.5,
        shadowRadius: 16,
      },
    }),
  },
  calculateButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: Platform.OS === 'web' ? 40 : 34,
    ...Platform.select({
      ios: {
        // No border on iOS to avoid jagged edges
        overflow: 'hidden',
      },
      android: {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        overflow: 'hidden',
      },
      web: {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        overflow: 'hidden',
      },
    }),
  },
  calculateButton: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(227, 0, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        // Smoother rendering on iOS
      },
      web: {
        backdropFilter: 'blur(20px)',
      },
    }),
  },
  numPadWrapper: {
    position: 'absolute',
    bottom: Platform.select({
      ios: 0,
      android: 20,
      web: 20,
      default: 20,
    }),
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'web' ? 10 : 15,
    paddingHorizontal: 15,
    paddingBottom: Platform.select({
      ios: 0,
      android: 15,
      web: 20,
      default: 15,
    }),
  },
  numPadContainer: {
    borderRadius: 20,
    paddingVertical: Platform.OS === 'web' ? 12 : 15,
    paddingHorizontal: 10,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        borderWidth: 1,
        borderColor: 'rgba(117, 117, 117, 0.8)',
      },
      android: {
        borderWidth: 1,
        borderColor: 'rgba(117, 117, 117, 0.8)',
      },
      web: {
        borderWidth: 1,
        borderColor: 'rgba(117, 117, 117, 0.8)',
      },
      default: {
        borderWidth: 1,
        borderColor: 'rgba(117, 117, 117, 0.8)',
      },
    }),
  },
  numPadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Platform.OS === 'web' ? 10 : 12,
  },
  numPadButtonWrapper: {
    width: width * 0.25,
    height: Platform.OS === 'web' ? 60 : 65,
    borderRadius: Platform.OS === 'web' ? 30 : 33,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      web: {
        // @ts-ignore
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  numPadButton: {
    width: '100%',
    height: '100%',
    borderRadius: Platform.OS === 'web' ? 30 : 33,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android: {
        elevation: 5,
      },
    }),
  },
  numPadText: {
    fontSize: Platform.OS === 'web' ? 26 : 28,
    fontFamily: 'SpaceMono-Regular',
    fontWeight: '100',
  },
});