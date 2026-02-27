import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { CurrencyCard } from '../components/CurrencyCard';
import { Typography } from '../constants/typography';
import { CommonStyles } from '../constants/commonStyles';
import { RootStackParamList } from '../types';
import { SettingsIcon } from '../components/Icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { IconButton } from '../components/IconButton';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const theme = useTheme();
  const { 
    savedCurrencyCodes, 
    exchangeRates, 
    isLoading, 
    refreshRates,
    getCurrencyByCode,
    lastConversions,
    lastConversionBase 
  } = useCurrency();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshRates();
    setRefreshing(false);
  };

  useEffect(() => {
    // Initial load of exchange rates
    if (!exchangeRates) {
      refreshRates();
    }
  }, []);

  const handleCurrencyPress = (currencyCode: string) => {
    navigation.navigate('Calculate', { currencyCode });
  };

  const renderCurrency = ({ item }: { item: string}) => {
    const currency = getCurrencyByCode(item);
    const rate = exchangeRates?.rates[item] || 1;
    const lastConversion = lastConversions?.[item];
    
    if (!currency) return null;
    
    return (
      <CurrencyCard
        currency={currency}
        rate={rate}
        onPress={() => handleCurrencyPress(item)}
        isSelected={lastConversionBase?.currency === item}
        conversionValue={lastConversion}
      />
    );
  };

  if (isLoading && !exchangeRates) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.BACKGROUND }]}>
        <ActivityIndicator size="large" color={theme.colors.PRIMARY} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[CommonStyles.flexContainer, { backgroundColor: theme.colors.BACKGROUND }]}>
      <ScreenHeader
        subtitle="Home"
        actionButton={
          <IconButton
            onPress={() => navigation.navigate('EditList')}
            icon={<SettingsIcon width={24} height={24} fill={theme.colors.TEXT_WHITE} />}
          />
        }
      />
      
      <FlatList
        data={savedCurrencyCodes}
        renderItem={renderCurrency}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.PRIMARY}
          />
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.colors.TEXT_SECONDARY }]}>
            No currencies added. Tap settings to add currencies.
          </Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyText: {
    ...Typography.BODY,
    textAlign: 'center',
    marginTop: 50,
  },
});