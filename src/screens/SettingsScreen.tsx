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
import { CommonStyles } from '../constants/commonStyles';
import { RootStackParamList } from '../types';
import { CloseIcon, AddIcon } from '../components/Icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { IconButton } from '../components/IconButton';
import { CurrencyListItem } from '../components/CurrencyListItem';

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

  return (
    <SafeAreaView style={[CommonStyles.flexContainer, { backgroundColor: theme.colors.BACKGROUND }]}>
      <ScreenHeader
        subtitle="Settings"
        actionButton={
          <IconButton
            onPress={handleClosePress}
            icon={<CloseIcon width={18} height={18} fill={theme.colors.TEXT_WHITE} />}
          />
        }
      />

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
                  <CurrencyListItem currency={currency} iconSize={50} />
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