import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { CustomBlurView } from './CustomBlurView';
import { useTheme } from '../context/ThemeContext';

// @ts-ignore
import SearchIcon from '../assets/search-Text-Feild.svg';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
  const theme = useTheme();

  const renderSearchInput = () => (
    <>
      <TextInput
        style={[styles.searchInput, { color: '#757575' }]}
        placeholder="Search"
        placeholderTextColor="#757575"
        value={searchQuery}
        onChangeText={onSearchChange}
      />
      <TouchableOpacity style={styles.searchIconButton}>
        <SearchIcon width={20} height={20} stroke="#757575" />
      </TouchableOpacity>
    </>
  );

  const getSearchBarStyle = () => {
    if (Platform.OS === 'android') {
      return [styles.searchBar, theme.dark ? styles.androidSearchBar : styles.lightSearchBar];
    }
    if (Platform.OS === 'web') {
      return [styles.searchBar, theme.dark ? styles.webSearchBar : styles.lightSearchBar];
    }
    return [styles.searchBar, styles.lightSearchBar];
  };

  if (Platform.OS === 'ios' && theme.dark) {
    return (
      <CustomBlurView intensity={80} tint="light" style={styles.searchBar}>
        {renderSearchInput()}
      </CustomBlurView>
    );
  }

  return (
    <View style={getSearchBarStyle()}>
      {renderSearchInput()}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 32,
    paddingHorizontal: 20,
    height: 63,
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
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      } as any,
      default: {
        borderWidth: 1,
        borderColor: 'rgba(117, 117, 117, 0.8)',
      },
    }),
  },
  androidSearchBar: {
    backgroundColor: '#1c1c1d',
  },
  webSearchBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  lightSearchBar: {
    backgroundColor: 'white',
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
