import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CustomBlurView } from '../components/CustomBlurView';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { RootStackParamList } from '../types';
import { CloseIcon, AddIcon } from '../components/Icons';
import { CurrencyIcon } from '../components/CurrencyIcon';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const theme = useTheme();
  const { savedCurrencyCodes, getCurrencyByCode } = useCurrency();

  const handleAddPress = () => {
    navigation.navigate('EditList');
  };

  const handleClosePress = () => {
    navigation.goBack();
  };

  const addButtonContent = Platform.select({
  web: (
    <TouchableOpacity
      style={[styles.addButton, styles.webAddButton]}
      onPress={handleAddPress}
      activeOpacity={0.8}
    >
      <AddIcon width={24} height={24} fill={Colors.TEXT_WHITE} />
      <Text style={styles.addButtonText}>Add Currency</Text>
    </TouchableOpacity>
  ),
  default: (
    <CustomBlurView intensity={80} tint="light" style={styles.addButtonBlur}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddPress}
        activeOpacity={0.8}
      >
        <AddIcon width={24} height={24} fill={theme.colors.PRIMARY} />
        <Text style={[styles.addButtonText, { color: theme.colors.PRIMARY }]}>
          Add Currency
        </Text>
      </TouchableOpacity>
    </CustomBlurView>
  ),
});

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.BACKGROUND }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.spacer} />
        <View style={styles.headerRight}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.TEXT_PRIMARY }]}>Denominations</Text>
            <Text style={[styles.subtitle, { color: theme.colors.TEXT_BODY }]}>Settings</Text>
          </View>
          <TouchableOpacity onPress={handleClosePress} style={styles.closeButton}>
            <View style={[styles.closeIconContainer, { backgroundColor: theme.colors.PRIMARY }]}>
              <CloseIcon width={18} height={18} fill={theme.colors.TEXT_WHITE} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.TEXT_PRIMARY }]}>
          Selected Currencies
        </Text>
        
        {savedCurrencyCodes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.colors.TEXT_BODY }]}>
              No currencies selected
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.TEXT_BODY }]}>
              Tap the button below to add currencies
            </Text>
          </View>
        ) : (
          <View style={styles.currencyList}>
            {savedCurrencyCodes.map((code) => {
              const currency = getCurrencyByCode(code);
              if (!currency) return null;
              
              return (
                <View
                  key={code}
                  style={[
                    styles.currencyItem,
                    { backgroundColor: theme.colors.CARD_BACKGROUND }
                  ]}
                >
                  <CurrencyIcon currency={currency} size={50} backgroundColor={theme.dark ? "black" : "white"} />
                  <View style={styles.currencyInfo}>
                    <Text style={[styles.currencyCode, { color: theme.colors.TEXT_PRIMARY }]}>
                      {currency.code}
                    </Text>
                    <Text style={[styles.currencyName, { color: theme.colors.TEXT_BODY }]}>
                      {currency.name} {currency.symbol}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Add Button */}
      <View style={styles.addButtonContainer}>
  {Platform.select({
    android: (
      <TouchableOpacity
        style={[styles.addButton, styles.androidAddButton]}
        onPress={handleAddPress}
        activeOpacity={0.8}
      >
        <AddIcon width={24} height={24} fill={Colors.TEXT_WHITE} />
        <Text style={styles.addButtonText}>Add Currency</Text>
      </TouchableOpacity>
    ),
    ios: (
      <CustomBlurView intensity={80} tint="light" style={styles.addButtonBlur}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddPress}
          activeOpacity={0.8}
        >
          <AddIcon width={24} height={24} fill={theme.colors.PRIMARY} />
          <Text style={[styles.addButtonText, { color: theme.colors.PRIMARY }]}>
            Add Currency
          </Text>
        </TouchableOpacity>
      </CustomBlurView>
    ),
    web: (
      <TouchableOpacity
        style={[styles.addButton, styles.webAddButton]}
        onPress={handleAddPress}
        activeOpacity={0.8}
      >
        <AddIcon width={24} height={24} fill={Colors.TEXT_WHITE} />
        <Text style={styles.addButtonText}>Add Currency</Text>
      </TouchableOpacity>
    ),
  })}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
  },
  currencyList: {
    gap: 12,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    minHeight: 70,
  },
  currencyInfo: {
    flex: 1,
    marginLeft: 16,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  currencyName: {
    fontSize: 14,
    opacity: 0.8,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: Platform.select({
      ios: 30,
      android: 30,
      web: 30,
      default: 30,
    }),
    left: 20,
    right: 20,
  },
  addButtonBlur: {
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(117, 117, 117, 0.8)',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
  },
  androidAddButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 30,
  },
  webAddButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 30,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.TEXT_WHITE,
  },
});