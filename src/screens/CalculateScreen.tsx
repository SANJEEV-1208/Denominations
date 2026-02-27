import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { CurrencyAPI } from '../services/api/currencyAPI';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { CommonStyles } from '../constants/commonStyles';
import { RootStackParamList } from '../types';
import { CloseIcon } from '../components/Icons';
import { CurrencyIcon } from '../components/CurrencyIcon';
import { CalculatorNumberPad } from '../components/CalculatorNumberPad';
import { ScreenHeader } from '../components/ScreenHeader';
import { IconButton } from '../components/IconButton';
import { CurrencyListItem } from '../components/CurrencyListItem';
import { useCalculator } from '../hooks/useCalculator';
import { useCurrencyConversion } from '../hooks/useCurrencyConversion';

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

  const calculator = useCalculator();
  const selectedCurrency = getCurrencyByCode(currencyCode);

  const { computedConversions, createConversions } = useCurrencyConversion(
    calculator.effectiveValue,
    currencyCode,
    savedCurrencyCodes,
    exchangeRates
  );

  const handleCalculatePress = () => {
    const finalValue = calculator.completePendingCalculation();
    const conversions = createConversions(finalValue);
    const amount = Number.parseFloat(finalValue) || 0;
    setLastConversions(conversions, currencyCode, amount);
    navigation.goBack();
  };

  const formatValue = (value: number): string => {
    return CurrencyAPI.formatCurrency(value);
  };

  return (
    <SafeAreaView style={[CommonStyles.flexContainer, { backgroundColor: theme.colors.BACKGROUND }]}>
      <ScreenHeader
        subtitle="Calculate"
        actionButton={
          <IconButton
            onPress={() => navigation.goBack()}
            icon={<CloseIcon width={18} height={18} fill={theme.colors.TEXT_WHITE} />}
          />
        }
      />

      <View style={styles.contentContainer}>
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
                    <Text style={styles.selectedAmount}>{calculator.effectiveValue}</Text>
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
                    {currency && <CurrencyListItem currency={currency} iconSize={70} showSymbol={false} />}
                    <Text style={[styles.conversionValue, { color: theme.colors.TEXT_PRIMARY }]}>
                      {value > 0 ? formatValue(value) : '—'}
                    </Text>
                  </View>
                );
              })}
          </View>
        </ScrollView>

        <CalculatorNumberPad
          displayExpression={calculator.displayExpression}
          onNumberPress={calculator.handleNumberPress}
          onDecimalPress={calculator.handleDecimalPress}
          onBackspacePress={calculator.handleBackspacePress}
          onClearPress={calculator.handleClearPress}
          onOperatorPress={calculator.handleOperatorPress}
          onCalculatePress={handleCalculatePress}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    bottom: ((width - 24) / 4) * 0.7 * 5 + 20,
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
  conversionValue: {
    fontSize: 20,
    fontFamily: 'SpaceMono-Regular',
    marginLeft: 'auto',
  },
});
