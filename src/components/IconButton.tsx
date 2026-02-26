import React, { ReactNode } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface IconButtonProps {
  onPress: () => void;
  icon: ReactNode;
  backgroundColor?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ onPress, icon, backgroundColor }) => {
  const theme = useTheme();
  const bgColor = backgroundColor || theme.colors.PRIMARY;

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
        {icon}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
