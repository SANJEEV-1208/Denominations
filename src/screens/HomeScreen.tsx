import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencyCard } from '../components/CurrencyCard';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { RootStackParamList } from '../types';
import { SettingsIcon } from '../components/Icons';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { 
    savedCurrencyCodes, 
    exchangeRates, 
    isLoading, 
    refreshRates,
    getCurrencyByCode 
  } = useCurrency();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshRates();
    setRefreshing(false);
  };

  const handleCurrencyPress = (currencyCode: string) => {
    navigation.navigate('Calculate', { currencyCode });
  };

  const handleSettingsPress = () => {
    navigation.navigate('EditList');
  };

  const renderCurrency = ({ item }: { item: string }) => {
    const currency = getCurrencyByCode(item);
    if (!currency) return null;

    const rate = exchangeRates?.rates[item] || 1;
    
    return (
      <CurrencyCard
        currency={currency}
        rate={rate}
        onPress={() => handleCurrencyPress(item)}
      />
    );
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.spacer} />
        <View style={styles.headerRight}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Denominations</Text>
            <Text style={styles.subtitle}>Saved List</Text>
          </View>
          <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsButton}>
            <View style={styles.settingsIconContainer}>
              <SettingsIcon width={24} height={24} fill={Colors.TEXT_WHITE} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {savedCurrencyCodes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No currencies saved</Text>
          <Text style={styles.emptySubtext}>
            Tap the settings icon to add currencies
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedCurrencyCodes}
          renderItem={renderCurrency}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.PRIMARY}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-Bold',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    color: Colors.TEXT_BODY,
    textAlign: 'center',
  },
});