import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../constants/typography';
import { CommonStyles } from '../constants/commonStyles';
import { RootStackParamList, Currency } from '../types';
import { SaveIcon } from '../components/Icons';
import { SearchBar } from '../components/SearchBar';
import { ScreenHeader } from '../components/ScreenHeader';
import { IconButton } from '../components/IconButton';
import { CurrencyListItem } from '../components/CurrencyListItem';
import { useKeyboardAnimation } from '../hooks/useKeyboardAnimation';
import { CURRENCIES } from '../constants/currencies';

type EditListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditList'>;

export const EditListScreen: React.FC = () => {
  const navigation = useNavigation<EditListScreenNavigationProp>();
  const theme = useTheme();
  const {
    savedCurrencyCodes,
    addCurrency,
    removeCurrency,
    reorderCurrencies,
    getCurrencyByCode,
  } = useCurrency();

  const [searchQuery, setSearchQuery] = useState('');
  const [localSavedCodes, setLocalSavedCodes] = useState(savedCurrencyCodes);
  const keyboardHeight = useKeyboardAnimation();

  const getSearchContainerBottom = () => {
    if (Platform.OS === 'ios') return keyboardHeight;
    if (Platform.OS === 'web') return 20;
    return 30;
  };

  const filteredCurrencies = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return CURRENCIES.filter(currency => {
      const codeMatch = currency.code.toLowerCase().includes(query);
      const nameMatch = currency.name.toLowerCase().includes(query);
      const countryMatch = currency.country ? currency.country.toLowerCase().includes(query) : false;
      return codeMatch || nameMatch || countryMatch;
    });
  }, [searchQuery]);

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
          style={[
            styles.savedCurrencyCard,
            { backgroundColor: theme.colors.SELECTED_CARD_BG, borderColor: theme.colors.SELECTED_CARD_BORDER },
            isActive && styles.dragging
          ]}
          onLongPress={drag}
          onPress={() => handleToggleCurrency(item.code)}
          activeOpacity={0.7}
        >
          <View style={styles.currencyContent}>
            <CurrencyListItem currency={item} iconSize={70} />
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
        <CurrencyListItem currency={currency} iconSize={70} />
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    const shouldShowDraggableList = savedCurrencies.length > 0 && !searchQuery;

    if (shouldShowDraggableList) {
      return (
        <DraggableFlatList
          data={savedCurrencies}
          renderItem={renderSavedItem}
          keyExtractor={(item) => item.code}
          onDragEnd={({ data }) => {
            const newCodes = data.map(c => c.code);
            setLocalSavedCodes(newCodes);
          }}
          scrollEnabled={true}
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
      );
    }

    return (
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
    );
  };

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <SafeAreaView style={[CommonStyles.flexContainer, { backgroundColor: theme.colors.BACKGROUND }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={CommonStyles.flexContainer}
        >
          {/* Header */}
          <ScreenHeader
            subtitle="Edit List"
            actionButton={
              <IconButton
                onPress={handleDonePress}
                icon={<SaveIcon width={18} height={18} fill={theme.colors.TEXT_WHITE} />}
              />
            }
          />

          {/* Content */}
          <View style={styles.content}>
            {renderContent()}
          </View>

          {/* Search Bar */}
          <Animated.View style={[
            styles.searchContainer,
            {
              bottom: getSearchContainerBottom()
            }
          ]}>
            <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  gestureContainer: {
    flex: 1,
    ...Platform.select({
      web: {
        height: '100vh',
        overflow: 'hidden',
      } as any,
      default: {}
    }),
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    ...Platform.select({
      web: {
        overflow: 'auto',
        maxHeight: 'calc(100vh - 200px)',
      } as any,
      default: {}
    }),
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'web' ? 150 : 100,
  },
  availableSection: {
    marginTop: 20,
  },
  savedCurrencyCard: {
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
  dragHandle: {
    padding: 8,
  },
  dragIcon: {
    fontSize: 20,
  },
  searchContainer: {
    position: Platform.OS === 'web' ? 'fixed' as any : 'absolute',
    left: '10%',
    right: '10%',
    zIndex: Platform.OS === 'web' ? 999 : 10,
  },
});
