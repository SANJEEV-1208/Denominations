import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CustomBlurView } from '../components/CustomBlurView';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { RootStackParamList, Currency } from '../types';
import { SaveIcon } from '../components/Icons';
// @ts-ignore
import SearchIcon from '../assets/search-Text-Feild.svg';

type EditListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditList'>;

export const EditListScreen: React.FC = () => {
  const navigation = useNavigation<EditListScreenNavigationProp>();
  const theme = useTheme();
  const {
    savedCurrencyCodes,
    allCurrencies,
    addCurrency,
    removeCurrency,
    reorderCurrencies,
    getCurrencyByCode,
  } = useCurrency();

  const [searchQuery, setSearchQuery] = useState('');
  const [localSavedCodes, setLocalSavedCodes] = useState(savedCurrencyCodes);

  // Filter currencies based on search
  const filteredCurrencies = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return allCurrencies.filter(
      currency =>
        currency.code.toLowerCase().includes(query) ||
        currency.name.toLowerCase().includes(query)
    );
  }, [searchQuery, allCurrencies]);

  // Separate saved and available currencies
  const savedCurrencies = useMemo(() => {
    return localSavedCodes
      .map(code => getCurrencyByCode(code))
      .filter((c): c is Currency => c !== undefined);
  }, [localSavedCodes, getCurrencyByCode]);

  const availableCurrencies = useMemo(() => {
    return filteredCurrencies.filter(
      currency => !localSavedCodes.includes(currency.code)
    );
  }, [filteredCurrencies, localSavedCodes]);

  const handleDonePress = async () => {
    await reorderCurrencies(localSavedCodes);
    navigation.goBack();
  };

  const handleToggleCurrency = async (code: string) => {
    if (localSavedCodes.includes(code)) {
      const newCodes = localSavedCodes.filter(c => c !== code);
      setLocalSavedCodes(newCodes);
      await removeCurrency(code);
    } else {
      const newCodes = [...localSavedCodes, code];
      setLocalSavedCodes(newCodes);
      await addCurrency(code);
    }
  };

  const renderSavedItem = ({ item, drag, isActive }: RenderItemParams<Currency>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          style={[styles.savedCurrencyCard, { backgroundColor: theme.colors.SELECTED_CARD_BG, borderColor: theme.colors.SELECTED_CARD_BORDER }, isActive && styles.dragging]}
          onLongPress={drag}
          onPress={() => handleToggleCurrency(item.code)}
          activeOpacity={0.7}
        >
          <View style={styles.currencyContent}>
            <View style={[styles.flagCircle, { backgroundColor: 'black' }]}>
              <Text style={styles.flag}>{item.flag}</Text>
            </View>
            <View style={styles.currencyInfo}>
              <Text style={[styles.currencyCode, { color: theme.colors.TEXT_PRIMARY }]}>{item.code}</Text>
              <Text style={[styles.currencyName, { color: theme.colors.TEXT_BODY }]}>
                {item.name} {item.symbol}
              </Text>
            </View>
          </View>
          <View style={styles.dragHandle}>
            <Text style={[styles.dragIcon, { color: theme.colors.TEXT_BODY }]}>≡</Text>
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  const renderAvailableItem = (currency: Currency) => {
    return (
      <TouchableOpacity
        key={currency.code}
        style={[styles.availableCurrencyCard, { backgroundColor: theme.colors.CARD_BACKGROUND }]}
        onPress={() => handleToggleCurrency(currency.code)}
        activeOpacity={0.7}
      >
        <View style={[styles.flagCircle, { backgroundColor: 'black' }]}>
          <Text style={styles.flag}>{currency.flag}</Text>
        </View>
        <View style={styles.currencyInfo}>
          <Text style={[styles.currencyCode, { color: theme.colors.TEXT_PRIMARY }]}>{currency.code}</Text>
          <Text style={[styles.currencyName, { color: theme.colors.TEXT_BODY }]}>
            {currency.name} {currency.symbol}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.BACKGROUND }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.spacer} />
            <View style={styles.headerRight}>
              <View style={styles.titleContainer}>
                <Text style={[styles.title, { color: theme.colors.TEXT_PRIMARY }]}>Denominations</Text>
                <Text style={[styles.subtitle, { color: theme.colors.TEXT_BODY }]}>Edit List</Text>
              </View>
              <TouchableOpacity onPress={handleDonePress} style={styles.doneButton}>
                <View style={[styles.doneIconContainer, { backgroundColor: theme.colors.PRIMARY }]}>
                  <SaveIcon width={18} height={18} fill={theme.colors.TEXT_WHITE} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {savedCurrencies.length > 0 ? (
              <DraggableFlatList
                data={savedCurrencies}
                renderItem={renderSavedItem}
                keyExtractor={(item) => item.code}
                onDragEnd={({ data }) => {
                  const newCodes = data.map(c => c.code);
                  setLocalSavedCodes(newCodes);
                }}
                scrollEnabled={true}
                activateOnLongPress={true}
                ListFooterComponent={
                  availableCurrencies.length > 0 ? (
                    <View style={styles.availableSection}>
                      {availableCurrencies.map(renderAvailableItem)}
                    </View>
                  ) : null
                }
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
              >
                {availableCurrencies.length > 0 && (
                  <View style={styles.availableSection}>
                    {availableCurrencies.map(renderAvailableItem)}
                  </View>
                )}
              </ScrollView>
            )}
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            {Platform.OS === 'android' ? (
              <View style={[styles.searchBar, styles.androidSearchBar]}>
                <TextInput
                  style={[styles.searchInput, { color: theme.colors.TEXT_PRIMARY }]}
                  placeholder="Search"
                  placeholderTextColor="#757575"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <TouchableOpacity style={styles.searchIconButton}>
                  <SearchIcon width={20} height={20} stroke="#757575" />
                </TouchableOpacity>
              </View>
            ) : (
              <CustomBlurView intensity={80} tint="light" style={styles.searchBar}>
                <TextInput
                  style={[styles.searchInput, { color: theme.colors.TEXT_PRIMARY }]}
                  placeholder="Search"
                  placeholderTextColor="#757575"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <TouchableOpacity style={styles.searchIconButton}>
                  <SearchIcon width={20} height={20} stroke="#757575" />
                </TouchableOpacity>
              </CustomBlurView>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  gestureContainer: {
    flex: 1,
  },
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
  doneButton: {
    padding: 8,
  },
  doneIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor set dynamically
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  savedSection: {
    marginTop: 20,
  },
  availableSection: {
    marginTop: 20,
  },
  savedCurrencyCard: {
    // backgroundColor and borderColor set dynamically
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 77,
  },
  dragging: {
    opacity: 0.9,
    transform: [{ scale: 1.02 }],
  },
  availableCurrencyCard: {
    // backgroundColor set dynamically
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 77,
  },
  currencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    // backgroundColor set dynamically
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  flag: {
    fontSize: 35,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
  },
  currencyName: {
    fontSize: 12,
    marginTop: 2,
  },
  dragHandle: {
    padding: 8,
  },
  dragIcon: {
    fontSize: 20,
  },
  searchContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 0 : 30,
    left: '10%',
    right: '10%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 42,
    paddingHorizontal: 20,
    height: 84,
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
      default: {
        borderWidth: 1,
        borderColor: 'rgba(117, 117, 117, 0.8)',
      },
    }),
  },
  androidSearchBar: {
    backgroundColor: '#1c1c1d',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'System',
    textAlign: 'left',
  },
  searchIconButton: {
    padding: 5,
  },
});