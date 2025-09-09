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
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { RootStackParamList, Currency } from '../types';
import { SaveIcon } from '../components/Icons';
// @ts-ignore
import SearchIcon from '../assets/search-Text-Feild.svg';

type EditListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditList'>;

export const EditListScreen: React.FC = () => {
  const navigation = useNavigation<EditListScreenNavigationProp>();
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
          style={[styles.savedCurrencyCard, isActive && styles.dragging]}
          onLongPress={drag}
          onPress={() => handleToggleCurrency(item.code)}
          activeOpacity={0.7}
        >
          <View style={styles.currencyContent}>
            <View style={styles.flagCircle}>
              <Text style={styles.flag}>{item.flag}</Text>
            </View>
            <View style={styles.currencyInfo}>
              <Text style={styles.currencyCode}>{item.code}</Text>
              <Text style={styles.currencyName}>
                {item.name} {item.symbol}
              </Text>
            </View>
          </View>
          <View style={styles.dragHandle}>
            <Text style={styles.dragIcon}>≡</Text>
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  const renderAvailableItem = (currency: Currency) => {
    return (
      <TouchableOpacity
        key={currency.code}
        style={styles.availableCurrencyCard}
        onPress={() => handleToggleCurrency(currency.code)}
        activeOpacity={0.7}
      >
        <View style={styles.flagCircle}>
          <Text style={styles.flag}>{currency.flag}</Text>
        </View>
        <View style={styles.currencyInfo}>
          <Text style={styles.currencyCode}>{currency.code}</Text>
          <Text style={styles.currencyName}>
            {currency.name} {currency.symbol}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.spacer} />
            <View style={styles.headerRight}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Denominations</Text>
                <Text style={styles.subtitle}>Edit List</Text>
              </View>
              <TouchableOpacity onPress={handleDonePress} style={styles.doneButton}>
                <View style={styles.doneIconContainer}>
                  <SaveIcon width={18} height={18} fill={Colors.TEXT_WHITE} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            {/* Saved Currencies */}
            {savedCurrencies.length > 0 && (
              <View style={styles.savedSection}>
                <DraggableFlatList
                  data={savedCurrencies}
                  renderItem={renderSavedItem}
                  keyExtractor={(item) => item.code}
                  onDragEnd={({ data }) => {
                    const newCodes = data.map(c => c.code);
                    setLocalSavedCodes(newCodes);
                  }}
                  scrollEnabled={false}
                />
              </View>
            )}

            {/* Available Currencies */}
            {availableCurrencies.length > 0 && (
              <View style={styles.availableSection}>
                {availableCurrencies.map(renderAvailableItem)}
              </View>
            )}
          </ScrollView>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <CustomBlurView intensity={80} tint="light" style={styles.searchBar}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor="#757575"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity style={styles.searchIconButton}>
                <SearchIcon width={20} height={20} stroke="#757575" />
              </TouchableOpacity>
            </CustomBlurView>
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
    backgroundColor: Colors.BACKGROUND,
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
    backgroundColor: Colors.PRIMARY,
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
    backgroundColor: Colors.SELECTED_CARD_BG,
    borderWidth: 2,
    borderColor: Colors.SELECTED_CARD_BORDER,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 96,
  },
  dragging: {
    opacity: 0.9,
    transform: [{ scale: 1.02 }],
  },
  availableCurrencyCard: {
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 96,
  },
  currencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  flag: {
    fontSize: 44,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  currencyName: {
    fontSize: 12,
    color: Colors.TEXT_BODY,
    marginTop: 2,
  },
  dragHandle: {
    padding: 8,
  },
  dragIcon: {
    fontSize: 20,
    color: Colors.TEXT_BODY,
  },
  searchContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 15 : 30,
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'System',
    color: Colors.TEXT_PRIMARY,
    textAlign: 'left',
  },
  searchIconButton: {
    padding: 5,
  },
});