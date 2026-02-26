import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../constants/typography';

interface ScreenHeaderProps {
  subtitle: string;
  actionButton?: ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ subtitle, actionButton }) => {
  const theme = useTheme();

  return (
    <View style={styles.header}>
      <View style={styles.spacer} />
      <View style={styles.headerRight}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.TEXT_PRIMARY }]}>Denominations</Text>
          <Text style={[styles.subtitle, { color: theme.colors.TEXT_BODY }]}>{subtitle}</Text>
        </View>
        {actionButton}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
