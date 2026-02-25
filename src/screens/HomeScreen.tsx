import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { CurrencyCard } from '../components/CurrencyCard';
import { Typography } from '../constants/typography';
import { RootStackParamList } from '../types';
import { SettingsIcon } from '../components/Icons';

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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.BACKGROUND }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.BACKGROUND }]}>
        <View style={styles.spacer} />
        <View style={styles.headerRight}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.TEXT_PRIMARY }]}>Denominations</Text>
            <Text style={[styles.subtitle, { color: theme.colors.TEXT_BODY }]}>Home</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EditList')} style={styles.settingsButton}>
            <View style={[styles.settingsIconContainer, { backgroundColor: theme.colors.PRIMARY }]}>
              <SettingsIcon width={24} height={24} fill={theme.colors.TEXT_WHITE} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
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
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  settingsButton: {
    padding: 8,
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
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